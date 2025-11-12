import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  BookOpen, 
  Users, 
  Shield, 
  Target, 
  Clock, 
  TrendingUp,
  Calendar,
  Star,
  Award,
  Activity,
  Play,
  Settings,
  Trophy,
  Zap
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { getUserStats } from '../services/userStats'
import { getUserRecentActivities, formatTimestamp, ACTIVITY_TYPES } from '../services/userActivity'

const Dashboard = () => {
  const { user } = useSimpleAuth()
  const [userStats, setUserStats] = useState({
    studyHours: 0,
    sessionsTutored: 0,
    rating: 0,
    badgesEarned: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.id) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // 加载统计数据
      const statsResult = await getUserStats(user?.id)
      if (statsResult.success) {
        setUserStats(statsResult.stats)
      }
      
      // 加载最近活动
      const activitiesResult = await getUserRecentActivities(user?.id, 6)
      if (activitiesResult.success) {
        setRecentActivities(activitiesResult.activities)
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // 计算今日学习时间（这里简化处理，实际应该从活动记录中计算）
  const todayStudyHours = Math.min(userStats.studyHours * 0.1, 8) // 假设今日学习时间占总时间的10%，最多8小时

  // 计算学习连续天数（这里简化处理）
  const studyStreak = Math.min(Math.floor(userStats.studyHours / 2), 30) // 简化计算

  const stats = [
    { 
      name: 'Study Hours Today', 
      value: todayStudyHours.toFixed(1), 
      icon: Clock, 
      change: `+${(todayStudyHours * 0.2).toFixed(1)}h`, 
      changeType: 'positive',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'from-blue-50 to-cyan-50',
      borderColor: 'border-blue-100'
    },
    { 
      name: 'Total Study Hours', 
      value: userStats.studyHours.toString(), 
      icon: BookOpen, 
      change: `+${userStats.studyHours * 0.1}`, 
      changeType: 'positive',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'from-green-50 to-emerald-50',
      borderColor: 'border-green-100'
    },
    { 
      name: 'Sessions Tutored', 
      value: userStats.sessionsTutored.toString(), 
      icon: Users, 
      change: userStats.sessionsTutored > 0 ? `+${userStats.sessionsTutored}` : '0', 
      changeType: userStats.sessionsTutored > 0 ? 'positive' : 'neutral',
      color: 'from-purple-500 to-pink-500',
      bgColor: 'from-purple-50 to-pink-50',
      borderColor: 'border-purple-100'
    },
    { 
      name: 'Average Rating', 
      value: userStats.rating.toString(), 
      icon: Star, 
      change: userStats.rating > 0 ? `${userStats.rating}/5` : 'No ratings', 
      changeType: userStats.rating > 4 ? 'positive' : userStats.rating > 0 ? 'neutral' : 'negative',
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'from-yellow-50 to-orange-50',
      borderColor: 'border-yellow-100'
    }
  ]

  const quickActions = [
    { 
      title: 'Find a Tutor', 
      description: 'Get help with your subjects', 
      icon: Users, 
      link: '/tutoring', 
      gradient: 'from-blue-500 to-purple-500',
      bgGradient: 'from-blue-50 to-purple-50'
    },
    { 
      title: 'Start Focus Mode', 
      description: 'Block distractions while studying', 
      icon: Shield, 
      link: '/focus-mode', 
      gradient: 'from-green-500 to-emerald-500',
      bgGradient: 'from-green-50 to-emerald-50'
    },
    { 
      title: 'View Missions', 
      description: 'Complete challenges for rewards', 
      icon: Target, 
      link: '/missions', 
      gradient: 'from-purple-500 to-pink-500',
      bgGradient: 'from-purple-50 to-pink-50'
    },
    { 
      title: 'View Profile', 
      description: 'Manage your account and progress', 
      icon: Award, 
      link: '/profile', 
      gradient: 'from-orange-500 to-red-500',
      bgGradient: 'from-orange-50 to-red-50'
    }
  ]

  const getActivityIcon = (activityType) => {
    switch (activityType) {
      case ACTIVITY_TYPES.STUDY_SESSION:
        return BookOpen
      case ACTIVITY_TYPES.TUTORING_SESSION:
        return Users
      case ACTIVITY_TYPES.BADGE_EARNED:
        return Award
      case ACTIVITY_TYPES.FOCUS_MODE:
        return Shield
      case ACTIVITY_TYPES.GROUP_JOINED:
        return Users
      default:
        return Activity
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Activity className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Dashboard</h3>
          <p className="text-gray-600 text-sm">Loading your information...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Welcome back, {user?.name || 'Student'}!
          </h1>
          <p className="text-gray-600 text-lg">
            {userStats.studyHours > 0 
              ? `You've studied ${userStats.studyHours} hours total. Keep up the great work!`
              : "Ready to start your learning journey? Let's begin!"
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className={`group bg-gradient-to-br from-white to-${stat.bgColor.split(' ')[1]} rounded-2xl shadow-lg border border-${stat.borderColor} p-6 text-center hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden relative`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full -translate-y-10 translate-x-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full translate-y-8 -translate-x-8"></div>
                </div>
                
                <div className="relative z-10">
                  <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium mb-2">{stat.name}</div>
                  <div className={`text-sm font-medium ${
                    stat.changeType === 'positive' ? 'text-green-600' : 
                    stat.changeType === 'negative' ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Recent Activity */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
                  <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <Activity className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Recent Activity</h2>
                  </div>
                  <Link to="/profile" className="bg-white/20 backdrop-blur-sm border border-white/30 text-white px-4 py-2 rounded-xl hover:bg-white/30 transition-all duration-200 text-sm font-medium">
                    View all
                  </Link>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => {
                      const Icon = getActivityIcon(activity.activityType)
                      return (
                        <div key={activity.id || index} className="group bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 border border-gray-100 hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg">
                                <Icon className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">{activity.description}</p>
                              <p className="text-sm text-gray-500 mt-1">{formatTimestamp(activity.timestamp)}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-gradient-to-r from-gray-300 to-gray-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-700 mb-2">No recent activity</h4>
                      <p className="text-gray-500">Start studying to see your activity here!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Study Progress */}
          <div>
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-6 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white rounded-full -translate-y-12 translate-x-12"></div>
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white rounded-full translate-y-10 -translate-x-10"></div>
                </div>
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <h2 className="text-xl font-bold text-white">Study Progress</h2>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Badges Earned</h3>
                      <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">{userStats.badgesEarned}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 shadow-lg"
                        style={{ width: `${Math.min((userStats.badgesEarned / 10) * 100, 100)}%` }}
                      ></div>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Keep earning badges to unlock rewards!</p>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-gray-900">Tutoring Sessions</h3>
                      <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{userStats.sessionsTutored}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {userStats.sessionsTutored > 0 
                        ? `Great job helping others learn!`
                        : `Start tutoring to help other students.`
                      }
                    </p>
                  </div>
                </div>
                
                <Link 
                  to="/profile" 
                  className="block mt-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium py-3 px-6 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 transform"
                >
                  View detailed progress
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              Quick Actions
            </h2>
            <p className="text-gray-600">Jump into your favorite activities</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Link key={index} to={action.link} className="group bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-105 overflow-hidden relative">
                  {/* Background Pattern */}
                  <div className="absolute inset-0 opacity-5">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full -translate-y-10 translate-x-10"></div>
                    <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full translate-y-8 -translate-x-8"></div>
                  </div>
                  
                  <div className="relative z-10 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${action.gradient} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2 text-lg">{action.title}</h3>
                    <p className="text-gray-600 text-sm">{action.description}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        {/* Study Streak */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-3xl shadow-2xl p-8 text-white relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
            <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-white rounded-full"></div>
          </div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">Study Streak</h2>
                <p className="text-blue-100 mb-4 text-lg">
                  {studyStreak > 0 
                    ? `Keep up the great work! You're on a ${studyStreak}-day streak.`
                    : "Start your learning journey today!"
                  }
                </p>
                <div className="flex items-center space-x-2">
                  {[...Array(Math.min(studyStreak, 7))].map((_, index) => (
                    <div key={index} className="w-4 h-4 bg-white rounded-full shadow-lg"></div>
                  ))}
                  {[...Array(Math.max(0, 7 - studyStreak))].map((_, index) => (
                    <div key={index + studyStreak} className="w-4 h-4 bg-white bg-opacity-30 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-5xl font-bold mb-2">{studyStreak}</div>
              <div className="text-blue-100 text-lg">days</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard