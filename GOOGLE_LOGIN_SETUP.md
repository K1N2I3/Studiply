# Google 登录设置指南

## 📋 概述

已实现 Google 登录功能。用户可以通过 Google 账户登录，如果是新用户，会自动跳转到注册页面完成注册流程。

## 🔧 Firebase 控制台设置

### 步骤 1: 启用 Google 登录提供者

1. 访问 [Firebase 控制台](https://console.firebase.google.com)
2. 选择项目：**study-hub-1297a**
3. 点击左侧菜单 **"Authentication"**
4. 点击 **"Sign-in method"** 标签
5. 找到 **"Google"** 行
6. 点击 **"Google"** 进入设置
7. 启用 **"Enable"** 开关
8. 设置 **"Project support email"**（选择你的项目邮箱）
9. 点击 **"Save"**

### 步骤 2: 配置 OAuth 同意屏幕（如果需要）

如果这是第一次启用 Google 登录，可能需要配置 OAuth 同意屏幕：

1. 在 Google Cloud Console 中打开你的项目
2. 导航到 **"APIs & Services" → "OAuth consent screen"**
3. 选择用户类型（通常是 "External"）
4. 填写应用信息：
   - **App name**: Studiply
   - **User support email**: 你的邮箱
   - **Developer contact information**: 你的邮箱
5. 点击 **"Save and Continue"**
6. 在 **"Scopes"** 页面，点击 **"Save and Continue"**（使用默认范围）
7. 在 **"Test users"** 页面（如果需要），添加测试用户
8. 完成设置

## 🎯 功能说明

### 登录流程

1. 用户在登录页面点击 **"Google"** 按钮
2. 弹出 Google 登录窗口
3. 用户选择 Google 账户并授权
4. 系统检查用户是否已存在：
   - **已存在**：直接登录，跳转到主页面
   - **新用户**：跳转到注册页面，自动填充 Google 账户信息

### 注册流程（Google 用户）

1. 从 Google 登录跳转到注册页面
2. **用户名（Full Name）** 和 **邮箱（Email Address）** 字段被锁定（显示 "from Google" 标签）
3. 用户需要设置密码（Password 和 Confirm Password）
4. 继续完成其他注册步骤（学校信息、联系方式等）
5. 最后完成邮箱验证
6. 注册成功后自动登录并跳转到主页面

## 📝 代码实现

### 主要文件

- `src/firebase/simpleAuth.js` - Google 登录函数
- `src/contexts/SimpleAuthContext.jsx` - Google 登录上下文
- `src/pages/Login.jsx` - 登录页面（Google 按钮）
- `src/pages/Register.jsx` - 注册页面（支持 Google 用户）

### 关键功能

1. **Google 登录检测**：检查用户是否已存在
2. **自动填充**：Google 用户信息自动填充到注册表单
3. **字段锁定**：Google 用户的用户名和邮箱字段被锁定
4. **头像保存**：Google 用户的头像会自动保存到用户资料

## ⚠️ 注意事项

1. **Firebase 配置**：确保在 Firebase 控制台中启用了 Google 登录提供者
2. **OAuth 同意屏幕**：首次使用可能需要配置 OAuth 同意屏幕
3. **测试环境**：在开发环境中，Google 登录可能需要添加测试用户
4. **生产环境**：在生产环境中，确保 OAuth 同意屏幕已发布

## 🧪 测试步骤

1. 在 Firebase 控制台中启用 Google 登录
2. 访问登录页面
3. 点击 "Google" 按钮
4. 选择 Google 账户并授权
5. 如果是新用户，应该跳转到注册页面，用户名和邮箱已锁定
6. 设置密码并完成注册流程
7. 验证注册成功后自动登录

## 🐛 常见问题

### 问题 1: "Popup blocked" 错误
**解决方案**：允许浏览器弹出窗口

### 问题 2: "OAuth consent screen" 错误
**解决方案**：在 Google Cloud Console 中配置 OAuth 同意屏幕

### 问题 3: Google 登录按钮不工作
**解决方案**：
- 检查 Firebase 控制台中是否已启用 Google 登录
- 检查浏览器控制台是否有错误信息
- 确保 Firebase 配置正确
