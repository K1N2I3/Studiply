import React, { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { 
  Video, 
  VideoOff, 
  Mic, 
  MicOff, 
  Phone, 
  PhoneOff, 
  Users, 
  Wifi, 
  WifiOff,
  Copy,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { useNotification } from '../contexts/NotificationContext'

const Meeting = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useSimpleAuth()
  const { showSuccess, showError } = useNotification()
  
  const meetingCode = searchParams.get('code')
  
  // 状态管理
  const [isJoined, setIsJoined] = useState(false)
  const [isJoining, setIsJoining] = useState(false)
  const [callStatus, setCallStatus] = useState('idle') // idle, connecting, connected, error
  const [remoteUsers, setRemoteUsers] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [connectionQuality, setConnectionQuality] = useState('good')
  const [errorMessage, setErrorMessage] = useState('')
  const [copied, setCopied] = useState(false)
  
  // Refs
  const clientRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localTracksRef = useRef([])
  
  const APP_ID = import.meta.env.VITE_AGORA_APP_ID || 'demo_app_id_for_testing'
  const CHANNEL_NAME = `meeting-${meetingCode}`

  useEffect(() => {
    if (!meetingCode) {
      navigate('/')
      return
    }
    
    if (!user) {
      navigate('/login')
      return
    }
    
    if (APP_ID === 'demo_app_id_for_testing') {
      setErrorMessage('Agora App ID 未配置，请检查环境变量')
      setCallStatus('error')
    }
  }, [meetingCode, user, navigate, APP_ID])

  // 生成会议代码
  const generateMeetingCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString()
  }

  // 加入会议
  const joinMeeting = async () => {
    if (!meetingCode || !user) return
    
    try {
      setIsJoining(true)
      setCallStatus('connecting')
      setErrorMessage('')
      
      console.log(`🚀 加入会议: ${meetingCode}`)
      
      // 清理之前的连接
      await cleanup()
      
      // 创建客户端
      const client = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8' 
      })
      clientRef.current = client
      
      // 设置事件监听器
      setupEventListeners(client)
      
      // 创建本地轨道
      await createLocalTracks()
      
      // 加入频道
      await joinChannel(client)
      
      setIsJoined(true)
      setIsJoining(false)
      
    } catch (error) {
      console.error('❌ 加入会议失败:', error)
      setErrorMessage(error.message || '加入会议失败')
      setCallStatus('error')
      setIsJoining(false)
    }
  }

  // 离开会议
  const leaveMeeting = async () => {
    await cleanup()
    setIsJoined(false)
    setCallStatus('idle')
    navigate('/')
  }

  // 设置事件监听器
  const setupEventListeners = (client) => {
    // 用户加入频道
    client.on('user-joined', (user) => {
      console.log('👤 用户加入会议:', user.uid)
      setConnectionQuality('good')
    })

    // 用户离开频道
    client.on('user-left', (user) => {
      console.log('👤 用户离开会议:', user.uid)
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
    })

    // 用户发布媒体
    client.on('user-published', async (user, mediaType) => {
      console.log('📺 用户发布媒体:', user.uid, mediaType)
      
      try {
        await client.subscribe(user, mediaType)
        
        if (mediaType === 'video') {
          if (remoteVideoRef.current) {
            user.videoTrack.play(remoteVideoRef.current)
          }
        }
        
        if (mediaType === 'audio') {
          user.audioTrack.play()
        }
        
        setRemoteUsers(prev => {
          const existingUser = prev.find(u => u.uid === user.uid)
          if (existingUser) {
            return prev.map(u => 
              u.uid === user.uid 
                ? { ...u, [mediaType]: user[`${mediaType}Track`] }
                : u
            )
          } else {
            return [...prev, user]
          }
        })
        
        if (callStatus === 'connecting') {
          setCallStatus('connected')
          setConnectionQuality('good')
          console.log('✅ 会议连接成功!')
        }
        
      } catch (error) {
        console.error('❌ 订阅用户媒体失败:', error)
      }
    })

    // 用户取消发布媒体
    client.on('user-unpublished', (user, mediaType) => {
      console.log('📺 用户取消发布媒体:', user.uid, mediaType)
      
      if (mediaType === 'video' && user.videoTrack) {
        user.videoTrack.stop()
      }
      if (mediaType === 'audio' && user.audioTrack) {
        user.audioTrack.stop()
      }
    })

    // 连接状态变化
    client.on('connection-state-change', (curState, prevState) => {
      console.log(`📡 连接状态变化: ${prevState} -> ${curState}`)
      
      switch (curState) {
        case 'CONNECTING':
          setConnectionQuality('connecting')
          break
        case 'CONNECTED':
          setConnectionQuality('good')
          if (callStatus === 'connecting') {
            setCallStatus('connected')
          }
          break
        case 'DISCONNECTED':
          setConnectionQuality('poor')
          break
      }
    })
  }

  // 创建本地轨道
  const createLocalTracks = async () => {
    try {
      console.log('🎥 创建本地音视频轨道...')
      
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks()
      localTracksRef.current = [audioTrack, videoTrack]
      
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current)
      }
      
      console.log('✅ 本地轨道创建成功')
      
    } catch (error) {
      console.error('❌ 创建本地轨道失败:', error)
      throw error
    }
  }

  // 加入频道
  const joinChannel = async (client) => {
    try {
      console.log(`🚪 加入频道: ${CHANNEL_NAME}`)
      
      const uid = Date.now() % 1000000
      await client.join(APP_ID, CHANNEL_NAME, null, uid)
      await client.publish(localTracksRef.current)
      
      console.log('✅ 成功加入频道并发布媒体')
      setCallStatus('connected')
      
    } catch (error) {
      console.error('❌ 加入频道失败:', error)
      throw error
    }
  }

  // 清理资源（保持同步函数，异步操作在内部执行）
  const cleanup = () => {
    console.log('🧹 清理会议资源...')

    localTracksRef.current.forEach(track => {
      track.stop()
      track.close()
    })
    localTracksRef.current = []

    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    setRemoteUsers([])
    setConnectionQuality('good')

    if (clientRef.current) {
      const client = clientRef.current
      clientRef.current = null

      const leaveChannel = async () => {
        try {
          await client.leave()
        } catch (leaveError) {
          if (
            !leaveError.message?.includes('statscollector') &&
            !leaveError.message?.includes('ERR_ADDRESS_UNREACHABLE')
          ) {
            console.error('离开频道失败:', leaveError)
          }
        } finally {
          console.log('✅ 清理完成')
        }
      }

      leaveChannel().catch(error => {
        console.error('❌ 清理失败:', error)
      })
    } else {
      console.log('✅ 清理完成')
    }
  }

  // 切换静音
  const toggleMute = () => {
    if (localTracksRef.current[0]) {
      localTracksRef.current[0].setEnabled(isMuted)
      setIsMuted(!isMuted)
    }
  }

  // 切换视频
  const toggleVideo = () => {
    if (localTracksRef.current[1]) {
      localTracksRef.current[1].setEnabled(isVideoEnabled)
      setIsVideoEnabled(!isVideoEnabled)
    }
  }

  // 复制会议链接
  const copyMeetingLink = async () => {
    const meetingLink = `${window.location.origin}/meeting?code=${meetingCode}`
    try {
      await navigator.clipboard.writeText(meetingLink)
      setCopied(true)
      showSuccess('会议链接已复制到剪贴板')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      showError('复制失败，请手动复制链接')
    }
  }

  // 渲染连接状态
  const renderConnectionStatus = () => {
    const statusConfig = {
      connecting: { 
        icon: <Loader2 className="w-4 h-4 animate-spin" />, 
        text: '正在连接...', 
        color: 'text-yellow-600' 
      },
      connected: { 
        icon: <Wifi className="w-4 h-4" />, 
        text: '已连接', 
        color: 'text-green-600' 
      },
      error: { 
        icon: <WifiOff className="w-4 h-4" />, 
        text: '连接失败', 
        color: 'text-red-600' 
      }
    }

    const config = statusConfig[callStatus] || statusConfig.connecting
    
    return (
      <div className={`flex items-center space-x-2 ${config.color}`}>
        {config.icon}
        <span className="text-sm font-medium">{config.text}</span>
      </div>
    )
  }

  // 渲染错误状态
  if (callStatus === 'error') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-4">连接失败</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            返回首页
          </button>
        </div>
      </div>
    )
  }

  // 渲染加入会议界面
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Video className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Join Meeting</h1>
            <p className="text-gray-600">Enter meeting code to join video conference</p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                会议代码
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={meetingCode || ''}
                  readOnly
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-2xl font-mono tracking-wider bg-gray-50"
                  placeholder="123456"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={copyMeetingLink}
                disabled={!meetingCode}
                className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '已复制' : '复制链接'}</span>
              </button>
              
              <button
                onClick={joinMeeting}
                disabled={!meetingCode || isJoining}
                className="flex-1 bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isJoining ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Video className="w-4 h-4" />
                )}
                <span>{isJoining ? 'Joining...' : 'Join Meeting'}</span>
              </button>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              返回首页
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 渲染会议界面
  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* 头部 */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">会议 {meetingCode}</h1>
          {renderConnectionStatus()}
          <div className="flex items-center space-x-2 text-sm text-gray-300">
            <Users className="w-4 h-4" />
            <span>{remoteUsers.length + 1} 人</span>
          </div>
        </div>
        <button 
          onClick={leaveMeeting}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          离开会议
        </button>
      </div>

      {/* 视频区域 */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
        {/* 本地视频 */}
        <div className="relative bg-gray-700 rounded-lg overflow-hidden">
          <video 
            ref={localVideoRef} 
            autoPlay 
            playsInline 
            muted 
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
            你 {isMuted && '(静音)'}
          </div>
          {!isVideoEnabled && (
            <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
              <VideoOff size={48} className="text-gray-400" />
            </div>
          )}
        </div>

        {/* 远程视频 */}
        <div className="relative bg-gray-700 rounded-lg overflow-hidden">
          {remoteUsers.length > 0 ? (
            <video 
              ref={remoteVideoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
              <Users size={64} className="mb-4" />
              <p className="text-lg">等待其他参与者加入...</p>
              <p className="text-sm mt-2">会议代码: {meetingCode}</p>
            </div>
          )}
          {remoteUsers.length > 0 && (
            <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              其他参与者 ({remoteUsers.length})
            </div>
          )}
        </div>
      </div>

      {/* 控制栏 */}
      <div className="flex justify-center items-center p-4 bg-gray-800 space-x-4">
        {/* 静音按钮 */}
        <button
          onClick={toggleMute}
          className={`p-3 rounded-full transition-colors ${
            isMuted 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-600 hover:bg-gray-500 text-white'
          }`}
        >
          {isMuted ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {/* 视频按钮 */}
        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition-colors ${
            !isVideoEnabled 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-gray-600 hover:bg-gray-500 text-white'
          }`}
        >
          {isVideoEnabled ? <Video size={24} /> : <VideoOff size={24} />}
        </button>

        {/* 结束通话按钮 */}
        <button
          onClick={leaveMeeting}
          className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
        >
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  )
}

export default Meeting
