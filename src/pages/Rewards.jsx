import React, { useState, useEffect } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { getUserQuestProgress, LEVEL_CONFIG } from '../services/cloudQuestService'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { getLeaderboard, getUserRank } from '../services/leaderboardService'
import { 
  Star, 
  Crown, 
  Gift, 
  Trophy,
  Award,
  Medal,
  Coins,
  Zap,
  Flame,
  Target,
  Rocket,
  Sparkles,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle2,
  Lock,
  Unlock,
  Gem,
  Diamond,
  Heart,
  Brain,
  BookOpen,
  GraduationCap,
  Users,
  BarChart3,
  ArrowRight,
  GiftIcon,
  Sparkle
} from 'lucide-react'

const Rewards = () => {
  const { user } = useSimpleAuth()
  const { isDark } = useTheme()
  const [userProgress, setUserProgress] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState('overview')
  const [leaderboardType, setLeaderboardType] = useState('streak')
  const [leaderboardData, setLeaderboardData] = useState([])
  const [leaderboardLoading, setLeaderboardLoading] = useState(false)
  const [userRank, setUserRank] = useState(null)

  // 实时监听用户进度
  useEffect(() => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    const userProgressRef = doc(db, 'studyprogress', user.id)
    const unsubscribe = onSnapshot(userProgressRef, async (doc) => {
      if (doc.exists()) {
        const progress = doc.data()
        const levelProgress = LEVEL_CONFIG.calculateLevelProgress(progress.totalXP || 0)
        setUserProgress({
          ...progress,
          levelProgress: levelProgress
        })
      } else {
        // 如果没有数据，创建默认进度
        const defaultProgress = {
          totalXP: 0,
          currentLevel: 1,
          gold: 0,
          completedQuests: [],
          achievements: [],
          levelProgress: LEVEL_CONFIG.calculateLevelProgress(0)
        }
        setUserProgress(defaultProgress)
      }
      setLoading(false)
    }, (error) => {
      console.error('Error listening to user progress:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.id])

  // 成就列表
  const allAchievements = [
    { id: 'first_quest', name: 'First Steps', description: 'Complete your first quest', icon: Star, color: 'from-yellow-400 to-orange-500', rarity: 'common' },
    { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: Rocket, color: 'from-blue-400 to-cyan-500', rarity: 'common' },
    { id: 'level_10', name: 'Experienced Learner', description: 'Reach level 10', icon: Trophy, color: 'from-purple-400 to-pink-500', rarity: 'rare' },
    { id: 'level_20', name: 'Knowledge Seeker', description: 'Reach level 20', icon: Crown, color: 'from-indigo-400 to-purple-500', rarity: 'rare' },
    { id: 'level_30', name: 'Master Scholar', description: 'Reach level 30', icon: Gem, color: 'from-emerald-400 to-teal-500', rarity: 'epic' },
    { id: 'level_50', name: 'Legendary Academic', description: 'Reach level 50', icon: Diamond, color: 'from-amber-400 to-yellow-500', rarity: 'legendary' },
    { id: 'gold_1000', name: 'Wealthy Scholar', description: 'Accumulate 1000 gold', icon: Coins, color: 'from-yellow-400 to-amber-500', rarity: 'rare' },
    { id: 'quest_master', name: 'Quest Master', description: 'Complete 50 quests', icon: Target, color: 'from-red-400 to-rose-500', rarity: 'epic' },
    { id: 'streak_7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: Flame, color: 'from-orange-400 to-red-500', rarity: 'rare' },
    { id: 'streak_30', name: 'Monthly Champion', description: 'Maintain a 30-day streak', icon: Sparkles, color: 'from-pink-400 to-purple-500', rarity: 'epic' },
  ]

  const userAchievements = userProgress?.achievements || []
  const unlockedAchievements = allAchievements.filter(ach => userAchievements.includes(ach.id))
  const lockedAchievements = allAchievements.filter(ach => !userAchievements.includes(ach.id))

  // 计算统计数据
  const stats = {
    totalQuests: userProgress?.completedQuests?.length || 0,
    totalXP: userProgress?.totalXP || 0,
    currentLevel: userProgress?.currentLevel || 1,
    gold: userProgress?.gold || 0,
    achievements: unlockedAchievements.length,
    totalAchievements: allAchievements.length
  }

  const levelProgress = userProgress?.levelProgress || {
    currentLevel: 1,
    nextLevel: 2,
    progressXP: 0,
    requiredXP: 100,
    progressPercentage: 0
  }

  // 奖励商店物品
  const shopItems = [
    { id: 'theme_dark', name: 'Dark Theme', description: 'Unlock dark mode theme', price: 100, icon: Sparkle, available: true },
    { id: 'badge_premium', name: 'Premium Badge', description: 'Show off your premium status', price: 500, icon: Crown, available: true },
    { id: 'avatar_frame', name: 'Golden Frame', description: 'Exclusive avatar frame', price: 300, icon: Award, available: true },
    { id: 'title_legend', name: 'Legend Title', description: 'Custom title: "Legend"', price: 1000, icon: Star, available: true },
  ]

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDark ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
      }`}>
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className={`text-lg ${isDark ? 'text-white' : 'text-gray-700'}`}>Loading your rewards...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className={`relative rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
            isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
          }`}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20"></div>
            <div className="relative p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 px-4 py-2 text-xs font-semibold uppercase tracking-wide mb-4">
                    <Gift className="h-4 w-4" /> Rewards Center
                  </div>
                  <h1 className={`text-4xl md:text-5xl font-black tracking-tight mb-3 ${
                    isDark
                      ? 'bg-gradient-to-r from-purple-200 via-pink-200 to-indigo-200 bg-clip-text text-transparent'
                      : 'bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent'
                  }`}>
                    Welcome back, {user?.name || 'Scholar'}!
                  </h1>
                  <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                    Track your progress, unlock achievements, and claim your rewards
                  </p>
                </div>
                
                {/* Level Badge */}
                <div className={`relative rounded-2xl border p-6 text-center ${
                  isDark ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/20 to-pink-500/20' : 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
                }`}>
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <Crown className="w-10 h-10 text-white" />
                  </div>
                  <div className={`text-3xl font-bold mb-1 ${
                    isDark ? 'text-white' : 'text-purple-600'
                  }`}>
                    Level {stats.currentLevel}
                  </div>
                  <div className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                    {levelProgress.progressXP} / {levelProgress.requiredXP} XP
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className={`rounded-2xl border p-6 backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500`}>
                <Star className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stats.totalXP.toLocaleString()}
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Total XP</p>
          </div>

          <div className={`rounded-2xl border p-6 backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br from-yellow-500 to-amber-500`}>
                <Coins className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stats.gold.toLocaleString()}
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Gold</p>
          </div>

          <div className={`rounded-2xl border p-6 backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500`}>
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stats.totalQuests}
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Quests</p>
          </div>

          <div className={`rounded-2xl border p-6 backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`p-2 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500`}>
                <Award className="w-5 h-5 text-white" />
              </div>
              <span className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                {stats.achievements}/{stats.totalAchievements}
              </span>
            </div>
            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Achievements</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'achievements', label: 'Achievements', icon: Trophy },
            { id: 'progress', label: 'Progress', icon: TrendingUp },
            { id: 'leaderboard', label: 'Leaderboard', icon: Users },
            { id: 'shop', label: 'Reward Shop', icon: Gift }
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                  selectedTab === tab.id
                    ? isDark
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                    : isDark
                      ? 'bg-white/5 text-white/70 hover:bg-white/10'
                      : 'bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <>
              {/* Level Progress */}
              <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
                isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
              }`}>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Level Progress
                    </h2>
                    <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                      isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                    }`}>
                      Level {levelProgress.currentLevel} → {levelProgress.nextLevel}
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className={`h-6 rounded-full overflow-hidden ${
                      isDark ? 'bg-white/10' : 'bg-slate-200'
                    }`}>
                      <div 
                        className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                        style={{ width: `${Math.min(levelProgress.progressPercentage, 100)}%` }}
                      >
                        {levelProgress.progressPercentage > 10 && (
                          <span className="text-xs font-bold text-white">
                            {levelProgress.progressPercentage}%
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                      <span className={isDark ? 'text-white/70' : 'text-slate-600'}>
                        {levelProgress.progressXP} XP
                      </span>
                      <span className={isDark ? 'text-white/70' : 'text-slate-600'}>
                        {levelProgress.requiredXP} XP needed
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recent Achievements */}
              {unlockedAchievements.length > 0 && (
                <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
                  isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
                }`}>
                  <div className="p-8">
                    <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      Recent Achievements
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {unlockedAchievements.slice(-4).reverse().map(achievement => {
                        const Icon = achievement.icon
                        return (
                          <div
                            key={achievement.id}
                            className={`relative rounded-2xl border p-4 backdrop-blur-xl transition-all hover:scale-105 ${
                              isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
                            }`}
                          >
                            <div className={`w-12 h-12 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center mb-3 mx-auto`}>
                              <Icon className="w-6 h-6 text-white" />
                            </div>
                            <h3 className={`text-sm font-bold text-center mb-1 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {achievement.name}
                            </h3>
                            <p className={`text-xs text-center ${isDark ? 'text-white/60' : 'text-slate-500'}`}>
                              {achievement.description}
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Achievements Tab */}
          {selectedTab === 'achievements' && (
            <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
              isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
            }`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    All Achievements
                  </h2>
                  <span className={`text-sm font-semibold px-3 py-1 rounded-full ${
                    isDark ? 'bg-purple-500/20 text-purple-300' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {unlockedAchievements.length} / {allAchievements.length} Unlocked
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Unlocked Achievements */}
                  {unlockedAchievements.map(achievement => {
                    const Icon = achievement.icon
                    return (
                      <div
                        key={achievement.id}
                        className={`relative rounded-2xl border p-6 backdrop-blur-xl transition-all hover:scale-105 ${
                          isDark ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10' : 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 bg-gradient-to-br ${achievement.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg`}>
                            <Icon className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                                {achievement.name}
                              </h3>
                              <CheckCircle2 className="w-5 h-5 text-green-500" />
                            </div>
                            <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                              {achievement.description}
                            </p>
                            <span className={`inline-block mt-2 text-xs font-semibold px-2 py-1 rounded-full ${
                              achievement.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-300' :
                              achievement.rarity === 'epic' ? 'bg-purple-500/20 text-purple-300' :
                              achievement.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                              'bg-slate-500/20 text-slate-300'
                            }`}>
                              {achievement.rarity.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Locked Achievements */}
                  {lockedAchievements.map(achievement => {
                    const Icon = achievement.icon
                    return (
                      <div
                        key={achievement.id}
                        className={`relative rounded-2xl border p-6 backdrop-blur-xl opacity-60 ${
                          isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-16 h-16 bg-slate-400 rounded-xl flex items-center justify-center flex-shrink-0`}>
                            <Lock className="w-8 h-8 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className={`font-bold mb-1 ${isDark ? 'text-white/50' : 'text-slate-400'}`}>
                              {achievement.name}
                            </h3>
                            <p className={`text-sm ${isDark ? 'text-white/40' : 'text-slate-400'}`}>
                              {achievement.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Progress Tab */}
          {selectedTab === 'progress' && (
            <div className="space-y-6">
              <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
                isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
              }`}>
                <div className="p-8">
                  <h2 className={`text-2xl font-bold mb-6 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Learning Statistics
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`rounded-2xl border p-6 ${
                      isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                          <BookOpen className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Quests Completed</p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.totalQuests}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-6 ${
                      isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                          <TrendingUp className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Total Experience</p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.totalXP.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-6 ${
                      isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500">
                          <Coins className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Gold Earned</p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {stats.gold.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className={`rounded-2xl border p-6 ${
                      isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
                    }`}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500">
                          <Trophy className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'}`}>Achievement Rate</p>
                          <p className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                            {Math.round((stats.achievements / stats.totalAchievements) * 100)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {selectedTab === 'leaderboard' && (
            <div className="space-y-6">
              {/* Leaderboard Type Selector */}
              <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
                isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
              }`}>
                <div className="p-6">
                  <h2 className={`text-2xl font-bold mb-4 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Leaderboard
                  </h2>
                  <div className="flex gap-3 flex-wrap">
                    {[
                      { id: 'streak', label: 'Day Streak', icon: Flame },
                      { id: 'level', label: 'Level', icon: GraduationCap },
                      { id: 'quests', label: 'Quests', icon: Target }
                    ].map(type => {
                      const Icon = type.icon
                      return (
                        <button
                          key={type.id}
                          onClick={() => setLeaderboardType(type.id)}
                          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
                            leaderboardType === type.id
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : isDark
                                ? 'bg-white/5 text-white/70 hover:bg-white/10'
                                : 'bg-white text-slate-700 hover:bg-slate-50'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {type.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* User Rank Card */}
              {userRank && userRank.rank && (
                <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
                  isDark ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10' : 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
                }`}>
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'} mb-1`}>Your Rank</p>
                        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          #{userRank.rank}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className={`text-sm ${isDark ? 'text-white/70' : 'text-slate-600'} mb-1`}>
                          {leaderboardType === 'streak' ? 'Day Streak' :
                           leaderboardType === 'level' ? 'Level' :
                           'Quests Completed'}
                        </p>
                        <p className={`text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {userRank.value}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Leaderboard List */}
              <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
                isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
              }`}>
                <div className="p-6">
                  {leaderboardLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : leaderboardData.length === 0 ? (
                    <div className="text-center py-12">
                      <Trophy className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-white/30' : 'text-slate-300'}`} />
                      <p className={`text-lg ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                        No data available yet
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {leaderboardData.map((entry, index) => {
                        const isCurrentUser = entry.userId === user?.id
                        const rank = index + 1
                        const medalColors = {
                          1: 'from-yellow-400 to-amber-500',
                          2: 'from-slate-300 to-slate-400',
                          3: 'from-orange-400 to-orange-600'
                        }
                        
                        return (
                          <div
                            key={entry.userId}
                            className={`rounded-xl border p-4 transition-all ${
                              isCurrentUser
                                ? isDark
                                  ? 'border-purple-500/50 bg-gradient-to-r from-purple-500/20 to-pink-500/20'
                                  : 'border-purple-300 bg-gradient-to-r from-purple-50 to-pink-50'
                                : isDark
                                  ? 'border-white/10 bg-white/5 hover:bg-white/10'
                                  : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              {/* Rank */}
                              <div className="flex-shrink-0 w-12 text-center">
                                {rank <= 3 ? (
                                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${medalColors[rank]} flex items-center justify-center mx-auto shadow-lg`}>
                                    <Trophy className="w-6 h-6 text-white" />
                                  </div>
                                ) : (
                                  <span className={`text-lg font-bold ${
                                    isDark ? 'text-white/70' : 'text-slate-600'
                                  }`}>
                                    #{rank}
                                  </span>
                                )}
                              </div>

                              {/* Avatar */}
                              <div className="flex-shrink-0">
                                {entry.userAvatar ? (
                                  <img
                                    src={entry.userAvatar}
                                    alt={entry.userName}
                                    className="w-12 h-12 rounded-full border-2 border-purple-500/30"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center border-2 border-purple-500/30">
                                    <User className="w-6 h-6 text-white" />
                                  </div>
                                )}
                              </div>

                              {/* User Info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <p className={`font-semibold truncate ${
                                    isDark ? 'text-white' : 'text-slate-900'
                                  }`}>
                                    {entry.userName}
                                    {isCurrentUser && (
                                      <span className="ml-2 text-xs text-purple-500">(You)</span>
                                    )}
                                  </p>
                                </div>
                                <div className="flex items-center gap-4 mt-1">
                                  <span className={`text-xs ${
                                    isDark ? 'text-white/60' : 'text-slate-500'
                                  }`}>
                                    {leaderboardType === 'streak' ? `${entry.value} day${entry.value !== 1 ? 's' : ''} streak` :
                                     leaderboardType === 'level' ? `Level ${entry.value}` :
                                     `${entry.value} quest${entry.value !== 1 ? 's' : ''} completed`}
                                  </span>
                                </div>
                              </div>

                              {/* Value Badge */}
                              <div className={`flex-shrink-0 px-4 py-2 rounded-lg ${
                                rank === 1
                                  ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                                  : rank === 2
                                    ? 'bg-gradient-to-r from-slate-300 to-slate-400 text-white'
                                    : rank === 3
                                      ? 'bg-gradient-to-r from-orange-400 to-orange-600 text-white'
                                      : isDark
                                        ? 'bg-purple-500/20 text-purple-300'
                                        : 'bg-purple-100 text-purple-700'
                              }`}>
                                <span className="font-bold text-lg">{entry.value}</span>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Shop Tab */}
          {selectedTab === 'shop' && (
            <div className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden ${
              isDark ? 'border-white/12 bg-white/6' : 'border-white/80 bg-white'
            }`}>
              <div className="p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                    Reward Shop
                  </h2>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl ${
                    isDark ? 'bg-yellow-500/20 border border-yellow-500/30' : 'bg-yellow-50 border border-yellow-200'
                  }`}>
                    <Coins className="w-5 h-5 text-yellow-500" />
                    <span className={`font-bold ${isDark ? 'text-yellow-300' : 'text-yellow-700'}`}>
                      {stats.gold} Gold
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {shopItems.map(item => {
                    const Icon = item.icon || Gift
                    const canAfford = stats.gold >= item.price
                    return (
                      <div
                        key={item.id}
                        className={`relative rounded-2xl border p-6 backdrop-blur-xl transition-all hover:scale-105 ${
                          canAfford
                            ? isDark ? 'border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-pink-500/10' : 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50'
                            : isDark ? 'border-white/12 bg-white/6 opacity-60' : 'border-white/80 bg-white opacity-60'
                        }`}
                      >
                        <div className={`w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-4 mx-auto shadow-lg`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className={`text-lg font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-slate-900'}`}>
                          {item.name}
                        </h3>
                        <p className={`text-sm text-center mb-4 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Coins className="w-5 h-5 text-yellow-500" />
                            <span className={`font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
                              {item.price}
                            </span>
                          </div>
                          <button
                            disabled={!canAfford}
                            className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                              canAfford
                                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                                : 'bg-slate-400 text-white cursor-not-allowed'
                            }`}
                          >
                            {canAfford ? 'Purchase' : 'Insufficient Gold'}
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Rewards
