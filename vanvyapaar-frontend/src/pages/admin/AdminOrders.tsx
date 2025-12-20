import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Card, CardContent, Chip,
  alpha, Stack, TextField, InputAdornment,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material'
import { Search, ShoppingCart } from '@mui/icons-material'
import adminService from '../../services/adminService'
import { Order } from '../../types'
import { formatPrice } from '../../lib/utils'
import toast from 'react-hot-toast'

const AdminOrders = () => {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllOrders()
      setOrders(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const filteredOrders = orders.filter(order =>
    order.buyer?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.seller?.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#F59E0B'
      case 'shipped': return '#3B82F6'
      case 'delivered': return '#10B981'
      case 'cancelled': return '#EF4444'
      default: return '#6B7280'
    }
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ color: '#8B7355' }}>Loading...</Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ width: 56, height: 56, bgcolor: alpha('#8B7355', 0.15), borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ShoppingCart sx={{ fontSize: 32, color: '#8B7355' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', fontFamily: 'serif' }}>
              Manage Orders
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              View and manage all orders
            </Typography>
          </Box>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search orders..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment>
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(4, 1fr)' }, gap: 3, mb: 4 }}>
        {[
          { label: 'Total Orders', value: orders.length, color: '#8B7355' },
          { label: 'Pending', value: orders.filter(o => o.status === 'Pending').length, color: '#F59E0B' },
          { label: 'Shipped', value: orders.filter(o => o.status === 'Shipped').length, color: '#3B82F6' },
          { label: 'Delivered', value: orders.filter(o => o.status === 'Delivered').length, color: '#10B981' }
        ].map((stat, index) => (
          <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
            <Card sx={{ borderRadius: 3, border: '2px solid', borderColor: alpha(stat.color, 0.2) }}>
              <CardContent>
                <Typography variant="h3" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>{stat.value}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>{stat.label}</Typography>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>

      {filteredOrders.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>No orders found</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha('#8B7355', 0.1) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Order ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Buyer</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Seller</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold' }}>#{order.id}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{order.buyer?.name || 'N/A'}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{order.seller?.name || 'N/A'}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold', color: '#8B7355' }}>{formatPrice(order.totalAmount)}</Typography></TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(getStatusColor(order.status), 0.1),
                        color: getStatusColor(order.status),
                        fontWeight: 'bold'
                      }}
                    />
                  </TableCell>
                  <TableCell><Typography variant="body2">{new Date(order.orderDate).toLocaleDateString()}</Typography></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  )
}

export default AdminOrders
