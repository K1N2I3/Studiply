const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

// Create Stripe checkout session
export const createStripeCheckout = async (planId, price, userId, userEmail) => {
  try {
    // Force English locale for Stripe checkout
    const locale = 'en'
    
    console.log('Creating Stripe checkout session...', { planId, price, userId, userEmail, locale, API_BASE_URL })
    
    const response = await fetch(`${API_BASE_URL}/payment/stripe/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        planId,
        price,
        userId,
        userEmail,
        locale: locale // Send browser language to backend
      })
    })

    console.log('Response status:', response.status)
    const result = await response.json()
    console.log('Response result:', result)

    if (result.success) {
      console.log('Checkout session created successfully, redirecting to:', result.url)
      return {
        success: true,
        sessionId: result.sessionId,
        url: result.url
      }
    } else {
      console.error('Failed to create checkout session:', result.error)
      return {
        success: false,
        error: result.error || 'Failed to create checkout session'
      }
    }
  } catch (error) {
    console.error('Error creating Stripe checkout:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}

// Verify payment status
export const verifyPaymentStatus = async (sessionId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payment/stripe/verify-payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId
      })
    })

    const result = await response.json()

    if (result.success) {
      return {
        success: true,
        userId: result.userId,
        planId: result.planId
      }
    } else {
      return {
        success: false,
        error: result.error || 'Payment verification failed'
      }
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}

