import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    Box, Container, Typography, Button,
    Stack, Avatar, IconButton, Chip, Divider, alpha,
    List, ListItem, ListItemAvatar, ListItemText, ListItemSecondaryAction,
    Tabs, Tab, Badge, Paper, Menu, MenuItem
} from '@mui/material'
import {
    Notifications, NotificationsActive, MarkEmailRead, Delete,
    ShoppingBag, CheckCircle, Cancel, Payment, Warning,
    VerifiedUser, Block, PersonAdd, ReportProblem, Star,
    MoreVert, DoneAll
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useNotificationStore } from '../../store/notificationStore'
import { Notification, notificationService } from '../../services/notificationService'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'
import LoadingAnimation from '../../components/common/LoadingAnimation'


const BuyerNotifications = () => {
    const { user } = useAuthStore()
    const {
        notifications,
        unreadCount,
        isLoading,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification
    } = useNotificationStore()

    const [tabValue, setTabValue] = useState(0)
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null)

    useEffect(() => {
        if (user) {
            fetchNotifications(user.id, user.role)
        }
    }, [user, fetchNotifications])

    const getNotificationIcon = (type: string) => {
        switch (type) {
            case 'ORDER_PLACED':
            case 'ORDER_CONFIRMED':
            case 'ORDER_SHIPPED':
            case 'ORDER_DELIVERED':
                return <ShoppingBag sx={{ fontSize: 24 }} />
            case 'ORDER_CANCELLED':
                return <Cancel sx={{ fontSize: 24 }} />
            case 'PAYMENT_SUCCESS':
                return <Payment sx={{ fontSize: 24 }} />
            case 'PAYMENT_FAILED':
                return <Warning sx={{ fontSize: 24 }} />
            case 'PRODUCT_APPROVED':
                return <CheckCircle sx={{ fontSize: 24 }} />
            case 'PRODUCT_REJECTED':
                return <Cancel sx={{ fontSize: 24 }} />
            case 'LOW_STOCK':
                return <Warning sx={{ fontSize: 24 }} />
            case 'ACCOUNT_APPROVED':
                return <VerifiedUser sx={{ fontSize: 24 }} />
            case 'ACCOUNT_SUSPENDED':
                return <Block sx={{ fontSize: 24 }} />
            case 'NEW_SELLER':
                return <PersonAdd sx={{ fontSize: 24 }} />
            case 'NEW_COMPLAINT':
                return <ReportProblem sx={{ fontSize: 24 }} />
            case 'REVIEW_ADDED':
                return <Star sx={{ fontSize: 24 }} />
            default:
                return <Notifications sx={{ fontSize: 24 }} />
        }
    }

    const getNotificationColor = (priority: string) => {
        switch (priority) {
            case 'LOW':
                return '#6B7280'
            case 'NORMAL':
                return '#D4A574'
            case 'HIGH':
                return '#F59E0B'
            case 'URGENT':
                return '#EF4444'
            default:
                return '#D4A574'
        }
    }

    const formatRelativeTime = (dateString: string) => {
        return notificationService.formatRelativeTime(dateString)
    }

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.isRead) {
            await markAsRead(notification.id)
        }

        // Navigate to action URL if available
        if (notification.actionUrl) {
            window.location.href = notification.actionUrl
        }
    }

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, notification: Notification) => {
        event.stopPropagation()
        setAnchorEl(event.currentTarget)
        setSelectedNotification(notification)
    }

    const handleMenuClose = () => {
        setAnchorEl(null)
        setSelectedNotification(null)
    }

    const handleMarkAsRead = async () => {
        if (selectedNotification && !selectedNotification.isRead) {
            await markAsRead(selectedNotification.id)
        }
        handleMenuClose()
    }

    const handleDelete = async () => {
        if (selectedNotification) {
            await deleteNotification(selectedNotification.id)
        }
        handleMenuClose()
    }

    const handleMarkAllAsRead = async () => {
        if (user) {
            await markAllAsRead(user.id, user.role)
        }
    }

    const filteredNotifications = notifications.filter(notification => {
        if (tabValue === 0) return true // All
        if (tabValue === 1) return !notification.isRead // Unread
        if (tabValue === 2) return notification.isRead // Read
        return true
    })

    if (isLoading && notifications.length === 0) {
        return (
            <LoadingAnimation
                variant="tribal"
                size="large"
                text="Loading your notifications..."
                fullScreen={false}
            />
        )
    }

    return (
        <Box sx={{ position: 'relative', minHeight: '100vh', bgcolor: '#FAFAF9' }}>
            <AnimatedBackground variant="bubbles" intensity="light" color="#D4A574" />
            <FloatingElements
                showScrollTop={true}
                showQuickActions={true}
                quickActions={[
                    {
                        icon: <DoneAll />,
                        label: 'Mark All Read',
                        onClick: handleMarkAllAsRead,
                        color: '#10B981'
                    },
                    {
                        icon: <ShoppingBag />,
                        label: 'Continue Shopping',
                        onClick: () => window.location.href = '/buyer/products',
                        color: '#D4A574'
                    }
                ]}
            />

            <Container maxWidth="lg" sx={{ py: 4, position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <Box sx={{ mb: 4 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 3 }}>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <Box sx={{
                                    width: 56,
                                    height: 56,
                                    bgcolor: alpha('#D4A574', 0.15),
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <NotificationsActive sx={{ fontSize: 32, color: '#D4A574' }} />
                                    </Badge>
                                </Box>
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', fontFamily: 'serif' }}>
                                        Notifications
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                                        Stay updated with your orders and account
                                    </Typography>
                                </Box>
                            </Stack>

                            {unreadCount > 0 && (
                                <Button
                                    variant="outlined"
                                    startIcon={<MarkEmailRead />}
                                    onClick={handleMarkAllAsRead}
                                    sx={{
                                        borderColor: '#D4A574',
                                        color: '#D4A574',
                                        '&:hover': {
                                            bgcolor: alpha('#D4A574', 0.1),
                                            borderColor: '#C9A86A'
                                        }
                                    }}
                                >
                                    Mark All Read
                                </Button>
                            )}
                        </Stack>

                        {/* Tabs */}
                        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
                            <Tabs
                                value={tabValue}
                                onChange={(_, newValue) => setTabValue(newValue)}
                                sx={{
                                    '& .MuiTab-root': {
                                        fontWeight: 600,
                                        '&.Mui-selected': {
                                            color: '#D4A574'
                                        }
                                    },
                                    '& .MuiTabs-indicator': {
                                        backgroundColor: '#D4A574'
                                    }
                                }}
                            >
                                <Tab
                                    label={
                                        <Badge badgeContent={notifications.length} color="primary" showZero>
                                            All
                                        </Badge>
                                    }
                                />
                                <Tab
                                    label={
                                        <Badge badgeContent={unreadCount} color="error" showZero>
                                            Unread
                                        </Badge>
                                    }
                                />
                                <Tab
                                    label={
                                        <Badge badgeContent={notifications.length - unreadCount} color="success" showZero>
                                            Read
                                        </Badge>
                                    }
                                />
                            </Tabs>
                        </Paper>
                    </Box>
                </motion.div>

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Paper
                            sx={{
                                textAlign: 'center',
                                py: 8,
                                px: 4,
                                borderRadius: 4,
                                border: `1px solid ${alpha('#D4A574', 0.2)}`
                            }}
                        >
                            <Notifications sx={{ fontSize: 80, color: alpha('#D4A574', 0.5), mb: 3 }} />
                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 2 }}>
                                {tabValue === 1 ? 'No unread notifications' :
                                    tabValue === 2 ? 'No read notifications' : 'No notifications yet'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
                                {tabValue === 1 ? 'All caught up! You have no unread notifications.' :
                                    tabValue === 2 ? 'No notifications have been read yet.' :
                                        'We\'ll notify you when something important happens with your orders.'}
                            </Typography>
                            <Button
                                variant="contained"
                                size="large"
                                onClick={() => window.location.href = '/buyer/products'}
                                sx={{
                                    bgcolor: '#D4A574',
                                    color: 'white',
                                    px: 4,
                                    py: 1.5,
                                    borderRadius: 3,
                                    fontWeight: 600,
                                    '&:hover': {
                                        bgcolor: '#C9A86A',
                                        transform: 'translateY(-2px)',
                                        boxShadow: `0 12px 35px ${alpha('#D4A574', 0.4)}`
                                    },
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Continue Shopping
                            </Button>
                        </Paper>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <EnhancedCard
                            hoverEffect="lift"
                            glowColor="#D4A574"
                            intensity="subtle"
                            sx={{
                                borderRadius: 4,
                                border: `1px solid ${alpha('#D4A574', 0.2)}`,
                                overflow: 'hidden'
                            }}
                        >
                            <List sx={{ p: 0 }}>
                                <AnimatePresence>
                                    {filteredNotifications.map((notification, index) => (
                                        <motion.div
                                            key={notification.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: 20 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <ListItem
                                                component="div"
                                                onClick={() => handleNotificationClick(notification)}
                                                sx={{
                                                    py: 2,
                                                    px: 3,
                                                    bgcolor: notification.isRead ? 'transparent' : alpha('#D4A574', 0.05),
                                                    borderLeft: notification.isRead ? 'none' : `4px solid ${getNotificationColor(notification.priority)}`,
                                                    '&:hover': {
                                                        bgcolor: alpha('#D4A574', 0.08)
                                                    },
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <ListItemAvatar>
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: alpha(getNotificationColor(notification.priority), 0.1),
                                                            color: getNotificationColor(notification.priority),
                                                            width: 48,
                                                            height: 48
                                                        }}
                                                    >
                                                        {getNotificationIcon(notification.type)}
                                                    </Avatar>
                                                </ListItemAvatar>

                                                <ListItemText
                                                    primary={
                                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                                                            <Typography
                                                                variant="subtitle1"
                                                                sx={{
                                                                    fontWeight: notification.isRead ? 500 : 700,
                                                                    color: '#1F2937'
                                                                }}
                                                            >
                                                                {notification.title}
                                                            </Typography>
                                                            <Chip
                                                                label={notification.priority}
                                                                size="small"
                                                                sx={{
                                                                    bgcolor: alpha(getNotificationColor(notification.priority), 0.1),
                                                                    color: getNotificationColor(notification.priority),
                                                                    fontSize: '0.7rem',
                                                                    height: 20
                                                                }}
                                                            />
                                                        </Stack>
                                                    }
                                                    secondary={
                                                        <Stack spacing={1}>
                                                            <Typography
                                                                variant="body2"
                                                                sx={{
                                                                    color: 'text.secondary',
                                                                    lineHeight: 1.5
                                                                }}
                                                            >
                                                                {notification.message}
                                                            </Typography>
                                                            <Typography
                                                                variant="caption"
                                                                sx={{
                                                                    color: '#D4A574',
                                                                    fontWeight: 600
                                                                }}
                                                            >
                                                                {formatRelativeTime(notification.createdAt)}
                                                            </Typography>
                                                        </Stack>
                                                    }
                                                />

                                                <ListItemSecondaryAction>
                                                    <IconButton
                                                        edge="end"
                                                        onClick={(e) => handleMenuOpen(e, notification)}
                                                        sx={{ color: '#6B7280' }}
                                                    >
                                                        <MoreVert />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>

                                            {index < filteredNotifications.length - 1 && (
                                                <Divider sx={{ borderColor: alpha('#D4A574', 0.1) }} />
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </List>
                        </EnhancedCard>
                    </motion.div>
                )}

                {/* Context Menu */}
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                        sx: {
                            borderRadius: 2,
                            minWidth: 160,
                            boxShadow: `0 8px 32px ${alpha('#000', 0.12)}`
                        }
                    }}
                >
                    {selectedNotification && !selectedNotification.isRead && (
                        <MenuItem onClick={handleMarkAsRead}>
                            <MarkEmailRead sx={{ mr: 2, fontSize: 20 }} />
                            Mark as Read
                        </MenuItem>
                    )}
                    <MenuItem onClick={handleDelete} sx={{ color: '#EF4444' }}>
                        <Delete sx={{ mr: 2, fontSize: 20 }} />
                        Delete
                    </MenuItem>
                </Menu>
            </Container>
        </Box>
    )
}

export default BuyerNotifications