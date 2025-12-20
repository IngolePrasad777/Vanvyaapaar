import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '../types'
import { buyerService } from '../services/buyerService'
import toast from 'react-hot-toast'

interface WishlistState {
  items: Product[]
  isLoading: boolean
  fetchWishlist: (buyerId: number) => Promise<void>
  addToWishlist: (buyerId: number, productId: number) => Promise<boolean>
  removeFromWishlist: (buyerId: number, productId: number) => Promise<boolean>
  isInWishlist: (productId: number) => boolean
  clearWishlist: () => void
  getWishlistCount: () => number
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      isLoading: false,

      fetchWishlist: async (buyerId: number) => {
        set({ isLoading: true })
        try {
          const items = await buyerService.getWishlist(buyerId)
          set({ items, isLoading: false })
        } catch (error) {
          console.error('Error fetching wishlist:', error)
          set({ isLoading: false })
        }
      },

      addToWishlist: async (buyerId: number, productId: number) => {
        set({ isLoading: true })
        try {
          const product = await buyerService.addToWishlist(buyerId, productId)
          const currentItems = get().items
          
          // Check if already in wishlist
          if (!currentItems.find(item => item.id === productId)) {
            set({ items: [...currentItems, product], isLoading: false })
            toast.success('Added to wishlist!')
          } else {
            set({ isLoading: false })
            toast.info('Already in wishlist')
          }
          return true
        } catch (error: any) {
          console.error('Error adding to wishlist:', error)
          const message = error.response?.data || 'Failed to add to wishlist'
          toast.error(message)
          set({ isLoading: false })
          return false
        }
      },

      removeFromWishlist: async (buyerId: number, productId: number) => {
        set({ isLoading: true })
        try {
          await buyerService.removeFromWishlist(buyerId, productId)
          const items = get().items.filter(item => item.id !== productId)
          set({ items, isLoading: false })
          toast.success('Removed from wishlist')
          return true
        } catch (error: any) {
          console.error('Error removing from wishlist:', error)
          const message = error.response?.data || 'Failed to remove from wishlist'
          toast.error(message)
          set({ isLoading: false })
          return false
        }
      },

      isInWishlist: (productId: number) => {
        const items = get().items
        if (!items || !Array.isArray(items)) return false
        return items.some(item => item.id === productId)
      },

      clearWishlist: () => {
        set({ items: [] })
      },

      getWishlistCount: () => {
        const items = get().items
        if (!items || !Array.isArray(items)) return 0
        return items.length
      }
    }),
    {
      name: 'wishlist-storage',
      partialize: (state) => ({ items: state.items })
    }
  )
)
