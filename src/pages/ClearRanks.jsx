import React, { useState } from 'react'
import { useTheme } from '../contexts/ThemeContext'
import { useNotification } from '../contexts/NotificationContext'
import { Trash2, AlertTriangle, CheckCircle } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://studiply-backend.onrender.com'

const ClearRanks = () => {
  const { isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)

  const handleClearRanks = async () => {
    if (!confirmed) {
      showError('Please confirm by checking the box', 'Confirmation Required')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/ranked/admin/clear-ranks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        showSuccess(
          `Successfully deleted all rank data: ${result.deleted.userRanks} user ranks and ${result.deleted.matches} matches`,
          'All Rank Data Cleared'
        )
        setConfirmed(false)
      } else {
        showError(result.error || 'Failed to clear ranks', 'Error')
      }
    } catch (error) {
      console.error('Error clearing ranks:', error)
      showError('Network error. Please try again.', 'Error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen p-8 ${isDark ? 'bg-slate-950' : 'bg-gray-50'}`}>
      <div className="max-w-2xl mx-auto">
        <div className={`rounded-3xl p-8 ${isDark ? 'bg-slate-900 border border-white/10' : 'bg-white shadow-xl'}`}>
          <div className="flex items-center gap-4 mb-6">
            <div className={`p-3 rounded-xl ${isDark ? 'bg-red-500/20' : 'bg-red-100'}`}>
              <Trash2 className={`h-6 w-6 ${isDark ? 'text-red-400' : 'text-red-600'}`} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                Clear All Rank Data
              </h1>
              <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                Permanently delete all ranked mode data
              </p>
            </div>
          </div>

          <div className={`rounded-xl p-6 mb-6 ${isDark ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`h-5 w-5 mt-0.5 ${isDark ? 'text-orange-400' : 'text-orange-600'}`} />
              <div>
                <h3 className={`font-semibold mb-2 ${isDark ? 'text-orange-400' : 'text-orange-700'}`}>
                  Warning: This action cannot be undone!
                </h3>
                <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                  This will permanently delete:
                </p>
                <ul className={`mt-2 space-y-1 text-sm list-disc list-inside ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
                  <li>All user ranks and tiers</li>
                  <li>All points and scores</li>
                  <li>All win/loss records and statistics</li>
                  <li>All match history</li>
                  <li>All leaderboard data</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => setConfirmed(e.target.checked)}
                className="w-5 h-5 rounded border-2 border-purple-500 text-purple-600 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
              />
              <span className={`text-sm ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                I understand this will permanently delete all rank data and cannot be undone
              </span>
            </label>
          </div>

          <button
            onClick={handleClearRanks}
            disabled={!confirmed || loading}
            className={`w-full py-4 px-6 rounded-xl font-semibold transition-all ${
              !confirmed || loading
                ? 'opacity-50 cursor-not-allowed bg-gray-400 text-white'
                : 'bg-gradient-to-r from-red-500 to-rose-600 text-white hover:from-red-600 hover:to-rose-700 shadow-lg hover:shadow-xl'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Deleting...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Trash2 className="h-5 w-5" />
                Delete All Rank Data
              </span>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ClearRanks
