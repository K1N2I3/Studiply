import React, { useState } from 'react'
import { CheckCircle, XCircle, AlertTriangle, Play, Square } from 'lucide-react'
import AgoraRTC from 'agora-rtc-sdk-ng'

const AgoraTest = () => {
  const [testResult, setTestResult] = useState(null)
  const [testing, setTesting] = useState(false)
  const [isConnected, setIsConnected] = useState(false)
  const [client, setClient] = useState(null)

  const APP_ID = import.meta.env.VITE_AGORA_APP_ID
  const TEST_CHANNEL = 'test-channel-' + Date.now()

  const testAgoraConnection = async () => {
    setTesting(true)
    setTestResult(null)

    try {
      console.log('Testing Agora connection...', { APP_ID, TEST_CHANNEL })

      // 创建客户端
      const agoraClient = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' })
      setClient(agoraClient)

      // 尝试加入频道（不发布任何媒体）
      console.log('Attempting to join channel...')
      const uid = await agoraClient.join(APP_ID, TEST_CHANNEL, null, Date.now().toString())
      console.log('Successfully joined channel:', uid)

      setIsConnected(true)
      setTestResult({
        success: true,
        message: 'Agora 连接成功！',
        details: `成功加入频道 ${TEST_CHANNEL}，UID: ${uid}`
      })

    } catch (error) {
      console.error('Agora test failed:', error)
      setTestResult({
        success: false,
        message: 'Agora 连接失败',
        details: `${error.code}: ${error.message}`
      })
    } finally {
      setTesting(false)
    }
  }

  const disconnect = async () => {
    if (client && isConnected) {
      try {
        await client.leave()
        setIsConnected(false)
        setClient(null)
        setTestResult(null)
      } catch (error) {
        console.error('Error disconnecting:', error)
      }
    }
  }

  const getStatusIcon = (success) => {
    if (success === null) return null
    return success ? (
      <CheckCircle className="w-6 h-6 text-green-500" />
    ) : (
      <XCircle className="w-6 h-6 text-red-500" />
    )
  }

  const getStatusColor = (success) => {
    if (success === null) return 'bg-gray-100 text-gray-800'
    return success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Agora 视频通话测试</h1>
            <p className="text-gray-600">测试 Agora RTC 连接和基本功能</p>
          </div>

          {/* 配置信息 */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-4">当前配置</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">App ID:</span>
                <span className="ml-2 font-mono text-gray-800">
                  {APP_ID ? `${APP_ID.substring(0, 8)}...${APP_ID.substring(28)}` : '未设置'}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-600">App ID 长度:</span>
                <span className="ml-2 text-gray-800">{APP_ID?.length || 0}/32</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">测试频道:</span>
                <span className="ml-2 font-mono text-gray-800">{TEST_CHANNEL}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">连接状态:</span>
                <span className={`ml-2 px-2 py-1 rounded text-xs ${
                  isConnected ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {isConnected ? '已连接' : '未连接'}
                </span>
              </div>
            </div>
          </div>

          {/* 测试按钮 */}
          <div className="flex justify-center space-x-4 mb-6">
            {!isConnected ? (
              <button
                onClick={testAgoraConnection}
                disabled={testing || !APP_ID}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {testing ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>测试连接中...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    <span>测试 Agora 连接</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={disconnect}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
              >
                <Square className="w-5 h-5" />
                <span>断开连接</span>
              </button>
            )}
          </div>

          {/* 测试结果 */}
          {testResult && (
            <div className={`rounded-lg p-6 mb-6 ${getStatusColor(testResult.success)}`}>
              <div className="flex items-center space-x-3 mb-3">
                {getStatusIcon(testResult.success)}
                <h3 className="text-lg font-semibold">{testResult.message}</h3>
              </div>
              <p className="text-sm opacity-90 font-mono">{testResult.details}</p>
            </div>
          )}

          {/* 故障排除指南 */}
          <div className="bg-blue-50 rounded-lg p-6">
            <div className="flex items-center space-x-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-blue-600" />
              <h3 className="font-semibold text-blue-900">故障排除指南</h3>
            </div>
            <div className="text-sm text-blue-800 space-y-2">
              <p><strong>如果连接失败，请检查：</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>App ID 是否正确（32位十六进制字符串）</li>
                <li>Agora 项目是否已激活</li>
                <li>网络连接是否正常</li>
                <li>是否在 Agora 控制台中启用了相关服务</li>
                <li>浏览器是否允许摄像头和麦克风权限</li>
              </ul>
              <div className="mt-4 p-3 bg-blue-100 rounded">
                <p><strong>常见错误：</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li><code>CAN_NOT_GET_GATEWAY_SERVER</code>: App ID 无效或项目未激活</li>
                  <li><code>INVALID_APP_ID</code>: App ID 格式错误</li>
                  <li><code>PERMISSION_DENIED</code>: 浏览器权限被拒绝</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AgoraTest
