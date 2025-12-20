import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
    Box, Container, Typography, Button, TextField, Paper, Stack,
    IconButton, InputAdornment, Checkbox, FormControlLabel,
    alpha, MenuItem, Select, FormControl, InputLabel, Alert
} from '@mui/material'

import {
    Visibility, VisibilityOff, ArrowBack, Check, ShoppingBag,
    People, Shield, CheckCircle, Star, EmojiEvents, Public
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { BuyerSignupRequest, SellerSignupRequest } from '../../types'
import Logo from '../../components/common/Logo'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'

const RegisterPage = () => {
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [userType, setUserType] = useState<'buyer' | 'seller'>('buyer')
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { signupBuyer, signupSeller, isLoading, user } = useAuthStore()

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<BuyerSignupRequest & SellerSignupRequest>({
        mode: 'onChange'
    })

    const password = watch('password')

    useEffect(() => {
        const type = searchParams.get('type')
        if (type === 'seller') {
            setUserType('seller')
        }

        if (user) {
            navigate(`/${user.role.toLowerCase()}`)
        }
    }, [searchParams, user, navigate])

    const onSubmit = async (data: BuyerSignupRequest & SellerSignupRequest) => {
        let success = false

        if (userType === 'buyer') {
            const buyerData: BuyerSignupRequest = {
                name: data.name,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                phone: data.phone,
                address: data.address,
                pincode: data.pincode
            }
            success = await signupBuyer(buyerData)
        } else {
            const sellerData: SellerSignupRequest = {
                name: data.name,
                email: data.email,
                password: data.password,
                confirmPassword: data.confirmPassword,
                phone: data.phone,
                address: data.address,
                pincode: data.pincode,
                tribeName: data.tribeName,
                artisanCategory: data.artisanCategory,
                region: data.region,
                bio: data.bio,
                bankAccountNumber: data.bankAccountNumber,
                ifscCode: data.ifscCode,
                panNumber: data.panNumber,
                termsAccepted: true,
                consentAccepted: true
            }
            success = await signupSeller(sellerData)
        }

        if (success) {
            navigate('/login')
        }
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            bgcolor: '#FAFAF9',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <AnimatedBackground variant="geometric" intensity="light" color="#C9A86A" />
            <FloatingElements 
                showScrollTop={false}
                showQuickActions={true}
                quickActions={[
                    {
                        icon: <ArrowBack />,
                        label: 'Back to Home',
                        onClick: () => navigate('/'),
                        color: '#C9A86A'
                    },
                    {
                        icon: <ShoppingBag />,
                        label: 'Browse Products',
                        onClick: () => navigate('/products'),
                        color: '#D4A574'
                    }
                ]}
            />

            <Box sx={{
                display: 'flex',
                minHeight: '100vh',
                position: 'relative',
                zIndex: 1
            }}>
                {/* Left Side - Branding */}
                <Box sx={{
                    display: { xs: 'none', lg: 'flex' },
                    width: '40%',
                    background: 'linear-gradient(135deg, #1F2937 0%, #374151 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Animated Background */}
                    <motion.div
                        animate={{
                            background: [
                                'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)',
                                'radial-gradient(circle at 80% 50%, rgba(212, 165, 116, 0.15) 0%, transparent 50%)',
                                'radial-gradient(circle at 20% 50%, rgba(212, 165, 116, 0.1) 0%, transparent 50%)'
                            ]
                        }}
                        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                        style={{
                            position: 'absolute',
                            inset: 0
                        }}
                    />

                    <Container sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        height: '100%',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Button
                                component={Link}
                                to="/"
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    mb: 4,
                                    p: 0,
                                    textTransform: 'none',
                                    '&:hover': { bgcolor: 'transparent' }
                                }}
                            >
                                <Box sx={{
                                    width: 48,
                                    height: 48,
                                    bgcolor: alpha('#fff', 0.2),
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <Typography variant="h4" sx={{ color: 'white', fontWeight: 'bold' }}>
                                        V
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{
                                    color: 'white',
                                    fontWeight: 'bold',
                                    fontFamily: 'serif'
                                }}>
                                    VanVyaapaar
                                </Typography>
                            </Button>
                        </motion.div>

                        {/* Main Content */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <Typography variant="h2" sx={{
                                color: 'white',
                                fontWeight: 'bold',
                                mb: 1,
                                fontSize: { xs: '2rem', md: '3rem' },
                                lineHeight: 1.2
                            }}>
                                Join Our
                            </Typography>
                            <Typography variant="h2" sx={{
                                color: '#D4A574',
                                fontWeight: 'bold',
                                mb: 3,
                                fontSize: { xs: '2rem', md: '3rem' },
                                lineHeight: 1.2
                            }}>
                                Tribal Craft Community
                            </Typography>

                            <Typography variant="h6" sx={{
                                color: alpha('#fff', 0.9),
                                mb: 4,
                                lineHeight: 1.8,
                                maxWidth: '400px'
                            }}>
                                {userType === 'buyer'
                                    ? 'Discover authentic tribal crafts and support traditional artisans from across India.'
                                    : 'Share your traditional crafts with the world and build a sustainable livelihood.'
                                }
                            </Typography>
                        </motion.div>

                        {/* Benefits */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            <Stack spacing={2} sx={{ mb: 4 }}>
                                {(userType === 'buyer' ? [
                                    { icon: <ShoppingBag />, text: 'Access to authentic tribal crafts' },
                                    { icon: <Shield />, text: 'Secure shopping experience' },
                                    { icon: <EmojiEvents />, text: 'Support artisan communities' }
                                ] : [
                                    { icon: <Public />, text: 'Reach customers worldwide' },
                                    { icon: <Star />, text: 'Showcase your traditional skills' },
                                    { icon: <CheckCircle />, text: 'Fair pricing and payments' }
                                ]).map((benefit, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                                    >
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Box sx={{
                                                width: 32,
                                                height: 32,
                                                bgcolor: alpha('#fff', 0.2),
                                                borderRadius: 2,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                mr: 2,
                                                color: '#D4A574'
                                            }}>
                                                {benefit.icon}
                                            </Box>
                                            <Typography sx={{ color: alpha('#fff', 0.9), fontSize: '0.9rem' }}>
                                                {benefit.text}
                                            </Typography>
                                        </Box>
                                    </motion.div>
                                ))}
                            </Stack>
                        </motion.div>

                        {/* Stats */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.8 }}
                        >
                            <Paper sx={{
                                p: 3,
                                bgcolor: alpha('#fff', 0.1),
                                backdropFilter: 'blur(20px)',
                                border: '1px solid',
                                borderColor: alpha('#fff', 0.2),
                                borderRadius: 3
                            }}>
                                <Stack direction="row" spacing={3} sx={{ textAlign: 'center', justifyContent: 'space-around' }}>
                                    <Box>
                                        <Typography variant="h4" sx={{ color: '#D4A574', fontWeight: 'bold' }}>
                                            Since 2019
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                                            Preserving Heritage
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ color: '#D4A574', fontWeight: 'bold' }}>
                                            100%
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                                            Handcrafted
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography variant="h4" sx={{ color: '#D4A574', fontWeight: 'bold' }}>
                                            Direct
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                                            From Artisans
                                        </Typography>
                                    </Box>
                                </Stack>
                            </Paper>
                        </motion.div>
                    </Container>
                </Box>

                {/* Right Side - Registration Form */}
                <Box sx={{
                    width: { xs: '100%', lg: '60%' },
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-start',
                    p: { xs: 2, sm: 3 },
                    maxHeight: '100vh',
                    overflowY: 'auto',
                    // Custom scrollbar styling
                    '&::-webkit-scrollbar': {
                        width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: alpha('#D4A574', 0.1),
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: '#D4A574',
                        borderRadius: '3px',
                        '&:hover': {
                            background: '#C9A86A',
                        },
                    },
                }}>
                    <Container maxWidth="md">
                        {/* Mobile Header */}
                        <Box sx={{
                            display: { xs: 'block', lg: 'none' },
                            textAlign: 'center',
                            mb: 3
                        }}>
                            <Button
                                component={Link}
                                to="/"
                                startIcon={<ArrowBack />}
                                sx={{
                                    mb: 2,
                                    color: '#6B7280',
                                    '&:hover': { color: '#D4A574' }
                                }}
                            >
                                Back to Home
                            </Button>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                                <Logo variant="dark" size="large" />
                            </Box>
                        </Box>

                        {/* Form Header */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <Box sx={{ textAlign: 'center', mb: 2 }}>
                                <Typography variant="h3" sx={{
                                    fontWeight: 'bold',
                                    color: '#1F2937',
                                    mb: 1,
                                    fontSize: { xs: '1.8rem', md: '2.2rem' }
                                }}>
                                    Create Your Account
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#6B7280' }}>
                                    Already have an account?{' '}
                                    <Button
                                        component={Link}
                                        to="/login"
                                        sx={{
                                            color: '#D4A574',
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            p: 0,
                                            minWidth: 'auto'
                                        }}
                                    >
                                        Sign in here
                                    </Button>
                                </Typography>
                            </Box>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            <EnhancedCard
                                hoverEffect="glow"
                                glowColor="#C9A86A"
                                intensity="medium"
                                sx={{
                                    p: { xs: 2, md: 3 },
                                    borderRadius: 3,
                                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.08)',
                                    border: '1px solid',
                                    borderColor: alpha('#D4A574', 0.1)
                                }}
                            >
                                {/* User Type Selection */}
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{
                                        fontWeight: 'bold',
                                        color: '#1F2937',
                                        mb: 2
                                    }}>
                                        I want to join as
                                    </Typography>
                                    <Stack direction="row" spacing={2}>
                                        {[
                                            { type: 'buyer', icon: <ShoppingBag />, label: 'Buyer', desc: 'Shop authentic crafts' },
                                            { type: 'seller', icon: <People />, label: 'Seller', desc: 'Sell your crafts' }
                                        ].map((option) => (
                                            <Button
                                                key={option.type}
                                                onClick={() => setUserType(option.type as 'buyer' | 'seller')}
                                                sx={{
                                                    flex: 1,
                                                    p: 2,
                                                    borderRadius: 3,
                                                    border: '2px solid',
                                                    borderColor: userType === option.type ? '#D4A574' : alpha('#D4A574', 0.2),
                                                    bgcolor: userType === option.type ? '#D4A574' : 'transparent',
                                                    color: userType === option.type ? 'white' : '#1F2937',
                                                    flexDirection: 'column',
                                                    '&:hover': {
                                                        borderColor: '#D4A574',
                                                        bgcolor: userType === option.type ? '#C9A86A' : alpha('#D4A574', 0.05)
                                                    }
                                                }}
                                            >
                                                <Box sx={{
                                                    color: userType === option.type ? 'white' : '#D4A574',
                                                    mb: 1
                                                }}>
                                                    {option.icon}
                                                </Box>
                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                    {option.label}
                                                </Typography>
                                                <Typography variant="caption" sx={{
                                                    color: userType === option.type ? alpha('#fff', 0.8) : '#6B7280'
                                                }}>
                                                    {option.desc}
                                                </Typography>
                                            </Button>
                                        ))}
                                    </Stack>
                                </Box>

                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <Stack spacing={2}>
                                        {/* Basic Information */}
                                        <Stack spacing={2}>
                                            <TextField
                                                {...register('name', { required: 'Name is required' })}
                                                label="Full Name *"
                                                fullWidth
                                                error={!!errors.name}
                                                helperText={errors.name?.message}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#D4A574' },
                                                        '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                }}
                                            />

                                            <TextField
                                                {...register('email', {
                                                    required: 'Email is required',
                                                    pattern: {
                                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                                        message: 'Invalid email address',
                                                    },
                                                })}
                                                label="Email Address *"
                                                type="email"
                                                fullWidth
                                                error={!!errors.email}
                                                helperText={errors.email?.message}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#D4A574' },
                                                        '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                }}
                                            />

                                            <TextField
                                                {...register('phone')}
                                                label="Phone Number"
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#D4A574' },
                                                        '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                }}
                                            />

                                            <TextField
                                                {...register('password', {
                                                    required: 'Password is required',
                                                    minLength: {
                                                        value: 6,
                                                        message: 'Password must be at least 6 characters',
                                                    },
                                                })}
                                                label="Password *"
                                                type={showPassword ? 'text' : 'password'}
                                                fullWidth
                                                error={!!errors.password}
                                                helperText={errors.password?.message}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowPassword(!showPassword)}
                                                                edge="end"
                                                            >
                                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#D4A574' },
                                                        '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                }}
                                            />

                                            <TextField
                                                {...register('confirmPassword', {
                                                    required: 'Please confirm your password',
                                                    validate: (value) =>
                                                        value === password || 'Passwords do not match',
                                                })}
                                                label="Confirm Password *"
                                                type={showConfirmPassword ? 'text' : 'password'}
                                                fullWidth
                                                error={!!errors.confirmPassword}
                                                helperText={errors.confirmPassword?.message}
                                                InputProps={{
                                                    endAdornment: (
                                                        <InputAdornment position="end">
                                                            <IconButton
                                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                                edge="end"
                                                            >
                                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#D4A574' },
                                                        '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                }}
                                            />

                                            <TextField
                                                {...register('address')}
                                                label="Address"
                                                multiline
                                                rows={2}
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#D4A574' },
                                                        '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                }}
                                            />

                                            <TextField
                                                {...register('pincode')}
                                                label="Pincode"
                                                fullWidth
                                                sx={{
                                                    '& .MuiOutlinedInput-root': {
                                                        borderRadius: 2,
                                                        '&:hover fieldset': { borderColor: '#D4A574' },
                                                        '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                    },
                                                    '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                }}
                                            />
                                        </Stack>

                                        {/* Seller-specific fields */}
                                        {userType === 'seller' && (
                                            <Box sx={{ pt: 2, borderTop: '1px solid', borderColor: alpha('#D4A574', 0.2) }}>
                                                <Typography variant="h6" sx={{ mb: 2, color: '#1F2937', fontWeight: 'bold' }}>
                                                    Artisan Information
                                                </Typography>

                                                <Stack spacing={2}>
                                                    <TextField
                                                        {...register('tribeName')}
                                                        label="Tribe Name"
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                '&:hover fieldset': { borderColor: '#D4A574' },
                                                                '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                        }}
                                                    />

                                                    <FormControl fullWidth>
                                                        <InputLabel sx={{ '&.Mui-focused': { color: '#D4A574' } }}>
                                                            Artisan Category
                                                        </InputLabel>
                                                        <Select
                                                            {...register('artisanCategory')}
                                                            label="Artisan Category"
                                                            sx={{
                                                                borderRadius: 2,
                                                                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#D4A574' },
                                                                '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#D4A574' },
                                                            }}
                                                        >
                                                            <MenuItem value="Pottery">Pottery</MenuItem>
                                                            <MenuItem value="Textiles">Textiles</MenuItem>
                                                            <MenuItem value="Handicrafts">Handicrafts</MenuItem>
                                                            <MenuItem value="Jewelry">Jewelry</MenuItem>
                                                            <MenuItem value="Wood Crafts">Wood Crafts</MenuItem>
                                                            <MenuItem value="Metal Crafts">Metal Crafts</MenuItem>
                                                        </Select>
                                                    </FormControl>

                                                    <TextField
                                                        {...register('region')}
                                                        label="Region"
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                '&:hover fieldset': { borderColor: '#D4A574' },
                                                                '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                        }}
                                                    />

                                                    <TextField
                                                        {...register('bio')}
                                                        label="Bio"
                                                        multiline
                                                        rows={2}
                                                        fullWidth
                                                        placeholder="Tell us about your craft and experience"
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                '&:hover fieldset': { borderColor: '#D4A574' },
                                                                '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                        }}
                                                    />

                                                    <TextField
                                                        {...register('bankAccountNumber')}
                                                        label="Bank Account Number"
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                '&:hover fieldset': { borderColor: '#D4A574' },
                                                                '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                        }}
                                                    />

                                                    <TextField
                                                        {...register('ifscCode')}
                                                        label="IFSC Code"
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                '&:hover fieldset': { borderColor: '#D4A574' },
                                                                '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                        }}
                                                    />

                                                    <TextField
                                                        {...register('panNumber')}
                                                        label="PAN Number"
                                                        fullWidth
                                                        sx={{
                                                            '& .MuiOutlinedInput-root': {
                                                                borderRadius: 2,
                                                                '&:hover fieldset': { borderColor: '#D4A574' },
                                                                '&.Mui-focused fieldset': { borderColor: '#D4A574' },
                                                            },
                                                            '& .MuiInputLabel-root.Mui-focused': { color: '#D4A574' },
                                                        }}
                                                    />
                                                </Stack>
                                            </Box>
                                        )}

                                        {/* Terms and Conditions */}
                                        <Box sx={{ pt: 1 }}>
                                            <FormControlLabel
                                                control={
                                                    <Checkbox
                                                        {...register('termsAccepted', {
                                                            required: 'You must accept the terms and conditions'
                                                        })}
                                                        sx={{
                                                            color: '#D4A574',
                                                            '&.Mui-checked': { color: '#D4A574' },
                                                        }}
                                                    />
                                                }
                                                label={
                                                    <Typography variant="body2">
                                                        I agree to the{' '}
                                                        <Button
                                                            component={Link}
                                                            to="/terms"
                                                            sx={{
                                                                color: '#D4A574',
                                                                textTransform: 'none',
                                                                p: 0,
                                                                minWidth: 'auto',
                                                                textDecoration: 'underline'
                                                            }}
                                                        >
                                                            Terms of Service
                                                        </Button>{' '}
                                                        and{' '}
                                                        <Button
                                                            component={Link}
                                                            to="/privacy"
                                                            sx={{
                                                                color: '#D4A574',
                                                                textTransform: 'none',
                                                                p: 0,
                                                                minWidth: 'auto',
                                                                textDecoration: 'underline'
                                                            }}
                                                        >
                                                            Privacy Policy
                                                        </Button>
                                                    </Typography>
                                                }
                                            />
                                            {errors.termsAccepted && (
                                                <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                                                    {errors.termsAccepted.message}
                                                </Typography>
                                            )}

                                            {userType === 'seller' && (
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            {...register('consentAccepted', {
                                                                required: userType === 'seller' ? 'You must provide consent to share craft information' : false
                                                            })}
                                                            sx={{
                                                                color: '#D4A574',
                                                                '&.Mui-checked': { color: '#D4A574' },
                                                            }}
                                                        />
                                                    }
                                                    label={
                                                        <Typography variant="body2">
                                                            I consent to share my craft information and agree to platform guidelines
                                                        </Typography>
                                                    }
                                                />
                                            )}
                                        </Box>

                                        <motion.div
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <Button
                                                type="submit"
                                                fullWidth
                                                disabled={isLoading}
                                                sx={{
                                                    bgcolor: '#D4A574',
                                                    color: 'white',
                                                    py: 2,
                                                    fontSize: '1.1rem',
                                                    fontWeight: 'bold',
                                                    borderRadius: 3,
                                                    textTransform: 'none',
                                                    boxShadow: '0 10px 40px rgba(212, 165, 116, 0.3)',
                                                    '&:hover': {
                                                        bgcolor: '#C9A86A',
                                                        boxShadow: '0 15px 50px rgba(212, 165, 116, 0.4)',
                                                    },
                                                    '&:disabled': {
                                                        bgcolor: alpha('#D4A574', 0.5),
                                                    }
                                                }}
                                            >
                                                {isLoading ? 'Creating Account...' : `Create ${userType === 'buyer' ? 'Buyer' : 'Seller'} Account`}
                                            </Button>
                                        </motion.div>
                                    </Stack>
                                </form>

                                {/* Seller Review Notice */}
                                {userType === 'seller' && (
                                    <Alert
                                        icon={<Check />}
                                        severity="info"
                                        sx={{
                                            mt: 3,
                                            bgcolor: alpha('#2563EB', 0.05),
                                            border: '1px solid',
                                            borderColor: alpha('#2563EB', 0.2),
                                            '& .MuiAlert-icon': { color: '#2563EB' }
                                        }}
                                    >
                                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 1 }}>
                                            Seller Account Review Process
                                        </Typography>
                                        <Typography variant="body2">
                                            Your seller account will be reviewed by our admin team to ensure authenticity and quality.
                                            You'll receive an email notification once approved, typically within 24-48 hours.
                                        </Typography>
                                    </Alert>
                                )}

                                {/* Trust Indicators */}
                                <Box sx={{ mt: 3, pt: 3, borderTop: '1px solid', borderColor: alpha('#D4A574', 0.1) }}>
                                    <Stack direction="row" spacing={4} justifyContent="center">
                                        {[
                                            { icon: <Shield />, text: 'Secure Registration' },
                                            { icon: <CheckCircle />, text: 'Verified Platform' },
                                            { icon: <People />, text: 'Join Our Community' }
                                        ].map((item, index) => (
                                            <Box key={index} sx={{ textAlign: 'center' }}>
                                                <Box sx={{ color: '#D4A574', mb: 0.5 }}>
                                                    {item.icon}
                                                </Box>
                                                <Typography variant="caption" sx={{
                                                    color: '#6B7280',
                                                    fontWeight: 'medium'
                                                }}>
                                                    {item.text}
                                                </Typography>
                                            </Box>
                                        ))}
                                    </Stack>
                                </Box>
                            </EnhancedCard>
                        </motion.div>
                    </Container>
                </Box>
            </Box>
        </Box>
    )
}

export default RegisterPage