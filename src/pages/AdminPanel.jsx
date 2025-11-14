import React, { useState, useEffect } from 'react'
import { 
  Users, 
  UserX, 
  Shield, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  Star,
  BookOpen,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  MapPin,
  MessageSquare,
  Trash2,
  Settings,
  Database,
  FileText,
  ThumbsUp,
  ThumbsDown,
  X
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToDate, formatTimestamp } from '../utils/timestampUtils'
import { getTutorRatingStats } from '../services/ratingService'
import { 
  getQuestRequestsByStatus, 
  approveQuestRequest, 
  rejectQuestRequest 
} from '../services/questRequestService'
import { deleteAllMessages } from '../services/chatService'
import Avatar from '../components/Avatar'
import TutorReviews from '../components/TutorReviews'
import TutorReviewsModal from '../components/TutorReviewsModal'
import AdminDeleteModal from '../components/AdminDeleteModal'

const AdminPanel = () => {
  const { user, logout } = useSimpleAuth()
  const { showError, showSuccess } = useNotification()
  const navigate = useNavigate()
  const { toggleTheme } = useTheme()
  const [activeTab, setActiveTab] = useState('tutor-accounts')
  const [tutors, setTutors] = useState([])
  const [allUsers, setAllUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const [showReviews, setShowReviews] = useState(false)
  const [selectedTutor, setSelectedTutor] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteItem, setDeleteItem] = useState(null)
  const [deleteType, setDeleteType] = useState('')
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [questRequests, setQuestRequests] = useState([])
  const [questRequestStatus, setQuestRequestStatus] = useState('pending')
  const [selectedQuestRequest, setSelectedQuestRequest] = useState(null)
  const [showQuestRequestModal, setShowQuestRequestModal] = useState(false)
  const [rejectionReason, setRejectionReason] = useState('')
  const [questRequestLoading, setQuestRequestLoading] = useState(false)
  const [questRequestsLoading, setQuestRequestsLoading] = useState(false)

  // 检查管理员权限
  const isAdmin = user?.email === 'studiply.email@gmail.com'

  useEffect(() => {
    if (user) {
      console.log('✅ Admin access granted, loading data...')
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setLoading(true)
    try {
      await Promise.all([
        loadTutors(),
        loadAllUsers(),
        loadQuestRequests()
      ])
    } catch (error) {
      console.error('❌ Error loading data:', error)
      showError('Failed to load data', 'Error')
    } finally {
      setLoading(false)
    }
  }

  const loadQuestRequests = async () => {
    setQuestRequestsLoading(true)
    try {
      console.log('🔍 Loading quest requests with status:', questRequestStatus)
      const result = await getQuestRequestsByStatus(questRequestStatus)
      console.log('📊 Quest requests result:', result)
      if (result.success) {
        console.log(`✅ Loaded ${result.requests?.length || 0} quest requests`)
        setQuestRequests(result.requests || [])
      } else {
        console.error('❌ Error loading quest requests:', result.error)
        showError(result.error || 'Failed to load quest requests', 'Error')
        setQuestRequests([])
      }
    } catch (error) {
      console.error('❌ Error loading quest requests:', error)
      showError('An error occurred while loading quest requests', 'Error')
      setQuestRequests([])
    } finally {
      setQuestRequestsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'requests') {
      loadQuestRequests()
    }
  }, [activeTab, questRequestStatus])

  const loadTutors = async () => {
    console.log('🔍 Loading all tutors for admin...')
    
    // 获取所有用户，然后客户端过滤tutors
    const usersRef = collection(db, 'users')
    const q = query(usersRef)
    const querySnapshot = await getDocs(q)
    
    console.log('📊 Total users found:', querySnapshot.docs.length)
    
    const tutorsList = []
    let tutorCount = 0
    for (const docSnapshot of querySnapshot.docs) {
      const userData = docSnapshot.data()
      
      // 只处理tutor用户
      if (!userData.isTutor) {
        continue
      }
      
      tutorCount++
      console.log(`✅ Found tutor ${tutorCount}:`, userData.name)
      
      // 获取tutor统计信息
      const tutorStats = await getTutorStats(docSnapshot.id)
      
      tutorsList.push({
        id: docSnapshot.id,
        name: userData.name || 'Unknown',
        email: userData.email || 'No email',
        phone: userData.phone || 'No phone',
        school: userData.school || 'Not specified',
        grade: userData.grade || 'Not specified',
        bio: userData.bio || 'No bio',
        subjects: userData.subjects || [],
        specialties: userData.subjects || [], // 使用subjects作为specialties
        tutorProfile: userData.tutorProfile || {},
        location: userData.location || 'Online',
        avatar: userData.avatar || null,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        lastLogin: userData.lastLogin,
        isAvailable: userData.tutorProfile?.isAvailable !== false,
        description: userData.tutorProfile?.description || userData.bio || 'No description',
        experience: userData.tutorProfile?.experience || 'Student',
        responseTime: userData.tutorProfile?.responseTime || 'Not specified',
        stats: tutorStats
      })
    }
    
    console.log(`✅ Loaded ${tutorsList.length} tutors`)
    setTutors(tutorsList)
  }

  const loadAllUsers = async () => {
    console.log('🔍 Loading all users for admin...')
    
    const usersRef = collection(db, 'users')
    const q = query(usersRef)
    const querySnapshot = await getDocs(q)
    
    console.log('📊 Total users found:', querySnapshot.docs.length)
    
    const usersList = []
    for (const docSnapshot of querySnapshot.docs) {
      const userData = docSnapshot.data()
      
      const userObj = {
        id: docSnapshot.id,
        name: userData.name || 'Unknown',
        email: userData.email || 'No email',
        school: userData.school || 'Not specified',
        grade: userData.grade || 'Not specified',
        isTutor: userData.isTutor || false,
        avatar: userData.avatar || null,
        banned: userData.banned === true, // 明确检查是否为 true
        banMessage: userData.banMessage || null,
        createdAt: userData.createdAt,
        updatedAt: userData.updatedAt,
        lastLogin: userData.lastLogin
      }
      
      // 调试日志：检查封禁状态
      if (userObj.banned) {
        console.log(`🚫 Found banned user: ${userObj.name} (${userObj.email})`)
      }
      
      usersList.push(userObj)
    }
    
    const bannedCount = usersList.filter(u => u.banned).length
    console.log(`✅ Loaded ${usersList.length} users (${bannedCount} banned)`)
    setAllUsers(usersList)
  }

  const getTutorStats = async (tutorId) => {
    try {
      // 使用ratingService中的函数获取tutor统计信息
      const statsResult = await getTutorRatingStats(tutorId)
      
      if (statsResult.success) {
        return {
          totalSessions: statsResult.totalSessions || 0,
          averageRating: statsResult.averageRating || 0,
          ratingCount: statsResult.ratingCount || 0
        }
      } else {
        console.error('Error getting tutor stats:', statsResult.error)
        return {
          totalSessions: 0,
          averageRating: 0,
          ratingCount: 0
        }
      }
    } catch (error) {
      console.error('Error getting tutor stats:', error)
      return {
        totalSessions: 0,
        averageRating: 0,
        ratingCount: 0
      }
    }
  }

  // 查看tutor评价
  const handleViewReviews = (tutor) => {
    setSelectedTutor(tutor)
    setShowReviews(true)
    console.log('✅ Modal should be opening...')
  }

  // 删除tutor profile
  const handleDeleteTutor = (tutor) => {
    console.log('🗑️ Delete tutor button clicked for:', tutor.name)
    setDeleteItem(tutor)
    setDeleteType('tutor')
    setShowDeleteModal(true)
    console.log('✅ Delete modal should be opening for tutor:', tutor.name)
  }

  // 封禁账号
  const handleBanAccount = (user) => {
    console.log('🚫 Ban account button clicked for:', user.name)
    setDeleteItem(user)
    setDeleteType('account')
    setShowDeleteModal(true)
    console.log('✅ Ban modal should be opening for account:', user.name)
  }

  // 解封账号
  const handleUnbanAccount = (user) => {
    console.log('✅ Unban account button clicked for:', user.name)
    setDeleteItem(user)
    setDeleteType('unban')
    setShowDeleteModal(true)
    console.log('✅ Unban modal should be opening for account:', user.name)
  }

  // 确认删除tutor
  const confirmDeleteTutor = async () => {
    try {
      setDeleteLoading(true)
      console.log('🗑️ Deleting tutor profile:', deleteItem.id)
      
      // 1. 删除用户文档中的tutor相关信息
      const userRef = doc(db, 'users', deleteItem.id)
      await updateDoc(userRef, {
        isTutor: false,
        tutorProfile: null,
        subjects: [],
        updatedAt: serverTimestamp()
      })
      console.log('✅ User document updated - tutor profile removed')
      
      // 2. 删除tutor相关的会话数据
      const sessionsRef = collection(db, 'sessions')
      const tutorSessionsQuery = query(sessionsRef, where('tutorId', '==', deleteItem.id))
      const tutorSessionsSnapshot = await getDocs(tutorSessionsQuery)
      
      for (const sessionDoc of tutorSessionsSnapshot.docs) {
        await deleteDoc(sessionDoc.ref)
      }
      console.log(`✅ Deleted ${tutorSessionsSnapshot.docs.length} tutor sessions`)
      
      // 3. 删除tutor收到的评分数据
      const ratingsRef = collection(db, 'ratings')
      const tutorRatingsQuery = query(ratingsRef, where('tutorId', '==', deleteItem.id))
      const tutorRatingsSnapshot = await getDocs(tutorRatingsQuery)
      
      for (const ratingDoc of tutorRatingsSnapshot.docs) {
        await deleteDoc(ratingDoc.ref)
      }
      console.log(`✅ Deleted ${tutorRatingsSnapshot.docs.length} tutor ratings`)
      
      // 4. 删除导师统计数据
      const tutorStatsRef = doc(db, 'tutorStats', deleteItem.id)
      try {
        await deleteDoc(tutorStatsRef)
        console.log('✅ Tutor stats deleted')
      } catch (error) {
        console.log('ℹ️ No tutor stats to delete')
      }
      
      // 重新加载数据
      await loadTutors()
      
      // 关闭模态框
      setShowDeleteModal(false)
      setDeleteItem(null)
      setDeleteType('')
      
      console.log('✅ Tutor profile and all related data deleted successfully')
      showSuccess('Tutor profile and all related data deleted successfully', 'Success')
    } catch (error) {
      console.error('❌ Error deleting tutor profile:', error)
      showError(`Failed to delete tutor profile: ${error.message}`, 'Delete Failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  // 处理 quest 请求
  const handleApproveQuest = async (requestId) => {
    setQuestRequestLoading(true)
    try {
      const result = await approveQuestRequest(requestId, user.id)
      if (result.success) {
        showSuccess('Quest approved successfully!', 'Success')
        await loadQuestRequests()
        setShowQuestRequestModal(false)
        setSelectedQuestRequest(null)
      } else {
        showError(result.error || 'Failed to approve quest', 'Error')
      }
    } catch (error) {
      console.error('Error approving quest:', error)
      showError('An error occurred while approving the quest', 'Error')
    } finally {
      setQuestRequestLoading(false)
    }
  }

  const handleRejectQuest = async (requestId) => {
    if (!rejectionReason.trim()) {
      showError('Please provide a reason for rejection', 'Validation Error')
      return
    }
    
    setQuestRequestLoading(true)
    try {
      const result = await rejectQuestRequest(requestId, user.id, rejectionReason)
      if (result.success) {
        showSuccess('Quest rejected', 'Success')
        await loadQuestRequests()
        setShowQuestRequestModal(false)
        setSelectedQuestRequest(null)
        setRejectionReason('')
      } else {
        showError(result.error || 'Failed to reject quest', 'Error')
      }
    } catch (error) {
      console.error('Error rejecting quest:', error)
      showError('An error occurred while rejecting the quest', 'Error')
    } finally {
      setQuestRequestLoading(false)
    }
  }

  const openQuestRequestModal = (request) => {
    setSelectedQuestRequest(request)
    setShowQuestRequestModal(true)
    setRejectionReason('')
  }

  // 确认封禁账号
  const confirmBanAccount = async (banMessage = '') => {
    try {
      setDeleteLoading(true)
      console.log('🚫 Banning account:', deleteItem.id)
      console.log('📝 Ban message:', banMessage)
      
      // 标记用户为封禁状态
      const userRef = doc(db, 'users', deleteItem.id)
      await updateDoc(userRef, {
        banned: true,
        banMessage: banMessage.trim() || 'Your account has been banned by the administrator.',
        bannedAt: serverTimestamp(),
        bannedBy: user.email
      })
      console.log('✅ User account banned')
      
      // 重新加载数据
      await loadData()
      
      // 关闭模态框
      setShowDeleteModal(false)
      setDeleteItem(null)
      setDeleteType('')
      
      console.log('✅ Account banned successfully')
      showSuccess('Account banned successfully', 'Success')
      
      // 如果封禁的是当前登录用户的账户，则登出并重定向到登录页
      if (deleteItem.id === user.id) {
        console.log('🚪 Banning current user account, logging out...')
        await logout()
        toggleTheme('light')
        navigate('/', { replace: true })
        showSuccess('Your account has been banned. You have been logged out.', 'Account Banned')
      }
    } catch (error) {
      console.error('❌ Error banning account:', error)
      showError(`Failed to ban account: ${error.message}`, 'Ban Failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  // 确认解封账号
  const confirmUnbanAccount = async () => {
    try {
      setDeleteLoading(true)
      console.log('✅ Unbanning account:', deleteItem.id)
      
      // 移除封禁状态
      const userRef = doc(db, 'users', deleteItem.id)
      await updateDoc(userRef, {
        banned: false,
        banMessage: null,
        unbannedAt: serverTimestamp(),
        unbannedBy: user.email
      })
      console.log('✅ User account unbanned')
      
      // 重新加载数据
      await loadData()
      
      // 关闭模态框
      setShowDeleteModal(false)
      setDeleteItem(null)
      setDeleteType('')
      
      console.log('✅ Account unbanned successfully')
      showSuccess('Account unbanned successfully', 'Success')
    } catch (error) {
      console.error('❌ Error unbanning account:', error)
      showError(`Failed to unban account: ${error.message}`, 'Unban Failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  // 过滤和搜索
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.school.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'active' && tutor.isAvailable) ||
      (filterStatus === 'inactive' && !tutor.isAvailable)
    
    return matchesSearch && matchesFilter
  })

  const filteredUsers = allUsers.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.school.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesFilter = filterStatus === 'all' || 
      (filterStatus === 'tutors' && user.isTutor) ||
      (filterStatus === 'students' && !user.isTutor)
    
    return matchesSearch && matchesFilter
  })

  // 排序
  const sortedTutors = [...filteredTutors].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = safeToDate(aValue)
      bValue = safeToDate(bValue)
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
      aValue = safeToDate(aValue)
      bValue = safeToDate(bValue)
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
          <p className="text-gray-600">Please wait while we verify your access.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Admin Panel
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Manage tutor profiles and user accounts</p>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-white/80 backdrop-blur-sm rounded-2xl p-2 mb-8 shadow-lg border border-white/20">
          <button
            onClick={() => setActiveTab('tutor-accounts')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'tutor-accounts'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Users className="w-5 h-5" />
              <span>Tutor Accounts</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('user-accounts')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'user-accounts'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <Database className="w-5 h-5" />
              <span>User Accounts</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 px-6 rounded-xl font-medium transition-all duration-200 ${
              activeTab === 'requests'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
            }`}
          >
            <div className="flex items-center justify-center space-x-2">
              <FileText className="w-5 h-5" />
              <span>Requests</span>
            </div>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{tutors.length}</div>
                <div className="text-sm text-gray-600">Total Tutors</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {tutors.filter(t => t.isAvailable).length}
                </div>
                <div className="text-sm text-gray-600">Active Tutors</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{allUsers.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                <UserX className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {allUsers.filter(u => !u.isTutor).length}
                </div>
                <div className="text-sm text-gray-600">Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter - Only show for tutor-accounts and user-accounts */}
        {(activeTab === 'tutor-accounts' || activeTab === 'user-accounts') && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder={`Search ${activeTab === 'tutor-accounts' ? 'tutors' : 'users'}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
              
              <div className="flex gap-4">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  {activeTab === 'tutor-accounts' ? (
                    <>
                      <option value="all">All Tutors</option>
                      <option value="active">Active Only</option>
                      <option value="inactive">Inactive Only</option>
                    </>
                  ) : (
                    <>
                      <option value="all">All Users</option>
                      <option value="tutors">Tutors Only</option>
                      <option value="students">Students Only</option>
                    </>
                  )}
                </select>
                
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field)
                    setSortOrder(order)
                  }}
                  className="px-4 py-3 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                >
                  <option value="createdAt-desc">Newest First</option>
                  <option value="createdAt-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-white animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Loading...</h3>
            <p className="text-gray-600">Please wait while we fetch the data.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === 'tutor-accounts' && (
              <>
                <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tutor Accounts ({sortedTutors.length})
                </h2>
                
                {sortedTutors.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedTutors.map((tutor) => (
                      <div key={tutor.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start space-x-4 mb-6">
                          <Avatar user={tutor} size="xl" />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{tutor.name}</h3>
                            <p className="text-gray-600 text-sm">{tutor.email}</p>
                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                              tutor.isAvailable 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {tutor.isAvailable ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                              <span>{tutor.isAvailable ? 'Active' : 'Inactive'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-medium text-gray-600">School</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{tutor.school}</span>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-medium text-gray-600">Grade</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{tutor.grade}</span>
                            </div>
                          </div>

                          {/* Specialties */}
                          <div>
                            <div className="flex items-center space-x-2 mb-2">
                              <BookOpen className="w-4 h-4 text-gray-500" />
                              <span className="text-sm font-medium text-gray-600">Specialties</span>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {tutor.specialties.slice(0, 3).map((specialty, index) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {specialty}
                                </span>
                              ))}
                              {tutor.specialties.length > 3 && (
                                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{tutor.specialties.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="grid grid-cols-3 gap-3">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{tutor.stats.totalSessions}</div>
                              <div className="text-xs text-gray-600">Sessions</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{tutor.stats.averageRating.toFixed(1)}</div>
                              <div className="text-xs text-gray-600">Rating</div>
                            </div>
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">{tutor.stats.ratingCount}</div>
                              <div className="text-xs text-gray-600">Reviews</div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2">
                            {tutor.stats.ratingCount > 0 && (
                              <button
                                onClick={() => handleViewReviews(tutor)}
                                className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                              >
                                <Eye className="w-4 h-4" />
                                <span>View Reviews ({tutor.stats.ratingCount})</span>
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleDeleteTutor(tutor)}
                              className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                            >
                              <Trash2 className="w-4 h-4" />
                              <span>Delete Tutor Profile</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Users className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No tutors found</h3>
                    <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </>
            )}

            {activeTab === 'user-accounts' && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    User Accounts ({sortedUsers.length})
                  </h2>
                  <button
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete ALL chat messages? This action cannot be undone.')) {
                        try {
                          const result = await deleteAllMessages()
                          if (result.success) {
                            showSuccess(`Successfully deleted ${result.count} messages`)
                          } else {
                            showError(result.error || 'Failed to delete messages')
                          }
                        } catch (error) {
                          showError('Error deleting messages: ' + error.message)
                        }
                      }
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete All Messages
                  </button>
                </div>
                
                {sortedUsers.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortedUsers.map((user) => (
                      <div key={user.id} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]">
                        <div className="flex items-start space-x-4 mb-6">
                          <Avatar user={user} size="xl" />
                          <div className="flex-1">
                            <h3 className="font-bold text-gray-900 text-lg">{user.name}</h3>
                            <p className="text-gray-600 text-sm">{user.email}</p>
                            <div className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                              user.isTutor 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.isTutor ? <Users className="w-3 h-3" /> : <User className="w-3 h-3" />}
                              <span>{user.isTutor ? 'Tutor' : 'Student'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          {/* Basic Info */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <GraduationCap className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-medium text-gray-600">School</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{user.school}</span>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-3">
                              <div className="flex items-center space-x-2 mb-1">
                                <User className="w-4 h-4 text-gray-500" />
                                <span className="text-xs font-medium text-gray-600">Grade</span>
                              </div>
                              <span className="text-sm font-semibold text-gray-900">{user.grade}</span>
                            </div>
                          </div>

                          {/* Account Info */}
                          <div className="bg-gray-50 rounded-xl p-3">
                            <div className="flex items-center space-x-2 mb-1">
                              <Calendar className="w-4 h-4 text-gray-500" />
                              <span className="text-xs font-medium text-gray-600">Joined</span>
                            </div>
                            <span className="text-sm font-semibold text-gray-900">
                              {formatTimestamp(user.createdAt)}
                            </span>
                          </div>

                          {/* Actions */}
                          <div className="space-y-2">
                            {user.banned ? (
                              <>
                                <div className="w-full py-2 px-4 bg-red-100 border-2 border-red-300 rounded-xl flex items-center justify-center space-x-2 font-medium">
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                  <span className="text-red-700">Banned</span>
                                </div>
                                <button
                                  onClick={() => handleUnbanAccount(user)}
                                  className="w-full py-2 px-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Unban Account</span>
                                </button>
                              </>
                            ) : (
                              <button
                                onClick={() => handleBanAccount(user)}
                                className="w-full py-2 px-4 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                              >
                                <UserX className="w-4 h-4" />
                                <span>Ban Account</span>
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-100 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-gray-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-2xl">
                      <Database className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">No users found</h3>
                    <p className="text-gray-600 text-lg">Try adjusting your search or filter criteria.</p>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Quest Requests Tab */}
        {activeTab === 'requests' && (
          <>
            {questRequestsLoading ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-white animate-spin" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Loading quest requests...</h3>
                <p className="text-gray-600">Please wait while we fetch the data.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Quest Requests ({questRequests.length})
                  </h2>
                  <select
                    value={questRequestStatus}
                    onChange={(e) => setQuestRequestStatus(e.target.value)}
                    className="px-4 py-2 bg-white/80 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                    <option value="all">All</option>
                  </select>
                </div>

                {questRequests.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {questRequests.map((request) => (
                  <div
                    key={request.id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-2xl transition-all duration-300 hover:scale-[1.02]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-lg mb-2">{request.title}</h3>
                        <p className="text-gray-600 text-sm line-clamp-2">{request.description || 'No description'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        request.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : request.status === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {request.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs font-medium text-gray-600 mb-1">Subject</div>
                        <div className="text-sm font-semibold text-gray-900">{request.subject}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs font-medium text-gray-600 mb-1">Difficulty</div>
                        <div className="text-sm font-semibold text-gray-900">{request.difficulty}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs font-medium text-gray-600 mb-1">Category</div>
                        <div className="text-sm font-semibold text-gray-900">{request.category}</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <div className="text-xs font-medium text-gray-600 mb-1">Questions</div>
                        <div className="text-sm font-semibold text-gray-900">{request.questions?.length || 0}</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{request.createdByName || 'Anonymous'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{request.createdAt ? formatTimestamp(request.createdAt) : 'N/A'}</span>
                      </div>
                    </div>

                    {request.status === 'pending' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => openQuestRequestModal(request)}
                          className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                        >
                          <Eye className="w-4 h-4" />
                          <span>Review</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-3xl p-12 border border-gray-100 text-center">
                <FileText className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                <h3 className="text-2xl font-bold text-gray-900 mb-4">No quest requests found</h3>
                <p className="text-gray-600 text-lg">
                  {questRequestStatus === 'pending'
                    ? 'No pending quest requests at the moment.'
                    : `No ${questRequestStatus} quest requests.`}
                </p>
              </div>
                )}
              </>
            )}
          </>
        )}

        {/* Modals */}
        {showReviews && selectedTutor && (
          <TutorReviewsModal
            isOpen={showReviews}
            tutor={selectedTutor}
            onClose={() => {
              setShowReviews(false)
              setSelectedTutor(null)
            }}
          />
        )}

        {showDeleteModal && deleteItem && (
          <AdminDeleteModal
            isOpen={showDeleteModal}
            item={deleteItem}
            type={deleteType}
            onConfirm={
              deleteType === 'tutor' 
                ? confirmDeleteTutor 
                : deleteType === 'unban'
                ? confirmUnbanAccount
                : confirmBanAccount
            }
            onClose={() => {
              setShowDeleteModal(false)
              setDeleteItem(null)
              setDeleteType('')
            }}
            loading={deleteLoading}
          />
        )}

        {/* Quest Request Review Modal */}
        {showQuestRequestModal && selectedQuestRequest && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Review Quest Request
                  </h2>
                  <button
                    onClick={() => {
                      setShowQuestRequestModal(false)
                      setSelectedQuestRequest(null)
                      setRejectionReason('')
                    }}
                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Basic Information</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">Title</label>
                        <p className="text-gray-900 font-semibold">{selectedQuestRequest.title}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Difficulty</label>
                        <p className="text-gray-900 font-semibold">{selectedQuestRequest.difficulty}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Subject</label>
                        <p className="text-gray-900 font-semibold">{selectedQuestRequest.subject}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">Category</label>
                        <p className="text-gray-900 font-semibold">{selectedQuestRequest.category}</p>
                      </div>
                    </div>
                    {selectedQuestRequest.description && (
                      <div className="mt-4">
                        <label className="text-sm font-medium text-gray-600">Description</label>
                        <p className="text-gray-900">{selectedQuestRequest.description}</p>
                      </div>
                    )}
                  </div>

                  {/* Questions */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Questions ({selectedQuestRequest.questions?.length || 0})
                    </h3>
                    <div className="space-y-4">
                      {selectedQuestRequest.questions?.map((q, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">Question {index + 1}</h4>
                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {q.type === 'multiple-choice' ? 'Multiple Choice' : 'Fill in Blank'}
                            </span>
                          </div>
                          <p className="text-gray-700 mb-3">{q.question}</p>
                          
                          {q.type === 'multiple-choice' ? (
                            <div className="space-y-2">
                              {q.options?.map((option, optIndex) => (
                                <div
                                  key={optIndex}
                                  className={`p-2 rounded-lg ${
                                    optIndex === q.correctAnswer
                                      ? 'bg-green-100 border-2 border-green-500'
                                      : 'bg-gray-50 border border-gray-200'
                                  }`}
                                >
                                  <div className="flex items-center gap-2">
                                    {optIndex === q.correctAnswer && (
                                      <CheckCircle className="w-4 h-4 text-green-600" />
                                    )}
                                    <span className={optIndex === q.correctAnswer ? 'font-semibold text-green-900' : 'text-gray-700'}>
                                      {option}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-600">Correct Answers:</label>
                              {q.correctAnswers?.map((answer, ansIndex) => (
                                <div key={ansIndex} className="p-2 bg-green-100 border border-green-300 rounded-lg">
                                  <span className="text-green-900 font-medium">{answer}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {q.explanation && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <label className="text-sm font-medium text-blue-900">Explanation:</label>
                              <p className="text-blue-800 text-sm">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  {selectedQuestRequest.status === 'pending' && (
                    <div className="border-t pt-6">
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Rejection Reason (if rejecting)
                        </label>
                        <textarea
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          placeholder="Optional: Provide a reason for rejection..."
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                        />
                      </div>
                      <div className="flex gap-4">
                        <button
                          onClick={() => handleApproveQuest(selectedQuestRequest.id)}
                          disabled={questRequestLoading}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium disabled:opacity-50"
                        >
                          <ThumbsUp className="w-5 h-5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => handleRejectQuest(selectedQuestRequest.id)}
                          disabled={questRequestLoading}
                          className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 font-medium disabled:opacity-50"
                        >
                          <ThumbsDown className="w-5 h-5" />
                          <span>Reject</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
