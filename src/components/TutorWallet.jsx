import React, { useState, useEffect } from 'react'
import { 
  Wallet, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Euro,
  Sparkles,
  ArrowUpRight,
  Calendar,
  Users,
  Star,
  Coins,
  BadgeEuro
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { getTutorWallet } from '../services/invoiceService'

const TutorWallet = ({ tutorId }) => {
  const { isDark } = useTheme()
  const [wallet, setWallet] = useState({
    totalEarnings: 0,
    pendingEarnings: 0,
    completedSessions: 0,
    recentPayments: [],
    pendingInvoices: []
  })
  const [loading, setLoading] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  useEffect(() => {
    const loadWallet = async () => {
      if (!tutorId) return
      
      setLoading(true)
      try {
        const result = await getTutorWallet(tutorId)
        if (result.success) {
          setWallet(result.wallet)
          // Trigger animation when wallet loads
          setIsAnimating(true)
          setTimeout(() => setIsAnimating(false), 1000)
        }
      } catch (error) {
        console.error('Error loading wallet:', error)
      } finally {
        setLoading(false)
      }
    }

    loadWallet()
  }, [tutorId])

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return 'N/A'
    }
  }

  if (loading) {
    return (
      <div className={`rounded-[28px] border p-6 backdrop-blur-xl ${
        isDark ? 'border-white/10 bg-gradient-to-br from-white/10 to-white/5' : 'border-white/70 bg-white'
      }`}>
        <div className="flex items-center justify-center py-8">
          <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-[28px] border overflow-hidden backdrop-blur-xl ${
      isDark 
        ? 'border-white/10 bg-gradient-to-br from-emerald-900/30 via-teal-900/20 to-cyan-900/30' 
        : 'border-emerald-100 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50'
    }`}>
      {/* Wallet Header with Animation */}
      <div className="relative p-6 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className={`absolute -top-20 -right-20 w-40 h-40 rounded-full blur-3xl transition-all duration-1000 ${
            isAnimating ? 'scale-150 opacity-60' : 'scale-100 opacity-30'
          } ${isDark ? 'bg-emerald-500' : 'bg-emerald-300'}`} />
          <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full blur-2xl transition-all duration-1000 delay-100 ${
            isAnimating ? 'scale-125 opacity-50' : 'scale-100 opacity-25'
          } ${isDark ? 'bg-teal-500' : 'bg-teal-300'}`} />
          
          {/* Floating coins animation */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className={`absolute animate-bounce ${
                  isDark ? 'text-yellow-400/20' : 'text-yellow-500/30'
                }`}
                style={{
                  left: `${15 + i * 18}%`,
                  top: `${10 + (i % 3) * 25}%`,
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: `${2 + i * 0.3}s`
                }}
              >
                <Coins className="w-4 h-4" />
              </div>
            ))}
          </div>
        </div>

        {/* Wallet Icon */}
        <div className="relative flex items-center gap-4 mb-6">
          <div className={`relative p-4 rounded-2xl shadow-lg ${
            isDark 
              ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
              : 'bg-gradient-to-br from-emerald-400 to-teal-500'
          }`}>
            <Wallet className="w-8 h-8 text-white" />
            <Sparkles className={`absolute -top-1 -right-1 w-4 h-4 text-yellow-300 ${
              isAnimating ? 'animate-ping' : ''
            }`} />
          </div>
          <div>
            <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              My Wallet
            </h3>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Your tutoring earnings
            </p>
          </div>
        </div>

        {/* Total Earnings */}
        <div className="relative">
          <div className={`text-sm font-medium mb-1 ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}>
            Total Earned
          </div>
          <div className={`flex items-baseline gap-2 ${
            isAnimating ? 'animate-pulse' : ''
          }`}>
            <span className={`text-4xl font-black tracking-tight ${
              isDark 
                ? 'text-white drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                : 'text-slate-900'
            }`}>
              €{wallet.totalEarnings.toFixed(2)}
            </span>
            {wallet.totalEarnings > 0 && (
              <span className="flex items-center gap-1 text-emerald-500 text-sm font-semibold">
                <TrendingUp className="w-4 h-4" />
                Active
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-2 gap-3 px-6 py-4 ${
        isDark ? 'bg-white/5' : 'bg-white/50'
      }`}>
        <div className={`rounded-xl p-4 ${
          isDark ? 'bg-white/5' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Clock className={`w-4 h-4 ${isDark ? 'text-orange-400' : 'text-orange-500'}`} />
            <span className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Pending
            </span>
          </div>
          <p className={`text-xl font-bold ${
            isDark ? 'text-orange-400' : 'text-orange-600'
          }`}>
            €{wallet.pendingEarnings.toFixed(2)}
          </p>
        </div>

        <div className={`rounded-xl p-4 ${
          isDark ? 'bg-white/5' : 'bg-white'
        }`}>
          <div className="flex items-center gap-2 mb-2">
            <Users className={`w-4 h-4 ${isDark ? 'text-purple-400' : 'text-purple-500'}`} />
            <span className={`text-xs font-medium ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Sessions
            </span>
          </div>
          <p className={`text-xl font-bold ${
            isDark ? 'text-purple-400' : 'text-purple-600'
          }`}>
            {wallet.completedSessions}
          </p>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="px-6 py-4">
        <h4 className={`text-sm font-semibold mb-3 ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
          Recent Payments
        </h4>
        
        {wallet.recentPayments.length > 0 ? (
          <div className="space-y-2">
            {wallet.recentPayments.slice(0, 3).map((payment, index) => (
              <div 
                key={payment.id}
                className={`flex items-center justify-between rounded-xl p-3 transition-all hover:scale-[1.02] ${
                  isDark ? 'bg-white/5 hover:bg-white/10' : 'bg-slate-50 hover:bg-slate-100'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    isDark ? 'bg-emerald-500/20' : 'bg-emerald-100'
                  }`}>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {payment.studentName}
                    </p>
                    <p className={`text-xs ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
                      {payment.subject} • {formatDate(payment.paidAt)}
                    </p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${
                  isDark ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  +€{payment.tutorEarnings?.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className={`rounded-xl p-4 text-center ${
            isDark ? 'bg-white/5' : 'bg-slate-50'
          }`}>
            <BadgeEuro className={`w-8 h-8 mx-auto mb-2 ${
              isDark ? 'text-white/30' : 'text-slate-300'
            }`} />
            <p className={`text-sm ${isDark ? 'text-white/50' : 'text-slate-500'}`}>
              No payments yet
            </p>
          </div>
        )}
      </div>

      {/* Pending Invoices Alert */}
      {wallet.pendingInvoices.length > 0 && (
        <div className={`mx-6 mb-6 rounded-xl p-4 ${
          isDark 
            ? 'bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/30' 
            : 'bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${
              isDark ? 'bg-orange-500/30' : 'bg-orange-100'
            }`}>
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${
                isDark ? 'text-orange-300' : 'text-orange-700'
              }`}>
                {wallet.pendingInvoices.length} Pending Invoice{wallet.pendingInvoices.length > 1 ? 's' : ''}
              </p>
              <p className={`text-xs ${isDark ? 'text-orange-300/70' : 'text-orange-600'}`}>
                Waiting for student payments
              </p>
            </div>
            <div className={`text-lg font-bold ${
              isDark ? 'text-orange-400' : 'text-orange-600'
            }`}>
              €{wallet.pendingInvoices.reduce((sum, inv) => sum + (inv.tutorEarnings || 0), 0).toFixed(2)}
            </div>
          </div>
        </div>
      )}

      {/* Platform Fee Info */}
      <div className={`px-6 pb-6`}>
        <div className={`rounded-xl p-3 text-center ${
          isDark ? 'bg-white/5' : 'bg-slate-50'
        }`}>
          <p className={`text-xs ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
            💡 5% platform fee is already deducted from displayed earnings
          </p>
        </div>
      </div>
    </div>
  )
}

export default TutorWallet

