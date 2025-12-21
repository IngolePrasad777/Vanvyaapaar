import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Button, Card, CardContent,
  IconButton, alpha, Stack, TextField, Select, MenuItem,
  FormControl, InputLabel, Chip, Rating
} from '@mui/material'
import {
  Favorite, FavoriteBorder, ShoppingCart, Search,
  FilterList, GridView, ViewList, ArrowBack, Star
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { Product } from '../../types'
import productService from '../../services/productService'
import buyerService from '../../services/buyerService'
import { formatPrice } from '../../lib/utils'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const BuyerProducts = () => {
  const { user } = useAuthStore()
  const { addToCart: addToCartStore } = useCartStore()
  const { addToWishlist: addToWishlistStore, removeFromWishlist, isInWishlist } = useWishlistStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productsData = await productService.getAllProducts()
        setProducts(Array.isArray(productsData) ? productsData : [])
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [user])

  const toggleWishlist = async (productId: number) => {
    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }
    
    if (isInWishlist(productId)) {
      await removeFromWishlist(user.id, productId)
    } else {
      await addToWishlistStore(user.id, productId)
    }
  }

  const addToCart = async (productId: number) => {
    if (!user) {
      toast.error('Please login to add to cart')
      return
    }
    
    await addToCartStore(user.id, productId, 1)
  }

  const filteredProducts = products
    .filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (category === 'all' || product.category.toLowerCase() === category.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low': return a.price - b.price
        case 'price-high': return b.price - a.price
        case 'name': return a.name.localeCompare(b.name)
        default: return 0
      }
    })

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))]

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {[...Array(12)].map((_, i) => (
            <Box key={i} sx={{ bgcolor: alpha('#D4A574', 0.1), height: 350, borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
          ))}
        </Box>
      </Container>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9', position: 'relative' }}>
      {/* Floating Particles */}
      {[...Array(25)].map((_, i) => (
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
            scale: [0, 1.2, 0]
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

      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <Stack spacing={4}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Button
                component={Link}
                to="/buyer/dashboard"
                startIcon={<ArrowBack />}
                sx={{
                  color: '#8B4513',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: alpha('#D4A574', 0.1) }
                }}
              >
                Back to Dashboard
              </Button>
            </Stack>
            <Typography
              variant="h3"
              sx={{
                fontWeight: 'bold',
                color: '#1F2937',
                fontFamily: 'serif',
                mb: 1
              }}
            >
              Discover Tribal Crafts
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary' }}>
              {filteredProducts.length} authentic handcrafted products
            </Typography>
          </motion.div>

          {/* Filters & Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card sx={{ borderRadius: 4, border: '2px solid', borderColor: alpha('#D4A574', 0.2) }}>
              <CardContent sx={{ p: 3 }}>
                <Stack spacing={3}>
                  {/* Search Bar */}
                  <TextField
                    fullWidth
                    placeholder="Search for products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: '#8B4513', mr: 1 }} />
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 3,
                        '&:hover fieldset': { borderColor: '#D4A574' },
                        '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                      }
                    }}
                  />

                  {/* Filters Row */}
                  <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                      <FilterList sx={{ color: '#8B4513' }} />
                      <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Category</InputLabel>
                        <Select
                          value={category}
                          label="Category"
                          onChange={(e) => setCategory(e.target.value)}
                          sx={{
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4A574' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4A574' }
                          }}
                        >
                          {categories.map(cat => (
                            <MenuItem key={cat} value={cat}>
                              {cat === 'all' ? 'All Categories' : cat}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <FormControl sx={{ minWidth: 200 }}>
                        <InputLabel>Sort By</InputLabel>
                        <Select
                          value={sortBy}
                          label="Sort By"
                          onChange={(e) => setSortBy(e.target.value)}
                          sx={{
                            borderRadius: 2,
                            '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4A574' },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4A574' }
                          }}
                        >
                          <MenuItem value="name">Name</MenuItem>
                          <MenuItem value="price-low">Price: Low to High</MenuItem>
                          <MenuItem value="price-high">Price: High to Low</MenuItem>
                        </Select>
                      </FormControl>
                    </Stack>

                    {/* View Toggle */}
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        onClick={() => setViewMode('grid')}
                        sx={{
                          bgcolor: viewMode === 'grid' ? alpha('#D4A574', 0.2) : 'transparent',
                          color: viewMode === 'grid' ? '#8B4513' : 'text.secondary',
                          '&:hover': { bgcolor: alpha('#D4A574', 0.3) }
                        }}
                      >
                        <GridView />
                      </IconButton>
                      <IconButton
                        onClick={() => setViewMode('list')}
                        sx={{
                          bgcolor: viewMode === 'list' ? alpha('#D4A574', 0.2) : 'transparent',
                          color: viewMode === 'list' ? '#8B4513' : 'text.secondary',
                          '&:hover': { bgcolor: alpha('#D4A574', 0.3) }
                        }}
                      >
                        <ViewList />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          {/* Products Grid/List */}
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card sx={{ borderRadius: 4, border: '2px solid', borderColor: alpha('#D4A574', 0.2), textAlign: 'center', py: 8 }}>
                <CardContent>
                  <Search sx={{ fontSize: 80, color: alpha('#D4A574', 0.5), mb: 2 }} />
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                    No products found
                  </Typography>
                  <Typography sx={{ color: 'text.secondary' }}>
                    Try adjusting your search or filters
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: viewMode === 'grid' 
                ? { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }
                : '1fr',
              gap: 4
            }}>
              {filteredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.4 + index * 0.05 }}
                  whileHover={{ y: -10 }}
                >
                  <Card
                    component={Link}
                    to={`/buyer/products/${product.id}`}
                    sx={{
                      borderRadius: 4,
                      border: '2px solid',
                      borderColor: alpha('#D4A574', 0.2),
                      boxShadow: `0 4px 15px ${alpha('#D4A574', 0.1)}`,
                      transition: 'all 0.3s',
                      position: 'relative',
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: viewMode === 'list' ? 'row' : 'column',
                      textDecoration: 'none',
                      color: 'inherit',
                      cursor: 'pointer',
                      '&:hover': {
                        borderColor: '#D4A574',
                        boxShadow: `0 12px 40px ${alpha('#D4A574', 0.3)}`,
                        '& .product-image': {
                          transform: 'scale(1.1)'
                        },
                        '& .product-actions': {
                          opacity: 1,
                          transform: 'translateY(0)'
                        }
                      }
                    }}
                  >
                    {/* Product Image */}
                    <Box sx={{
                      position: 'relative',
                      height: viewMode === 'grid' ? 250 : '100%',
                      width: viewMode === 'list' ? 250 : '100%',
                      overflow: 'hidden',
                      bgcolor: alpha('#D4A574', 0.05)
                    }}>
                      <Box
                        component="img"
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'}
                        alt={product.name}
                        className="product-image"
                        sx={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          transition: 'transform 0.5s'
                        }}
                      />
                      
                      {/* Wishlist Heart */}
                      <IconButton
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleWishlist(product.id)
                        }}
                        sx={{
                          position: 'absolute',
                          top: 12,
                          right: 12,
                          bgcolor: alpha('#FFFFFF', 0.9),
                          color: isInWishlist(product.id) ? '#EF4444' : 'text.secondary',
                          '&:hover': {
                            bgcolor: '#FFFFFF',
                            transform: 'scale(1.1)'
                          }
                        }}
                      >
                        {isInWishlist(product.id) ? <Favorite /> : <FavoriteBorder />}
                      </IconButton>

                      {/* Stock Badge */}
                      {product.stock < 10 && (
                        <Chip
                          label={`Only ${product.stock} left`}
                          size="small"
                          sx={{
                            position: 'absolute',
                            top: 12,
                            left: 12,
                            bgcolor: alpha('#EF4444', 0.9),
                            color: '#FFFFFF',
                            fontWeight: 'bold'
                          }}
                        />
                      )}

                      {/* Hover Actions */}
                      <Box
                        className="product-actions"
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          left: 0,
                          right: 0,
                          bgcolor: alpha('#000000', 0.8),
                          p: 2,
                          opacity: 0,
                          transform: 'translateY(100%)',
                          transition: 'all 0.3s'
                        }}
                      >
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<ShoppingCart />}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            addToCart(product.id)
                          }}
                          sx={{
                            bgcolor: '#D4A574',
                            color: '#FFFFFF',
                            '&:hover': { bgcolor: '#C9A86A' }
                          }}
                        >
                          Add to Cart
                        </Button>
                      </Box>
                    </Box>

                    {/* Product Info */}
                    <CardContent sx={{ p: 3, flex: 1 }}>
                      <Stack spacing={2}>
                        <Box>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              color: '#1F2937',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: viewMode === 'grid' ? 'nowrap' : 'normal',
                              '&:hover': { color: '#8B4513' }
                            }}
                          >
                            {product.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                            {product.category}
                          </Typography>
                        </Box>

                        {/* Rating */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Rating value={4.5} precision={0.5} size="small" readOnly />
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            (4.5)
                          </Typography>
                        </Stack>

                        {/* Description (List view only) */}
                        {viewMode === 'list' && (
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            {product.description?.substring(0, 150)}...
                          </Typography>
                        )}

                        {/* Price & Seller */}
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                            {formatPrice(product.price)}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                            by {product.seller?.name}
                          </Typography>
                        </Stack>

                        {/* View Details Button (List view only) */}
                        {viewMode === 'list' && (
                          <Button
                            component={Link}
                            to={`/buyer/products/${product.id}`}
                            variant="outlined"
                            onClick={(e) => e.stopPropagation()}
                            sx={{
                              color: '#8B4513',
                              borderColor: '#D4A574',
                              '&:hover': {
                                bgcolor: alpha('#D4A574', 0.1),
                                borderColor: '#D4A574'
                              }
                            }}
                          >
                            View Details
                          </Button>
                        )}
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Box>
          )}
        </Stack>
      </Container>
    </Box>
  )
}

export default BuyerProducts
