import React, { useState, useEffect } from 'react'
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Mail, 
  Phone, 
  Calendar,
  Star,
  BookOpen,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  User,
  GraduationCap,
  MapPin,
  MessageSquare,
  Trash2
} from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'
import { collection, getDocs, query, where, orderBy, doc, getDoc, updateDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToDate, formatTimestamp } from '../utils/timestampUtils'
import Avatar from '../components/Avatar'
import TutorReviews from '../components/TutorReviews'
import TutorReviewsModal from '../components/TutorReviewsModal'
import AdminDeleteModal from '../components/AdminDeleteModal'

const TutorAccountsAdmin = () => {
  const { user } = useSimpleAuth()
  const { showError } = useNotification()
  const [tutors, setTutors] = useState([])
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

  // 检查管理员权限
  const isAdmin = user?.email === 'studiply.email@gmail.com'

  useEffect(() => {
    if (user) {
      console.log('✅ Admin access granted, loading tutors...')
      loadTutors()
    }
  }, [user])

  const loadTutors = async () => {
    try {
      setLoading(true)
      console.log('🔍 Loading all tutors for admin...')
      
      // 获取所有用户，然后客户端过滤tutors（避免索引错误）
      const usersRef = collection(db, 'users')
      const q = query(usersRef) // 不添加where和orderBy，避免索引问题
      const querySnapshot = await getDocs(q)
      
      console.log('📊 Total users found:', querySnapshot.docs.length)
      
      const tutorsList = []
      let tutorCount = 0
      for (const docSnapshot of querySnapshot.docs) {
        const userData = docSnapshot.data()
        
        console.log('👤 User data:', {
          id: docSnapshot.id,
          name: userData.name,
          email: userData.email,
          isTutor: userData.isTutor
        })
        
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
          tutorProfile: userData.tutorProfile || {},
          location: userData.location || 'Online',
          avatar: userData.avatar || null,
          createdAt: userData.createdAt,
          updatedAt: userData.updatedAt,
          lastLogin: userData.lastLogin,
          isAvailable: userData.tutorProfile?.isAvailable !== false,
          specialties: userData.tutorProfile?.specialties || userData.subjects || [],
          description: userData.tutorProfile?.description || userData.bio || 'No description',
          experience: userData.tutorProfile?.experience || 'Student',
          responseTime: userData.tutorProfile?.responseTime || 'Not specified',
          stats: tutorStats
        })
      }
      
      // 客户端排序（按创建时间降序）
      tutorsList.sort((a, b) => {
        const aTime = a.createdAt ? a.createdAt.seconds : 0
        const bTime = b.createdAt ? b.createdAt.seconds : 0
        return bTime - aTime
      })
      
      console.log('✅ Loaded tutors:', tutorsList.length)
      setTutors(tutorsList)
    } catch (error) {
      console.error('❌ Error loading tutors:', error)
      showError(`Failed to load tutors: ${error.message}`, 'Error')
    } finally {
      setLoading(false)
    }
  }

  // 获取tutor统计信息
  const getTutorStats = async (tutorId) => {
    try {
      console.log('📊 Getting stats for tutor:', tutorId)
      const statsRef = doc(db, 'tutorStats', tutorId)
      const statsDoc = await getDoc(statsRef)
      
      console.log('📈 Stats doc exists:', statsDoc.exists())
      
      if (statsDoc.exists()) {
        const statsData = statsDoc.data()
        console.log('📊 Stats data:', statsData)
        
        const result = {
          totalSessions: statsData.totalSessions || 0,
          completedSessions: statsData.completedSessions || 0,
          totalRating: statsData.totalRating || 0,
          ratingCount: statsData.ratingCount || 0,
          averageRating: statsData.ratingCount > 0 ? (statsData.totalRating / statsData.ratingCount) : 0,
          totalEarnings: statsData.totalEarnings || 0
        }
        
        console.log('📈 Calculated stats:', result)
        return result
      }
      
      console.log('📈 No stats found, returning defaults')
      return {
        totalSessions: 0,
        completedSessions: 0,
        totalRating: 0,
        ratingCount: 0,
        averageRating: 0,
        totalEarnings: 0
      }
    } catch (error) {
      console.error('❌ Error getting tutor stats:', error)
      return {
        totalSessions: 0,
        completedSessions: 0,
        totalRating: 0,
        ratingCount: 0,
        averageRating: 0,
        totalEarnings: 0
      }
    }
  }

  // 查看tutor的reviews
  const handleViewReviews = (tutor) => {
    console.log('🔍 View reviews clicked for tutor:', tutor)
    console.log('📊 Tutor stats:', tutor.stats)
    setSelectedTutor(tutor)
    setShowReviews(true)
    console.log('✅ Modal should be opening...')
  }

  // 删除tutor profile
  const handleDeleteTutor = (tutor) => {
    setDeleteItem(tutor)
    setDeleteType('tutor')
    setShowDeleteModal(true)
  }

  // 确认删除tutor
  const confirmDeleteTutor = async () => {
    try {
      setDeleteLoading(true)
      console.log('🗑️ Deleting tutor profile:', deleteItem.id)
      
      // 删除用户文档中的tutor相关信息
      const userRef = doc(db, 'users', deleteItem.id)
      await updateDoc(userRef, {
        isTutor: false,
        tutorProfile: null,
        subjects: [],
        updatedAt: serverTimestamp()
      })
      
      // 删除tutor统计信息
      const statsRef = doc(db, 'tutorStats', deleteItem.id)
      await deleteDoc(statsRef)
      
      // 实时更新会通过Firebase监听自动处理，无需发送通知
      console.log('✅ Tutor profile deleted, real-time updates will handle the rest')
      
      // 重新加载tutors列表
      await loadTutors()
      
      setShowDeleteModal(false)
      setDeleteItem(null)
      setDeleteType('')
      
      console.log('✅ Tutor profile deleted successfully')
    } catch (error) {
      console.error('❌ Error deleting tutor profile:', error)
      showError(`Failed to delete tutor profile: ${error.message}`, 'Delete Failed')
    } finally {
      setDeleteLoading(false)
    }
  }

  // 过滤和搜索
  const filteredTutors = tutors.filter(tutor => {
    const matchesSearch = 
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.school.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tutor.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'active' && tutor.isAvailable) ||
      (filterStatus === 'inactive' && !tutor.isAvailable) ||
      (filterStatus === 'new' && tutor.createdAt && 
       new Date(tutor.createdAt.seconds * 1000) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    
    return matchesSearch && matchesFilter
  })

  // 排序
  const sortedTutors = [...filteredTutors].sort((a, b) => {
    let aValue, bValue
    
    switch (sortBy) {
      case 'name':
        aValue = a.name.toLowerCase()
        bValue = b.name.toLowerCase()
        break
      case 'email':
        aValue = a.email.toLowerCase()
        bValue = b.email.toLowerCase()
        break
      case 'rating':
        aValue = a.stats.averageRating
        bValue = b.stats.averageRating
        break
      case 'sessions':
        aValue = a.stats.totalSessions
        bValue = b.stats.totalSessions
        break
      case 'createdAt':
        aValue = a.createdAt ? a.createdAt.seconds : 0
        bValue = b.createdAt ? b.createdAt.seconds : 0
        break
      default:
        aValue = a.createdAt ? a.createdAt.seconds : 0
        bValue = b.createdAt ? b.createdAt.seconds : 0
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  // 如果用户还在加载中，显示加载状态
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Checking Access</h3>
          <p className="text-gray-600 text-sm">Verifying administrator permissions...</p>
        </div>
      </div>
    )
  }


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Users className="w-8 h-8 text-white animate-pulse" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Loading Tutor Accounts</h3>
          <p className="text-gray-600 text-sm">Fetching all tutor information...</p>
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
              Tutor Accounts Management
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Manage and monitor all tutor accounts</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-white to-blue-50 rounded-2xl shadow-lg border border-blue-100 p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">{tutors.length}</div>
            <div className="text-sm text-gray-600 font-medium">Total Tutors</div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-green-50 rounded-2xl shadow-lg border border-green-100 p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {tutors.filter(t => t.isAvailable).length}
            </div>
            <div className="text-sm text-gray-600 font-medium">Active Tutors</div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-2xl shadow-lg border border-purple-100 p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Star className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {tutors.length > 0 ? (tutors.reduce((sum, t) => sum + t.stats.averageRating, 0) / tutors.length).toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-600 font-medium">Avg Rating</div>
          </div>
          
          <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg border border-orange-100 p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {tutors.reduce((sum, t) => sum + t.stats.totalSessions, 0)}
            </div>
            <div className="text-sm text-gray-600 font-medium">Total Sessions</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search tutors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Tutors</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
                <option value="new">New (Last 7 days)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="createdAt">Join Date</option>
                <option value="name">Name</option>
                <option value="email">Email</option>
                <option value="rating">Rating</option>
                <option value="sessions">Sessions</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tutors List */}
        <div className="space-y-6">
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

                    {/* Join Date */}
                    <div className="text-xs text-gray-500 text-center mb-4">
                      Joined: {tutor.createdAt ? formatTimestamp(tutor.createdAt) : 'Unknown'}
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      {tutor.stats.ratingCount > 0 && (
                        <button
                          onClick={() => handleViewReviews(tutor)}
                          className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 flex items-center justify-center space-x-2 font-medium"
                        >
                          <Star className="w-4 h-4" />
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
        </div>

        {/* Reviews Modal */}
        {showReviews && selectedTutor && (
          <TutorReviewsModal
            isOpen={showReviews}
            onClose={() => {
              console.log('🚪 Closing modal...')
              setShowReviews(false)
              setSelectedTutor(null)
            }}
            tutor={selectedTutor}
          />
        )}

        {/* Delete Confirmation Modal */}
        <AdminDeleteModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false)
            setDeleteItem(null)
            setDeleteType('')
          }}
          onConfirm={confirmDeleteTutor}
          type={deleteType}
          item={deleteItem}
          loading={deleteLoading}
        />
      </div>
    </div>
  )
}

export default TutorAccountsAdmin
