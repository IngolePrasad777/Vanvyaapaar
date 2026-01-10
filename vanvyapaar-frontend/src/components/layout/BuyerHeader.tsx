import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    AppBar, Toolbar, Container, IconButton, Box, Typography,
    Badge, Menu, MenuItem, Avatar, alpha, Stack, TextField,
    InputAdornment, Divider
} from '@mui/material'
import {
    Search, Notifications, KeyboardArrowDown, Logout, Person,
    ShoppingCart, Favorite, Receipt, Diamond, Settings
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import { useWishlistStore } from '../../store/wishlistStore'
import { useNotificationStore } from '../../store/notificationStore'

const BuyerHeader = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const { getCartCount, fetchCart } = useCartStore()
    const { getWishlistCount, fetchWishlist } = useWishlistStore()
    const { unreadCount, fetchUnreadCount, startPolling, stopPolling } = useNotificationStore()

    // Fetch cart, wishlist, and notifications on mount
    useEffect(() => {
        if (user?.id) {
            fetchCart(user.id)
            fetchWishlist(user.id)
            fetchUnreadCount(user.id, user.role)
            startPolling(user.id, user.role)
        }
        
        return () => {
            stopPolling()
        }
    }, [user?.id, user?.role, fetchCart, fetchWishlist, fetchUnreadCount, startPolling, stopPolling])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/buyer/products?search=${encodeURIComponent(searchQuery)}`)
        }
    }

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

    return (
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
                <Toolbar sx={{ py: 1.5, px: { xs: 0, sm: 2 } }}>
                    {/* Logo - Rotating Diamond */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Box
                            component={Link}
                            to="/buyer"
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                textDecoration: 'none',
                                mr: 4
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
                                    Buyer Portal
                                </Typography>
                            </Box>
                        </Box>
                    </motion.div>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        style={{ flex: 1, maxWidth: 600 }}
                    >
                        <Box
                            component="form"
                            onSubmit={handleSearch}
                            sx={{ width: '100%' }}
                        >
                            <TextField
                                fullWidth
                                size="small"
                                placeholder="Search products, orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <motion.div
                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <Search sx={{ color: '#8B4513' }} />
                                            </motion.div>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: alpha('#D4A574', 0.05),
                                        transition: 'all 0.3s',
                                        '& fieldset': {
                                            borderColor: alpha('#D4A574', 0.2),
                                            borderWidth: 2
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#D4A574'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#D4A574',
                                            boxShadow: `0 0 0 3px ${alpha('#D4A574', 0.1)}`
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </motion.div>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 3 }}>
                        {/* Wishlist */}
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IconButton
                                component={Link}
                                to="/buyer/wishlist"
                                sx={{
                                    bgcolor: alpha('#D4A574', 0.1),
                                    color: '#D4A574',
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    '&:hover': {
                                        bgcolor: alpha('#D4A574', 0.2),
                                        color: '#8B4513'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Badge
                                    badgeContent={getWishlistCount()}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            bgcolor: '#EF4444',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                >
                                    <Favorite />
                                </Badge>
                            </IconButton>
                        </motion.div>

                        {/* Cart */}
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IconButton
                                component={Link}
                                to="/buyer/cart"
                                sx={{
                                    bgcolor: alpha('#D4A574', 0.1),
                                    color: '#D4A574',
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    '&:hover': {
                                        bgcolor: alpha('#D4A574', 0.2),
                                        color: '#8B4513'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Badge
                                    badgeContent={getCartCount()}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            bgcolor: '#D4A574',
                                            color: '#1F2937',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                >
                                    <ShoppingCart />
                                </Badge>
                            </IconButton>
                        </motion.div>

                        {/* Orders */}
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IconButton
                                component={Link}
                                to="/buyer/orders"
                                sx={{
                                    bgcolor: alpha('#C9A86A', 0.1),
                                    color: '#C9A86A',
                                    '&:hover': {
                                        bgcolor: alpha('#C9A86A', 0.2),
                                        color: '#8B4513'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Badge
                                    badgeContent={0}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            bgcolor: '#C9A86A',
                                            color: '#1F2937',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                >
                                    <Receipt />
                                </Badge>
                            </IconButton>
                        </motion.div>

                        {/* Notifications */}
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IconButton
                                component={Link}
                                to="/buyer/notifications"
                                sx={{
                                    bgcolor: alpha('#A0826D', 0.1),
                                    color: '#A0826D',
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    '&:hover': {
                                        bgcolor: alpha('#A0826D', 0.2),
                                        color: '#8B4513'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Badge
                                    badgeContent={unreadCount}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            bgcolor: '#A0826D',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                >
                                    <Notifications />
                                </Badge>
                            </IconButton>
                        </motion.div>

                        {/* Profile Menu */}
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Box
                                onClick={handleMenuOpen}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    cursor: 'pointer',
                                    px: 2,
                                    py: 1,
                                    borderRadius: 3,
                                    border: '2px solid',
                                    borderColor: alpha('#D4A574', 0.2),
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        borderColor: '#D4A574',
                                        bgcolor: alpha('#D4A574', 0.05)
                                    }
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: '#D4A574',
                                        color: '#1F2937',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        border: '2px solid',
                                        borderColor: alpha('#8B4513', 0.2)
                                    }}
                                >
                                    {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                                </Avatar>
                                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 'bold',
                                            color: '#1F2937',
                                            lineHeight: 1.2
                                        }}
                                    >
                                        {user?.name}
                                    </Typography>
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            color: '#8B4513',
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        Buyer Account
                                    </Typography>
                                </Box>
                                <KeyboardArrowDown sx={{ color: '#8B4513', ml: 0.5 }} />
                            </Box>
                        </motion.div>

                        {/* Profile Dropdown Menu */}
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleMenuClose}
                            slotProps={{
                                paper: {
                                    sx: {
                                        mt: 1.5,
                                        minWidth: 220,
                                        borderRadius: 3,
                                        border: '2px solid',
                                        borderColor: alpha('#D4A574', 0.2),
                                        boxShadow: `0 8px 32px ${alpha('#000', 0.12)}`,
                                        '& .MuiMenuItem-root': {
                                            px: 2.5,
                                            py: 1.5,
                                            borderRadius: 2,
                                            mx: 1,
                                            my: 0.5,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: alpha('#D4A574', 0.1),
                                                transform: 'translateX(5px)'
                                            }
                                        }
                                    }
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <Box sx={{ px: 2.5, py: 2, bgcolor: alpha('#D4A574', 0.05) }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                                    {user?.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {user?.email}
                                </Typography>
                            </Box>
                            <Divider sx={{ my: 1 }} />

                            <MenuItem
                                component={Link}
                                to="/buyer"
                                onClick={handleMenuClose}
                            >
                                <Diamond sx={{ mr: 1.5, color: '#D4A574' }} />
                                <Typography variant="body2">Dashboard</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/buyer/profile"
                                onClick={handleMenuClose}
                            >
                                <Person sx={{ mr: 1.5, color: '#10B981' }} />
                                <Typography variant="body2">My Profile</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/buyer/cart"
                                onClick={handleMenuClose}
                            >
                                <ShoppingCart sx={{ mr: 1.5, color: '#D4A574' }} />
                                <Typography variant="body2">My Cart</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/buyer/orders"
                                onClick={handleMenuClose}
                            >
                                <Receipt sx={{ mr: 1.5, color: '#C9A86A' }} />
                                <Typography variant="body2">My Orders</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/buyer/wishlist"
                                onClick={handleMenuClose}
                            >
                                <Favorite sx={{ mr: 1.5, color: '#EF4444' }} />
                                <Typography variant="body2">Wishlist</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/buyer/settings"
                                onClick={handleMenuClose}
                            >
                                <Settings sx={{ mr: 1.5, color: '#8B5CF6' }} />
                                <Typography variant="body2">Settings</Typography>
                            </MenuItem>

                            <Divider sx={{ my: 1 }} />

                            <MenuItem
                                onClick={handleLogout}
                                sx={{
                                    color: '#EF4444',
                                    '&:hover': {
                                        bgcolor: alpha('#EF4444', 0.1)
                                    }
                                }}
                            >
                                <Logout sx={{ mr: 1.5 }} />
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    Logout
                                </Typography>
                            </MenuItem>
                        </Menu>
                    </Stack>
                </Toolbar>
            </Container>
        </AppBar>
    )
}

export default BuyerHeader
