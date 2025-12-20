import api from '../lib/api'
import { CartItem, Order, Product, Buyer, Review } from '../types'

export const buyerService = {
  // Cart operations
  addToCart: async (buyerId: number, productId: number, quantity: number = 1): Promise<CartItem> => {
    const response = await api.post(`/buyer/${buyerId}/cart/add/${productId}?quantity=${quantity}`)
    return response.data
  },

  getCart: async (buyerId: number): Promise<CartItem[]> => {
    const response = await api.get(`/buyer/${buyerId}/cart`)
    return response.data
  },

  updateCartItem: async (cartItemId: number, quantity: number): Promise<CartItem> => {
    const response = await api.put(`/buyer/cart/${cartItemId}?quantity=${quantity}`)
    return response.data
  },

  removeCartItem: async (cartItemId: number): Promise<void> => {
    await api.delete(`/buyer/cart/${cartItemId}`)
  },

  // Order operations
  placeOrder: async (buyerId: number): Promise<Order[]> => {
    const response = await api.post(`/buyer/${buyerId}/orders`)
    return response.data
  },

  getOrders: async (buyerId: number): Promise<Order[]> => {
    const response = await api.get(`/buyer/${buyerId}/orders`)
    return response.data
  },

  // Wishlist operations
  addToWishlist: async (buyerId: number, productId: number): Promise<Product> => {
    const response = await api.post(`/buyer/${buyerId}/wishlist/${productId}`)
    return response.data
  },

  getWishlist: async (buyerId: number): Promise<Product[]> => {
    const response = await api.get(`/buyer/${buyerId}/wishlist`)
    return response.data
  },

  removeFromWishlist: async (buyerId: number, productId: number): Promise<void> => {
    await api.delete(`/buyer/${buyerId}/wishlist/${productId}`)
  },

  // Profile operations
  getProfile: async (buyerId: number): Promise<Buyer> => {
    const response = await api.get(`/buyer/${buyerId}/profile`)
    return response.data
  },

  updateProfile: async (buyerId: number, profile: Partial<Buyer>): Promise<Buyer> => {
    const response = await api.put(`/buyer/${buyerId}/profile`, profile)
    return response.data
  },

  // Review operations
  addReview: async (buyerId: number, productId: number, rating: number, comment?: string): Promise<Review> => {
    const response = await api.post('/buyer/reviews', {
      buyerId,
      productId,
      rating,
      comment
    })
    return response.data
  },
}

export default buyerService