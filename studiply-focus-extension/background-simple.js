// Simple background script for testing
console.log('🚀 Simple background script loaded');

chrome.runtime.onInstalled.addListener(() => {
  console.log('✅ Simple extension installed');
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Simple background received message:', request);
  
  if (request.action === 'test') {
    sendResponse({ success: true, message: 'Simple extension working!' });
  }
});
