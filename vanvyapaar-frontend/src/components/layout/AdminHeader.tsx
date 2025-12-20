import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
    AppBar, Toolbar, Container, IconButton, Box, Typography,
    Badge, Menu, MenuItem, Avatar, alpha, Stack, TextField,
    InputAdornment, Divider
} from '@mui/material'
import {
    Search, Notifications, KeyboardArrowDown, Logout, Dashboard,
    People, Store, Inventory, ShoppingCart, Settings, Diamond
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'

const AdminHeader = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const navigate = useNavigate()
    const { user, logout } = useAuthStore()
    const { unreadCount, fetchUnreadCount, startPolling, stopPolling } = useNotificationStore()

    // Fetch notifications on mount
    useEffect(() => {
        if (user?.id) {
            fetchUnreadCount(user.id, user.role)
            startPolling(user.id, user.role)
        }
        
        return () => {
            stopPolling()
        }
    }, [user?.id, user?.role, fetchUnreadCount, startPolling, stopPolling])

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/admin/products?search=${encodeURIComponent(searchQuery)}`)
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
                borderColor: alpha('#3B82F6', 0.2),
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
                            to="/admin"
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
                                            background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
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
                                        <Diamond sx={{ color: '#3B82F6', fontSize: 24, position: 'relative', zIndex: 1 }} />
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
                                        color: '#3B82F6',
                                        fontSize: '0.65rem',
                                        letterSpacing: '2px',
                                        textTransform: 'uppercase',
                                        fontWeight: 600
                                    }}
                                >
                                    Admin Portal
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
                                placeholder="Search users, products, orders..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <motion.div
                                                animate={{ rotate: [0, 10, -10, 0] }}
                                                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                                            >
                                                <Search sx={{ color: '#2563EB' }} />
                                            </motion.div>
                                        </InputAdornment>
                                    )
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 3,
                                        bgcolor: alpha('#3B82F6', 0.05),
                                        transition: 'all 0.3s',
                                        '& fieldset': {
                                            borderColor: alpha('#3B82F6', 0.2),
                                            borderWidth: 2
                                        },
                                        '&:hover fieldset': {
                                            borderColor: '#3B82F6'
                                        },
                                        '&.Mui-focused fieldset': {
                                            borderColor: '#3B82F6',
                                            boxShadow: `0 0 0 3px ${alpha('#3B82F6', 0.1)}`
                                        }
                                    }
                                }}
                            />
                        </Box>
                    </motion.div>

                    {/* Action Buttons */}
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 3 }}>
                        {/* Sellers */}
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IconButton
                                component={Link}
                                to="/admin/sellers"
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
                                <Store />
                            </IconButton>
                        </motion.div>

                        {/* Buyers */}
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IconButton
                                component={Link}
                                to="/admin/buyers"
                                sx={{
                                    bgcolor: alpha('#10B981', 0.1),
                                    color: '#10B981',
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    '&:hover': {
                                        bgcolor: alpha('#10B981', 0.2),
                                        color: '#059669'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <People />
                            </IconButton>
                        </motion.div>

                        {/* Products */}
                        <motion.div
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <IconButton
                                component={Link}
                                to="/admin/products"
                                sx={{
                                    bgcolor: alpha('#8B5CF6', 0.1),
                                    color: '#8B5CF6',
                                    '&:hover': {
                                        bgcolor: alpha('#8B5CF6', 0.2),
                                        color: '#7C3AED'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Badge
                                    badgeContent={0}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            bgcolor: '#8B5CF6',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                >
                                    <Inventory />
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
                                to="/admin/orders"
                                sx={{
                                    bgcolor: alpha('#F59E0B', 0.1),
                                    color: '#F59E0B',
                                    '&:hover': {
                                        bgcolor: alpha('#F59E0B', 0.2),
                                        color: '#D97706'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Badge
                                    badgeContent={0}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            bgcolor: '#F59E0B',
                                            color: 'white',
                                            fontWeight: 'bold'
                                        }
                                    }}
                                >
                                    <ShoppingCart />
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
                                to="/admin/notifications"
                                sx={{
                                    bgcolor: alpha('#3B82F6', 0.1),
                                    color: '#3B82F6',
                                    display: { xs: 'none', sm: 'inline-flex' },
                                    '&:hover': {
                                        bgcolor: alpha('#3B82F6', 0.2),
                                        color: '#2563EB'
                                    },
                                    transition: 'all 0.3s'
                                }}
                            >
                                <Badge
                                    badgeContent={unreadCount}
                                    sx={{
                                        '& .MuiBadge-badge': {
                                            bgcolor: '#3B82F6',
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
                                    borderColor: alpha('#3B82F6', 0.2),
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        borderColor: '#3B82F6',
                                        bgcolor: alpha('#3B82F6', 0.05)
                                    }
                                }}
                            >
                                <Avatar
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        bgcolor: '#3B82F6',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        fontSize: '1rem',
                                        border: '2px solid',
                                        borderColor: alpha('#2563EB', 0.2)
                                    }}
                                >
                                    {user?.name.charAt(0).toUpperCase()}
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
                                            color: '#2563EB',
                                            fontSize: '0.7rem',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}
                                    >
                                        Administrator
                                    </Typography>
                                </Box>
                                <KeyboardArrowDown sx={{ color: '#2563EB', ml: 0.5 }} />
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
                                        borderColor: alpha('#3B82F6', 0.2),
                                        boxShadow: `0 8px 32px ${alpha('#000', 0.12)}`,
                                        '& .MuiMenuItem-root': {
                                            px: 2.5,
                                            py: 1.5,
                                            borderRadius: 2,
                                            mx: 1,
                                            my: 0.5,
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: alpha('#3B82F6', 0.1),
                                                transform: 'translateX(5px)'
                                            }
                                        }
                                    }
                                }
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <Box sx={{ px: 2.5, py: 2, bgcolor: alpha('#3B82F6', 0.05) }}>
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
                                to="/admin"
                                onClick={handleMenuClose}
                            >
                                <Dashboard sx={{ mr: 1.5, color: '#3B82F6' }} />
                                <Typography variant="body2">Dashboard</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/admin/sellers"
                                onClick={handleMenuClose}
                            >
                                <Store sx={{ mr: 1.5, color: '#D4A574' }} />
                                <Typography variant="body2">Manage Sellers</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/admin/buyers"
                                onClick={handleMenuClose}
                            >
                                <People sx={{ mr: 1.5, color: '#10B981' }} />
                                <Typography variant="body2">Manage Buyers</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/admin/products"
                                onClick={handleMenuClose}
                            >
                                <Inventory sx={{ mr: 1.5, color: '#8B5CF6' }} />
                                <Typography variant="body2">Products</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/admin/orders"
                                onClick={handleMenuClose}
                            >
                                <ShoppingCart sx={{ mr: 1.5, color: '#F59E0B' }} />
                                <Typography variant="body2">Orders</Typography>
                            </MenuItem>

                            <MenuItem
                                component={Link}
                                to="/admin/settings"
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

export default AdminHeader
