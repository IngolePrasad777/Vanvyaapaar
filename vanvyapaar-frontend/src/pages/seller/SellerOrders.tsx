import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Card, CardContent, Chip, Stack,
  alpha, MenuItem, Select, FormControl, InputLabel, Button
} from '@mui/material'
import {
  LocalShipping, CheckCircle, Cancel, Schedule, Inventory
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import sellerService from '../../services/sellerService'
import { Order } from '../../types'
import { formatPrice } from '../../lib/utils'
import toast from 'react-hot-toast'

const SellerOrders = () => {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('ALL')

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

  const fetchOrders = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await sellerService.getOrders(user.id)
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      await sellerService.updateOrderStatus(orderId, newStatus)
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o))
      toast.success('Order status updated')
    } catch (error) {
      toast.error('Failed to update order status')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return '#F59E0B'
      case 'CONFIRMED': return '#3B82F6'
      case 'SHIPPED': return '#10B981'
      case 'DELIVERED': return '#059669'
      case 'CANCELLED': return '#EF4444'
      default: return '#6B7280'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toUpperCase()) {
      case 'PENDING': return <Schedule />
      case 'CONFIRMED': return <CheckCircle />
      case 'SHIPPED': return <LocalShipping />
      case 'DELIVERED': return <CheckCircle />
      case 'CANCELLED': return <Cancel />
      default: return <Inventory />
    }
  }

  const filteredOrders = filterStatus === 'ALL'
    ? orders
    : orders.filter(o => o.status.toUpperCase() === filterStatus)

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'PENDING').length,
    confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
    shipped: orders.filter(o => o.status === 'SHIPPED').length,
    delivered: orders.filter(o => o.status === 'DELIVERED').length
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'grid', gap: 2 }}>
          {[1, 2, 3].map(i => (
            <Box key={i} sx={{ bgcolor: alpha('#D4A574', 0.1), height: 150, borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
          My Orders
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Manage and track orders for your products
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        {[
          { label: 'Total Orders', value: stats.total, color: '#D4A574' },
          { label: 'Pending', value: stats.pending, color: '#F59E0B' },
          { label: 'Confirmed', value: stats.confirmed, color: '#3B82F6' },
          { label: 'Shipped', value: stats.shipped, color: '#10B981' },
          { label: 'Delivered', value: stats.delivered, color: '#059669' }
        ].map((stat, index) => (
          <Card key={index} sx={{ borderRadius: 3, border: '1px solid', borderColor: alpha(stat.color, 0.2) }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {stat.label}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Filter */}
      <Box sx={{ mb: 3 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            label="Filter by Status"
            sx={{
              borderRadius: 2,
              '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4A574' }
            }}
          >
            <MenuItem value="ALL">All Orders</MenuItem>
            <MenuItem value="PENDING">Pending</MenuItem>
            <MenuItem value="CONFIRMED">Confirmed</MenuItem>
            <MenuItem value="SHIPPED">Shipped</MenuItem>
            <MenuItem value="DELIVERED">Delivered</MenuItem>
            <MenuItem value="CANCELLED">Cancelled</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>
            {filterStatus === 'ALL' ? 'No orders yet' : `No ${filterStatus.toLowerCase()} orders`}
          </Typography>
        </Card>
      ) : (
        <Stack spacing={2}>
          {filteredOrders.map((order) => {
            const statusColor = getStatusColor(order.status)
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card sx={{
                  borderRadius: 3,
                  border: '2px solid',
                  borderColor: alpha(statusColor, 0.2),
                  '&:hover': {
                    boxShadow: `0 4px 20px ${alpha(statusColor, 0.2)}`
                  }
                }}>
                  <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={2}>
                      <Box sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                          <Box sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            bgcolor: alpha(statusColor, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: statusColor
                          }}>
                            {getStatusIcon(order.status)}
                          </Box>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                              Order #{order.id}
                            </Typography>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              {new Date(order.orderDate).toLocaleDateString()}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack spacing={1}>
                          <Typography variant="body1">
                            <strong>Product:</strong> {order.items && order.items.length > 0 && order.items[0].product?.name 
                              ? order.items[0].product.name 
                              : `${order.items?.length || 0} item(s)`}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Items:</strong> {order.items?.length || 0}
                          </Typography>
                          <Typography variant="body1">
                            <strong>Customer:</strong> {order.buyer?.name || 'N/A'}
                          </Typography>
                          <Typography variant="h6" sx={{ color: '#D4A574', fontWeight: 'bold', mt: 1 }}>
                            {formatPrice(order.totalAmount || 0)}
                          </Typography>
                        </Stack>
                      </Box>

                      <Box sx={{ minWidth: 200 }}>
                        <Chip
                          label={order.status}
                          icon={getStatusIcon(order.status)}
                          sx={{
                            bgcolor: alpha(statusColor, 0.1),
                            color: statusColor,
                            fontWeight: 'bold',
                            mb: 2,
                            width: '100%'
                          }}
                        />

                        {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                          <FormControl fullWidth size="small">
                            <InputLabel>Update Status</InputLabel>
                            <Select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              label="Update Status"
                              sx={{
                                borderRadius: 2,
                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4A574' }
                              }}
                            >
                              <MenuItem value="PENDING">Pending</MenuItem>
                              <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                              <MenuItem value="SHIPPED">Shipped</MenuItem>
                              <MenuItem value="DELIVERED">Delivered</MenuItem>
                              <MenuItem value="CANCELLED">Cancelled</MenuItem>
                            </Select>
                          </FormControl>
                        )}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </Stack>
      )}
    </Container>
  )
}

export default SellerOrders
