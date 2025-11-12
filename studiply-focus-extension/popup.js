// Popup script for Studiply Focus Mode Extension

document.addEventListener('DOMContentLoaded', () => {
  const activeState = document.getElementById('activeState');
  const inactiveState = document.getElementById('inactiveState');
  const sessionTypeElement = document.getElementById('sessionType');
  const timeRemainingElement = document.getElementById('timeRemaining');
  const sitesBlockedElement = document.getElementById('sitesBlocked');
  const sitesListElement = document.getElementById('sitesList');
  const startButton = document.getElementById('startButton');
  const goToStudiplyButton = document.getElementById('goToStudiplyButton');

  // Check extension status
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    if (response) {
      updateUI(response);
    }
  });

  // Update UI based on status
  function updateUI(status) {
    if (status.active && status.sessionData) {
      showActiveState(status);
    } else {
      showInactiveState();
    }
  }

  function showActiveState(status) {
    activeState.style.display = 'block';
    inactiveState.style.display = 'none';
    
    const sessionData = status.sessionData;
    
    // Update session info
    sessionTypeElement.textContent = sessionData.sessionType || 'Pomodoro';
    
    // Update time remaining
    updateTimeRemaining(sessionData);
    
    // Update sites blocked count
    sitesBlockedElement.textContent = sessionData.blockedSitesCount || 0;
    
    // Update blocked sites list
    updateBlockedSitesList(status.blockedSites || []);
    
    // Set up go to Studiply button
    goToStudiplyButton.onclick = () => {
      chrome.tabs.create({ url: 'https://studiply.it' });
      window.close();
    };
  }

  function showInactiveState() {
    activeState.style.display = 'none';
    inactiveState.style.display = 'block';
    
    // Set up start button
    startButton.onclick = () => {
      chrome.tabs.create({ url: 'https://studiply.it' });
      window.close();
    };
  }

  function updateTimeRemaining(sessionData) {
    const startTime = new Date(sessionData.startTime).getTime();
    const now = Date.now();
    const elapsed = now - startTime;
    const totalDuration = sessionData.duration * 60 * 1000;
    const remaining = Math.max(0, totalDuration - elapsed);
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    
    timeRemainingElement.textContent = 
      `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  function updateBlockedSitesList(blockedSites) {
    const defaultSites = [
      'facebook.com',
      'instagram.com',
      'tiktok.com',
      'twitter.com',
      'x.com',
      'snapchat.com'
    ];
    
    const sitesToShow = blockedSites.length > 0 ? blockedSites : defaultSites;
    
    sitesListElement.innerHTML = sitesToShow
      .slice(0, 6) // Show max 6 sites
      .map(site => `<div class="site-item">${site}</div>`)
      .join('');
  }

  // Update time every second when active
  setInterval(() => {
    chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
      if (response && response.active && response.sessionData) {
        updateTimeRemaining(response.sessionData);
        sitesBlockedElement.textContent = response.sessionData.blockedSitesCount || 0;
      }
    });
  }, 1000);
});