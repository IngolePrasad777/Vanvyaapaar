import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Container, Typography, Button, Card, CardContent,
  Chip, alpha, Stack
} from '@mui/material'
import {
  ArrowForward, Shield, TrendingUp,
  People, Store, Inventory, ShoppingCart,
  CheckCircle, HourglassEmpty, AttachMoney
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import adminService, { AdminDashboardMetrics } from '../../services/adminService'
import { formatPrice } from '../../lib/utils'

const AdminDashboard = () => {
  const { user } = useAuthStore()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [metrics, setMetrics] = useState<AdminDashboardMetrics>({
    totalSellers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingSellers: 0,
    activeOrders: 0,
    totalRevenue: 0,
    monthlyRevenue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const data = await adminService.getDashboardMetrics()
        setMetrics(data)
      } catch (error) {
        console.error('Error fetching dashboard metrics:', error)
        // Keep default metrics if API fails
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3)
    }, 7000)
    return () => clearInterval(interval)
  }, [])

  const heroSlides = [
    {
      title: `Welcome, ${user?.name}!`,
      subtitle: "Admin Control Center",
      description: "Manage users, products, and oversee the entire platform",
      gradient: "linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(55, 65, 81, 0.9) 100%)"
    },
    {
      title: "Platform Overview",
      subtitle: "Monitor & Manage",
      description: "Track sellers, buyers, products, and orders in real-time",
      gradient: "linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(71, 85, 105, 0.9) 100%)"
    },
    {
      title: "System Health",
      subtitle: "Everything Running Smoothly",
      description: "Ensure quality and authenticity across the marketplace",
      gradient: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)"
    }
  ]

  const statsCards = [
    { value: (metrics?.totalSellers ?? 0).toString(), label: 'Total Sellers', icon: <Store sx={{ fontSize: 40 }} />, color: '#D4A574' },
    { value: (metrics?.totalBuyers ?? 0).toString(), label: 'Total Buyers', icon: <People sx={{ fontSize: 40 }} />, color: '#C9A86A' },
    { value: (metrics?.totalProducts ?? 0).toString(), label: 'Total Products', icon: <Inventory sx={{ fontSize: 40 }} />, color: '#A0826D' },
    { value: (metrics?.totalOrders ?? 0).toString(), label: 'Total Orders', icon: <ShoppingCart sx={{ fontSize: 40 }} />, color: '#8B7355' }
  ]

  const categories = [
    {
      name: 'Sellers',
      icon: <Store sx={{ fontSize: 48 }} />,
      count: `${metrics?.totalSellers ?? 0} Total`,
      color: '#D4A574',
      description: `${metrics?.pendingSellers ?? 0} pending approval`,
      link: '/admin/sellers'
    },
    {
      name: 'Buyers',
      icon: <People sx={{ fontSize: 48 }} />,
      count: `${metrics?.totalBuyers ?? 0} Users`,
      color: '#C9A86A',
      description: 'Manage user accounts',
      link: '/admin/buyers'
    },
    {
      name: 'Products',
      icon: <Inventory sx={{ fontSize: 48 }} />,
      count: `${metrics?.totalProducts ?? 0} Items`,
      color: '#A0826D',
      description: 'Review & approve',
      link: '/admin/products'
    },
    {
      name: 'Orders',
      icon: <ShoppingCart sx={{ fontSize: 48 }} />,
      count: `${metrics?.totalOrders ?? 0} Orders`,
      color: '#8B7355',
      description: `${metrics?.activeOrders ?? 0} active`,
      link: '/admin/orders'
    }
  ]

  const quickActions = [
    { icon: <CheckCircle />, title: 'Approve Sellers', desc: `${metrics?.pendingSellers ?? 0} pending`, link: '/admin/sellers', color: '#10B981' },
    { icon: <Inventory />, title: 'Review Products', desc: 'Check new listings', link: '/admin/products', color: '#3B82F6' },
    { icon: <ShoppingCart />, title: 'Monitor Orders', desc: 'Track transactions', link: '/admin/orders', color: '#F59E0B' },
    { icon: <Shield />, title: 'Handle Complaints', desc: 'Resolve issues', link: '/admin/complaints', color: '#EF4444' }
  ]

  const revenueStats = [
    { label: 'Total Revenue', value: formatPrice(metrics?.totalRevenue ?? 0), icon: <AttachMoney />, color: '#10B981' },
    { label: 'This Month', value: formatPrice(metrics?.monthlyRevenue ?? 0), icon: <TrendingUp />, color: '#3B82F6' },
    { label: 'Active Orders', value: (metrics?.activeOrders ?? 0).toString(), icon: <HourglassEmpty />, color: '#F59E0B' }
  ]

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F5F5F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Stack spacing={2} alignItems="center">
          <Box sx={{ width: 60, height: 60, borderRadius: '50%', border: '4px solid', borderColor: alpha('#D4A574', 0.3), borderTopColor: '#D4A574', animation: 'spin 1s linear infinite', '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } } }} />
          <Typography variant="h6" sx={{ color: '#D4A574', fontWeight: 'bold' }}>
            Loading Dashboard...
          </Typography>
        </Stack>
      </Box>
    )
  }

  return (
    <Box sx={{ overflow: 'hidden', bgcolor: '#F5F5F4', position: 'relative' }}>
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
                    label="Admin Portal"
                    icon={<Shield />}
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
                      to="/admin/sellers"
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
                      Manage Sellers
                    </Button>
                    <Button
                      component={Link}
                      to="/admin/products"
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
                      Review Products
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
            Management Center
          </Typography>
          <Typography
            variant="h6"
            sx={{
              color: 'text.secondary',
              mb: 6,
              textAlign: 'center'
            }}
          >
            Oversee all platform operations
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
                      Manage
                      <ArrowForward sx={{ ml: 0.5, fontSize: 18 }} />
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>
        </motion.div>

        {/* Quick Actions & Revenue */}
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
                  Quick Actions
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

          {/* Revenue Stats */}
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
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#C9A86A', fontFamily: 'serif', mb: 3 }}>
                  Revenue Overview
                </Typography>
                <Stack spacing={3}>
                  {revenueStats.map((stat, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                    >
                      <Box
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          bgcolor: alpha(stat.color, 0.05),
                          border: '1px solid',
                          borderColor: alpha(stat.color, 0.15),
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: alpha(stat.color, 0.4),
                            boxShadow: `0 2px 8px ${alpha(stat.color, 0.12)}`
                          }
                        }}
                      >
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Box
                            sx={{
                              width: 50,
                              height: 50,
                              borderRadius: '50%',
                              bgcolor: alpha(stat.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: stat.color
                            }}
                          >
                            {stat.icon}
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                              {stat.label}
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', color: stat.color }}>
                              {stat.value}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              </CardContent>
            </Card>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}

export default AdminDashboard
