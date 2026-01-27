import React, { useState, useEffect } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { updateUserGold, getUserGold } from '../services/api'
import { Coins, Plus, Minus, RefreshCw, CheckCircle, XCircle } from 'lucide-react'

const GoldManager = () => {
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const [targetUserId, setTargetUserId] = useState('')
  const [currentGold, setCurrentGold] = useState(null)
  const [goldInput, setGoldInput] = useState('')
  const [operation, setOperation] = useState('set') // 'set', 'add', 'subtract'
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null) // 'success' or 'error'

  // Load current user's gold if no target user ID is set
  useEffect(() => {
    if (user?.id && !targetUserId) {
      loadGold(user.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, targetUserId])

  const loadGold = async (userId) => {
    if (!userId) return
    
    setLoading(true)
    try {
      const result = await getUserGold(userId)
      setCurrentGold(result.gold)
      setMessage(null)
    } catch (error) {
      console.error('Error loading gold:', error)
      setMessage(error.message || 'Failed to load gold')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateGold = async () => {
    const userId = targetUserId || user?.id
    
    if (!userId) {
      setMessage('Please enter a user ID or log in')
      setMessageType('error')
      return
    }

    const goldValue = parseFloat(goldInput)
    if (isNaN(goldValue) || goldValue < 0) {
      setMessage('Please enter a valid gold amount')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const result = await updateUserGold(userId, goldValue, operation)
      setCurrentGold(result.newGold)
      setGoldInput('')
      setMessage(`Gold updated successfully! Previous: ${result.previousGold}, New: ${result.newGold}`)
      setMessageType('success')
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    } catch (error) {
      console.error('Error updating gold:', error)
      setMessage(error.message || 'Failed to update gold')
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAdd = (amount) => {
    setGoldInput(amount.toString())
    setOperation('add')
  }

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
          isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
        }`}>
          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center`}>
                  <Coins className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Gold Manager
                  </h1>
                  <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                    Manage gold for users in Firebase
                  </p>
                </div>
              </div>
            </div>

            {/* User ID Input */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                User ID (leave empty to use your own)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={targetUserId}
                  onChange={(e) => {
                    setTargetUserId(e.target.value)
                    setCurrentGold(null)
                  }}
                  placeholder={user?.id || 'Enter user ID'}
                  className={`flex-1 px-4 py-2 rounded-xl border ${
                    isDark 
                      ? 'bg-white/10 border-white/20 text-white placeholder-white/40' 
                      : 'bg-white border-slate-200 text-slate-900'
                  } focus:outline-none focus:ring-2 focus:ring-purple-500`}
                />
                <button
                  onClick={() => targetUserId && loadGold(targetUserId)}
                  disabled={!targetUserId || loading}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    !targetUserId || loading
                      ? 'bg-slate-400 text-white cursor-not-allowed'
                      : 'bg-purple-500 text-white hover:bg-purple-600'
                  }`}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  Load
                </button>
              </div>
            </div>

            {/* Current Gold Display */}
            {currentGold !== null && (
              <div className={`mb-6 p-4 rounded-xl border ${
                isDark ? 'bg-yellow-500/20 border-yellow-500/30' : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                      Current Gold
                    </p>
                    <p className={`text-2xl font-bold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      {currentGold.toLocaleString()}
                    </p>
                  </div>
                  <Coins className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            )}

            {/* Message Display */}
            {message && (
              <div className={`mb-6 p-4 rounded-xl border flex items-center gap-3 ${
                messageType === 'success'
                  ? isDark ? 'bg-green-500/20 border-green-500/30 text-green-200' : 'bg-green-50 border-green-200 text-green-700'
                  : isDark ? 'bg-red-500/20 border-red-500/30 text-red-200' : 'bg-red-50 border-red-200 text-red-700'
              }`}>
                {messageType === 'success' ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 flex-shrink-0" />
                )}
                <p>{message}</p>
              </div>
            )}

            {/* Operation Selection */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                Operation
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { value: 'set', label: 'Set', icon: RefreshCw },
                  { value: 'add', label: 'Add', icon: Plus },
                  { value: 'subtract', label: 'Subtract', icon: Minus }
                ].map(op => {
                  const Icon = op.icon
                  return (
                    <button
                      key={op.value}
                      onClick={() => setOperation(op.value)}
                      className={`px-4 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                        operation === op.value
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white'
                          : isDark
                            ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                            : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {op.label}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Gold Input */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                Gold Amount
              </label>
              <input
                type="number"
                value={goldInput}
                onChange={(e) => setGoldInput(e.target.value)}
                placeholder="Enter gold amount"
                min="0"
                step="1"
                className={`w-full px-4 py-2 rounded-xl border ${
                  isDark 
                    ? 'bg-white/10 border-white/20 text-white placeholder-white/40' 
                    : 'bg-white border-slate-200 text-slate-900'
                } focus:outline-none focus:ring-2 focus:ring-purple-500`}
              />
            </div>

            {/* Quick Add Buttons */}
            <div className="mb-6">
              <label className={`block text-sm font-medium mb-2 ${isDark ? 'text-white' : 'text-slate-700'}`}>
                Quick Add
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map(amount => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAdd(amount)}
                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                      isDark
                        ? 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    +{amount}
                  </button>
                ))}
              </div>
            </div>

            {/* Update Button */}
            <button
              onClick={handleUpdateGold}
              disabled={loading || !goldInput}
              className={`w-full px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                loading || !goldInput
                  ? 'bg-slate-400 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
              }`}
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Coins className="w-5 h-5" />
                  Update Gold
                </>
              )}
            </button>

            {/* Info Box */}
            <div className={`mt-6 p-4 rounded-xl border ${
              isDark ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'
            }`}>
              <p className={`text-sm ${isDark ? 'text-blue-200' : 'text-blue-700'}`}>
                <strong>Note:</strong> Gold is stored in Firebase Firestore under the <code className="bg-white/20 px-1 rounded">studyprogress</code> collection. 
                Each user's document ID is their user ID, and the <code className="bg-white/20 px-1 rounded">gold</code> field contains the gold amount.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GoldManager
