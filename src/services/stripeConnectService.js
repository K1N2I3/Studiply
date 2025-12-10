const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3003/api'

/**
 * 创建 Stripe Connect 账户并开始 onboarding
 */
export const createConnectAccount = async (tutorId, email, country = 'DE') => {
  try {
    console.log('🏦 Creating Stripe Connect account...', { tutorId, email, country })
    
    const response = await fetch(`${API_BASE_URL}/stripe-connect/create-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tutorId,
        email,
        country
      })
    })

    const result = await response.json()
    console.log('🏦 Create account result:', result)

    return result
  } catch (error) {
    console.error('Error creating Stripe Connect account:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}

/**
 * 获取 Stripe Connect 账户状态
 */
export const getConnectStatus = async (tutorId) => {
  try {
    console.log('🔍 Checking Stripe Connect status...', { tutorId })
    
    const response = await fetch(`${API_BASE_URL}/stripe-connect/status/${tutorId}`)
    const result = await response.json()
    
    console.log('🔍 Connect status result:', result)
    
    return result
  } catch (error) {
    console.error('Error getting Stripe Connect status:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}

/**
 * 创建新的 onboarding 链接（用于继续未完成的验证）
 */
export const createOnboardingLink = async (tutorId) => {
  try {
    console.log('🔗 Creating onboarding link...', { tutorId })
    
    const response = await fetch(`${API_BASE_URL}/stripe-connect/onboarding-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tutorId
      })
    })

    const result = await response.json()
    console.log('🔗 Onboarding link result:', result)

    return result
  } catch (error) {
    console.error('Error creating onboarding link:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}

/**
 * 创建 Stripe Dashboard 链接（让导师查看收益明细）
 */
export const createDashboardLink = async (tutorId) => {
  try {
    console.log('📊 Creating dashboard link...', { tutorId })
    
    const response = await fetch(`${API_BASE_URL}/stripe-connect/dashboard-link`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        tutorId
      })
    })

    const result = await response.json()
    console.log('📊 Dashboard link result:', result)

    return result
  } catch (error) {
    console.error('Error creating dashboard link:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}

/**
 * 处理支付后的转账
 */
export const processPayout = async (invoiceId) => {
  try {
    console.log('💸 Processing payout...', { invoiceId })
    
    const response = await fetch(`${API_BASE_URL}/stripe-connect/process-payout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        invoiceId
      })
    })

    const result = await response.json()
    console.log('💸 Payout result:', result)

    return result
  } catch (error) {
    console.error('Error processing payout:', error)
    return {
      success: false,
      error: 'Network error. Please try again.'
    }
  }
}
