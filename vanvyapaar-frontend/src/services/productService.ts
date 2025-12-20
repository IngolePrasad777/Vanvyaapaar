import api from '../lib/api'
import { Product, ProductFilters } from '../types'

export const productService = {
  // Public product endpoints
  getAllProducts: async (): Promise<Product[]> => {
    const response = await api.get('/buyer/products')
    return response.data
  },

  getProduct: async (id: number): Promise<Product> => {
    const response = await api.get(`/buyer/products/${id}`)
    return response.data
  },

  searchProducts: async (keyword: string): Promise<Product[]> => {
    const response = await api.get(`/buyer/search?keyword=${encodeURIComponent(keyword)}`)
    return response.data
  },

  filterByCategory: async (category: string): Promise<Product[]> => {
    const response = await api.get(`/buyer/filter/category?category=${encodeURIComponent(category)}`)
    return response.data
  },

  filterByPrice: async (min: number, max: number): Promise<Product[]> => {
    const response = await api.get(`/buyer/filter/price?min=${min}&max=${max}`)
    return response.data
  },

  getProductReviews: async (productId: number) => {
    const response = await api.get(`/buyer/products/${productId}/reviews`)
    return response.data
  },

  // Seller product endpoints
  getSellerProducts: async (sellerId: number): Promise<Product[]> => {
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
}

export default productService