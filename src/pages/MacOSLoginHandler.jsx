import React, { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, getDoc } from 'firebase/firestore'
import { auth, db } from '../firebase/config'

const MacOSLoginHandler = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('processing')
  const [message, setMessage] = useState('正在处理macOS应用登录请求...')

  useEffect(() => {
    handleMacOSLogin()
  }, [])

  const handleMacOSLogin = async () => {
    try {
      // 获取URL参数
      const platform = searchParams.get('platform')
      const userId = searchParams.get('user_id')
      const email = searchParams.get('email')
      const name = searchParams.get('name')
      const timestamp = searchParams.get('timestamp')
      const signature = searchParams.get('signature')
      const redirectUri = searchParams.get('redirect_uri')

      console.log('macOS Login Request:', {
        platform, userId, email, name, timestamp, signature, redirectUri
      })

      // 验证参数
      if (!platform || !userId || !email || !name || !redirectUri) {
        throw new Error('缺少必要的登录参数')
      }

      // 验证时间戳（防止重放攻击）
      const currentTime = Math.floor(Date.now() / 1000)
      const requestTime = parseInt(timestamp)
      if (currentTime - requestTime > 300) { // 5分钟超时
        throw new Error('登录请求已过期')
      }

      // 验证签名（简化版本）
      const expectedSignature = createSignature({ id: userId, email }, requestTime)
      if (signature !== expectedSignature) {
        throw new Error('签名验证失败')
      }

      // 检查用户是否已存在
      let user
      try {
        // 尝试使用邮箱登录
        const userCredential = await signInWithEmailAndPassword(auth, email, 'macos_temp_password')
        user = userCredential.user
        console.log('Existing user signed in:', user.uid)
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          // 用户不存在，创建新用户
          console.log('User not found, creating new user...')
          
          // 生成临时密码
          const tempPassword = generateTempPassword()
          
          const userCredential = await createUserWithEmailAndPassword(auth, email, tempPassword)
          user = userCredential.user
          
          // 更新用户显示名称
          await user.updateProfile({
            displayName: name
          })
          
          // 在Firestore中创建用户文档
          await setDoc(doc(db, 'users', user.uid), {
            id: user.uid,
            email: email,
            name: name,
            platform: 'macos',
            createdAt: new Date(),
            totalXP: 0,
            gold: 0,
            level: 1,
            isTutor: false
          })
          
          console.log('New user created:', user.uid)
        } else {
          throw error
        }
      }

      // 生成访问令牌
      const accessToken = await user.getIdToken()
      
      // 构建回调URL
      const callbackUrl = `${redirectUri}?status=success&token=${accessToken}&user_id=${user.uid}`
      
      setStatus('success')
      setMessage('登录成功！正在跳转回macOS应用...')
      
      // 延迟跳转，让用户看到成功消息
      setTimeout(() => {
        window.location.href = callbackUrl
      }, 2000)

    } catch (error) {
      console.error('macOS Login Error:', error)
      setStatus('error')
      setMessage(`登录失败: ${error.message}`)
      
      // 如果有redirect_uri，跳转回应用并传递错误信息
      const redirectUri = searchParams.get('redirect_uri')
      if (redirectUri) {
        setTimeout(() => {
          const errorUrl = `${redirectUri}?status=error&error=${encodeURIComponent(error.message)}`
          window.location.href = errorUrl
        }, 3000)
      }
    }
  }

  // 创建签名（与macOS应用相同的算法）
  const createSignature = (userData, timestamp) => {
    const dataString = `${userData.id}${userData.email}${timestamp}`
    return btoa(dataString) // base64编码
  }

  // 生成临时密码
  const generateTempPassword = () => {
    return 'macos_' + Math.random().toString(36).substring(2, 15)
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      padding: '20px',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        width: '100%'
      }}>
        {/* Logo */}
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: 'white',
          fontSize: '36px'
        }}>
          🎓
        </div>

        {/* 状态信息 */}
        <h2 style={{
          color: '#333',
          marginBottom: '10px',
          fontSize: '24px',
          fontWeight: 'bold'
        }}>
          Studiply macOS 登录
        </h2>

        <p style={{
          color: '#666',
          marginBottom: '30px',
          fontSize: '16px',
          lineHeight: '1.5'
        }}>
          {message}
        </p>

        {/* 状态指示器 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px'
        }}>
          {status === 'processing' && (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                border: '2px solid #667eea',
                borderTop: '2px solid transparent',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ color: '#667eea', fontWeight: '500' }}>处理中...</span>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#4CAF50',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px'
              }}>
                ✓
              </div>
              <span style={{ color: '#4CAF50', fontWeight: '500' }}>登录成功</span>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div style={{
                width: '20px',
                height: '20px',
                borderRadius: '50%',
                backgroundColor: '#f44336',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '12px'
              }}>
                ✗
              </div>
              <span style={{ color: '#f44336', fontWeight: '500' }}>登录失败</span>
            </>
          )}
        </div>

        {/* 返回按钮 */}
        <button
          onClick={() => window.close()}
          style={{
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#5a6fd8'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#667eea'}
        >
          关闭窗口
        </button>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default MacOSLoginHandler
