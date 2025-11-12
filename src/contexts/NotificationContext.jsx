import React, { createContext, useContext, useState } from 'react'
import AnimatedNotification from '../components/AnimatedNotification'

const NotificationContext = createContext()

export const useNotification = () => {
  return useContext(NotificationContext)
}

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([])

  const showNotification = (type, message, duration = 3000, title = null) => {
    const id = Date.now() + Math.random()
    const newNotification = { id, type, message, duration, title }
    
    setNotifications(prev => [...prev, newNotification])
  }

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const showSuccess = (message, duration = 4000, title = null) => showNotification('success', message, duration, title)
  const showError = (message, duration = 5000, title = null) => showNotification('error', message, duration, title)
  const showWarning = (message, duration = 4000, title = null) => showNotification('warning', message, duration, title)
  const showInfo = (message, duration = 4000, title = null) => showNotification('info', message, duration, title)

  const value = {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showNotification
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notifications.map((notification, index) => (
        <div 
          key={notification.id}
          className="fixed left-1/2 top-6 z-[9999] transform -translate-x-1/2"
          style={{ 
            transform: `translate(-50%, 0) translateY(${index * 90}px)`,
            zIndex: 9999 - index
          }}
        >
          <AnimatedNotification
            show={true}
            onClose={() => removeNotification(notification.id)}
            type={notification.type}
            title={notification.title || getDefaultTitle(notification.type)}
            message={notification.message}
            duration={notification.duration}
          />
        </div>
      ))}
    </NotificationContext.Provider>
  )
}

const getDefaultTitle = (type) => {
  switch (type) {
    case 'success':
      return 'Success'
    case 'error':
      return 'Error'
    case 'warning':
      return 'Warning'
    case 'info':
      return 'Info'
    default:
      return 'Notification'
  }
}
