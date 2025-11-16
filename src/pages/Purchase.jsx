import React, { useState, useEffect } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Crown, 
  Star, 
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Rocket,
  Gift,
  Users,
  Trophy,
  X,
  ChevronRight,
  Infinity,
  BookOpen,
  Target,
  TrendingUp,
  Loader
} from 'lucide-react'
import { createStripeCheckout, verifyPaymentStatus } from '../services/paymentService'
import { useNotification } from '../contexts/NotificationContext'
import { db } from '../firebase/config'
import { doc, updateDoc } from 'firebase/firestore'

const Purchase = () => {
  const { user, updateUser } = useSimpleAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { showSuccess, showError } = useNotification()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Check if user is admin (for test mode)
  const isAdmin = user?.email === 'studiply.email@gmail.com'
  
  // Test mode toggle (admin only, persisted in localStorage)
  const [isTestMode, setIsTestMode] = useState(() => {
    if (isAdmin) {
      const saved = localStorage.getItem('studiply-test-mode')
      return saved === 'true'
    }
    return false
  })
  
  // Update localStorage when test mode changes
  useEffect(() => {
    if (isAdmin) {
      localStorage.setItem('studiply-test-mode', isTestMode.toString())
    }
  }, [isTestMode, isAdmin])

  const plans = [
    {
      id: 'basic',
      name: 'Studiply Pass',
      tagline: 'Perfect for getting started',
      price: 8.99,
      originalPrice: 17.99,
      period: 'month',
      icon: Star,
      gradient: 'from-amber-500 via-orange-500 to-red-500',
      bgGradient: 'from-amber-500/10 via-orange-500/10 to-red-500/10',
      borderColor: 'border-amber-400/50',
      features: [
        'Unlimited video calls',
        'Exclusive study badges',
        'Priority customer support',
        'Monthly free courses',
        'Study progress tracking',
        'Personalized study plans',
        'Ad-free experience',
        'Basic analytics'
      ],
      popular: false
    },
    {
      id: 'pro',
      name: 'Studiply Pass Pro',
      tagline: 'For serious learners',
      price: 17.99,
      originalPrice: 35.99,
      period: 'month',
      icon: Crown,
      gradient: 'from-purple-500 via-pink-500 to-rose-500',
      bgGradient: 'from-purple-500/10 via-pink-500/10 to-rose-500/10',
      borderColor: 'border-purple-400/50',
      features: [
        'Everything in Studiply Pass',
        'Unlimited 1-on-1 tutoring',
        'Exclusive tutor matching',
        'Advanced learning analytics',
        'Priority booking slots',
        'Exclusive study community',
        'Custom learning paths',
        '24/7 dedicated support',
        'Early access to new features',
        'AI-powered study coach'
      ],
      popular: true
    }
  ]

  const benefits = [
    { icon: Zap, title: 'Faster Learning', description: 'Accelerate your progress with premium tools' },
    { icon: Shield, title: 'Priority Support', description: 'Get help when you need it, 24/7' },
    { icon: Rocket, title: 'Early Access', description: 'Try new features before everyone else' },
    { icon: Trophy, title: 'Exclusive Content', description: 'Access member-only courses and materials' }
  ]

  // Check for payment success/cancel in URL
  useEffect(() => {
    const success = searchParams.get('success')
    const canceled = searchParams.get('canceled')
    const sessionId = searchParams.get('session_id')
    const hasProcessed = sessionStorage.getItem('payment-processed')

    // Prevent duplicate processing
    if (hasProcessed) {
      return
    }

    if (success && sessionId) {
      // Mark as processed
      sessionStorage.setItem('payment-processed', 'true')
      
      // Verify payment
      verifyPaymentStatus(sessionId).then(result => {
        if (result.success) {
          showSuccess('Payment successful! Your Studiply Pass has been activated.', 5000, 'Payment Success')
          // Reload user data to reflect subscription change
          setTimeout(() => {
            window.location.reload()
          }, 2000)
        } else {
          showError('Payment verification failed. Please contact support.', 5000, 'Payment Error')
          sessionStorage.removeItem('payment-processed')
        }
      }).catch(error => {
        console.error('Payment verification error:', error)
        sessionStorage.removeItem('payment-processed')
      })
    } else if (canceled) {
      // Mark as processed
      sessionStorage.setItem('payment-processed', 'true')
      showError('Payment was canceled.', 3000, 'Payment Canceled')
      
      // Clear after showing notification
      setTimeout(() => {
        sessionStorage.removeItem('payment-processed')
      }, 3000)
    }
  }, [searchParams]) // Remove showSuccess and showError from dependencies

  // Test mode: Directly activate subscription without Stripe (admin only)
  const handleTestActivation = async (plan) => {
    if (!user || !isAdmin) {
      showError('Test mode is only available for administrators', 3000, 'Access Denied')
      return
    }

    setIsProcessing(true)

    try {
      // Directly update user subscription in Firestore
      const userRef = doc(db, 'users', user.id)
      await updateDoc(userRef, {
        hasStudiplyPass: true,
        subscription: plan.id === 'basic' ? 'basic' : 'pro',
        subscriptionStartDate: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })

      // Update user context
      if (updateUser) {
        updateUser({
          ...user,
          hasStudiplyPass: true,
          subscription: plan.id === 'basic' ? 'basic' : 'pro'
        })
      }

      showSuccess(`Test mode: ${plan.name} activated successfully!`, 5000, 'Test Activation')
      
      // Reload after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Test activation error:', error)
      showError('Failed to activate subscription in test mode', 5000, 'Test Error')
      setIsProcessing(false)
    }
  }

  const handlePayment = async (plan) => {
    if (!user) {
      showError('Please log in to purchase a plan', 3000, 'Login Required')
      return
    }

    // If test mode is enabled and user is admin, use test activation
    if (isTestMode && isAdmin) {
      handleTestActivation(plan)
      return
    }

    console.log('handlePayment called for plan:', plan)
    setIsProcessing(true)

    try {
      const result = await createStripeCheckout(
        plan.id,
        plan.price,
        user.id,
        user.email
      )

      console.log('createStripeCheckout result:', result)

      if (result.success && result.url) {
        console.log('Redirecting to Stripe checkout:', result.url)
        // Redirect to Stripe checkout
        window.location.href = result.url
      } else {
        console.error('Failed to create checkout session:', result.error)
        showError(result.error || 'Failed to create checkout session', 5000, 'Payment Error')
        setIsProcessing(false)
      }
    } catch (error) {
      console.error('Payment error:', error)
      showError('An error occurred. Please try again.', 5000, 'Payment Error')
      setIsProcessing(false)
    }
  }

  const selectedPlanData = plans.find(p => p.id === selectedPlan)

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950' 
        : 'bg-gradient-to-br from-slate-50 via-white to-slate-50'
    }`}>
      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-40 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
          </>
        ) : (
          <>
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl"></div>
            <div className="absolute top-1/2 -left-40 w-80 h-80 bg-pink-100/50 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-indigo-100/50 rounded-full blur-3xl"></div>
          </>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-xl font-medium transition-all ${
              isDark
                ? 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 shadow-sm'
            }`}
          >
            <X className="w-4 h-4" />
            Back
          </button>
          
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 mb-6">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className={`text-sm font-semibold ${isDark ? 'text-purple-300' : 'text-purple-700'}`}>
                Upgrade Your Learning Experience
              </span>
            </div>
            <h1 className={`text-5xl md:text-6xl font-black tracking-tight mb-4 ${
              isDark 
                ? 'bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent' 
                : 'bg-gradient-to-r from-slate-900 via-purple-900 to-pink-900 bg-clip-text text-transparent'
            }`}>
              Choose Your Plan
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${
              isDark ? 'text-white/60' : 'text-slate-600'
            }`}>
              Unlock premium features and accelerate your learning journey
            </p>
          </div>
        </div>

        {/* Plans Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16 max-w-6xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id
            
            return (
              <div
                key={plan.id}
                className={`relative group cursor-pointer transition-all duration-500 ${
                  isSelected ? 'lg:scale-105' : 'hover:scale-[1.02]'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Glow effect */}
                {isSelected && (
                  <div className={`absolute -inset-1 bg-gradient-to-r ${plan.gradient} rounded-3xl blur-xl opacity-50 animate-pulse`}></div>
                )}
                
                {/* Card */}
                <div className={`relative h-full rounded-3xl border-2 transition-all duration-500 overflow-hidden ${
                  isSelected
                    ? `border-transparent bg-gradient-to-br ${plan.bgGradient} shadow-2xl`
                    : isDark
                      ? 'border-slate-700/50 bg-slate-800/50 backdrop-blur-sm'
                      : 'border-slate-200 bg-white/80 backdrop-blur-sm'
                }`}>
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute top-6 right-6 z-10">
                      <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${plan.gradient} rounded-full blur-md opacity-75`}></div>
                        <div className={`relative bg-gradient-to-r ${plan.gradient} text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg`}>
                          MOST POPULAR
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Selected indicator */}
                  {isSelected && (
                    <div className="absolute top-6 left-6 z-10">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </div>
                    </div>
                  )}

                  <div className="p-8">
                    {/* Icon and Name */}
                    <div className="mb-6">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center mb-4 shadow-lg`}>
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className={`text-2xl font-bold mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                        {plan.name}
                      </h3>
                      <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                        {plan.tagline}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="mb-8">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className={`text-5xl font-black ${
                          isDark ? 'text-white' : 'text-slate-900'
                        }`}>
                          €{plan.price}
                        </span>
                        <span className={`text-lg font-medium ${
                          isDark ? 'text-white/40' : 'text-slate-400'
                        }`}>
                          /month
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm line-through ${
                          isDark ? 'text-white/30' : 'text-slate-400'
                        }`}>
                          €{plan.originalPrice}
                        </span>
                        <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${
                          isDark 
                            ? 'bg-green-500/20 text-green-400' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          Save {Math.round(((plan.originalPrice - plan.price) / plan.originalPrice) * 100)}%
                        </span>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="space-y-3 mb-8">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                            isDark ? 'text-green-400' : 'text-green-600'
                          }`} />
                          <span className={`text-sm ${
                            isDark ? 'text-white/80' : 'text-slate-700'
                          }`}>
                            {feature}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <div className="space-y-2">
                      <button
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                          isSelected
                            ? isTestMode && isAdmin
                              ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-xl hover:shadow-2xl transform hover:-translate-y-1'
                              : `bg-gradient-to-r ${plan.gradient} shadow-xl hover:shadow-2xl transform hover:-translate-y-1`
                            : isDark
                              ? 'bg-slate-700 hover:bg-slate-600'
                              : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation()
                          if (isSelected && !isProcessing) {
                            handlePayment(plan)
                          }
                        }}
                        disabled={!isSelected || isProcessing}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {isProcessing ? (
                            <>
                              <Loader className="w-5 h-5 animate-spin" />
                              <span>Processing...</span>
                            </>
                          ) : (
                            <>
                              <span>
                                {isTestMode && isAdmin ? '🧪 Activate (Test)' : 'Get Started'}
                              </span>
                              <ArrowRight className="w-5 h-5" />
                            </>
                          )}
                        </div>
                      </button>
                      
                      {/* Test Mode Button (Admin Only) */}
                      {isAdmin && isSelected && (
                        <button
                          className={`w-full py-2 rounded-lg text-sm font-semibold transition-all ${
                            isDark
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/40 hover:bg-yellow-500/30'
                              : 'bg-yellow-50 text-yellow-700 border border-yellow-300 hover:bg-yellow-100'
                          }`}
                          onClick={(e) => {
                            e.stopPropagation()
                            if (confirm('🧪 Test Mode: This will activate the subscription without payment. Continue?')) {
                              handleTestActivation(plan)
                            }
                          }}
                          disabled={isProcessing}
                        >
                          🧪 Test Mode (Admin Only)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Benefits Grid */}
        <div className={`rounded-3xl border backdrop-blur-xl overflow-hidden max-w-5xl mx-auto mb-16 ${
          isDark 
            ? 'border-slate-700/50 bg-slate-800/30' 
            : 'border-slate-200 bg-white/60'
        }`}>
          <div className="p-12">
            <h2 className={`text-3xl font-bold mb-2 text-center ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Why Choose Studiply Pro?
            </h2>
            <p className={`text-center mb-10 ${
              isDark ? 'text-white/60' : 'text-slate-600'
            }`}>
              Join thousands of learners who are accelerating their progress
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div 
                    key={index}
                    className={`p-6 rounded-2xl border transition-all hover:scale-105 ${
                      isDark
                        ? 'border-slate-700/50 bg-slate-800/30 hover:bg-slate-800/50'
                        : 'border-slate-200 bg-white/60 hover:bg-white'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-4 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                      {benefit.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Payment Method Info */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-xl border ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <Shield className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
            <span className={`font-medium text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Secure payment powered by Stripe
            </span>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${isDark ? 'text-green-400' : 'text-green-600'}`} />
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                Secure Payment
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Infinity className={`w-5 h-5 ${isDark ? 'text-purple-400' : 'text-purple-600'}`} />
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                Cancel Anytime
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className={`w-5 h-5 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
              <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                10,000+ Happy Users
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase
