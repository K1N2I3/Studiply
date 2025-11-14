import React, { useState } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { useNavigate } from 'react-router-dom'
import { 
  Crown, 
  Star, 
  Diamond,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Shield,
  Rocket,
  Gift,
  Users,
  Trophy,
  Medal,
  X
} from 'lucide-react'

const Purchase = () => {
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const navigate = useNavigate()
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('paypal')

  const plans = [
    {
      id: 'basic',
      name: 'Studiply Pass',
      subtitle: 'Essential Learning',
      price: 8.99,
      originalPrice: 17.99,
      period: 'month',
      icon: Star,
      color: 'from-yellow-500 via-orange-500 to-red-500',
      borderColor: 'border-yellow-400',
      glowColor: 'shadow-yellow-500/20',
      features: [
        'Unlimited video calls',
        'Exclusive study badges',
        'Priority customer support',
        'Monthly free courses',
        'Study progress tracking',
        'Personalized study plans',
        'Ad-free experience'
      ],
      level: 'Bronze',
      popular: false
    },
    {
      id: 'pro',
      name: 'Studiply Pass Pro',
      subtitle: 'Advanced Learning',
      price: 17.99,
      originalPrice: 35.99,
      period: 'month',
      icon: Crown,
      color: 'from-purple-500 via-pink-500 to-rose-500',
      borderColor: 'border-purple-500',
      glowColor: 'shadow-purple-500/20',
      features: [
        'All Studiply Pass features',
        'Unlimited 1-on-1 tutoring',
        'Exclusive tutor matching',
        'Advanced learning analytics',
        'Priority booking slots',
        'Exclusive study community',
        'Custom learning paths',
        '24/7 dedicated support',
        'Early access to new features'
      ],
      level: 'Gold',
      popular: true
    }
  ]

  const handlePayment = async (plan) => {
    try {
      // 这里应该集成支付处理逻辑
      console.log('Processing payment for:', plan.name, '€' + plan.price)
      
      // 模拟支付成功
      alert(`Payment successful!\n\nPlan: ${plan.name}\nPrice: €${plan.price}\n\nThank you for your purchase!`)
      
      // 这里应该调用后端API来确认支付并激活用户账户
      // await confirmPayment(plan.id, paymentMethod, plan.price)
      
      // 支付成功后，可以更新用户数据
      // 然后重定向到主页或确认页面
      navigate('/')
      
    } catch (error) {
      console.error('Payment error:', error)
      alert('Payment failed, please try again.')
    }
  }

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate(-1)}
            className={`inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-xl font-medium transition-all ${
              isDark
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-white text-slate-700 hover:bg-slate-50'
            }`}
          >
            <X className="w-4 h-4" />
            Back
          </button>
          
          <div className={`relative inline-block mb-6`}>
            <div className={`absolute inset-0 rounded-3xl blur-xl ${
              isDark 
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-2xl shadow-purple-500/20' 
                : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-2xl shadow-purple-300/30'
            }`}></div>
            <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border px-8 py-6 ${
              isDark 
                ? 'bg-white/10 border-white/20' 
                : 'bg-white/80 border-white/20'
            }`}>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-6 h-6 text-white" />
                </div>
                <h1 className={`text-4xl md:text-5xl font-black tracking-tight ${
                  isDark 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' 
                    : 'bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent'
                }`}>
                  Upgrade to Pro
                </h1>
              </div>
              <p className={`text-lg ${isDark ? 'text-white/70' : 'text-gray-600'}`}>
                Choose the perfect plan for your learning journey
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="flex justify-center mb-8">
          <div className={`inline-flex items-center space-x-4 p-4 rounded-2xl border ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <span className={`font-medium ${isDark ? 'text-white' : 'text-gray-700'}`}>
              Payment Method:
            </span>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="paypal"
                name="payment"
                value="paypal"
                checked={paymentMethod === 'paypal'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <label htmlFor="paypal" className={`flex items-center space-x-2 cursor-pointer ${
                isDark ? 'text-white' : 'text-gray-700'
              }`}>
                <span className="text-blue-600 font-bold">PayPal</span>
                <span className="text-sm">(Recommended)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 max-w-5xl mx-auto">
          {plans.map((plan) => {
            const Icon = plan.icon
            const isSelected = selectedPlan === plan.id
            
            return (
              <div
                key={plan.id}
                className={`relative group cursor-pointer transition-all duration-300 ${
                  isSelected ? 'scale-105' : 'hover:scale-105'
                }`}
                onClick={() => setSelectedPlan(plan.id)}
              >
                {/* Glow effect */}
                <div className={`absolute inset-0 rounded-3xl blur-xl transition-all duration-500 ${
                  isSelected || plan.popular
                    ? `bg-gradient-to-r ${plan.color} shadow-2xl ${plan.glowColor} opacity-100`
                    : `bg-gradient-to-r ${plan.color} shadow-2xl ${plan.glowColor} opacity-50`
                }`}></div>
                
                {/* Card */}
                <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 ${
                  isSelected || plan.popular
                    ? isDark
                      ? 'bg-white/15 border-white/40'
                      : 'bg-white/95 border-white/40'
                    : isDark
                      ? 'bg-white/10 border-white/20'
                      : 'bg-white/90 border-white/20'
                }`}>
                  {/* Popular badge */}
                  {plan.popular && (
                    <div className="absolute top-4 right-4 z-10">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                        MOST POPULAR
                      </div>
                    </div>
                  )}

                  {/* Header */}
                  <div className={`bg-gradient-to-br ${plan.color} p-8 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8 animate-pulse delay-1000"></div>
                    </div>
                    <div className="relative z-10 text-center">
                      <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Icon className="w-10 h-10 text-white" />
                      </div>
                      <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                      <p className="text-white/80 text-sm mb-4">{plan.subtitle}</p>
                      
                      {/* Level badge */}
                      <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                        <Medal className="w-4 h-4" />
                        <span className="text-sm font-bold">{plan.level}</span>
                      </div>
                      
                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-center justify-center space-x-2">
                          <span className="text-5xl font-bold">€{plan.price}</span>
                          <span className="text-lg line-through text-white/60">€{plan.originalPrice}</span>
                        </div>
                        <p className="text-sm text-green-300 font-semibold mt-1">
                          Save €{(plan.originalPrice - plan.price).toFixed(2)} per month
                        </p>
                        <p className="text-xs text-white/70 mt-1">Billed monthly</p>
                      </div>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="p-6">
                    <div className="space-y-3 mb-6">
                      {plan.features.map((feature, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                          <span className={`text-sm ${
                            isDark ? 'text-gray-300' : 'text-gray-700'
                          }`}>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* Purchase button */}
                    <button
                      className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-gradient-to-r ${plan.color} hover:opacity-90 flex items-center justify-center space-x-2 ${
                        isSelected ? 'ring-4 ring-white/50' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation()
                        handlePayment(plan)
                      }}
                    >
                      <span>Pay with PayPal</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Benefits Section */}
        <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden max-w-5xl mx-auto ${
          isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
        }`}>
          <div className="p-8">
            <h2 className={`text-2xl font-bold mb-6 text-center ${
              isDark ? 'text-white' : 'text-slate-900'
            }`}>
              Why Upgrade?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: Zap, title: 'Lightning Fast', description: 'Accelerate your learning' },
                { icon: Shield, title: 'Premium Support', description: '24/7 dedicated help' },
                { icon: Rocket, title: 'Early Access', description: 'Get new features first' }
              ].map((benefit, index) => {
                const Icon = benefit.icon
                return (
                  <div key={index} className="text-center">
                    <div className={`w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className={`font-bold mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {benefit.title}
                    </h3>
                    <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      {benefit.description}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Purchase

