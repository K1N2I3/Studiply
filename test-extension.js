// 测试扩展程序是否正确注入
console.log('🧪 Testing extension injection...');

// 检查是否有chrome对象
if (typeof chrome !== 'undefined' && chrome.runtime) {
  console.log('✅ Chrome runtime available');
  
  // 测试发送消息到background script
  chrome.runtime.sendMessage({action: 'getStatus'}, (response) => {
    console.log('📤 Background response:', response);
  });
} else {
  console.log('❌ Chrome runtime not available');
  console.log('🔍 Available objects:', Object.keys(window));
}

// 检查是否有扩展程序相关的全局变量
console.log('🔍 Chrome object:', typeof chrome);
console.log('🔍 Chrome runtime:', typeof chrome?.runtime);
