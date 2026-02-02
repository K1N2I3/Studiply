import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { db, auth } from './config'

// 简单的用户认证系统（不使用Firebase Auth）
export const simpleRegister = async (userData) => {
  try {
    const { email, password, name, school, grade, phone, location, bio, subjects, avatar } = userData
    
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
      avatar: avatar || null, // 保存头像（如果有）
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
        avatar: avatar || null, // 添加avatar字段
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

// Google 登录
export const simpleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup(auth, provider)
    const googleUser = result.user
    
    // 检查用户是否已经在 Firestore 中存在
    const usersRef = collection(db, 'users')
    const q = query(usersRef, where('email', '==', googleUser.email.toLowerCase().trim()))
    const querySnapshot = await getDocs(q)
    
    if (!querySnapshot.empty) {
      // 用户已存在，直接登录
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
      
      return {
        success: true,
        user: {
          id: userData.id,
          name: userData.name || googleUser.displayName || 'User',
          email: userData.email,
          school: userData.school || '',
          grade: userData.grade || '',
          phone: userData.phone || '',
          location: userData.location || '',
          bio: userData.bio || '',
          subjects: userData.subjects || [],
          avatar: userData.avatar || googleUser.photoURL || null,
          isTutor: userData.isTutor || false,
          tutorProfile: userData.tutorProfile || null
        }
      }
    } else {
      // 新用户，返回 Google 信息用于注册流程
      return {
        success: true,
        isNewUser: true,
        googleUser: {
          id: googleUser.uid,
          name: googleUser.displayName || '',
          email: googleUser.email || '',
          photoURL: googleUser.photoURL || null
        }
      }
    }
  } catch (error) {
    console.error('Google login error:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    
    let errorMessage = 'Google login failed, please try again'
    
    if (error.code === 'auth/popup-closed-by-user') {
      errorMessage = 'Login cancelled'
    } else if (error.code === 'auth/popup-blocked') {
      errorMessage = 'Popup blocked. Please allow popups for this site.'
    } else if (error.code === 'auth/operation-not-allowed') {
      errorMessage = 'Google login is not enabled. Please enable it in Firebase Console → Authentication → Sign-in method.'
    } else if (error.code === 'auth/unauthorized-domain') {
      errorMessage = 'This domain is not authorized. Please add it in Firebase Console → Authentication → Settings → Authorized domains.'
    } else if (error.code === 'auth/configuration-not-found') {
      errorMessage = 'Google OAuth configuration not found. Please configure OAuth consent screen in Google Cloud Console.'
    } else if (error.message) {
      // 显示具体错误信息以便调试
      errorMessage = `Google login failed: ${error.message}`
    }
    
    return {
      success: false,
      error: errorMessage,
      errorCode: error.code // 添加错误代码以便调试
    }
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
