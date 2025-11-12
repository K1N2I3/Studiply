console.log('Test content script loaded');
console.log('Chrome runtime:', !!chrome?.runtime);
if (chrome?.runtime) {
  chrome.runtime.sendMessage({test: true}, (response) => {
    console.log('Test response:', response);
  });
}
