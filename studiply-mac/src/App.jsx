import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";
import { getUserStreak, getUserProgress } from "./services/streakService";
import "./App.css";

// Session types
const SESSION_TYPES = [
  { id: "pomodoro", name: "Pomodoro", duration: 25, icon: "🍅" },
  { id: "short", name: "Short Break", duration: 5, icon: "☕" },
  { id: "long", name: "Long Break", duration: 15, icon: "🌿" },
  { id: "deep", name: "Deep Work", duration: 90, icon: "🧠" },
];

function App() {
  const [focusState, setFocusState] = useState({
    is_active: false,
    duration_minutes: 25,
    remaining_seconds: 0,
    session_type: "pomodoro",
  });
  const [selectedSession, setSelectedSession] = useState(SESSION_TYPES[0]);
  const [streak, setStreak] = useState(0);
  const [todaySessions, setTodaySessions] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userId, setUserId] = useState(null);
  const [notificationPermission, setNotificationPermission] = useState(false);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress percentage
  const getProgress = () => {
    if (!focusState.is_active || focusState.duration_minutes === 0) return 0;
    const totalSeconds = focusState.duration_minutes * 60;
    const elapsed = totalSeconds - focusState.remaining_seconds;
    return (elapsed / totalSeconds) * 100;
  };

  // Request notification permission
  const setupNotifications = async () => {
    try {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      setNotificationPermission(permissionGranted);
    } catch (error) {
      console.error("Failed to setup notifications:", error);
    }
  };

  // Send notification
  const notify = async (title, body) => {
    if (notificationPermission) {
      try {
        await sendNotification({ title, body });
      } catch (error) {
        console.error("Failed to send notification:", error);
      }
    }
  };

  // Start focus session
  const startSession = async () => {
    try {
      const state = await invoke("start_focus_session", {
        durationMinutes: selectedSession.duration,
        sessionType: selectedSession.id,
      });
      setFocusState(state);
      await notify("Focus Session Started", `${selectedSession.name} - ${selectedSession.duration} minutes`);
    } catch (error) {
      console.error("Failed to start session:", error);
    }
  };

  // Stop focus session
  const stopSession = async () => {
    try {
      const state = await invoke("stop_focus_session");
      setFocusState(state);
    } catch (error) {
      console.error("Failed to stop session:", error);
    }
  };

  // Hide window
  const hideWindow = async () => {
    try {
      await invoke("hide_window");
    } catch (error) {
      console.error("Failed to hide window:", error);
    }
  };

  // Timer tick effect
  useEffect(() => {
    let interval;
    if (focusState.is_active) {
      interval = setInterval(async () => {
        try {
          const state = await invoke("tick_focus_timer");
          setFocusState(state);
          
          // Session completed
          if (!state.is_active && state.remaining_seconds === 0) {
            await notify("Focus Session Complete! 🎉", "Great job! Take a well-deserved break.");
            setTodaySessions(prev => prev + 1);
            // Save to localStorage
            const today = new Date().toDateString();
            const sessions = JSON.parse(localStorage.getItem("studiply_today_sessions") || "{}");
            sessions[today] = (sessions[today] || 0) + 1;
            localStorage.setItem("studiply_today_sessions", JSON.stringify(sessions));
          }
        } catch (error) {
          console.error("Timer tick error:", error);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusState.is_active, notificationPermission]);

  // Load initial state and setup
  useEffect(() => {
    const initialize = async () => {
      // Setup notifications
      await setupNotifications();
      
      // Load focus state
      try {
        const state = await invoke("get_focus_state");
        setFocusState(state);
      } catch (error) {
        console.error("Failed to load state:", error);
      }
      
      // Load today's sessions from localStorage
      const today = new Date().toDateString();
      const sessions = JSON.parse(localStorage.getItem("studiply_today_sessions") || "{}");
      setTodaySessions(sessions[today] || 0);
      
      // Check login status from localStorage
      const userData = localStorage.getItem("studiply_user");
      if (userData) {
        try {
          const user = JSON.parse(userData);
          setIsLoggedIn(true);
          setUserName(user.name || "User");
          setUserId(user.id);
          
          // Fetch streak from Firebase
          if (user.id) {
            const streakData = await getUserStreak(user.id);
            setStreak(streakData.currentStreak);
          }
        } catch (e) {
          console.error("Failed to parse user data:", e);
        }
      }
    };
    
    initialize();
  }, []);

  // Open Studiply website
  const openStudiply = () => {
    window.open("https://studiply.it", "_blank");
  };

  // Login via Studiply website
  const handleLogin = () => {
    // Open Studiply in browser for login
    window.open("https://studiply.it/login?desktop=true", "_blank");
  };

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">Studiply</span>
        </div>
        <button className="close-btn" onClick={hideWindow}>×</button>
      </div>

      {/* Main Content */}
      <div className="content">
        {/* Timer Display */}
        <div className="timer-section">
          <div className="timer-ring">
            <svg viewBox="0 0 100 100">
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <circle
                className="timer-bg"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="6"
              />
              <circle
                className="timer-progress"
                cx="50"
                cy="50"
                r="45"
                fill="none"
                strokeWidth="6"
                stroke="url(#gradient)"
                strokeDasharray={`${2 * Math.PI * 45}`}
                strokeDashoffset={`${2 * Math.PI * 45 * (1 - getProgress() / 100)}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="timer-text">
              <div className="timer-time">
                {focusState.is_active
                  ? formatTime(focusState.remaining_seconds)
                  : formatTime(selectedSession.duration * 60)}
              </div>
              <div className="timer-label">
                {focusState.is_active ? "Remaining" : "Ready"}
              </div>
            </div>
          </div>
        </div>

        {/* Session Type Selector */}
        {!focusState.is_active && (
          <div className="session-selector">
            {SESSION_TYPES.map((session) => (
              <button
                key={session.id}
                className={`session-btn ${selectedSession.id === session.id ? "active" : ""}`}
                onClick={() => setSelectedSession(session)}
              >
                <span className="session-icon">{session.icon}</span>
                <span className="session-name">{session.name}</span>
                <span className="session-duration">{session.duration}m</span>
              </button>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="actions">
          {focusState.is_active ? (
            <button className="action-btn stop" onClick={stopSession}>
              <span>⏹</span> Stop Session
            </button>
          ) : (
            <button className="action-btn start" onClick={startSession}>
              <span>▶</span> Start Focus
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="stats">
          <div className="stat">
            <span className="stat-icon">🔥</span>
            <span className="stat-value">{streak}</span>
            <span className="stat-label">Day Streak</span>
          </div>
          <div className="stat">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{todaySessions}</span>
            <span className="stat-label">Today</span>
          </div>
        </div>

        {/* Footer */}
        <div className="footer">
          {isLoggedIn ? (
            <div className="user-info">
              <span className="user-avatar">👤</span>
              <span className="user-name">{userName}</span>
              <button className="web-btn" onClick={openStudiply}>
                Open Web →
              </button>
            </div>
          ) : (
            <button className="login-btn" onClick={handleLogin}>
              Login to Studiply
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
