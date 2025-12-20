import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import {
  Box, Container, Typography, Button, TextField, Paper, Stack,
  IconButton, InputAdornment, Checkbox, FormControlLabel,
  Chip, Card, CardContent, alpha, Divider, Avatar
} from '@mui/material'
import {
  Visibility, VisibilityOff, ArrowBack, ShoppingBag,
  People, Shield, AutoAwesome, CheckCircle, ArrowForward
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { LoginRequest } from '../../types'
import Logo from '../../components/common/Logo'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import EnhancedCard from '../../components/common/EnhancedCard'

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [selectedRole, setSelectedRole] = useState<'BUYER' | 'SELLER' | 'ADMIN'>('BUYER')
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login, isLoading, user } = useAuthStore()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginRequest>()

  useEffect(() => {
    // Check if admin login is requested
    if (searchParams.get('admin') === 'true') {
      setSelectedRole('ADMIN')
    }

    // Redirect if already logged in
    if (user) {
      navigate(`/${user.role.toLowerCase()}`)
    }
  }, [searchParams, user, navigate])

  const onSubmit = async (data: LoginRequest) => {
    const success = await login({
      ...data,
      role: selectedRole
    })

    if (success) {
      navigate(`/${selectedRole.toLowerCase()}`)
    }
  }

  return (
    <Box sx={{
      minHeight: '100vh',
      bgcolor: '#FAFAF9',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <AnimatedBackground variant="waves" intensity="light" color="#D4A574" />
      <FloatingElements
        showScrollTop={false}
        showQuickActions={true}
        quickActions={[
          {
            icon: <ArrowBack />,
            label: 'Back to Home',
            onClick: () => navigate('/'),
            color: '#D4A574'
          },
          {
            icon: <ShoppingBag />,
            label: 'Browse Products',
            onClick: () => navigate('/products'),
            color: '#C9A86A'
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
          width: '50%',
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
              <Box sx={{ mb: 6 }}>
                <Logo variant="light" size="large" />
              </Box>
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
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2
              }}>
                Welcome Back to
              </Typography>
              <Typography variant="h2" sx={{
                color: '#D4A574',
                fontWeight: 'bold',
                mb: 4,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1.2
              }}>
                Authentic Tribal Crafts
              </Typography>

              <Typography variant="h6" sx={{
                color: alpha('#fff', 0.9),
                mb: 6,
                lineHeight: 1.8,
                maxWidth: '500px'
              }}>
                Continue your journey of discovering and supporting traditional artisans
                from tribal communities across India.
              </Typography>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Stack spacing={3} sx={{ mb: 6 }}>
                {[
                  { icon: <ShoppingBag />, text: 'Shop authentic tribal crafts' },
                  { icon: <People />, text: 'Support artisan communities' },
                  { icon: <Shield />, text: 'Secure & trusted platform' }
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{
                        width: 40,
                        height: 40,
                        bgcolor: alpha('#fff', 0.2),
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mr: 2,
                        color: '#D4A574'
                      }}>
                        {feature.icon}
                      </Box>
                      <Typography sx={{ color: alpha('#fff', 0.9) }}>
                        {feature.text}
                      </Typography>
                    </Box>
                  </motion.div>
                ))}
              </Stack>
            </motion.div>

            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Paper sx={{
                p: 4,
                bgcolor: alpha('#fff', 0.1),
                backdropFilter: 'blur(20px)',
                border: '1px solid',
                borderColor: alpha('#fff', 0.2),
                borderRadius: 3
              }}>
                <Typography sx={{
                  color: alpha('#fff', 0.9),
                  fontStyle: 'italic',
                  mb: 3,
                  lineHeight: 1.6
                }}>
                  "VanVyaapaar has connected me with the most beautiful authentic crafts.
                  Every purchase feels meaningful knowing I'm supporting tribal artisans."
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face"
                    sx={{ width: 40, height: 40, mr: 2 }}
                  />
                  <Box>
                    <Typography sx={{ color: 'white', fontWeight: 'bold' }}>
                      Priya Sharma
                    </Typography>
                    <Typography variant="caption" sx={{ color: alpha('#D4A574', 0.8) }}>
                      Verified Customer
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          </Container>
        </Box>

        {/* Right Side - Login Form */}
        <Box sx={{
          width: { xs: '100%', lg: '50%' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 }
        }}>
          <Container maxWidth="sm">
            {/* Mobile Header */}
            <Box sx={{
              display: { xs: 'block', lg: 'none' },
              textAlign: 'center',
              mb: 4
            }}>
              <Button
                component={Link}
                to="/"
                startIcon={<ArrowBack />}
                sx={{
                  mb: 3,
                  color: '#6B7280',
                  '&:hover': { color: '#D4A574' }
                }}
              >
                Back to Home
              </Button>

              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <Logo variant="dark" size="large" />
              </Box>
            </Box>

            {/* Form Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{
                  fontWeight: 'bold',
                  color: '#1F2937',
                  mb: 1,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}>
                  Welcome Back
                </Typography>
                <Typography variant="h6" sx={{ color: '#6B7280' }}>
                  Sign in to continue your tribal craft journey
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
                glowColor="#D4A574"
                intensity="medium"
                sx={{
                  p: 4,
                  borderRadius: 4,
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
                  border: '1px solid',
                  borderColor: alpha('#D4A574', 0.1)
                }}
              >
                {/* Role Selection */}
                {selectedRole !== 'ADMIN' && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle2" sx={{
                      fontWeight: 'bold',
                      color: '#1F2937',
                      mb: 2,
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      <AutoAwesome sx={{ mr: 1, fontSize: 18 }} />
                      Choose your role
                    </Typography>
                    <Stack direction="row" spacing={2}>
                      {[
                        { role: 'BUYER', icon: <ShoppingBag />, label: 'Buyer', desc: 'Shop crafts' },
                        { role: 'SELLER', icon: <People />, label: 'Seller', desc: 'Sell crafts' }
                      ].map((option) => (
                        <Button
                          key={option.role}
                          onClick={() => setSelectedRole(option.role as 'BUYER' | 'SELLER')}
                          sx={{
                            flex: 1,
                            p: 2,
                            borderRadius: 3,
                            border: '2px solid',
                            borderColor: selectedRole === option.role ? '#D4A574' : alpha('#D4A574', 0.2),
                            bgcolor: selectedRole === option.role ? '#D4A574' : 'transparent',
                            color: selectedRole === option.role ? 'white' : '#1F2937',
                            flexDirection: 'column',
                            '&:hover': {
                              borderColor: '#D4A574',
                              bgcolor: selectedRole === option.role ? '#C9A86A' : alpha('#D4A574', 0.05)
                            }
                          }}
                        >
                          <Box sx={{
                            color: selectedRole === option.role ? 'white' : '#D4A574',
                            mb: 1
                          }}>
                            {option.icon}
                          </Box>
                          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            {option.label}
                          </Typography>
                          <Typography variant="caption" sx={{
                            color: selectedRole === option.role ? alpha('#fff', 0.8) : '#6B7280'
                          }}>
                            {option.desc}
                          </Typography>
                        </Button>
                      ))}
                    </Stack>
                  </Box>
                )}

                {selectedRole === 'ADMIN' && (
                  <Card sx={{
                    mb: 4,
                    bgcolor: alpha('#2563EB', 0.05),
                    border: '1px solid',
                    borderColor: alpha('#2563EB', 0.2)
                  }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          width: 40,
                          height: 40,
                          bgcolor: alpha('#2563EB', 0.1),
                          borderRadius: 2,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mr: 2
                        }}>
                          <Shield sx={{ color: '#2563EB' }} />
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1E40AF' }}>
                            Admin Access
                          </Typography>
                          <Typography variant="body2" sx={{ color: '#3B82F6' }}>
                            Administrative dashboard and controls
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                )}

                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={3}>
                    <TextField
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Invalid email address',
                        },
                      })}
                      label="Email Address"
                      type="email"
                      fullWidth
                      error={!!errors.email}
                      helperText={errors.email?.message}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: '#D4A574',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#D4A574',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#D4A574',
                        },
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
                      label="Password"
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
                          borderRadius: 3,
                          '&:hover fieldset': {
                            borderColor: '#D4A574',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#D4A574',
                          },
                        },
                        '& .MuiInputLabel-root.Mui-focused': {
                          color: '#D4A574',
                        },
                      }}
                    />

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            sx={{
                              color: '#D4A574',
                              '&.Mui-checked': {
                                color: '#D4A574',
                              },
                            }}
                          />
                        }
                        label="Remember me for 30 days"
                      />
                      <Button
                        component={Link}
                        to="/forgot-password"
                        sx={{
                          color: '#D4A574',
                          fontWeight: 'bold',
                          textTransform: 'none'
                        }}
                      >
                        Forgot password?
                      </Button>
                    </Box>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="submit"
                        fullWidth
                        disabled={isLoading}
                        endIcon={!isLoading && <ArrowForward />}
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
                        {isLoading ? 'Signing in...' : 'Sign in to VanVyaapaar'}
                      </Button>
                    </motion.div>
                  </Stack>
                </form>

                {/* Divider and Registration Links */}
                <Box sx={{ mt: 4 }}>
                  <Divider sx={{ mb: 3 }}>
                    <Chip
                      label={selectedRole === 'ADMIN' ? 'Not an admin?' : 'New to VanVyaapaar?'}
                      size="small"
                      sx={{ bgcolor: '#FAFAF9' }}
                    />
                  </Divider>

                  {selectedRole === 'ADMIN' ? (
                    <Button
                      fullWidth
                      onClick={() => setSelectedRole('BUYER')}
                      sx={{
                        bgcolor: alpha('#6B7280', 0.1),
                        color: '#374151',
                        py: 1.5,
                        borderRadius: 3,
                        textTransform: 'none',
                        fontWeight: 'bold',
                        '&:hover': {
                          bgcolor: alpha('#6B7280', 0.2),
                        }
                      }}
                    >
                      Login as Customer
                    </Button>
                  ) : (
                    <Stack spacing={2}>
                      <Button
                        component={Link}
                        to="/register?type=buyer"
                        fullWidth
                        startIcon={<ShoppingBag />}
                        sx={{
                          bgcolor: alpha('#D4A574', 0.1),
                          color: '#D4A574',
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          border: '2px solid transparent',
                          '&:hover': {
                            bgcolor: alpha('#D4A574', 0.15),
                            borderColor: alpha('#D4A574', 0.3),
                          }
                        }}
                      >
                        Join as Buyer
                      </Button>
                      <Button
                        component={Link}
                        to="/register?type=seller"
                        fullWidth
                        startIcon={<People />}
                        sx={{
                          bgcolor: alpha('#D4A574', 0.1),
                          color: '#D4A574',
                          py: 1.5,
                          borderRadius: 3,
                          textTransform: 'none',
                          fontWeight: 'bold',
                          border: '2px solid transparent',
                          '&:hover': {
                            bgcolor: alpha('#D4A574', 0.15),
                            borderColor: alpha('#D4A574', 0.3),
                          }
                        }}
                      >
                        Join as Seller
                      </Button>
                    </Stack>
                  )}
                </Box>

                {/* Trust Indicators */}
                <Box sx={{ mt: 4, pt: 3, borderTop: '1px solid', borderColor: alpha('#D4A574', 0.1) }}>
                  <Stack direction="row" spacing={4} justifyContent="center">
                    {[
                      { icon: <Shield />, text: 'Secure Login' },
                      { icon: <CheckCircle />, text: 'Verified Platform' },
                      { icon: <People />, text: 'Trusted by Many' }
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

export default LoginPage