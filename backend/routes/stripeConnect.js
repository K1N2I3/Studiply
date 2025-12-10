import express from 'express'
import admin from 'firebase-admin'
import {
  createConnectAccount,
  createOnboardingLink,
  getAccountStatus,
  createDashboardLink,
  transferToTutor
} from '../services/stripeConnectService.js'

const router = express.Router()

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

/**
 * 创建 Stripe Connect 账户并开始 onboarding
 * POST /api/stripe-connect/create-account
 */
router.post('/create-account', async (req, res) => {
  try {
    const { tutorId, email, country } = req.body

    if (!tutorId || !email) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: tutorId and email'
      })
    }

    // 检查导师是否已有 Stripe Connect 账户
    const tutorRef = db.collection('users').doc(tutorId)
    const tutorDoc = await tutorRef.get()

    if (!tutorDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      })
    }

    const tutorData = tutorDoc.data()

    // 如果已有账户，直接返回
    if (tutorData.stripeConnectAccountId) {
      console.log('📌 Tutor already has Stripe Connect account:', tutorData.stripeConnectAccountId)
      
      // 检查账户状态
      const statusResult = await getAccountStatus(tutorData.stripeConnectAccountId)
      
      if (statusResult.success && statusResult.isVerified) {
        return res.json({
          success: true,
          accountId: tutorData.stripeConnectAccountId,
          isVerified: true,
          message: 'Account already verified'
        })
      }
      
      // 账户存在但未完成验证，创建新的 onboarding 链接
      const onboardingResult = await createOnboardingLink(
        tutorData.stripeConnectAccountId,
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tutor-dashboard?stripe=complete`,
        `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tutor-dashboard?stripe=refresh`
      )

      if (onboardingResult.success) {
        return res.json({
          success: true,
          accountId: tutorData.stripeConnectAccountId,
          onboardingUrl: onboardingResult.url,
          isVerified: false
        })
      }
    }

    // 创建新的 Stripe Connect 账户
    const accountResult = await createConnectAccount(tutorId, email, country || 'DE')

    if (!accountResult.success) {
      return res.status(400).json(accountResult)
    }

    // 保存账户 ID 到 Firestore
    await tutorRef.update({
      stripeConnectAccountId: accountResult.accountId,
      stripeConnectStatus: 'pending',
      updatedAt: new Date().toISOString()
    })

    // 创建 onboarding 链接
    const onboardingResult = await createOnboardingLink(
      accountResult.accountId,
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tutor-dashboard?stripe=complete`,
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tutor-dashboard?stripe=refresh`
    )

    if (!onboardingResult.success) {
      return res.status(400).json(onboardingResult)
    }

    res.json({
      success: true,
      accountId: accountResult.accountId,
      onboardingUrl: onboardingResult.url,
      isVerified: false
    })
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create Stripe Connect account'
    })
  }
})

/**
 * 获取账户状态
 * GET /api/stripe-connect/status/:tutorId
 */
router.get('/status/:tutorId', async (req, res) => {
  try {
    const { tutorId } = req.params

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        error: 'Tutor ID is required'
      })
    }

    // 获取导师数据
    const tutorRef = db.collection('users').doc(tutorId)
    const tutorDoc = await tutorRef.get()

    if (!tutorDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      })
    }

    const tutorData = tutorDoc.data()

    if (!tutorData.stripeConnectAccountId) {
      return res.json({
        success: true,
        hasAccount: false,
        isVerified: false,
        message: 'No Stripe Connect account found'
      })
    }

    // 获取 Stripe 账户状态
    const statusResult = await getAccountStatus(tutorData.stripeConnectAccountId)

    if (!statusResult.success) {
      return res.status(400).json(statusResult)
    }

    // 更新 Firestore 中的状态
    const newStatus = statusResult.isVerified ? 'verified' : 'pending'
    if (tutorData.stripeConnectStatus !== newStatus) {
      await tutorRef.update({
        stripeConnectStatus: newStatus,
        updatedAt: new Date().toISOString()
      })
    }

    res.json({
      success: true,
      hasAccount: true,
      accountId: tutorData.stripeConnectAccountId,
      isVerified: statusResult.isVerified,
      chargesEnabled: statusResult.chargesEnabled,
      payoutsEnabled: statusResult.payoutsEnabled,
      requiresAction: statusResult.requiresAction,
      pendingVerification: statusResult.pendingVerification
    })
  } catch (error) {
    console.error('Error getting Stripe Connect status:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to get account status'
    })
  }
})

/**
 * 创建新的 onboarding 链接（用于继续未完成的验证）
 * POST /api/stripe-connect/onboarding-link
 */
router.post('/onboarding-link', async (req, res) => {
  try {
    const { tutorId } = req.body

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        error: 'Tutor ID is required'
      })
    }

    // 获取导师数据
    const tutorRef = db.collection('users').doc(tutorId)
    const tutorDoc = await tutorRef.get()

    if (!tutorDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      })
    }

    const tutorData = tutorDoc.data()

    if (!tutorData.stripeConnectAccountId) {
      return res.status(400).json({
        success: false,
        error: 'No Stripe Connect account found. Please create an account first.'
      })
    }

    // 创建 onboarding 链接
    const onboardingResult = await createOnboardingLink(
      tutorData.stripeConnectAccountId,
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tutor-dashboard?stripe=complete`,
      `${process.env.FRONTEND_URL || 'http://localhost:5173'}/tutor-dashboard?stripe=refresh`
    )

    if (!onboardingResult.success) {
      return res.status(400).json(onboardingResult)
    }

    res.json({
      success: true,
      onboardingUrl: onboardingResult.url
    })
  } catch (error) {
    console.error('Error creating onboarding link:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create onboarding link'
    })
  }
})

