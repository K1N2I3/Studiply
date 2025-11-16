import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-12-18.acacia'
})

// Create a checkout session for Stripe payment
export const createCheckoutSession = async (planId, price, userId, userEmail) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: planId === 'basic' ? 'Studiply Pass' : 'Studiply Pass Pro',
              description: planId === 'basic' 
                ? 'Essential Learning Plan' 
                : 'Advanced Learning Plan'
            },
            unit_amount: Math.round(price * 100) // Convert to cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/purchase?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/purchase?canceled=true`,
      customer_email: userEmail,
      locale: 'en', // Force English - Stripe may override based on IP, but this should help
      payment_method_options: {
        card: {
          request_three_d_secure: 'automatic'
        }
      },
      metadata: {
        userId,
        planId,
        locale: 'en' // Also store in metadata
      }
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url
    }
  } catch (error) {
    console.error('Error creating Stripe checkout session:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Verify payment and retrieve session
export const verifyPayment = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === 'paid') {
      return {
        success: true,
        session,
        userId: session.metadata?.userId,
        planId: session.metadata?.planId
      }
    }
    
    return {
      success: false,
      error: 'Payment not completed'
    }
  } catch (error) {
    console.error('Error verifying Stripe payment:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Handle Stripe webhook
export const handleWebhook = async (event) => {
  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      return {
        success: true,
        userId: session.metadata?.userId,
        planId: session.metadata?.planId,
        sessionId: session.id
      }
    }
    
    return {
      success: false,
      error: 'Unhandled event type'
    }
  } catch (error) {
    console.error('Error handling Stripe webhook:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

