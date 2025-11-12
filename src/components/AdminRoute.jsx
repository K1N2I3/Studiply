import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const AdminRoute = ({ children }) => {
  const { user } = useSimpleAuth()
  
  // 检查用户是否登录
  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  // 检查是否是管理员
  const isAdmin = user?.email === 'studiply.email@gmail.com'
  
  if (!isAdmin) {
    // 如果不是管理员，重定向到首页并显示错误消息
    return <Navigate to="/" replace />
  }
  
  // 如果是管理员，渲染子组件
  return children
}

export default AdminRoute
