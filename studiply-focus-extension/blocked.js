// Blocked page script for Studiply Focus Mode Extension

let sessionStartTime = null;
let isInitialized = false;

// Get session data from extension and increment blocked count
chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response && response.active) {
        updateProgress(response.sessionData);
        
        // Check if "Block All Websites" mode is enabled
        if (response.blockedSites && response.blockedSites.includes('*')) {
            updateBlockAllMode();
        }
    }
});

// Increment blocked sites count when this page loads
chrome.runtime.sendMessage({ action: 'incrementBlockedCount' }, (response) => {
    console.log('Blocked count incremented:', response);
});

function updateBlockAllMode() {
    // Update the main title and message for "Block All Websites" mode
    const mainTitle = document.querySelector('.main-title');
    const subtitle = document.querySelector('.subtitle');
    const motivationMessage = document.querySelector('.motivation-message');
    
    if (mainTitle) {
        mainTitle.textContent = 'All Websites Blocked!';
    }
    
    if (subtitle) {
        subtitle.textContent = 'You\'re in maximum focus mode - only Studiply is allowed!';
    }
    
    if (motivationMessage) {
        motivationMessage.textContent = 'Maximum focus achieved! 🎯 Only Studiply can help you now!';
    }
    
    // Update the icon to show a globe
    const icon = document.querySelector('.icon');
    if (icon) {
        icon.textContent = '🌐';
    }
}

function updateProgress(sessionData) {
    if (!sessionData) return;
    
    const startTime = new Date(sessionData.startTime).getTime();
    const now = Date.now();
    const elapsed = now - startTime;
    const totalDuration = sessionData.duration * 60 * 1000; // Convert to milliseconds
    const remaining = Math.max(0, totalDuration - elapsed);
    
    // Update progress bar
    const progress = Math.min(100, (elapsed / totalDuration) * 100);
    document.getElementById('progressFill').style.width = progress + '%';
    
    // Update time remaining
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    document.getElementById('timeRemaining').textContent = 
        `${minutes}:${seconds.toString().padStart(2, '0')} remaining`;
    
    // Update stats
    const focusedMinutes = Math.floor(elapsed / 60000);
    document.getElementById('timeFocused').textContent = focusedMinutes + 'm';
    
    // Get blocked sites count from extension (not incrementing on page load)
    const blockedCount = sessionData.blockedSitesCount || 0;
    document.getElementById('sitesBlocked').textContent = blockedCount;
    
    // Calculate productivity score - more realistic calculation
    const sessionProgress = Math.min(1, elapsed / totalDuration);
    const focusBonus = Math.min(0.3, focusedMinutes * 0.05); // Bonus for time focused
    const distractionPenalty = Math.min(0.4, blockedCount * 0.08); // Penalty for distractions
    const productivityScore = Math.max(10, Math.min(100, Math.round((sessionProgress + focusBonus - distractionPenalty) * 100)));
    document.getElementById('productivity').textContent = productivityScore + '%';
    
    // Update session info
    document.getElementById('sessionType').textContent = sessionData.sessionType || 'Pomodoro';
    
    const startDate = new Date(sessionData.startTime);
    document.getElementById('sessionStart').textContent = 
        startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Get current site from URL - fix the garbled text issue
    let currentSite = 'Unknown';
    try {
        // Try to get the actual blocked site from the URL or referrer
        const url = new URL(window.location.href);
        const referrer = document.referrer;
        
        if (referrer && referrer !== '') {
            const referrerUrl = new URL(referrer);
            currentSite = referrerUrl.hostname;
        } else if (url.searchParams.get('site')) {
            currentSite = url.searchParams.get('site');
        } else {
            // Fallback to a more readable format
            currentSite = 'Blocked Site';
        }
    } catch (e) {
        currentSite = 'Blocked Site';
    }
    document.getElementById('currentSite').textContent = currentSite;
    
    // Update additional stats (left panel)
    updateAdditionalStats(sessionData, focusedMinutes, blockedCount);
    
    // Update motivation message based on productivity
    updateMotivationMessage(productivityScore, focusedMinutes, blockedCount);
}

function updateAdditionalStats(sessionData, focusedMinutes, blockedCount) {
    // Get real data from localStorage or use session-based calculations
    const storedData = JSON.parse(localStorage.getItem('studiply_user_stats') || '{}');
    
    // Focus Streak - calculate based on consecutive days with sessions
    let focusStreak = storedData.focusStreak || 0;
    const today = new Date().toDateString();
    const lastSessionDate = storedData.lastSessionDate;
    
    if (lastSessionDate === today) {
        // Same day, keep current streak
        focusStreak = focusStreak;
    } else if (lastSessionDate && new Date(lastSessionDate).toDateString() === new Date(Date.now() - 24*60*60*1000).toDateString()) {
        // Yesterday, increment streak
        focusStreak = focusStreak + 1;
    } else {
        // Gap in days, reset streak
        focusStreak = 1;
    }
    
    // Update localStorage
    storedData.focusStreak = focusStreak;
    storedData.lastSessionDate = today;
    localStorage.setItem('studiply_user_stats', JSON.stringify(storedData));
    
    document.getElementById('focusStreak').textContent = focusStreak;
    
    // Total Sessions - increment each time
    let totalSessions = storedData.totalSessions || 0;
    if (!storedData.sessionStartedToday) {
        totalSessions = totalSessions + 1;
        storedData.totalSessions = totalSessions;
        storedData.sessionStartedToday = true;
        localStorage.setItem('studiply_user_stats', JSON.stringify(storedData));
    }
    
    document.getElementById('totalSessions').textContent = totalSessions;
    
    // Best Session - track the longest session
    let bestSession = storedData.bestSession || 25;
    if (sessionData.duration > bestSession) {
        bestSession = sessionData.duration;
        storedData.bestSession = bestSession;
        localStorage.setItem('studiply_user_stats', JSON.stringify(storedData));
    }
    
    document.getElementById('bestSession').textContent = bestSession + 'm';
}

function updateMotivationMessage(productivity, focusedMinutes, blockedCount) {
    const motivationTexts = [
        "You're doing great! Stay focused! 🎯",
        "Every minute counts! Keep going! ⏰",
        "Your future self will thank you! 💪",
        "Focus is a superpower! 🦸‍♂️",
        "You're building great habits! 🌟",
        "Stay strong! You've got this! 💪",
        "Progress over perfection! 📈",
        "Your dedication is inspiring! 🌟"
    ];
    
    let message = motivationTexts[Math.floor(Math.random() * motivationTexts.length)];
    
    if (productivity >= 90) {
        message = "Excellent focus! You're unstoppable! 🚀";
    } else if (productivity >= 70) {
        message = "Great job staying focused! Keep it up! 💪";
    } else if (productivity >= 50) {
        message = "Good progress! Every effort counts! ⭐";
    } else if (blockedCount > 10) {
        message = "Take a deep breath and refocus! 🧘‍♀️";
    }
    
    document.getElementById('motivationText').textContent = message;
}

// Update every second
setInterval(() => {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
        if (response && response.active) {
            updateProgress(response.sessionData);
        }
    });
}, 1000);
