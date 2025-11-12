import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { SimpleAuthProvider, useSimpleAuth } from './contexts/SimpleAuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import { ThemeProvider } from './contexts/ThemeContext'

// Import pages
import Home from './pages/Home'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Register from './pages/Register'
import Tutoring from './pages/Tutoring'
import Friends from './pages/Friends'
import Chat from './pages/Chat'
import FocusMode from './pages/FocusMode'
import Profile from './pages/Profile'
import TutorDashboard from './pages/TutorDashboard'
import TestPage from './pages/TestPage'
import Debug from './pages/Debug'
import MinimalTest from './pages/MinimalTest'
import NotificationTest from './pages/NotificationTest'
import FocusModeTest from './pages/FocusModeTest'
import AgoraTest from './pages/AgoraTest'
import Meeting from './pages/Meeting'
import StudentDashboard from './pages/StudentDashboard'
import TutorAccountsAdmin from './pages/TutorAccountsAdmin'
import LearningSession from './pages/LearningSession'
import MacOSLoginHandler from './pages/MacOSLoginHandler'
import MacOSLogin from './pages/MacOSLogin'

// Import components
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'

function AppContent() {
  const { user } = useSimpleAuth()
  const location = useLocation()

  // 检查是否有macOS应用回调参数
  const urlParams = new URLSearchParams(location.search)
  const redirectUri = urlParams.get('redirect_uri')
  const platform = urlParams.get('platform')
  const isMacOSCallback = redirectUri && platform === 'macos'

  // 如果是macOS应用回调，直接显示专门的macOS登录页面
  if (isMacOSCallback) {
    return <MacOSLogin />
  }

  // 如果用户已登录，Header会处理整个布局
  if (user) {
    return <Header />
  }

  // 如果用户未登录，显示传统的Header + Routes布局
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/test" element={<TestPage />} />
        <Route path="/debug" element={<Debug />} />
        <Route path="/minimal-test" element={<MinimalTest />} />
        <Route path="/notification-test" element={<NotificationTest />} />
        <Route path="/focus-test" element={<FocusModeTest />} />
        <Route path="/agora-test" element={<AgoraTest />} />
        <Route path="/meeting" element={<Meeting />} />
        <Route path="/tutoring" element={<Tutoring />} />
        <Route path="/friends" element={<Friends />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/focus-mode" element={<FocusMode />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/tutor-dashboard" element={<TutorDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/admin/tutor-accounts" element={<TutorAccountsAdmin />} />
        <Route path="/macos-login" element={<MacOSLoginHandler />} />
      </Routes>
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <SimpleAuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
            <AppContent />
          </Router>
        </SimpleAuthProvider>
      </NotificationProvider>
    </ThemeProvider>
  )
}

export default App