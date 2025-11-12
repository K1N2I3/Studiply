import React, { createContext, useContext, useState, useEffect } from 'react'
import { simpleRegister, simpleLogin, simpleLogout, getUserDetails } from '../firebase/simpleAuth'

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
    </SimpleAuthContext.Provider>
  )
}
