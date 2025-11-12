// Content script for Studiply Focus Mode Extension

console.log('🔍 Content script loaded on:', window.location.hostname);
console.log('🔍 Current URL:', window.location.href);
console.log('🔍 Chrome runtime available:', !!chrome?.runtime);
console.log('🔍 Window location object:', {
  hostname: window.location.hostname,
  host: window.location.host,
  origin: window.location.origin,
  href: window.location.href
});
console.log('🚀 EXTENSION VERSION: www.studiply.it FIX VERSION 1.0');

// Check if we're on Studiply website (including vercel.app for development)
const isStudiplySite = window.location.hostname === 'studiply.it' ||
                      window.location.hostname === 'www.studiply.it' ||
                      window.location.hostname.includes('studiply.vercel.app') ||
                      window.location.hostname.includes('localhost') ||
                      window.location.hostname.includes('127.0.0.1');

console.log('🔍 Hostname check:');
console.log('  - studiply.it match:', window.location.hostname === 'studiply.it');
console.log('  - www.studiply.it match:', window.location.hostname === 'www.studiply.it');
console.log('  - vercel.app match:', window.location.hostname.includes('studiply.vercel.app'));
console.log('  - localhost match:', window.location.hostname.includes('localhost'));
console.log('  - 127.0.0.1 match:', window.location.hostname.includes('127.0.0.1'));
console.log('🔍 Is Studiply site:', isStudiplySite);

if (isStudiplySite) {
  console.log('🎯 Studiply Focus Mode extension activated!');
  
  // Listen for messages from the website
  window.addEventListener('message', (event) => {
    console.log('📨 Received message:', event.data, 'from:', event.origin);
    
    // Only accept messages from the same origin
    if (event.origin !== window.location.origin) {
      console.log('❌ Rejected message from different origin');
      return;
    }
    
    const { type, data } = event.data;
    
    if (type === 'STUDIPLY_FOCUS_START') {
      console.log('🚀 Starting focus mode with data:', data);
      chrome.runtime.sendMessage({
        action: 'startFocus',
        data: data
      }, (response) => {
        console.log('📤 Background response:', response);
        if (response && response.success) {
          window.postMessage({
            type: 'STUDIPLY_EXTENSION_READY',
            success: true
          }, window.location.origin);
        }
      });
    } else if (type === 'STUDIPLY_FOCUS_STOP') {
      console.log('🛑 Stopping focus mode');
      chrome.runtime.sendMessage({
        action: 'stopFocus'
      }, (response) => {
        console.log('📤 Background response:', response);
        if (response && response.success) {
          window.postMessage({
            type: 'STUDIPLY_EXTENSION_STOPPED',
            success: true
          }, window.location.origin);
        }
      });
    } else if (type === 'STUDIPLY_GET_EXTENSION_STATUS') {
      console.log('📊 Getting extension status...');
      chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
        console.log('📊 Extension status response:', response);
        if (response) {
          window.postMessage({
            type: 'STUDIPLY_EXTENSION_STATUS',
            data: response
          }, window.location.origin);
        }
      });
    }
  });
  
  // Check extension status on page load
  chrome.runtime.sendMessage({ action: 'getStatus' }, (response) => {
    console.log('📊 Extension status:', response);
    if (response) {
      window.postMessage({
        type: 'STUDIPLY_EXTENSION_STATUS',
        data: response
      }, window.location.origin);
    }
  });
  
  // Send loaded message
  window.postMessage({
    type: 'STUDIPLY_EXTENSION_READY',
    success: true
  }, window.location.origin);
  
} else {
  console.log('❌ Not a Studiply site, extension inactive');
}
