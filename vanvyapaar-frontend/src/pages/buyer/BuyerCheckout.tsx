import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Container, Box, Typography, Button, TextField, Card, CardContent,
  Stack, Stepper, Step, StepLabel, Divider, alpha, CircularProgress
} from '@mui/material'
import {
  LocalShipping, Payment, ArrowBack, ArrowForward,
  CreditCard, Person, Phone, Home
} from '@mui/icons-material'
import { useAuthStore } from '../../store/authStore'
import { useCartStore } from '../../store/cartStore'
import buyerService from '../../services/buyerService'
import paymentService from '../../services/paymentService'
import { formatPrice } from '../../lib/utils'
import toast from 'react-hot-toast'
import AnimatedBackground from '../../components/common/AnimatedBackground'
import FloatingElements from '../../components/common/FloatingElements'
import LoadingAnimation from '../../components/common/LoadingAnimation'

declare global {
  interface Window {
    Razorpay: any
  }
}

// Load Razorpay script dynamically in TEST mode
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    // Remove any existing Razorpay script to force fresh load
    const existingScript = document.querySelector('script[src*="checkout.razorpay.com"]')
    if (existingScript) {
      existingScript.remove()
      // Clear the Razorpay object to force reinitialization
      delete window.Razorpay
    }

    const script = document.createElement('script')
    // Add cache-busting timestamp to force fresh load
    script.src = `https://checkout.razorpay.com/v1/checkout.js?t=${Date.now()}`
    script.async = true
    script.onload = () => {
      console.log('✅ Razorpay script loaded successfully')
      resolve(true)
    }
    script.onerror = () => {
      console.error('❌ Failed to load Razorpay script')
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

const steps = ['Shipping Address', 'Payment']

const BuyerCheckout = () => {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { clearCart } = useCartStore()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [processingPayment, setProcessingPayment] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    email: user?.email || '',
    addressLine: '',
    city: '',
    state: '',
    pincode: ''
  })

  useEffect(() => {
    // Force load fresh Razorpay script on mount
    loadRazorpayScript().then((loaded) => {
      if (!loaded) {
        toast.error('Failed to load payment gateway')
      } else {
        console.log('🔥 Razorpay loaded - ready for TEST mode payments')
      }
    })

    if (user) {
      fetchCart()
    } else {
      setLoading(false)
      setError('Please login to continue')
    }
  }, [user])

  const fetchCart = async () => {
    if (!user) return
    try {
      setLoading(true)
      setError(null)
      const items = await buyerService.getCart(user.id)
      setCartItems(Array.isArray(items) ? items : [])
    } catch (error: any) {
      console.error('Error fetching cart:', error)
      setError('Failed to load cart')
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
    const shipping = subtotal > 999 ? 0 : 50
    return { subtotal, shipping, total: subtotal + shipping }
  }

  const handleNext = () => {
    if (activeStep === 0) {
      // Validate address
      if (!address.fullName || !address.phone || !address.addressLine || !address.city || !address.pincode) {
        toast.error('Please fill all address fields')
        return
      }
    }
    setActiveStep((prev) => prev + 1)
  }

  const handleBack = () => {
    setActiveStep((prev) => prev - 1)
  }

  const initializeRazorpay = async () => {
    if (!user) {
      toast.error('Please login to continue')
      return
    }

    // Ensure Razorpay script is loaded
    const scriptLoaded = await loadRazorpayScript()
    if (!scriptLoaded) {
      toast.error('Payment gateway not available. Please refresh the page.')
      return
    }

    try {
      setProcessingPayment(true)
      const { total } = calculateTotal()

      // Create Razorpay order
      const orderResponse = await paymentService.createOrder(user.id, total)

      if (!orderResponse.success) {
        throw new Error(orderResponse.message || 'Failed to create payment order')
      }

      console.log('🔑 Using Razorpay Key:', orderResponse.keyId)
      console.log('💰 Payment Amount:', orderResponse.amount / 100, 'INR')
      console.log('📝 Order ID:', orderResponse.orderId)
      
      // Verify we're using TEST key
      if (!orderResponse.keyId.startsWith('rzp_test_')) {
        console.error('⚠️ WARNING: Not using TEST key! Key:', orderResponse.keyId)
        toast.error('Payment gateway configuration error')
        setProcessingPayment(false)
        return
      }
      
      console.log('✅ TEST MODE CONFIRMED - Key starts with rzp_test_')

      // Initialize Razorpay checkout
      const options = {
        key: orderResponse.keyId, // Verified TEST key
        amount: orderResponse.amount,
        currency: orderResponse.currency,
        name: 'VanVyaapaar',
        description: 'Tribal Crafts Purchase',
        order_id: orderResponse.orderId,
        handler: async function (response: any) {
          await handlePaymentSuccess(response)
        },
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone
        },
        notes: {
          address: `${address.addressLine}, ${address.city}, ${address.state} - ${address.pincode}`
        },
        theme: {
          color: '#D4A574'
        },
        modal: {
          ondismiss: function () {
            setProcessingPayment(false)
            toast.error('Payment cancelled')
          }
        }
      }

      const razorpay = new window.Razorpay(options)

      razorpay.on('payment.failed', async function (response: any) {
        await handlePaymentFailure(response)
      })

      razorpay.open()

    } catch (error: any) {
      console.error('Payment initialization error:', error)
      toast.error(error.message || 'Failed to initialize payment')
      setProcessingPayment(false)
    }
  }

  const handlePaymentSuccess = async (response: any) => {
    try {
      // Call payment success endpoint (includes verification)
      const successResponse = await paymentService.handlePaymentSuccess({
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature
      })

      if (successResponse.success) {
        // Place order
        await buyerService.placeOrder(user!.id)

        // Clear cart
        clearCart()

        toast.success('🎉 Payment successful! Order placed.')
        navigate('/buyer/orders')
      } else {
        throw new Error(successResponse.message || 'Payment verification failed')
      }
    } catch (error: any) {
      console.error('Payment success handler error:', error)
      toast.error(error.message || 'Failed to complete order')
    } finally {
      setProcessingPayment(false)
    }
  }

  const handlePaymentFailure = async (response: any) => {
    try {
      const errorMessage = response.error?.description || 'Payment failed'
      const orderId = response.error?.metadata?.order_id || ''
      const paymentId = response.error?.metadata?.payment_id || ''

      await paymentService.handlePaymentFailure(orderId, paymentId, errorMessage)

      toast.error(errorMessage)
    } catch (error) {
      console.error('Payment failure handler error:', error)
    } finally {
      setProcessingPayment(false)
    }
  }

  const { subtotal, shipping, total } = calculateTotal()

  if (loading) {
    return (
      <LoadingAnimation 
        variant="tribal" 
        size="large" 
        text="Preparing your checkout..." 
        fullScreen={true}
      />
    )
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3, color: 'error.main' }}>{error}</Typography>
        <Button variant="contained" onClick={() => navigate('/buyer/cart')} sx={{ bgcolor: '#10B981' }}>
          Back to Cart
        </Button>
      </Container>
    )
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ mb: 3 }}>Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/buyer/products')} sx={{ bgcolor: '#10B981' }}>
          Continue Shopping
        </Button>
      </Container>
    )
  }

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <AnimatedBackground variant="particles" intensity="light" color="#10B981" />
      <FloatingElements 
        showScrollTop={true}
        quickActions={[
          {
            icon: <ArrowBack />,
            label: 'Back to Cart',
            onClick: () => navigate('/buyer/cart'),
            color: '#10B981'
          }
        ]}
      />
      <Container maxWidth="lg" sx={{ py: 6, position: 'relative', zIndex: 1 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate('/buyer/cart')} sx={{ mb: 3, color: '#10B981' }}>
        Back to Cart
      </Button>

      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, fontFamily: 'serif' }}>
        Checkout
      </Typography>

      <Stepper activeStep={activeStep} sx={{ mb: 6 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 4 }}>
        <Box>
          {activeStep === 0 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <LocalShipping sx={{ fontSize: 32, color: '#10B981' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Shipping Address</Typography>
                  </Stack>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={address.fullName}
                      onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                      InputProps={{ startAdornment: <Person sx={{ mr: 1, color: '#10B981' }} /> }}
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label="Phone"
                        value={address.phone}
                        onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                        InputProps={{ startAdornment: <Phone sx={{ mr: 1, color: '#10B981' }} /> }}
                      />
                      <TextField
                        fullWidth
                        label="Email"
                        value={address.email}
                        onChange={(e) => setAddress({ ...address, email: e.target.value })}
                      />
                    </Stack>
                    <TextField
                      fullWidth
                      label="Address"
                      value={address.addressLine}
                      onChange={(e) => setAddress({ ...address, addressLine: e.target.value })}
                      InputProps={{ startAdornment: <Home sx={{ mr: 1, color: '#10B981' }} /> }}
                    />
                    <Stack direction="row" spacing={2}>
                      <TextField
                        fullWidth
                        label="City"
                        value={address.city}
                        onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="State"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                      />
                      <TextField
                        fullWidth
                        label="Pincode"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                      />
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Payment sx={{ fontSize: 32, color: '#10B981' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Payment Method</Typography>
                  </Stack>
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <CreditCard sx={{ fontSize: 80, color: alpha('#10B981', 0.3), mb: 2 }} />
                    <Typography variant="h6" sx={{ mb: 2 }}>Secure Payment with Razorpay</Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                      Pay securely using Credit/Debit Card, UPI, Net Banking, or Wallets
                    </Typography>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={initializeRazorpay}
                      disabled={processingPayment}
                      startIcon={processingPayment ? <CircularProgress size={20} /> : <Payment />}
                      sx={{
                        bgcolor: '#10B981',
                        px: 6,
                        py: 2,
                        fontSize: '1.1rem',
                        '&:hover': { bgcolor: '#059669' }
                      }}
                    >
                      {processingPayment ? 'Processing...' : `Pay ${formatPrice(total)}`}
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Stack direction="row" justifyContent="space-between" sx={{ mt: 4 }}>
            <Button
              disabled={activeStep === 0}
              onClick={handleBack}
              startIcon={<ArrowBack />}
              sx={{ color: '#10B981' }}
            >
              Back
            </Button>
            {activeStep < steps.length - 1 && (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForward />}
                sx={{ bgcolor: '#10B981', '&:hover': { bgcolor: '#059669' } }}
              >
                Continue
              </Button>
            )}
          </Stack>
        </Box>

        {/* Order Summary */}
        <Box>
          <Card sx={{ borderRadius: 3, position: 'sticky', top: 24 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 3 }}>Order Summary</Typography>
              <Stack spacing={2} sx={{ mb: 3 }}>
                {cartItems.map((item) => (
                  <Box key={item.id}>
                    <Stack direction="row" justifyContent="space-between">
                      <Typography variant="body2">{item.product.name} x {item.quantity}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formatPrice(item.product.price * item.quantity)}
                      </Typography>
                    </Stack>
                  </Box>
                ))}
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Subtotal</Typography>
                  <Typography variant="body2">{formatPrice(subtotal)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2">Shipping</Typography>
                  <Typography variant="body2">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</Typography>
                </Stack>
              </Stack>
              <Divider sx={{ my: 2 }} />
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Total</Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#10B981' }}>
                  {formatPrice(total)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Container>
    </Box>
  )
}

export default BuyerCheckout
