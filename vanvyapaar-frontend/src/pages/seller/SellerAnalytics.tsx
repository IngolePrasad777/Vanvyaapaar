import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Card, CardContent, Grid, Stack,
  Button, Select, MenuItem, FormControl, InputLabel,
  Chip, Avatar, alpha, Paper
} from '@mui/material'
import {
  TrendingUp, ShoppingCart, Inventory, AttachMoney,
  ArrowForward, Star, LocalShipping, CheckCircle, Schedule,
  BarChart, Refresh
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import sellerService from '../../services/sellerService'
import { formatPrice } from '../../lib/utils'
import toast from 'react-hot-toast'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import LoadingAnimation from '../../components/common/LoadingAnimation'

interface AnalyticsData {
  totalSales: number
  totalOrders: number
  totalProducts: number
  totalRevenue: number
  monthlyGrowth: number
  orderGrowth: number
  topProducts: Array<{
    id: number
    name: string
    sales: number
    revenue: number
    image?: string
  }>
  recentOrders: Array<{
    id: number
    buyerName: string
    amount: number
    status: string
    date: string
  }>
  salesData: Array<{
    month: string
    sales: number
    orders: number
  }>
}

const SellerAnalytics = () => {
  const { user } = useAuthStore()
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [refreshing, setRefreshing] = useState(false)
  const [changingPeriod, setChangingPeriod] = useState(false)

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, period])

  const fetchAnalytics = async (showPeriodLoading = false) => {
    if (!user) return
    
    try {
      if (showPeriodLoading) {
        setChangingPeriod(true)
      } else {
        setLoading(true)
      }
      
      const data = await sellerService.getAnalytics(user.id, period)
      
      if (data) {
        // Use real API data
        const analyticsData: AnalyticsData = {
          totalSales: data.totalSales || 0,
          totalOrders: data.totalOrders || 0,
          totalProducts: data.totalProducts || 0,
          totalRevenue: data.totalRevenue || 0,
          monthlyGrowth: data.monthlyGrowth || 0,
          orderGrowth: data.orderGrowth || 0,
          topProducts: Array.isArray(data.topProducts) ? data.topProducts : [],
          recentOrders: Array.isArray(data.recentOrders) ? data.recentOrders : [],
          salesData: Array.isArray(data.salesData) ? data.salesData : []
        }
        
        setAnalytics(analyticsData)
        
        if (showPeriodLoading) {
          const periodLabels = {
            week: 'this week',
            month: 'this month', 
            quarter: 'this quarter',
            year: 'this year'
          }
          toast.success(`Analytics updated for ${periodLabels[period as keyof typeof periodLabels] || period}`)
        }
      } else {
        throw new Error('No data received from server')
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      
      // If API fails, show mock data with a warning
      const mockData: AnalyticsData = {
        totalSales: 45,
        totalOrders: 128,
        totalProducts: 23,
        totalRevenue: 125000,
        monthlyGrowth: 12.5,
        orderGrowth: 8.3,
        topProducts: [
          { id: 1, name: 'Handwoven Tribal Basket', sales: 15, revenue: 22500, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' },
          { id: 2, name: 'Ceramic Pottery Set', sales: 12, revenue: 18000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' },
          { id: 3, name: 'Wooden Sculpture', sales: 8, revenue: 12000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' },
          { id: 4, name: 'Traditional Jewelry', sales: 6, revenue: 9000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' },
          { id: 5, name: 'Embroidered Textiles', sales: 4, revenue: 6000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' }
        ],
        recentOrders: [
          { id: 101, buyerName: 'Priya Sharma', amount: 1500, status: 'DELIVERED', date: '2024-01-15' },
          { id: 102, buyerName: 'Raj Kumar', amount: 2200, status: 'SHIPPED', date: '2024-01-14' },
          { id: 103, buyerName: 'Anita Singh', amount: 800, status: 'PROCESSING', date: '2024-01-13' },
          { id: 104, buyerName: 'Vikram Patel', amount: 3200, status: 'DELIVERED', date: '2024-01-12' },
          { id: 105, buyerName: 'Meera Gupta', amount: 1800, status: 'SHIPPED', date: '2024-01-11' }
        ],
        salesData: [
          { month: 'Jul', sales: 35000, orders: 45 },
          { month: 'Aug', sales: 42000, orders: 52 },
          { month: 'Sep', sales: 38000, orders: 48 },
          { month: 'Oct', sales: 55000, orders: 68 },
          { month: 'Nov', sales: 48000, orders: 58 },
          { month: 'Dec', sales: 62000, orders: 75 }
        ]
      }
      
      setAnalytics(mockData)
      toast.error('Failed to load analytics data. Using demo data.')
    } finally {
      setLoading(false)
      setChangingPeriod(false)
    }
  }

  const handlePeriodChange = async (newPeriod: string) => {
    setPeriod(newPeriod)
    // Trigger analytics fetch with period loading indicator
    setTimeout(() => fetchAnalytics(true), 100)
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchAnalytics()
    setRefreshing(false)
    toast.success('Analytics refreshed!')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return '#10B981'
      case 'SHIPPED': return '#3B82F6'
      case 'PROCESSING': return '#F59E0B'
      case 'PENDING': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle />
      case 'SHIPPED': return <LocalShipping />
      case 'PROCESSING': return <Schedule />
      default: return <Schedule />
    }
  }

  if (loading) {
    return (
      <LoadingAnimation 
        variant="tribal" 
        size="large" 
        text="Loading analytics..." 
        fullScreen={true}
      />
    )
  }

  if (!analytics) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#F5F5F4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">Failed to load analytics data</Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#F5F5F4', 
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground variant="geometric" intensity="light" color="#8B7355" />
      
      <Container maxWidth="xl" sx={{ py: 6, px: { xs: 2, sm: 3, md: 4 }, position: 'relative' }}>
        {/* Loading Overlay for Period Changes */}
        {changingPeriod && (
          <Box sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: alpha('#FFFFFF', 0.8),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }}>
            <Stack alignItems="center" spacing={2}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <BarChart sx={{ fontSize: 48, color: '#D4A574' }} />
              </motion.div>
              <Typography variant="h6" sx={{ color: '#D4A574', fontWeight: 'bold' }}>
                Updating Analytics...
              </Typography>
            </Stack>
          </Box>
        )}
        
        <Stack spacing={6}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
              backdropFilter: 'blur(10px)',
              borderRadius: 4,
              p: 4,
              border: '1px solid',
              borderColor: alpha('#D4A574', 0.2),
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
            }}>
              <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between" spacing={3}>
                <Box>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1F2937',
                      fontFamily: 'serif',
                      mb: 1,
                      fontSize: { xs: '2rem', md: '3rem' }
                    }}
                  >
                    Analytics Dashboard
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'text.secondary', fontSize: { xs: '1rem', md: '1.25rem' } }}>
                    Track your business performance and insights across all metrics
                  </Typography>
                </Box>
                
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ minWidth: { sm: 'auto', md: '300px' } }}>
                  <Button
                    onClick={handleRefresh}
                    disabled={refreshing}
                    startIcon={<Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />}
                    variant="outlined"
                    size="large"
                    sx={{
                      borderColor: '#D4A574',
                      color: '#8B7355',
                      px: 3,
                      py: 1.5,
                      fontWeight: 'bold',
                      '&:hover': {
                        borderColor: '#C9A86A',
                        bgcolor: alpha('#D4A574', 0.1)
                      }
                    }}
                  >
                    Refresh Data
                  </Button>
                  
                  <FormControl size="medium" sx={{ minWidth: 160 }}>
                    <InputLabel>Time Period</InputLabel>
                    <Select
                      value={period}
                      label="Time Period"
                      onChange={(e) => handlePeriodChange(e.target.value)}
                      disabled={changingPeriod}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': {
                            borderColor: alpha('#D4A574', 0.3)
                          },
                          '&:hover fieldset': {
                            borderColor: '#D4A574'
                          }
                        }
                      }}
                    >
                      <MenuItem value="week">This Week</MenuItem>
                      <MenuItem value="month">This Month</MenuItem>
                      <MenuItem value="quarter">This Quarter</MenuItem>
                      <MenuItem value="year">This Year</MenuItem>
                    </Select>
                    {changingPeriod && (
                      <Typography variant="caption" sx={{ color: '#D4A574', mt: 0.5 }}>
                        Updating data...
                      </Typography>
                    )}
                  </FormControl>
                </Stack>
              </Stack>
            </Box>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Grid container spacing={4}>
              {[
                {
                  title: 'Total Revenue',
                  value: formatPrice(analytics.totalRevenue),
                  change: `${analytics.monthlyGrowth >= 0 ? '+' : ''}${analytics.monthlyGrowth.toFixed(1)}%`,
                  icon: <AttachMoney sx={{ fontSize: 48 }} />,
                  color: '#10B981',
                  description: 'Total earnings this period'
                },
                {
                  title: 'Total Orders',
                  value: analytics.totalOrders.toString(),
                  change: `${analytics.orderGrowth >= 0 ? '+' : ''}${analytics.orderGrowth.toFixed(1)}%`,
                  icon: <ShoppingCart sx={{ fontSize: 48 }} />,
                  color: '#3B82F6',
                  description: 'Orders received'
                },
                {
                  title: 'Products Sold',
                  value: analytics.totalSales.toString(),
                  change: '+15.2%',
                  icon: <Inventory sx={{ fontSize: 48 }} />,
                  color: '#F59E0B',
                  description: 'Items sold successfully'
                },
                {
                  title: 'Active Products',
                  value: analytics.totalProducts.toString(),
                  change: '+2',
                  icon: <BarChart sx={{ fontSize: 48 }} />,
                  color: '#8B5CF6',
                  description: 'Products in catalog'
                }
              ].map((stat, index) => (
                <Grid size={{ xs: 12, sm: 6, lg: 3 }} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -8, scale: 1.02 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 4,
                        border: '1px solid',
                        borderColor: alpha(stat.color, 0.15),
                        bgcolor: '#FFFFFF',
                        height: '100%',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          borderColor: alpha(stat.color, 0.4),
                          boxShadow: `0 12px 32px ${alpha(stat.color, 0.15)}`,
                          transform: 'translateY(-8px) scale(1.02)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 4 }}>
                        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 3 }}>
                          <Avatar
                            sx={{
                              width: 72,
                              height: 72,
                              bgcolor: alpha(stat.color, 0.1),
                              color: stat.color,
                              border: '3px solid',
                              borderColor: alpha(stat.color, 0.2)
                            }}
                          >
                            {stat.icon}
                          </Avatar>
                          <Chip
                            label={stat.change}
                            size="small"
                            icon={<TrendingUp />}
                            sx={{
                              bgcolor: alpha(stat.change.startsWith('+') ? '#10B981' : '#EF4444', 0.1),
                              color: stat.change.startsWith('+') ? '#10B981' : '#EF4444',
                              fontWeight: 'bold',
                              fontSize: '0.8rem'
                            }}
                          />
                        </Stack>
                        <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#1F2937', fontWeight: 600, mb: 1 }}>
                          {stat.title}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {stat.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Charts and Data */}
          <Grid container spacing={5}>
            {/* Sales Chart */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: alpha('#D4A574', 0.15),
                    bgcolor: '#FFFFFF',
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 5 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
                          Sales Overview
                        </Typography>
                        <Typography variant="body1" sx={{ color: 'text.secondary', fontSize: '1.1rem' }}>
                          Monthly sales performance and growth trends
                        </Typography>
                      </Box>
                      <Stack direction="row" spacing={2}>
                        <Chip
                          icon={<TrendingUp />}
                          label="Trending Up"
                          sx={{
                            bgcolor: alpha('#10B981', 0.1),
                            color: '#10B981',
                            fontWeight: 'bold',
                            px: 2,
                            py: 1
                          }}
                        />
                        <Chip
                          icon={<BarChart />}
                          label="6 Months"
                          sx={{
                            bgcolor: alpha('#D4A574', 0.1),
                            color: '#D4A574',
                            fontWeight: 'bold',
                            px: 2,
                            py: 1
                          }}
                        />
                      </Stack>
                    </Stack>
                    
                    {/* Enhanced Bar Chart */}
                    <Box sx={{ 
                      height: 400, 
                      display: 'flex', 
                      alignItems: 'end', 
                      gap: 3, 
                      px: 3,
                      py: 2,
                      background: 'linear-gradient(135deg, rgba(212, 165, 116, 0.02) 0%, rgba(139, 115, 85, 0.02) 100%)',
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: alpha('#D4A574', 0.1)
                    }}>
                      {analytics.salesData.map((data, index) => (
                        <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: '100%',
                              maxWidth: 60,
                              height: `${(data.sales / 70000) * 320}px`,
                              background: `linear-gradient(135deg, #D4A574 0%, #C9A86A 50%, #A0826D 100%)`,
                              borderRadius: '8px 8px 0 0',
                              mb: 2,
                              position: 'relative',
                              transition: 'all 0.3s',
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(212, 165, 116, 0.2)',
                              '&:hover': {
                                background: `linear-gradient(135deg, #C9A86A 0%, #D4A574 50%, #8B7355 100%)`,
                                transform: 'scaleY(1.05) scaleX(1.1)',
                                boxShadow: '0 8px 20px rgba(212, 165, 116, 0.3)'
                              },
                              '&::before': {
                                content: `"${formatPrice(data.sales)}"`,
                                position: 'absolute',
                                top: -35,
                                left: '50%',
                                transform: 'translateX(-50%)',
                                background: '#1F2937',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.75rem',
                                fontWeight: 'bold',
                                opacity: 0,
                                transition: 'opacity 0.3s',
                                whiteSpace: 'nowrap'
                              },
                              '&:hover::before': {
                                opacity: 1
                              }
                            }}
                          />
                          <Stack alignItems="center" spacing={0.5}>
                            <Typography variant="h6" sx={{ color: '#1F2937', fontWeight: 'bold' }}>
                              {data.month}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {data.orders} orders
                            </Typography>
                          </Stack>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Top Products */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: alpha('#D4A574', 0.15),
                    bgcolor: '#FFFFFF',
                    height: '100%'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 0.5 }}>
                          Top Products
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Best performing items
                        </Typography>
                      </Box>
                      <Star sx={{ color: '#F59E0B', fontSize: 28 }} />
                    </Stack>
                    
                    <Stack spacing={2}>
                      {analytics.topProducts.slice(0, 5).map((product, index) => (
                        <Box
                          key={product.id}
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            p: 2,
                            borderRadius: 3,
                            bgcolor: alpha('#D4A574', 0.05),
                            border: '1px solid',
                            borderColor: alpha('#D4A574', 0.1),
                            transition: 'all 0.3s',
                            '&:hover': {
                              bgcolor: alpha('#D4A574', 0.1),
                              borderColor: alpha('#D4A574', 0.2)
                            }
                          }}
                        >
                          <Avatar
                            src={product.image}
                            sx={{
                              width: 40,
                              height: 40,
                              mr: 2,
                              bgcolor: alpha('#D4A574', 0.2)
                            }}
                          >
                            {product.name.charAt(0)}
                          </Avatar>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle2"
                              sx={{
                                fontWeight: 'bold',
                                color: '#1F2937',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              {product.name}
                            </Typography>
                            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                              {product.sales} sold • {formatPrice(product.revenue)}
                            </Typography>
                          </Box>
                          <Chip
                            label={`#${index + 1}`}
                            size="small"
                            sx={{
                              bgcolor: index === 0 ? alpha('#F59E0B', 0.2) : alpha('#D4A574', 0.1),
                              color: index === 0 ? '#F59E0B' : '#8B4513',
                              fontWeight: 'bold',
                              minWidth: 32
                            }}
                          />
                        </Box>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Recent Orders */}
            <Grid size={{ xs: 12 }}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '1px solid',
                    borderColor: alpha('#D4A574', 0.15),
                    bgcolor: '#FFFFFF'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 0.5 }}>
                          Recent Orders
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Latest customer orders and their status
                        </Typography>
                      </Box>
                      <Button
                        component={Link}
                        to="/seller/orders"
                        variant="outlined"
                        size="small"
                        endIcon={<ArrowForward />}
                        sx={{
                          color: '#8B4513',
                          borderColor: '#D4A574',
                          '&:hover': {
                            bgcolor: alpha('#D4A574', 0.1),
                            borderColor: '#D4A574'
                          }
                        }}
                      >
                        View All
                      </Button>
                    </Stack>
                    
                    <Stack spacing={2}>
                      {analytics.recentOrders.map((order, index) => (
                        <motion.div
                          key={order.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                        >
                          <Paper
                            sx={{
                              p: 3,
                              borderRadius: 3,
                              border: '1px solid',
                              borderColor: alpha('#D4A574', 0.1),
                              transition: 'all 0.3s',
                              '&:hover': {
                                borderColor: alpha('#D4A574', 0.3),
                                boxShadow: `0 4px 15px ${alpha('#D4A574', 0.1)}`
                              }
                            }}
                          >
                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Avatar
                                  sx={{
                                    bgcolor: alpha(getStatusColor(order.status), 0.1),
                                    color: getStatusColor(order.status),
                                    width: 40,
                                    height: 40
                                  }}
                                >
                                  {getStatusIcon(order.status)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                                    Order #{order.id}
                                  </Typography>
                                  <Stack direction="row" alignItems="center" spacing={2}>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {order.buyerName}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      {new Date(order.date).toLocaleDateString()}
                                    </Typography>
                                  </Stack>
                                </Box>
                              </Stack>
                              
                              <Stack direction="row" alignItems="center" spacing={2}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                                  {formatPrice(order.amount)}
                                </Typography>
                                <Chip
                                  label={order.status}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(getStatusColor(order.status), 0.1),
                                    color: getStatusColor(order.status),
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Stack>
                            </Stack>
                          </Paper>
                        </motion.div>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          </Grid>
        </Stack>
      </Container>

      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
    </Box>
  )
}

export default SellerAnalytics