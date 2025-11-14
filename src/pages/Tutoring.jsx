import React, { useState, useEffect } from 'react'
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  MessageCircle,
  Video,
  MapPin,
  BookOpen,
  Calculator,
  Atom,
  Globe,
  Music,
  Paintbrush,
  Code,
  UserPlus,
  Settings,
  Loader,
  User
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useTheme } from '../contexts/ThemeContext'
import { getAllTutors, searchTutors, createTutoringSession, checkExistingRequest } from '../services/tutorService'
import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase/config'
import { requestSession } from '../services/sessionService'
import TutorProfileSetup from '../components/TutorProfileSetup'
import SessionRequestModal from '../components/SessionRequestModal'
import TutorProfileModal from '../components/TutorProfileModal'
import TutorReviewsModal from '../components/TutorReviewsModal'
import RealVideoCall from '../components/RealVideoCall'
import { useNotification } from '../contexts/NotificationContext'
import Avatar from '../components/Avatar'
import { useNavigate } from 'react-router-dom'
import { isUserOnline } from '../services/presenceService'
// removed debug: testFirebaseConnection

const Tutoring = () => {
  const { user } = useSimpleAuth()
  const { theme, isDark } = useTheme()
  const { showSuccess, showError } = useNotification()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('all')
  const [allTutors, setAllTutors] = useState([]) // 存储所有tutors（实时监听）
  const [tutors, setTutors] = useState([]) // 显示筛选后的tutors
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [filters, setFilters] = useState({
    minRating: 0,
    maxPrice: 100,
    availableOnly: true
  })
  const [showTutorSetup, setShowTutorSetup] = useState(false)
  const [showSessionRequest, setShowSessionRequest] = useState(false)
  const [showTutorProfile, setShowTutorProfile] = useState(false)
  const [showTutorReviews, setShowTutorReviews] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState(null)
  const [userIsTutor, setUserIsTutor] = useState(false)
  const [tutorRequestStatus, setTutorRequestStatus] = useState({}) // 跟踪每个导师的请求状态
  const [showVideoCall, setShowVideoCall] = useState(false)
  const [videoCallSession, setVideoCallSession] = useState(null)

  useEffect(() => {
    loadTutors()
    checkUserTutorStatus()
  }, [user])

  // 实时监听tutor列表变化
  useEffect(() => {
    let unsubscribe = null

    const cleanup = () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        try {
          console.log('🔄 Cleaning up tutor list listener')
          unsubscribe()
        } catch (error) {
          console.error('Error cleaning up tutor list listener:', error)
        }
      }
    }

    if (!user?.id) {
      return cleanup
    }

    console.log('🔄 Setting up real-time tutor list listener')
    
    // 监听users集合的变化，过滤出tutors
    const usersRef = collection(db, 'users')
    unsubscribe = onSnapshot(usersRef, (snapshot) => {
      const tutorsList = []
      snapshot.forEach((doc) => {
        try {
          const userData = doc.data()
          if (userData && userData.isTutor && userData.tutorProfile && doc.id !== user?.id) {
            const online = isUserOnline(userData)
            // 确保subjects有数据，如果没有则使用specialties作为fallback
            const subjects = userData.subjects && userData.subjects.length > 0 
              ? userData.subjects 
              : (userData.tutorProfile?.specialties || [])
            
            tutorsList.push({
              id: doc.id,
              name: userData.name || 'Unknown',
              email: userData.email || '',
              school: userData.school || '',
              grade: userData.grade || '',
              bio: userData.bio || '',
              avatar: userData.avatar || '',
              tutorProfile: userData.tutorProfile || {},
              subjects: subjects,
              specialties: userData.tutorProfile?.specialties || [],
              description: userData.tutorProfile?.description || '',
              isAvailable: userData.tutorProfile?.isAvailable || false,
              isOnline: online,
              stats: {
                totalSessions: 0,
                completedSessions: 0,
                averageRating: 0,
                ratingCount: 0
              }
            })
          }
        } catch (error) {
          console.error('❌ Error processing user data:', error, 'Doc ID:', doc.id)
        }
      })
      
      setAllTutors(tutorsList)
      setLoading(false)
    }, (error) => {
      console.error('❌ Error listening to tutors:', error)
      setLoading(false)
    })
    
    return cleanup
  }, [user?.id])

  // 当用户状态变化时重新加载导师列表
  useEffect(() => {
    if (user?.id) {
      loadTutors()
    }
  }, [user?.isTutor])

  useEffect(() => {
    // 当导师列表加载完成后，检查每个导师的请求状态
    if (tutors.length > 0 && user?.id) {
      checkAllTutorRequestStatus()
    }
  }, [tutors, user])

  useEffect(() => {
    // 当搜索条件改变时重新搜索
    const timeoutId = setTimeout(() => {
      performSearch()
    }, 300) // 防抖

    return () => clearTimeout(timeoutId)
  }, [searchQuery, selectedSubject, filters, allTutors, user?.id])

  const loadTutors = async () => {
    try {
      setLoading(true)
      console.log('🔄 Loading tutors with fresh data...')
      const result = await getAllTutors()
      if (result.success) {
        // 如果当前用户是导师，过滤掉自己
        let filteredTutors = result.tutors
        console.log('📊 All tutors with stats:', result.tutors.map(t => ({ 
          id: t.id, 
          name: t.name, 
          rating: t.rating, 
          stats: t.stats,
          averageRating: t.stats?.averageRating,
          totalRating: t.stats?.totalRating,
          ratingCount: t.stats?.ratingCount
        })))
        
        // 检查是否有导师有评分
        const tutorsWithRatings = result.tutors.filter(t => t.rating > 0 || t.stats?.ratingCount > 0)
        console.log('🎯 Tutors with ratings:', tutorsWithRatings.length, tutorsWithRatings.map(t => ({
          id: t.id,
          name: t.name,
          rating: t.rating,
          ratingCount: t.stats?.ratingCount,
          totalRating: t.stats?.totalRating
        })))
        
        console.log('Current user:', user?.id, user?.name, 'isTutor:', user?.isTutor)
        
        if (user?.isTutor) {
          const beforeCount = filteredTutors.length
          filteredTutors = result.tutors.filter(tutor => tutor.id !== user?.id)
          console.log(`Filtered out self: ${beforeCount} -> ${filteredTutors.length} tutors`)
        }
        setAllTutors(filteredTutors)
      } else {
        console.error('Failed to load tutors:', result.error)
        setAllTutors([])
      }
    } catch (error) {
      console.error('Error loading tutors:', error)
      setAllTutors([])
    } finally {
      setLoading(false)
    }
  }

  const checkUserTutorStatus = () => {
    console.log('Checking user tutor status:', user)
    if (user?.isTutor) {
      setUserIsTutor(true)
      console.log('User is a tutor')
    } else {
      setUserIsTutor(false)
      console.log('User is not a tutor')
    }
  }

  const checkAllTutorRequestStatus = async () => {
    if (!user?.id) return

    const statusMap = {}
    for (const tutor of tutors) {
      try {
        const result = await checkExistingRequest(user?.id, tutor.id)
        if (result.success) {
          statusMap[tutor.id] = {
            hasRequest: result.hasExistingRequest,
            status: result.existingSession?.status || null
          }
        }
      } catch (error) {
        console.error(`Error checking request status for tutor ${tutor.id}:`, error)
        statusMap[tutor.id] = { hasRequest: false, status: null }
      }
    }
    setTutorRequestStatus(statusMap)
  }

  const performSearch = async () => {
    try {
      // 从allTutors中筛选，而不是调用API
      let filteredTutors = [...allTutors]
      
      // 如果当前用户是导师，过滤掉自己
      if (user?.isTutor) {
        filteredTutors = filteredTutors.filter(tutor => tutor.id !== user?.id)
      }
      
      // 应用科目筛选
      if (selectedSubject && selectedSubject !== 'all') {
        const subjectFilter = selectedSubject.toLowerCase()
        filteredTutors = filteredTutors.filter(tutor => {
          if (!tutor.subjects || tutor.subjects.length === 0) return false
          
          // 检查subjects数组和specialties数组
          const allSubjects = [
            ...(tutor.subjects || []),
            ...(tutor.specialties || [])
          ]
          
          return allSubjects.some(subject => {
            const subjectLower = subject.toLowerCase()
            // 精确匹配或包含匹配
            return subjectLower === subjectFilter || 
                   subjectLower.includes(subjectFilter) ||
                   subjectFilter.includes(subjectLower)
          })
        })
      }
      
      // 应用搜索查询
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredTutors = filteredTutors.filter(tutor => 
          tutor.name.toLowerCase().includes(query) ||
          (tutor.specialties || []).some(specialty => specialty.toLowerCase().includes(query)) ||
          (tutor.description || '').toLowerCase().includes(query)
        )
      }
      
      // 应用评分筛选
      if (filters.minRating) {
        filteredTutors = filteredTutors.filter(tutor => (tutor.rating || 0) >= filters.minRating)
      }
      
      // 应用可用性筛选
      if (filters.availableOnly) {
        filteredTutors = filteredTutors.filter(tutor => tutor.isAvailable)
      }
      
      setTutors(filteredTutors)
    } catch (error) {
      console.error('Error searching tutors:', error)
    }
  }

  const handleRequestSession = (tutor) => {
    if (!user) {
      showError('Please log in to request a tutoring session', 5000, 'Login Required')
      return
    }

    // 检查是否已经有请求
    const requestInfo = tutorRequestStatus[tutor.id]
    if (requestInfo?.hasRequest) {
      const statusText = {
        'pending': 'Request Pending',
        'accepted': 'Request Accepted',
        'declined': 'Request Declined'
      }
      showError(`You already have a ${statusText[requestInfo.status] || 'request'} with this tutor`, 5000, 'Request Exists')
      return
    }

    setSelectedTutor(tutor)
    setShowSessionRequest(true)
  }

  const handleViewProfile = (tutor) => {
    setSelectedTutor(tutor)
    setShowTutorProfile(true)
  }

  // removed debug testFirebase

  const handleSubmitSessionRequest = async (formData) => {
    try {
      console.log('Submitting session request with data:', {
        studentId: user?.id,
        tutorId: selectedTutor.id,
        subject: formData.subject,
        scheduledTime: formData.preferredTime,
        message: formData.description
      })

      // 使用新的sessionService来创建会话请求
      const result = await requestSession(
        user?.id, 
        selectedTutor.id, 
        formData.subject, 
        formData.preferredTime || null,
        formData.description
      )

      console.log('Session request result:', result)

      if (result.success) {
        showSuccess('Tutoring session request sent successfully! Check your Student Dashboard to track the status.', 5000, 'Request Sent')
        // 更新请求状态
        setTutorRequestStatus(prev => ({
          ...prev,
          [selectedTutor.id]: { hasRequest: true, status: 'pending' }
        }))
      } else {
        showError(`Failed to send request: ${result.error}`, 5000, 'Request Failed')
      }
    } catch (error) {
      showError('An error occurred while sending the request', 5000, 'Error')
      console.error('Error requesting session:', error)
    }
  }

  const subjects = [
    { id: 'all', name: 'All Subjects', icon: BookOpen },
    { id: 'math', name: 'Mathematics', icon: Calculator },
    { id: 'science', name: 'Science', icon: Atom },
    { id: 'physics', name: 'Physics', icon: Atom },
    { id: 'chemistry', name: 'Chemistry', icon: Atom },
    { id: 'biology', name: 'Biology', icon: Atom },
    { id: 'english', name: 'English', icon: Globe },
    { id: 'history', name: 'History', icon: BookOpen },
    { id: 'art', name: 'Art', icon: Paintbrush },
    { id: 'music', name: 'Music', icon: Music },
    { id: 'programming', name: 'Programming', icon: Code }
  ]

  const getSubjectIcon = (subject) => {
    const subjectData = subjects.find(s => s.name === subject)
    return subjectData ? subjectData.icon : BookOpen
  }

  const getAvailabilityColor = (isAvailable) => {
    return isAvailable ? 'text-green-600' : 'text-red-600'
  }

  const getAvailabilityText = (isAvailable) => {
    return isAvailable ? 'Available' : 'Busy'
  }

  const startVideoCall = (tutor) => {
    const sessionData = {
      subject: 'Tutoring Session',
      tutor: tutor,
      student: user
    }
    setVideoCallSession(sessionData)
    setShowVideoCall(true)
  }

  const getRequestButtonInfo = (tutor) => {
    const requestInfo = tutorRequestStatus[tutor.id]
    
    if (!requestInfo?.hasRequest) {
      return {
        text: 'Request Session',
        disabled: false,
        className: 'flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm flex items-center justify-center'
      }
    }

    const statusConfig = {
      'pending': {
        text: 'Request Pending...',
        disabled: true,
        className: 'flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg cursor-not-allowed text-sm flex items-center justify-center'
      },
      'accepted': {
        text: 'Start Session',
        disabled: false,
        className: 'flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm flex items-center justify-center'
      },
      'declined': {
        text: 'Request Declined',
        disabled: true,
        className: 'flex-1 bg-red-500 text-white py-2 px-4 rounded-lg cursor-not-allowed text-sm flex items-center justify-center'
      }
    }

    return statusConfig[requestInfo.status] || statusConfig.pending
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute top-40 left-40 w-60 h-60 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        </div>
        
        <div className="relative z-10 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-blue-500 rounded-2xl blur-lg opacity-30"></div>
            <div className="relative w-20 h-20 bg-gradient-to-r from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
              <Search className="w-10 h-10 text-white animate-pulse" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">Loading Tutors</h3>
          <p className="text-white/70 text-lg">Finding the best tutors for you...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-[#12092b] via-[#180d3d] to-[#090617] text-white' 
        : 'bg-gradient-to-br from-indigo-100 via-purple-100 to-rose-100 text-slate-900'
    }`}>
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 left-1/2 w-80 h-80 -translate-x-1/2 rounded-full bg-purple-500/30 blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-pink-400/20 blur-3xl"></div>
        <div className="absolute top-1/2 left-10 w-60 h-60 rounded-full bg-blue-400/20 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-14">
        {/* Hero + Filters */}
        <section className="grid gap-8 lg:grid-cols-[minmax(0,58%)_minmax(0,42%)]">
          <div className={`rounded-[32px] border px-8 py-9 shadow-2xl backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-gradient-to-br from-white/10 via-white/5 to-transparent/40' : 'border-white/70 bg-white'
          }`}>
            <div className="inline-flex items-center gap-2 rounded-full bg-purple-500/10 px-3.5 py-2 text-xs font-semibold text-purple-500">
              <Search className="h-4 w-4" /> Find your mentor
            </div>
            <h1 className="mt-4 text-3xl font-black tracking-tight md:text-4xl">
              Discover experienced tutors tailored to your learning goals
            </h1>
            <p className={`mt-3 max-w-xl text-sm md:text-base ${
              isDark ? 'text-white/70' : 'text-slate-600'
            }`}>
              Browse curated student mentors, view their expertise, and request personalised sessions. Switch realms, adjust filters, and see real-time availability to craft your ideal study plan.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className={`rounded-3xl border px-4 py-4 ${
                isDark ? 'border-white/10 bg-white/6' : 'border-slate-200 bg-white'
              }`}>
                <p className="text-xs uppercase tracking-wide text-purple-400">1-on-1 Sessions</p>
                <p className={`mt-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Tailored learning experiences</p>
              </div>
              <div className={`rounded-3xl border px-4 py-4 ${
                isDark ? 'border-white/10 bg-white/6' : 'border-slate-200 bg-white'
              }`}>
                <p className="text-xs uppercase tracking-wide text-purple-400">Diverse mentors</p>
                <p className={`mt-1 text-sm font-semibold ${isDark ? 'text-white' : 'text-slate-800'}`}>Language, STEM, humanities & business experts</p>
              </div>
            </div>
          </div>

          <div className={`rounded-[32px] border px-6 py-6 shadow-lg backdrop-blur-xl ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/12 via-white/6 to-transparent/30' : 'border-white/70 bg-white'
          }`}>
            <div className="space-y-4">
              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>Search mentors</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search tutors, subjects, or specialties"
                    className={`w-full rounded-2xl border px-4 py-3 text-sm transition-colors ${
                      isDark ? 'border-white/10 bg-white/10 text-white placeholder-white/50 focus:border-purple-400' : 'border-slate-200 bg-white text-slate-800 focus:border-purple-400'
                    }`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-purple-400" />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
                  isDark ? 'text-white/70' : 'text-slate-600'
                }`}>Subject focus</label>
                <select
                  className={`w-full rounded-2xl border px-4 py-3 text-sm transition-colors ${
                    isDark ? 'border-white/10 bg-white/10 text-white focus:border-purple-400' : 'border-slate-200 bg-white text-slate-800 focus:border-purple-400'
                  }`}
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                >
                  {subjects.map(subject => (
                    <option key={subject.id} value={subject.id} className={isDark ? 'bg-slate-900 text-white' : ''}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold uppercase tracking-wide ${
                  isDark ? 'text-white/60' : 'text-slate-600'
                }`}>Advanced filters</span>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="text-sm font-semibold text-purple-500 hover:text-purple-400 transition-colors"
                >
                  {showFilters ? 'Hide' : 'Show'} filters
                </button>
              </div>

              {showFilters && (
                <div className={`rounded-2xl border px-4 py-4 space-y-4 ${
                  isDark ? 'border-white/10 bg-white/6' : 'border-slate-200 bg-white'
                }`}>
                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
                      isDark ? 'text-white/60' : 'text-slate-600'
                    }`}>Minimum rating</label>
                    <select
                      className={`w-full rounded-2xl border px-3 py-2 text-sm ${
                        isDark ? 'border-white/10 bg-white/8 text-white' : 'border-slate-200 bg-white text-slate-800'
                      }`}
                      value={filters.minRating}
                      onChange={(e) => setFilters({ ...filters, minRating: parseFloat(e.target.value) })}
                    >
                      <option value={0}>Any rating</option>
                      <option value={3}>3+ stars</option>
                      <option value={4}>4+ stars</option>
                      <option value={4.5}>4.5+ stars</option>
                    </select>
                  </div>

                  <div>
                    <label className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
                      isDark ? 'text-white/60' : 'text-slate-600'
                    }`}>Max price</label>
                    <select
                      className={`w-full rounded-2xl border px-3 py-2 text-sm ${
                        isDark ? 'border-white/10 bg-white/8 text-white' : 'border-slate-200 bg-white text-slate-800'
                      }`}
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: parseInt(e.target.value) })}
                    >
                      <option value={100}>Any price</option>
                      <option value={20}>Under $20/hour</option>
                      <option value={30}>Under $30/hour</option>
                      <option value={50}>Under $50/hour</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3 text-sm font-medium">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-purple-400 text-purple-500 focus:ring-purple-200"
                      checked={filters.availableOnly}
                      onChange={(e) => setFilters({ ...filters, availableOnly: e.target.checked })}
                    />
                    <span className={isDark ? 'text-white/70' : 'text-slate-600'}>Available tutors only</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Quick stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className={`rounded-3xl border px-5 py-5 shadow-lg backdrop-blur ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/10 via-white/4 to-transparent/40' : 'border-white/70 bg-white'
          }`}>
            <div className="text-xs uppercase tracking-wide text-purple-400">Available mentors</div>
            <div className={`mt-2 text-3xl font-bold ${isDark ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]' : 'text-slate-900'}`}>{tutors.length}</div>
            <p className={`mt-1 text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Ready for sessions</p>
          </div>
          <div className={`rounded-3xl border px-5 py-5 shadow-lg backdrop-blur ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/10 via-white/4 to-transparent/40' : 'border-white/70 bg-white'
          }`}>
            <div className="text-xs uppercase tracking-wide text-purple-400">Total experience</div>
            <div className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {tutors.reduce((sum, tutor) => sum + (tutor.stats?.totalSessions || 0), 0)}
            </div>
            <p className={`mt-1 text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Sessions completed</p>
          </div>
          <div className={`rounded-3xl border px-5 py-5 shadow-lg backdrop-blur ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/10 via-white/4 to-transparent/40' : 'border-white/70 bg-white'
          }`}>
            <div className="text-xs uppercase tracking-wide text-purple-400">Average rating</div>
            <div className={`mt-2 text-3xl font-bold ${isDark ? 'text-white' : 'text-slate-900'}`}>
              {(() => {
                const ratedTutors = tutors.filter(tutor => tutor.rating > 0)
                return ratedTutors.length > 0
                  ? `${(ratedTutors.reduce((sum, tutor) => sum + tutor.rating, 0) / ratedTutors.length).toFixed(1)}/5`
                  : 'No ratings yet'
              })()}
            </div>
            <p className={`mt-1 text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Based on student feedback</p>
          </div>
          <div className={`rounded-3xl border px-5 py-5 shadow-lg backdrop-blur ${
            isDark ? 'border-white/12 bg-gradient-to-br from-white/10 via-white/4 to-transparent/40' : 'border-white/70 bg-white'
          }`}>
            <div className="text-xs uppercase tracking-wide text-purple-400">Currently online</div>
            <div className={`mt-2 text-3xl font-bold ${isDark ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.25)]' : 'text-slate-900'}`}>{tutors.filter(tutor => tutor.isAvailable).length}</div>
            <p className={`mt-1 text-xs ${isDark ? 'text-white/60' : 'text-slate-500'}`}>Available now</p>
          </div>
        </section>

        {/* Tutors grid */}
        {tutors.length > 0 ? (
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-6">
            {tutors.map(tutor => {
              const SubjectIcon = getSubjectIcon((tutor.subjects && tutor.subjects[0]) || 'General')
              const buttonInfo = getRequestButtonInfo(tutor)
              const requestInfo = tutorRequestStatus[tutor.id]
              const isAccepted = requestInfo?.status === 'accepted'

              return (
                <div key={tutor.id} className={`rounded-[28px] border px-6 py-6 backdrop-blur-xl transition-transform hover:-translate-y-1 hover:shadow-2xl ${
                  isDark ? 'border-white/12 bg-gradient-to-br from-white/10 via-white/4 to-transparent/35' : 'border-white/70 bg-white'
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar user={tutor} size="xl" className="shadow-lg" />
                      <div>
                        <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-slate-900'}`}>{tutor.name}</h3>
                        <div className={`mt-1 inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                          !tutor.isOnline
                            ? 'bg-gray-500/10 text-gray-500'
                            : tutor.isAvailable
                            ? 'bg-green-500/10 text-green-500'
                            : 'bg-slate-500/10 text-slate-400'
                        }`}>
                          {!tutor.isOnline ? 'Offline' : tutor.isAvailable ? 'Available' : 'Busy'}
                        </div>
                      </div>
                    </div>
                    <div className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      isDark ? 'bg-white/10 text-white/80' : 'bg-purple-50 text-purple-600'
                    }`}>
                      Studiply Pass
                    </div>
                  </div>

                  <p className={`mt-4 text-sm leading-relaxed ${
                    isDark ? 'text-white/80' : 'text-slate-600'
                  }`}>{tutor.description}</p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {(() => {
                      // 优先显示subjects，如果没有则显示specialties
                      const displaySubjects = (tutor.subjects && tutor.subjects.length > 0) 
                        ? tutor.subjects 
                        : (tutor.specialties || [])
                      
                      return displaySubjects.slice(0, 3).map((subject, index) => (
                        <span key={index} className={`rounded-full px-3 py-1 text-xs font-medium ${
                          isDark ? 'bg-white/10 text-white/70' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {subject}
                        </span>
                      ))
                    })()}
                  </div>

                  <div className="mt-5 flex items-center justify-between text-sm">
                    <div className={`flex items-center gap-2 ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
                      <Clock className="h-4 w-4" />
                      <span>{tutor.tutorProfile?.responseTime || 'Responds within a day'}</span>
                    </div>
                    <div className={`flex items-center gap-2 ${isDark ? 'text-white/80' : 'text-slate-600'}`}>
                      <Star className="h-4 w-4 text-yellow-400" />
                      <span>{tutor.rating ? tutor.rating.toFixed(1) : 'New tutor'}</span>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center gap-3">
                    <button
                      onClick={() => navigate(`/chat-tutor/${tutor.id}`, { state: { from: 'tutoring' } })}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                        isDark 
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5' 
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5'
                      }`}
                    >
                      <MessageCircle className="h-4 w-4 inline-block mr-2" />
                      Chat
                    </button>
                    <button
                      onClick={() => {
                        if (isAccepted) {
                          startVideoCall(tutor)
                        } else if (!buttonInfo.disabled) {
                          handleRequestSession(tutor)
                        }
                      }}
                      disabled={buttonInfo.disabled}
                      className={`flex-1 rounded-2xl px-4 py-3 text-sm font-semibold transition-all ${
                        isAccepted
                          ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30'
                          : buttonInfo.disabled
                            ? 'bg-slate-600/30 text-slate-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/30 hover:-translate-y-0.5'
                      }`}
                    >
                      {isAccepted ? 'Join session' : buttonInfo.text}
                    </button>
                    <button
                      onClick={() => {
                        setSelectedTutor(tutor)
                        setShowTutorReviews(true)
                      }}
                      className={`rounded-2xl px-4 py-3 text-sm font-semibold ${
                        isDark ? 'bg-white/10 text-white hover:bg-white/15' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      Reviews
                    </button>
                  </div>
                </div>
              )
            })}
          </section>
        ) : (
          <section className={`rounded-[32px] border px-8 py-16 text-center backdrop-blur-xl ${
            isDark ? 'border-white/10 bg-white/6' : 'border-white/70 bg-white'
          }`}>
            <div className="text-5xl mb-4">🔍</div>
            <h3 className={`text-2xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>No tutors found</h3>
            <p className={isDark ? 'text-white/60' : 'text-slate-600'}>Try adjusting your search or filters to discover more mentors.</p>
            <button
              onClick={() => {
                setSearchQuery('')
                setSelectedSubject('all')
                setFilters({ minRating: 0, maxPrice: 100, availableOnly: true })
              }}
              className="mt-6 rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-500/30"
            >
              Reset filters
            </button>
          </section>
        )}
      </div>

      {/* Tutor profile setup and modals remain unchanged */}
      {showTutorSetup && (
        <TutorProfileSetup
          user={user}
          onClose={() => setShowTutorSetup(false)}
          onSuccess={() => {
            loadTutors()
            checkUserTutorStatus()
          }}
        />
      )}

      {showSessionRequest && selectedTutor && (
        <SessionRequestModal
          tutor={selectedTutor}
          isOpen={showSessionRequest}
          onClose={() => {
            setShowSessionRequest(false)
            setSelectedTutor(null)
          }}
          onSubmit={handleSubmitSessionRequest}
        />
      )}

      {showTutorProfile && selectedTutor && (
        <TutorProfileModal
          tutor={selectedTutor}
          isOpen={showTutorProfile}
          onClose={() => {
            setShowTutorProfile(false)
            setSelectedTutor(null)
          }}
        />
      )}

      {showTutorReviews && selectedTutor && (
        <TutorReviewsModal
          tutor={selectedTutor}
          isOpen={showTutorReviews}
          onClose={() => {
            setShowTutorReviews(false)
            setSelectedTutor(null)
          }}
        />
      )}

      {showVideoCall && videoCallSession && (
        <RealVideoCall
          isOpen={showVideoCall}
          onClose={() => {
            setShowVideoCall(false)
            setVideoCallSession(null)
          }}
          sessionData={videoCallSession}
          user={user}
        />
      )}
    </div>
  )
}

export default Tutoring