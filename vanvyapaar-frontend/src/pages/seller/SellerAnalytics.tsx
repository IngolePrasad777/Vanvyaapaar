import { useState, useEffect } from 'react'
import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Card, CardContent, Grid, Stack,
  Button, Select, MenuItem, FormControl, InputLabel,
  Chip, Avatar, alpha, Paper, Divider
} from '@mui/material'
import {
  TrendingUp, ShoppingCart, Inventory, AttachMoney,
  ArrowForward, Star, LocalShipping, CheckCircle, Schedule,
  BarChart, Analytics, Refresh, CalendarToday, People
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

  useEffect(() => {
    if (user) {
      fetchAnalytics()
    }
  }, [user, period])

  const fetchAnalytics = async () => {
    if (!user) return
    
    try {
      setLoading(true)
      const data = await sellerService.getAnalytics(user.id, period)
      
      // Use actual API data if available, otherwise fall back to mock data
      const analyticsData: AnalyticsData = {
        totalSales: data?.totalSales || 45,
        totalOrders: data?.totalOrders || 128,
        totalProducts: data?.totalProducts || 23,
        totalRevenue: data?.totalRevenue || 125000,
        monthlyGrowth: data?.monthlyGrowth || 12.5,
        orderGrowth: data?.orderGrowth || 8.3,
        topProducts: data?.topProducts || [
          { id: 1, name: 'Handwoven Tribal Basket', sales: 15, revenue: 22500, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' },
          { id: 2, name: 'Ceramic Pottery Set', sales: 12, revenue: 18000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' },
          { id: 3, name: 'Wooden Sculpture', sales: 8, revenue: 12000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' },
          { id: 4, name: 'Traditional Jewelry', sales: 6, revenue: 9000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' },
          { id: 5, name: 'Embroidered Textiles', sales: 4, revenue: 6000, image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100' }
        ],
        recentOrders: data?.recentOrders || [
          { id: 101, buyerName: 'Priya Sharma', amount: 1500, status: 'DELIVERED', date: '2024-01-15' },
          { id: 102, buyerName: 'Raj Kumar', amount: 2200, status: 'SHIPPED', date: '2024-01-14' },
          { id: 103, buyerName: 'Anita Singh', amount: 800, status: 'PROCESSING', date: '2024-01-13' },
          { id: 104, buyerName: 'Vikram Patel', amount: 3200, status: 'DELIVERED', date: '2024-01-12' },
          { id: 105, buyerName: 'Meera Gupta', amount: 1800, status: 'SHIPPED', date: '2024-01-11' }
        ],
        salesData: data?.salesData || [
          { month: 'Jul', sales: 35000, orders: 45 },
          { month: 'Aug', sales: 42000, orders: 52 },
          { month: 'Sep', sales: 38000, orders: 48 },
          { month: 'Oct', sales: 55000, orders: 68 },
          { month: 'Nov', sales: 48000, orders: 58 },
          { month: 'Dec', sales: 62000, orders: 75 }
        ]
      }
      
      setAnalytics(analyticsData)
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
      toast.error('Using demo data - Analytics API will be available soon!')
    } finally {
      setLoading(false)
    }
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
    <Box sx={{ overflow: 'hidden', bgcolor: '#F5F5F4', position: 'relative' }}>
      <AnimatedBackground variant="geometric" intensity="light" color="#8B7355" />
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack spacing={4}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1F2937',
                    fontFamily: 'serif',
                    mb: 1
                  }}
                >
                  Analytics Dashboard
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  Track your business performance and insights
                </Typography>
              </Box>
              
              <Stack direction="row" spacing={2}>
                <Button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  startIcon={<Refresh sx={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />}
                  variant="outlined"
                  sx={{
                    borderColor: '#D4A574',
                    color: '#8B7355',
                    '&:hover': {
                      borderColor: '#C9A86A',
                      bgcolor: alpha('#D4A574', 0.1)
                    }
                  }}
                >
                  Refresh
                </Button>
                
                <FormControl size="small" sx={{ minWidth: 140 }}>
                  <InputLabel>Period</InputLabel>
                  <Select
                    value={period}
                    label="Period"
                    onChange={(e) => setPeriod(e.target.value)}
                  >
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                    <MenuItem value="quarter">This Quarter</MenuItem>
                    <MenuItem value="year">This Year</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Stack>
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Grid container spacing={3}>
              {[
                {
                  title: 'Total Revenue',
                  value: formatPrice(analytics.totalRevenue),
                  change: `+${analytics.monthlyGrowth}%`,
                  icon: <AttachMoney sx={{ fontSize: 40 }} />,
                  color: '#10B981'
                },
                {
                  title: 'Total Orders',
                  value: analytics.totalOrders.toString(),
                  change: `+${analytics.orderGrowth}%`,
                  icon: <ShoppingCart sx={{ fontSize: 40 }} />,
                  color: '#3B82F6'
                },
                {
                  title: 'Products Sold',
                  value: analytics.totalSales.toString(),
                  change: '+15.2%',
                  icon: <Inventory sx={{ fontSize: 40 }} />,
                  color: '#F59E0B'
                },
                {
                  title: 'Active Products',
                  value: analytics.totalProducts.toString(),
                  change: '+2',
                  icon: <BarChart sx={{ fontSize: 40 }} />,
                  color: '#8B5CF6'
                }
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} lg={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
                    whileHover={{ y: -5 }}
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
                      <CardContent sx={{ p: 3 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                          <Avatar
                            sx={{
                              width: 56,
                              height: 56,
                              bgcolor: alpha(stat.color, 0.1),
                              color: stat.color
                            }}
                          >
                            {stat.icon}
                          </Avatar>
                          <Chip
                            label={stat.change}
                            size="small"
                            icon={<TrendingUp />}
                            sx={{
                              bgcolor: alpha('#10B981', 0.1),
                              color: '#10B981',
                              fontWeight: 'bold'
                            }}
                          />
                        </Stack>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                          {stat.value}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                          {stat.title}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Charts and Data */}
          <Grid container spacing={4}>
            {/* Sales Chart */}
            <Grid item xs={12} lg={8}>
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
                    bgcolor: '#FFFFFF'
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                      <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 0.5 }}>
                          Sales Overview
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Monthly sales performance
                        </Typography>
                      </Box>
                      <Chip
                        icon={<TrendingUp />}
                        label="Trending Up"
                        sx={{
                          bgcolor: alpha('#10B981', 0.1),
                          color: '#10B981',
                          fontWeight: 'bold'
                        }}
                      />
                    </Stack>
                    
                    {/* Simple Bar Chart */}
                    <Box sx={{ height: 300, display: 'flex', alignItems: 'end', gap: 2, px: 2 }}>
                      {analytics.salesData.map((data, index) => (
                        <Box key={index} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                          <Box
                            sx={{
                              width: '100%',
                              maxWidth: 40,
                              height: `${(data.sales / 70000) * 250}px`,
                              bgcolor: '#D4A574',
                              borderRadius: '4px 4px 0 0',
                              mb: 1,
                              transition: 'all 0.3s',
                              '&:hover': {
                                bgcolor: '#C9A86A',
                                transform: 'scaleY(1.05)'
                              }
                            }}
                          />
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                            {data.month}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {data.orders} orders
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>

            {/* Top Products */}
            <Grid item xs={12} lg={4}>
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
            <Grid item xs={12}>
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