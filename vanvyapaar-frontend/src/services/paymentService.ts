import api from '../lib/api'

export interface PaymentOrderResponse {
  success: boolean
  orderId: string
  amount: number
  currency: string
  keyId: string
  message?: string
  error?: string
}

export interface PaymentVerificationRequest {
  razorpayOrderId: string
  razorpayPaymentId: string
  razorpaySignature: string
}

export interface PaymentVerificationResponse {
  success: boolean
  message: string
  payment?: any
  error?: string
}

export const paymentService = {
  // Create Razorpay order
  createOrder: async (buyerId: number, amount: number): Promise<PaymentOrderResponse> => {
    try {
      const response = await api.post('/payment/create-order', {
        buyerId,
        amount,
        currency: 'INR'
      })
      return response.data
    } catch (error: any) {
      console.error('Error creating payment order:', error)
      throw new Error(error.response?.data?.message || 'Failed to create payment order')
    }
  },

  // Handle payment success
  handlePaymentSuccess: async (data: {
    razorpay_order_id: string
    razorpay_payment_id: string
    razorpay_signature: string
  }): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await api.post('/payment/success', data)
      return response.data
    } catch (error: any) {
      console.error('Error handling payment success:', error)
      throw new Error(error.response?.data?.message || 'Payment processing failed')
    }
  },

  // Verify payment
  verifyPayment: async (verificationData: PaymentVerificationRequest): Promise<PaymentVerificationResponse> => {
    try {
      const response = await api.post('/payment/verify', verificationData)
      return response.data
    } catch (error: any) {
      console.error('Error verifying payment:', error)
      throw new Error(error.response?.data?.message || 'Payment verification failed')
    }
  },

  // Handle payment failure
  handlePaymentFailure: async (razorpayOrderId: string, razorpayPaymentId: string, errorMessage: string): Promise<void> => {
    try {
      await api.post('/payment/failure', {
        razorpayOrderId,
        razorpayPaymentId,
        errorMessage
      })
    } catch (error) {
      console.error('Error handling payment failure:', error)
      // Don't throw error, just log it
    }
  },

  // Get payments for buyer
  getBuyerPayments: async (buyerId: number): Promise<any[]> => {
    try {
      const response = await api.get(`/payment/buyer/${buyerId}`)
      return response.data
    } catch (error) {
      console.error('Error fetching payments:', error)
      return []
    }
  }
}

export default paymentService
