// 简单测试扩展程序是否工作
console.log('🧪 Simple extension test...');

// 检查是否有扩展程序注入的脚本
const scripts = document.querySelectorAll('script');
console.log('📜 Total scripts on page:', scripts.length);

// 检查是否有扩展程序相关的全局变量
console.log('🌐 window.chrome:', window.chrome);
console.log('🌐 window.chrome?.runtime:', window.chrome?.runtime);

// 尝试直接访问chrome对象
try {
  console.log('🔍 Direct chrome access:', chrome);
  console.log('🔍 Direct chrome.runtime:', chrome.runtime);
} catch (e) {
  console.log('❌ Error accessing chrome:', e.message);
}
