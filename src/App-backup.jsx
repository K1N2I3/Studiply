import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { SimpleAuthProvider } from './contexts/SimpleAuthContext'
import { NotificationProvider } from './contexts/NotificationContext'
import ErrorBoundary from './components/ErrorBoundary'
import Header from './components/Header'
import ProtectedRoute from './components/ProtectedRoute'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Tutoring from './pages/Tutoring'
import Friends from './pages/Friends'
import Chat from './pages/Chat'
import FocusMode from './pages/FocusMode'
import Missions from './pages/Missions'
import Profile from './pages/Profile'
import TutorDashboard from './pages/TutorDashboard'
import TestPage from './pages/TestPage'

function App() {
  return (
    <ErrorBoundary>
      <NotificationProvider>
        <SimpleAuthProvider>
          <Router
            future={{
              v7_startTransition: true,
              v7_relativeSplatPath: true
            }}
          >
        <div className="min-h-screen bg-gray-50">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tutoring"
                element={
                  <ProtectedRoute>
                    <Tutoring />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/friends"
                element={
                  <ProtectedRoute>
                    <Friends />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chat/:friendId"
                element={
                  <ProtectedRoute>
                    <Chat />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/focus-mode"
                element={
                  <ProtectedRoute>
                    <FocusMode />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/missions"
                element={
                  <ProtectedRoute>
                    <Missions />
                  </ProtectedRoute>
                } 
              />
                     <Route
                       path="/profile"
                       element={
                         <ProtectedRoute>
                           <Profile />
                         </ProtectedRoute>
                       }
                     />
                     <Route
                       path="/tutor-dashboard"
                       element={
                         <ProtectedRoute>
                           <TutorDashboard />
                         </ProtectedRoute>
                       }
                     />
                     <Route path="/test" element={<TestPage />} />
                   </Routes>
                 </main>
               </div>
             </Router>
           </SimpleAuthProvider>
         </NotificationProvider>
       </ErrorBoundary>
     )
   }

export default App
