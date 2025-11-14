import React, { useState } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
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
  TrendingUp
} from 'lucide-react'

const Purchase = () => {
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState('pro')
  const [paymentMethod, setPaymentMethod] = useState('paypal')

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

  const handlePayment = async (plan) => {
    try {
      console.log('Processing payment for:', plan.name, '€' + plan.price)
      alert(`Payment successful!\n\nPlan: ${plan.name}\nPrice: €${plan.price}\n\nThank you for your purchase!`)
      navigate('/')
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed, please try again.')
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
                    <button
                      className={`w-full py-4 rounded-xl font-bold text-white transition-all duration-300 ${
                        isSelected
                          ? `bg-gradient-to-r ${plan.gradient} shadow-xl hover:shadow-2xl transform hover:-translate-y-1`
                          : isDark
                            ? 'bg-slate-700 hover:bg-slate-600'
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePayment(plan)
                      }}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span>Get Started</span>
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </button>
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

        {/* Payment Method */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex items-center gap-4 px-6 py-3 rounded-xl border ${
            isDark 
              ? 'bg-slate-800/50 border-slate-700/50' 
              : 'bg-white border-slate-200 shadow-sm'
          }`}>
            <span className={`font-medium text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Payment Method:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="radio"
                id="paypal"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="paypal" className={`text-sm font-semibold cursor-pointer ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                PayPal
              </label>
            </div>
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
