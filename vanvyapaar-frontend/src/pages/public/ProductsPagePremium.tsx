import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
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
import { formatPrice, debounce } from '../../lib/utils'

const ProductsPagePremium = () => {
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

  const categories = [
    { name: 'All Categories', count: 0, image: '', icon: '✦' },
    { name: 'Textiles', count: 45, image: '', icon: '🧵' },
    { name: 'Jewelry', count: 32, image: '', icon: '💎' },
    { name: 'Pottery', count: 28, image: '', icon: '🏺' },
    { name: 'Woodcraft', count: 19, image: '', icon: '🪵' },
    { name: 'Metalwork', count: 15, image: '', icon: '⚒️' },
    { name: 'Paintings', count: 12, image: '', icon: '🎨' }
  ]

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const data = await productService.getAllProducts()
      setProducts(data)
      setFilteredProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>
        Premium Products
      </Typography>
      
      {/* Categories */}
      <Box sx={{ mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ overflowX: 'auto', pb: 2 }}>
          {categories.map((category) => (
            <Chip
              key={category.name}
              label={`${category.icon} ${category.name}`}
              variant={filters.category === category.name ? 'filled' : 'outlined'}
              onClick={() => setFilters(prev => ({ ...prev, category: category.name }))}
              sx={{ minWidth: 'fit-content' }}
            />
          ))}
        </Stack>
      </Box>

      {/* Products Grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
        {loading ? (
          Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} variant="rectangular" height={400} sx={{ borderRadius: 2 }} />
          ))
        ) : (
          filteredProducts.map((product) => (
            <Card key={product.id} sx={{ borderRadius: 2, overflow: 'hidden' }}>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.description}
                </Typography>
                <Typography variant="h6" color="primary">
                  {formatPrice(product.price)}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <IconButton
                    onClick={() => toggleFavorite(product.id.toString())}
                    color={favorites.has(product.id.toString()) ? 'error' : 'default'}
                  >
                    {favorites.has(product.id.toString()) ? <Favorite /> : <FavoriteBorder />}
                  </IconButton>
                  <Button
                    variant="contained"
                    startIcon={<ShoppingCart />}
                    sx={{ flex: 1 }}
                  >
                    Add to Cart
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Container>
  )
}

export default ProductsPagePremium
