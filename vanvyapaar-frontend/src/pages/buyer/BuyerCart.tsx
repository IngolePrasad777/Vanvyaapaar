import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Button, IconButton, Card, CardContent,
  Stack, Divider, alpha, Chip
} from '@mui/material'
import {
  Delete, Add, Remove, ShoppingBag, LocalShipping, ArrowForward
} from '@mui/icons-material'
import { CartItem } from '../../types'
import { useAuthStore } from '../../store/authStore'
import buyerService from '../../services/buyerService'
import { formatPrice } from '../../lib/utils'
import toast from 'react-hot-toast'

const BuyerCart = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      fetchCart()
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return

    try {
      setLoading(true)
      const items = await buyerService.getCart(user.id)
      setCartItems(Array.isArray(items) ? items : [])
    } catch (error) {
      console.error('Error fetching cart:', error)
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return

    try {
      setUpdating(cartItemId)
      await buyerService.updateCartItem(cartItemId, newQuantity)
      setCartItems(items =>
        items.map(item =>
          item.id === cartItemId ? { ...item, quantity: newQuantity } : item
        )
      )
      toast.success('Cart updated')
    } catch (error) {
      toast.error('Failed to update cart')
    } finally {
      setUpdating(null)
    }
  }

  const removeItem = async (cartItemId: number) => {
    try {
      await buyerService.removeCartItem(cartItemId)
      setCartItems(items => items.filter(item => item.id !== cartItemId))
      toast.success('Item removed from cart')
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const proceedToCheckout = () => {
    if (cartItems.length === 0) return
    navigate('/buyer/checkout')
  }

  const subtotal = Array.isArray(cartItems) 
    ? cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.quantity, 0)
    : 0
  const shipping = subtotal > 999 ? 0 : 99
  const total = subtotal + shipping

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Stack spacing={3}>
          <Box sx={{ bgcolor: alpha('#D4A574', 0.1), height: 40, borderRadius: 3, width: '25%', animation: 'pulse 1.5s ease-in-out infinite' }} />
          <Stack spacing={2}>
            {[...Array(3)].map((_, i) => (
              <Box key={i} sx={{ bgcolor: alpha('#D4A574', 0.1), height: 120, borderRadius: 4, animation: 'pulse 1.5s ease-in-out infinite' }} />
            ))}
          </Stack>
        </Stack>
      </Container>
    )
  }

  if (cartItems.length === 0) {
    return (
      <Box sx={{ minHeight: '70vh', bgcolor: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Floating Particles */}
        <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {[...Array(20)].map((_, i) => {
            const size = Math.random() * 6 + 2
            const isGold = Math.random() > 0.7
            return (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: size,
                  height: size,
                  borderRadius: '50%',
                  background: isGold
                    ? `radial-gradient(circle, rgba(255,215,0,${Math.random() * 0.5 + 0.2}) 0%, rgba(212,165,116,${Math.random() * 0.3 + 0.1}) 100%)`
                    : `rgba(212, 165, 116, ${Math.random() * 0.4 + 0.1})`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  boxShadow: isGold ? '0 0 8px rgba(255,215,0,0.3)' : 'none',
                }}
                animate={{
                  y: [0, -50, 0],
                  x: [0, Math.random() * 30 - 15, 0],
                  opacity: [0.2, 0.7, 0.2],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: Math.random() * 4 + 3,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: Math.random() * 2,
                }}
              />
            )
          })}
        </Box>

        <Container maxWidth="sm" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
          >
            <Box
              sx={{
                width: 150,
                height: 150,
                bgcolor: alpha('#D4A574', 0.1),
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 4,
                border: '3px solid',
                borderColor: alpha('#D4A574', 0.3)
              }}
            >
              <ShoppingBag sx={{ fontSize: 80, color: alpha('#D4A574', 0.5) }} />
            </Box>
          </motion.div>
          <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2, fontFamily: 'serif' }}>
            Your cart is empty
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Discover amazing tribal crafts and add them to your cart
          </Typography>
          <Button
            component={Link}
            to="/buyer/products"
            variant="contained"
            endIcon={<ArrowForward />}
            sx={{
              bgcolor: '#8B4513',
              color: 'white',
              px: 4,
              py: 1.5,
              borderRadius: 3,
              fontWeight: 'bold',
              border: '2px solid #FFD700',
              boxShadow: '0 8px 30px rgba(139, 69, 19, 0.4)',
              '&:hover': {
                bgcolor: '#A0522D',
                transform: 'translateY(-2px)',
                boxShadow: '0 12px 40px rgba(139, 69, 19, 0.5)'
              }
            }}
          >
            Start Shopping
          </Button>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9', position: 'relative', py: 6 }}>
      {/* Floating Particles Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        {[...Array(25)].map((_, i) => {
          const size = Math.random() * 6 + 2
          const isGold = Math.random() > 0.7
          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: '50%',
                background: isGold
                  ? `radial-gradient(circle, rgba(255,215,0,${Math.random() * 0.5 + 0.2}) 0%, rgba(212,165,116,${Math.random() * 0.3 + 0.1}) 100%)`
                  : `rgba(212, 165, 116, ${Math.random() * 0.4 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: isGold ? '0 0 8px rgba(255,215,0,0.3)' : 'none',
              }}
              animate={{
                y: [0, -50, 0],
                x: [0, Math.random() * 30 - 15, 0],
                opacity: [0.2, 0.7, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 4 + 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          )
        })}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        <Stack spacing={4}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1F2937', fontFamily: 'serif' }}>
              Shopping Cart
            </Typography>
            <Chip
              label={`${cartItems.length} items`}
              sx={{
                bgcolor: alpha('#D4A574', 0.15),
                color: '#8B4513',
                fontWeight: 'bold',
                fontSize: '1rem',
                px: 2,
                border: '2px solid',
                borderColor: alpha('#D4A574', 0.3)
              }}
            />
          </Stack>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
            {/* Cart Items */}
            <Stack spacing={3}>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      border: '2px solid',
                      borderColor: alpha('#D4A574', 0.2),
                      boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s',
                      '&:hover': {
                        borderColor: '#D4A574',
                        boxShadow: '0 8px 25px rgba(212, 165, 116, 0.2)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" spacing={3} alignItems="center">
                        {/* Product Image */}
                        <Box
                          component={Link}
                          to={`/buyer/products/${item.product.id}`}
                          sx={{
                            width: 100,
                            height: 100,
                            borderRadius: 3,
                            overflow: 'hidden',
                            border: '2px solid',
                            borderColor: alpha('#D4A574', 0.3),
                            flexShrink: 0,
                            transition: 'all 0.3s',
                            '&:hover': {
                              borderColor: '#FFD700',
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          <Box
                            component="img"
                            src={item.product.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=200'}
                            alt={item.product.name}
                            sx={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover'
                            }}
                          />
                        </Box>

                        {/* Product Info */}
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            component={Link}
                            to={`/buyer/products/${item.product.id}`}
                            variant="h6"
                            sx={{
                              fontWeight: 'bold',
                              color: '#1F2937',
                              textDecoration: 'none',
                              transition: 'color 0.3s',
                              '&:hover': { color: '#D4A574' }
                            }}
                          >
                            {item.product.name}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                            {item.product.category}
                          </Typography>
                          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                            by {item.product.seller?.name}
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                            {formatPrice(item.product.price)}
                          </Typography>
                        </Box>

                        {/* Quantity Controls */}
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Stack
                            direction="row"
                            alignItems="center"
                            sx={{
                              bgcolor: alpha('#D4A574', 0.1),
                              borderRadius: 3,
                              border: '2px solid',
                              borderColor: alpha('#D4A574', 0.3)
                            }}
                          >
                            <IconButton
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={updating === item.id || item.quantity <= 1}
                              sx={{
                                color: '#8B4513',
                                '&:hover': { bgcolor: alpha('#D4A574', 0.2) },
                                '&:disabled': { opacity: 0.5 }
                              }}
                            >
                              <Remove />
                            </IconButton>
                            <Typography
                              sx={{
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                color: '#8B4513',
                                minWidth: 50,
                                textAlign: 'center'
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={updating === item.id || item.quantity >= item.product.stock}
                              sx={{
                                color: '#8B4513',
                                '&:hover': { bgcolor: alpha('#D4A574', 0.2) },
                                '&:disabled': { opacity: 0.5 }
                              }}
                            >
                              <Add />
                            </IconButton>
                          </Stack>

                          <IconButton
                            onClick={() => removeItem(item.id)}
                            sx={{
                              color: '#EF4444',
                              bgcolor: alpha('#EF4444', 0.1),
                              border: '2px solid',
                              borderColor: alpha('#EF4444', 0.3),
                              '&:hover': {
                                bgcolor: alpha('#EF4444', 0.2),
                                borderColor: '#EF4444'
                              }
                            }}
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </Stack>

            {/* Order Summary */}
            <Box>
              <Card
                sx={{
                  borderRadius: 4,
                  border: '3px solid',
                  borderColor: alpha('#FFD700', 0.4),
                  boxShadow: '0 10px 40px rgba(255, 215, 0, 0.2)',
                  position: 'sticky',
                  top: 24,
                  background: 'linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 100%)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8B4513', mb: 3, fontFamily: 'serif' }}>
                    Order Summary
                  </Typography>

                  <Stack spacing={2} sx={{ mb: 3 }}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ color: 'text.secondary' }}>Subtotal</Typography>
                      <Typography sx={{ fontWeight: 'bold' }}>{formatPrice(subtotal)}</Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography sx={{ color: 'text.secondary' }}>Shipping</Typography>
                      <Typography sx={{ fontWeight: 'bold', color: shipping === 0 ? '#10B981' : 'inherit' }}>
                        {shipping === 0 ? 'Free' : formatPrice(shipping)}
                      </Typography>
                    </Stack>
                    {shipping === 0 && (
                      <Box
                        sx={{
                          bgcolor: alpha('#10B981', 0.1),
                          border: '2px solid',
                          borderColor: alpha('#10B981', 0.3),
                          borderRadius: 2,
                          p: 1.5,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <LocalShipping sx={{ color: '#10B981', fontSize: 20 }} />
                        <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 'bold' }}>
                          You qualify for free shipping!
                        </Typography>
                      </Box>
                    )}
                    {shipping > 0 && (
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Add {formatPrice(999 - subtotal)} more for free shipping
                      </Typography>
                    )}
                  </Stack>

                  <Divider sx={{ my: 3, borderColor: alpha('#D4A574', 0.3) }} />

                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                    <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                      {formatPrice(total)}
                    </Typography>
                  </Stack>

                  <Button
                    fullWidth
                    onClick={proceedToCheckout}
                    variant="contained"
                    endIcon={<ArrowForward />}
                    sx={{
                      bgcolor: '#8B4513',
                      color: 'white',
                      py: 2,
                      borderRadius: 3,
                      fontWeight: 'bold',
                      fontSize: '1.1rem',
                      border: '2px solid #FFD700',
                      boxShadow: '0 8px 30px rgba(139, 69, 19, 0.4)',
                      mb: 2,
                      '&:hover': {
                        bgcolor: '#A0522D',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 12px 40px rgba(139, 69, 19, 0.5)'
                      }
                    }}
                  >
                    Proceed to Checkout
                  </Button>

                  <Button
                    fullWidth
                    component={Link}
                    to="/buyer/products"
                    sx={{
                      color: '#8B4513',
                      fontWeight: 'bold',
                      textTransform: 'none',
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.1)
                      }
                    }}
                  >
                    Continue Shopping
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default BuyerCart