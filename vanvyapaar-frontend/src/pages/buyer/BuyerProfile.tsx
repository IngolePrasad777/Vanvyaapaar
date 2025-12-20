import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Button, Card, CardContent,
  TextField, Avatar, alpha, Stack, Switch,
  FormControlLabel, Chip, IconButton
} from '@mui/material'
import {
  Person, Edit, Save, Cancel, PhotoCamera,
  ArrowBack, Security, Notifications, Language,
  Email, Phone, Home, LocationOn, Verified,
  ShoppingBag, Favorite, Receipt, EmojiEvents
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import buyerService from '../../services/buyerService'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const BuyerProfile = () => {
  const { user } = useAuthStore()
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    pincode: '',
    bio: ''
  })
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    marketingEmails: true,
    orderUpdates: true
  })

  const handleSave = async () => {
    if (!user) return
    try {
      setLoading(true)
      // await updateUser(formData)
      toast.success('Profile updated successfully!')
      setEditing(false)
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: '',
      address: '',
      pincode: '',
      bio: ''
    })
    setEditing(false)
  }

  const [stats, setStats] = useState([
    { icon: <EmojiEvents />, label: 'Member Since', value: '2025', color: '#D4A574' },
    { icon: <Receipt />, label: 'Total Orders', value: '0', color: '#C9A86A' },
    { icon: <Favorite />, label: 'Wishlist Items', value: '0', color: '#8B7355' },
    { icon: <ShoppingBag />, label: 'Cart Items', value: '0', color: '#6B7280' }
  ])

  useEffect(() => {
    if (user) {
      fetchStats()
    }
  }, [user])

  const fetchStats = async () => {
    if (!user) return
    try {
      // Fetch orders
      const orders = await buyerService.getOrders(user.id)
      // Fetch wishlist
      const wishlist = await buyerService.getWishlist(user.id)
      // Fetch cart
      const cart = await buyerService.getCart(user.id)
      
      // Get member since year
      const memberSince = new Date().getFullYear()
      
      setStats([
        { icon: <EmojiEvents />, label: 'Member Since', value: memberSince.toString(), color: '#D4A574' },
        { icon: <Receipt />, label: 'Total Orders', value: orders.length.toString(), color: '#C9A86A' },
        { icon: <Favorite />, label: 'Wishlist Items', value: wishlist.length.toString(), color: '#8B7355' },
        { icon: <ShoppingBag />, label: 'Cart Items', value: cart.length.toString(), color: '#6B7280' }
      ])
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9', position: 'relative' }}>
      {/* Floating Particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'fixed',
            width: Math.random() * 4 + 2,
            height: Math.random() * 4 + 2,
            borderRadius: '50%',
            background: alpha('#D4A574', Math.random() * 0.3 + 0.1),
            pointerEvents: 'none',
            zIndex: 0
          }}
          animate={{
            y: [0, -1000],
            x: [0, Math.random() * 200 - 100],
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'linear'
          }}
          initial={{
            left: `${Math.random() * 100}%`,
            bottom: -20
          }}
        />
      ))}

      <Container maxWidth="xl" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
        <Stack spacing={4}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <Button
                component={Link}
                to="/buyer/dashboard"
                startIcon={<ArrowBack />}
                sx={{
                  color: '#8B4513',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: alpha('#D4A574', 0.1) }
                }}
              >
                Back to Dashboard
              </Button>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Person sx={{ fontSize: 40, color: '#D4A574' }} />
              <Box>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 'bold',
                    color: '#1F2937',
                    fontFamily: 'serif'
                  }}
                >
                  My Profile
                </Typography>
                <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                  Manage your account settings and preferences
                </Typography>
              </Box>
            </Stack>
          </motion.div>

          {/* Stats Cards */}
          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3 }}>
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                whileHover={{ y: -5, scale: 1.02 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: alpha(stat.color, 0.2),
                    boxShadow: `0 4px 15px ${alpha(stat.color, 0.1)}`,
                    transition: 'all 0.3s',
                    '&:hover': {
                      borderColor: stat.color,
                      boxShadow: `0 8px 25px ${alpha(stat.color, 0.2)}`
                    }
                  }}
                >
                  <CardContent sx={{ p: 3, textAlign: 'center' }}>
                    <Box
                      sx={{
                        width: 60,
                        height: 60,
                        borderRadius: '50%',
                        bgcolor: alpha(stat.color, 0.1),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mx: 'auto',
                        mb: 2,
                        border: '2px solid',
                        borderColor: alpha(stat.color, 0.3)
                      }}
                    >
                      <Box sx={{ color: stat.color, fontSize: 30 }}>
                        {stat.icon}
                      </Box>
                    </Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: stat.color, mb: 1 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {stat.label}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 4 }}>
            {/* Profile Information */}
            <Box>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card
                  sx={{
                    borderRadius: 4,
                    border: '2px solid',
                    borderColor: alpha('#10B981', 0.2),
                    boxShadow: `0 4px 15px ${alpha('#10B981', 0.1)}`
                  }}
                >
                  <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#10B981', fontFamily: 'serif' }}>
                        Profile Information
                      </Typography>
                      {!editing ? (
                        <Button
                          startIcon={<Edit />}
                          onClick={() => setEditing(true)}
                          variant="contained"
                          sx={{
                            bgcolor: '#10B981',
                            '&:hover': { bgcolor: '#059669' }
                          }}
                        >
                          Edit Profile
                        </Button>
                      ) : (
                        <Stack direction="row" spacing={1}>
                          <Button
                            startIcon={<Save />}
                            onClick={handleSave}
                            disabled={loading}
                            variant="contained"
                            sx={{
                              bgcolor: '#10B981',
                              '&:hover': { bgcolor: '#059669' }
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            startIcon={<Cancel />}
                            onClick={handleCancel}
                            sx={{
                              color: '#EF4444',
                              '&:hover': { bgcolor: alpha('#EF4444', 0.1) }
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      )}
                    </Stack>

                    {/* Avatar Section */}
                    <Stack alignItems="center" sx={{ mb: 4 }}>
                      <Box sx={{ position: 'relative' }}>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Avatar
                            sx={{
                              width: 140,
                              height: 140,
                              bgcolor: alpha('#10B981', 0.2),
                              color: '#10B981',
                              fontSize: '4rem',
                              fontWeight: 'bold',
                              border: '4px solid',
                              borderColor: alpha('#10B981', 0.3),
                              mb: 2,
                              boxShadow: `0 8px 25px ${alpha('#10B981', 0.3)}`
                            }}
                          >
                            {user?.name?.[0]?.toUpperCase()}
                          </Avatar>
                        </motion.div>
                        {editing && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 300 }}
                          >
                            <IconButton
                              sx={{
                                position: 'absolute',
                                bottom: 15,
                                right: -5,
                                bgcolor: '#10B981',
                                color: '#FFFFFF',
                                width: 45,
                                height: 45,
                                '&:hover': {
                                  bgcolor: '#059669',
                                  transform: 'scale(1.1)'
                                },
                                boxShadow: `0 4px 12px ${alpha('#10B981', 0.4)}`
                              }}
                            >
                              <PhotoCamera />
                            </IconButton>
                          </motion.div>
                        )}
                      </Box>
                      <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#1F2937', mb: 1 }}>
                        {user?.name}
                      </Typography>
                      <Chip
                        icon={<Verified />}
                        label="Premium Member"
                        sx={{
                          bgcolor: alpha('#10B981', 0.1),
                          color: '#10B981',
                          fontWeight: 'bold',
                          border: '2px solid',
                          borderColor: alpha('#10B981', 0.3)
                        }}
                      />
                    </Stack>

                    {/* Form Fields */}
                    <Stack spacing={3}>
                      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 3 }}>
                        <TextField
                          fullWidth
                          label="Full Name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          disabled={!editing}
                          InputProps={{
                            startAdornment: <Person sx={{ color: '#10B981', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': { borderColor: '#10B981' },
                              '&.Mui-focused fieldset': { borderColor: '#10B981' }
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          disabled={!editing}
                          InputProps={{
                            startAdornment: <Email sx={{ color: '#10B981', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': { borderColor: '#10B981' },
                              '&.Mui-focused fieldset': { borderColor: '#10B981' }
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Phone Number"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          disabled={!editing}
                          InputProps={{
                            startAdornment: <Phone sx={{ color: '#10B981', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': { borderColor: '#10B981' },
                              '&.Mui-focused fieldset': { borderColor: '#10B981' }
                            }
                          }}
                        />
                        <TextField
                          fullWidth
                          label="Pincode"
                          value={formData.pincode}
                          onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                          disabled={!editing}
                          InputProps={{
                            startAdornment: <LocationOn sx={{ color: '#10B981', mr: 1 }} />
                          }}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              '&:hover fieldset': { borderColor: '#10B981' },
                              '&.Mui-focused fieldset': { borderColor: '#10B981' }
                            }
                          }}
                        />
                      </Box>
                      <TextField
                        fullWidth
                        label="Address"
                        multiline
                        rows={3}
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        disabled={!editing}
                        InputProps={{
                          startAdornment: <Home sx={{ color: '#10B981', mr: 1, mt: 1 }} />
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#10B981' },
                            '&.Mui-focused fieldset': { borderColor: '#10B981' }
                          }
                        }}
                      />
                      <TextField
                        fullWidth
                        label="Bio"
                        multiline
                        rows={3}
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        disabled={!editing}
                        placeholder="Tell us about yourself..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            '&:hover fieldset': { borderColor: '#10B981' },
                            '&.Mui-focused fieldset': { borderColor: '#10B981' }
                          }
                        }}
                      />
                    </Stack>
                  </CardContent>
                </Card>
              </motion.div>
            </Box>

            {/* Settings & Preferences */}
            <Box>
              <Stack spacing={3}>
                {/* Account Settings */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      border: '2px solid',
                      borderColor: alpha('#D4A574', 0.2),
                      boxShadow: `0 4px 15px ${alpha('#D4A574', 0.1)}`
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Security sx={{ color: '#D4A574', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#D4A574', fontFamily: 'serif' }}>
                          Account Settings
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            color: '#D4A574',
                            borderColor: '#D4A574',
                            justifyContent: 'flex-start',
                            py: 1.5,
                            '&:hover': {
                              bgcolor: alpha('#D4A574', 0.1),
                              borderColor: '#D4A574'
                            }
                          }}
                        >
                          Change Password
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            color: '#D4A574',
                            borderColor: '#D4A574',
                            justifyContent: 'flex-start',
                            py: 1.5,
                            '&:hover': {
                              bgcolor: alpha('#D4A574', 0.1),
                              borderColor: '#D4A574'
                            }
                          }}
                        >
                          Two-Factor Authentication
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            color: '#EF4444',
                            borderColor: '#EF4444',
                            justifyContent: 'flex-start',
                            py: 1.5,
                            '&:hover': {
                              bgcolor: alpha('#EF4444', 0.1),
                              borderColor: '#EF4444'
                            }
                          }}
                        >
                          Delete Account
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Notification Settings */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      border: '2px solid',
                      borderColor: alpha('#3B82F6', 0.2),
                      boxShadow: `0 4px 15px ${alpha('#3B82F6', 0.1)}`
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Notifications sx={{ color: '#3B82F6', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#3B82F6', fontFamily: 'serif' }}>
                          Notifications
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.emailNotifications}
                              onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#3B82F6' }
                              }}
                            />
                          }
                          label="Email Notifications"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.smsNotifications}
                              onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#3B82F6' }
                              }}
                            />
                          }
                          label="SMS Notifications"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.marketingEmails}
                              onChange={(e) => setSettings({ ...settings, marketingEmails: e.target.checked })}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#3B82F6' }
                              }}
                            />
                          }
                          label="Marketing Emails"
                        />
                        <FormControlLabel
                          control={
                            <Switch
                              checked={settings.orderUpdates}
                              onChange={(e) => setSettings({ ...settings, orderUpdates: e.target.checked })}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': { color: '#3B82F6' },
                                '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#3B82F6' }
                              }}
                            />
                          }
                          label="Order Updates"
                        />
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Preferences */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                >
                  <Card
                    sx={{
                      borderRadius: 4,
                      border: '2px solid',
                      borderColor: alpha('#8B5CF6', 0.2),
                      boxShadow: `0 4px 15px ${alpha('#8B5CF6', 0.1)}`
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                        <Language sx={{ color: '#8B5CF6', fontSize: 28 }} />
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B5CF6', fontFamily: 'serif' }}>
                          Preferences
                        </Typography>
                      </Stack>
                      <Stack spacing={2}>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            color: '#8B5CF6',
                            borderColor: '#8B5CF6',
                            justifyContent: 'space-between',
                            py: 1.5,
                            '&:hover': {
                              bgcolor: alpha('#8B5CF6', 0.1),
                              borderColor: '#8B5CF6'
                            }
                          }}
                        >
                          <span>Language</span>
                          <span>English</span>
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            color: '#8B5CF6',
                            borderColor: '#8B5CF6',
                            justifyContent: 'space-between',
                            py: 1.5,
                            '&:hover': {
                              bgcolor: alpha('#8B5CF6', 0.1),
                              borderColor: '#8B5CF6'
                            }
                          }}
                        >
                          <span>Currency</span>
                          <span>INR (₹)</span>
                        </Button>
                        <Button
                          fullWidth
                          variant="outlined"
                          sx={{
                            color: '#8B5CF6',
                            borderColor: '#8B5CF6',
                            justifyContent: 'space-between',
                            py: 1.5,
                            '&:hover': {
                              bgcolor: alpha('#8B5CF6', 0.1),
                              borderColor: '#8B5CF6'
                            }
                          }}
                        >
                          <span>Theme</span>
                          <span>Light</span>
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </motion.div>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  )
}

export default BuyerProfile
