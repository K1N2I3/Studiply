import React, { useState } from 'react'
import { 
  Receipt, 
  Clock, 
  CheckCircle, 
  CreditCard,
  User,
  Calendar,
  Timer,
  Euro,
  Loader,
  AlertCircle
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { createInvoiceCheckout } from '../services/paymentService'
import { useNotification } from '../contexts/NotificationContext'

const InvoiceCard = ({ invoice, onPaymentSuccess }) => {
  const { isDark } = useTheme()
  const { user } = useSimpleAuth()
  const { showError } = useNotification()
  const [isProcessing, setIsProcessing] = useState(false)

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A'
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return 'N/A'
    }
  }

  const handlePayNow = async () => {
    if (isProcessing) return
    
    setIsProcessing(true)
    
    try {
      const result = await createInvoiceCheckout(
        invoice.id,
        invoice.subtotal,
        user?.id,
        user?.email,
        invoice.tutorName,
        invoice.subject
      )
      
      if (result.success && result.url) {
        // Redirect to Stripe checkout
        window.location.href = result.url
      } else {
        showError(result.error || 'Failed to create checkout session', 5000, 'Payment Error')
      }
    } catch (error) {
      console.error('Error processing payment:', error)
      showError('An error occurred while processing payment', 5000, 'Error')
    } finally {
      setIsProcessing(false)
    }
  }

  const isPending = invoice.status === 'pending'
  const isPaid = invoice.status === 'paid'

  return (
    <div className={`rounded-2xl border p-6 transition-all ${
      isDark 
        ? isPending 
          ? 'border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-amber-500/5' 
          : 'border-white/10 bg-white/5'
        : isPending 
          ? 'border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50' 
          : 'border-slate-200 bg-white'
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-xl ${
            isPending 
              ? 'bg-gradient-to-br from-orange-500 to-amber-500' 
              : 'bg-gradient-to-br from-green-500 to-emerald-500'
          }`}>
            <Receipt className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className={`font-bold text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {invoice.subject}
            </h3>
            <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Invoice #{invoice.id.slice(-8).toUpperCase()}
            </p>
          </div>
        </div>
        
        {/* Status Badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${
          isPending
            ? 'bg-orange-500/20 text-orange-500'
            : 'bg-green-500/20 text-green-500'
        }`}>
          {isPending ? (
            <>
              <AlertCircle className="w-4 h-4" />
              Unpaid
            </>
          ) : (
            <>
              <CheckCircle className="w-4 h-4" />
              Paid
            </>
          )}
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-2">
          <User className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
          <span className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            {invoice.tutorName}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Timer className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
          <span className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            {invoice.durationMinutes} min
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Calendar className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
          <span className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            {formatDate(invoice.createdAt)}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Euro className={`w-4 h-4 ${isDark ? 'text-white/40' : 'text-slate-400'}`} />
          <span className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
            €{invoice.hourlyRate}/hour
          </span>
        </div>
      </div>

      {/* Price Breakdown */}
      <div className={`rounded-xl p-4 mb-4 ${
        isDark ? 'bg-white/5' : 'bg-slate-50'
      }`}>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Session Fee
            </span>
            <span className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}>
              €{invoice.subtotal?.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
              Platform Fee ({(invoice.platformFeeRate * 100).toFixed(0)}%)
            </span>
            <span className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
              Included
            </span>
          </div>
          <div className={`border-t pt-2 mt-2 ${isDark ? 'border-white/10' : 'border-slate-200'}`}>
            <div className="flex justify-between items-center">
              <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Total
              </span>
              <span className={`text-xl font-bold ${
                isPending ? 'text-orange-500' : 'text-green-500'
              }`}>
                €{invoice.subtotal?.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Button */}
      {isPending && (
        <button
          onClick={handlePayNow}
          disabled={isProcessing}
          className={`w-full py-3 px-6 rounded-xl font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
            isProcessing
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 hover:shadow-xl hover:-translate-y-0.5'
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
              Pay Now
            </>
          )}
        </button>
      )}

      {/* Paid Info */}
      {isPaid && invoice.paidAt && (
        <div className={`flex items-center justify-center gap-2 py-3 ${
          isDark ? 'text-green-400' : 'text-green-600'
        }`}>
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">Paid on {formatDate(invoice.paidAt)}</span>
        </div>
      )}
    </div>
  )
}

export default InvoiceCard

