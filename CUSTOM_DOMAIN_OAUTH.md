# 配置自定义域名显示在 Google OAuth 同意屏幕

## 🎯 问题
Google 登录弹窗显示 "continue to study-hub-1297a.firebaseapp.com" 而不是你的自定义域名 "studiply.it"

## 📋 原因
Firebase 默认使用项目的 Firebase Hosting 域名（`study-hub-1297a.firebaseapp.com`）作为 OAuth 同意屏幕中的应用标识。要显示自定义域名，需要在 Google Cloud Console 中配置 OAuth 同意屏幕。

## ✅ 解决方案

### 方法 1: 在 Google Cloud Console 配置 OAuth 同意屏幕（推荐）

#### 步骤 1: 打开 Google Cloud Console
1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 确保选择了正确的项目（通常是 `study-hub-1297a` 或对应的 Google Cloud 项目）

#### 步骤 2: 进入 OAuth 同意屏幕
1. 在左侧菜单中，点击 **"APIs & Services"**（API 和服务）
2. 点击 **"OAuth consent screen"**（OAuth 同意屏幕）

#### 步骤 3: 配置应用信息
1. **User Type**（用户类型）：
   - 如果只是自己使用，选择 **"Internal"**（内部）
   - 如果其他人也要使用，选择 **"External"**（外部）

2. **App information**（应用信息）：
   - **App name**（应用名称）：`Studiply`
   - **User support email**（用户支持邮箱）：选择你的邮箱
   - **App logo**（应用图标）：可选，上传你的应用图标
   - **Application home page**（应用主页）：`https://studiply.it`
   - **Application privacy policy link**（隐私政策链接）：可选
   - **Application terms of service link**（服务条款链接）：可选
   - **Authorized domains**（授权域名）：添加 `studiply.it`

3. 点击 **"Save and Continue"**（保存并继续）

#### 步骤 4: 配置 Scopes（范围）
1. 在 **"Scopes"** 页面，通常使用默认范围即可
2. 点击 **"Save and Continue"**（保存并继续）

#### 步骤 5: 配置 Test users（测试用户，仅 External 需要）
1. 如果选择了 "External"，需要添加测试用户
2. 添加你的 Google 账户邮箱
3. 点击 **"Save and Continue"**（保存并继续）

#### 步骤 6: 发布应用（仅 External 需要）
1. 如果选择了 "External"，需要发布应用
2. 点击 **"Back to Dashboard"**（返回仪表板）
3. 点击 **"PUBLISH APP"**（发布应用）按钮

### 方法 2: 在 Firebase 控制台配置应用名称

#### 步骤 1: 打开 Firebase 控制台
1. 访问 [Firebase 控制台](https://console.firebase.google.com)
2. 选择项目：**study-hub-1297a**

#### 步骤 2: 项目设置
1. 点击右上角的齿轮图标 ⚙️
2. 选择 **"Project settings"**（项目设置）

#### 步骤 3: 配置应用信息
1. 滚动到 **"Your apps"**（你的应用）部分
2. 找到你的 Web 应用，点击设置图标
3. 更新 **"Public-facing name"**（公开名称）为 `Studiply`
4. 保存更改

### 方法 3: 配置 Firebase Hosting 自定义域名（如果使用 Firebase Hosting）

如果你使用 Firebase Hosting 并想使用自定义域名：

1. 在 Firebase 控制台中，进入 **"Hosting"**
2. 点击 **"Add custom domain"**（添加自定义域名）
3. 输入 `studiply.it`
4. 按照指示配置 DNS 记录
5. 等待域名验证完成

## 🔍 验证步骤

配置完成后：

1. **等待几分钟**：OAuth 配置可能需要几分钟才能生效
2. **清除浏览器缓存**：按 `Ctrl+Shift+R` (Windows) 或 `Cmd+Shift+R` (Mac)
3. **重新尝试 Google 登录**
4. **检查弹窗**：应该显示 "continue to studiply.it" 或 "continue to Studiply"

## ⚠️ 重要提示

### 关于域名显示
- Google OAuth 同意屏幕**可能仍然显示 Firebase 域名**，这是正常的
- 重要的是**应用名称**会显示为 "Studiply" 而不是 "study-hub-1297a"
- 用户看到的是应用名称，域名通常显示在较小的地方

### 关于授权域名
- 确保在 Firebase Console → Authentication → Settings → Authorized domains 中添加了 `studiply.it`
- 确保在 Google Cloud Console → OAuth consent screen → Authorized domains 中添加了 `studiply.it`

### 关于应用状态
- **Internal**（内部）：只有你组织内的用户可以使用，不需要发布
- **External**（外部）：任何人都可以使用，需要发布应用并通过 Google 审核（如果使用敏感范围）

## 📝 完整检查清单

- [ ] 在 Google Cloud Console 配置了 OAuth 同意屏幕
- [ ] 设置了应用名称为 "Studiply"
- [ ] 添加了 `studiply.it` 到授权域名列表
- [ ] 在 Firebase Console 中添加了 `studiply.it` 到授权域名
- [ ] 等待配置生效（可能需要几分钟）
- [ ] 清除浏览器缓存并重新测试

## 🆘 如果仍然显示 Firebase 域名

如果配置后仍然显示 `study-hub-1297a.firebaseapp.com`：

1. **这是正常的**：Google OAuth 可能会显示 Firebase 项目域名作为安全标识
2. **应用名称更重要**：确保应用名称显示为 "Studiply"
3. **用户体验**：用户主要看到的是应用名称，域名通常显示在较小的地方
4. **功能不受影响**：即使显示 Firebase 域名，登录功能仍然正常工作

## 🎯 最佳实践

1. **使用有意义的应用名称**：在 OAuth 同意屏幕中使用 "Studiply" 而不是项目 ID
2. **添加应用图标**：上传应用图标让登录界面更专业
3. **配置隐私政策**：如果可能，添加隐私政策链接增加用户信任
4. **使用自定义域名**：在 Firebase Hosting 中配置自定义域名以获得更好的品牌体验
