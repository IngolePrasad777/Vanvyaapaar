import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import {
  AppBar, Toolbar, Container, Button, IconButton, Box, Typography,
  Menu, MenuItem, Badge, Drawer, List, ListItem, ListItemButton,
  ListItemText, alpha, Stack, Divider, Avatar
} from '@mui/material'
import {
  Menu as MenuIcon, Close, ShoppingCart, Search,
  Favorite, KeyboardArrowDown, LocalShipping, Security,
  Verified, Diamond
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import Logo from '../common/Logo'

const PremiumNavbar = () => {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { user, logout } = useAuthStore()
  const { getCartCount, fetchCart } = useCartStore()
  const { getWishlistCount, fetchWishlist } = useWishlistStore()
  const navigate = useNavigate()
  const { scrollY } = useScroll()
  const navbarY = useTransform(scrollY, [0, 100], [0, -5])

  // Fetch cart and wishlist when user is logged in
  useEffect(() => {
    if (user?.id) {
      fetchCart(user.id)
      fetchWishlist(user.id)
    }
  }, [user?.id, fetchCart, fetchWishlist])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    navigate('/')
    handleMenuClose()
  }

  const navLinks = [
    { label: 'Collections', path: '/products' },
    { label: 'Artisans', path: '/artisans' },
    { label: 'About', path: '/about' },
    { label: 'Stories', path: '/stories' }
  ]

  const features = [
    { icon: <LocalShipping sx={{ fontSize: 16 }} />, text: 'Free Shipping' },
    { icon: <Security sx={{ fontSize: 16 }} />, text: 'Secure Payment' },
    { icon: <Verified sx={{ fontSize: 16 }} />, text: 'Authentic Crafts' }
  ]

  return (
    <>
      {/* Animated Top Bar */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <Box
          sx={{
            bgcolor: '#1F2937',
            borderBottom: '1px solid',
            borderColor: alpha('#D4A574', 0.2),
            py: 1,
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: `linear-gradient(90deg, transparent, ${alpha('#D4A574', 0.1)}, transparent)`,
              animation: 'shimmer 3s infinite'
            },
            '@keyframes shimmer': {
              '0%': { left: '-100%' },
              '100%': { left: '100%' }
            }
          }}
        >
          <Container maxWidth="lg">
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ display: { xs: 'none', md: 'flex' } }}
            >
              <Stack direction="row" spacing={3}>
                {features.map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Box sx={{ color: '#D4A574' }}>{feature.icon}</Box>
                      </motion.div>
                      <Typography
                        variant="caption"
                        sx={{
                          color: alpha('#fff', 0.7),
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          letterSpacing: '0.5px'
                        }}
                      >
                        {feature.text}
                      </Typography>
                    </Stack>
                  </motion.div>
                ))}
              </Stack>
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography
                    variant="caption"
                    sx={{
                      color: alpha('#fff', 0.5),
                      fontSize: '0.75rem',
                      letterSpacing: '0.5px'
                    }}
                  >
                    Support: +91 95299636241
                  </Typography>
                </Stack>
              </motion.div>
            </Stack>
          </Container>
        </Box>
      </motion.div>

      {/* Main Navbar with Parallax */}
      <motion.div style={{ y: navbarY }}>
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: scrolled ? alpha('#fff', 0.98) : 'white',
            backdropFilter: scrolled ? 'blur(20px)' : 'none',
            borderBottom: '1px solid',
            borderColor: scrolled ? alpha('#D4A574', 0.1) : alpha('#000', 0.05),
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: scrolled ? `0 4px 20px ${alpha('#000', 0.08)}` : 'none',
            position: 'relative',
            overflow: 'hidden',
            '&::after': {
              content: '""',
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '2px',
              background: `linear-gradient(90deg, transparent, ${alpha('#D4A574', 0.5)}, transparent)`,
              transform: scrolled ? 'scaleX(1)' : 'scaleX(0)',
              transition: 'transform 0.5s ease'
            }
          }}
        >
        <Container maxWidth="lg">
          <Toolbar sx={{ py: 1.5, px: { xs: 0, sm: 2 } }}>
            {/* Mobile Menu Button */}
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{
                mr: 2,
                display: { md: 'none' },
                color: '#1F2937'
              }}
            >
              <MenuIcon />
            </IconButton>

            {/* Animated Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
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
                  <motion.div
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.3 }}
                  >
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
                  </motion.div>
                  <motion.div
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
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
                  </motion.div>
                </Box>
              </Box>
            </motion.div>

            {/* Desktop Navigation with Stagger Animation */}
            <Stack
              direction="row"
              spacing={1}
              sx={{ display: { xs: 'none', md: 'flex' }, flex: 1 }}
            >
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index, duration: 0.5 }}
                  whileHover={{ y: -3 }}
                >
                  <Button
                    component={Link}
                    to={link.path}
                    sx={{
                      color: '#1F2937',
                      px: 2.5,
                      py: 1,
                      fontSize: '0.95rem',
                      fontWeight: 500,
                      textTransform: 'none',
                      letterSpacing: '0.3px',
                      position: 'relative',
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: 0,
                        height: 2,
                        bgcolor: '#D4A574',
                        transition: 'width 0.3s ease'
                      },
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: '#D4A574',
                        '&::after': {
                          width: '60%'
                        }
                      }
                    }}
                  >
                    {link.label}
                  </Button>
                </motion.div>
              ))}
            </Stack>

            {/* Right Actions with Animations */}
            <Stack direction="row" spacing={1} alignItems="center">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <IconButton
                  sx={{
                    color: '#1F2937',
                    position: 'relative',
                    '&:hover': {
                      bgcolor: alpha('#D4A574', 0.1),
                      color: '#D4A574'
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: -2,
                      borderRadius: '50%',
                      padding: '2px',
                      background: `linear-gradient(45deg, #D4A574, #C9A86A)`,
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      opacity: 0,
                      transition: 'opacity 0.3s'
                    },
                    '&:hover::before': {
                      opacity: 1
                    }
                  }}
                >
                  <Search />
                </IconButton>
              </motion.div>

              {user ? (
                <>
                  <IconButton
                    component={Link}
                    to={`/${user.role.toLowerCase()}/wishlist`}
                    sx={{
                      color: '#1F2937',
                      display: { xs: 'none', sm: 'inline-flex' },
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.1),
                        color: '#D4A574'
                      }
                    }}
                  >
                    <Badge badgeContent={user ? getWishlistCount() : 0} color="error">
                      <Favorite />
                    </Badge>
                  </IconButton>

                  <IconButton
                    component={Link}
                    to={`/${user.role.toLowerCase()}/cart`}
                    sx={{
                      color: '#1F2937',
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.1),
                        color: '#D4A574'
                      }
                    }}
                  >
                    <Badge badgeContent={user ? getCartCount() : 0} color="error">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>

                  <Button
                    onClick={handleMenuOpen}
                    endIcon={<KeyboardArrowDown />}
                    sx={{
                      color: '#1F2937',
                      textTransform: 'none',
                      fontWeight: 500,
                      display: { xs: 'none', sm: 'flex' },
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.1)
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: '#D4A574',
                        mr: 1,
                        fontSize: '0.9rem'
                      }}
                    >
                      {user.name.charAt(0).toUpperCase()}
                    </Avatar>
                    {user.name}
                  </Button>

                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 0,
                        boxShadow: `0 8px 32px ${alpha('#000', 0.12)}`
                      }
                    }}
                  >
                    <MenuItem
                      component={Link}
                      to={`/${user.role.toLowerCase()}`}
                      onClick={handleMenuClose}
                    >
                      Dashboard
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={`/${user.role.toLowerCase()}/profile`}
                      onClick={handleMenuClose}
                    >
                      Profile
                    </MenuItem>
                    <Divider />
                    <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                      Logout
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    to="/login"
                    sx={{
                      color: '#1F2937',
                      textTransform: 'none',
                      fontWeight: 500,
                      px: 2.5,
                      display: { xs: 'none', sm: 'inline-flex' },
                      '&:hover': {
                        bgcolor: alpha('#D4A574', 0.1)
                      }
                    }}
                  >
                    Sign In
                  </Button>
                  <Button
                    component={Link}
                    to="/register"
                    variant="contained"
                    sx={{
                      bgcolor: '#1F2937',
                      color: 'white',
                      textTransform: 'none',
                      fontWeight: 600,
                      px: 3,
                      borderRadius: 0,
                      letterSpacing: '0.5px',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#D4A574',
                        color: '#1F2937',
                        boxShadow: `0 4px 20px ${alpha('#D4A574', 0.3)}`
                      },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Join Now
                  </Button>
                </>
              )}
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>
      </motion.div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
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
            <Typography variant="h6" sx={{ fontWeight: 300, letterSpacing: '1px' }}>
              VanVyaapaar
            </Typography>
            <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
              <Close />
            </IconButton>
          </Stack>

          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} disablePadding>
                <ListItemButton
                  component={Link}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  sx={{
                    py: 1.5,
                    '&:hover': {
                      bgcolor: alpha('#D4A574', 0.1)
                    }
                  }}
                >
                  <ListItemText
                    primary={link.label}
                    primaryTypographyProps={{
                      fontWeight: 500,
                      letterSpacing: '0.5px'
                    }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2, borderColor: alpha('#fff', 0.1) }} />

          {user ? (
            <Stack spacing={2}>
              <Button
                component={Link}
                to={`/${user.role.toLowerCase()}`}
                fullWidth
                sx={{
                  color: 'white',
                  justifyContent: 'flex-start',
                  textTransform: 'none'
                }}
              >
                Dashboard
              </Button>
              <Button
                onClick={handleLogout}
                fullWidth
                sx={{
                  color: '#ff6b6b',
                  justifyContent: 'flex-start',
                  textTransform: 'none'
                }}
              >
                Logout
              </Button>
            </Stack>
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
                Sign In
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
                  '&:hover': {
                    bgcolor: '#C9A86A'
                  }
                }}
              >
                Join Now
              </Button>
            </Stack>
          )}
        </Box>
      </Drawer>
    </>
  )
}

export default PremiumNavbar
