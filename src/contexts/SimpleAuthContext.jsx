import React, { createContext, useContext, useState, useEffect } from 'react'
import { simpleRegister, simpleLogin, simpleLogout, getUserDetails } from '../firebase/simpleAuth'
import { useTheme } from './ThemeContext'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import AccountDeletionNotice from '../components/AccountDeletionNotice'
import AccountBanNotice from '../components/AccountBanNotice'
import { initPresenceUpdates } from '../services/presenceService'

const SimpleAuthContext = createContext()

export const useSimpleAuth = () => {
  const context = useContext(SimpleAuthContext)
  if (!context) {
    throw new Error('useSimpleAuth must be used within a SimpleAuthProvider')
  }
  return context
}

export const SimpleAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeletionNotice, setShowDeletionNotice] = useState(false)
  const [deletionMessage, setDeletionMessage] = useState('')
  const [showBanNotice, setShowBanNotice] = useState(false)
  const [banMessage, setBanMessage] = useState('')
  const { toggleTheme } = useTheme()

  useEffect(() => {
    // 检查localStorage中的用户信息
    const savedUser = localStorage.getItem('simpleUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      // 确保isTutor字段存在
      if (userData.isTutor === undefined) {
        userData.isTutor = false
      }
      setUser(userData)
    }
    setLoading(false)
  }, [])

  // 实时监听用户文档，检测是否被删除或封禁
  useEffect(() => {
    if (!user?.id) return

    // 检查是否是管理员，管理员不应该被删除提示打扰
    const isAdmin = user?.email === 'studiply.email@gmail.com'
    
    console.log('🔍 Setting up user status listener for:', user.id, isAdmin ? '(Admin)' : '')
    const userRef = doc(db, 'users', user.id)
    
    let deletionCheckTimeout = null
    
    const unsubscribe = onSnapshot(
      userRef,
      (snapshot) => {
        if (snapshot.exists()) {
          // 文档存在，清除任何待处理的删除检查
          if (deletionCheckTimeout) {
            clearTimeout(deletionCheckTimeout)
            deletionCheckTimeout = null
          }
          
          // 文档存在，检查是否有删除通知或封禁状态
          const userData = snapshot.data()
          
          // 检查是否被封禁
          if (userData.banned === true) {
            console.log('🚫 User account banned, showing ban notice...')
            const message = userData.banMessage || 'Your account has been banned by the administrator.'
            setBanMessage(message)
            setShowBanNotice(true)
            return
          }
          
          // 检查是否有删除通知
          if (userData.deletionNotice) {
            // 保存删除消息到 localStorage（以防文档被删除后无法读取）
            localStorage.setItem('deletionNotice', userData.deletionNotice)
            console.log('📝 Deletion notice found:', userData.deletionNotice)
          }
        } else {
          // 文档不存在，但需要验证是否真的被删除
          console.log('⚠️ User document not found, verifying...')
          
          // 如果是管理员，直接跳过，不显示删除提示
          if (isAdmin) {
            console.log('⚠️ Admin user document not found, this might be a false positive. Skipping deletion notice.')
            return
          }
          
          // 如果不是管理员，延迟检查，避免误触发
          if (deletionCheckTimeout) {
            clearTimeout(deletionCheckTimeout)
          }
          
          deletionCheckTimeout = setTimeout(async () => {
            // 再次验证文档是否真的不存在
            try {
              const verifyDoc = await getDoc(userRef)
              
              if (!verifyDoc.exists()) {
                // 确认文档不存在，显示删除提示
                console.log('⚠️ User document confirmed deleted, showing deletion notice...')
                
                // 从 localStorage 读取删除消息
                const savedMessage = localStorage.getItem('deletionNotice') || ''
                setDeletionMessage(savedMessage)
                setShowDeletionNotice(true)
                
                // 清除删除消息
                localStorage.removeItem('deletionNotice')
              } else {
                console.log('✅ Document exists after verification, false alarm - ignoring')
              }
            } catch (error) {
              console.error('❌ Error verifying user document:', error)
              // 如果验证出错，不显示删除提示，可能是网络问题
              console.log('⚠️ Verification failed, assuming false positive - not showing deletion notice')
            }
          }, 3000) // 延迟3秒再检查，给网络更多时间
        }
      },
      (error) => {
        console.error('❌ Error listening to user document:', error)
        // 如果监听出错，可能是权限问题或网络问题，不强制退出
        // 特别是管理员，不应该因为权限问题而误触发
        if (isAdmin) {
          console.log('⚠️ Admin user listener error, ignoring (might be permission issue)')
        }
      }
    )

    return () => {
      console.log('🔍 Cleaning up user status listener')
      if (deletionCheckTimeout) {
        clearTimeout(deletionCheckTimeout)
      }
      unsubscribe()
    }
  }, [user?.id, user?.email, toggleTheme])

  // 处理删除通知完成（倒计时结束）
  const handleDeletionComplete = () => {
    console.log('🚪 Deletion notice complete, logging out...')
    // 强制退出
    setUser(null)
    localStorage.removeItem('simpleUser')
    localStorage.removeItem('deletionNotice')
    // 强制切换到浅色模式
    localStorage.setItem('theme', 'light')
    document.documentElement.setAttribute('data-theme', 'light')
    if (toggleTheme) {
      toggleTheme('light')
    }
    // 跳转到主页
    window.location.href = '/'
  }

  // 处理封禁通知完成（倒计时结束）
  const handleBanComplete = () => {
    console.log('🚪 Ban notice complete, logging out...')
    // 强制退出
    setUser(null)
    localStorage.removeItem('simpleUser')
    // 强制切换到浅色模式
    localStorage.setItem('theme', 'light')
    document.documentElement.setAttribute('data-theme', 'light')
    if (toggleTheme) {
      toggleTheme('light')
    }
    // 跳转到主页
    window.location.href = '/'
  }

  // 初始化在线状态更新
  useEffect(() => {
    if (!user?.id) return

    console.log('🟢 Initializing presence updates for user:', user.id)
    const cleanup = initPresenceUpdates(user.id)

    return () => {
      console.log('🔴 Cleaning up presence updates')
      cleanup()
    }
  }, [user?.id])

  const login = async (email, password) => {
    try {
      const result = await simpleLogin(email, password)
      if (result.success) {
        const userData = result.user
        // 确保isTutor字段存在
        if (userData.isTutor === undefined) {
          userData.isTutor = false
        }
        setUser(userData)
        localStorage.setItem('simpleUser', JSON.stringify(userData))
      }
      return result
    } catch (error) {
      return { success: false, error: 'Login failed, please try again' }
    }
  }

  const register = async (userData) => {
    try {
      const result = await simpleRegister(userData)
      if (result.success) {
        const user = result.user
        // 新注册用户默认不是导师
        user.isTutor = false
        setUser(user)
        localStorage.setItem('simpleUser', JSON.stringify(user))
      }
      return result
    } catch (error) {
      return { success: false, error: 'Registration failed, please try again' }
    }
  }

  const logout = async () => {
    try {
      await simpleLogout()
      setUser(null)
      localStorage.removeItem('simpleUser')
      // 强制切换到浅色模式
      localStorage.setItem('theme', 'light')
      document.documentElement.setAttribute('data-theme', 'light')
      if (toggleTheme) {
        toggleTheme('light')
      }
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const reloadUser = async () => {
    const savedUser = localStorage.getItem('simpleUser')
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      try {
        // 从Firestore重新获取最新的用户信息
        const result = await getUserDetails(userData.id)
        if (result.success) {
          const freshUserData = result.user
          setUser(freshUserData)
          localStorage.setItem('simpleUser', JSON.stringify(freshUserData))
        } else {
          // 如果Firestore获取失败，使用本地数据
          if (userData.isTutor === undefined) {
            userData.isTutor = false
          }
          setUser(userData)
        }
      } catch (error) {
        console.error('Error reloading user:', error)
        // 如果出错，使用本地数据
        if (userData.isTutor === undefined) {
          userData.isTutor = false
        }
        setUser(userData)
      }
    }
  }

  const updateUser = (updatedUserData) => {
    setUser(updatedUserData)
    localStorage.setItem('simpleUser', JSON.stringify(updatedUserData))
  }

  const value = {
    user,
    login,
    register,
    logout,
    reloadUser,
    updateUser,
    loading
  }

  return (
    <SimpleAuthContext.Provider value={value}>
      {children}
      {showDeletionNotice && (
        <AccountDeletionNotice
          message={deletionMessage}
          onComplete={handleDeletionComplete}
        />
      )}
      {showBanNotice && (
        <AccountBanNotice
          message={banMessage}
          onComplete={handleBanComplete}
        />
      )}
    </SimpleAuthContext.Provider>
  )
}
