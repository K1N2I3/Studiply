import { 
  collection, 
  addDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../firebase/config'
import { safeToDate } from '../utils/timestampUtils'

// 活动类型枚举
export const ACTIVITY_TYPES = {
  STUDY_SESSION: 'study_session',
  TUTORING_SESSION: 'tutoring_session',
  BADGE_EARNED: 'badge_earned',
  FOCUS_MODE: 'focus_mode',
  GROUP_JOINED: 'group_joined',
  PROFILE_UPDATE: 'profile_update'
}

// 记录用户活动
export const logActivity = async (userId, activityType, description, metadata = {}) => {
  try {
    const activitiesRef = collection(db, 'userActivities')
    const activityData = {
      userId,
      activityType,
      description,
      metadata,
      timestamp: serverTimestamp(),
      createdAt: serverTimestamp()
    }
    
    const docRef = await addDoc(activitiesRef, activityData)
    return { success: true, activityId: docRef.id }
  } catch (error) {
    console.error('Error logging activity:', error)
    return { success: false, error: error.message }
  }
}

// 获取用户最近活动
export const getUserRecentActivities = async (userId, limitCount = 10) => {
  try {
    const activitiesRef = collection(db, 'userActivities')
    // 只使用userId过滤，然后在客户端排序以避免需要复合索引
    const q = query(
      activitiesRef,
      where('userId', '==', userId),
      limit(limitCount * 2) // 获取更多数据以便在客户端排序
    )
    
    const querySnapshot = await getDocs(q)
    const activities = []
    
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      activities.push({
        id: doc.id,
        activityType: data.activityType,
        description: data.description,
        metadata: data.metadata,
        timestamp: data.timestamp,
        createdAt: data.createdAt
      })
    })
    
    // 在客户端按时间戳排序并限制数量
    activities.sort((a, b) => {
      const timeA = safeToDate(a.timestamp).getTime()
      const timeB = safeToDate(b.timestamp).getTime()
      return timeB - timeA
    })
    
    return { success: true, activities: activities.slice(0, limitCount) }
  } catch (error) {
    console.error('Error getting user activities:', error)
    return { success: false, activities: [], error: error.message }
  }
}

// 格式化活动描述
export const formatActivityDescription = (activityType, metadata = {}) => {
  switch (activityType) {
    case ACTIVITY_TYPES.STUDY_SESSION:
      return `Completed ${metadata.subject || 'study'} session for ${metadata.duration || 'unknown'} minutes`
    case ACTIVITY_TYPES.TUTORING_SESSION:
      return `Completed tutoring session in ${metadata.subject || 'unknown'} subject`
    case ACTIVITY_TYPES.BADGE_EARNED:
      return `Earned "${metadata.badgeName || 'Unknown'}" badge`
    case ACTIVITY_TYPES.FOCUS_MODE:
      return `Used Focus Mode for ${metadata.duration || 'unknown'} minutes`
    case ACTIVITY_TYPES.GROUP_JOINED:
      return `Joined ${metadata.groupName || 'study'} group`
    case ACTIVITY_TYPES.PROFILE_UPDATE:
      return `Updated profile information`
    default:
      return 'Unknown activity'
  }
}

// 格式化时间戳
export const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time'
  
  const now = new Date()
  const activityTime = safeToDate(timestamp)
  const diffInMinutes = Math.floor((now - activityTime) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
  
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
  
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  
  return activityTime.toLocaleDateString()
}
