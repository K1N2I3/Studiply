import express from 'express'
import { createCheckoutSession, verifyPayment, handleWebhook } from '../services/stripeService.js'
import admin from 'firebase-admin'

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID || 'study-hub-1297a',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
      })
    })
  } catch (error) {
    console.error('Firebase Admin initialization error:', error)
  }
}

const db = admin.firestore()

const router = express.Router()

// Create Stripe checkout session
router.post('/stripe/create-checkout-session', async (req, res) => {
  try {
    const { planId, price, userId, userEmail, locale } = req.body

    if (!planId || !price || !userId || !userEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    // Always use English locale
    const result = await createCheckoutSession(planId, price, userId, userEmail)

    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Error creating checkout session:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    })
  }
})

// Verify payment status
router.post('/stripe/verify-payment', async (req, res) => {
  try {
    const { sessionId } = req.body

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      })
    }

    const result = await verifyPayment(sessionId)

    if (result.success) {
      // Update user's subscription status in Firestore
      const { userId, planId } = result
      
      if (userId) {
        try {
          const userRef = db.collection('users').doc(userId)
          const userDoc = await userRef.get()
          
          if (userDoc.exists) {
            await userRef.update({
              hasStudiplyPass: true,
              subscription: planId === 'basic' ? 'basic' : 'pro',
              subscriptionStartDate: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            })
          }
        } catch (firestoreError) {
          console.error('Error updating Firestore:', firestoreError)
          // Don't fail the request if Firestore update fails
        }
      }

      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Error verifying payment:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to verify payment'
    })
  }
})

// Stripe webhook endpoint
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const sig = req.headers['stripe-signature']
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

    if (!webhookSecret) {
      console.error('Stripe webhook secret not configured')
      return res.status(400).send('Webhook secret not configured')
    }

    let event
    try {
      const stripe = (await import('stripe')).default
      const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY || '', {
        apiVersion: '2024-12-18.acacia'
      })
      event = stripeInstance.webhooks.constructEvent(req.body, sig, webhookSecret)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return res.status(400).send(`Webhook Error: ${err.message}`)
    }

    const result = await handleWebhook(event)

    if (result.success && result.userId) {
      // Update user's subscription status in Firestore
      try {
        const userRef = db.collection('users').doc(result.userId)
        const userDoc = await userRef.get()
        
        if (userDoc.exists) {
          await userRef.update({
            hasStudiplyPass: true,
            subscription: result.planId === 'basic' ? 'basic' : 'pro',
            subscriptionStartDate: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        }
      } catch (firestoreError) {
        console.error('Error updating Firestore from webhook:', firestoreError)
      }
    }

    res.json({ received: true })
  } catch (error) {
    console.error('Error handling webhook:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to handle webhook'
    })
  }
})

export default router

