import { useState, useEffect } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, TextField, InputAdornment, Button,
  Card, CardContent, IconButton, Chip, Stack, Divider,
  Skeleton, ToggleButtonGroup, ToggleButton, MenuItem, Select,
  FormControl, alpha
} from '@mui/material'
import {
  Search as SearchIcon, ViewModule, ViewList, Favorite,
  FavoriteBorder, ShoppingCart, Visibility, TuneOutlined,
  Sort as SortIcon, Add, AutoAwesome
} from '@mui/icons-material'
import { Product } from '../../types'
import productService from '../../services/productService'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { formatPrice, debounce } from '../../lib/utils'
import toast from 'react-hot-toast'

const ProductsPage = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [searchParams, setSearchParams] = useSearchParams()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'name'
  })

  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuthStore()
  const { addToCart } = useCartStore()

  const handleAddToCart = async (product: Product) => {
    if (!isAuthenticated || !user) {
      toast.error('Please login or register to add items to cart')
      navigate('/login')
      return
    }

    if (user.role !== 'BUYER') {
      toast.error('Only buyers can add items to cart')
      return
    }

    try {
      await addToCart(user.id, product.id, 1)
      toast.success(`${product.name} added to cart!`)
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast.error('Failed to add item to cart')
    }
  }

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev)
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId)
      } else {
        newFavorites.add(productId)
      }
      return newFavorites
    })
  }

  const categoryImages = {
    'Pottery': 'https://imgs.search.brave.com/ZCTodq8c7JDap4xxa1WzseaCLkOnMt-clgLirM-PW2Q/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9wcmV2/aWV3LnJlZGQuaXQv/bXktZmlyc3QtY29t/cGxldGUtZGlubmVy/d2FyZS1zZXQtdjAt/NXplMzZlcWlzNnhm/MS5qcGc_d2lkdGg9/NjQwJmNyb3A9c21h/cnQmYXV0bz13ZWJw/JnM9MWU2MjQxZGFl/MjA2YWRkNjllZTFk/YWU2YzAxNDg1YTkx/ZGFhZDY0NA',
    'Textiles': 'https://imgs.search.brave.com/wIZ9d9piVYucSdkM2FWYufxNe_DtP8wWBi6uS85wOek/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWFn/ZXMuc3F1YXJlc3Bh/Y2UtY2RuLmNvbS9j/b250ZW50L3YxLzU1/NWY4MjNhZTRiMDdm/MGM5NTQ1ZmI0OC8x/NDM1Mjc4NjAzNjU3/LTM0N1hZV081UFcw/Rlc2S0FMUzM4L3Zp/ZXRuYW0xMjA2Mzhf/NTJtYjhiaXQuanBn',
    'Handicrafts': 'https://imgs.search.brave.com/MSgmx4SSowsIoK6BrN9R0UMq-h4e_V3XMD5ETtwD9aI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS1waG90/by9vbGQtY3JhZnRz/LWhhbmRpY3JhZnRz/XzQzMzkwNS0yOTI2/MS5qcGc_c2VtdD1h/aXNfaHlicmlkJnc9/NzQw',
    'Jewelry': 'https://3.bp.blogspot.com/-kwWfEcnYrm8/VgaqTUMNdSI/AAAAAAAABcQ/m9YH36TSwcc/s1600/Tribal%2BTurtle%2BPendant%2BN1.jpg',
    'Wood Crafts': 'https://3.bp.blogspot.com/-o81RCx1BOjU/VCGSgH_uOZI/AAAAAAAAe5s/TGYLHTajc9E/s1600/cane%2Bbamboo%2Bcrafts%2Bwest%2Bbengal%2Bindia.jpg',
    'Metal Crafts': 'https://ibgnews.com/wp-content/uploads/2020/10/Dokra-Metal-art-work-Tribal-Art-of-India.jpg',
    'Paintings': 'https://1.bp.blogspot.com/-sRPIhDDYOZM/XoRt4kfIKPI/AAAAAAAACrQ/pELRowS2rgQW2fC7pbuI0DRfAz9Xn3yfQCK4BGAsYHg/warli_painting-750x410.jpg'
  }

  // Calculate category counts dynamically from products
  const getCategoryCounts = () => {
    const counts: Record<string, number> = {}
    products.forEach(product => {
      counts[product.category] = (counts[product.category] || 0) + 1
    })
    return counts
  }

  const categoryCounts = getCategoryCounts()
  
  const categories = [
    { name: 'All Categories', count: products.length, image: '' },
    ...Object.keys(categoryCounts).map(cat => ({
      name: cat,
      count: categoryCounts[cat],
      image: categoryImages[cat as keyof typeof categoryImages] || ''
    }))
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [products, filters])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getPublicProducts()
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = [...products]

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.description.toLowerCase().includes(filters.search.toLowerCase()) ||
        product.category.toLowerCase().includes(filters.search.toLowerCase())
      )
    }

    // Category filter
    if (filters.category && filters.category !== 'All Categories') {
      filtered = filtered.filter(product => product.category === filters.category)
    }

    // Price filter
    if (filters.minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(filters.minPrice))
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(filters.maxPrice))
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'name':
        default:
          return a.name.localeCompare(b.name)
      }
    })

    setFilteredProducts(filtered)
  }

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)

    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams)
    if (value) {
      newSearchParams.set(key, value)
    } else {
      newSearchParams.delete(key)
    }
    setSearchParams(newSearchParams)
  }

  const debouncedSearch = debounce((value: string) => {
    handleFilterChange('search', value)
  }, 300)

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 3 }}>
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

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9', position: 'relative' }}>
      {/* Enhanced Floating Particles Background */}
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
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 8 + 2
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
                  ? `radial-gradient(circle, rgba(255,215,0,${Math.random() * 0.6 + 0.2}) 0%, rgba(212,165,116,${Math.random() * 0.4 + 0.1}) 100%)`
                  : `rgba(212, 165, 116, ${Math.random() * 0.5 + 0.1})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: isGold ? '0 0 10px rgba(255,215,0,0.3)' : 'none',
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0.2, 0.8, 0.2],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: Math.random() * 5 + 3,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          )
        })}
      </Box>

      {/* Hero Section - Premium Tribal Design */}
      <Box
        sx={{
          position: 'relative',
          minHeight: { xs: '65vh', md: '75vh' },
          background: 'linear-gradient(135deg, #8B4513 0%, #D4A574 40%, #C9A86A 100%)',
          color: 'white',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,248,220,0.1) 0%, transparent 50%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            opacity: 0.1,
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23000000" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
          }}
        />
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', maxWidth: 900, mx: 'auto' }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {/* Decorative Top Element */}
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
                <Box sx={{ width: 40, height: 2, bgcolor: 'rgba(255,255,255,0.5)' }} />
                <AutoAwesome sx={{ color: '#FFD700' }} />
                <Box sx={{ width: 40, height: 2, bgcolor: 'rgba(255,255,255,0.5)' }} />
              </Stack>

              <Typography
                sx={{
                  fontSize: { xs: '0.9rem', md: '1.1rem' },
                  letterSpacing: 4,
                  textTransform: 'uppercase',
                  color: '#FFD700',
                  mb: 3,
                  fontWeight: 'bold'
                }}
              >
                ✦ Handcrafted Excellence ✦
              </Typography>

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 'bold',
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '4.5rem' },
                  fontFamily: 'serif',
                  lineHeight: 1.1,
                  textShadow: '3px 3px 6px rgba(0,0,0,0.3)',
                  background: 'linear-gradient(to right, #FFF 0%, #FFD700 50%, #FFF 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  animation: 'shimmer 3s ease-in-out infinite',
                  '@keyframes shimmer': {
                    '0%, 100%': { backgroundPosition: '0% 50%' },
                    '50%': { backgroundPosition: '100% 50%' }
                  },
                  backgroundSize: '200% auto'
                }}
              >
                Discover Authentic
                <br />
                Tribal Treasures
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mb: 5,
                  opacity: 0.95,
                  maxWidth: 700,
                  mx: 'auto',
                  fontSize: { xs: '1.1rem', md: '1.4rem' },
                  lineHeight: 1.7,
                  fontWeight: 400
                }}
              >
                {products.length}+ unique handcrafted products from talented artisans.
                <br />
                <Box component="span" sx={{ color: '#FFD700', fontWeight: 'bold' }}>
                  Each piece tells a story of tradition & craftsmanship
                </Box>
              </Typography>

              {/* Premium Stats with Enhanced Effects */}
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={4}
                sx={{ mb: 6, justifyContent: 'center' }}
              >
                {[
                  { label: '100% Authentic', icon: '✓', color: '#90EE90', glow: 'rgba(144,238,144,0.4)' },
                  { label: 'Fair Trade Certified', icon: '♥', color: '#FFB6C1', glow: 'rgba(255,182,193,0.4)' },
                  { label: 'Direct from Artisans', icon: '★', color: '#FFD700', glow: 'rgba(255,215,0,0.4)' }
                ].map((stat, i) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.5, rotateY: -180 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{
                      delay: 0.4 + i * 0.15,
                      duration: 0.6,
                      type: 'spring',
                      stiffness: 100
                    }}
                    whileHover={{
                      scale: 1.1,
                      rotateY: 5,
                      transition: { duration: 0.3 }
                    }}
                  >
                    <Box
                      sx={{
                        bgcolor: 'rgba(255,255,255,0.15)',
                        backdropFilter: 'blur(15px)',
                        borderRadius: 5,
                        p: 2.5,
                        border: '2px solid rgba(255,255,255,0.3)',
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(90deg, transparent, ${stat.glow}, transparent)`,
                          transition: 'left 0.5s'
                        },
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.05)',
                          boxShadow: `0 15px 40px ${stat.glow}, 0 0 20px ${stat.glow}`,
                          bgcolor: 'rgba(255,255,255,0.25)',
                          borderColor: stat.color,
                          '&::before': {
                            left: '100%'
                          }
                        }
                      }}
                    >
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 1
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: '2.5rem',
                            mb: 0.5,
                            color: stat.color,
                            textShadow: `0 0 10px ${stat.glow}`
                          }}
                        >
                          {stat.icon}
                        </Typography>
                      </motion.div>
                      <Typography sx={{ fontSize: '0.95rem', fontWeight: 'bold', letterSpacing: 0.5 }}>
                        {stat.label}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Stack>

              {/* Premium Search Bar with Effects */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <Box sx={{ maxWidth: 600, mx: 'auto', position: 'relative' }}>
                  {/* Glow Effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: -2,
                      background: 'linear-gradient(45deg, #FFD700, #D4A574, #FFD700)',
                      borderRadius: 5,
                      opacity: 0.3,
                      filter: 'blur(8px)',
                      animation: 'pulse 2s ease-in-out infinite',
                      '@keyframes pulse': {
                        '0%, 100%': { opacity: 0.3 },
                        '50%': { opacity: 0.6 }
                      }
                    }}
                  />
                  <TextField
                    fullWidth
                    placeholder="Search pottery, textiles, jewelry..."
                    defaultValue={filters.search}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <SearchIcon sx={{ color: '#D4A574', fontSize: 26 }} />
                          </motion.div>
                        </InputAdornment>
                      ),
                      sx: {
                        bgcolor: 'white',
                        borderRadius: 5,
                        fontSize: '1.05rem',
                        py: 0.5,
                        px: 2,
                        position: 'relative',
                        '& fieldset': { border: 'none' },
                        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                        border: '2px solid rgba(255,215,0,0.4)',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover': {
                          boxShadow: '0 15px 50px rgba(255,215,0,0.4)',
                          transform: 'translateY(-4px) scale(1.02)',
                          borderColor: '#FFD700',
                        },
                        '&:focus-within': {
                          boxShadow: '0 20px 60px rgba(255,215,0,0.5)',
                          transform: 'translateY(-5px) scale(1.03)',
                          borderColor: '#FFD700',
                        }
                      }
                    }}
                  />
                </Box>
              </motion.div>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              style={{
                position: 'absolute',
                bottom: 30,
                left: '50%',
                transform: 'translateX(-50%)'
              }}
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Typography sx={{ fontSize: '2.5rem', opacity: 0.8, textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                ↓
              </Typography>
            </motion.div>
          </Box>
        </Container>
      </Box>

      {/* Premium Category Pills */}
      <Box
        sx={{
          py: 5,
          bgcolor: '#FFF8DC',
          borderBottom: '3px solid',
          borderColor: alpha('#D4A574', 0.3),
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '100%',
            background: 'linear-gradient(90deg, transparent 0%, rgba(212,165,116,0.05) 50%, transparent 100%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Container maxWidth="xl">
          <Typography
            variant="h5"
            align="center"
            sx={{
              mb: 4,
              fontWeight: 'bold',
              color: '#8B4513',
              fontFamily: 'serif',
              letterSpacing: 2
            }}
          >
            ✦ EXPLORE BY CATEGORY ✦
          </Typography>
          <Stack
            direction="row"
            spacing={2}
            sx={{
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2.5
            }}
          >
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Chip
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <span>{category.name}</span>
                      {category.count > 0 && (
                        <Typography
                          component="span"
                          sx={{ fontSize: '0.875rem', opacity: 0.75 }}
                        >
                          ({category.count})
                        </Typography>
                      )}
                    </Box>
                  }
                  onClick={() => handleFilterChange('category', category.name === 'All Categories' ? '' : category.name)}
                  sx={{
                    px: 2,
                    py: 3,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    borderRadius: 8,
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    ...(filters.category === category.name || (filters.category === '' && category.name === 'All Categories')
                      ? {
                        bgcolor: '#D4A574',
                        color: 'white',
                        boxShadow: '0 4px 20px rgba(212, 165, 116, 0.4)',
                        '&:hover': {
                          bgcolor: '#C9A86A',
                          boxShadow: '0 6px 25px rgba(212, 165, 116, 0.5)'
                        }
                      }
                      : {
                        bgcolor: alpha('#D4A574', 0.1),
                        color: '#1F2937',
                        '&:hover': {
                          bgcolor: alpha('#D4A574', 0.2),
                          transform: 'translateY(-2px)',
                          boxShadow: '0 4px 15px rgba(212, 165, 116, 0.2)'
                        }
                      })
                  }}
                />
              </motion.div>
            ))}
          </Stack>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          {/* Sidebar Filters - Desktop */}
          <Box sx={{ width: 320, flexShrink: 0, display: { xs: 'none', lg: 'block' } }}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                position: 'sticky',
                top: 24
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                    Filters
                  </Typography>
                  <TuneOutlined sx={{ color: '#D4A574' }} />
                </Box>

                {/* Price Range */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#1F2937' }}>
                    Price Range
                  </Typography>
                  <Stack spacing={2}>
                    <TextField
                      type="number"
                      placeholder="Min ₹"
                      value={filters.minPrice}
                      onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': { borderColor: '#D4A574' },
                          '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                        }
                      }}
                    />
                    <TextField
                      type="number"
                      placeholder="Max ₹"
                      value={filters.maxPrice}
                      onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                      size="small"
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': { borderColor: '#D4A574' },
                          '&.Mui-focused fieldset': { borderColor: '#D4A574' }
                        }
                      }}
                    />

                    {/* Quick Price Filters */}
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1 }}>
                      {[
                        { label: 'Under ₹500', min: '', max: '500' },
                        { label: '₹500-₹1000', min: '500', max: '1000' },
                        { label: '₹1000-₹2000', min: '1000', max: '2000' },
                        { label: 'Above ₹2000', min: '2000', max: '' }
                      ].map((range) => (
                        <Box key={range.label}>
                          <Button
                            fullWidth
                            size="small"
                            onClick={() => {
                              handleFilterChange('minPrice', range.min)
                              handleFilterChange('maxPrice', range.max)
                            }}
                            sx={{
                              bgcolor: alpha('#D4A574', 0.1),
                              color: '#1F2937',
                              borderRadius: 2,
                              fontSize: '0.75rem',
                              py: 1,
                              '&:hover': {
                                bgcolor: alpha('#D4A574', 0.2),
                                color: '#D4A574'
                              }
                            }}
                          >
                            {range.label}
                          </Button>
                        </Box>
                      ))}
                    </Box>
                  </Stack>
                </Box>

                {/* Categories with Images */}
                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2, color: '#1F2937' }}>
                    Categories
                  </Typography>
                  <Stack spacing={1}>
                    {categories.slice(1).map((category) => (
                      <Button
                        key={category.name}
                        fullWidth
                        onClick={() => handleFilterChange('category', category.name)}
                        sx={{
                          justifyContent: 'flex-start',
                          p: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          border: '2px solid',
                          borderColor: filters.category === category.name ? '#D4A574' : 'transparent',
                          bgcolor: filters.category === category.name ? alpha('#D4A574', 0.1) : 'transparent',
                          '&:hover': {
                            bgcolor: alpha('#D4A574', 0.05),
                            borderColor: alpha('#D4A574', 0.3)
                          }
                        }}
                      >
                        <Box
                          component="img"
                          src={category.image}
                          alt={category.name}
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: 2,
                            objectFit: 'cover',
                            mr: 2
                          }}
                        />
                        <Box sx={{ flex: 1, textAlign: 'left' }}>
                          <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                            {category.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            {category.count} items
                          </Typography>
                        </Box>
                      </Button>
                    ))}
                  </Stack>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* Clear Filters */}
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: '',
                      minPrice: '',
                      maxPrice: '',
                      sortBy: 'name'
                    })
                    setSearchParams({})
                  }}
                  sx={{
                    borderRadius: 3,
                    borderColor: '#D4A574',
                    color: '#D4A574',
                    fontWeight: 'bold',
                    py: 1.5,
                    '&:hover': {
                      borderColor: '#C9A86A',
                      bgcolor: alpha('#D4A574', 0.1)
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              </CardContent>
            </Card>
          </Box>

          {/* Main Content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            {/* Toolbar */}
            <Card sx={{ borderRadius: 4, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', mb: 3 }}>
              <CardContent>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2}
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography variant="body1" sx={{ fontWeight: 'medium', color: 'text.secondary' }}>
                    Showing {filteredProducts.length} of {products.length} products
                  </Typography>

                  <Stack direction="row" spacing={2} alignItems="center">
                    {/* Sort */}
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                      <Select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                        startAdornment={
                          <InputAdornment position="start">
                            <SortIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
                          </InputAdornment>
                        }
                        sx={{
                          borderRadius: 3,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: alpha('#D4A574', 0.3)
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#D4A574'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#D4A574'
                          }
                        }}
                      >
                        <MenuItem value="name">Sort by Name</MenuItem>
                        <MenuItem value="price-low">Price: Low to High</MenuItem>
                        <MenuItem value="price-high">Price: High to Low</MenuItem>
                        <MenuItem value="newest">Newest First</MenuItem>
                        <MenuItem value="popular">Most Popular</MenuItem>
                      </Select>
                    </FormControl>

                    {/* View Mode */}
                    <ToggleButtonGroup
                      value={viewMode}
                      exclusive
                      onChange={(_, newView) => newView && setViewMode(newView)}
                      sx={{
                        bgcolor: alpha('#D4A574', 0.05),
                        borderRadius: 3,
                        '& .MuiToggleButton-root': {
                          border: 'none',
                          borderRadius: 2,
                          '&.Mui-selected': {
                            bgcolor: 'white',
                            color: '#D4A574',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                            '&:hover': {
                              bgcolor: 'white'
                            }
                          }
                        }
                      }}
                    >
                      <ToggleButton value="grid">
                        <ViewModule />
                      </ToggleButton>
                      <ToggleButton value="list">
                        <ViewList />
                      </ToggleButton>
                    </ToggleButtonGroup>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>

            {/* Products */}
            {filteredProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 12 }}>
                <Box
                  sx={{
                    width: 128,
                    height: 128,
                    bgcolor: alpha('#D4A574', 0.1),
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 4
                  }}
                >
                  <SearchIcon sx={{ fontSize: 64, color: alpha('#D4A574', 0.5) }} />
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                  No products found
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, maxWidth: 500, mx: 'auto' }}>
                  We couldn't find any products matching your criteria. Try adjusting your filters or search terms.
                </Typography>
                <Button
                  variant="contained"
                  onClick={() => {
                    setFilters({
                      search: '',
                      category: '',
                      minPrice: '',
                      maxPrice: '',
                      sortBy: 'name'
                    })
                    setSearchParams({})
                  }}
                  sx={{
                    bgcolor: '#D4A574',
                    borderRadius: 3,
                    px: 4,
                    py: 1.5,
                    fontWeight: 'bold',
                    '&:hover': {
                      bgcolor: '#C9A86A'
                    }
                  }}
                >
                  Clear All Filters
                </Button>
              </Box>
            ) : (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: viewMode === 'grid'
                    ? { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }
                    : '1fr',
                  gap: 3
                }}
              >
                {filteredProducts.map((product, index) => (
                  <ProductCard
                    key={String(product.id)}
                    product={product}
                    viewMode={viewMode}
                    isFavorite={favorites.has(String(product.id))}
                    onToggleFavorite={() => toggleFavorite(String(product.id))}
                    index={index}
                    isAuthenticated={isAuthenticated}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

interface ProductCardProps {
  product: Product
  viewMode: 'grid' | 'list'
  isFavorite: boolean
  onToggleFavorite: () => void
  index: number
  isAuthenticated: boolean
  onAddToCart: (product: Product) => void
}

const ProductCard = ({ product, viewMode, isFavorite, onToggleFavorite, index, isAuthenticated, onAddToCart }: ProductCardProps) => {
  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(212, 165, 116, 0.2)',
              transform: 'translateY(-2px)'
            }
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={product.imageUrl || 'https://www.re-thinkingthefuture.com/wp-content/uploads/2021/05/A4086-Handicrafts-from-Northeast-India-Image11.jpg'}
                  alt={product.name}
                  sx={{
                    width: 120,
                    height: 120,
                    borderRadius: 3,
                    objectFit: 'cover'
                  }}
                />
                {product.featured && (
                  <Chip
                    label="Featured"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      bgcolor: '#D4A574',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                )}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography
                  component={Link}
                  to={`/products/${product.id}`}
                  variant="h6"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1F2937',
                    textDecoration: 'none',
                    mb: 1,
                    display: 'block',
                    '&:hover': {
                      color: '#D4A574'
                    }
                  }}
                >
                  {product.name}
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                  <Chip
                    label={product.category}
                    size="small"
                    sx={{
                      bgcolor: alpha('#D4A574', 0.1),
                      color: '#1F2937',
                      fontWeight: 'medium'
                    }}
                  />
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {[...Array(5)].map((_, i) => (
                      <Box key={i} component="span" sx={{ color: '#FFC107', fontSize: 16 }}>★</Box>
                    ))}
                    <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                      (4.8)
                    </Typography>
                  </Stack>
                </Stack>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  by {product.seller?.name || 'Artisan'}
                </Typography>
              </Box>

              <Stack spacing={2} alignItems="flex-end">
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
                  {formatPrice(product.price)}
                </Typography>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    onClick={onToggleFavorite}
                    sx={{
                      bgcolor: alpha(isFavorite ? '#EF4444' : '#D4A574', 0.1),
                      color: isFavorite ? '#EF4444' : '#6B7280',
                      '&:hover': {
                        bgcolor: alpha(isFavorite ? '#EF4444' : '#D4A574', 0.2),
                        color: isFavorite ? '#DC2626' : '#D4A574'
                      }
                    }}
                  >
                    {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
                  </IconButton>
                  <IconButton
                    component={Link}
                    to={`/products/${product.id}`}
                    size="small"
                    sx={{
                      bgcolor: alpha('#D4A574', 0.1),
                      color: '#6B7280',
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.2),
                        color: '#D4A574'
                      }
                    }}
                  >
                    <Visibility fontSize="small" />
                  </IconButton>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    onClick={() => onAddToCart(product)}
                    sx={{
                      bgcolor: '#D4A574',
                      borderRadius: 2,
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: '#C9A86A'
                      }
                    }}
                  >
                    {isAuthenticated ? 'Add to Cart' : 'Login to Buy'}
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card
        sx={{
          borderRadius: 4,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            boxShadow: '0 12px 40px rgba(212, 165, 116, 0.25)',
            transform: 'translateY(-8px)'
          }
        }}
      >
        <Box
          component={Link}
          to={`/products/${product.id}`}
          sx={{
            display: 'block',
            position: 'relative',
            height: 280,
            overflow: 'hidden',
            textDecoration: 'none'
          }}
        >
          <Box
            component="img"
            src={product.imageUrl || 'https://www.re-thinkingthefuture.com/wp-content/uploads/2021/05/A4086-Handicrafts-from-Northeast-India-Image11.jpg'}
            alt={product.name}
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)'
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.2), transparent)',
              opacity: 0,
              transition: 'opacity 0.3s',
              '.MuiCard-root:hover &': {
                opacity: 1
              }
            }}
          />

          {/* Featured Badge */}
          {product.featured && (
            <Chip
              label="Featured"
              size="small"
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                bgcolor: '#D4A574',
                color: 'white',
                fontWeight: 'bold',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              }}
            />
          )}

          {/* Quick Actions */}
          <Stack
            spacing={1}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              opacity: 0,
              transition: 'opacity 0.3s',
              '.MuiCard-root:hover &': {
                opacity: 1
              }
            }}
          >
            <IconButton
              size="small"
              onClick={(e) => {
                e.preventDefault()
                onToggleFavorite()
              }}
              sx={{
                bgcolor: alpha('#fff', 0.2),
                backdropFilter: 'blur(8px)',
                color: 'white',
                '&:hover': {
                  bgcolor: alpha('#fff', 0.3)
                }
              }}
            >
              {isFavorite ? <Favorite fontSize="small" /> : <FavoriteBorder fontSize="small" />}
            </IconButton>
            <IconButton
              size="small"
              sx={{
                bgcolor: alpha('#fff', 0.2),
                backdropFilter: 'blur(8px)',
                color: 'white',
                '&:hover': {
                  bgcolor: alpha('#fff', 0.3)
                }
              }}
            >
              <Visibility fontSize="small" />
            </IconButton>
          </Stack>

          {/* Quick Add Button */}
          <Button
            fullWidth
            variant="contained"
            startIcon={<Add />}
            onClick={(e) => {
              e.preventDefault()
              onAddToCart(product)
            }}
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 16,
              right: 16,
              bgcolor: alpha('#fff', 0.9),
              backdropFilter: 'blur(8px)',
              color: '#1F2937',
              fontWeight: 'bold',
              borderRadius: 3,
              opacity: 0,
              transition: 'opacity 0.3s',
              '.MuiCard-root:hover &': {
                opacity: 1
              },
              '&:hover': {
                bgcolor: 'white'
              }
            }}
          >
            {isAuthenticated ? 'Quick Add' : 'Login to Buy'}
          </Button>
        </Box>

        <CardContent>
          <Typography
            component={Link}
            to={`/products/${product.id}`}
            variant="h6"
            sx={{
              fontWeight: 'bold',
              color: '#1F2937',
              textDecoration: 'none',
              display: 'block',
              mb: 1.5,
              fontSize: '1.1rem',
              '&:hover': {
                color: '#D4A574'
              }
            }}
          >
            {product.name}
          </Typography>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
            <Chip
              label={product.category}
              size="small"
              sx={{
                bgcolor: alpha('#D4A574', 0.1),
                color: '#1F2937',
                fontWeight: 'medium'
              }}
            />
            <Stack direction="row" spacing={0.25}>
              {[...Array(5)].map((_, i) => (
                <Box key={i} component="span" sx={{ color: '#FFC107', fontSize: 14 }}>★</Box>
              ))}
            </Stack>
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4A574' }}>
              {formatPrice(product.price)}
            </Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              by {product.seller?.name || 'Artisan'}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<ShoppingCart />}
              onClick={() => onAddToCart(product)}
              sx={{
                bgcolor: '#D4A574',
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 'bold',
                '&:hover': {
                  bgcolor: '#C9A86A'
                }
              }}
            >
              {isAuthenticated ? 'Add to Cart' : 'Login to Buy'}
            </Button>
            <IconButton
              onClick={onToggleFavorite}
              sx={{
                bgcolor: alpha(isFavorite ? '#EF4444' : '#D4A574', 0.1),
                color: isFavorite ? '#EF4444' : '#6B7280',
                borderRadius: 3,
                '&:hover': {
                  bgcolor: alpha(isFavorite ? '#EF4444' : '#D4A574', 0.2),
                  color: isFavorite ? '#DC2626' : '#D4A574'
                }
              }}
            >
              {isFavorite ? <Favorite /> : <FavoriteBorder />}
            </IconButton>
          </Stack>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProductsPage