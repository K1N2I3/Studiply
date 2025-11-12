// 详细测试Chrome runtime
console.log('🧪 Detailed Chrome runtime test...');
console.log('🔍 typeof chrome:', typeof chrome);
console.log('🔍 chrome object:', chrome);
console.log('🔍 chrome.runtime:', chrome?.runtime);
console.log('🔍 chrome.runtime.sendMessage:', typeof chrome?.runtime?.sendMessage);

// 尝试发送消息
if (chrome?.runtime?.sendMessage) {
  console.log('✅ Chrome runtime.sendMessage is available');
  chrome.runtime.sendMessage({action: 'getStatus'}, (response) => {
    console.log('📤 Direct background response:', response);
  });
} else {
  console.log('❌ Chrome runtime.sendMessage is not available');
}