/**
 * 创建 Stripe Dashboard 链接（让导师查看收益明细）
 * POST /api/stripe-connect/dashboard-link
 */
router.post('/dashboard-link', async (req, res) => {
  try {
    const { tutorId } = req.body

    if (!tutorId) {
      return res.status(400).json({
        success: false,
        error: 'Tutor ID is required'
      })
    }

    // 获取导师数据
    const tutorRef = db.collection('users').doc(tutorId)
    const tutorDoc = await tutorRef.get()

    if (!tutorDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      })
    }

    const tutorData = tutorDoc.data()

    if (!tutorData.stripeConnectAccountId) {
      return res.status(400).json({
        success: false,
        error: 'No Stripe Connect account found'
      })
    }

    // 检查账户是否已验证
    const statusResult = await getAccountStatus(tutorData.stripeConnectAccountId)
    
    if (!statusResult.success || !statusResult.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Account is not verified. Please complete the verification process first.'
      })
    }

    // 创建 Dashboard 链接
    const dashboardResult = await createDashboardLink(tutorData.stripeConnectAccountId)

    if (!dashboardResult.success) {
      return res.status(400).json(dashboardResult)
    }

    res.json({
      success: true,
      dashboardUrl: dashboardResult.url
    })
  } catch (error) {
    console.error('Error creating dashboard link:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to create dashboard link'
    })
  }
})

/**
 * 处理支付后的转账（当学生支付账单后调用）
 * POST /api/stripe-connect/process-payout
 */
router.post('/process-payout', async (req, res) => {
  try {
    const { invoiceId } = req.body

    if (!invoiceId) {
      return res.status(400).json({
        success: false,
        error: 'Invoice ID is required'
      })
    }

    // 获取账单数据
    const invoiceRef = db.collection('invoices').doc(invoiceId)
    const invoiceDoc = await invoiceRef.get()

    if (!invoiceDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Invoice not found'
      })
    }

    const invoiceData = invoiceDoc.data()

    // 检查账单状态
    if (invoiceData.status !== 'paid') {
      return res.status(400).json({
        success: false,
        error: 'Invoice is not paid'
      })
    }

    // 检查是否已经转账
    if (invoiceData.payoutCompleted) {
      return res.json({
        success: true,
        message: 'Payout already completed',
        transferId: invoiceData.transferId
      })
    }

    // 获取导师的 Stripe Connect 账户
    const tutorRef = db.collection('users').doc(invoiceData.tutorId)
    const tutorDoc = await tutorRef.get()

    if (!tutorDoc.exists) {
      return res.status(404).json({
        success: false,
        error: 'Tutor not found'
      })
    }

    const tutorData = tutorDoc.data()

    if (!tutorData.stripeConnectAccountId) {
      return res.status(400).json({
        success: false,
        error: 'Tutor has not connected their bank account'
      })
    }

    // 检查导师账户是否已验证
    const statusResult = await getAccountStatus(tutorData.stripeConnectAccountId)
    
    if (!statusResult.success || !statusResult.isVerified) {
      return res.status(400).json({
        success: false,
        error: 'Tutor account is not verified'
      })
    }

    // 转账金额（导师收入，欧分）
    const amountInCents = Math.round((invoiceData.tutorEarnings || 0) * 100)

    if (amountInCents <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid transfer amount'
      })
    }

    // 执行转账
    const transferResult = await transferToTutor(
      amountInCents,
      tutorData.stripeConnectAccountId,
      invoiceId
    )

    if (!transferResult.success) {
      return res.status(400).json(transferResult)
    }

    // 更新账单记录
    await invoiceRef.update({
      payoutCompleted: true,
      transferId: transferResult.transferId,
      payoutAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    console.log('✅ Payout completed for invoice:', invoiceId)

    res.json({
      success: true,
      transferId: transferResult.transferId,
      amount: invoiceData.tutorEarnings
    })
  } catch (error) {
    console.error('Error processing payout:', error)
    res.status(500).json({
      success: false,
      error: 'Failed to process payout'
    })
  }
})

export default router
