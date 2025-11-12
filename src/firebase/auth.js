import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth'
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { auth, db } from './config'

// 注册新用户
export const registerUser = async (userData) => {
  try {
    const { email, password, name, school, grade, phone, location, bio, subjects } = userData
    
    // 创建用户账户
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // 更新用户显示名称
    await updateProfile(user, { displayName: name })
    
    // 发送邮箱验证
    await sendEmailVerification(user)
    
        // 保存用户详细信息到 Firestore
        try {
          await setDoc(doc(db, 'users', user.uid), {
            name,
            email,
            school,
            grade,
            phone,
            location,
            bio,
            subjects,
            emailVerified: true, // Set to true since we use EmailJS verification
            createdAt: new Date().toISOString()
          })
    } catch (error) {
      console.warn('保存用户详细信息失败，但用户账户已创建:', error)
      // 即使保存详细信息失败，用户账户仍然创建成功
    }
    
        return {
          success: true,
          message: 'Registration successful! Please verify your email address.',
          user: {
            id: user.uid,
            name,
            email,
            school,
            grade,
            phone,
            location,
            bio,
            subjects
          }
        }
  } catch (error) {
    console.error('注册错误:', error)
    let errorMessage = '注册失败，请重试'
    
    if (error.code === 'auth/email-already-in-use') {
      errorMessage = '此邮箱已被注册，请使用其他邮箱或直接登录'
    } else if (error.code === 'auth/weak-password') {
      errorMessage = '密码太弱，请使用至少6个字符的密码'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = '邮箱格式不正确'
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

// 用户登录
export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    const user = userCredential.user
    
    // 获取用户详细信息
    let userData = {}
    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      userData = userDoc.data() || {}
      
      // 检查 Firestore 中的邮箱验证状态（如果数据获取成功）
      if (userData.emailVerified === false) {
        return {
          success: false,
          error: 'Please verify your email address first. We have sent a verification email, please check your inbox.'
        }
      }
    } catch (error) {
      console.warn('Failed to get user details, using basic info:', error)
      // 权限错误时使用空数据，允许登录（兼容性处理）
      userData = {}
    }
    
    return {
      success: true,
      user: {
        id: user.uid,
        name: user.displayName || userData?.name || '用户',
        email: user.email,
        school: userData?.school || '',
        grade: userData?.grade || '',
        phone: userData?.phone || '',
        location: userData?.location || '',
        bio: userData?.bio || '',
        subjects: userData?.subjects || []
      }
    }
  } catch (error) {
    console.error('Login error:', error)
    let errorMessage = 'Login failed, please try again'
    
    if (error.code === 'auth/user-not-found') {
      errorMessage = 'User not found, please register first'
    } else if (error.code === 'auth/wrong-password') {
      errorMessage = 'Incorrect password'
    } else if (error.code === 'auth/invalid-credential') {
      errorMessage = 'Invalid email or password'
    } else if (error.code === 'auth/invalid-email') {
      errorMessage = 'Invalid email format'
    } else if (error.code === 'auth/too-many-requests') {
      errorMessage = 'Too many login attempts, please try again later'
    }
    
    return {
      success: false,
      error: errorMessage
    }
  }
}

// 用户登出
export const logoutUser = async () => {
  try {
    await signOut(auth)
    return { success: true }
  } catch (error) {
    console.error('Logout error:', error)
    return { success: false, error: 'Logout failed' }
  }
}

// 监听认证状态变化
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      // 获取用户详细信息
      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.data()
        
        callback({
          id: user.uid,
          name: user.displayName || userData?.name,
          email: user.email,
          school: userData?.school,
          grade: userData?.grade,
          phone: userData?.phone,
          location: userData?.location,
          bio: userData?.bio,
          subjects: userData?.subjects || []
        })
      } catch (error) {
        console.error('Error getting user data:', error)
        // 如果权限错误，仍然返回基本用户信息
        if (error.code === 'permission-denied') {
          console.warn('Firestore permission denied, using basic user info')
          callback({
            id: user.uid,
            name: user.displayName || 'User',
            email: user.email,
            school: '',
            grade: '',
            phone: '',
            location: '',
            bio: '',
            subjects: []
          })
        } else {
          // 即使获取数据失败，也返回基本用户信息
          console.warn('获取用户数据失败，使用基本用户信息:', error)
          callback({
            id: user.uid,
            name: user.displayName || 'User',
            email: user.email,
            school: '',
            grade: '',
            phone: '',
            location: '',
            bio: '',
            subjects: []
          })
        }
      }
    } else {
      callback(null)
    }
  })
}

// 重新发送验证邮件
export const resendVerificationEmail = async () => {
  try {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser)
      return {
        success: true,
        message: '验证邮件已重新发送，请检查你的邮箱'
      }
    }
    return {
      success: false,
      error: '没有找到当前用户'
    }
  } catch (error) {
    console.error('重新发送验证邮件错误:', error)
    return {
      success: false,
      error: '重新发送验证邮件失败'
    }
  }
}

// 删除用户账户（测试用）
export const deleteUserAccount = async (password) => {
  try {
    if (auth.currentUser) {
      const user = auth.currentUser
      
      // 如果需要重新认证
      if (password) {
        try {
          // 创建凭据进行重新认证
          const credential = EmailAuthProvider.credential(user.email, password)
          await reauthenticateWithCredential(user, credential)
          console.log('重新认证成功')
        } catch (reauthError) {
          console.error('重新认证失败:', reauthError)
          if (reauthError.code === 'auth/wrong-password') {
            return {
              success: false,
              error: '密码错误，请重新输入'
            }
          } else if (reauthError.code === 'auth/invalid-credential') {
            return {
              success: false,
              error: '认证失败，请检查密码'
            }
          } else {
            return {
              success: false,
              error: '重新认证失败: ' + reauthError.message
            }
          }
        }
      }
      
      // 删除 Firestore 中的用户数据
      try {
        await deleteDoc(doc(db, 'users', user.uid))
        console.log('用户数据已从 Firestore 删除')
      } catch (error) {
        console.warn('删除 Firestore 数据失败:', error)
      }
      
      // 删除 Firebase Auth 中的用户账户
      await user.delete()
      
      return {
        success: true,
        message: '用户账户已成功删除'
      }
    }
    return {
      success: false,
      error: '没有找到当前用户'
    }
  } catch (error) {
    console.error('删除用户账户错误:', error)
    
    // 处理特定错误
    if (error.code === 'auth/requires-recent-login') {
      return {
        success: false,
        error: 'requires-recent-login',
        message: '为了安全起见，请重新输入密码确认身份'
      }
    }
    
    return {
      success: false,
      error: '删除用户账户失败: ' + error.message
    }
  }
}
