import React, { useState } from 'react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const VideoCallDebug = () => {
  const { user } = useSimpleAuth()
  const [debugInfo, setDebugInfo] = useState('')

  const runDebug = () => {
    const info = {
      timestamp: new Date().toISOString(),
      user: {
        name: user?.name,
        id: user?.id,
        role: user?.role
      },
      environment: {
        appId: import.meta.env.VITE_AGORA_APP_ID,
        nodeEnv: import.meta.env.NODE_ENV,
        baseUrl: import.meta.env.BASE_URL
      },
      browser: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language
      }
    }
    
    setDebugInfo(JSON.stringify(info, null, 2))
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">视频通话调试信息</h2>
      
      <div className="space-y-4">
        <button
          onClick={runDebug}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          获取调试信息
        </button>
        
        {debugInfo && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">调试信息:</h3>
            <pre className="text-sm overflow-auto">{debugInfo}</pre>
          </div>
        )}
        
        <div className="bg-yellow-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">连接测试步骤:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>确保 Agora App ID 已正确配置</li>
            <li>打开两个不同的浏览器窗口或设备</li>
            <li>一个作为 Tutor，一个作为 Student</li>
            <li>确保两个用户都登录了不同的账户</li>
            <li>检查浏览器控制台的日志信息</li>
            <li>确保网络连接正常</li>
          </ol>
        </div>
        
        <div className="bg-blue-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">常见问题:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li><strong>只看到自己的视频:</strong> 检查频道名称是否一致</li>
            <li><strong>连接失败:</strong> 检查 Agora App ID 是否正确</li>
            <li><strong>没有音频:</strong> 检查浏览器麦克风权限</li>
            <li><strong>没有视频:</strong> 检查浏览器摄像头权限</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default VideoCallDebug
