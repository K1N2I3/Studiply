import Stripe from 'stripe'

// Initialize Stripe with secret key from environment
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''
const stripeMode = process.env.STRIPE_MODE || (stripeSecretKey.startsWith('sk_test_') ? 'test' : 'live')

if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY not configured. Payment features will not work.')
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia'
})

// Log mode for debugging (only in development)
if (process.env.NODE_ENV !== 'production') {
  console.log(`💳 Stripe initialized in ${stripeMode} mode`)
}

// Create a checkout session for Stripe payment
export const createCheckoutSession = async (planId, price, userId, userEmail) => {
  try {
    if (!stripeSecretKey) {
      return {
        success: false,
        error: 'Stripe is not configured. Please contact support.'
      }
    }
    
    const mode = stripeMode
    console.log(`Creating Stripe checkout session (${mode} mode) with locale: en`)
    
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
      locale: 'en', // Force English locale
      metadata: {
        userId,
        planId
      }
    })
    
    console.log('Stripe session created:', {
      id: session.id,
      locale: session.locale,
      url: session.url
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
        invoiceId: session.metadata?.invoiceId,
        paymentType: session.metadata?.paymentType || 'subscription',
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

// Create a checkout session for tutoring invoice payment
export const createInvoiceCheckoutSession = async (invoiceId, amount, studentId, studentEmail, tutorName, subject) => {
  try {
    if (!stripeSecretKey) {
      return {
        success: false,
        error: 'Stripe is not configured. Please contact support.'
      }
    }
    
    const mode = stripeMode
    console.log(`Creating Invoice Stripe checkout session (${mode} mode)`)
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `Tutoring Session - ${subject}`,
              description: `Session with ${tutorName}`
            },
            unit_amount: Math.round(amount * 100) // Convert to cents
          },
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/student-dashboard?tab=invoices&payment=success&invoice_id=${invoiceId}`,
      cancel_url: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/student-dashboard?tab=invoices&payment=canceled`,
      customer_email: studentEmail,
      locale: 'en',
      metadata: {
        studentId,
        invoiceId,
        paymentType: 'tutoring_invoice'
      }
    })
    
    console.log('Invoice Stripe session created:', {
      id: session.id,
      invoiceId: invoiceId,
      amount: amount,
      url: session.url
    })

    return {
      success: true,
      sessionId: session.id,
      url: session.url
    }
  } catch (error) {
    console.error('Error creating invoice Stripe checkout session:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

// Verify invoice payment
export const verifyInvoicePayment = async (sessionId) => {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId)
    
    if (session.payment_status === 'paid') {
      return {
        success: true,
        session,
        studentId: session.metadata?.studentId,
        invoiceId: session.metadata?.invoiceId
      }
    }
    
    return {
      success: false,
      error: 'Payment not completed'
    }
  } catch (error) {
    console.error('Error verifying invoice payment:', error)
    return {
      success: false,
      error: error.message
    }
  }
}

