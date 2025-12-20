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
