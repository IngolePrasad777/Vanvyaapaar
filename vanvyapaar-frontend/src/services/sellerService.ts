import api from '../lib/api'
import { Product, Order } from '../types'

export interface SellerStats {
  totalProducts: number
  pendingOrders: number
  monthlySales: number
  profileViews: number
  totalSales?: number
  totalOrders?: number
}

export const sellerService = {
  // Dashboard stats - Fixed to match backend endpoint
  getStats: async (sellerId: number): Promise<SellerStats> => {
    const response = await api.get(`/seller/${sellerId}/dashboard`)
    const data = response.data
    // Map backend response to frontend interface
    return {
      totalProducts: data.totalProducts || 0,
      pendingOrders: data.pendingOrders || 0,
      monthlySales: data.totalSales || 0, // Backend returns totalSales
      profileViews: 0, // Not implemented in backend yet
      totalSales: data.totalSales || 0,
      totalOrders: data.totalOrders || 0
    }
  },

  // Product operations
  getProducts: async (sellerId: number): Promise<Product[]> => {
    const response = await api.get(`/seller/${sellerId}/products`)
    return response.data
  },

  addProduct: async (sellerId: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.post(`/seller/${sellerId}/products`, product)
    return response.data
  },

  updateProduct: async (productId: number, product: Partial<Product>): Promise<Product> => {
    const response = await api.put(`/seller/products/${productId}`, product)
    return response.data
  },

  deleteProduct: async (productId: number): Promise<void> => {
    await api.delete(`/seller/products/${productId}`)
  },

  // Order operations
  getOrders: async (sellerId: number): Promise<Order[]> => {
    const response = await api.get(`/seller/${sellerId}/orders`)
    return response.data
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<Order> => {
    const response = await api.put(`/seller/orders/${orderId}/status?status=${status}`)
    return response.data
  },

  // Analytics
  getAnalytics: async (sellerId: number, period: string = 'month'): Promise<any> => {
    const response = await api.get(`/seller/${sellerId}/analytics?period=${period}`)
    return response.data
  }
}

export default sellerService
