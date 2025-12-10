import express from 'express'
import { createCheckoutSession, verifyPayment, handleWebhook, createInvoiceCheckoutSession, verifyInvoicePayment } from '../services/stripeService.js'
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

// Create Stripe checkout session for invoice payment
router.post('/stripe/create-invoice-checkout', async (req, res) => {
  try {
    const { invoiceId, amount, studentId, studentEmail, tutorName, subject } = req.body

    if (!invoiceId || !amount || !studentId || !studentEmail) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields'
      })
    }

    const result = await createInvoiceCheckoutSession(
      invoiceId, 
      amount, 
      studentId, 
      studentEmail, 
      tutorName || 'Tutor',
      subject || 'Tutoring Session'
    )

    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Error creating invoice checkout session:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create checkout session'
    })
  }
})

// Verify invoice payment status
router.post('/stripe/verify-invoice-payment', async (req, res) => {
  try {
    const { sessionId } = req.body

    if (!sessionId) {
      return res.status(400).json({
        success: false,
        error: 'Session ID is required'
      })
    }

    const result = await verifyInvoicePayment(sessionId)

    if (result.success) {
      // Update invoice status in Firestore
      const { invoiceId } = result
      
      if (invoiceId) {
        try {
          const invoiceRef = db.collection('invoices').doc(invoiceId)
          const invoiceDoc = await invoiceRef.get()
          
          if (invoiceDoc.exists) {
            const invoiceData = invoiceDoc.data()
            
            // Update invoice status
            await invoiceRef.update({
              status: 'paid',
              paidAt: new Date().toISOString(),
              stripeSessionId: sessionId,
              updatedAt: new Date().toISOString()
            })
            
            // Update tutor earnings
            const tutorStatsRef = db.collection('tutorStats').doc(invoiceData.tutorId)
            const tutorStatsDoc = await tutorStatsRef.get()
            
            if (tutorStatsDoc.exists) {
              const currentStats = tutorStatsDoc.data()
              await tutorStatsRef.update({
                totalEarnings: (currentStats.totalEarnings || 0) + (invoiceData.tutorEarnings || 0),
                updatedAt: new Date().toISOString()
              })
            } else {
              await tutorStatsRef.set({
                totalEarnings: invoiceData.tutorEarnings || 0,
                pendingEarnings: 0,
                totalSessions: 1,
                totalRating: 0,
                ratingCount: 0,
                completedSessions: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              })
            }
            
            console.log('✅ Invoice payment processed:', invoiceId)
          }
        } catch (firestoreError) {
          console.error('Error updating Firestore:', firestoreError)
        }
      }

      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Error verifying invoice payment:', error)
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
      console.error('⚠️ STRIPE_WEBHOOK_SECRET not configured. Webhook verification will fail.')
      console.error('📝 Please set up webhook in Stripe Dashboard and add the signing secret to environment variables.')
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

    if (result.success) {
      // Handle subscription payments
      if (result.paymentType === 'subscription' && result.userId) {
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
      
      // Handle invoice payments
      if (result.paymentType === 'tutoring_invoice' && result.invoiceId) {
        try {
          const invoiceRef = db.collection('invoices').doc(result.invoiceId)
          const invoiceDoc = await invoiceRef.get()
          
          if (invoiceDoc.exists) {
            const invoiceData = invoiceDoc.data()
            
            await invoiceRef.update({
              status: 'paid',
              paidAt: new Date().toISOString(),
              stripeSessionId: result.sessionId,
              updatedAt: new Date().toISOString()
            })
            
            // Update tutor earnings
            const tutorStatsRef = db.collection('tutorStats').doc(invoiceData.tutorId)
            const tutorStatsDoc = await tutorStatsRef.get()
            
            if (tutorStatsDoc.exists) {
              const currentStats = tutorStatsDoc.data()
              await tutorStatsRef.update({
                totalEarnings: (currentStats.totalEarnings || 0) + (invoiceData.tutorEarnings || 0),
                updatedAt: new Date().toISOString()
              })
            }
            
            console.log('✅ Invoice payment processed via webhook:', result.invoiceId)
          }
        } catch (firestoreError) {
          console.error('Error updating invoice from webhook:', firestoreError)
        }
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

