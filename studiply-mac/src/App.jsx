import { useState, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import { isPermissionGranted, requestPermission, sendNotification } from "@tauri-apps/plugin-notification";
import { open } from "@tauri-apps/plugin-opener";
import "./App.css";

// Session types
const SESSION_TYPES = [
  { id: "pomodoro", name: "Pomodoro", duration: 25, icon: "🍅" },
  { id: "short", name: "Short Break", duration: 5, icon: "☕" },
  { id: "long", name: "Long Break", duration: 15, icon: "🌿" },
  { id: "deep", name: "Deep Work", duration: 90, icon: "🧠" },
];

// Login Page Component
function LoginPage({ onLogin }) {
  const [isConnecting, setIsConnecting] = useState(false);

  const handleLogin = async () => {
    setIsConnecting(true);
    try {
      // Open browser to Studiply login with desktop callback
      const callbackUrl = "studiply://auth";
      const loginUrl = `https://studiply.it/login?desktop=true&callback=${encodeURIComponent(callbackUrl)}`;
      await open(loginUrl);
    } catch (error) {
      console.error("Failed to open browser:", error);
      // Fallback: open in default browser
      window.open(`https://studiply.it/login?desktop=true`, "_blank");
    }
    
    // Start polling for auth status
    const checkAuth = setInterval(async () => {
      const userData = localStorage.getItem("studiply_user");
      if (userData) {
        clearInterval(checkAuth);
        setIsConnecting(false);
        onLogin(JSON.parse(userData));
      }
    }, 1000);

    // Stop polling after 5 minutes
    setTimeout(() => {
      clearInterval(checkAuth);
      setIsConnecting(false);
    }, 300000);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo */}
        <div className="login-logo">
          <div className="login-logo-icon">📚</div>
          <h1 className="login-logo-text">Studiply</h1>
          <p className="login-tagline">Focus Mode for macOS</p>
        </div>

        {/* Features */}
        <div className="login-features">
          <div className="feature-item">
            <span className="feature-icon">⏱️</span>
            <span>Pomodoro Timer</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🚫</span>
            <span>Block Distracting Websites</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">📱</span>
            <span>Block Distracting Apps</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">🔥</span>
            <span>Sync Your Streak</span>
          </div>
        </div>

        {/* Login Button */}
        <button 
          className="login-button"
          onClick={handleLogin}
          disabled={isConnecting}
        >
          {isConnecting ? (
            <>
              <span className="spinner"></span>
              Waiting for login...
            </>
          ) : (
            <>
              <span>🔗</span>
              Connect with Studiply
            </>
          )}
        </button>

        {isConnecting && (
          <p className="login-hint">
            Complete login in your browser, then return here
          </p>
        )}

        {/* Footer */}
        <div className="login-footer">
          <p>Don't have an account?</p>
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              window.open("https://studiply.it/register", "_blank");
            }}
          >
            Create one at studiply.it
          </a>
        </div>
      </div>
    </div>
  );
}

