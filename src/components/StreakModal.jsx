import React from 'react'
import { X, Flame, Calendar, Trophy, Sparkles } from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

const StreakModal = ({ isOpen, onClose, streakData }) => {
  const { isDark } = useTheme()
  
  if (!isOpen || !streakData) return null
  
  const { currentStreak, longestStreak, isNewStreak } = streakData
  
  // 计算下一个里程碑
  const milestones = [7, 30, 60, 100]
  const nextMilestone = milestones.find(m => currentStreak < m) || null
  const progressToNext = nextMilestone ? (currentStreak / nextMilestone) * 100 : 100
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className={`relative w-full max-w-md rounded-3xl border shadow-2xl ${
        isDark
          ? 'border-white/20 bg-gradient-to-br from-[#1a1240] via-[#2d1b5e] to-[#1a1240]'
          : 'border-gray-200 bg-white'
      }`}>
        {/* Close Button */}
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-lg transition ${
            isDark
              ? 'hover:bg-white/10 text-white/70 hover:text-white'
              : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
          }`}
        >
          <X className="h-5 w-5" />
        </button>
        
        {/* Content */}
        <div className="p-8 text-center">
          {/* Fire Icon */}
          <div className="relative mb-6">
            <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center ${
              isDark
                ? 'bg-gradient-to-br from-orange-500/20 to-red-500/20'
                : 'bg-gradient-to-br from-orange-100 to-red-100'
            }`}>
              <Flame className={`h-12 w-12 ${
                isDark ? 'text-orange-400' : 'text-orange-500'
              }`} />
            </div>
            {isNewStreak && (
              <div className="absolute -top-2 -right-2">
                <Sparkles className="h-6 w-6 text-yellow-400 animate-pulse" />
              </div>
            )}
          </div>
          
          {/* Title */}
          <h2 className={`text-3xl font-bold mb-2 ${
            isDark ? 'text-white' : 'text-slate-900'
          }`}>
            {isNewStreak ? '🔥 Streak Updated!' : '🔥 Your Streak'}
          </h2>
          
          {/* Current Streak */}
          <div className="mb-6">
            <p className={`text-sm mb-2 ${
              isDark ? 'text-white/70' : 'text-slate-600'
            }`}>
              Current Streak
            </p>
            <div className={`text-6xl font-black mb-2 ${
              isDark
                ? 'bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 bg-clip-text text-transparent'
                : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 bg-clip-text text-transparent'
            }`}>
              {currentStreak}
            </div>
            <p className={`text-lg font-semibold ${
              isDark ? 'text-white/80' : 'text-slate-700'
            }`}>
              {currentStreak === 1 ? 'day' : 'days'} in a row!
            </p>
          </div>
          
          {/* Longest Streak */}
          {longestStreak > currentStreak && (
            <div className={`mb-6 p-4 rounded-2xl ${
              isDark ? 'bg-white/5' : 'bg-slate-50'
            }`}>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Trophy className={`h-5 w-5 ${
                  isDark ? 'text-yellow-400' : 'text-yellow-600'
                }`} />
                <p className={`text-sm font-semibold ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>
                  Longest Streak
                </p>
              </div>
              <p className={`text-2xl font-bold ${
                isDark ? 'text-white' : 'text-slate-900'
              }`}>
                {longestStreak} days
              </p>
            </div>
          )}
          
          {/* Next Milestone Progress */}
          {nextMilestone && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-semibold ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>
                  Next Milestone
                </p>
                <p className={`text-sm font-semibold ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>
                  {currentStreak} / {nextMilestone} days
                </p>
              </div>
              <div className={`h-3 rounded-full overflow-hidden ${
                isDark ? 'bg-white/10' : 'bg-slate-200'
              }`}>
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 transition-all duration-500"
                  style={{ width: `${Math.min(progressToNext, 100)}%` }}
                />
              </div>
              <p className={`text-xs mt-2 ${
                isDark ? 'text-white/50' : 'text-slate-500'
              }`}>
                {nextMilestone - currentStreak} more days to reach {nextMilestone} days!
              </p>
            </div>
          )}
          
          {/* Milestone Achievements */}
          {currentStreak >= 7 && (
            <div className={`mb-4 p-3 rounded-xl ${
              isDark ? 'bg-green-500/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className={`h-5 w-5 ${
                  isDark ? 'text-green-400' : 'text-green-600'
                }`} />
                <p className={`text-sm font-semibold ${
                  isDark ? 'text-green-300' : 'text-green-700'
                }`}>
                  Week Warrior Achievement Unlocked! 🎉
                </p>
              </div>
            </div>
          )}
          
          {currentStreak >= 30 && (
            <div className={`mb-4 p-3 rounded-xl ${
              isDark ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'
            }`}>
              <div className="flex items-center justify-center gap-2">
                <Sparkles className={`h-5 w-5 ${
                  isDark ? 'text-purple-400' : 'text-purple-600'
                }`} />
                <p className={`text-sm font-semibold ${
                  isDark ? 'text-purple-300' : 'text-purple-700'
                }`}>
                  Monthly Champion Achievement Unlocked! 🎉
                </p>
              </div>
            </div>
          )}
          
          {/* Continue Button */}
          <button
            onClick={onClose}
            className={`w-full py-3 rounded-xl font-semibold transition ${
              isDark
                ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
                : 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600'
            }`}
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  )
}

export default StreakModal

