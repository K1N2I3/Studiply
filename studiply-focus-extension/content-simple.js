// Simple content script for testing
console.log('🎯 Simple content script loaded on:', window.location.hostname);

// Test chrome.runtime availability
console.log('🔍 Chrome runtime available:', !!chrome?.runtime);
console.log('🔍 Chrome runtime.sendMessage:', typeof chrome?.runtime?.sendMessage);

// Test message sending
if (chrome?.runtime?.sendMessage) {
  chrome.runtime.sendMessage({ action: 'test' }, (response) => {
    console.log('📤 Simple extension response:', response);
  });
} else {
  console.log('❌ Chrome runtime not available');
}
