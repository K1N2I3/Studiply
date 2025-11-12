// Studiply Focus Mode Extension - Content Script
// Production version for Chrome Web Store

console.log('📄 Studiply Focus Mode content script loaded on:', window.location.hostname);

// Check if we're on a Studiply site
const isStudiplySite = window.location.hostname.includes('studiply') || 
                      window.location.hostname.includes('vercel.app') ||
                      window.location.hostname.includes('localhost');

if (isStudiplySite) {
  console.log('✅ Studiply site detected, setting up communication');
  
  // Listen for messages from the website
  window.addEventListener('message', (event) => {
    // Verify origin for security
    if (event.origin !== window.location.origin) return;
    
    const { type, data } = event.data;
    
    console.log('📨 Content script received message:', type);
    
    switch (type) {
      case 'STUDIPLY_FOCUS_START':
        console.log('🚀 Starting focus mode from website');
        chrome.runtime.sendMessage({
          action: 'startFocus',
          data: data
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('❌ Error starting focus mode:', chrome.runtime.lastError);
          } else {
            console.log('✅ Focus start response:', response);
          }
        });
        break;
        
      case 'STUDIPLY_FOCUS_STOP':
        console.log('🛑 Stopping focus mode from website');
        chrome.runtime.sendMessage({
          action: 'stopFocus'
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('❌ Error stopping focus mode:', chrome.runtime.lastError);
          } else {
            console.log('✅ Focus stop response:', response);
          }
        });
        break;
        
      case 'STUDIPLY_GET_EXTENSION_STATUS':
        console.log('📊 Getting extension status...');
        chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('❌ Error getting extension status:', chrome.runtime.lastError);
          } else {
            console.log('📊 Extension status response:', response);
            if (response) {
              window.postMessage({
                type: 'STUDIPLY_EXTENSION_STATUS',
                data: response
              }, window.location.origin);
            }
          }
        });
        break;
        
      case 'STUDIPLY_UPDATE_BLOCKED_SITES':
        console.log('🔧 Updating blocked sites from website');
        chrome.runtime.sendMessage({
          action: 'updateBlockedSites',
          sites: data.sites
        }, (response) => {
          if (chrome.runtime.lastError) {
            console.error('❌ Error updating blocked sites:', chrome.runtime.lastError);
          } else {
            console.log('✅ Blocked sites update response:', response);
          }
        });
        break;
    }
  });
  
  // Send extension ready message
  window.postMessage({
    type: 'STUDIPLY_EXTENSION_READY'
  }, window.location.origin);
  
  console.log('✅ Studiply Focus Mode extension ready');
} else {
  console.log('ℹ️ Not a Studiply site, content script inactive');
}