// Main App Component
function MainApp({ user, onLogout }) {
  const [focusState, setFocusState] = useState({
    is_active: false,
    duration_minutes: 25,
    remaining_seconds: 0,
    session_type: "pomodoro",
    websites_blocked: false,
  });
  const [selectedSession, setSelectedSession] = useState(SESSION_TYPES[0]);
  const [todaySessions, setTodaySessions] = useState(0);
  
  // Settings
  const [blockWebsites, setBlockWebsites] = useState(true);
  const [blockApps, setBlockApps] = useState(true);
  const [installedApps, setInstalledApps] = useState([]);
  const [allowedApps, setAllowedApps] = useState(["Finder", "Studiply"]);
  const [allowedWebsites, setAllowedWebsites] = useState(["studiply.it"]);
  const [newWebsite, setNewWebsite] = useState("");
  const [searchApp, setSearchApp] = useState("");
  
  // UI state
  const [activeTab, setActiveTab] = useState("timer");
  const [notificationPermission, setNotificationPermission] = useState(false);
  const [isStarting, setIsStarting] = useState(false);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate progress
  const getProgress = () => {
    if (!focusState.is_active || focusState.duration_minutes === 0) return 0;
    const totalSeconds = focusState.duration_minutes * 60;
    const elapsed = totalSeconds - focusState.remaining_seconds;
    return (elapsed / totalSeconds) * 100;
  };

  // Setup notifications
  const setupNotifications = async () => {
    try {
      let permissionGranted = await isPermissionGranted();
      if (!permissionGranted) {
        const permission = await requestPermission();
        permissionGranted = permission === "granted";
      }
      setNotificationPermission(permissionGranted);
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  // Send notification
  const notify = async (title, body) => {
    if (notificationPermission) {
      try {
        await sendNotification({ title, body });
      } catch (error) {
        console.error("Notification error:", error);
      }
    }
  };

  // Load installed apps
  const loadInstalledApps = async () => {
    try {
      const apps = await invoke("get_installed_apps");
      setInstalledApps(apps);
    } catch (error) {
      console.error("Failed to load apps:", error);
    }
  };

  // Toggle app
  const toggleApp = async (appName) => {
    const newAllowed = allowedApps.includes(appName)
      ? allowedApps.filter(a => a !== appName)
      : [...allowedApps, appName];
    
    setAllowedApps(newAllowed);
    await invoke("set_allowed_apps", { apps: newAllowed });
    localStorage.setItem("studiply_allowed_apps", JSON.stringify(newAllowed));
  };

  // Add website
  const addWebsite = async () => {
    if (!newWebsite.trim()) return;
    
    let website = newWebsite.trim().toLowerCase();
    website = website.replace(/^https?:\/\//, "").replace(/^www\./, "");
    website = website.split("/")[0];
    
    if (!allowedWebsites.includes(website)) {
      const newAllowed = [...allowedWebsites, website];
      setAllowedWebsites(newAllowed);
      await invoke("set_allowed_websites", { websites: newAllowed });
      localStorage.setItem("studiply_allowed_websites", JSON.stringify(newAllowed));
    }
    setNewWebsite("");
  };

  // Remove website
  const removeWebsite = async (website) => {
    if (website === "studiply.it") return;
    
    const newAllowed = allowedWebsites.filter(w => w !== website);
    setAllowedWebsites(newAllowed);
    await invoke("set_allowed_websites", { websites: newAllowed });
    localStorage.setItem("studiply_allowed_websites", JSON.stringify(newAllowed));
  };

  // Start session
  const startSession = async () => {
    setIsStarting(true);
    try {
      await invoke("set_allowed_apps", { apps: allowedApps });
      await invoke("set_allowed_websites", { websites: allowedWebsites });
      
      const state = await invoke("start_focus_session", {
        durationMinutes: selectedSession.duration,
        sessionType: selectedSession.id,
        shouldBlockWebsites: blockWebsites,
      });
      setFocusState(state);
      setActiveTab("timer");
      
      let message = `${selectedSession.name} - ${selectedSession.duration} minutes`;
      if (blockWebsites) {
        message += "\n🌐 Distracting websites blocked!";
      }
      await notify("🎯 Focus Mode Started", message);
    } catch (error) {
      console.error("Failed to start:", error);
      await notify("❌ Error", "Failed to start. Grant admin access if prompted.");
    }
    setIsStarting(false);
  };

  // Stop session
  const stopSession = async () => {
    try {
      const state = await invoke("stop_focus_session");
      setFocusState(state);
      await invoke("hide_overlay");
      await notify("Focus Session Ended", "Websites unblocked!");
    } catch (error) {
      console.error("Failed to stop:", error);
    }
  };

  // Hide window
  const hideWindow = async () => {
    try {
      await invoke("hide_window");
    } catch (error) {
      console.error("Hide error:", error);
    }
  };

  // Monitor blocked apps
  useEffect(() => {
    let monitorInterval;
    
    if (focusState.is_active && blockApps) {
      monitorInterval = setInterval(async () => {
        try {
          const blockedApp = await invoke("check_app_allowed");
          if (blockedApp) {
            await invoke("show_overlay");
          }
        } catch (error) {
          console.error("Monitor error:", error);
        }
      }, 1000);
    }
    
    return () => clearInterval(monitorInterval);
  }, [focusState.is_active, blockApps]);

  // Timer tick
  useEffect(() => {
    let interval;
    if (focusState.is_active) {
      interval = setInterval(async () => {
        try {
          const state = await invoke("tick_focus_timer");
          setFocusState(state);
          
          if (!state.is_active && state.remaining_seconds === 0) {
            await notify("🎉 Session Complete!", "Great job!");
            await invoke("hide_overlay");
            setTodaySessions(prev => prev + 1);
          }
        } catch (error) {
          console.error("Timer error:", error);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusState.is_active]);

  // Initialize
  useEffect(() => {
    const initialize = async () => {
      await setupNotifications();
      await loadInstalledApps();
      
      try {
        const state = await invoke("get_focus_state");
        setFocusState(state);
      } catch (error) {
        console.error("Init error:", error);
      }
      
      // Load saved settings
      const savedApps = localStorage.getItem("studiply_allowed_apps");
      if (savedApps) setAllowedApps(JSON.parse(savedApps));
      
      const savedWebsites = localStorage.getItem("studiply_allowed_websites");
      if (savedWebsites) setAllowedWebsites(JSON.parse(savedWebsites));
      
      const savedBlockWebsites = localStorage.getItem("studiply_block_websites");
      if (savedBlockWebsites !== null) setBlockWebsites(JSON.parse(savedBlockWebsites));
      
      const savedBlockApps = localStorage.getItem("studiply_block_apps");
      if (savedBlockApps !== null) setBlockApps(JSON.parse(savedBlockApps));
      
      const today = new Date().toDateString();
      const sessions = JSON.parse(localStorage.getItem("studiply_today_sessions") || "{}");
      setTodaySessions(sessions[today] || 0);
    };
    
    initialize();
  }, []);

  // Save settings
  useEffect(() => {
    localStorage.setItem("studiply_block_websites", JSON.stringify(blockWebsites));
  }, [blockWebsites]);

  useEffect(() => {
    localStorage.setItem("studiply_block_apps", JSON.stringify(blockApps));
  }, [blockApps]);

  // Filter apps
  const filteredApps = installedApps.filter(app =>
    app.name.toLowerCase().includes(searchApp.toLowerCase())
  );

  return (
    <div className="container">
      {/* Header */}
      <div className="header">
        <div className="logo">
          <span className="logo-icon">📚</span>
          <span className="logo-text">Studiply</span>
        </div>
        <div className="header-right">
          <div className="user-badge" onClick={onLogout} title="Click to logout">
            <span className="user-avatar">
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </span>
            <span className="user-name">{user.name || "User"}</span>
          </div>
          <button className="close-btn" onClick={hideWindow}>×</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'timer' ? 'active' : ''}`}
          onClick={() => setActiveTab('timer')}
        >
          ⏱️ Timer
        </button>
        <button 
          className={`tab ${activeTab === 'apps' ? 'active' : ''}`}
          onClick={() => setActiveTab('apps')}
          disabled={focusState.is_active}
        >
          📱 Apps
        </button>
        <button 
          className={`tab ${activeTab === 'websites' ? 'active' : ''}`}
          onClick={() => setActiveTab('websites')}
          disabled={focusState.is_active}
        >
          🌐 Sites
        </button>
      </div>

      {/* Content */}
      <div className="content">
        {activeTab === 'timer' && (
          <>
            {/* Timer */}
            <div className="timer-section">
              <div className="timer-ring">
                <svg viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <circle className="timer-bg" cx="50" cy="50" r="45" fill="none" strokeWidth="6" />
                  <circle
                    className="timer-progress"
                    cx="50" cy="50" r="45" fill="none" strokeWidth="6"
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
                    {focusState.is_active ? "🔒 Locked" : "Ready"}
                  </div>
                </div>
              </div>
            </div>

            {/* Session Selector */}
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

            {/* Block Options */}
            {!focusState.is_active && (
              <div className="block-options">
                <label className={`block-option ${blockWebsites ? 'active' : ''}`}>
                  <input type="checkbox" checked={blockWebsites} onChange={(e) => setBlockWebsites(e.target.checked)} />
                  <span>🌐 Block Sites</span>
                </label>
                <label className={`block-option ${blockApps ? 'active' : ''}`}>
                  <input type="checkbox" checked={blockApps} onChange={(e) => setBlockApps(e.target.checked)} />
                  <span>📱 Block Apps</span>
                </label>
              </div>
            )}

            {/* Actions */}
            <div className="actions">
              {focusState.is_active ? (
                <button className="action-btn stop" onClick={stopSession}>⏹ Stop</button>
              ) : (
                <button className="action-btn start" onClick={startSession} disabled={isStarting}>
                  {isStarting ? "Starting..." : "▶ Start Focus"}
                </button>
              )}
            </div>

            {/* Streak */}
            <div className="streak-display">
              <span className="streak-icon">🔥</span>
              <span className="streak-value">{user.streak || 0}</span>
              <span className="streak-label">Day Streak</span>
            </div>
          </>
        )}

        {activeTab === 'apps' && (
          <div className="whitelist-view">
            <div className="whitelist-header">
              <h3>✅ Allowed Apps</h3>
              <p>Only these apps can be used during focus</p>
            </div>
            <input type="text" className="search-input" placeholder="🔍 Search..." value={searchApp} onChange={(e) => setSearchApp(e.target.value)} />
            <div className="apps-list">
              {filteredApps.map((app) => (
                <div key={app.path} className={`app-item ${allowedApps.includes(app.name) ? 'allowed' : ''}`} onClick={() => toggleApp(app.name)}>
                  <span className="app-name">{app.name}</span>
                  <span className="app-status">{allowedApps.includes(app.name) ? '✅' : '➕'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'websites' && (
          <div className="whitelist-view">
            <div className="whitelist-header">
              <h3>✅ Allowed Websites</h3>
              <p>Only these sites can be accessed</p>
            </div>
            <div className="add-website">
              <input type="text" className="website-input" placeholder="e.g. google.com" value={newWebsite} onChange={(e) => setNewWebsite(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addWebsite()} />
              <button className="add-btn" onClick={addWebsite}>Add</button>
            </div>
            <div className="websites-list">
              {allowedWebsites.map((website) => (
                <div key={website} className="website-item">
                  <span className="website-name">{website === 'studiply.it' ? '🏠 ' : '✅ '}{website}</span>
                  {website !== 'studiply.it' && <button className="remove-btn" onClick={() => removeWebsite(website)}>✕</button>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Root App Component
function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing login
  useEffect(() => {
    const checkAuth = () => {
      const userData = localStorage.getItem("studiply_user");
      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          localStorage.removeItem("studiply_user");
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for auth messages from website (via localStorage)
    const handleStorage = (e) => {
      if (e.key === "studiply_user" && e.newValue) {
        try {
          setUser(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Auth error:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Handle login
  const handleLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("studiply_user", JSON.stringify(userData));
  };

  // Handle logout
  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      setUser(null);
      localStorage.removeItem("studiply_user");
    }
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <MainApp user={user} onLogout={handleLogout} />;
}

export default App;
