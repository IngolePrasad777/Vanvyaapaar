import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Button, Card, CardContent,
  Stack, Divider, alpha, Chip
} from '@mui/material'
import {
  CheckCircle, LocalShipping, Home, ShoppingBag, Receipt,
  Celebration
} from '@mui/icons-material'
import { formatPrice } from '../../lib/utils'

const OrderSuccess = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [showConfetti, setShowConfetti] = useState(true)
  
  const orderId = searchParams.get('orderId') || '12345'
  const orderTotal = searchParams.get('total') || '2499'

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#FAFAF9', position: 'relative', py: 8 }}>
      {/* Floating Particles Background */}
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden'
        }}
      >
        {[...Array(40)].map((_, i) => {
          const size = Math.random() * 8 + 3
          const isGold = Math.random() > 0.6
          return (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                width: size,
                height: size,
                borderRadius: '50%',
                background: isGold
                  ? `radial-gradient(circle, rgba(255,215,0,${Math.random() * 0.6 + 0.3}) 0%, rgba(212,165,116,${Math.random() * 0.4 + 0.2}) 100%)`
                  : `rgba(212, 165, 116, ${Math.random() * 0.5 + 0.2})`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                boxShadow: isGold ? '0 0 12px rgba(255,215,0,0.4)' : 'none',
              }}
              animate={{
                y: [0, -60, 0],
                x: [0, Math.random() * 40 - 20, 0],
                opacity: [0.3, 0.8, 0.3],
                scale: [1, 1.3, 1],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: Math.random() * 2,
              }}
            />
          )
        })}
      </Box>

      {/* Celebration Confetti (first 5 seconds) */}
      {showConfetti && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            pointerEvents: 'none',
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          {[...Array(50)].map((_, i) => {
            const colors = ['#FFD700', '#10B981', '#8B4513', '#D4A574', '#FF6B6B']
            const color = colors[Math.floor(Math.random() * colors.length)]
            return (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: 10,
                  height: 10,
                  backgroundColor: color,
                  left: `${Math.random() * 100}%`,
                  top: -20,
                  borderRadius: Math.random() > 0.5 ? '50%' : '0%',
                }}
                animate={{
                  y: [0, window.innerHeight + 50],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, Math.random() * 720],
                  opacity: [1, 0.8, 0],
                }}
                transition={{
                  duration: Math.random() * 2 + 2,
                  ease: 'easeOut',
                  delay: Math.random() * 2,
                }}
              />
            )
          })}
        </Box>
      )}

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 2 }}>
        <Stack spacing={4} alignItems="center">

          {/* Success Icon Animation */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', duration: 0.8, delay: 0.2 }}
          >
            <Box
              sx={{
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: alpha('#10B981', 0.15),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '4px solid',
                borderColor: '#10B981',
                boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)',
                position: 'relative'
              }}
            >
              <CheckCircle sx={{ fontSize: 100, color: '#10B981' }} />
              
              {/* Pulsing Ring */}
              <motion.div
                style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '3px solid #10B981',
                }}
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.5, 0, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </Box>
          </motion.div>

          {/* Success Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{ textAlign: 'center' }}
          >
            <Stack spacing={2} alignItems="center">
              <Celebration sx={{ fontSize: 40, color: '#FFD700' }} />
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 'bold',
                  color: '#1F2937',
                  fontFamily: 'serif',
                  textAlign: 'center'
                }}
              >
                Order Placed Successfully!
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', textAlign: 'center', maxWidth: 500 }}>
                Thank you for supporting our artisans. Your order has been confirmed and will be processed shortly.
              </Typography>
            </Stack>
          </motion.div>

          {/* Order Details Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ width: '100%' }}
          >
            <Card
              sx={{
                borderRadius: 4,
                border: '3px solid',
                borderColor: alpha('#FFD700', 0.4),
                boxShadow: '0 10px 40px rgba(255, 215, 0, 0.2)',
                background: 'linear-gradient(135deg, #FFF8DC 0%, #FFE4B5 100%)',
                overflow: 'hidden'
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={3}>
                  {/* Order ID */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Receipt sx={{ color: '#8B4513', fontSize: 28 }} />
                      <Box>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          Order ID
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                          #{orderId}
                        </Typography>
                      </Box>
                    </Stack>
                    <Chip
                      label="Confirmed"
                      sx={{
                        bgcolor: alpha('#10B981', 0.15),
                        color: '#10B981',
                        fontWeight: 'bold',
                        fontSize: '0.9rem',
                        px: 2,
                        border: '2px solid',
                        borderColor: alpha('#10B981', 0.3)
                      }}
                    />
                  </Stack>

                  <Divider sx={{ borderColor: alpha('#D4A574', 0.3) }} />

                  {/* Order Total */}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1F2937' }}>
                      Order Total
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#8B4513' }}>
                      {formatPrice(parseInt(orderTotal))}
                    </Typography>
                  </Stack>

                  <Divider sx={{ borderColor: alpha('#D4A574', 0.3) }} />

                  {/* What's Next */}
                  <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513', mb: 2 }}>
                      What happens next?
                    </Typography>
                    <Stack spacing={2}>
                      {[
                        { icon: <Receipt />, text: 'Order confirmation email sent to your inbox' },
                        { icon: <LocalShipping />, text: 'Your order will be packed and shipped within 2-3 business days' },
                        { icon: <CheckCircle />, text: 'Track your order status in the Orders section' }
                      ].map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + index * 0.1 }}
                        >
                          <Stack direction="row" spacing={2} alignItems="center">
                            <Box
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: alpha('#D4A574', 0.15),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                border: '2px solid',
                                borderColor: alpha('#D4A574', 0.3),
                                color: '#8B4513'
                              }}
                            >
                              {item.icon}
                            </Box>
                            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                              {item.text}
                            </Typography>
                          </Stack>
                        </motion.div>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            style={{ width: '100%' }}
          >
            <Stack spacing={2}>
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={() => navigate('/buyer/orders')}
                startIcon={<Receipt />}
                sx={{
                  bgcolor: '#8B4513',
                  color: 'white',
                  py: 2,
                  borderRadius: 3,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  border: '2px solid #FFD700',
                  boxShadow: '0 8px 30px rgba(139, 69, 19, 0.4)',
                  '&:hover': {
                    bgcolor: '#A0522D',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 12px 40px rgba(139, 69, 19, 0.5)'
                  }
                }}
              >
                View Order Details
              </Button>

              <Stack direction="row" spacing={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/buyer/products')}
                  startIcon={<ShoppingBag />}
                  sx={{
                    color: '#8B4513',
                    borderColor: alpha('#D4A574', 0.5),
                    borderWidth: 2,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: '#D4A574',
                      borderWidth: 2,
                      bgcolor: alpha('#D4A574', 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Continue Shopping
                </Button>

                <Button
                  fullWidth
                  variant="outlined"
                  size="large"
                  onClick={() => navigate('/buyer/dashboard')}
                  startIcon={<Home />}
                  sx={{
                    color: '#8B4513',
                    borderColor: alpha('#D4A574', 0.5),
                    borderWidth: 2,
                    py: 1.5,
                    borderRadius: 3,
                    fontWeight: 'bold',
                    '&:hover': {
                      borderColor: '#D4A574',
                      borderWidth: 2,
                      bgcolor: alpha('#D4A574', 0.1),
                      transform: 'translateY(-2px)'
                    }
                  }}
                >
                  Go to Dashboard
                </Button>
              </Stack>
            </Stack>
          </motion.div>

          {/* Support Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <Card
              sx={{
                borderRadius: 3,
                border: '2px solid',
                borderColor: alpha('#3B82F6', 0.2),
                bgcolor: alpha('#3B82F6', 0.05),
                width: '100%'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                  Need help with your order? Contact our support team at{' '}
                  <Typography
                    component="span"
                    sx={{
                      color: '#3B82F6',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      '&:hover': { textDecoration: 'underline' }
                    }}
                  >
                    support@vanvyapaar.com
                  </Typography>
                </Typography>
              </CardContent>
            </Card>
          </motion.div>

          {/* Thank You Message */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.7 }}
          >
            <Box
              sx={{
                bgcolor: alpha('#FFD700', 0.1),
                borderRadius: 3,
                p: 3,
                border: '2px solid',
                borderColor: alpha('#FFD700', 0.3),
                textAlign: 'center'
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8B4513', mb: 1 }}>
                Thank You for Supporting Artisans! 🙏
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Your purchase directly supports traditional craftspeople and helps preserve cultural heritage.
              </Typography>
            </Box>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  )
}

export default OrderSuccess
