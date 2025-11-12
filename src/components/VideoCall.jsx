import React, { useState, useRef, useEffect } from 'react'
import { X, Mic, MicOff, Video, VideoOff, Phone, PhoneOff } from 'lucide-react'

const VideoCall = ({ isOpen, onClose, sessionData, user }) => {
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const [isVideoEnabled, setIsVideoEnabled] = useState(true)
  const [isAudioEnabled, setIsAudioEnabled] = useState(true)
  const [isConnected, setIsConnected] = useState(false)
  const [callStatus, setCallStatus] = useState('connecting') // connecting, connected, ended
  const localStreamRef = useRef(null)
  const peerConnectionRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      // 延迟启动，确保组件完全渲染
      const timer = setTimeout(() => {
        startVideoCall()
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // 清理函数
  useEffect(() => {
    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  const startVideoCall = async () => {
    try {
      setCallStatus('connecting')
      
      // 获取用户媒体设备
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })
      
      localStreamRef.current = stream
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream
      }
      
      // 模拟连接成功（因为这是演示版本，没有真实的信令服务器）
      setTimeout(() => {
        setCallStatus('connected')
        setIsConnected(true)
        // 模拟远程视频流（使用本地流作为演示）
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = stream.clone()
        }
      }, 2000)
      
      console.log('Video call started successfully')
      
    } catch (error) {
      console.error('Error starting video call:', error)
      setCallStatus('ended')
      // 如果用户拒绝权限，显示错误信息
      if (error.name === 'NotAllowedError') {
        alert('请允许摄像头和麦克风权限以开始视频会议')
      }
    }
  }

  const endCall = () => {
    console.log('Ending video call...')
    
    // 停止所有媒体轨道
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log('Stopped track:', track.kind)
      })
      localStreamRef.current = null
    }
    
    // 清理视频元素
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null
    }
    
    // 清理WebRTC连接
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    
    setIsConnected(false)
    setCallStatus('ended')
    
    // 延迟关闭，让用户看到结束状态
    setTimeout(() => {
      onClose()
    }, 1000)
  }

  const toggleVideo = () => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoEnabled(videoTrack.enabled)
      }
    }
  }

  const toggleAudio = () => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioEnabled(audioTrack.enabled)
      }
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="flex-1 flex flex-col bg-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-black bg-opacity-50 text-white">
          <div>
            <h2 className="text-xl font-semibold">Video Call</h2>
            <p className="text-sm text-gray-300">
              Session: {sessionData?.subject || 'Tutoring Session'}
            </p>
          </div>
          <button
            onClick={endCall}
            className="text-gray-300 hover:text-white transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Video Area */}
        <div className="flex-1 relative bg-black" style={{ paddingBottom: '120px' }}>
          {/* Remote Video (Main) - Full Screen */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
            style={{ transform: 'scaleX(-1)' }}
          />
          
          {/* Call Status Overlay */}
          {callStatus === 'connecting' && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
              <div className="text-white text-center">
                <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-white mx-auto mb-6"></div>
                <p className="text-2xl font-medium">Connecting to video call...</p>
                <p className="text-lg text-gray-300 mt-3">Please wait while we establish the connection</p>
              </div>
            </div>
          )}
          
          {callStatus === 'connected' && (
            <div className="absolute top-6 left-6 bg-green-500 text-white px-4 py-2 rounded-full text-lg font-medium z-10">
              ✓ Connected
            </div>
          )}
          
          {callStatus === 'ended' && (
            <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
              <div className="text-white text-center">
                <PhoneOff className="w-20 h-20 mx-auto mb-6 text-red-400" />
                <p className="text-2xl font-medium">Call Ended</p>
                <p className="text-lg text-gray-300 mt-3">The video call has been terminated</p>
              </div>
            </div>
          )}

          {/* Local Video (Picture-in-Picture) */}
          <div className="absolute top-6 right-6 w-64 h-48 bg-gray-800 rounded-lg overflow-hidden shadow-2xl border-2 border-gray-600 z-10">
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          </div>
        </div>

        {/* Fixed Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 z-50">
          {/* Controls - Bottom Bar */}
          <div className="bg-black bg-opacity-90 backdrop-blur-sm border-t border-gray-700">
            <div className="flex items-center justify-center space-x-8 py-6">
              {/* Microphone Button */}
              <button
                onClick={toggleAudio}
                className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
                  isAudioEnabled 
                    ? 'bg-gray-600 text-white hover:bg-gray-500' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isAudioEnabled ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8" />}
              </button>

              {/* Camera Button */}
              <button
                onClick={toggleVideo}
                className={`p-4 rounded-full transition-all duration-200 shadow-lg ${
                  isVideoEnabled 
                    ? 'bg-gray-600 text-white hover:bg-gray-500' 
                    : 'bg-red-500 text-white hover:bg-red-600'
                }`}
              >
                {isVideoEnabled ? <Video className="w-8 h-8" /> : <VideoOff className="w-8 h-8" />}
              </button>

              {/* End Call Button */}
              <button
                onClick={endCall}
                className="p-4 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
            </div>
          </div>

          {/* Session Info - Bottom Bar */}
          <div className="bg-black bg-opacity-70 text-white px-6 py-3 border-t border-gray-700">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-6">
                <span className="font-medium">Duration: 0:00</span>
                <span className="font-medium">Participants: {user?.name}</span>
              </div>
              <div className="text-xs text-gray-300">
                {callStatus === 'connected' && 'Live'}
                {callStatus === 'connecting' && 'Connecting...'}
                {callStatus === 'ended' && 'Ended'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VideoCall
