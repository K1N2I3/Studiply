import { doc, deleteDoc, collection, getDocs, query, where, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'

// 删除用户及其相关数据（sessions 集合里的学生或导师记录）
export const deleteUserAccount = async (userId) => {
  try {
    // 删除 sessions 中与该用户相关的会话
    const sessionsCol = collection(db, 'sessions')
    const q1 = query(sessionsCol, where('studentId', '==', userId))
    const q2 = query(sessionsCol, where('tutorId', '==', userId))
    const [s1, s2] = await Promise.all([getDocs(q1), getDocs(q2)])
    const deletions = []
    s1.forEach(d => deletions.push(deleteDoc(doc(db, 'sessions', d.id))))
    s2.forEach(d => deletions.push(deleteDoc(doc(db, 'sessions', d.id))))
    await Promise.all(deletions)

    // 删除用户文档
    await deleteDoc(doc(db, 'users', userId))

    return { success: true }
  } catch (error) {
    console.error('Error deleting user account:', error)
    return { success: false, error: error.message }
  }
}

// removed duplicate imports

// 更新用户资料
export const updateUserProfile = async (userId, profileData) => {
  try {
    const userRef = doc(db, 'users', userId)
    
    // 准备要更新的数据，过滤掉undefined值
    const updateData = {}
    
    // 只添加非undefined的字段
    if (profileData.name !== undefined) updateData.name = profileData.name
    if (profileData.phone !== undefined) updateData.phone = profileData.phone
    if (profileData.school !== undefined) updateData.school = profileData.school
    if (profileData.grade !== undefined) updateData.grade = profileData.grade
    if (profileData.bio !== undefined) updateData.bio = profileData.bio
    if (profileData.subjects !== undefined) updateData.subjects = profileData.subjects
    if (profileData.location !== undefined) updateData.location = profileData.location
    if (profileData.avatar !== undefined) updateData.avatar = profileData.avatar
    
    updateData.updatedAt = new Date()

    // 更新文档
    await updateDoc(userRef, updateData)
    
    console.log('User profile updated successfully')
    return { success: true, message: 'Profile updated successfully' }
  } catch (error) {
    console.error('Error updating user profile:', error)
    return { success: false, error: error.message }
  }
}

// 获取用户资料
export const getUserProfile = async (userId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const userSnap = await getDoc(userRef)
    
    if (userSnap.exists()) {
      return { success: true, profile: userSnap.data() }
    } else {
      return { success: false, error: 'User profile not found' }
    }
  } catch (error) {
    console.error('Error getting user profile:', error)
    return { success: false, error: error.message }
  }
}

// 验证用户资料数据
export const validateProfileData = (profileData) => {
  const errors = []

  // 验证姓名
  if (!profileData.name || profileData.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long')
  }

  // 验证邮箱（如果需要的话，虽然我们不允许编辑）
  if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
    errors.push('Invalid email format')
  }

  // 验证电话号码格式（可选）
  if (profileData.phone && profileData.phone.trim()) {
    const phoneRegex = /^\+\d{1,4}\s?\d{6,14}$/
    if (!phoneRegex.test(profileData.phone.replace(/\s+/g, ' '))) {
      errors.push('Invalid phone number format')
    }
  }

  // 验证学科数组
  if (profileData.subjects && Array.isArray(profileData.subjects)) {
    const validSubjects = profileData.subjects.filter(subject => 
      subject && subject.trim().length > 0
    )
    if (profileData.subjects.length > 10) {
      errors.push('Maximum 10 subjects allowed')
    }
  }

  // 验证简介长度
  if (profileData.bio && profileData.bio.length > 500) {
    errors.push('Bio must be less than 500 characters')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
