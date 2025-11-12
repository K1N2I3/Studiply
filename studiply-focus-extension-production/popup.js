// Studiply Focus Mode Extension - Popup Script
// Production version for Chrome Web Store

document.addEventListener('DOMContentLoaded', async () => {
  const statusDiv = document.getElementById('status');
  const statusDot = statusDiv.querySelector('.status-dot');
  const statusText = statusDiv.querySelector('.status-text');
  const statusDetails = statusDiv.querySelector('.status-details');
  const openStudiplyBtn = document.getElementById('openStudiply');
  const viewSettingsBtn = document.getElementById('viewSettings');
  
  // Get extension status
  try {
    const response = await chrome.runtime.sendMessage({ action: 'getStatus' });
    
    if (response && response.active) {
      // Focus mode is active
      statusDiv.className = 'status active';
      statusDot.className = 'status-dot active';
      statusText.textContent = 'Focus Mode: Active';
      statusDetails.textContent = `Blocking ${response.blockedSites.length} websites`;
      
      // Update button text
      openStudiplyBtn.innerHTML = '🌐 Return to Studiply';
    } else {
      // Focus mode is inactive
      statusDiv.className = 'status inactive';
      statusDot.className = 'status-dot';
      statusText.textContent = 'Focus Mode: Inactive';
      statusDetails.textContent = 'Extension is ready to use';
      
      // Update button text
      openStudiplyBtn.innerHTML = '🌐 Open Studiply';
    }
  } catch (error) {
    console.error('Error getting extension status:', error);
    statusText.textContent = 'Error loading status';
    statusDetails.textContent = 'Please try again';
  }
  
  // Open Studiply website
  openStudiplyBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://studiply.it' });
  });
  
  // View settings (open Studiply focus mode page)
  viewSettingsBtn.addEventListener('click', () => {
    chrome.tabs.create({ url: 'https://studiply.it/focus-mode' });
  });
  
  // Add click animation
  [openStudiplyBtn, viewSettingsBtn].forEach(btn => {
    btn.addEventListener('click', function() {
      this.style.transform = 'scale(0.95)';
      setTimeout(() => {
        this.style.transform = '';
      }, 150);
    });
  });
});
