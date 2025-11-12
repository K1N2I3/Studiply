// 临时调试脚本
console.log('🔍 Starting extension debug...');

// 监听所有消息
window.addEventListener('message', (event) => {
  console.log('📨 Focus Mode received message:', event.data, 'from:', event.origin);
});

// 手动触发扩展程序状态检查
setTimeout(() => {
  console.log('🚀 Sending extension status request...');
  window.postMessage({
    type: 'STUDIPLY_GET_EXTENSION_STATUS'
  }, window.location.origin);
}, 1000);

// 检查扩展程序是否可用
console.log('🔍 Chrome runtime available:', !!window.chrome?.runtime);
console.log('🔍 Current origin:', window.location.origin);
