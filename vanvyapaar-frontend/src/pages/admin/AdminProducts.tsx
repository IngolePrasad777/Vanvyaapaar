import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Card, CardContent, CardMedia,
  alpha, Stack, TextField, InputAdornment, IconButton,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material'
import { Search, Inventory, Delete } from '@mui/icons-material'
import adminService from '../../services/adminService'
import { Product } from '../../types'
import { formatPrice } from '../../lib/utils'
import toast from 'react-hot-toast'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await adminService.getAllProducts()
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure?')) {
      try {
        await adminService.deleteProduct(id)
        toast.success('Product deleted')
        fetchProducts()
      } catch (error) {
        toast.error('Failed to delete product')
      }
    }
  }

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ color: '#A0826D' }}>Loading...</Typography>
      </Container>
    )
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground variant="particles" intensity="light" color="#A0826D" />
      <FloatingElements 
        showScrollTop={true}
        showQuickActions={true}
        quickActions={[
          {
            icon: <Search />,
            label: 'Search Products',
            onClick: () => document.querySelector('input')?.focus(),
            color: '#A0826D'
          },
          {
            icon: <Inventory />,
            label: 'Refresh',
            onClick: fetchProducts,
            color: '#10B981'
          }
        ]}
      />
      
    <Container maxWidth="xl" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
          <Box sx={{ width: 56, height: 56, bgcolor: alpha('#A0826D', 0.15), borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Inventory sx={{ fontSize: 32, color: '#A0826D' }} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', fontFamily: 'serif' }}>
              Manage Products
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Review and manage all products
            </Typography>
          </Box>
        </Stack>

        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <InputAdornment position="start"><Search sx={{ color: 'text.secondary' }} /></InputAdornment>
          }}
          sx={{ '& .MuiOutlinedInput-root': { borderRadius: 3, bgcolor: 'white' } }}
        />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3, mb: 4 }}>
        {[
          { label: 'Total Products', value: products.length, color: '#A0826D' },
          { label: 'In Stock', value: products.filter(p => p.stock > 0).length, color: '#10B981' },
          { label: 'Out of Stock', value: products.filter(p => p.stock === 0).length, color: '#EF4444' }
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

      {filteredProducts.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary' }}>No products found</Typography>
        </Card>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <Table>
            <TableHead sx={{ bgcolor: alpha('#A0826D', 0.1) }}>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Stock</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Seller</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts.map((product) => (
                <TableRow key={product.id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        component="img"
                        src={product.imageUrl || 'https://via.placeholder.com/50'}
                        sx={{ width: 50, height: 50, borderRadius: 2, objectFit: 'cover' }}
                      />
                      <Typography variant="body1" sx={{ fontWeight: 'bold' }}>{product.name}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell><Typography variant="body2">{product.category}</Typography></TableCell>
                  <TableCell><Typography variant="body2" sx={{ fontWeight: 'bold', color: '#A0826D' }}>{formatPrice(product.price)}</Typography></TableCell>
                  <TableCell><Typography variant="body2">{product.stock}</Typography></TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {product.seller?.name || product.seller?.email || 'Unknown Seller'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton size="small" sx={{ color: '#EF4444' }} onClick={() => handleDelete(product.id)}>
                      <Delete fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
    </Box>
  )
}

export default AdminProducts
