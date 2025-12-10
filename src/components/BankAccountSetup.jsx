import React, { useState, useEffect } from 'react'
import { 
  CreditCard, 
  CheckCircle, 
  AlertCircle, 
  Loader, 
  ExternalLink,
  Shield,
  Building2,
  ArrowRight,
  RefreshCw
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { 
  createConnectAccount, 
  getConnectStatus, 
  createOnboardingLink,
  createDashboardLink 
} from '../services/stripeConnectService'

const BankAccountSetup = ({ onStatusChange }) => {
  const { isDark } = useTheme()
  const { user } = useSimpleAuth()
  const { showSuccess, showError } = useNotification()
  
  const [status, setStatus] = useState('loading') // loading, not_connected, pending, verified
  const [isProcessing, setIsProcessing] = useState(false)
  const [accountDetails, setAccountDetails] = useState(null)

  // 加载账户状态
  useEffect(() => {
    loadStatus()
  }, [user?.id])

  const loadStatus = async () => {
    if (!user?.id) return
    
    setStatus('loading')
    
    try {
      const result = await getConnectStatus(user.id)
      
      if (result.success) {
        if (!result.hasAccount) {
          setStatus('not_connected')
        } else if (result.isVerified) {
          setStatus('verified')
          setAccountDetails(result)
          if (onStatusChange) onStatusChange('verified')
        } else {
          setStatus('pending')
          setAccountDetails(result)
          if (onStatusChange) onStatusChange('pending')
        }
      } else {
        setStatus('not_connected')
      }
    } catch (error) {
      console.error('Error loading status:', error)
      setStatus('not_connected')
    }
  }

  // 开始银行卡绑定流程
  const handleStartSetup = async () => {
    if (!user?.id || !user?.email) {
      showError('User information not available', 5000, 'Error')
      return
    }
    
    setIsProcessing(true)
    
    try {
      const result = await createConnectAccount(user.id, user.email)
      
      if (result.success) {
        if (result.isVerified) {
          setStatus('verified')
          showSuccess('Bank account already verified!', 5000, 'Success')
          if (onStatusChange) onStatusChange('verified')
        } else if (result.onboardingUrl) {
          // 跳转到 Stripe 完成验证
          window.location.href = result.onboardingUrl
        }
      } else {
        showError(result.error || 'Failed to start setup', 5000, 'Error')
      }
    } catch (error) {
      console.error('Error starting setup:', error)
      showError('An error occurred. Please try again.', 5000, 'Error')
    } finally {
      setIsProcessing(false)
    }
  }

  // 继续未完成的验证
  const handleContinueSetup = async () => {
    if (!user?.id) return
    
    setIsProcessing(true)
    
    try {
      const result = await createOnboardingLink(user.id)
      
      if (result.success && result.onboardingUrl) {
        window.location.href = result.onboardingUrl
      } else {
        showError(result.error || 'Failed to create link', 5000, 'Error')
      }
    } catch (error) {
      console.error('Error creating onboarding link:', error)
      showError('An error occurred. Please try again.', 5000, 'Error')
    } finally {
      setIsProcessing(false)
    }
  }

  // 打开 Stripe Dashboard
  const handleOpenDashboard = async () => {
    if (!user?.id) return
    
    setIsProcessing(true)
    
    try {
      const result = await createDashboardLink(user.id)
      
      if (result.success && result.dashboardUrl) {
        window.open(result.dashboardUrl, '_blank')
      } else {
        showError(result.error || 'Failed to open dashboard', 5000, 'Error')
      }
    } catch (error) {
      console.error('Error opening dashboard:', error)
      showError('An error occurred. Please try again.', 5000, 'Error')
    } finally {
      setIsProcessing(false)
    }
  }

  // Loading 状态
  if (status === 'loading') {
    return (
      <div className={`rounded-2xl border p-6 ${
        isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
      }`}>
        <div className="flex items-center justify-center py-8">
          <Loader className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border overflow-hidden ${
      isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-white'
    }`}>
      {/* Header */}
      <div className={`p-6 ${
        status === 'verified' 
          ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20' 
          : status === 'pending'
            ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20'
            : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-xl ${
              status === 'verified' 
                ? 'bg-emerald-500' 
                : status === 'pending'
                  ? 'bg-orange-500'
                  : 'bg-purple-500'
            }`}>
              {status === 'verified' ? (
                <CheckCircle className="w-6 h-6 text-white" />
              ) : status === 'pending' ? (
                <AlertCircle className="w-6 h-6 text-white" />
              ) : (
                <Building2 className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Bank Account Setup
              </h3>
              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                {status === 'verified' 
                  ? 'Your bank account is connected' 
                  : status === 'pending'
                    ? 'Verification in progress'
                    : 'Connect your bank to receive payments'}
              </p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
            status === 'verified'
              ? 'bg-emerald-500/20 text-emerald-500'
              : status === 'pending'
                ? 'bg-orange-500/20 text-orange-500'
                : 'bg-slate-500/20 text-slate-500'
          }`}>
            {status === 'verified' ? 'Verified' : status === 'pending' ? 'Pending' : 'Not Connected'}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {status === 'not_connected' && (
          <>
            {/* Info Box */}
            <div className={`rounded-xl p-4 mb-6 ${
              isDark ? 'bg-white/5' : 'bg-slate-50'
            }`}>
              <div className="flex items-start gap-3">
                <Shield className={`w-5 h-5 mt-0.5 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Secure Payment Processing
                  </p>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                    We use Stripe to securely process payments. Your bank details are never stored on our servers.
                  </p>
                </div>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-3 mb-6">
              {[
                'Receive payments directly to your bank account',
                'Automatic payouts after each session',
                'View detailed earnings reports',
                'Secure and compliant payment processing'
              ].map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`} />
                  <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>

            {/* Setup Button */}
            <button
              onClick={handleStartSetup}
              disabled={isProcessing}
              className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 hover:shadow-xl hover:-translate-y-0.5'
              } text-white`}
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Connect Bank Account
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </>
        )}

        {status === 'pending' && (
          <>
            {/* Warning Box */}
            <div className={`rounded-xl p-4 mb-6 border ${
              isDark 
                ? 'bg-orange-500/10 border-orange-500/30' 
                : 'bg-orange-50 border-orange-200'
            }`}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 text-orange-500" />
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-orange-300' : 'text-orange-700'}`}>
                    Verification Required
                  </p>
                  <p className={`text-sm ${isDark ? 'text-orange-300/70' : 'text-orange-600'}`}>
                    Please complete the verification process to start receiving payments. This usually takes a few minutes.
                  </p>
                </div>
              </div>
            </div>

            {/* Continue Button */}
            <button
              onClick={handleContinueSetup}
              disabled={isProcessing}
              className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 hover:shadow-xl hover:-translate-y-0.5'
              } text-white mb-3`}
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Continue Verification
                  <ExternalLink className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Refresh Button */}
            <button
              onClick={loadStatus}
              className={`w-full py-2.5 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                isDark 
                  ? 'bg-white/10 text-white/80 hover:bg-white/20' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Refresh Status
            </button>
          </>
        )}

        {status === 'verified' && (
          <>
            {/* Success Box */}
            <div className={`rounded-xl p-4 mb-6 border ${
              isDark 
                ? 'bg-emerald-500/10 border-emerald-500/30' 
                : 'bg-emerald-50 border-emerald-200'
            }`}>
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 mt-0.5 text-emerald-500" />
                <div>
                  <p className={`text-sm font-medium mb-1 ${isDark ? 'text-emerald-300' : 'text-emerald-700'}`}>
                    Ready to Receive Payments
                  </p>
                  <p className={`text-sm ${isDark ? 'text-emerald-300/70' : 'text-emerald-600'}`}>
                    Your bank account is verified. Payments will be automatically transferred after each completed session.
                  </p>
                </div>
              </div>
            </div>

            {/* Dashboard Button */}
            <button
              onClick={handleOpenDashboard}
              disabled={isProcessing}
              className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                isProcessing
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl hover:-translate-y-0.5'
              } text-white`}
            >
              {isProcessing ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Opening...
                </>
              ) : (
                <>
                  View Stripe Dashboard
                  <ExternalLink className="w-5 h-5" />
                </>
              )}
            </button>
          </>
        )}
      </div>

      {/* Footer */}
      <div className={`px-6 py-4 border-t ${
        isDark ? 'border-white/10 bg-white/5' : 'border-slate-100 bg-slate-50'
      }`}>
        <div className="flex items-center justify-center gap-2">
          <Shield className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            Powered by Stripe • Bank-level security
          </span>
        </div>
      </div>
    </div>
  )
}

export default BankAccountSetup

