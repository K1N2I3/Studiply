import React, { useEffect, useRef, useState } from 'react'
import { CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react'
import { subscribeNotifications, markAllNotificationsRead } from '../services/notificationService'
import { useSimpleAuth } from '../contexts/SimpleAuthContext'
import { safeToDate } from '../utils/timestampUtils'

const typeMap = {
  success: { icon: CheckCircle, classes: 'bg-green-50 border-green-200 text-green-800' },
  error: { icon: XCircle, classes: 'bg-red-50 border-red-200 text-red-800' },
  warning: { icon: AlertTriangle, classes: 'bg-yellow-50 border-yellow-200 text-yellow-800' },
  info: { icon: Info, classes: 'bg-blue-50 border-blue-200 text-blue-800' }
}

const ANIM_MS = 220

const NotificationDropdown = ({ open, onClose, onMouseEnter, onMouseLeave }) => {
  const { user } = useSimpleAuth()
  const [items, setItems] = useState([])
  const ref = useRef(null)
  const [mounted, setMounted] = useState(open)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let unsub = null
    
    const cleanup = () => {
      if (unsub && typeof unsub === 'function') {
        try {
          unsub()
        } catch (error) {
          console.error('Error cleaning up notifications listener:', error)
        }
      }
    }
    
    if (!user?.id) {
      return cleanup
    }
    
    unsub = subscribeNotifications(user?.id, setItems, 20)
    return cleanup
  }, [user?.id])

  // 悬停交互由父组件托管，此处不再监听全局点击关闭

  // 控制更丝滑的挂载/卸载动画
  useEffect(() => {
    if (open) {
      setMounted(true)
      // 下一帧再设为可见，触发过渡
      const id = requestAnimationFrame(() => setVisible(true))
      return () => cancelAnimationFrame(id)
    } else {
      setVisible(false)
      const t = setTimeout(() => setMounted(false), ANIM_MS)
      return () => clearTimeout(t)
    }
  }, [open])

  if (!mounted) return null

  return (
    <div
      ref={ref}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`absolute right-0 top-10 w-80 sm:w-96 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 overflow-hidden z-50 transition-all ${
        visible
          ? 'opacity-100 translate-y-0 scale-100 shadow-2xl'
          : 'opacity-0 -translate-y-2 scale-95 shadow-lg'
      }`}
      style={{
        transformOrigin: '90% 0%',
        transitionDuration: `${ANIM_MS}ms`,
        transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)'
      }}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
        <button className="text-xs text-blue-600 hover:underline" onClick={() => user?.id && markAllNotificationsRead(user?.id)}>Mark all as read</button>
      </div>
      <div className="max-h-96 overflow-auto divide-y divide-gray-100">
        {items.length === 0 ? (
          <div className="p-6 text-center text-gray-500 text-sm">No notifications</div>
        ) : (
          items.map((n) => {
            const map = typeMap[n.type] || typeMap.info
            const Icon = map.icon
            const prettyMessage = (() => {
              // 优先使用 fromName + subject 构造更友好的文案
              if (n.fromName && n.subject) {
                if ((n.title || '').toLowerCase().includes('request')) {
                  return `${n.fromName} requested a ${n.subject} session`
                }
                if ((n.title || '').toLowerCase().includes('accepted')) {
                  return `${n.fromName} accepted your ${n.subject} session`
                }
                if ((n.title || '').toLowerCase().includes('declined') || (n.title || '').toLowerCase().includes('rejected')) {
                  return `${n.fromName} declined your ${n.subject} session`
                }
              }
              // 如果消息以一串数字开头，则用 fromName 替换掉这串数字
              if (n.fromName && typeof n.message === 'string') {
                return n.message.replace(/^\d{6,}/, n.fromName)
              }
              return n.message
            })()
            return (
              <div key={n.id} className="flex items-start gap-3 p-4 hover:bg-gray-50">
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${map.classes}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{n.title || 'Notification'}</div>
                  <div className="text-sm text-gray-600 truncate">{prettyMessage}</div>
                  <div className="text-xs text-gray-400 mt-1">{n.createdAt ? safeToDate(n.createdAt)?.toLocaleString() || '' : ''}</div>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default NotificationDropdown


