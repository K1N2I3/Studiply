import React, { createContext, useContext, useState, useEffect } from 'react'
import { registerUser, loginUser, logoutUser, onAuthStateChange, resendVerificationEmail } from '../firebase/auth'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 监听认证状态变化
    const unsubscribe = onAuthStateChange((user) => {
      setUser(user)
      setLoading(false)
    })

    // 清理函数
    return () => unsubscribe()
  }, [])

  const login = async (email, password) => {
    try {
      const result = await loginUser(email, password)
      return result
    } catch (error) {
      return { success: false, error: 'Login failed, please try again' }
    }
  }

  const register = async (userData) => {
    try {
      const result = await registerUser(userData)
      return result
    } catch (error) {
      return { success: false, error: 'Registration failed, please try again' }
    }
  }

  const logout = async () => {
    try {
      await logoutUser()
      setUser(null)
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const resendEmailVerification = async () => {
    try {
      const result = await resendVerificationEmail()
      return result
    } catch (error) {
      return { success: false, error: 'Failed to resend verification email' }
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    resendEmailVerification,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
