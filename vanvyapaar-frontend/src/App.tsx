import { Routes, Route } from 'react-router-dom'
import { useAuthStore } from './store/authStore'
import { useEffect } from 'react'

// Public Pages
import LandingPage from './pages/public/LandingPageNew'
import LoginPage from './pages/auth/LoginPage'
import RegisterPage from './pages/auth/RegisterPage'
import ProductsPage from './pages/public/ProductsPage'
import ProductDetailPage from './pages/public/ProductDetailPage'
import ArtisansPage from './pages/public/ArtisansPage'
import AboutPage from './pages/public/AboutPage'
import StoriesPage from './pages/public/StoriesPage'

// Buyer Pages
import BuyerDashboard from './pages/buyer/BuyerDashboard'
import BuyerProducts from './pages/buyer/BuyerProducts'
import BuyerCart from './pages/buyer/BuyerCart'
import BuyerCheckout from './pages/buyer/BuyerCheckout'
import BuyerOrders from './pages/buyer/BuyerOrders'
import BuyerWishlist from './pages/buyer/BuyerWishlist'
import BuyerProfile from './pages/buyer/BuyerProfile'
import BuyerNotifications from './pages/buyer/BuyerNotifications'

// Seller Pages
import SellerDashboard from './pages/seller/SellerDashboard'
import SellerProducts from './pages/seller/SellerProducts'
import SellerOrders from './pages/seller/SellerOrders'
import SellerProfile from './pages/seller/SellerProfile'
import SellerAnalytics from './pages/seller/SellerAnalytics'
import AddProduct from './pages/seller/AddProduct'
import SellerNotifications from './pages/seller/SellerNotifications'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminSellers from './pages/admin/AdminSellers'
import AdminBuyers from './pages/admin/AdminBuyers'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminNotifications from './pages/admin/AdminNotifications'

// Layout Components
import PublicLayout from './components/layout/PublicLayout'
import BuyerLayout from './components/layout/BuyerLayout'
import SellerLayout from './components/layout/SellerLayout'
import AdminLayout from './components/layout/AdminLayout'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Chatbot
import VanMitra from './components/chatbot/VanMitra'

function App() {
  const { initializeAuth } = useAuthStore()

  useEffect(() => {
    initializeAuth()
  }, [initializeAuth])

  return (
    <>
      <Routes>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<LandingPage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="artisans" element={<ArtisansPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="stories" element={<StoriesPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
      </Route>

      {/* Buyer Routes */}
      <Route path="/buyer" element={
        <ProtectedRoute allowedRoles={['BUYER']}>
          <BuyerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<BuyerDashboard />} />
        <Route path="products" element={<BuyerProducts />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="cart" element={<BuyerCart />} />
        <Route path="checkout" element={<BuyerCheckout />} />
        <Route path="orders" element={<BuyerOrders />} />
        <Route path="wishlist" element={<BuyerWishlist />} />
        <Route path="notifications" element={<BuyerNotifications />} />
        <Route path="profile" element={<BuyerProfile />} />
      </Route>

      {/* Seller Routes */}
      <Route path="/seller" element={
        <ProtectedRoute allowedRoles={['SELLER']}>
          <SellerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/:id" element={<ProductDetailPage />} />
        <Route path="orders" element={<SellerOrders />} />
        <Route path="analytics" element={<SellerAnalytics />} />
        <Route path="notifications" element={<SellerNotifications />} />
        <Route path="profile" element={<SellerProfile />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['ADMIN']}>
          <AdminLayout />
        </ProtectedRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="buyers" element={<AdminBuyers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="notifications" element={<AdminNotifications />} />
      </Route>
    </Routes>
    
    {/* VanMitra Chatbot - Available on all pages */}
    <VanMitra />
  </>
  )
}

export default App