import api from '../lib/api'
import { Product, Order, Seller, Buyer } from '../types'

export interface AdminDashboardMetrics {
  totalSellers: number
  totalBuyers: number
  totalProducts: number
  totalOrders: number
  pendingSellers: number
  activeOrders: number
  totalRevenue: number
  monthlyRevenue: number
}

export interface Complaint {
  id: number
  title: string
  description: string
  status: string
  createdAt: string
}

export interface Coupon {
  id: number
  code: string
  discount: number
  expiryDate: string
  active: boolean
}

export const adminService = {
  // Dashboard
  getDashboardMetrics: async (): Promise<AdminDashboardMetrics> => {
    const response = await api.get('/admin/dashboard/metrics')
    return response.data
  },

  // Sellers
  getAllSellers: async (): Promise<Seller[]> => {
    const response = await api.get('/admin/sellers')
    return response.data
  },

  getPendingSellers: async (status: string = 'PENDING'): Promise<Seller[]> => {
    const response = await api.get(`/admin/sellers/pending?status=${status}`)
    return response.data
  },

  getSellerById: async (id: number): Promise<Seller> => {
    const response = await api.get(`/admin/sellers/${id}`)
    return response.data
  },

  approveSeller: async (id: number): Promise<any> => {
    const response = await api.put(`/admin/sellers/${id}/approve`)
    return response.data
  },

  suspendSeller: async (id: number): Promise<any> => {
    const response = await api.put(`/admin/sellers/${id}/suspend`)
    return response.data
  },

  deleteSeller: async (id: number): Promise<any> => {
    const response = await api.put(`/admin/sellers/${id}/delete`)
    return response.data
  },

  // Buyers
  getAllBuyers: async (): Promise<Buyer[]> => {
    const response = await api.get('/admin/buyers')
    return response.data
  },

  getBuyerById: async (id: number): Promise<Buyer> => {
    const response = await api.get(`/admin/buyers/${id}`)
    return response.data
  },

  deleteBuyer: async (id: number): Promise<any> => {
    const response = await api.delete(`/admin/buyers/${id}`)
    return response.data
  },

  suspendBuyer: async (id: number): Promise<any> => {
    const response = await api.put(`/admin/buyers/${id}/suspend`)
    return response.data
  },

  // Products
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/admin/products')
    return response.data
  },

  deleteProduct: async (id: number): Promise<any> => {
    const response = await api.delete(`/admin/products/${id}`)
    return response.data
  },

  // Orders
  getAllOrders: async (): Promise<Order[]> => {
    const response = await api.get('/admin/orders')
    return response.data
  },

  getOrderById: async (id: number): Promise<Order> => {
    const response = await api.get(`/admin/orders/${id}`)
    return response.data
  },

  // Coupons
  getAllCoupons: async (): Promise<Coupon[]> => {
    const response = await api.get('/admin/coupons')
    return response.data
  },

  createCoupon: async (coupon: Partial<Coupon>): Promise<Coupon> => {
    const response = await api.post('/admin/coupons', coupon)
    return response.data
  },

  updateCoupon: async (id: number, coupon: Partial<Coupon>): Promise<Coupon> => {
    const response = await api.put(`/admin/coupons/${id}`, coupon)
    return response.data
  },

  deactivateCoupon: async (id: number): Promise<any> => {
    const response = await api.put(`/admin/coupons/${id}/deactivate`)
    return response.data
  },

  deleteCoupon: async (id: number): Promise<any> => {
    const response = await api.delete(`/admin/coupons/${id}`)
    return response.data
  },

  // Complaints
  getAllComplaints: async (): Promise<Complaint[]> => {
    const response = await api.get('/admin/complaints')
    return response.data
  },

  closeComplaint: async (id: number): Promise<any> => {
    const response = await api.put(`/admin/complaints/${id}/close`)
    return response.data
  }
}

export default adminService
