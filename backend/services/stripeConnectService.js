import Stripe from 'stripe'

const stripeSecretKey = process.env.STRIPE_SECRET_KEY || ''

if (!stripeSecretKey) {
  console.warn('⚠️ STRIPE_SECRET_KEY not configured. Stripe Connect features will not work.')
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia'
})

/**
 * 创建 Stripe Connect 账户（Express 类型）
 * Express 账户最简单，Stripe 处理所有合规性要求
 */
export const createConnectAccount = async (tutorId, email, country = 'DE') => {
  try {
    if (!stripeSecretKey) {
      return { success: false, error: 'Stripe is not configured' }
    }

    console.log('🏦 Creating Stripe Connect account for tutor:', tutorId)

    const account = await stripe.accounts.create({
      type: 'express',
      country: country, // 默认德国，可以根据需要修改
      email: email,
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      },
      business_type: 'individual',
      metadata: {
        tutorId: tutorId
      }
    })

    console.log('✅ Stripe Connect account created:', account.id)

    return {
      success: true,
      accountId: account.id
    }
  } catch (error) {
    console.error('❌ Error creating Stripe Connect account:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 创建账户 onboarding 链接
 * 用户点击后会进入 Stripe 的身份验证流程
 */
export const createOnboardingLink = async (accountId, returnUrl, refreshUrl) => {
  try {
    if (!stripeSecretKey) {
      return { success: false, error: 'Stripe is not configured' }
    }

    console.log('🔗 Creating onboarding link for account:', accountId)

    const accountLink = await stripe.accountLinks.create({
      account: accountId,
      refresh_url: refreshUrl,
      return_url: returnUrl,
      type: 'account_onboarding',
    })

    console.log('✅ Onboarding link created')

    return {
      success: true,
      url: accountLink.url
    }
  } catch (error) {
    console.error('❌ Error creating onboarding link:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 检查账户状态
 * 返回账户是否已完成验证，可以接收付款
 */
export const getAccountStatus = async (accountId) => {
  try {
    if (!stripeSecretKey) {
      return { success: false, error: 'Stripe is not configured' }
    }

    const account = await stripe.accounts.retrieve(accountId)

    // 检查账户是否已完成所有必要的验证
    const isVerified = account.charges_enabled && account.payouts_enabled
    const requiresAction = account.requirements?.currently_due?.length > 0
    const pendingVerification = account.requirements?.pending_verification?.length > 0

    return {
      success: true,
      accountId: account.id,
      isVerified: isVerified,
      chargesEnabled: account.charges_enabled,
      payoutsEnabled: account.payouts_enabled,
      requiresAction: requiresAction,
      pendingVerification: pendingVerification,
      requirements: account.requirements,
      email: account.email
    }
  } catch (error) {
    console.error('❌ Error getting account status:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 创建 Dashboard 登录链接
 * 让导师可以查看他们的 Stripe 收益明细
 */
export const createDashboardLink = async (accountId) => {
  try {
    if (!stripeSecretKey) {
      return { success: false, error: 'Stripe is not configured' }
    }

    const loginLink = await stripe.accounts.createLoginLink(accountId)

    return {
      success: true,
      url: loginLink.url
    }
  } catch (error) {
    console.error('❌ Error creating dashboard link:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 创建付款并自动转账给导师（使用 Stripe Connect Direct Charges）
 * 学生付款时直接将导师部分转给导师账户
 */
export const createPaymentWithTransfer = async (
  amount, // 总金额（欧分）
  tutorConnectAccountId, // 导师的 Stripe Connect 账户 ID
  platformFeePercent, // 平台费率（0.20 = 20%）
  description,
  metadata
) => {
  try {
    if (!stripeSecretKey) {
      return { success: false, error: 'Stripe is not configured' }
    }

    // 计算平台费用（欧分）
    const platformFee = Math.round(amount * platformFeePercent)

    console.log('💳 Creating payment with transfer:', {
      totalAmount: amount,
      platformFee: platformFee,
      tutorAmount: amount - platformFee,
      tutorAccountId: tutorConnectAccountId
    })

    // 使用 destination charges - 款项直接进入导师账户，平台收取费用
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: 'eur',
      description: description,
      metadata: metadata,
      // 自动转账到导师账户
      transfer_data: {
        destination: tutorConnectAccountId,
      },
      // 平台收取的费用
      application_fee_amount: platformFee,
    })

    return {
      success: true,
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret
    }
  } catch (error) {
    console.error('❌ Error creating payment with transfer:', error)
    return { success: false, error: error.message }
  }
}

/**
 * 在支付完成后转账给导师（用于延迟转账场景）
 */
export const transferToTutor = async (amount, tutorConnectAccountId, invoiceId) => {
  try {
    if (!stripeSecretKey) {
      return { success: false, error: 'Stripe is not configured' }
    }

    console.log('💸 Transferring to tutor:', {
      amount: amount,
      accountId: tutorConnectAccountId,
      invoiceId: invoiceId
    })

    const transfer = await stripe.transfers.create({
      amount: amount, // 金额（欧分）
      currency: 'eur',
      destination: tutorConnectAccountId,
      metadata: {
        invoiceId: invoiceId
      }
    })

    console.log('✅ Transfer created:', transfer.id)

    return {
      success: true,
      transferId: transfer.id
    }
  } catch (error) {
    console.error('❌ Error transferring to tutor:', error)
    return { success: false, error: error.message }
  }
}

export default {
  createConnectAccount,
  createOnboardingLink,
  getAccountStatus,
  createDashboardLink,
  createPaymentWithTransfer,
  transferToTutor
}
