import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useSimpleAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    // 保存原始路径，登录后可以跳转回去
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  return children
}

export default ProtectedRoute
