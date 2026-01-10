import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Box, Container, Typography, CardContent, Chip, Button,
  Stack, Avatar, IconButton, TextField, InputAdornment,
  Select, MenuItem, FormControl, InputLabel, Grid, Paper,
  Stepper, Step, StepLabel, alpha, Collapse, Dialog,
  DialogTitle, DialogContent, DialogActions, Rating,
  Divider, List, ListItem, ListItemAvatar, ListItemText
} from '@mui/material'
import {
  ShoppingBag, Schedule, LocalShipping, CheckCircle, Cancel,
  Search, Visibility, Star, ExpandMore, ExpandLess,
  Receipt, Inventory, Person, CalendarToday, Close
} from '@mui/icons-material'
import { Order } from '../../types'
import { useAuthStore } from '../../store/authStore'
import buyerService from '../../services/buyerService'
import { formatPrice } from '../../lib/utils'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'
import LoadingAnimation from '../../components/common/LoadingAnimation'
import toast from 'react-hot-toast'

const BuyerOrders = () => {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderDetailsOpen, setOrderDetailsOpen] = useState(false)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewData, setReviewData] = useState({
    productId: 0,
    rating: 0,
    comment: ''
  })


  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return

    try {
      setLoading(true)
      const data = await buyerService.getOrders(user.id)
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Schedule sx={{ fontSize: 20 }} />
      case 'CONFIRMED':
        return <CheckCircle sx={{ fontSize: 20 }} />
      case 'SHIPPED':
        return <LocalShipping sx={{ fontSize: 20 }} />
      case 'DELIVERED':
        return <CheckCircle sx={{ fontSize: 20 }} />
      case 'CANCELLED':
        return <Cancel sx={{ fontSize: 20 }} />
      default:
        return <ShoppingBag sx={{ fontSize: 20 }} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return { bg: '#FEF3C7', color: '#D97706', border: '#F59E0B' }
      case 'CONFIRMED':
        return { bg: '#DBEAFE', color: '#1D4ED8', border: '#3B82F6' }
      case 'SHIPPED':
        return { bg: '#E0E7FF', color: '#6366F1', border: '#8B5CF6' }
      case 'DELIVERED':
        return { bg: '#D1FAE5', color: '#059669', border: '#10B981' }
      case 'CANCELLED':
        return { bg: '#FEE2E2', color: '#DC2626', border: '#EF4444' }
      default:
        return { bg: '#F3F4F6', color: '#6B7280', border: '#9CA3AF' }
    }
  }

  const getOrderProgress = (status: string) => {
    const steps = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED']
    const currentIndex = steps.indexOf(status?.toUpperCase())
    return currentIndex >= 0 ? currentIndex : 0
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setOrderDetailsOpen(true)
  }

  const handleWriteReview = (order: Order, productId?: number) => {
    setSelectedOrder(order)
    setReviewData({
      productId: productId || (order.items?.[0]?.product?.id || 0),
      rating: 0,
      comment: ''
    })
    setReviewDialogOpen(true)
  }

  const handleSubmitReview = async () => {
    if (!selectedOrder || !reviewData.rating) {
      toast.error('Please provide a rating')
      return
    }

    try {
      // Submit the review to the backend
      await buyerService.addReview(
        user!.id, 
        reviewData.productId, 
        reviewData.rating, 
        reviewData.comment
      )
      toast.success('Review submitted successfully!')
      setReviewDialogOpen(false)
      setReviewData({ productId: 0, rating: 0, comment: '' })
    } catch (error) {
      console.error('Review submission error:', error)
      toast.error('Failed to submit review')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm ||
      order.id.toString().includes(searchTerm) ||
      order.items?.some(item =>
        item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesStatus = statusFilter === 'all' ||
      order.status?.toUpperCase() === statusFilter.toUpperCase()

    return matchesSearch && matchesStatus
  })

  if (loading) {
    return (
      <LoadingAnimation
        variant="tribal"
        size="large"
        text="Loading your orders..."
        fullScreen={false}
      />
    )
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#FAFAF9' }}>
      <AnimatedBackground variant="particles" intensity="light" color="#D4A574" />
      <FloatingElements
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <ShoppingBag />,
            label: 'Continue Shopping',
            onClick: () => window.location.href = '/buyer/products',
            color: '#D4A574'
          },
          {
            icon: <Receipt />,
            label: 'Download Receipt',
            onClick: () => toast('Receipt download coming soon!'),
            color: '#C9A86A'
          }
        ]}
      />

      <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
              <Box sx={{
                width: 56,
                height: 56,
                bgcolor: alpha('#D4A574', 0.15),
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <ShoppingBag sx={{ fontSize: 32, color: '#D4A574' }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', fontFamily: 'serif' }}>
                  My Orders
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Track and manage your purchases
                </Typography>
              </Box>
            </Stack>

            {/* Search and Filter */}
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 3 }}>
              <TextField
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  )
                }}
                sx={{
                  flex: 1,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    bgcolor: 'white'
                  }
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Filter by Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  sx={{ borderRadius: 3, bgcolor: 'white' }}
                >
                  <MenuItem value="all">All Orders</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="shipped">Shipped</MenuItem>
                  <MenuItem value="delivered">Delivered</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </motion.div>

        {/* Orders Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {[
              {
                label: 'Total Orders',
                value: orders.length,
                color: '#D4A574',
                icon: <ShoppingBag sx={{ fontSize: 24 }} />
              },
              {
                label: 'Delivered',
                value: orders.filter(o => o.status?.toUpperCase() === 'DELIVERED').length,
                color: '#10B981',
                icon: <CheckCircle sx={{ fontSize: 24 }} />
              },
              {
                label: 'In Transit',
                value: orders.filter(o => ['SHIPPED', 'CONFIRMED'].includes(o.status?.toUpperCase() || '')).length,
                color: '#6366F1',
                icon: <LocalShipping sx={{ fontSize: 24 }} />
              },
              {
                label: 'Pending',
                value: orders.filter(o => o.status?.toUpperCase() === 'PENDING').length,
                color: '#F59E0B',
                icon: <Schedule sx={{ fontSize: 24 }} />
              }
            ].map((stat, index) => (
              <Grid size={{ xs: 6, md: 3 }} key={index}>
                <EnhancedCard
                  hoverEffect="glow"
                  glowColor={stat.color}
                  sx={{
                    textAlign: 'center',
                    p: 3,
                    borderRadius: 4,
                    border: `2px solid ${alpha(stat.color, 0.2)}`
                  }}
                >
                  <Box sx={{ color: stat.color, mb: 2 }}>
                    {stat.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    {stat.label}
                  </Typography>
                </EnhancedCard>
              </Grid>
            ))}
          </Grid>
        </motion.div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <Paper
              sx={{
                textAlign: 'center',
                py: 8,
                px: 4,
                borderRadius: 4,
                border: `1px solid ${alpha('#D4A574', 0.2)}`
              }}
            >
              <ShoppingBag sx={{ fontSize: 80, color: alpha('#D4A574', 0.5), mb: 3 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                {orders.length === 0 ? 'No orders yet' : 'No matching orders'}
              </Typography>
              <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                {orders.length === 0
                  ? 'Start shopping to see your orders here'
                  : 'Try adjusting your search or filter criteria'
                }
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={() => window.location.href = '/buyer/products'}
                sx={{
                  bgcolor: '#D4A574',
                  color: 'white',
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  '&:hover': {
                    bgcolor: '#C9A86A',
                    transform: 'translateY(-2px)',
                    boxShadow: `0 12px 35px ${alpha('#D4A574', 0.4)}`
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start Shopping
              </Button>
            </Paper>
          </motion.div>
        ) : (
          <Stack spacing={3}>
            <AnimatePresence>
              {filteredOrders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <EnhancedCard
                    hoverEffect="lift"
                    glowColor="#D4A574"
                    intensity="medium"
                    sx={{
                      borderRadius: 4,
                      border: `1px solid ${alpha('#D4A574', 0.2)}`,
                      overflow: 'hidden'
                    }}
                  >
                    <CardContent sx={{ p: 0 }}>
                      {/* Order Header */}
                      <Box sx={{ p: 3, bgcolor: alpha('#D4A574', 0.05) }}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 0.5 }}>
                              Order #{order.id}
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                  {formatDate(order.orderDate)}
                                </Typography>
                              </Box>
                              {order.seller?.name && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <Person sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    by {order.seller.name}
                                  </Typography>
                                </Box>
                              )}
                            </Stack>
                          </Box>

                          <Stack alignItems="flex-end" spacing={1}>
                            <Chip
                              icon={getStatusIcon(order.status)}
                              label={order.status || 'Unknown'}
                              sx={{
                                bgcolor: getStatusColor(order.status).bg,
                                color: getStatusColor(order.status).color,
                                border: `1px solid ${getStatusColor(order.status).border}`,
                                fontWeight: 600,
                                '& .MuiChip-icon': {
                                  color: getStatusColor(order.status).color
                                }
                              }}
                            />
                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                              {formatPrice(order.totalAmount || 0)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>

                      {/* Order Items Preview */}
                      <Box sx={{ p: 3 }}>
                        {order.items && order.items.length > 0 && (
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                            <Avatar
                              src={order.items[0].product?.imageUrl}
                              alt={order.items[0].product?.name}
                              sx={{
                                width: 60,
                                height: 60,
                                borderRadius: 2,
                                border: `2px solid ${alpha('#D4A574', 0.3)}`
                              }}
                            >
                              <Inventory />
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1F2937' }}>
                                {order.items[0].product?.name || `Order #${order.id}`}
                              </Typography>
                              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                {order.items[0].product?.category || 'Product'}
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#D4A574', fontWeight: 600 }}>
                                {order.items.reduce((sum, item) => sum + item.quantity, 0)} item(s) • {order.items.length} product(s)
                              </Typography>
                            </Box>
                            <IconButton
                              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                              sx={{ color: '#D4A574' }}
                            >
                              {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Stack>
                        )}

                        {/* Order Progress */}
                        <Stepper
                          activeStep={getOrderProgress(order.status)}
                          alternativeLabel
                          sx={{ mb: 3 }}
                        >
                          {['Order Placed', 'Confirmed', 'Shipped', 'Delivered'].map((label, index) => (
                            <Step key={label}>
                              <StepLabel
                                sx={{
                                  '& .MuiStepLabel-label': {
                                    fontSize: '0.75rem',
                                    fontWeight: 600
                                  },
                                  '& .MuiStepIcon-root': {
                                    color: index <= getOrderProgress(order.status) ? '#D4A574' : '#E5E7EB'
                                  }
                                }}
                              >
                                {label}
                              </StepLabel>
                            </Step>
                          ))}
                        </Stepper>

                        {/* Action Buttons */}
                        <Stack direction="row" spacing={2}>
                          <Button
                            variant="outlined"
                            startIcon={<Visibility />}
                            onClick={() => handleViewDetails(order)}
                            sx={{
                              borderColor: '#D4A574',
                              color: '#D4A574',
                              '&:hover': {
                                bgcolor: alpha('#D4A574', 0.1),
                                borderColor: '#C9A86A'
                              }
                            }}
                          >
                            View Details
                          </Button>

                          {['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status?.toUpperCase() || '') && (
                            <Button
                              variant="outlined"
                              startIcon={<LocalShipping />}
                              onClick={() => window.open(`/delivery/track/${order.id}`, '_blank')}
                              sx={{
                                borderColor: '#2196F3',
                                color: '#2196F3',
                                '&:hover': {
                                  bgcolor: alpha('#2196F3', 0.1),
                                  borderColor: '#1976D2'
                                }
                              }}
                            >
                              Track Delivery
                            </Button>
                          )}

                          {order.status?.toUpperCase() === 'DELIVERED' && (
                            <Button
                              variant="contained"
                              startIcon={<Star />}
                              onClick={() => handleWriteReview(order)}
                              sx={{
                                bgcolor: '#D4A574',
                                '&:hover': { bgcolor: '#C9A86A' }
                              }}
                            >
                              Write Review
                            </Button>
                          )}
                        </Stack>

                        {/* Expanded Order Details */}
                        <Collapse in={expandedOrder === order.id}>
                          <Box sx={{ mt: 3, pt: 3, borderTop: `1px solid ${alpha('#D4A574', 0.2)}` }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1F2937' }}>
                              Order Items
                            </Typography>
                            <Stack spacing={2}>
                              {order.items?.map((item, idx) => (
                                <Box
                                  key={idx}
                                  sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    p: 2,
                                    bgcolor: alpha('#D4A574', 0.05),
                                    borderRadius: 2
                                  }}
                                >
                                  <Avatar
                                    src={item.product?.imageUrl}
                                    alt={item.product?.name}
                                    sx={{ width: 50, height: 50, borderRadius: 2 }}
                                  >
                                    <Inventory />
                                  </Avatar>
                                  <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                      {item.product?.name || 'Product'}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                      Quantity: {item.quantity}
                                    </Typography>
                                  </Box>
                                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                                    {formatPrice((item.product?.price || 0) * item.quantity)}
                                  </Typography>
                                </Box>
                              ))}
                            </Stack>
                          </Box>
                        </Collapse>
                      </Box>
                    </CardContent>
                  </EnhancedCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </Stack>
        )}
      </Container>

      {/* Order Details Dialog */}
      <Dialog
        open={orderDetailsOpen}
        onClose={() => setOrderDetailsOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            maxHeight: '90vh'
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: alpha('#D4A574', 0.1),
          borderBottom: `1px solid ${alpha('#D4A574', 0.2)}`
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
              Order Details
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Order #{selectedOrder?.id}
            </Typography>
          </Box>
          <IconButton onClick={() => setOrderDetailsOpen(false)} sx={{ color: '#6B7280' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 0 }}>
          {selectedOrder && (
            <Box>
              {/* Order Summary */}
              <Box sx={{ p: 3, bgcolor: alpha('#D4A574', 0.05) }}>
                <Grid container spacing={3}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Order Date
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <CalendarToday sx={{ fontSize: 16, color: '#D4A574' }} />
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {formatDate(selectedOrder.orderDate)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Order Status
                        </Typography>
                        <Chip
                          icon={getStatusIcon(selectedOrder.status)}
                          label={selectedOrder.status || 'Unknown'}
                          sx={{
                            bgcolor: getStatusColor(selectedOrder.status).bg,
                            color: getStatusColor(selectedOrder.status).color,
                            border: `1px solid ${getStatusColor(selectedOrder.status).border}`,
                            fontWeight: 600,
                            '& .MuiChip-icon': {
                              color: getStatusColor(selectedOrder.status).color
                            }
                          }}
                        />
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid size={{ xs: 12, md: 6 }}>
                    <Stack spacing={2}>
                      {selectedOrder.seller && (
                        <Box>
                          <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            Seller Information
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Person sx={{ fontSize: 16, color: '#D4A574' }} />
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {selectedOrder.seller.name || selectedOrder.seller.email}
                            </Typography>
                          </Box>
                        </Box>
                      )}

                      <Box>
                        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                          Total Amount
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                          {formatPrice(selectedOrder.totalAmount || 0)}
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
              </Box>

              <Divider />

              {/* Order Progress */}
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#1F2937' }}>
                  Order Progress
                </Typography>
                <Stepper activeStep={getOrderProgress(selectedOrder.status)} orientation="vertical">
                  {[
                    { label: 'Order Placed', description: 'Your order has been received' },
                    { label: 'Order Confirmed', description: 'Seller has confirmed your order' },
                    { label: 'Order Shipped', description: 'Your order is on the way' },
                    { label: 'Order Delivered', description: 'Order delivered successfully' }
                  ].map((step) => (
                    <Step key={step.label}>
                      <StepLabel>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {step.label}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {step.description}
                        </Typography>
                      </StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>

              <Divider />

              {/* Order Items */}
              <Box sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3, color: '#1F2937' }}>
                  Order Items ({selectedOrder.items?.length || 0})
                </Typography>
                <List sx={{ p: 0 }}>
                  {selectedOrder.items?.map((item, index) => (
                    <ListItem
                      key={index}
                      sx={{
                        border: `1px solid ${alpha('#D4A574', 0.2)}`,
                        borderRadius: 2,
                        mb: 2,
                        bgcolor: alpha('#D4A574', 0.02)
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          src={item.product?.imageUrl}
                          alt={item.product?.name}
                          sx={{
                            width: 60,
                            height: 60,
                            borderRadius: 2,
                            border: `2px solid ${alpha('#D4A574', 0.3)}`
                          }}
                        >
                          <Inventory />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography variant="subtitle1" sx={{ fontWeight: 600, color: '#1F2937' }}>
                            {item.product?.name || 'Product'}
                          </Typography>
                        }
                        secondary={
                          <Stack spacing={0.5}>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Category: {item.product?.category || 'N/A'}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Quantity: {item.quantity}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              Price per item: {formatPrice(item.product?.price || 0)}
                            </Typography>
                          </Stack>
                        }
                      />
                      <Box sx={{ textAlign: 'right' }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                          {formatPrice((item.product?.price || 0) * item.quantity)}
                        </Typography>
                        {selectedOrder.status?.toUpperCase() === 'DELIVERED' && (
                          <Button
                            size="small"
                            startIcon={<Star />}
                            onClick={() => handleWriteReview(selectedOrder, item.product?.id)}
                            sx={{
                              mt: 1,
                              color: '#D4A574',
                              '&:hover': { bgcolor: alpha('#D4A574', 0.1) }
                            }}
                          >
                            Review
                          </Button>
                        )}
                      </Box>
                    </ListItem>
                  ))}
                </List>
              </Box>
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: alpha('#D4A574', 0.05) }}>
          <Button
            onClick={() => setOrderDetailsOpen(false)}
            sx={{ color: '#6B7280' }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            startIcon={<Receipt />}
            sx={{
              bgcolor: '#D4A574',
              '&:hover': { bgcolor: '#C9A86A' }
            }}
            onClick={() => toast('Receipt download coming soon!')}
          >
            Download Receipt
          </Button>
        </DialogActions>
      </Dialog>

      {/* Write Review Dialog */}
      <Dialog
        open={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4
          }
        }}
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: alpha('#D4A574', 0.1),
          borderBottom: `1px solid ${alpha('#D4A574', 0.2)}`
        }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
              Write a Review
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Share your experience with this product
            </Typography>
          </Box>
          <IconButton onClick={() => setReviewDialogOpen(false)} sx={{ color: '#6B7280' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ p: 3 }}>
          {selectedOrder && (
            <Stack spacing={3}>
              {/* Product Info */}
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                bgcolor: alpha('#D4A574', 0.05),
                borderRadius: 2
              }}>
                <Avatar
                  src={selectedOrder.items?.find(item => item.product?.id === reviewData.productId)?.product?.imageUrl}
                  alt="Product"
                  sx={{ width: 60, height: 60, borderRadius: 2 }}
                >
                  <Inventory />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {selectedOrder.items?.find(item => item.product?.id === reviewData.productId)?.product?.name || 'Product'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Order #{selectedOrder.id}
                  </Typography>
                </Box>
              </Box>

              {/* Rating */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Rate this product *
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Rating
                    value={reviewData.rating}
                    onChange={(_, newValue) => setReviewData(prev => ({ ...prev, rating: newValue || 0 }))}
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#D4A574'
                      },
                      '& .MuiRating-iconHover': {
                        color: '#C9A86A'
                      }
                    }}
                  />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {reviewData.rating > 0 && (
                      reviewData.rating === 1 ? 'Poor' :
                        reviewData.rating === 2 ? 'Fair' :
                          reviewData.rating === 3 ? 'Good' :
                            reviewData.rating === 4 ? 'Very Good' : 'Excellent'
                    )}
                  </Typography>
                </Box>
              </Box>

              {/* Comment */}
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                  Write your review (optional)
                </Typography>
                <TextField
                  multiline
                  rows={4}
                  fullWidth
                  placeholder="Share your thoughts about this product..."
                  value={reviewData.comment}
                  onChange={(e) => setReviewData(prev => ({ ...prev, comment: e.target.value }))}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#D4A574'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#D4A574'
                      }
                    }
                  }}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, bgcolor: alpha('#D4A574', 0.05) }}>
          <Button
            onClick={() => setReviewDialogOpen(false)}
            sx={{ color: '#6B7280' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitReview}
            disabled={reviewData.rating === 0}
            sx={{
              bgcolor: '#D4A574',
              '&:hover': { bgcolor: '#C9A86A' },
              '&:disabled': { bgcolor: '#E5E7EB' }
            }}
          >
            Submit Review
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default BuyerOrders