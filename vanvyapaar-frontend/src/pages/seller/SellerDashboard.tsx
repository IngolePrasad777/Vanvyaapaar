import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Container, Typography, Button, Card, CardContent,
  Chip, alpha, Stack
} from '@mui/material'
import {
  ArrowForward, Star, AutoAwesome, EmojiEvents,
  Inventory, ShoppingCart, TrendingUp, AttachMoney,
  Add, LocalShipping, CheckCircle, Visibility
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import sellerService, { SellerStats } from '../../services/sellerService'
import { Order } from '../../types'
import { formatPrice } from '../../lib/utils'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'
import LoadingAnimation from '../../components/common/LoadingAnimation'

const SellerDashboard = () => {
  const { user } = useAuthStore()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [stats, setStats] = useState<SellerStats>({
    totalProducts: 0,
    pendingOrders: 0,
    monthlySales: 0,
    profileViews: 0
  })
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return

      try {
        setLoading(true)
        const [statsData, ordersData] = await Promise.all([
          sellerService.getStats(user.id),
          sellerService.getOrders(user.id)
        ])

        setStats(statsData)
        setRecentOrders(ordersData.slice(0, 3))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
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
      subtitle: "Your Artisan Business Hub",
      description: "Manage products, track orders, and grow your craft business",
      gradient: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(55, 65, 81, 0.9) 100%)"
    },
    {
      title: "Empower Your Craft",
      subtitle: "Reach Customers Nationwide",
      description: "Showcase your authentic tribal crafts to thousands of buyers",
      gradient: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(71, 85, 105, 0.9) 100%)"
    },
    {
      title: "Grow Your Business",
      subtitle: "Analytics & Insights",
      description: "Track sales, manage inventory, and optimize your listings",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)"
    }
  ]

  const categories = [
    {
      name: 'Total Products',
      icon: <Inventory sx={{ fontSize: 48 }} />,
      count: `${stats.totalProducts} Items`,
      color: '#D4A574',
      description: 'Manage inventory',
      link: '/seller/products'
    },
    {
      name: 'Pending Orders',
      icon: <ShoppingCart sx={{ fontSize: 48 }} />,
      count: `${stats.pendingOrders} Orders`,
      color: '#8B7355',
      description: 'Process orders',
      link: '/seller/orders'
    },
    {
      name: 'Monthly Sales',
      icon: <AttachMoney sx={{ fontSize: 48 }} />,
      count: formatPrice(stats.monthlySales),
      color: '#A0826D',
      description: 'View analytics',
      link: '/seller/analytics'
    },
    {
      name: 'Profile Views',
      icon: <Visibility sx={{ fontSize: 48 }} />,
      count: `${stats.profileViews} Views`,
      color: '#C9A86A',
      description: 'Update profile',
      link: '/seller/profile'
    }
  ]

  const statsCards = [
    { value: stats.totalProducts.toString(), label: 'Products Listed', icon: <EmojiEvents sx={{ fontSize: 40 }} />, color: '#D4A574' },
    { value: formatPrice(stats.monthlySales), label: 'This Month', icon: <AutoAwesome sx={{ fontSize: 40 }} />, color: '#C9A86A' },
    { value: stats.pendingOrders.toString(), label: 'Pending Orders', icon: <LocalShipping sx={{ fontSize: 40 }} />, color: '#A0826D' },
    { value: stats.profileViews.toString(), label: 'Profile Views', icon: <Star sx={{ fontSize: 40 }} />, color: '#8B7355' }
  ]

  const quickActions = [
    { icon: <Add />, title: 'Add Product', desc: 'List new items', link: '/seller/products/add', color: '#D4A574' },
    { icon: <Inventory />, title: 'Manage Inventory', desc: 'Update stock levels', link: '/seller/products', color: '#C9A86A' },
    { icon: <ShoppingCart />, title: 'View Orders', desc: 'Process orders', link: '/seller/orders', color: '#8B7355' },
    { icon: <TrendingUp />, title: 'Analytics', desc: 'Track performance', link: '/seller/analytics', color: '#A0826D' }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return '#F59E0B'
      case 'CONFIRMED': return '#3B82F6'
      case 'PROCESSING': return '#3B82F6'
      case 'SHIPPED': return '#10B981'
      case 'DELIVERED': return '#059669'
      case 'CANCELLED': return '#EF4444'
      default: return '#6B7280'
    }
  }

  if (loading) {
    return (
      <LoadingAnimation 
        variant="tribal" 
        size="large" 
        text="Loading seller dashboard..." 
        fullScreen={true}
      />
    )
  }

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: '#F5F5F4', position: 'relative' }}>
      <AnimatedBackground variant="geometric" intensity="light" color="#8B7355" />
      <FloatingElements 
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <Add />,
            label: 'Add Product',
            onClick: () => window.location.href = '/seller/products/add',
            color: '#10B981'
          },
          {
            icon: <Inventory />,
            label: 'My Products',
            onClick: () => window.location.href = '/seller/products',
            color: '#8B7355'
          },
          {
            icon: <LocalShipping />,
            label: 'Orders',
            onClick: () => window.location.href = '/seller/orders',
            color: '#D4A574'
          }
        ]}
      />
      {/* Floating Particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: Math.random() * 3 + 1,
            height: Math.random() * 3 + 1,
            borderRadius: '50%',
            background: alpha('#D4A574', Math.random() * 0.15 + 0.05),
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

      {/* Hero Carousel */}
      <Box sx={{ position: 'relative', height: { xs: '60vh', md: '80vh' }, overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              inset: 0,
              background: heroSlides[currentSlide].gradient
            }}
          >
            <Container maxWidth="lg" sx={{ height: '100%', display: 'flex', alignItems: 'center', position: 'relative', zIndex: 2 }}>
              <Box sx={{ maxWidth: 700 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.8 }}
                >
                  <Chip
                    label="Seller Portal"
                    icon={<Star />}
                    sx={{
                      bgcolor: alpha('#D4A574', 0.15),
                      color: '#D4A574',
                      fontWeight: 'bold',
                      border: '2px solid',
                      borderColor: alpha('#D4A574', 0.25),
                      mb: 3,
                      px: 2,
                      animation: 'glow 2s ease-in-out infinite',
                      '@keyframes glow': {
                        '0%, 100%': { boxShadow: `0 0 15px ${alpha('#D4A574', 0.2)}` },
                        '50%': { boxShadow: `0 0 20px ${alpha('#D4A574', 0.35)}` }
                      }
                    }}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#FFFFFF',
                      mb: 2,
                      fontFamily: 'serif',
                      fontSize: { xs: '2.5rem', md: '3.5rem' }
                    }}
                  >
                    {heroSlides[currentSlide].title}
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      color: '#D4A574',
                      mb: 2,
                      fontWeight: 600,
                      letterSpacing: '0.5px'
                    }}
                  >
                    {heroSlides[currentSlide].subtitle}
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      color: alpha('#FFFFFF', 0.8),
                      mb: 4,
                      lineHeight: 1.6
                    }}
                  >
                    {heroSlides[currentSlide].description}
                  </Typography>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1, duration: 0.8 }}
                >
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Button
                      component={Link}
                      to="/seller/products/add"
                      variant="contained"
                      size="large"
                      endIcon={<ArrowForward />}
                      sx={{
                        bgcolor: '#D4A574',
                        color: '#1F2937',
                        px: 4,
                        py: 2,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        '&:hover': {
                          bgcolor: '#C9A86A',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 8px 25px ${alpha('#D4A574', 0.4)}`
                        },
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      Add New Product
                    </Button>
                    <Button
                      component={Link}
                      to="/seller/orders"
                      variant="outlined"
                      size="large"
                      sx={{
                        borderColor: '#FFFFFF',
                        color: '#FFFFFF',
                        px: 4,
                        py: 2,
                        borderRadius: 2,
                        fontWeight: 'bold',
                        fontSize: '1.1rem',
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: '#D4A574',
                          bgcolor: alpha('#D4A574', 0.1),
                          borderWidth: 2
                        }
                      }}
                    >
                      View Orders
                    </Button>
                  </Stack>
                </motion.div>
              </Box>
            </Container>

            {/* Slide Indicators */}
            <Box sx={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 3 }}>
              <Stack direction="row" spacing={1}>
                {heroSlides.map((_, index) => (
                  <Box
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    sx={{
                      width: currentSlide === index ? 40 : 12,
                      height: 12,
                      borderRadius: 6,
                      bgcolor: currentSlide === index ? '#D4A574' : alpha('#FFFFFF', 0.5),
                      cursor: 'pointer',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        bgcolor: currentSlide === index ? '#C9A86A' : alpha('#FFFFFF', 0.8)
                      }
                    }}
                  />
                ))}
              </Stack>
            </Box>
          </motion.div>
        </AnimatePresence>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 4, mb: 8 }}>
            {statsCards.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: alpha(stat.color, 0.15),
                    bgcolor: '#FFFFFF',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      borderColor: alpha(stat.color, 0.4),
                      boxShadow: `0 8px 24px ${alpha(stat.color, 0.12)}`,
                      transform: 'translateY(-4px)'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 70,
                        height: 70,
                        borderRadius: '50%',
                        bgcolor: alpha(stat.color, 0.08),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        border: '2px solid',
                        borderColor: alpha(stat.color, 0.2),
                        position: 'relative',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          inset: -6,
                          borderRadius: '50%',
                          background: `radial-gradient(circle, ${alpha(stat.color, 0.1)} 0%, transparent 70%)`,
                          animation: 'pulse 2s ease-in-out infinite'
                        },
                        '@keyframes pulse': {
                          '0%, 100%': { opacity: 0.3 },
                          '50%': { opacity: 0.6 }
                        }
                      }}
                    >
                      <Box sx={{ color: stat.color, position: 'relative', zIndex: 1 }}>
                        {stat.icon}
                      </Box>
                    </Box>
                    <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body1" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Category Cards */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h3"
            sx={{
              fontWeight: 'bold',
              color: '#1F2937',
              mb: 2,
              textAlign: 'center',
              fontFamily: 'serif'
            }}
          >
            Quick Actions
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 6,
              textAlign: 'center'
            }}
          >
            Manage your business efficiently
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 4, mb: 8 }}>
            {categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10 }}
              >
                <Card
                  component={Link}
                  to={category.link}
                  sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: alpha(category.color, 0.15),
                    bgcolor: '#FFFFFF',
                    textDecoration: 'none',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative',
                    overflow: 'hidden',
                    '&:hover': {
                      borderColor: alpha(category.color, 0.4),
                      boxShadow: `0 8px 24px ${alpha(category.color, 0.15)}`,
                      transform: 'translateY(-4px)',
                      '& .category-icon': {
                        transform: 'rotate(360deg) scale(1.1)'
                      }
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -100,
                      right: -100,
                      width: 200,
                      height: 200,
                      borderRadius: '50%',
                      background: `radial-gradient(circle, ${alpha(category.color, 0.06)} 0%, transparent 70%)`,
                      transition: 'all 0.3s'
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: 'center', position: 'relative', zIndex: 1 }}>
                    <Box
                      className="category-icon"
                      sx={{
                        color: category.color,
                        mb: 2,
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      {category.icon}
                    </Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
                      {category.name}
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: category.color, mb: 1 }}>
                      {category.count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {category.description}
                    </Typography>
                    <Box
                      sx={{
                        mt: 2,
                        display: 'inline-flex',
                        alignItems: 'center',
                        color: category.color,
                        fontWeight: 'bold',
                        fontSize: '0.9rem'
                      }}
                    >
                      View Details
                      <ArrowForward sx={{ ml: 0.5, fontSize: 18 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Quick Actions & Recent Orders */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 4 }}>
          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: alpha('#D4A574', 0.15),
                bgcolor: '#FFFFFF',
                boxShadow: `0 2px 8px ${alpha('#000', 0.04)}`
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D4A574', fontFamily: 'serif', mb: 3 }}>
                  Management Tools
                </Typography>
                <Stack spacing={2}>
                  {quickActions.map((action, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ x: 5 }}
                    >
                      <Button
                        component={Link}
                        to={action.link}
                        fullWidth
                        sx={{
                          p: 2.5,
                          borderRadius: 3,
                          border: '1px solid',
                          borderColor: alpha(action.color, 0.15),
                          bgcolor: alpha(action.color, 0.03),
                          justifyContent: 'flex-start',
                          textAlign: 'left',
                          '&:hover': {
                            borderColor: alpha(action.color, 0.4),
                            bgcolor: alpha(action.color, 0.06),
                            boxShadow: `0 2px 8px ${alpha(action.color, 0.12)}`
                          },
                          transition: 'all 0.3s'
                        }}
                      >
                        <Box sx={{ color: action.color, mr: 2, fontSize: 28 }}>
                          {action.icon}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                            {action.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {action.desc}
                          </Typography>
                        </Box>
                        <ArrowForward sx={{ color: action.color }} />
                      </Button>
                    </motion.div>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Orders */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                border: '1px solid',
                borderColor: alpha('#C9A86A', 0.15),
                bgcolor: '#FFFFFF',
                boxShadow: `0 2px 8px ${alpha('#000', 0.04)}`
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C9A86A', fontFamily: 'serif' }}>
                    Recent Orders
                  </Typography>
                  <Button
                    component={Link}
                    to="/seller/orders"
                    sx={{
                      color: '#C9A86A',
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: alpha('#C9A86A', 0.1) }
                    }}
                  >
                    View All
                  </Button>
                </Stack>
                <Stack spacing={2}>
                  {recentOrders.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <ShoppingCart sx={{ fontSize: 60, color: alpha('#C9A86A', 0.3), mb: 2 }} />
                      <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                        No recent orders
                      </Typography>
                    </Box>
                  ) : (
                    recentOrders.map((order, index) => {
                      const statusColor = getStatusColor(order.status)
                      return (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: index * 0.1, duration: 0.4 }}
                          whileHover={{ x: 5 }}
                        >
                          <Box
                            sx={{
                              p: 2.5,
                              borderRadius: 3,
                              bgcolor: alpha(statusColor, 0.05),
                              border: '2px solid',
                              borderColor: alpha(statusColor, 0.2),
                              transition: 'all 0.3s',
                              '&:hover': {
                                borderColor: statusColor,
                                boxShadow: `0 4px 12px ${alpha(statusColor, 0.2)}`
                              }
                            }}
                          >
                            <Stack direction="row" justifyContent="space-between" alignItems="center">
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 0.5 }}>
                                  Order #{order.id}
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {order.items && order.items.length > 0 && order.items[0].product?.name 
                                    ? order.items[0].product.name 
                                    : `${order.items?.length || 0} item(s)`}
                                </Typography>
                              </Box>
                              <Box sx={{ textAlign: 'right' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 0.5 }}>
                                  {formatPrice(order.totalAmount || 0)}
                                </Typography>
                                <Chip
                                  label={order.status}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(statusColor, 0.15),
                                    color: statusColor,
                                    fontWeight: 'bold',
                                    border: '1px solid',
                                    borderColor: alpha(statusColor, 0.3)
                                  }}
                                />
                              </Box>
                            </Stack>
                          </Box>
                        </motion.div>
                      )
                    })
                  )}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}

export default SellerDashboard
