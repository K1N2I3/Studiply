import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const AdminRoute = ({ children }) => {
  const { user } = useSimpleAuth()
  
  // 检查用户是否登录
  if (!user) {
    console.log('🔒 AdminRoute: User not logged in, redirecting to login')
    return <Navigate to="/login" replace />
  }
  
  // 检查是否是管理员
  const isAdmin = user?.email === 'studiply.email@gmail.com'
  
  console.log('🔒 AdminRoute check:', {
    userEmail: user?.email,
    isAdmin,
    expectedEmail: 'studiply.email@gmail.com'
  })
  
  if (!isAdmin) {
    // 如果不是管理员，重定向到首页并显示错误消息
    console.log('❌ AdminRoute: User is not admin, redirecting to home')
    return <Navigate to="/" replace />
  }
  
  // 如果是管理员，渲染子组件
  console.log('✅ AdminRoute: Access granted')
  return children
}

export default AdminRoute
