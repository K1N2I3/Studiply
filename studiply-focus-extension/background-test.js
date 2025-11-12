console.log('Test background loaded');
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Test background received:', request);
  sendResponse({ success: true });
});
