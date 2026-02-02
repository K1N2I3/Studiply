# Google 登录故障排除指南

## 🔍 常见错误及解决方案

### 错误 1: "Google login is not enabled"
**原因**：Firebase 控制台中未启用 Google 登录提供者

**解决方案**：
1. 访问 [Firebase 控制台](https://console.firebase.google.com)
2. 选择项目：**study-hub-1297a**
3. 进入 **Authentication** → **Sign-in method**
4. 找到 **Google** 行，点击进入设置
5. 启用 **Enable** 开关
6. 设置 **Project support email**
7. 点击 **Save**

### 错误 2: "This domain is not authorized"
**原因**：当前域名未添加到 Firebase 授权域名列表

**解决方案**：
1. 在 Firebase 控制台中，进入 **Authentication** → **Settings**
2. 滚动到 **Authorized domains** 部分
3. 点击 **Add domain**
4. 添加你的域名（例如：`your-app.vercel.app` 或 `localhost` 用于本地测试）
5. 点击 **Add**

**注意**：`localhost` 默认已授权，但生产域名需要手动添加。

### 错误 3: "Google OAuth configuration not found"
**原因**：OAuth 同意屏幕未配置

**解决方案**：
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 选择项目：**study-hub-1297a**（或对应的 Google Cloud 项目）
3. 导航到 **APIs & Services** → **OAuth consent screen**
4. 选择用户类型（通常是 "External"）
5. 填写应用信息：
   - **App name**: Studiply
   - **User support email**: 你的邮箱
   - **Developer contact information**: 你的邮箱
6. 点击 **Save and Continue**
7. 在 **Scopes** 页面，点击 **Save and Continue**（使用默认范围）
8. 在 **Test users** 页面（如果需要），添加测试用户
9. 完成设置

### 错误 4: "Popup blocked"
**原因**：浏览器阻止了弹出窗口

**解决方案**：
1. 检查浏览器地址栏是否有弹出窗口阻止图标
2. 点击图标并允许弹出窗口
3. 或者在浏览器设置中允许该网站的弹出窗口

### 错误 5: "Login cancelled"
**原因**：用户关闭了 Google 登录弹出窗口

**解决方案**：这是正常行为，用户可以选择取消登录。

## 🔧 检查清单

在测试 Google 登录之前，请确保：

- [ ] Firebase 控制台中已启用 Google 登录提供者
- [ ] 已设置 Project support email
- [ ] 当前域名已添加到授权域名列表
- [ ] OAuth 同意屏幕已配置（如果是第一次使用）
- [ ] 浏览器允许弹出窗口
- [ ] 检查浏览器控制台是否有详细错误信息

## 🧪 测试步骤

1. **打开浏览器开发者工具**（F12 或 Cmd+Option+I）
2. **切换到 Console 标签**
3. **点击 Google 登录按钮**
4. **查看控制台输出**：
   - 如果看到 "Google login error"，查看错误代码和详细信息
   - 错误代码会帮助确定具体问题

## 📝 调试信息

改进后的代码会在浏览器控制台输出详细的错误信息：
- `Error code`: Firebase 错误代码
- `Error message`: 详细错误消息

这些信息可以帮助快速定位问题。

## 🆘 如果问题仍然存在

1. **检查浏览器控制台**：查看完整的错误堆栈
2. **检查 Firebase 控制台**：查看 Authentication → Users 是否有相关记录
3. **检查网络请求**：在开发者工具的 Network 标签中查看失败的请求
4. **尝试不同的浏览器**：排除浏览器特定问题

## 📞 需要帮助？

如果按照以上步骤仍无法解决问题，请提供：
- 浏览器控制台的完整错误信息
- 错误代码（如果有）
- 你已完成的检查清单项目
