import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Button, IconButton, Chip, Stack,
  Rating, Card, CardContent, Avatar, Tabs, Tab, alpha
} from '@mui/material'
import {
  Favorite, FavoriteBorder, ShoppingCart, Share, LocalShipping,
  VerifiedUser, Autorenew, ChevronLeft, ChevronRight, Star,
  CheckCircle, ArrowBack, Add, Remove, AutoAwesome
} from '@mui/icons-material'
import { Product } from '../../types'
import productService from '../../services/productService'
import { formatPrice } from '../../lib/utils'
import { Users, Award, ThumbsUp, Verified, MessageCircle } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import toast from 'react-hot-toast'

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { addToCart } = useCartStore()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState('description')
  const [addingToCart, setAddingToCart] = useState(false)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  
  const isWishlisted = product ? isInWishlist(product.id) : false

  useEffect(() => {
    if (id) {
      fetchProduct(parseInt(id))
    }
  }, [id])

  useEffect(() => {
    if (product) {
      fetchRelatedProducts(product.category)
      fetchReviews(product.id)
    }
  }, [product])

  const fetchProduct = async (productId: number) => {
    try {
      setLoading(true)
      const data = await productService.getPublicProduct(productId)
      setProduct(data)
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async (category: string) => {
    try {
      const allProducts = await productService.getPublicProducts()
      const related = allProducts
        .filter(p => p.category === category && p.id !== product?.id)
        .slice(0, 4)
      setRelatedProducts(related)
    } catch (error) {
      console.error('Error fetching related products:', error)
    }
  }

  const fetchReviews = async (productId: number) => {
    try {
      const productReviews = await productService.getProductReviews(productId)
      setReviews(productReviews)
    } catch (error) {
      console.error('Error fetching reviews:', error)
      setReviews([])
    }
  }

  const handleAddToCart = async () => {
    if (!user) {
      toast.error('Please login to add items to cart')
      navigate('/login')
      return
    }

    if (!product) return

    setAddingToCart(true)
    const success = await addToCart(user.id, product.id, quantity)
    setAddingToCart(false)
    
    if (success) {
      // Optionally navigate to cart or show success message
    }
  }

  const handleToggleWishlist = async () => {
    if (!user) {
      toast.error('Please login to add items to wishlist')
      navigate('/login')
      return
    }

    if (!product) return

    if (isWishlisted) {
      await removeFromWishlist(user.id, product.id)
    } else {
      await addToWishlist(user.id, product.id)
    }
  }

  // Reviews and related products are now fetched from API

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 6 }}>
          <Box sx={{ bgcolor: alpha('#D4A574', 0.1), height: 500, borderRadius: 6, animation: 'pulse 1.5s ease-in-out infinite' }} />
          <Stack spacing={3}>
            <Box sx={{ bgcolor: alpha('#D4A574', 0.1), height: 40, borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite' }} />
            <Box sx={{ bgcolor: alpha('#D4A574', 0.1), height: 30, borderRadius: 3, width: '60%', animation: 'pulse 1.5s ease-in-out infinite' }} />
            <Box sx={{ bgcolor: alpha('#D4A574', 0.1), height: 100, borderRadius: 3, animation: 'pulse 1.5s ease-in-out infinite' }} />
          </Stack>
        </Box>
      </Container>
    )
  }

  if (!product) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container maxWidth="sm">
          <Box sx={{ textAlign: 'center' }}>
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
                mb: 4
              }}
            >
              <ShoppingCart sx={{ fontSize: 80, color: alpha('#D4A574', 0.5) }} />
            </Box>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
              Product Not Found
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
              The product you're looking for doesn't exist or has been removed.
            </Typography>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              startIcon={<ArrowBack />}
              sx={{
                bgcolor: '#D4A574',
                borderRadius: 3,
                px: 4,
                py: 1.5,
                fontWeight: 'bold',
                '&:hover': { bgcolor: '#C9A86A' }
              }}
            >
              Back to Products
            </Button>
          </Box>
        </Container>
      </Box>
    )
  }

  const images = product.imageUrl
    ? [product.imageUrl, product.imageUrl, product.imageUrl] // Mock multiple images
    : [
      'https://www.re-thinkingthefuture.com/wp-content/uploads/2021/05/A4086-Handicrafts-from-Northeast-India-Image11.jpg',
      'https://exclusivelane.com/cdn/shop/files/EL-005-1686_A_580x.jpg?v=1740476654',
      'https://exclusivelane.com/cdn/shop/products/el-003-061-_a_580x.jpg?v=1740474777'
    ]

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9', position: 'relative' }}>
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
        {[...Array(30)].map((_, i) => {
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

      {/* Premium Breadcrumb */}
      <Box
        sx={{
          bgcolor: 'white',
          borderBottom: '2px solid',
          borderColor: alpha('#D4A574', 0.2),
          position: 'relative',
          zIndex: 1
        }}
      >
        <Container maxWidth="xl" sx={{ py: 2 }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <Button
              component={Link}
              to="/"
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': { color: '#D4A574' }
              }}
            >
              Home
            </Button>
            <ChevronRight sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Button
              component={Link}
              to="/products"
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                '&:hover': { color: '#D4A574' }
              }}
            >
              Products
            </Button>
            <ChevronRight sx={{ fontSize: 16, color: 'text.disabled' }} />
            <Typography sx={{ color: '#8B4513', fontWeight: 'bold' }}>
              {product.name}
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* Main Product Section */}
      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 8 }}>
          {/* Premium Product Images Gallery */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack spacing={3}>
              {/* Main Image */}
              <Box sx={{ position: 'relative' }}>
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      aspectRatio: '1',
                      overflow: 'hidden',
                      borderRadius: 6,
                      bgcolor: alpha('#D4A574', 0.05),
                      boxShadow: '0 20px 60px rgba(139, 69, 19, 0.15)',
                      border: '3px solid',
                      borderColor: alpha('#FFD700', 0.3),
                    }}
                  >
                    <Box
                      component="img"
                      src={images[selectedImage]}
                      alt={product.name}
                      sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transition: 'transform 0.5s',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                    />
                  </Box>
                </motion.div>

                {/* Navigation Buttons */}
                {images.length > 1 && (
                  <>
                    <IconButton
                      onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                      sx={{
                        position: 'absolute',
                        left: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        '&:hover': {
                          bgcolor: 'white',
                          transform: 'translateY(-50%) scale(1.1)',
                        },
                        transition: 'all 0.3s'
                      }}
                    >
                      <ChevronLeft />
                    </IconButton>
                    <IconButton
                      onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                      sx={{
                        position: 'absolute',
                        right: 16,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.9)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        '&:hover': {
                          bgcolor: 'white',
                          transform: 'translateY(-50%) scale(1.1)',
                        },
                        transition: 'all 0.3s'
                      }}
                    >
                      <ChevronRight />
                    </IconButton>
                  </>
                )}

                {/* Featured Badge */}
                {product.featured && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                  >
                    <Chip
                      icon={<AutoAwesome />}
                      label="Featured Product"
                      sx={{
                        position: 'absolute',
                        top: 20,
                        left: 20,
                        bgcolor: '#8B4513',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        px: 2,
                        py: 2.5,
                        boxShadow: '0 8px 25px rgba(139, 69, 19, 0.4)',
                        border: '2px solid #FFD700',
                        '& .MuiChip-icon': {
                          color: '#FFD700'
                        }
                      }}
                    />
                  </motion.div>
                )}
              </Box>

              {/* Thumbnail Images */}
              {images.length > 1 && (
                <Stack direction="row" spacing={2} justifyContent="center">
                  {images.map((image, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.1, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Box
                        onClick={() => setSelectedImage(index)}
                        sx={{
                          width: 90,
                          height: 90,
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: '3px solid',
                          borderColor: selectedImage === index ? '#FFD700' : alpha('#D4A574', 0.3),
                          cursor: 'pointer',
                          transition: 'all 0.3s',
                          boxShadow: selectedImage === index
                            ? '0 8px 25px rgba(255, 215, 0, 0.4)'
                            : '0 2px 10px rgba(0,0,0,0.1)',
                          '&:hover': {
                            borderColor: '#D4A574',
                            boxShadow: '0 6px 20px rgba(212, 165, 116, 0.3)'
                          }
                        }}
                      >
                        <Box
                          component="img"
                          src={image}
                          alt=""
                          sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                      </Box>
                    </motion.div>
                  ))}
                </Stack>
              )}
            </Stack>
          </motion.div>

          {/* Premium Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack spacing={4}>
              {/* Premium Header */}
              <Box>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 3 }}>
                  <Chip
                    label={product.category}
                    sx={{
                      bgcolor: alpha('#D4A574', 0.15),
                      color: '#8B4513',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      px: 1,
                      border: '2px solid',
                      borderColor: alpha('#D4A574', 0.3)
                    }}
                  />
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <Rating value={5} readOnly size="small" sx={{ color: '#FFD700' }} />
                    <Typography variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                      (4.8) • 24 reviews
                    </Typography>
                  </Stack>
                </Stack>

                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1F2937',
                    mb: 3,
                    fontFamily: 'serif',
                    fontSize: { xs: '2rem', md: '2.5rem' }
                  }}
                >
                  {product.name}
                </Typography>

                <Stack direction="row" spacing={3} sx={{ mb: 2 }}>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar sx={{ width: 24, height: 24, bgcolor: alpha('#D4A574', 0.2) }}>
                      <Typography sx={{ fontSize: '0.7rem', color: '#8B4513' }}>
                        {product.seller?.name?.[0]}
                      </Typography>
                    </Avatar>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      by <strong>{product.seller?.name}</strong>
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <CheckCircle sx={{ fontSize: 20, color: '#10B981' }} />
                    <Typography variant="body2" sx={{ color: '#10B981', fontWeight: 'bold' }}>
                      Verified Artisan
                    </Typography>
                  </Stack>
                </Stack>
              </Box>

              {/* Premium Price Card */}
              <Card
                sx={{
                  background: 'linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 100%)',
                  borderRadius: 4,
                  border: '3px solid',
                  borderColor: alpha('#FFD700', 0.4),
                  boxShadow: '0 10px 40px rgba(255, 215, 0, 0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at top right, rgba(255,215,0,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                  }
                }}
              >
                <CardContent sx={{ p: 4, position: 'relative', zIndex: 1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 'bold',
                          color: '#8B4513',
                          mb: 2,
                          textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
                        }}
                      >
                        {formatPrice(product.price)}
                      </Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Box
                          sx={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            bgcolor: product.stock > 0 ? '#10B981' : '#EF4444',
                            boxShadow: `0 0 10px ${product.stock > 0 ? '#10B981' : '#EF4444'}`
                          }}
                        />
                        <Typography
                          variant="body1"
                          sx={{
                            color: product.stock > 0 ? '#10B981' : '#EF4444',
                            fontWeight: 'bold'
                          }}
                        >
                          {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                        </Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                        Free shipping on orders above
                      </Typography>
                      <Typography variant="h6" sx={{ color: '#10B981', fontWeight: 'bold' }}>
                        ₹999
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>
              </Card>

              {/* Premium Description */}
              <Card
                sx={{
                  borderRadius: 4,
                  border: '2px solid',
                  borderColor: alpha('#D4A574', 0.2),
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}
              >
                <CardContent sx={{ p: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513', mb: 2 }}>
                    Product Description
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {product.description || "This authentic tribal craft represents centuries of traditional artistry and cultural heritage. Each piece is handcrafted by skilled artisans using time-honored techniques passed down through generations."}
                  </Typography>
                </CardContent>
              </Card>

              {/* Quantity and Actions */}
              <Stack spacing={3}>
                <Stack direction="row" spacing={3} alignItems="center">
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                    Quantity:
                  </Typography>
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
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      sx={{
                        color: '#8B4513',
                        '&:hover': { bgcolor: alpha('#D4A574', 0.2) }
                      }}
                    >
                      <Remove />
                    </IconButton>
                    <Typography
                      sx={{
                        px: 4,
                        py: 1,
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        color: '#8B4513',
                        minWidth: 60,
                        textAlign: 'center'
                      }}
                    >
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      sx={{
                        color: '#8B4513',
                        '&:hover': { bgcolor: alpha('#D4A574', 0.2) }
                      }}
                    >
                      <Add />
                    </IconButton>
                  </Stack>
                </Stack>

                <Stack direction="row" spacing={2}>
                  <motion.div
                    style={{ flex: 1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      fullWidth
                      disabled={product.stock === 0 || addingToCart}
                      onClick={handleAddToCart}
                      startIcon={<ShoppingCart />}
                      sx={{
                        bgcolor: '#8B4513',
                        color: 'white',
                        py: 2,
                        px: 4,
                        borderRadius: 4,
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        boxShadow: '0 8px 30px rgba(139, 69, 19, 0.4)',
                        border: '2px solid #FFD700',
                        transition: 'all 0.3s',
                        '&:hover': {
                          bgcolor: '#A0522D',
                          boxShadow: '0 12px 40px rgba(139, 69, 19, 0.5)',
                          transform: 'translateY(-2px)'
                        },
                        '&:disabled': {
                          opacity: 0.5,
                          cursor: 'not-allowed'
                        }
                      }}
                    >
                      {addingToCart ? 'Adding...' : 
                       !user ? 'Login to Buy' : 
                       `Add to Cart • ${formatPrice(product.price * quantity)}`}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      onClick={handleToggleWishlist}
                      sx={{
                        bgcolor: isWishlisted ? alpha('#EF4444', 0.15) : alpha('#D4A574', 0.1),
                        color: isWishlisted ? '#EF4444' : '#6B7280',
                        border: '2px solid',
                        borderColor: isWishlisted ? alpha('#EF4444', 0.3) : alpha('#D4A574', 0.3),
                        borderRadius: 3,
                        p: 2,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: isWishlisted ? alpha('#EF4444', 0.25) : alpha('#EF4444', 0.1),
                          borderColor: '#EF4444'
                        }
                      }}
                    >
                      {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                    </IconButton>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <IconButton
                      sx={{
                        bgcolor: alpha('#D4A574', 0.1),
                        color: '#6B7280',
                        border: '2px solid',
                        borderColor: alpha('#D4A574', 0.3),
                        borderRadius: 3,
                        p: 2,
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        '&:hover': {
                          bgcolor: alpha('#3B82F6', 0.1),
                          borderColor: '#3B82F6',
                          color: '#3B82F6'
                        }
                      }}
                    >
                      <Share />
                    </IconButton>
                  </motion.div>
                </Stack>
              </Stack>

              {/* Premium Features */}
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}>
                {[
                  { icon: LocalShipping, title: 'Free Shipping', desc: 'On orders above ₹999', color: '#3B82F6' },
                  { icon: VerifiedUser, title: 'Authentic', desc: '100% genuine tribal craft', color: '#10B981' },
                  { icon: Autorenew, title: 'Easy Returns', desc: '7-day return policy', color: '#8B5CF6' }
                ].map((feature, index) => {
                  const Icon = feature.icon
                  return (
                    <motion.div
                      key={index}
                      whileHover={{ y: -5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: alpha(feature.color, 0.2),
                          boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: feature.color,
                            boxShadow: `0 8px 25px ${alpha(feature.color, 0.2)}`
                          }
                        }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Icon sx={{ fontSize: 28, color: feature.color }} />
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                                {feature.title}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {feature.desc}
                              </Typography>
                            </Box>
                          </Stack>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </Box>
            </Stack>
          </motion.div>
        </Box>
      </Container>

      {/* Premium Tabs Section */}
      <Container maxWidth="xl" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
            overflow: 'hidden',
            border: '2px solid',
            borderColor: alpha('#D4A574', 0.2)
          }}
        >
          {/* Premium Tab Headers */}
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: '2px solid',
              borderColor: alpha('#D4A574', 0.2),
              bgcolor: alpha('#FFF8DC', 0.3),
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 'bold',
                fontSize: '1rem',
                py: 3,
                color: '#6B7280',
                transition: 'all 0.3s',
                '&:hover': {
                  color: '#D4A574',
                  bgcolor: alpha('#D4A574', 0.05)
                },
                '&.Mui-selected': {
                  color: '#8B4513',
                  bgcolor: alpha('#D4A574', 0.1)
                }
              },
              '& .MuiTabs-indicator': {
                height: 3,
                bgcolor: '#FFD700',
                borderRadius: '3px 3px 0 0'
              }
            }}
          >
            <Tab
              value="description"
              label="Product Details"
              icon={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <MessageCircle size={20} />
                </Box>
              }
              iconPosition="start"
            />
            <Tab
              value="reviews"
              label="Reviews (24)"
              icon={<Star sx={{ fontSize: 20 }} />}
              iconPosition="start"
            />
            <Tab
              value="artisan"
              label="About Artisan"
              icon={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Users size={20} />
                </Box>
              }
              iconPosition="start"
            />
          </Tabs>

          {/* Premium Tab Content */}
          <CardContent sx={{ p: 6 }}>
            {activeTab === 'description' && (
              <Stack spacing={4}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8B4513', fontFamily: 'serif' }}>
                  Product Details
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontSize: '1.1rem' }}>
                  {product.description || "This exquisite piece represents the finest in traditional tribal craftsmanship. Each item is meticulously handcrafted by skilled artisans who have inherited their techniques through generations of cultural tradition."}
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3, mt: 2 }}>
                  <Card sx={{ bgcolor: alpha('#D4A574', 0.05), borderRadius: 3, border: '2px solid', borderColor: alpha('#D4A574', 0.2) }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513', mb: 2 }}>
                        Craftsmanship
                      </Typography>
                      <Stack spacing={1}>
                        {[
                          'Handcrafted using traditional techniques',
                          'Made with authentic tribal materials',
                          'Each piece is unique and one-of-a-kind',
                          'Supports local artisan communities'
                        ].map((item, i) => (
                          <Typography key={i} variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                            <Box component="span" sx={{ color: '#D4A574', mr: 1, fontWeight: 'bold' }}>•</Box>
                            {item}
                          </Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: alpha('#D4A574', 0.05), borderRadius: 3, border: '2px solid', borderColor: alpha('#D4A574', 0.2) }}>
                    <CardContent>
                      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513', mb: 2 }}>
                        Care Instructions
                      </Typography>
                      <Stack spacing={1}>
                        {[
                          'Handle with care to preserve craftsmanship',
                          'Clean gently with soft, dry cloth',
                          'Avoid exposure to direct sunlight',
                          'Store in a cool, dry place'
                        ].map((item, i) => (
                          <Typography key={i} variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center' }}>
                            <Box component="span" sx={{ color: '#D4A574', mr: 1, fontWeight: 'bold' }}>•</Box>
                            {item}
                          </Typography>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>
                </Box>
              </Stack>
            )}

            {activeTab === 'reviews' && (
              <Stack spacing={4}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8B4513', fontFamily: 'serif' }}>
                    Customer Reviews
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#D4A574',
                      borderRadius: 3,
                      fontWeight: 'bold',
                      '&:hover': { bgcolor: '#C9A86A' }
                    }}
                  >
                    Write a Review
                  </Button>
                </Stack>

                {/* Premium Review Summary */}
                <Card sx={{ background: 'linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 100%)', borderRadius: 3, border: '2px solid', borderColor: alpha('#D4A574', 0.3) }}>
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={6} alignItems="center">
                      <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="h2" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                          4.8
                        </Typography>
                        <Rating value={5} readOnly sx={{ color: '#FFD700', mt: 1 }} />
                        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                          24 reviews
                        </Typography>
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <Stack key={rating} direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Typography variant="body2" sx={{ fontWeight: 'bold', width: 30 }}>
                              {rating}★
                            </Typography>
                            <Box sx={{ flex: 1, bgcolor: alpha('#D4A574', 0.2), borderRadius: 2, height: 8 }}>
                              <Box
                                sx={{
                                  bgcolor: '#FFD700',
                                  height: '100%',
                                  borderRadius: 2,
                                  width: `${rating === 5 ? 70 : rating === 4 ? 20 : 5}%`,
                                  transition: 'width 0.5s'
                                }}
                              />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary', width: 30 }}>
                              {rating === 5 ? 17 : rating === 4 ? 5 : 2}
                            </Typography>
                          </Stack>
                        ))}
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Individual Reviews */}
                <Stack spacing={3}>
                  {reviews.length > 0 ? reviews.map((review) => (
                    <motion.div
                      key={review.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Card
                        sx={{
                          borderRadius: 3,
                          border: '2px solid',
                          borderColor: alpha('#D4A574', 0.2),
                          boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                          transition: 'all 0.3s',
                          '&:hover': {
                            borderColor: '#D4A574',
                            boxShadow: '0 8px 25px rgba(212, 165, 116, 0.2)'
                          }
                        }}
                      >
                        <CardContent sx={{ p: 4 }}>
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Avatar
                                sx={{
                                  width: 48,
                                  height: 48,
                                  bgcolor: alpha('#D4A574', 0.2),
                                  color: '#8B4513',
                                  fontWeight: 'bold',
                                  fontSize: '1.2rem'
                                }}
                              >
                                {review.name[0]}
                              </Avatar>
                              <Box>
                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                                    {review.name}
                                  </Typography>
                                  {review.verified && (
                                    <Box sx={{ display: 'flex', alignItems: 'center', color: '#10B981' }}>
                                      <Verified size={18} />
                                    </Box>
                                  )}
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                  <Rating value={review.rating} readOnly size="small" sx={{ color: '#FFD700' }} />
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {review.date}
                                  </Typography>
                                </Stack>
                              </Box>
                            </Stack>
                          </Stack>
                          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3, lineHeight: 1.7 }}>
                            {review.comment}
                          </Typography>
                          <Button
                            startIcon={
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <ThumbsUp size={16} />
                              </Box>
                            }
                            sx={{
                              color: 'text.secondary',
                              textTransform: 'none',
                              '&:hover': {
                                color: '#D4A574',
                                bgcolor: alpha('#D4A574', 0.1)
                              }
                            }}
                          >
                            Helpful ({review.helpful})
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )) : (
                    <Box sx={{ textAlign: 'center', py: 6 }}>
                      <Typography variant="h6" sx={{ color: 'text.secondary', mb: 2 }}>
                        No reviews yet
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Be the first to review this product!
                      </Typography>
                    </Box>
                  )}
                </Stack>
              </Stack>
            )}

            {activeTab === 'artisan' && (
              <Stack spacing={4}>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8B4513', fontFamily: 'serif' }}>
                  About the Artisan
                </Typography>
                <Card
                  sx={{
                    background: 'linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 100%)',
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: alpha('#D4A574', 0.3),
                    boxShadow: '0 8px 30px rgba(212, 165, 116, 0.2)'
                  }}
                >
                  <CardContent sx={{ p: 6 }}>
                    <Stack direction="row" spacing={4} alignItems="center" sx={{ mb: 4 }}>
                      <Avatar
                        src="https://exclusivelane.com/cdn/shop/files/EL-005-1686_A_580x.jpg?v=1740476654"
                        alt={product.seller?.name}
                        sx={{
                          width: 96,
                          height: 96,
                          border: '4px solid white',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }}
                      />
                      <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
                          {product.seller?.name}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#8B4513', fontWeight: 'bold', mb: 2 }}>
                          Master Craftsperson
                        </Typography>
                        <Stack direction="row" spacing={3}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#FFD700' }}>
                              <Award size={20} />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              15+ years experience
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Box sx={{ display: 'flex', alignItems: 'center', color: '#3B82F6' }}>
                              <Users size={20} />
                            </Box>
                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                              500+ satisfied customers
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                      {product.seller?.name} is a renowned artisan from the tribal communities of India, specializing in traditional {product.category.toLowerCase()} crafts.
                      With over 15 years of experience, they have mastered the ancient techniques passed down through generations,
                      creating authentic pieces that preserve cultural heritage while meeting modern aesthetic sensibilities.
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            )}
          </CardContent>
        </Card>
      </Container>

      {/* Premium Related Products */}
      <Container maxWidth="xl" sx={{ py: 8, position: 'relative', zIndex: 1 }}>
        <Typography
          variant="h3"
          sx={{
            fontWeight: 'bold',
            color: '#1F2937',
            mb: 6,
            textAlign: 'center',
            fontFamily: 'serif'
          }}
        >
          You Might Also Like
        </Typography>
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }, gap: 4 }}>
          {relatedProducts.length > 0 ? relatedProducts.map((relatedProduct) => (
            <motion.div
              key={relatedProduct.id}
              whileHover={{ y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                component={Link}
                to={`/products/${relatedProduct.id}`}
                sx={{
                  borderRadius: 4,
                  overflow: 'hidden',
                  border: '2px solid',
                  borderColor: alpha('#D4A574', 0.2),
                  boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.3s',
                  '&:hover': {
                    borderColor: '#D4A574',
                    boxShadow: '0 12px 40px rgba(212, 165, 116, 0.3)',
                    '& .product-image': {
                      transform: 'scale(1.1)'
                    },
                    '& .product-name': {
                      color: '#D4A574'
                    }
                  }
                }}
              >
                <Box sx={{ position: 'relative', height: 200, overflow: 'hidden', bgcolor: alpha('#D4A574', 0.05) }}>
                  <Box
                    component="img"
                    src={relatedProduct.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400'}
                    alt={relatedProduct.name}
                    className="product-image"
                    sx={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.5s'
                    }}
                  />
                </Box>
                <CardContent sx={{ p: 3 }}>
                  <Typography
                    variant="h6"
                    className="product-name"
                    sx={{
                      fontWeight: 'bold',
                      color: '#1F2937',
                      mb: 1,
                      transition: 'color 0.3s'
                    }}
                  >
                    {relatedProduct.name}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                    {formatPrice(relatedProduct.price)}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          )) : (
            <Box sx={{ gridColumn: '1 / -1', textAlign: 'center', py: 6 }}>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                No related products found
              </Typography>
            </Box>
          )}
        </Box>
      </Container>
    </Box>
  )
}

export default ProductDetailPage