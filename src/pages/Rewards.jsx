import React, { useState, useEffect } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { 
  Star, 
  Crown, 
  Gift, 
  Sparkles, 
  Trophy,
  CheckCircle,
  ArrowRight,
  Gem,
  Diamond,
  Shield,
  Sword,
  Rocket,
  Heart,
  Brain,
  Eye,
  Flame,
  Target,
  Award,
  Medal,
  Coins,
  Wallet,
  CreditCard,
  Lock,
  Unlock,
  Infinity,
  Timer,
  Users,
  BookOpen,
  GraduationCap,
  Zap
} from 'lucide-react'

const Rewards = () => {
  const { user } = useSimpleAuth()
  const { theme, isDark } = useTheme()
  const [animationComplete, setAnimationComplete] = useState(false)
  const [selectedPass, setSelectedPass] = useState(null)
  const [hoveredCard, setHoveredCard] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('paypal')

  // 启动动画 - 给用户时间准备
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true)
    }, 3000)
    return () => clearTimeout(timer)
  }, [])

  // PayPal支付处理
  const handlePayPalPayment = async (pass) => {
    try {
      // 这里应该集成PayPal SDK
      // 对于演示，我们显示一个模拟的支付流程
      console.log('Processing PayPal payment for:', pass.name, '€' + pass.price)
      
      // 模拟支付成功
      alert(`PayPal支付成功！\n\n套餐: ${pass.name}\n价格: €${pass.price}\n\n感谢您的购买！`)
      
      // 这里应该调用后端API来确认支付并激活用户账户
      // await confirmPayment(pass.id, paymentMethod, pass.price)
      
    } catch (error) {
      console.error('Payment error:', error)
      alert('支付失败，请重试。')
    }
  }

  // 处理支付按钮点击
  const handlePayment = (pass) => {
    if (paymentMethod === 'paypal') {
      handlePayPalPayment(pass)
    } else {
      // 其他支付方式
      alert('其他支付方式暂未开通，请使用PayPal支付。')
    }
  }

  // Epic theme-based animation component
  const EpicAnimation = () => {
    return (
      <div className="relative w-full h-80 rounded-3xl overflow-hidden">
        <div className={`absolute inset-0 rounded-3xl blur-xl ${
          isDark 
            ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 shadow-2xl shadow-purple-500/20' 
            : 'bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-2xl shadow-purple-300/30'
        }`}></div>
        <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border overflow-hidden ${
          isDark 
            ? 'bg-white/10 border-white/20' 
            : 'bg-white/80 border-white/20'
        }`}>
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-indigo-600 p-8 text-white relative overflow-hidden h-full">
            {/* Background decorations */}
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
              <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 -translate-y-12 animate-pulse delay-1000"></div>
              <div className="absolute bottom-0 left-0 w-28 h-28 bg-white rounded-full -translate-x-14 translate-y-14 animate-pulse delay-2000"></div>
              <div className="absolute bottom-0 right-0 w-20 h-20 bg-white rounded-full translate-x-10 translate-y-10 animate-pulse delay-3000"></div>
            </div>
            
            <div className="relative z-10 text-center h-full flex flex-col justify-center">
              <div className="mb-6">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Gift className="w-12 h-12 text-white animate-bounce" />
                </div>
                <h2 className="text-3xl font-bold mb-2">Epic Rewards Await</h2>
                <p className="text-white/80 text-lg">Unlock legendary privileges and exclusive benefits</p>
              </div>
              
              <div className="flex justify-center space-x-4">
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Crown className="w-5 h-5" />
                  <span className="font-bold">Premium Access</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Zap className="w-5 h-5" />
                  <span className="font-bold">Exclusive Features</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
                  <Trophy className="w-5 h-5" />
                  <span className="font-bold">VIP Status</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Epic Studiply Pass data
  const studiplyPasses = [
    {
      id: 'basic',
      name: 'Studiply Pass',
      subtitle: 'Essential Learning',
      price: 8.99,
      originalPrice: 17.99,
      icon: <Star className="w-8 h-8 text-yellow-400" />,
      color: 'from-yellow-500 via-orange-500 to-red-500',
      borderColor: 'border-yellow-400',
      glowColor: 'shadow-yellow-500/20',
      features: [
        'Unlimited video calls',
        'Exclusive study badges',
        'Priority customer support',
        'Monthly free courses',
        'Study progress tracking',
        'Personalized study plans'
      ],
      level: 'Bronze'
    },
    {
      id: 'pro',
      name: 'Studiply Pass Pro',
      subtitle: 'Advanced Learning',
      price: 17.99,
      originalPrice: 35.99,
      icon: <Crown className="w-8 h-8 text-purple-400" />,
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
        '24/7 dedicated support'
      ],
      level: 'Gold'
    },
    {
      id: 'legendary',
      name: 'Studiply Pass Legendary',
      subtitle: 'Ultimate Learning',
      price: 35.99,
      originalPrice: 71.99,
      icon: <Diamond className="w-8 h-8 text-cyan-400" />,
      color: 'from-cyan-500 via-blue-500 to-indigo-500',
      borderColor: 'border-cyan-500',
      glowColor: 'shadow-cyan-500/20',
      features: [
        'All Pro features',
        'AI-powered learning coach',
        'Exclusive masterclasses',
        'Personal learning concierge',
        'Early access to new features',
        'Exclusive study retreats',
        'Lifetime access to premium content',
        'VIP community membership'
      ],
      level: 'Legendary'
    }
  ]

  const benefits = [
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Lightning Fast Learning',
      description: 'Accelerate your learning with exclusive tools and resources',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Premium Support',
      description: 'Get 24/7 dedicated support from our expert team',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <Crown className="w-8 h-8" />,
      title: 'Exclusive Access',
      description: 'Unlock member-only features and priority services',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: 'Achievement System',
      description: 'Earn exclusive badges and unlock legendary achievements',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'VIP Community',
      description: 'Join an exclusive community of dedicated learners',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: 'Future Features',
      description: 'Get early access to cutting-edge learning innovations',
      color: 'from-pink-500 to-rose-500'
    }
  ]

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Epic Header */}
        <div className="text-center mb-12">
          <div className="relative inline-block">
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
              <h1 className={`text-5xl font-bold mb-2 ${
                isDark 
                  ? 'bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent' 
                  : 'bg-gradient-to-r from-purple-700 to-pink-700 bg-clip-text text-transparent'
              }`}>
                🎁 Epic Rewards
              </h1>
              <p className={`text-xl ${
                isDark ? 'text-white/70' : 'text-gray-600'
              }`}>
                Unlock legendary privileges and transform your learning journey
              </p>
            </div>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="text-center mb-8">
          <div className={`inline-flex items-center space-x-4 p-4 rounded-2xl border ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/80 border-gray-200'
          }`}>
            <span className={`font-medium ${
              isDark ? 'text-white' : 'text-gray-700'
            }`}>支付方式:</span>
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
                <span className="text-sm">(推荐)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Epic Animation Showcase */}
        <div className="mb-12">
          <EpicAnimation />
        </div>

        {/* Epic Pass Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {studiplyPasses.map((pass) => (
            <div
              key={pass.id}
              className="relative group z-10"
              onMouseEnter={() => setHoveredCard(pass.id)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute inset-0 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl ${
                isDark 
                  ? `bg-gradient-to-r ${pass.color} shadow-2xl ${pass.glowColor}` 
                  : `bg-gradient-to-r ${pass.color} shadow-2xl ${pass.glowColor}`
              }`}></div>
              <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 group-hover:scale-105 ${
                isDark 
                  ? 'bg-white/10 border-white/20 group-hover:border-white/40' 
                  : 'bg-white/90 border-white/20 group-hover:border-white/40'
              }`}>

                {/* Pass header */}
                <div className={`bg-gradient-to-br ${pass.color} p-6 text-white relative overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white rounded-full -translate-y-10 translate-x-10 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-white rounded-full translate-y-8 -translate-x-8 animate-pulse delay-1000"></div>
                  </div>
                  <div className="relative z-10 text-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      {pass.icon}
                    </div>
                    <h3 className="text-2xl font-bold mb-1">{pass.name}</h3>
                    <p className="text-white/80 text-sm mb-4">{pass.subtitle}</p>
                    
                    {/* Level badge */}
                    <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full mb-4">
                      <Medal className="w-4 h-4" />
                      <span className="text-sm font-bold">{pass.level}</span>
                    </div>
                    
                    {/* Price */}
                    <div className="mb-4">
                      <div className="flex items-center justify-center space-x-2">
                        <span className="text-4xl font-bold">€{pass.price}</span>
                        <span className="text-lg line-through text-white/60">€{pass.originalPrice}</span>
                      </div>
                      <p className="text-sm text-green-300 font-semibold">Save €{(pass.originalPrice - pass.price).toFixed(0)}</p>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div className="p-6">
                  <div className="space-y-3 mb-6">
                    {pass.features.map((feature, index) => (
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
                    className={`w-full py-4 rounded-2xl font-bold text-white transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1 bg-gradient-to-r ${pass.color} hover:opacity-90 flex items-center justify-center space-x-2`}
                    onClick={() => handlePayment(pass)}
                  >
                    <span>Pay with PayPal</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Epic Benefits Grid */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className={`text-3xl font-bold mb-2 ${
              isDark 
                ? 'bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent'
            }`}>
              Why Choose Epic Rewards?
            </h2>
            <p className={`text-lg ${
              isDark ? 'text-gray-300' : 'text-gray-600'
            }`}>Discover the legendary benefits that await you</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="relative group">
                <div className={`absolute inset-0 rounded-3xl blur-xl transition-all duration-500 group-hover:blur-2xl ${
                  isDark 
                    ? `bg-gradient-to-r ${benefit.color} shadow-2xl shadow-${benefit.color.split('-')[1]}-500/20` 
                    : `bg-gradient-to-r ${benefit.color} shadow-2xl shadow-${benefit.color.split('-')[1]}-300/30`
                }`}></div>
                <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border overflow-hidden transition-all duration-300 group-hover:scale-105 ${
                  isDark 
                    ? 'bg-white/10 border-white/20 group-hover:border-white/40' 
                    : 'bg-white/90 border-white/20 group-hover:border-white/40'
                }`}>
                  <div className={`bg-gradient-to-br ${benefit.color} p-6 text-white relative overflow-hidden`}>
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-white rounded-full -translate-y-8 translate-x-8 animate-pulse"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 bg-white rounded-full translate-y-6 -translate-x-6 animate-pulse delay-1000"></div>
                    </div>
                    <div className="relative z-10 text-center">
                      <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                        {benefit.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{benefit.title}</h3>
                      <p className="text-white/80 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Epic Stats */}
        <div className="relative mb-12">
          <div className={`absolute inset-0 rounded-3xl blur-xl ${
            isDark 
              ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 shadow-2xl shadow-indigo-500/10' 
              : 'bg-gradient-to-r from-indigo-500/10 to-purple-500/10 shadow-2xl shadow-indigo-300/20'
          }`}></div>
          <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border p-8 ${
            isDark 
              ? 'bg-white/10 border-white/20' 
              : 'bg-white/80 border-white/20'
          }`}>
            <div className="text-center mb-8">
              <h3 className={`text-2xl font-bold mb-2 ${
                isDark 
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent'
                  : 'bg-gradient-to-r from-yellow-600 to-orange-600 bg-clip-text text-transparent'
              }`}>
                Join the Elite Learning Community
              </h3>
              <p className={`text-lg ${
                isDark ? 'text-gray-300' : 'text-gray-600'
              }`}>Over 100,000 students have transformed their learning journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-blue-600 mb-2">100K+</div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Active Learners</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-green-600 mb-2">95%</div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Success Rate</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-purple-600 mb-2">4.9/5</div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>User Rating</div>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <Rocket className="w-8 h-8 text-white" />
                </div>
                <div className="text-3xl font-bold text-orange-600 mb-2">24/7</div>
                <div className={`text-sm ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>Support</div>
              </div>
            </div>
          </div>
        </div>

        {/* User Welcome */}
        {user && (
          <div className="text-center">
            <div className="relative inline-block">
              <div className={`absolute inset-0 rounded-3xl blur-xl ${
                isDark 
                  ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 shadow-2xl shadow-green-500/10' 
                  : 'bg-gradient-to-r from-green-500/10 to-emerald-500/10 shadow-2xl shadow-green-300/20'
              }`}></div>
              <div className={`relative backdrop-blur-sm rounded-3xl shadow-2xl border px-8 py-6 ${
                isDark 
                  ? 'bg-white/10 border-white/20' 
                  : 'bg-white/80 border-white/20'
              }`}>
                <p className={`text-lg ${
                  isDark ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  Welcome back, <span className={`font-bold ${
                    isDark ? 'text-yellow-400' : 'text-purple-600'
                  }`}>{user.name}</span>! 
                </p>
                <p className={`text-sm mt-2 ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  Choose your epic learning journey and unlock legendary privileges today!
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Rewards