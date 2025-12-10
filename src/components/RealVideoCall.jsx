import React, { useState, useEffect, useRef } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { X, Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Wifi, WifiOff, Users } from 'lucide-react'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'

const formatDuration = (totalSeconds = 0) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds))
  const hours = Math.floor(safeSeconds / 3600)
  const minutes = Math.floor((safeSeconds % 3600) / 60)
  const seconds = safeSeconds % 60

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

const RealVideoCall = ({ sessionData, onClose }) => {
  const { user } = useSimpleAuth()
  const APP_ID = import.meta.env.VITE_AGORA_APP_ID || 'demo_app_id_for_testing'
  const CHANNEL_NAME = `meeting-${sessionData?.meetingCode || 'default'}`
  
  // 状态管理
  const [callStatus, setCallStatus] = useState('idle') // idle, permission-request, connecting, waiting, connected, error, disconnected
  const [remoteUsers, setRemoteUsers] = useState([])
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [connectionQuality, setConnectionQuality] = useState('good')
  const [errorMessage, setErrorMessage] = useState('')
  const [retryCount, setRetryCount] = useState(0)
  const [isReconnecting, setIsReconnecting] = useState(false)
  const [permissionGranted, setPermissionGranted] = useState(false)
  const [callStartTime, setCallStartTime] = useState(null)
  const [callDuration, setCallDuration] = useState(0)
  const uidMappingRef = useRef(new Map()) // 追踪 UID 映射，解决同一个用户的多个 UID 问题
  const processedUidsRef = useRef(new Set()) // 追踪已处理的 UID，防止重复处理
  const [remoteVideoReady, setRemoteVideoReady] = useState(false)
  
  // Refs
  const clientRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const localTracksRef = useRef([])
  const connectionTimeoutRef = useRef(null)
  const retryTimeoutRef = useRef(null)
  const durationIntervalRef = useRef(null)
  
  // 连接超时时间（30秒）
  const CONNECTION_TIMEOUT = 30000
  const MAX_RETRY_COUNT = 3

  useEffect(() => {
    if (sessionData && APP_ID !== 'demo_app_id_for_testing') {
      // 首先请求权限
      requestPermissions()
    } else if (APP_ID === 'demo_app_id_for_testing') {
      setErrorMessage('Agora App ID not configured, please check environment variables')
      setCallStatus('error')
    }

    return () => {
      cleanup()
    }
  }, [sessionData, APP_ID])

  // 请求摄像头和麦克风权限
  const requestPermissions = async () => {
    try {
      setCallStatus('permission-request')
      
      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera and microphone functionality')
      }
      
      // 请求权限
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      // 关闭测试流
      stream.getTracks().forEach(track => track.stop())
      
      setPermissionGranted(true)
      setCallStatus('idle')
      
      // 权限获取成功后自动初始化通话
      setTimeout(() => {
        initializeCall()
      }, 500)
      
    } catch (error) {
      console.error('❌ 权限请求失败:', error)
      
      let errorMsg = 'Permission request failed'
      
      if (error.name === 'NotAllowedError') {
        errorMsg = 'Camera and microphone permissions were denied. Please click the camera icon in your browser address bar and allow permissions, then try again.'
      } else if (error.name === 'NotFoundError') {
        errorMsg = 'Camera or microphone device not found. Please check device connection.'
      } else if (error.name === 'NotReadableError') {
        errorMsg = 'Camera or microphone is being used by another application. Please close other applications and try again.'
      } else if (error.name === 'OverconstrainedError') {
        errorMsg = 'Camera does not support the required video format. Please try using a different device.'
      } else if (error.name === 'NotSupportedError') {
        errorMsg = 'Your browser does not support video calling functionality. Please use a modern browser.'
      } else if (error.message.includes('not support')) {
        errorMsg = 'Your browser does not support camera and microphone functionality'
      }
      
      setErrorMessage(errorMsg)
      setCallStatus('error')
    }
  }

  // 确保本地视频始终在播放
  useEffect(() => {
    const ensureLocalVideoPlaying = () => {
      if (localTracksRef.current && localTracksRef.current.length > 1) {
        const videoTrack = localTracksRef.current[1] // 视频轨道是第二个
        if (videoTrack && localVideoRef.current) {
          console.log('🔄 检查本地视频播放状态:', {
            videoTrack: videoTrack,
            element: localVideoRef.current,
            hasSrcObject: !!localVideoRef.current.srcObject,
            isEnabled: videoTrack.enabled
          })
          
          // 强制重新播放本地视频
          videoTrack.play(localVideoRef.current)
          localVideoRef.current.muted = true
          localVideoRef.current.autoplay = true
          localVideoRef.current.playsInline = true
          
          console.log('✅ 本地视频已重新播放到缩略图')
        }
      }
    }

    // 立即执行一次
    ensureLocalVideoPlaying()
    
    // 每2秒检查一次
    const interval = setInterval(ensureLocalVideoPlaying, 2000)
    
    return () => clearInterval(interval)
  }, [localTracksRef.current])

  // 确保远程视频元素在组件挂载后立即可用
  useEffect(() => {
    const checkRemoteVideoElement = () => {
      if (remoteVideoRef.current) {
        setRemoteVideoReady(true)
        console.log('✅ 远程视频元素已准备就绪:', {
          element: remoteVideoRef.current,
          id: remoteVideoRef.current.id,
          className: remoteVideoRef.current.className,
          tagName: remoteVideoRef.current.tagName
        })
      } else {
        setRemoteVideoReady(false)
        console.log('🔄 远程视频元素尚未准备就绪，继续等待...')
      }
    }

    // 立即检查一次
    checkRemoteVideoElement()

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          // 检查是否有新的视频元素被添加
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查是否是远程视频元素
              const remoteVideo = node.id === 'remote-video' || 
                                 node.querySelector?.('#remote-video') ||
                                 (node.tagName === 'VIDEO' && node.getAttribute?.('data-video-type') === 'remote')
              
              if (remoteVideo) {
                console.log('🎯 检测到远程视频元素被添加:', node)
                setTimeout(checkRemoteVideoElement, 100) // 延迟检查确保元素完全渲染
              }
            }
          })
        }
      })
      
      // 定期检查（作为备用机制）
      checkRemoteVideoElement()
    })

    // 监听整个文档的变化，确保能捕获到所有变化
    observer.observe(document.body, { 
      childList: true, 
      subtree: true, 
      attributes: true 
    })

    // 添加定期检查作为备用机制
    const intervalCheck = setInterval(checkRemoteVideoElement, 1000)

    return () => {
      observer.disconnect()
      clearInterval(intervalCheck)
    }
  }, [])

  // 监控远程用户列表变化
  useEffect(() => {
    console.log('🔄 远程用户列表发生变化:', {
      totalUsers: remoteUsers.length,
      clientUid: clientRef.current?.uid,
      users: remoteUsers.map(u => ({
        uid: u.uid,
        userName: u.userName,
        userRole: u.userRole,
        hasAudio: !!u.audioTrack,
        hasVideo: !!u.videoTrack,
        isOwnUser: u.uid === clientRef.current?.uid,
        uidComparison: {
          strict: u.uid === clientRef.current?.uid,
          string: String(u.uid) === String(clientRef.current?.uid),
          loose: u.uid == clientRef.current?.uid
        }
      }))
    })
    
    // 检查是否有重复的用户
    const uids = remoteUsers.map(u => u.uid)
    const uniqueUids = [...new Set(uids)]
    if (uids.length !== uniqueUids.length) {
      console.error('❌ 发现重复的 UID:', {
        total: uids.length,
        unique: uniqueUids.length,
        duplicates: uids.filter((uid, index) => uids.indexOf(uid) !== index)
      })
    }
  }, [remoteUsers])

  useEffect(() => {
    if (callStatus === 'connected' && !callStartTime) {
      const startedAt = Date.now()
      setCallStartTime(startedAt)
      setCallDuration(0)
    }
  }, [callStatus, callStartTime])

  useEffect(() => {
    if (!callStartTime) {
      const clientUid = clientRef.current?.uid
      const hasRemoteUser = remoteUsers.some(u => {
        if (u?.uid === undefined || clientUid === undefined) return false
        return u.uid !== clientUid && String(u.uid) !== String(clientUid)
      })

      if (hasRemoteUser) {
        const startedAt = Date.now()
        setCallStartTime(startedAt)
        setCallDuration(0)
      } else {
        if (durationIntervalRef.current) {
          clearInterval(durationIntervalRef.current)
          durationIntervalRef.current = null
        }
      }
      return
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
    }

    durationIntervalRef.current = setInterval(() => {
      setCallDuration(Math.floor((Date.now() - callStartTime) / 1000))
    }, 1000)

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
    }
  }, [callStartTime, remoteUsers])

  // 初始化通话
  const initializeCall = async () => {
    try {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }
      setCallStartTime(null)
      setCallDuration(0)

      console.log('🚀 开始初始化视频通话...')
      console.log('📊 会话信息:', {
        sessionId: sessionData?.id,
        meetingCode: sessionData?.meetingCode,
        channelName: CHANNEL_NAME,
        appId: APP_ID,
        user: user?.name,
        userRole: user?.role,
        tutor: sessionData?.tutor?.name,
        student: sessionData?.student?.name
      })
      setCallStatus('connecting')
      
      // 强制清理远程用户列表，确保从头开始
      setRemoteUsers([])
      uidMappingRef.current.clear() // 清理 UID 映射
      processedUidsRef.current.clear() // 清理已处理的 UID 集合
      console.log('🧹 已强制清理远程用户列表、UID 映射和已处理 UID 集合')
      
      // 额外检查：确保 remoteUsers 真的被清空了
      setTimeout(() => {
        console.log('🔍 检查远程用户列表是否已清空:', remoteUsers.length)
        if (remoteUsers.length > 0) {
          console.log('⚠️ 远程用户列表未清空，强制重置')
          setRemoteUsers([])
          uidMappingRef.current.clear()
          processedUidsRef.current.clear()
        }
      }, 100)
      
      // 添加全局错误监听器，忽略 statscollector 错误
      const originalConsoleError = console.error
      console.error = (...args) => {
        const message = args.join(' ')
        if (message.includes('statscollector') || 
            message.includes('ERR_ADDRESS_UNREACHABLE') ||
            message.includes('net::ERR_ADDRESS_UNREACHABLE')) {
          console.log('📊 忽略 Agora 统计数据收集错误（不影响功能）:', message)
          return
        }
        originalConsoleError.apply(console, args)
      }
      setErrorMessage('')
      setRetryCount(0)
      
      // 清理之前的连接
      await cleanup()
      
      // 创建客户端
      const client = AgoraRTC.createClient({ 
        mode: 'rtc', 
        codec: 'vp8' 
      })
      clientRef.current = client
      console.log('✅ Agora 客户端创建成功')
      
      // 设置事件监听器
      setupEventListeners(client)
      
      // 创建本地轨道
      await createLocalTracks()
      
      // 加入频道
      await joinChannel(client)
      
      // 设置连接超时
      setConnectionTimeout()
      
    } catch (error) {
      console.error('❌ 初始化通话失败:', error)
      handleConnectionError(error)
    }
  }

  // 设置事件监听器
  const setupEventListeners = (client) => {
    // 用户加入频道
    client.on('user-joined', (user) => {
      console.log('👤 用户加入频道:', user.uid)
      console.log('🔍 频道状态:', {
        channelName: CHANNEL_NAME,
        currentUser: user?.name,
        agoraUid: user.uid,
        callStatus: callStatus
      })
      setConnectionQuality('good')
    })

    // 用户离开频道
    client.on('user-left', (user) => {
      console.log('👤 用户离开频道:', user.uid)
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
      
      // 如果没有远程用户，回到等待状态
      if (remoteUsers.length <= 1) {
        setCallStatus('waiting')
      }
    })

    // 用户加入频道 - 这是真正的远程用户
    client.on('user-joined', (user) => {
      console.log('👥 用户加入频道:', user.uid)
      console.log('🔍 当前状态:', callStatus, '远程用户数量:', remoteUsers.length)
      
      // 检查是否是自己的用户
      if (user.uid === client.uid || String(user.uid) === String(client.uid)) {
        console.log('🚫 跳过：这是自己加入频道，不处理')
        return
      }
      
      // 这是真正的远程用户
      console.log('✅ 真正的远程用户加入:', user.uid, {
        userUid: user.uid,
        clientUid: client.uid,
        sessionData: {
          tutorUid: sessionData?.tutor?.uid,
          studentUid: sessionData?.student?.uid,
          tutorName: sessionData?.tutor?.name,
          studentName: sessionData?.student?.name
        },
        remoteUsersCount: remoteUsers.length
      })
      
      // 添加到远程用户列表
      setRemoteUsers(prev => {
        const existingUser = prev.find(u => u.uid === user.uid)
        if (existingUser) {
          console.log('📝 更新现有远程用户:', user.uid)
          return prev.map(u => u.uid === user.uid ? { ...u, joined: true } : u)
        } else {
          console.log('➕ 添加新的远程用户:', user.uid)
          return [...prev, {
            uid: user.uid,
            userName: user.uid === sessionData?.tutor?.uid ? sessionData?.tutor?.name : 
                     user.uid === sessionData?.student?.uid ? sessionData?.student?.name : 
                     `用户 ${user.uid}`,
            userRole: user.uid === sessionData?.tutor?.uid ? 'tutor' : 'student',
            audioTrack: null,
            videoTrack: null,
            joined: true
          }]
        }
      })
      
      // 如果有远程用户加入，更新状态为连接
      if (callStatus === 'waiting') {
        setCallStatus('connected')
        console.log('🔄 状态更新：waiting -> connected')
      }
    })

    // 用户发布媒体
    client.on('user-published', async (user, mediaType) => {
      console.log('📺 用户发布媒体:', user.uid, mediaType)
      
      // 简单检查：如果是自己的用户，直接跳过
      if (user.uid === client.uid || String(user.uid) === String(client.uid)) {
        console.log('🚫 跳过：这是自己的媒体流')
        return
      }
      
      // 检查是否是已知的远程用户
      const isKnownRemoteUser = remoteUsers.some(u => u.uid === user.uid)
      if (!isKnownRemoteUser) {
        console.log('⚠️ 未知用户发布媒体，可能是延迟的 user-joined 事件:', user.uid)
        // 如果是未知用户，可能是 user-joined 事件延迟了，先添加到列表
        setRemoteUsers(prev => {
          const existingUser = prev.find(u => u.uid === user.uid)
          if (existingUser) {
            return prev
          } else {
            return [...prev, {
              uid: user.uid,
              userName: user.uid === sessionData?.tutor?.uid ? sessionData?.tutor?.name : 
                       user.uid === sessionData?.student?.uid ? sessionData?.student?.name : 
                       `用户 ${user.uid}`,
              userRole: user.uid === sessionData?.tutor?.uid ? 'tutor' : 'student',
              audioTrack: null,
              videoTrack: null,
              joined: true
            }]
          }
        })
      }
      
      console.log('✅ 处理远程用户媒体发布:', user.uid, mediaType)
      
      // 简单检查：确保这不是我们自己的流
      if (user.uid === client.uid) {
        console.log('⚠️ 忽略自己的媒体流发布事件')
        return
      }
      
      try {
        // 订阅远程用户的媒体流
        await client.subscribe(user, mediaType)
        console.log('✅ 成功订阅用户媒体:', user.uid, mediaType)
        
        // 处理媒体播放
        if (mediaType === 'video' && user.videoTrack) {
          const playRemoteVideo = async (attempt = 1) => {
            if (remoteVideoRef.current) {
              try {
                user.videoTrack.play(remoteVideoRef.current)
                console.log('🎥 播放远程视频到主屏幕:', user.uid, {
                  videoTrack: user.videoTrack,
                  remoteVideoElement: remoteVideoRef.current,
                  elementId: remoteVideoRef.current.id,
                  attempt: attempt
                })
                
                // 确保视频元素属性正确
                remoteVideoRef.current.autoplay = true
                remoteVideoRef.current.playsInline = true
                remoteVideoRef.current.muted = false
                remoteVideoRef.current.setAttribute('data-video-type', 'remote')
                
              } catch (playError) {
                console.error('❌ 播放远程视频失败:', playError, user.uid, 'attempt:', attempt)
                
                // 如果失败且还有重试次数，延迟重试
                if (attempt < 5) {
                  console.log(`🔄 延迟重试播放远程视频 (${attempt}/5):`, user.uid)
                  setTimeout(() => playRemoteVideo(attempt + 1), 500 * attempt)
                }
              }
            } else {
              console.log('⏳ remoteVideoRef.current 未准备就绪，延迟重试:', attempt)
              if (attempt < 10) {
                setTimeout(() => playRemoteVideo(attempt + 1), 300 * attempt)
              }
            }
          }
          
          playRemoteVideo()
        }
        
        // 更新远程用户列表
        setRemoteUsers(prev => {
          const existingUser = prev.find(u => u.uid === user.uid)
          if (existingUser) {
            // 更新现有用户
            return prev.map(u => u.uid === user.uid ? {
              ...u,
              [`${mediaType}Track`]: user[`${mediaType}Track`]
            } : u)
          } else {
            // 添加新用户
            return [...prev, {
              uid: user.uid,
              userName: user.uid === sessionData?.tutor?.uid ? sessionData?.tutor?.name : 
                       user.uid === sessionData?.student?.uid ? sessionData?.student?.name : 
                       `用户 ${user.uid}`,
              userRole: user.uid === sessionData?.tutor?.uid ? 'tutor' : 'student',
              [`${mediaType}Track`]: user[`${mediaType}Track`]
            }]
          }
        })
        
        // 如果有远程用户，更新状态为连接
        if (callStatus === 'waiting') {
          setCallStatus('connected')
          console.log('🔄 状态更新：waiting -> connected')
        }
        
        if (mediaType === 'audio') {
          // 播放远程音频
          user.audioTrack.play()
          console.log('🔊 播放远程音频:', user.uid)
        }
        
      } catch (error) {
        console.error('❌ 订阅用户媒体失败:', error)
      }
    })

    // 用户离开频道
    client.on('user-left', (user) => {
      console.log('👋 用户离开频道:', user.uid)
      
      // 从远程用户列表中移除
      setRemoteUsers(prev => prev.filter(u => u.uid !== user.uid))
      
      // 如果没有远程用户了，回到等待状态
      if (remoteUsers.length <= 1) {
        setCallStatus('waiting')
        console.log('🔄 状态更新：connected -> waiting (无远程用户)')
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
            setCallStatus('waiting')
          }
          break
        case 'DISCONNECTING':
          setConnectionQuality('poor')
          console.log('🔌 正在断开连接，清理远程用户列表')
          setRemoteUsers([])
          break
        case 'DISCONNECTED':
          setConnectionQuality('poor')
          handleDisconnection()
          break
        case 'RECONNECTING':
          setConnectionQuality('connecting')
          setIsReconnecting(true)
          break
      }
    })

    // 网络质量变化
    client.on('network-quality', (stats) => {
      if (stats.uplinkNetworkQuality === 0 || stats.uplinkNetworkQuality === 1) {
        setConnectionQuality('good')
      } else if (stats.uplinkNetworkQuality === 2) {
        setConnectionQuality('poor')
      } else {
        setConnectionQuality('poor')
      }
    })
  }

  // 创建本地轨道
  const createLocalTracks = async () => {
    try {
      console.log('🎥 创建本地音视频轨道...')
      
      // 检查浏览器权限支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('您的浏览器不支持摄像头和麦克风功能')
      }
      
      // 创建音视频轨道
      const [audioTrack, videoTrack] = await AgoraRTC.createMicrophoneAndCameraTracks({
        microphoneId: undefined, // 使用默认麦克风
        cameraId: undefined      // 使用默认摄像头
      }, {
        cameraId: undefined,     // 使用默认摄像头
        width: 640,
        height: 480,
        frameRate: 15
      })
      
      localTracksRef.current = [audioTrack, videoTrack]
      
      // 播放本地视频到右下角缩略图
      if (localVideoRef.current) {
        videoTrack.play(localVideoRef.current)
        console.log('🎥 本地视频播放到右下角缩略图:', {
          element: localVideoRef.current,
          videoTrack: videoTrack,
          isEnabled: videoTrack.enabled,
          muted: videoTrack.muted,
          elementSrc: localVideoRef.current.srcObject
        })
        
        // 确保视频元素有正确的属性
        localVideoRef.current.muted = true
        localVideoRef.current.autoplay = true
        localVideoRef.current.playsInline = true
        localVideoRef.current.setAttribute('data-video-type', 'local')
        localVideoRef.current.style.backgroundColor = 'transparent'
        
      } else {
        console.error('❌ localVideoRef.current 为空，无法播放本地视频')
      }
      
      console.log('✅ 本地轨道创建成功')
      
    } catch (error) {
      console.error('❌ 创建本地轨道失败:', error)
      
      // 根据错误类型提供具体的错误信息
      let errorMsg = '创建音视频轨道失败'
      
      if (error.code === 'PERMISSION_DENIED' || error.message.includes('Permission denied')) {
        errorMsg = '需要允许访问摄像头和麦克风权限才能进行视频通话。请在浏览器设置中允许权限，然后刷新页面重试。'
      } else if (error.message.includes('NotAllowedError')) {
        errorMsg = '摄像头和麦克风权限被拒绝。请点击地址栏的摄像头图标，允许权限后重试。'
      } else if (error.message.includes('NotFoundError')) {
        errorMsg = '未找到摄像头或麦克风设备。请检查设备连接。'
      } else if (error.message.includes('NotReadableError')) {
        errorMsg = '摄像头或麦克风被其他应用占用，请关闭其他应用后重试。'
      } else if (error.message.includes('OverconstrainedError')) {
        errorMsg = '摄像头不支持所需的视频格式，请尝试使用其他设备。'
      } else if (error.message.includes('NotSupportedError')) {
        errorMsg = '您的浏览器不支持视频通话功能，请使用现代浏览器。'
      } else if (error.message.includes('不支持')) {
        errorMsg = '您的浏览器不支持摄像头和麦克风功能'
      }
      
      setErrorMessage(errorMsg)
      throw error
    }
  }

  // 加入频道
  const joinChannel = async (client) => {
    try {
      console.log(`🚪 加入频道: ${CHANNEL_NAME}`)
      console.log('📊 频道信息:', {
        channelName: CHANNEL_NAME,
        appId: APP_ID,
        userRole: user?.role,
        userName: user?.name,
        meetingCode: sessionData?.meetingCode
      })
      
      // 使用固定的 UID 策略，确保同一个用户总是使用相同的 UID
      // 基于用户ID生成一个固定的数字UID，避免 Agora 自动分配不同的UID
      const uid = Math.abs(parseInt(user?.uid?.replace(/[^0-9]/g, '') || '0', 10)) % 1000000000
      
      console.log('🔍 UID 分配策略:', {
        userUid: user?.uid,
        generatedUid: uid,
        userName: user?.name,
        userRole: user?.role
      })
      
      // 加入频道 - 添加特殊错误处理
      try {
        await client.join(APP_ID, CHANNEL_NAME, null, uid)
      } catch (joinError) {
        // 检查是否是 statscollector 错误
        if (joinError.message?.includes('statscollector') || 
            joinError.message?.includes('ERR_ADDRESS_UNREACHABLE') ||
            joinError.message?.includes('net::ERR_ADDRESS_UNREACHABLE')) {
          console.log('📊 忽略 Agora 统计数据收集错误（不影响功能）:', joinError.message)
          // 即使有 statscollector 错误，也继续执行
        } else {
          throw joinError // 重新抛出其他错误
        }
      }
      
      // 发布本地轨道
      await client.publish(localTracksRef.current)
      
      console.log('✅ 成功加入频道并发布媒体')
      console.log('📊 发布状态:', {
        channelName: CHANNEL_NAME,
        localTracks: localTracksRef.current.length,
        audioTrack: localTracksRef.current[0] ? '已发布' : '未发布',
        videoTrack: localTracksRef.current[1] ? '已发布' : '未发布'
      })
      setCallStatus('waiting')
      
    } catch (error) {
      console.error('❌ 加入频道失败:', error)
      throw error
    }
  }

  // 设置连接超时
  const setConnectionTimeout = () => {
    connectionTimeoutRef.current = setTimeout(() => {
      if (callStatus === 'connecting' || callStatus === 'waiting') {
        console.warn('⚠️ 连接超时')
        handleConnectionError(new Error('连接超时，请检查网络连接'))
      }
    }, CONNECTION_TIMEOUT)
  }

  // 清除连接超时
  const clearConnectionTimeout = () => {
    if (connectionTimeoutRef.current) {
      clearTimeout(connectionTimeoutRef.current)
      connectionTimeoutRef.current = null
    }
  }

  // 处理连接错误
  const handleConnectionError = (error) => {
    console.error('❌ 连接错误:', error)
    setErrorMessage(error.message || '连接失败')
    
    if (retryCount < MAX_RETRY_COUNT) {
      setRetryCount(prev => prev + 1)
      setIsReconnecting(true)
      
      // 延迟重试
      retryTimeoutRef.current = setTimeout(() => {
        console.log(`🔄 尝试重新连接 (${retryCount + 1}/${MAX_RETRY_COUNT})...`)
        initializeCall()
      }, 2000 * (retryCount + 1)) // 递增延迟
    } else {
      setCallStatus('error')
      setIsReconnecting(false)
    }
  }

  // 处理断开连接
  const handleDisconnection = () => {
    if (callStatus === 'connected') {
      setCallStatus('disconnected')
      setIsReconnecting(true)
      
      // 尝试重新连接
      setTimeout(() => {
        if (retryCount < MAX_RETRY_COUNT) {
          initializeCall()
        }
      }, 3000)
    }
  }

  // 清理资源（保持同步函数，内部运行异步任务）
  const cleanup = () => {
    console.log('🧹 清理通话资源...')

    // 清除定时器
    clearConnectionTimeout()
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current)
      retryTimeoutRef.current = null
    }

    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }

    // 停止本地轨道
    localTracksRef.current.forEach(track => {
      track.stop()
      track.close()
    })
    localTracksRef.current = []

    // 清理视频元素
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }

    // 标记状态重置（避免在卸载期间触发额外渲染）
    setCallStatus(prev => (prev === 'idle' ? prev : 'idle'))
    setRemoteUsers([])
    setIsReconnecting(false)
    setRetryCount(0)
    setConnectionQuality('good')

    // 异步离开频道（不阻塞 cleanup 返回）
    if (clientRef.current) {
      const client = clientRef.current
      clientRef.current = null

      const leaveChannel = async () => {
        try {
          await client.leave()
          console.log('✅ 已成功离开频道')
        } catch (leaveError) {
          if (
            leaveError.message?.includes('statscollector') ||
            leaveError.message?.includes('ERR_ADDRESS_UNREACHABLE') ||
            leaveError.message?.includes('net::ERR_ADDRESS_UNREACHABLE')
          ) {
            console.log('📊 忽略 Agora 统计数据收集错误（不影响功能）:', leaveError.message)
          } else {
            console.error('❌ 离开频道失败:', leaveError)
          }
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
      const newMuteState = !isMuted
      localTracksRef.current[0].setEnabled(newMuteState)
      setIsMuted(newMuteState)
      console.log('🎤 Microphone toggled:', { from: isMuted, to: newMuteState })
    }
  }

  // 切换视频
  const toggleVideo = () => {
    if (localTracksRef.current[1]) {
      const newVideoState = !isVideoEnabled
      localTracksRef.current[1].setEnabled(newVideoState)
      setIsVideoEnabled(newVideoState)
      console.log('🎥 Video toggled:', { from: isVideoEnabled, to: newVideoState })
    }
  }

  // 结束通话
  const endCall = async () => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }

    const elapsedSeconds = callStartTime
      ? Math.floor((Date.now() - callStartTime) / 1000)
      : callDuration
    const safeDuration = Math.max(elapsedSeconds, 0)
    setCallDuration(safeDuration)

    // 更新会话状态为 completed
    if (sessionData?.id) {
      try {
        const { doc, updateDoc, serverTimestamp } = await import('firebase/firestore')
        const { db } = await import('../firebase/config')
        
        const sessionRef = doc(db, 'sessions', sessionData.id)
        await updateDoc(sessionRef, {
          status: 'completed',
          completedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          callDurationSeconds: safeDuration,
          callDurationFormatted: formatDuration(safeDuration)
        })
        
        console.log('✅ Session marked as completed:', sessionData.id)
        
        // 创建账单（只有当通话时长超过1分钟时）
        if (safeDuration >= 60 && sessionData.studentId && sessionData.tutorId) {
          try {
            const { createInvoice } = await import('../services/invoiceService')
            const durationMinutes = Math.ceil(safeDuration / 60) // 向上取整到分钟
            const result = await createInvoice(
              sessionData.id,
              sessionData.studentId,
              sessionData.tutorId,
              durationMinutes,
              sessionData.subject || 'Tutoring Session'
            )
            
            if (result.success) {
              console.log('📄 Invoice created successfully:', result.invoiceId)
            } else {
              console.error('❌ Failed to create invoice:', result.error)
            }
          } catch (invoiceError) {
            console.error('❌ Error creating invoice:', invoiceError)
          }
        }
      } catch (error) {
        console.error('❌ Failed to update session status:', error)
      }
    }
    
    onClose()
  }

  // 重试连接
  const retryConnection = () => {
    setRetryCount(0)
    setErrorMessage('')
    initializeCall()
  }

  // 渲染连接状态指示器
  const renderConnectionStatus = () => {
    const statusConfig = {
      connecting: { 
        icon: <Wifi className="w-4 h-4 animate-pulse" />, 
        text: 'Connecting...', 
        color: 'text-yellow-600' 
      },
      waiting: { 
        icon: <Users className="w-4 h-4 animate-pulse" />, 
        text: 'Waiting for other users to join...', 
        color: 'text-blue-600' 
      },
      connected: { 
        icon: <Wifi className="w-4 h-4" />, 
        text: 'Connected', 
        color: 'text-green-600' 
      },
      disconnected: { 
        icon: <WifiOff className="w-4 h-4" />, 
        text: 'Disconnected', 
        color: 'text-red-600' 
      },
      error: { 
        icon: <WifiOff className="w-4 h-4" />, 
        text: 'Connection Failed', 
        color: 'text-red-600' 
      }
    }

    const config = statusConfig[callStatus] || statusConfig.connecting
    
    return (
      <div className={`flex items-center space-x-2 ${config.color}`}>
        {config.icon}
        <span className="text-sm font-medium">{config.text}</span>
        {isReconnecting && (
          <span className="text-xs text-gray-500">(重新连接中...)</span>
        )}
      </div>
    )
  }

  // 渲染权限请求状态
  if (callStatus === 'permission-request') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <div className="text-blue-500 text-4xl mb-4">🎥</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Camera and Microphone Permission Required</h2>
          <p className="text-gray-600 mb-6">
            To make video calls, we need access to your camera and microphone. Please click "Allow" in the browser permission request popup.
          </p>
          <div className="text-sm text-gray-500 mb-4">
            💡 If the permission request doesn't pop up, please check the camera icon in your browser address bar
          </div>
          <button
            onClick={requestPermissions}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors mr-3"
          >
            Retry Permission Request
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )
  }

  // 渲染错误状态
  if (callStatus === 'error') {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
        <div className="bg-white p-8 rounded-lg shadow-xl text-center max-w-md">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">连接失败</h2>
          <p className="text-gray-600 mb-6">{errorMessage}</p>
          <div className="flex space-x-4">
            <button
              onClick={retryConnection}
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
            >
              重试连接
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 渲染主界面
  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center z-50 p-4">
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden">
        
        {/* 头部 */}
        <div className="flex justify-between items-center p-4 bg-gray-700 text-white">
          <div className="flex items-center space-x-4">
            <h2 className="text-xl font-semibold">
              {sessionData?.subject || '视频通话'}
            </h2>
            {renderConnectionStatus()}
            {callStartTime && (
              <div className="px-2 py-1 rounded bg-black/40 text-xs font-mono text-gray-100">
                Call Time: {formatDuration(callDuration)}
              </div>
            )}
            <div className="text-xs text-gray-300">
              频道: {CHANNEL_NAME} | 用户: {user?.name || 'Unknown'}
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-300 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 视频区域 */}
        <div className="flex-1 flex flex-col gap-4 p-4 min-h-0">
          
          {/* 远程视频 - 占据全屏 */}
          <div className="relative bg-gray-700 rounded-lg overflow-hidden flex-1 min-h-0">
            {(() => {
              // 超强检查：确保有真正的远程用户（不是自己）
              const realRemoteUsers = remoteUsers.filter(user => {
                const clientUid = clientRef.current?.uid
                const isNotSelf = user.uid !== clientUid && 
                                 String(user.uid) !== String(clientUid) &&
                                 user.uid != clientUid &&
                                 Math.abs(user.uid - clientUid) >= 1
                const hasVideoTrack = !!user.videoTrack
                
                console.log('🔍 超强检查远程用户:', {
                  uid: user.uid,
                  clientUid: clientUid,
                  isNotSelf,
                  hasVideoTrack,
                  userName: user.userName,
                  userRole: user.userRole,
                  // 添加更多调试信息
                  uidType: typeof user.uid,
                  clientUidType: typeof clientUid,
                  strictEqual: user.uid === clientUid,
                  looseEqual: user.uid == clientUid,
                  stringEqual: String(user.uid) === String(clientUid),
                  numericDiff: Math.abs(user.uid - clientUid),
                  willShow: isNotSelf && hasVideoTrack
                })
                
                return isNotSelf && hasVideoTrack
              })
              
              const hasRealRemoteUsers = realRemoteUsers.length > 0
              
              console.log('🎥 视频显示逻辑检查:', {
                remoteUsersLength: remoteUsers.length,
                realRemoteUsersLength: realRemoteUsers.length,
                callStatus: callStatus,
                hasRealRemoteUsers: hasRealRemoteUsers,
                allRemoteUsers: remoteUsers.map(u => ({ 
                  uid: u.uid, 
                  userName: u.userName, 
                  userRole: u.userRole,
                  hasVideoTrack: !!u.videoTrack,
                  clientUid: clientRef.current?.uid,
                  isNotSelf: u.uid !== clientRef.current?.uid
                })),
                realRemoteUsers: realRemoteUsers.map(u => ({
                  uid: u.uid,
                  userName: u.userName,
                  userRole: u.userRole
                }))
              })
              
              if (!hasRealRemoteUsers) {
                console.log('📺 显示等待界面 - 没有真正的远程用户，等待其他人加入', {
                  reason: 'noRealRemoteUsers',
                  remoteUsersCount: remoteUsers.length,
                  realRemoteUsersCount: realRemoteUsers.length,
                  callStatus: callStatus
                })
                return false
              }
              
              console.log('📺 显示远程视频 - 有真正的远程用户:', realRemoteUsers.length, {
                realRemoteUsers: realRemoteUsers.map(u => ({
                  uid: u.uid,
                  userName: u.userName,
                  userRole: u.userRole
                }))
              })
              return true
            })() ? (
              <>
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover"
                  data-video-type="remote"
                  id="remote-video"
                />
                
                {/* 远程用户标签 */}
                {remoteUsers.map((remoteUser, index) => (
                  <div key={remoteUser.uid} className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                    {remoteUser.userName || `用户 ${remoteUser.uid}`} 
                    {remoteUser.userRole && ` (${remoteUser.userRole})`}
                  </div>
                ))}
                
                {/* 本地视频缩略图 - 右下角 */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-white">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                    data-video-type="local"
                    id="local-video"
                    style={{ 
                      transform: 'scaleX(-1)', // 镜像翻转，让用户看到自己的镜像
                      backgroundColor: isVideoEnabled ? 'transparent' : '#374151' // 如果没有视频，显示灰色背景
                    }}
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-gray-700 bg-opacity-80 flex items-center justify-center">
                      <VideoOff size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                    You {isMuted && '(Muted)'}
                  </div>
                </div>
              </>
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 relative">
                <Users size={64} className="mb-4" />
                <p className="text-lg">
                  {callStatus === 'waiting' ? 'Waiting for other users to join...' : 'No other users'}
                </p>
                <p className="text-sm mt-2">Channel: {CHANNEL_NAME}</p>
                <p className="text-xs mt-1 text-gray-500">
                  Your identity: {user?.name || 'Unknown User'}
                </p>
                
                {/* 本地状态显示 */}
                <div className="mt-4 flex items-center space-x-4 text-xs">
                  <div className="flex items-center space-x-1">
                    {isMuted ? <MicOff className="w-4 h-4 text-red-400" /> : <Mic className="w-4 h-4 text-green-400" />}
                    <span>{isMuted ? 'Muted' : 'Microphone On'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {isVideoEnabled ? <Video className="w-4 h-4 text-green-400" /> : <VideoOff className="w-4 h-4 text-red-400" />}
                    <span>{isVideoEnabled ? 'Camera On' : 'Camera Off'}</span>
                  </div>
                </div>
                
                {/* 本地视频缩略图 - 右下角（等待时也显示） */}
                <div className="absolute bottom-4 right-4 w-32 h-24 bg-gray-800 rounded-lg overflow-hidden shadow-lg border-2 border-white">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted
                    className="w-full h-full object-cover"
                    data-video-type="local"
                    id="local-video-waiting"
                    style={{ 
                      transform: 'scaleX(-1)', // 镜像翻转，让用户看到自己的镜像
                      backgroundColor: isVideoEnabled ? 'transparent' : '#374151' // 如果没有视频，显示灰色背景
                    }}
                  />
                  {!isVideoEnabled && (
                    <div className="absolute inset-0 bg-gray-700 bg-opacity-80 flex items-center justify-center">
                      <VideoOff size={20} className="text-gray-400" />
                    </div>
                  )}
                  <div className="absolute bottom-1 left-1 bg-black bg-opacity-70 text-white text-xs px-1 py-0.5 rounded">
                    You {isMuted && '(Muted)'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 控制栏 */}
        <div className="flex justify-center items-center p-4 bg-gray-700 space-x-4">
          
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
            onClick={endCall}
            className="p-3 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors"
          >
            <PhoneOff size={24} />
          </button>
        </div>
      </div>
    </div>
  )
}

export default RealVideoCall