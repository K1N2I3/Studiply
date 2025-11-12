# Studiply Focus Mode Extension - 故障排除指南

## 问题：扩展程序已安装但无法阻止网站

### 解决方案1：检查扩展程序权限

1. 打开 `chrome://extensions/`
2. 找到 "Studiply Focus Mode" 扩展程序
3. 点击"详细信息"
4. 确保以下权限已启用：
   - ✅ 读取和更改所有网站的数据
   - ✅ 阻止内容
   - ✅ 存储

### 解决方案2：重新安装扩展程序

1. 在 `chrome://extensions/` 页面删除现有扩展程序
2. 开启"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `studiply-focus-extension` 文件夹

### 解决方案3：检查Chrome版本

- 确保Chrome版本 >= 88
- 旧版本可能不支持 `declarativeNetRequest` API

### 解决方案4：手动测试扩展程序

1. 在Studiply网站打开Console
2. 运行以下代码测试：
```javascript
// 测试扩展程序是否工作
window.postMessage({
  type: 'STUDIPLY_FOCUS_START',
  data: {
    sessionType: 'pomodoro',
    duration: 25,
    startTime: Date.now(),
    blockedSites: ['facebook.com', 'x.com']
  }
}, window.location.origin);
```

3. 检查Console输出，应该看到：
   - `🚀 Starting focus mode with data: {...}`
   - `🔧 Creating blocking rules for sites: [...]`
   - `✅ Created X blocking rules successfully`

### 解决方案5：检查阻止规则

1. 在扩展程序Console中运行：
```javascript
chrome.declarativeNetRequest.getDynamicRules().then(rules => {
  console.log('Current blocking rules:', rules);
});
```

2. 应该看到多个阻止规则

### 解决方案6：清除浏览器缓存

1. 按 `Ctrl+Shift+Delete` (Windows) 或 `Cmd+Shift+Delete` (Mac)
2. 选择"所有时间"
3. 勾选"缓存的图片和文件"
4. 点击"清除数据"

### 解决方案7：检查网站URL

确保测试的网站URL格式正确：
- ✅ `facebook.com`
- ✅ `www.facebook.com`
- ✅ `x.com`
- ✅ `www.x.com`

### 如果仍然无法工作

请提供以下信息：
1. Chrome版本号 (`chrome://version/`)
2. 操作系统版本
3. 扩展程序Console中的错误信息
4. 测试网站的具体URL

