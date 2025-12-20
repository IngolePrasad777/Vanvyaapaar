import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  AppBar, Toolbar, Container, Button, IconButton, Box, Typography,
  Menu, MenuItem, Badge, Drawer, List, ListItem, ListItemButton,
  ListItemText, alpha, Stack, TextField, InputAdornment, Divider,
  Collapse
} from '@mui/material'
import {
  Menu as MenuIcon, Close, ShoppingCart, Search, Favorite,
  KeyboardArrowDown, ExpandMore, Person, LocalShipping,
  Security, Verified, Diamond
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'

const PublicHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [categoriesOpen, setCategoriesOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { getCartCount } = useCartStore()
  const { getWishlistCount } = useWishlistStore()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const categories = [
    'Pottery',
    'Handicrafts',
    'Textiles',
    'Jewelry',
    'Wood Crafts',
    'Metal Crafts'
  ]

  const features = [
    { icon: <LocalShipping sx={{ fontSize: 14 }} />, text: 'Free Shipping on ₹999+' },
    { icon: <Security sx={{ fontSize: 14 }} />, text: 'Secure Payment' },
    { icon: <Verified sx={{ fontSize: 14 }} />, text: 'Authentic Crafts' }
  ]

  return (
    <>
      {/* Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Box
          sx={{
            bgcolor: '#1F2937',
            borderBottom: '1px solid',
            borderColor: alpha('#D4A574', 0.2),
            py: 1
          }}
        >
          <Container maxWidth="xl">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              {/* Features */}
              <Stack direction="row" spacing={3}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Box sx={{ color: '#D4A574' }}>{feature.icon}</Box>
                      <Typography
                        variant="caption"
                        sx={{
                          color: alpha('#fff', 0.7),
                          fontSize: '0.7rem',
                          fontWeight: 500
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Stack>
                  </motion.div>
                ))}
              </Stack>

              {/* Auth Links */}
              <Stack direction="row" spacing={2} alignItems="center">
                {!user ? (
                  <>
                    <Button
                      component={Link}
                      to="/login"
                      size="small"
                      sx={{
                        color: alpha('#fff', 0.7),
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        '&:hover': {
                          color: '#D4A574',
                          bgcolor: alpha('#D4A574', 0.1)
                        }
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      size="small"
                      sx={{
                        color: alpha('#fff', 0.7),
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        '&:hover': {
                          color: '#D4A574',
                          bgcolor: alpha('#D4A574', 0.1)
                        }
                      }}
                    >
                      Register
                    </Button>
                  </>
                ) : (
                  <Button
                    component={Link}
                    to={`/${user.role.toLowerCase()}`}
                    size="small"
                    sx={{
                      color: '#D4A574',
                      fontSize: '0.75rem',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.1)
                      }
                    }}
                  >
                    Go to Dashboard →
                  </Button>
                )}
              </Stack>
            </Stack>
          </Container>
        </Box>
      </motion.div>

      {/* Main Header */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'white',
          borderBottom: '2px solid',
          borderColor: alpha('#D4A574', 0.2),
          boxShadow: `0 4px 20px ${alpha('#000', 0.05)}`
        }}
      >
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 2, px: { xs: 0, sm: 2 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              edge="start"
              onClick={() => setIsMenuOpen(true)}
              sx={{
                mr: 2,
                display: { md: 'none' },
                color: '#1F2937'
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Logo - Rotating Diamond */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                component={Link}
                to="/"
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  mr: { xs: 'auto', md: 6 }
                }}
              >
                <motion.div
                  whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      bgcolor: '#1F2937',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 1.5,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(135deg, #D4A574 0%, #C9A86A 100%)',
                        opacity: 0,
                        transition: 'opacity 0.3s ease'
                      },
                      '&:hover::before': {
                        opacity: 1
                      }
                    }}
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    >
                      <Diamond sx={{ color: '#D4A574', fontSize: 24, position: 'relative', zIndex: 1 }} />
                    </motion.div>
                  </Box>
                </motion.div>
                <Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 300,
                      color: '#1F2937',
                      fontSize: '1.5rem',
                      letterSpacing: '1px',
                      lineHeight: 1
                    }}
                  >
                    VanVyaapaar
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      color: '#D4A574',
                      fontSize: '0.65rem',
                      letterSpacing: '2px',
                      textTransform: 'uppercase',
                      fontWeight: 600
                    }}
                  >
                    Tribal Crafts
                  </Typography>
                </Box>
              </Box>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ flex: 1, maxWidth: 600, display: 'none' }}
              className="md:block"
            >
              <Box
                component="form"
                onSubmit={handleSearch}
                sx={{ width: '100%', display: { xs: 'none', md: 'block' } }}
              >
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search for authentic tribal crafts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: '#8B4513' }} />
                      </InputAdornment>
                    )
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 3,
                      bgcolor: alpha('#D4A574', 0.05),
                      '& fieldset': {
                        borderColor: alpha('#D4A574', 0.2),
                        borderWidth: 2
                      },
                      '&:hover fieldset': {
                        borderColor: '#D4A574'
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#D4A574'
                      }
                    }
                  }}
                />
              </Box>
            </motion.div>

            {/* Action Buttons */}
            <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: { xs: 0, md: 3 } }}>
              {user?.role === 'BUYER' && (
                <>
                  <IconButton
                    component={Link}
                    to="/buyer/wishlist"
                    sx={{
                      color: '#1F2937',
                      display: { xs: 'none', sm: 'inline-flex' },
                      '&:hover': {
                        bgcolor: alpha('#EF4444', 0.1),
                        color: '#EF4444'
                      }
                    }}
                  >
                    <Favorite />
                  </IconButton>

                  <IconButton
                    component={Link}
                    to="/buyer/cart"
                    sx={{
                      color: '#1F2937',
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.1),
                        color: '#8B4513'
                      }
                    }}
                  >
                    <Badge badgeContent={user ? getCartCount() : 0} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </>
              )}

              {user ? (
                <IconButton
                  component={Link}
                  to={`/${user.role.toLowerCase()}/profile`}
                  sx={{
                    color: '#1F2937',
                    '&:hover': {
                      bgcolor: alpha('#D4A574', 0.1),
                      color: '#8B4513'
                    }
                  }}
                >
                  <Person />
                </IconButton>
              ) : (
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  sx={{
                    bgcolor: '#D4A574',
                    color: '#1F2937',
                    textTransform: 'none',
                    fontWeight: 'bold',
                    px: 3,
                    borderRadius: 3,
                    display: { xs: 'none', sm: 'inline-flex' },
                    '&:hover': {
                      bgcolor: '#C9A86A',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${alpha('#D4A574', 0.4)}`
                    },
                    transition: 'all 0.3s'
                  }}
                >
                  Login
                </Button>
              )}
            </Stack>
          </Toolbar>

          {/* Navigation */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, pb: 2 }}>
            <Stack direction="row" spacing={1} justifyContent="center">
              <Button
                component={Link}
                to="/"
                sx={{
                  color: '#1F2937',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  '&:hover': {
                    color: '#8B4513',
                    bgcolor: alpha('#D4A574', 0.1)
                  }
                }}
              >
                Home
              </Button>

              <Button
                component={Link}
                to="/products"
                sx={{
                  color: '#1F2937',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  '&:hover': {
                    color: '#8B4513',
                    bgcolor: alpha('#D4A574', 0.1)
                  }
                }}
              >
                All Products
              </Button>

              {/* Categories Dropdown */}
              <Button
                onClick={(e) => setAnchorEl(e.currentTarget)}
                endIcon={<KeyboardArrowDown />}
                sx={{
                  color: '#1F2937',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  '&:hover': {
                    color: '#8B4513',
                    bgcolor: alpha('#D4A574', 0.1)
                  }
                }}
              >
                Categories
              </Button>

              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    borderRadius: 3,
                    border: '2px solid',
                    borderColor: alpha('#D4A574', 0.2),
                    boxShadow: `0 8px 32px ${alpha('#000', 0.12)}`
                  }
                }}
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category}
                    component={Link}
                    to={`/products?category=${encodeURIComponent(category)}`}
                    onClick={() => setAnchorEl(null)}
                    sx={{
                      px: 2.5,
                      py: 1.5,
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.1),
                        color: '#8B4513'
                      }
                    }}
                  >
                    {category}
                  </MenuItem>
                ))}
              </Menu>

              <Button
                component={Link}
                to="/about"
                sx={{
                  color: '#1F2937',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  '&:hover': {
                    color: '#8B4513',
                    bgcolor: alpha('#D4A574', 0.1)
                  }
                }}
              >
                About
              </Button>

              <Button
                component={Link}
                to="/contact"
                sx={{
                  color: '#1F2937',
                  textTransform: 'none',
                  fontWeight: 500,
                  px: 2,
                  '&:hover': {
                    color: '#8B4513',
                    bgcolor: alpha('#D4A574', 0.1)
                  }
                }}
              >
                Contact
              </Button>
            </Stack>
          </Box>
        </Container>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            bgcolor: '#1F2937',
            color: 'white'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: '#D4A574',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Diamond sx={{ color: '#1F2937', fontSize: 20 }} />
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 300, letterSpacing: '1px' }}>
                VanVyaapaar
              </Typography>
            </Stack>
            <IconButton onClick={() => setIsMenuOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Stack>

          {/* Mobile Search */}
          <Box component="form" onSubmit={handleSearch} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: alpha('#fff', 0.3)
                  },
                  '&:hover fieldset': {
                    borderColor: '#D4A574'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#D4A574'
                  }
                }
              }}
            />
          </Box>

          <List>
            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/"
                onClick={() => setIsMenuOpen(false)}
                sx={{ py: 1.5, '&:hover': { bgcolor: alpha('#D4A574', 0.1) } }}
              >
                <ListItemText primary="Home" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/products"
                onClick={() => setIsMenuOpen(false)}
                sx={{ py: 1.5, '&:hover': { bgcolor: alpha('#D4A574', 0.1) } }}
              >
                <ListItemText primary="All Products" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                sx={{ py: 1.5, '&:hover': { bgcolor: alpha('#D4A574', 0.1) } }}
              >
                <ListItemText primary="Categories" />
                <ExpandMore
                  sx={{
                    transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.3s'
                  }}
                />
              </ListItemButton>
            </ListItem>

            <Collapse in={categoriesOpen}>
              {categories.map((category) => (
                <ListItem key={category} disablePadding>
                  <ListItemButton
                    component={Link}
                    to={`/products?category=${encodeURIComponent(category)}`}
                    onClick={() => setIsMenuOpen(false)}
                    sx={{ pl: 4, py: 1, '&:hover': { bgcolor: alpha('#D4A574', 0.1) } }}
                  >
                    <ListItemText
                      primary={category}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </Collapse>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                sx={{ py: 1.5, '&:hover': { bgcolor: alpha('#D4A574', 0.1) } }}
              >
                <ListItemText primary="About" />
              </ListItemButton>
            </ListItem>

            <ListItem disablePadding>
              <ListItemButton
                component={Link}
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                sx={{ py: 1.5, '&:hover': { bgcolor: alpha('#D4A574', 0.1) } }}
              >
                <ListItemText primary="Contact" />
              </ListItemButton>
            </ListItem>
          </List>

          <Divider sx={{ my: 2, borderColor: alpha('#fff', 0.1) }} />

          {user ? (
            <Button
              component={Link}
              to={`/${user.role.toLowerCase()}`}
              fullWidth
              variant="contained"
              sx={{
                bgcolor: '#D4A574',
                color: '#1F2937',
                textTransform: 'none',
                '&:hover': { bgcolor: '#C9A86A' }
              }}
            >
              Go to Dashboard
            </Button>
          ) : (
            <Stack spacing={2}>
              <Button
                component={Link}
                to="/login"
                fullWidth
                variant="outlined"
                sx={{
                  color: 'white',
                  borderColor: alpha('#fff', 0.3),
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#D4A574',
                    bgcolor: alpha('#D4A574', 0.1)
                  }
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                fullWidth
                variant="contained"
                sx={{
                  bgcolor: '#D4A574',
                  color: '#1F2937',
                  textTransform: 'none',
                  '&:hover': { bgcolor: '#C9A86A' }
                }}
              >
                Register
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default PublicHeader
