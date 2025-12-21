import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '../lib/api'
import { LoginRequest, LoginResponse, BuyerSignupRequest, SellerSignupRequest } from '../types'
import toast from 'react-hot-toast'

interface AuthState {
  token: string | null
  user: {
    id: number
    name: string
    email: string
    role: 'ADMIN' | 'BUYER' | 'SELLER'
  } | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: LoginRequest) => Promise<boolean>
  logout: () => void
  signupBuyer: (data: BuyerSignupRequest) => Promise<boolean>
  signupSeller: (data: SellerSignupRequest) => Promise<boolean>
  initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (credentials: LoginRequest) => {
        set({ isLoading: true })
        try {
          const response = await api.post<LoginResponse>('/auth/login', credentials)
          const { token, role, name, id } = response.data
          
          // For sellers, check approval status by fetching seller profile
          if (role === 'SELLER') {
            try {
              const sellerResponse = await api.get(`/seller/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
              })
              const approvalStatus = sellerResponse.data.adminApprovalStatus
              
              if (approvalStatus === 'PENDING') {
                set({ isLoading: false })
                toast.error('Your seller account is pending admin approval. Please wait for approval.')
                return false
              } else if (approvalStatus === 'REJECTED') {
                set({ isLoading: false })
                toast.error('Your seller account has been rejected. Please contact support.')
                return false
              }
            } catch (error) {
              console.error('Error checking seller approval:', error)
            }
          }
          
          const user = {
            id,
            name,
            email: credentials.email,
            role: role as 'ADMIN' | 'BUYER' | 'SELLER'
          }
          
          set({ token, user, isAuthenticated: true, isLoading: false })
          toast.success(`Welcome back, ${name}!`)
          return true
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data || 'Login failed'
          toast.error(message)
          return false
        }
      },

      logout: () => {
        set({ token: null, user: null, isAuthenticated: false })
        toast.success('Logged out successfully')
      },

      signupBuyer: async (data: BuyerSignupRequest) => {
        set({ isLoading: true })
        try {
          await api.post('/auth/signup/buyer', data)
          set({ isLoading: false })
          toast.success('Account created successfully! Please login.')
          return true
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data || 'Signup failed'
          toast.error(message)
          return false
        }
      },

      signupSeller: async (data: SellerSignupRequest) => {
        set({ isLoading: true })
        try {
          await api.post('/auth/signup/seller', data)
          set({ isLoading: false })
          toast.success('Seller account created! Please wait for admin approval.')
          return true
        } catch (error: any) {
          set({ isLoading: false })
          const message = error.response?.data || 'Signup failed'
          toast.error(message)
          return false
        }
      },

      initializeAuth: () => {
        const state = get()
        if (state.token && state.user) {
          // Token exists, user is logged in
          set({ isAuthenticated: true })
          return
        }
        // No token or user, not authenticated
        set({ isAuthenticated: false })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        token: state.token, 
        user: state.user,
        isAuthenticated: state.isAuthenticated
      }),
    }
  )
)