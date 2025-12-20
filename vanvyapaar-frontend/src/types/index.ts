export interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  pincode?: string
  createdAt: string
}

export interface Buyer extends User {
  orders?: Order[]
  cartItems?: CartItem[]
}

export interface Seller extends User {
  tribeName?: string
  artisanCategory?: string
  region?: string
  bio?: string
  bankAccountNumber?: string
  ifscCode?: string
  panNumber?: string
  termsAccepted: boolean
  consentAccepted: boolean
  adminApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED'
}

export interface Admin extends User {}

export interface Product {
  id: number
  name: string
  description: string
  category: string
  price: number
  stock: number
  imageUrl?: string
  featured?: boolean
  seller: Seller
  reviews?: Review[]
}

export interface CartItem {
  id: number
  quantity: number
  product: Product
  buyer: Buyer
}

export interface Order {
  id: number
  totalAmount: number
  status: string
  orderDate: string
  buyer: Buyer
  seller: Seller
  items: CartItem[]
}

export interface Review {
  id: number
  rating: number
  comment?: string
  reviewDate: string
  buyer: Buyer
  product: Product
}

export interface WishlistItem {
  id: number
  buyer: Buyer
  product: Product
}

export interface LoginRequest {
  email: string
  password: string
  role: 'ADMIN' | 'BUYER' | 'SELLER'
}

export interface LoginResponse {
  token: string
  role: string
  name: string
  id: number
}

export interface BuyerSignupRequest {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
  address?: string
  pincode?: string
  termsAccepted?: boolean
}

export interface SellerSignupRequest extends BuyerSignupRequest {
  tribeName?: string
  artisanCategory?: string
  region?: string
  bio?: string
  bankAccountNumber?: string
  ifscCode?: string
  panNumber?: string
  termsAccepted: boolean
  consentAccepted: boolean
}

export interface ApiResponse<T> {
  data?: T
  message?: string
  error?: string
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}

export interface DashboardStats {
  totalProducts?: number
  totalOrders?: number
  totalRevenue?: number
  pendingOrders?: number
  totalSellers?: number
  totalBuyers?: number
}