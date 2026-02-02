# 添加 Firebase 授权域名指南

## 🎯 问题
错误信息：**"This domain is not authorized"**

这意味着你当前使用的域名没有在 Firebase 的授权域名列表中。

## ✅ 解决方案

### 步骤 1: 打开 Firebase 控制台

1. 访问 [Firebase 控制台](https://console.firebase.google.com)
2. 选择项目：**study-hub-1297a**
3. 点击左侧菜单 **"Authentication"**
4. 点击 **"Settings"** 标签（不是 "Sign-in method"）

### 步骤 2: 找到授权域名部分

1. 在 Settings 页面中，向下滚动
2. 找到 **"Authorized domains"** 部分
3. 你会看到默认的授权域名列表：
   - `localhost`（本地开发）
   - `your-project.firebaseapp.com`（Firebase Hosting）
   - `your-project.web.app`（Firebase Hosting）

### 步骤 3: 添加你的域名

1. 点击 **"Add domain"** 按钮
2. 输入你的域名（例如：`your-app.vercel.app`）
3. 点击 **"Add"**

## 📋 需要添加的域名

根据你的部署情况，可能需要添加以下域名：

### 如果是 Vercel 部署：
- 你的 Vercel 应用域名（例如：`studiply.vercel.app`）
- 如果有自定义域名，也要添加（例如：`studiply.com`）

### 如果是其他平台：
- Render: `your-app.onrender.com`
- Netlify: `your-app.netlify.app`
- 自定义域名：你的完整域名

### 本地开发：
- `localhost` 通常已经默认授权，但如果遇到问题，可以手动添加

## 🔍 如何找到你的域名

### Vercel:
1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 选择你的项目
3. 在项目设置中查看 **"Domains"** 部分
4. 你会看到类似 `your-app.vercel.app` 的域名

### 或者查看浏览器地址栏：
- 当前访问的完整 URL 就是你的域名
- 例如：如果 URL 是 `https://studiply.vercel.app/login`，那么域名就是 `studiply.vercel.app`

## ⚠️ 重要提示

1. **不要添加协议**：只添加域名，不要包含 `https://` 或 `http://`
   - ✅ 正确：`studiply.vercel.app`
   - ❌ 错误：`https://studiply.vercel.app`

2. **不要添加路径**：只添加域名，不要包含路径
   - ✅ 正确：`studiply.vercel.app`
   - ❌ 错误：`studiply.vercel.app/login`

3. **添加所有相关域名**：
   - 如果你有多个部署环境（开发、生产），都需要添加
   - 如果有自定义域名，也要添加

## 🧪 验证步骤

添加域名后：

1. **等待几分钟**：Firebase 可能需要几分钟来更新配置
2. **清除浏览器缓存**：按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac) 硬刷新
3. **重新尝试 Google 登录**
4. **检查浏览器控制台**：确保没有其他错误

## 📝 示例

假设你的应用部署在 Vercel，域名为 `studiply-xyz123.vercel.app`：

1. 在 Firebase Console → Authentication → Settings
2. 找到 "Authorized domains" 部分
3. 点击 "Add domain"
4. 输入：`studiply-xyz123.vercel.app`
5. 点击 "Add"
6. 等待配置生效（通常几秒钟到几分钟）
7. 重新尝试 Google 登录

## 🆘 如果仍然有问题

1. **确认域名拼写正确**：检查是否有拼写错误
2. **检查是否包含子域名**：如果使用 `www.studiply.com`，需要单独添加
3. **等待更长时间**：有时需要等待 5-10 分钟
4. **检查浏览器控制台**：查看是否有其他错误信息
