import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Button, Card, CardContent, CardMedia,
  IconButton, Chip, Stack, alpha, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField
} from '@mui/material'
import {
  Add, Edit, Delete, Visibility, Search, CloudUpload
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import sellerService from '../../services/sellerService'
import { Product } from '../../types'
import { formatPrice } from '../../lib/utils'
import toast from 'react-hot-toast'

const SellerProducts = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<number | null>(null)
  const [editDialog, setEditDialog] = useState<Product | null>(null)
  const [editImagePreview, setEditImagePreview] = useState<string>('')

  useEffect(() => {
    if (user) {
      fetchProducts()
    }
  }, [user])

  const fetchProducts = async () => {
    if (!user) return
    try {
      setLoading(true)
      const data = await sellerService.getProducts(user.id)
      setProducts(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (productId: number) => {
    try {
      await sellerService.deleteProduct(productId)
      setProducts(products.filter(p => p.id !== productId))
      toast.success('Product deleted successfully')
      setDeleteDialog(null)
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const handleEditImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB')
        return
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload an image file')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setEditImagePreview(result)
        if (editDialog) {
          setEditDialog({ ...editDialog, imageUrl: result })
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUpdate = async () => {
    if (!editDialog) return
    try {
      await sellerService.updateProduct(editDialog.id, editDialog)
      await fetchProducts()
      toast.success('Product updated successfully')
      setEditDialog(null)
      setEditImagePreview('')
    } catch (error) {
      toast.error('Failed to update product')
    }
  }

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {[1, 2, 3, 4].map(i => (
            <Box key={i} sx={{ bgcolor: alpha('#D4A574', 0.1), height: 400, borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </Box>
      </Container>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
              My Products
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Manage your product inventory
            </Typography>
          </Box>
          <Button
            component={Link}
            to="/seller/products/add"
            variant="contained"
            startIcon={<Add />}
            sx={{
              bgcolor: '#D4A574',
              color: 'white',
              px: 3,
              py: 1.5,
              '&:hover': { bgcolor: '#C9A86A' }
            }}
          >
            Add Product
          </Button>
        </Stack>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 3,
              bgcolor: 'white'
            }
          }}
        />
      </Box>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <Card sx={{ p: 8, textAlign: 'center', borderRadius: 4 }}>
          <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
            {searchQuery ? 'No products found' : 'No products yet'}
          </Typography>
          <Button
            component={Link}
            to="/seller/products/add"
            variant="contained"
            startIcon={<Add />}
            sx={{ bgcolor: '#D4A574', '&:hover': { bgcolor: '#C9A86A' } }}
          >
            Add Your First Product
          </Button>
        </Card>
      ) : (
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <Card sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: 3,
                border: '1px solid',
                borderColor: alpha('#D4A574', 0.2),
                '&:hover': {
                  boxShadow: `0 8px 24px ${alpha('#D4A574', 0.2)}`
                }
              }}>
                <Box sx={{
                  height: 200,
                  overflow: 'hidden',
                  bgcolor: alpha('#D4A574', 0.05)
                }}>
                  <CardMedia
                    component="img"
                    image={product.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
                    alt={product.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </Box>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="start" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', flex: 1 }}>
                      {product.name}
                    </Typography>
                    <Chip
                      label={product.stock > 0 ? 'In Stock' : 'Out of Stock'}
                      size="small"
                      sx={{
                        bgcolor: product.stock > 0 ? alpha('#10B981', 0.1) : alpha('#EF4444', 0.1),
                        color: product.stock > 0 ? '#10B981' : '#EF4444',
                        fontWeight: 'bold'
                      }}
                    />
                  </Stack>

                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                    {product.category}
                  </Typography>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ color: '#D4A574', fontWeight: 'bold' }}>
                      {formatPrice(product.price)}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Stock: {product.stock}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => setEditDialog(product)}
                      sx={{
                        bgcolor: alpha('#3B82F6', 0.1),
                        color: '#3B82F6',
                        '&:hover': { bgcolor: alpha('#3B82F6', 0.2) }
                      }}
                    >
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => setDeleteDialog(product.id)}
                      sx={{
                        bgcolor: alpha('#EF4444', 0.1),
                        color: '#EF4444',
                        '&:hover': { bgcolor: alpha('#EF4444', 0.2) }
                      }}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => navigate(`/seller/products/${product.id}`)}
                      sx={{
                        bgcolor: alpha('#D4A574', 0.1),
                        color: '#D4A574',
                        '&:hover': { bgcolor: alpha('#D4A574', 0.2) }
                      }}
                    >
                      <Visibility fontSize="small" />
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      )}

      {/* Delete Dialog */}
      <Dialog open={deleteDialog !== null} onClose={() => setDeleteDialog(null)}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(null)}>Cancel</Button>
          <Button onClick={() => deleteDialog && handleDelete(deleteDialog)} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialog !== null} onClose={() => { setEditDialog(null); setEditImagePreview('') }} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Product</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 2 }}>
            {/* Image Preview */}
            {(editImagePreview || editDialog?.imageUrl) && (
              <Box sx={{ textAlign: 'center', mb: 2 }}>
                <img
                  src={editImagePreview || editDialog?.imageUrl}
                  alt="Product"
                  style={{ maxWidth: '100%', maxHeight: 200, borderRadius: 8 }}
                />
              </Box>
            )}

            {/* Image Upload */}
            <Button
              component="label"
              variant="outlined"
              startIcon={<CloudUpload />}
              fullWidth
              sx={{
                borderColor: '#D4A574',
                color: '#D4A574',
                borderStyle: 'dashed',
                '&:hover': { borderColor: '#C9A86A', bgcolor: alpha('#D4A574', 0.05) }
              }}
            >
              <input type="file" hidden accept="image/*" onChange={handleEditImageChange} />
              Change Image
            </Button>

            <TextField
              label="Product Name"
              value={editDialog?.name || ''}
              onChange={(e) => setEditDialog(editDialog ? { ...editDialog, name: e.target.value } : null)}
              fullWidth
            />
            <TextField
              label="Price"
              type="number"
              value={editDialog?.price || ''}
              onChange={(e) => setEditDialog(editDialog ? { ...editDialog, price: parseFloat(e.target.value) } : null)}
              fullWidth
            />
            <TextField
              label="Stock"
              type="number"
              value={editDialog?.stock || ''}
              onChange={(e) => setEditDialog(editDialog ? { ...editDialog, stock: parseInt(e.target.value) } : null)}
              fullWidth
            />
            <TextField
              label="Description"
              value={editDialog?.description || ''}
              onChange={(e) => setEditDialog(editDialog ? { ...editDialog, description: e.target.value } : null)}
              multiline
              rows={3}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setEditDialog(null); setEditImagePreview('') }}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" sx={{ bgcolor: '#D4A574', '&:hover': { bgcolor: '#C9A86A' } }}>
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}

export default SellerProducts
