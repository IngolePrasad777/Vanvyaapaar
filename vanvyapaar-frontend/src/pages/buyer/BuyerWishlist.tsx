import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Container, Box, Typography, Button, Card, CardContent,
  IconButton, Stack, alpha, Grid, Chip, Rating, Avatar, Skeleton
} from '@mui/material'
import {
  Favorite, ShoppingCart, Delete, FavoriteBorder,
  Star, Visibility, ArrowForward, Category,
  Inventory
} from '@mui/icons-material'
import { Product } from '../../types'
import { useAuthStore } from '../../store/authStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { useCartStore } from '../../store/cartStore'
import { formatPrice } from '../../lib/utils'
import { buyerService } from '../../services/buyerService'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'
import LoadingAnimation from '../../components/common/LoadingAnimation'
import toast from 'react-hot-toast'

const BuyerWishlist = () => {
  const { user } = useAuthStore()
  const { 
    items: wishlistItems, 
    isLoading: loading, 
    fetchWishlist, 
    removeFromWishlist,
    getWishlistCount
  } = useWishlistStore()
  const { addToCart } = useCartStore()

  useEffect(() => {
    if (user?.id) {
      fetchWishlist(user.id)
    }
  }, [user?.id, fetchWishlist])

  const handleRemoveFromWishlist = async (productId: number) => {
    if (!user) return
    await removeFromWishlist(user.id, productId)
  }

  const handleAddToCart = async (productId: number) => {
    if (!user) {
      toast.error('Please login to add items to cart')
      return
    }
    
    try {
      const success = await addToCart(user.id, productId, 1)
      if (success) {
        toast.success('Added to cart')
        // Optionally remove from wishlist after adding to cart
        await handleRemoveFromWishlist(productId)
      }
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
          {[...Array(8)].map((_, i) => (
            <Card key={i} sx={{ borderRadius: 4 }}>
              <Skeleton variant="rectangular" height={240} />
              <CardContent>
                <Skeleton variant="text" height={32} />
                <Skeleton variant="text" height={24} width="60%" />
                <Skeleton variant="text" height={28} width="40%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <Box sx={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
            <Box
              sx={{
                width: 150,
                height: 150,
                bgcolor: alpha('#EF4444', 0.1),
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4
              }}
            >
              <Favorite sx={{ fontSize: 80, color: '#EF4444' }} />
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2, fontFamily: 'serif' }}>
              Your Wishlist is Empty
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              Save items you love for later and never miss out on your favorites
            </Typography>
            <Button
              component={Link}
              to="/buyer/products"
              variant="contained"
              startIcon={<Inventory />}
              sx={{
                bgcolor: '#10B981',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#059669' }
              }}
            >
              Browse Products
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Box
              sx={{
                width: 48,
                height: 48,
                bgcolor: alpha('#EF4444', 0.15),
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Favorite sx={{ color: '#EF4444' }} />
            </Box>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', fontFamily: 'serif' }}>
                My Wishlist
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Wishlist Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 3 }}>
        {wishlistItems.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: '2px solid',
                borderColor: alpha('#D4A574', 0.2),
                boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: '#D4A574',
                  boxShadow: '0 12px 40px rgba(212, 165, 116, 0.3)',
                  transform: 'translateY(-8px)'
                }
              }}
            >
              <Link to={`/buyer/products/${product.id}`} style={{ textDecoration: 'none' }}>
                <Box sx={{ position: 'relative', height: 240, overflow: 'hidden', bgcolor: alpha('#D4A574', 0.05) }}>
                  <Box
                    component="img"
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'}
                    alt={product.name}
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s',
                      '&:hover': { transform: 'scale(1.1)' }
                    }}
                  />
                  {product.featured && (
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        bgcolor: '#8B4513',
                        color: 'white',
                        px: 2,
                        py: 0.5,
                        borderRadius: 2,
                        fontSize: '0.75rem',
                        fontWeight: 'bold',
                        border: '2px solid #FFD700'
                      }}
                    >
                      Featured
                    </Box>
                  )}
                  <IconButton
                    onClick={(e) => {
                      e.preventDefault()
                      handleRemoveFromWishlist(product.id)
                    }}
                    sx={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      bgcolor: 'rgba(255,255,255,0.9)',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        bgcolor: alpha('#EF4444', 0.1),
                        color: '#EF4444'
                      }
                    }}
                  >
                    <Delete />
                  </IconButton>
                </Box>
              </Link>
              
              <CardContent sx={{ p: 3 }}>
                <Link to={`/buyer/products/${product.id}`} style={{ textDecoration: 'none' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1F2937',
                      mb: 1,
                      transition: 'color 0.3s',
                      '&:hover': { color: '#D4A574' }
                    }}
                  >
                    {product.name}
                  </Typography>
                </Link>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 2 }}>
                  {product.category}
                </Typography>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                    {formatPrice(product.price)}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    by {product.seller?.name}
                  </Typography>
                </Stack>
                
                <Button
                  fullWidth
                  onClick={() => handleAddToCart(product.id)}
                  disabled={product.stock === 0}
                  startIcon={<ShoppingCart />}
                  sx={{
                    bgcolor: '#10B981',
                    color: 'white',
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#059669'
                    },
                    '&:disabled': {
                      opacity: 0.5,
                      cursor: 'not-allowed'
                    }
                  }}
                >
                  {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </Box>
    </Container>
  )
}

export default BuyerWishlist
