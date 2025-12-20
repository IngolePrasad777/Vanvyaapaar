import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Container, Typography, Button, Card, CardContent,
  Chip, alpha, Stack
} from '@mui/material'
import {
  ArrowForward, Star,
  ShoppingCart, Favorite, Inventory, Schedule,
  Person, Storefront
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { Product, Order } from '../../types'
import productService from '../../services/productService'
import buyerService from '../../services/buyerService'
import { formatPrice } from '../../lib/utils'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import LoadingAnimation from '../../components/common/LoadingAnimation'

const BuyerDashboard = () => {
  const { user } = useAuthStore()
  const { getCartCount } = useCartStore()
  const { getWishlistCount } = useWishlistStore()
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)

        // Fetch orders
        try {
          const orders = await buyerService.getOrders(user.id)
          setRecentOrders(Array.isArray(orders) ? orders.slice(0, 5) : [])
        } catch (error: any) {
          console.error('Error fetching orders:', error)
          // If it's a 204 No Content, that's okay - just means no orders yet
          if (error.response?.status !== 204) {
            console.error('Orders error:', error.response?.data)
          }
          setRecentOrders([])
        }

        // Fetch products
        try {
          const products = await productService.getAllProducts()
          const productsArray = Array.isArray(products) ? products : []
          const featured = productsArray.filter(p => p.featured).slice(0, 6)
          setRecommendedProducts(featured.length > 0 ? featured : productsArray.slice(0, 6))
        } catch (error: any) {
          console.error('Error fetching products:', error)
          // If it's a 204 No Content, that's okay - just means no products yet
          if (error.response?.status !== 204) {
            console.error('Products error:', error.response?.data)
          }
          setRecommendedProducts([])
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        // Always set loading to false
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [user])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: `Welcome back, ${user?.name}!`,
      subtitle: "Your Tribal Craft Journey Continues",
      description: "Discover new arrivals and track your orders",
      gradient: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(55, 65, 81, 0.9) 100%)"
    },
    {
      title: "Exclusive Collections",
      subtitle: "Handpicked Just For You",
      description: "Explore curated tribal crafts from master artisans",
      gradient: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(71, 85, 105, 0.9) 100%)"
    },
    {
      title: "Support Artisans",
      subtitle: "Every Purchase Makes a Difference",
      description: "Your orders directly support traditional craftspeople",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)"
    }
  ]

  // Safely get counts with fallback
  const cartCount = (() => {
    try {
      return getCartCount()
    } catch (error) {
      console.error('Error getting cart count:', error)
      return 0
    }
  })()

  const wishlistCount = (() => {
    try {
      return getWishlistCount()
    } catch (error) {
      console.error('Error getting wishlist count:', error)
      return 0
    }
  })()

  const categories = [
    {
      name: 'Shopping Cart',
      icon: <ShoppingCart sx={{ fontSize: 48 }} />,
      count: `${cartCount} Items`,
      color: '#D4A574',
      description: 'Ready for checkout',
      link: '/buyer/cart'
    },
    {
      name: 'Wishlist',
      icon: <Favorite sx={{ fontSize: 48 }} />,
      count: `${wishlistCount} Saved`,
      color: '#8B7355',
      description: 'Your favorite items',
      link: '/buyer/wishlist'
    },
    {
      name: 'Total Orders',
      icon: <Inventory sx={{ fontSize: 48 }} />,
      count: `${recentOrders.length} Orders`,
      color: '#A0826D',
      description: 'All your purchases',
      link: '/buyer/orders'
    },
    {
      name: 'Pending',
      icon: <Schedule sx={{ fontSize: 48 }} />,
      count: `${recentOrders.filter(o => o.status === 'PENDING').length} Active`,
      color: '#C9A86A',
      description: 'Orders in progress',
      link: '/buyer/orders'
    }
  ]

  if (loading) {
    return (
      <LoadingAnimation 
        variant="tribal" 
        size="large" 
        text="Loading your dashboard..." 
        fullScreen={true}
      />
    )
  }

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: '#FAFAF9', position: 'relative' }}>
      <AnimatedBackground variant="bubbles" intensity="medium" color="#D4A574" />
      <FloatingElements 
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <ShoppingCart />,
            label: 'View Cart',
            onClick: () => window.location.href = '/buyer/cart',
            color: '#D4A574'
          },
          {
            icon: <Favorite />,
            label: 'Wishlist',
            onClick: () => window.location.href = '/buyer/wishlist',
            color: '#C9A86A'
          },
          {
            icon: <Storefront />,
            label: 'Browse Products',
            onClick: () => window.location.href = '/buyer/products',
            color: '#A0826D'
          }
        ]}
      />

      {/* Floating Particles Background - EXACT SAME AS LANDING PAGE */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: alpha('#D4A574', Math.random() * 0.3 + 0.1),
            pointerEvents: 'none',
            zIndex: 0
          }}
          animate={{
            y: [0, -1000],
            x: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
          initial={{
            left: `${Math.random() * 100}%`,
            bottom: -20
          }}
        />
      ))}

      {/* Premium Hero Section - Compact */}
      <Box sx={{ position: 'relative', height: { xs: '60vh', md: '50vh' }, overflow: 'hidden', bgcolor: '#1F2937' }}>
        {/* Animated Gradient Overlay */}
        <motion.div
          animate={{
            background: [
              'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 80% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
              'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)'
            ]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 1,
            pointerEvents: 'none'
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 1.5, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{ height: '100%', width: '100%', position: 'absolute' }}
          >
            <Box
              sx={{
                height: '100%',
                width: '100%',
                position: 'relative',
                background: heroSlides[currentSlide].gradient,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23D4A574\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
                  opacity: 0.3
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'radial-gradient(circle at 30% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%)'
                }
              }}
            >
              <Container
                maxWidth="lg"
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  position: 'relative',
                  zIndex: 1
                }}
              >
                <motion.div
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4, duration: 1, ease: [0.43, 0.13, 0.23, 0.96] }}
                >
                  <Box sx={{ maxWidth: '800px' }}>
                    <motion.div
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6, duration: 0.8 }}
                    >
                      <motion.div
                        animate={{
                          boxShadow: [
                            `0 0 20px ${alpha('#D4A574', 0.3)}`,
                            `0 0 40px ${alpha('#D4A574', 0.5)}`,
                            `0 0 20px ${alpha('#D4A574', 0.3)}`
                          ]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Chip
                          label="PREMIUM MEMBER"
                          sx={{
                            mb: 2,
                            bgcolor: alpha('#D4A574', 0.15),
                            color: '#D4A574',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid',
                            borderColor: alpha('#D4A574', 0.3),
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            letterSpacing: '0.1em',
                            px: 2,
                            py: 2
                          }}
                        />
                      </motion.div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8, duration: 0.8 }}
                    >
                      <Typography
                        variant="h1"
                        sx={{
                          fontSize: { xs: '2rem', md: '3rem' },
                          fontWeight: 'bold',
                          color: '#FFFFFF',
                          mb: 1.5,
                          fontFamily: 'serif',
                          textShadow: '2px 4px 8px rgba(0,0,0,0.3)',
                          lineHeight: 1.2
                        }}
                      >
                        {heroSlides[currentSlide].title}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1, duration: 0.8 }}
                    >
                      <Typography
                        variant="h4"
                        sx={{
                          fontSize: { xs: '1.1rem', md: '1.4rem' },
                          color: alpha('#D4A574', 0.9),
                          mb: 2,
                          fontWeight: 500,
                          textShadow: '1px 2px 4px rgba(0,0,0,0.2)'
                        }}
                      >
                        {heroSlides[currentSlide].subtitle}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.2, duration: 0.8 }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          fontSize: { xs: '0.95rem', md: '1.1rem' },
                          color: alpha('#FFFFFF', 0.8),
                          mb: 3,
                          maxWidth: '600px'
                        }}
                      >
                        {heroSlides[currentSlide].description}
                      </Typography>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.4, duration: 0.8 }}
                    >
                      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                        <Button
                          component={Link}
                          to="/buyer/products"
                          variant="contained"
                          endIcon={<ArrowForward />}
                          sx={{
                            bgcolor: '#D4A574',
                            color: '#FFFFFF',
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            textTransform: 'none',
                            boxShadow: `0 8px 32px ${alpha('#D4A574', 0.4)}`,
                            '&:hover': {
                              bgcolor: '#C9A86A',
                              transform: 'translateY(-2px)',
                              boxShadow: `0 12px 40px ${alpha('#D4A574', 0.5)}`
                            },
                            transition: 'all 0.3s'
                          }}
                        >
                          Explore Collection
                        </Button>
                        <Button
                          component={Link}
                          to="/buyer/orders"
                          variant="outlined"
                          endIcon={<Inventory />}
                          sx={{
                            color: '#FFFFFF',
                            borderColor: alpha('#FFFFFF', 0.3),
                            px: 4,
                            py: 1.5,
                            fontSize: '1rem',
                            fontWeight: 'bold',
                            borderRadius: 2,
                            textTransform: 'none',
                            backdropFilter: 'blur(10px)',
                            '&:hover': {
                              borderColor: '#D4A574',
                              bgcolor: alpha('#D4A574', 0.1),
                              transform: 'translateY(-2px)'
                            },
                            transition: 'all 0.3s'
                          }}
                        >
                          My Orders
                        </Button>
                      </Stack>
                    </motion.div>
                  </Box>
                </motion.div>
              </Container>
            </Box>
          </motion.div>
        </AnimatePresence>

        {/* Slide Indicators */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 40,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 2,
            display: 'flex',
            gap: 2
          }}
        >
          {heroSlides.map((_, index) => (
            <Box
              key={index}
              onClick={() => setCurrentSlide(index)}
              sx={{
                width: currentSlide === index ? 40 : 12,
                height: 12,
                borderRadius: 6,
                bgcolor: currentSlide === index ? '#D4A574' : alpha('#FFFFFF', 0.3),
                cursor: 'pointer',
                transition: 'all 0.3s',
                '&:hover': {
                  bgcolor: currentSlide === index ? '#D4A574' : alpha('#FFFFFF', 0.5)
                }
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Categories Section - EXACT SAME AS LANDING PAGE */}
      <Container maxWidth="xl" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 'bold',
              mb: 2,
              fontFamily: 'serif',
              color: '#1F2937',
              fontSize: { xs: '2rem', md: '3rem' }
            }}
          >
            Your Dashboard
          </Typography>
          <Typography
            variant="h6"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 8,
              maxWidth: '600px',
              mx: 'auto'
            }}
          >
            Manage your orders, wishlist, and explore new collections
          </Typography>
        </motion.div>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4 }}>
          {categories.map((category, index) => (
            <Box key={index}>
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  component={Link}
                  to={category.link}
                  sx={{
                    height: '100%',
                    borderRadius: 4,
                    overflow: 'hidden',
                    position: 'relative',
                    textDecoration: 'none',
                    border: '2px solid',
                    borderColor: alpha(category.color, 0.2),
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: category.color,
                      boxShadow: `0 20px 60px ${alpha(category.color, 0.3)}`,
                      transform: 'translateY(-10px)',
                      '& .category-icon': {
                        transform: 'scale(1.1) rotate(5deg)',
                        color: category.color
                      },
                      '& .category-bg': {
                        transform: 'scale(1.2)',
                        opacity: 0.15
                      }
                    }
                  }}
                >
                  {/* Background Pattern */}
                  <Box
                    className="category-bg"
                    sx={{
                      position: 'absolute',
                      top: -50,
                      right: -50,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      bgcolor: category.color,
                      opacity: 0.08,
                      transition: 'all 0.6s',
                      pointerEvents: 'none'
                    }}
                  />

                  <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                    <Stack spacing={3} alignItems="center" textAlign="center">
                      <Box
                        className="category-icon"
                        sx={{
                          color: category.color,
                          transition: 'all 0.4s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {category.icon}
                      </Box>

                      <Box>
                        <Typography
                          variant="h5"
                          sx={{
                            fontWeight: 'bold',
                            color: '#1F2937',
                            mb: 1,
                            fontFamily: 'serif'
                          }}
                        >
                          {category.name}
                        </Typography>
                        <Typography
                          variant="h6"
                          sx={{
                            color: category.color,
                            fontWeight: 'bold',
                            mb: 1
                          }}
                        >
                          {category.count}
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: 'text.secondary'
                          }}
                        >
                          {category.description}
                        </Typography>
                      </Box>

                      <ArrowForward sx={{ color: category.color }} />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>
          ))}
        </Box>
      </Container>

      {/* Quick Actions - Same Style */}
      <Box sx={{ bgcolor: alpha('#D4A574', 0.03), py: 8 }}>
        <Container maxWidth="xl">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Typography
              variant="h3"
              sx={{
                textAlign: 'center',
                fontWeight: 'bold',
                mb: 6,
                fontFamily: 'serif',
                color: '#1F2937'
              }}
            >
              Quick Actions
            </Typography>
          </motion.div>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 4 }}>
            {[
              { icon: <Storefront sx={{ fontSize: 60 }} />, title: 'Browse Products', desc: 'Discover new crafts', link: '/buyer/products', color: '#D4A574' },
              { icon: <Favorite sx={{ fontSize: 60 }} />, title: 'My Wishlist', desc: 'View saved items', link: '/buyer/wishlist', color: '#8B7355' },
              { icon: <Person sx={{ fontSize: 60 }} />, title: 'My Profile', desc: 'Manage account', link: '/buyer/profile', color: '#A0826D' }
            ].map((action, index) => (
              <Box key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    component={Link}
                    to={action.link}
                    sx={{
                      height: '100%',
                      borderRadius: 4,
                      textDecoration: 'none',
                      border: '2px solid',
                      borderColor: alpha(action.color, 0.2),
                      transition: 'all 0.4s',
                      '&:hover': {
                        borderColor: action.color,
                        boxShadow: `0 20px 60px ${alpha(action.color, 0.3)}`,
                        '& .action-icon': {
                          transform: 'scale(1.1) rotate(5deg)',
                          color: action.color
                        }
                      }
                    }}
                  >
                    <CardContent sx={{ p: 5 }}>
                      <Stack spacing={3} alignItems="center" textAlign="center">
                        <Box
                          className="action-icon"
                          sx={{
                            color: action.color,
                            transition: 'all 0.4s'
                          }}
                        >
                          {action.icon}
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                          {action.title}
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                          {action.desc}
                        </Typography>
                        <ArrowForward sx={{ color: action.color }} />
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Recent Orders & Recommendations */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          <Box>
            <Card sx={{ borderRadius: 4, border: '2px solid', borderColor: alpha('#D4A574', 0.2), height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, fontFamily: 'serif', color: '#1F2937' }}>
                  Recent Orders
                </Typography>
                {recentOrders.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Inventory sx={{ fontSize: 60, color: alpha('#D4A574', 0.5), mb: 2 }} />
                    <Typography sx={{ color: 'text.secondary', mb: 3 }}>No orders yet</Typography>
                    <Button component={Link} to="/buyer/products" variant="contained" sx={{ bgcolor: '#D4A574', '&:hover': { bgcolor: '#C9A86A' } }}>
                      Start Shopping
                    </Button>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {recentOrders.map((order) => (
                      <Card key={order.id} sx={{ bgcolor: alpha('#D4A574', 0.05), border: '1px solid', borderColor: alpha('#D4A574', 0.2) }}>
                        <CardContent sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            {order.items && order.items.length > 0 && order.items[0].product?.imageUrl && (
                              <Box component="img" src={order.items[0].product.imageUrl} sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover' }} />
                            )}
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                {order.items && order.items.length > 0 && order.items[0].product?.name 
                                  ? order.items[0].product.name 
                                  : `Order #${order.id}`}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {order.items?.length || 0} item(s) • {order.status}
                              </Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                              {formatPrice(order.totalAmount || 0)}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>

          <Box>
            <Card sx={{ borderRadius: 4, border: '2px solid', borderColor: alpha('#D4A574', 0.2), height: '100%' }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3, fontFamily: 'serif', color: '#1F2937' }}>
                  Recommended For You
                </Typography>
                {recommendedProducts.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Star sx={{ fontSize: 60, color: alpha('#D4A574', 0.5), mb: 2 }} />
                    <Typography sx={{ color: 'text.secondary' }}>No recommendations yet</Typography>
                  </Box>
                ) : (
                  <Stack spacing={2}>
                    {recommendedProducts.slice(0, 3).map((product) => (
                      <Card key={product.id} component={Link} to={`/buyer/products/${product.id}`} sx={{ bgcolor: alpha('#D4A574', 0.05), border: '1px solid', borderColor: alpha('#D4A574', 0.2), textDecoration: 'none', '&:hover': { borderColor: '#D4A574' } }}>
                        <CardContent sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box component="img" src={product.imageUrl} sx={{ width: 60, height: 60, borderRadius: 2, objectFit: 'cover' }} />
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1F2937' }}>{product.name}</Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>{product.category}</Typography>
                            </Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                              {formatPrice(product.price)}
                            </Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ))}
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default BuyerDashboard
