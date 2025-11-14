import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { db } from './config'

// 简单的用户认证系统（不使用Firebase Auth）
export const simpleRegister = async (userData) => {
  try {
    const { email, password, name, school, grade, phone, location, bio, subjects } = userData
    
    // 检查用户是否已存在
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email.toLowerCase().trim()))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      return {
        success: false,
        error: 'User already exists with this email'
      }
    }
    
    // 创建用户文档
    const userId = Date.now().toString() // 简单的用户ID
    const userDocRef = doc(db, 'users', userId)
    await setDoc(userDocRef, {
      id: userId,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password.trim(), // 直接存储密码（仅用于演示）
      school,
      grade,
      phone,
      location,
      bio,
      subjects,
      isTutor: false, // 新用户默认不是导师
      tutorProfile: null,
      emailVerified: true,
      createdAt: new Date().toISOString()
    })
    
    return {
      success: true,
      message: 'Registration successful!',
      user: {
        id: userId,
        name: name.trim() || 'User', // 确保name字段有默认值
        email: email.toLowerCase().trim(),
        school,
        grade,
        phone,
        location,
        bio,
        subjects,
        avatar: null, // 添加avatar字段
        isTutor: false,
        tutorProfile: null
      }
    }
  } catch (error) {
    console.error('Registration error:', error)
    return {
      success: false,
      error: 'Registration failed, please try again'
    }
  }
}

export const simpleLogin = async (email, password) => {
  try {
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', email.toLowerCase().trim()))
    const querySnapshot = await getDocs(q)
    
    if (querySnapshot.empty) {
      return {
        success: false,
        error: 'User not found, please register first'
      }
    }
    
    const userDoc = querySnapshot.docs[0]
    const userData = userDoc.data()
    
    // 检查是否被封禁
    if (userData.banned === true) {
      const banMessage = userData.banMessage || 'Your account has been banned by the administrator.'
      return {
        success: false,
        error: banMessage
      }
    }
    
    // 检查密码
    if (userData.password !== password.trim()) {
      return {
        success: false,
        error: 'Incorrect password'
      }
    }
    
    // 登录成功
    return {
      success: true,
      user: {
        id: userData.id,
        name: userData.name || 'User', // 确保name字段有默认值
        email: userData.email,
        school: userData.school || '',
        grade: userData.grade || '',
        phone: userData.phone || '',
        location: userData.location || '',
        bio: userData.bio || '',
        subjects: userData.subjects || [],
        avatar: userData.avatar || null, // 添加avatar字段
        isTutor: userData.isTutor || false, // 确保isTutor字段存在
        tutorProfile: userData.tutorProfile || null
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    return {
      success: false,
      error: 'Login failed, please try again'
    }
  }
}

export const simpleLogout = async () => {
  return { success: true }
}

export const getUserDetails = async (userId) => {
  try {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      const userData = userDoc.data()
      return { 
        success: true, 
        user: { 
          id: userDoc.id, 
          ...userData,
          name: userData.name || 'User', // 确保name字段有默认值
          avatar: userData.avatar || null, // 确保avatar字段存在
          isTutor: userData.isTutor || false // 确保isTutor字段存在
        } 
      }
    }
    return { success: false, error: 'User not found' }
  } catch (error) {
    console.error('Error getting user details:', error)
    return { success: false, error: error.message }
  }
}

// 简单的认证状态监听（模拟）
export const onSimpleAuthStateChange = (callback) => {
  // 检查localStorage中的用户信息
  const user = localStorage.getItem('simpleUser')
  if (user) {
    callback(JSON.parse(user))
  } else {
    callback(null)
  }
  
  // 监听localStorage变化
  const handleStorageChange = (e) => {
    if (e.key === 'simpleUser') {
      if (e.newValue) {
        callback(JSON.parse(e.newValue))
      } else {
        callback(null)
      }
    }
  }
  
  window.addEventListener('storage', handleStorageChange)
  
  // 返回清理函数
  return () => {
    window.removeEventListener('storage', handleStorageChange)
  }
}
