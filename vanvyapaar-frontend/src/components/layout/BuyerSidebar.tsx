import { Link, useLocation } from 'react-router-dom'
import { 
  Home, 
  Package, 
  ShoppingCart, 
  Heart, 
  ClipboardList, 
  Bell,
  User,
  ArrowLeft
} from 'lucide-react'

const BuyerSidebar = () => {
  const location = useLocation()

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/buyer',
      icon: Home,
    },
    {
      name: 'Browse Products',
      path: '/buyer/products',
      icon: Package,
    },
    {
      name: 'My Cart',
      path: '/buyer/cart',
      icon: ShoppingCart,
    },
    {
      name: 'Wishlist',
      path: '/buyer/wishlist',
      icon: Heart,
    },
    {
      name: 'My Orders',
      path: '/buyer/orders',
      icon: ClipboardList,
    },
    {
      name: 'Notifications',
      path: '/buyer/notifications',
      icon: Bell,
    },
    {
      name: 'Profile',
      path: '/buyer/profile',
      icon: User,
    },
  ]

  const isActive = (path: string) => {
    if (path === '/buyer') {
      return location.pathname === path
    }
    return location.pathname.startsWith(path)
  }

  return (
    <aside className="w-64 bg-white shadow-sm border-r min-h-screen">
      <div className="p-6">
        {/* Back to Public Site */}
        <Link 
          to="/" 
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 text-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Store
        </Link>

        {/* Navigation Menu */}
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-primary-50 text-primary-600 border-r-2 border-primary-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Quick Stats */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Quick Stats</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Cart Items:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Wishlist:</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Orders:</span>
              <span className="font-medium">0</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default BuyerSidebar