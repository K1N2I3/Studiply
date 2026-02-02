# 查找或创建 Google Cloud 项目指南

## 🎯 问题
在 Google Cloud Console 中找不到对应的项目，但 Firebase 项目存在。

## 📋 理解 Firebase 和 Google Cloud 的关系

- **Firebase 项目** = **Google Cloud 项目**
- 每个 Firebase 项目都对应一个 Google Cloud 项目
- 它们使用相同的项目 ID（`study-hub-1297a`）

## ✅ 解决方案

### 方法 1: 从 Firebase 控制台打开 Google Cloud Console

#### 步骤 1: 在 Firebase 控制台中
1. 访问 [Firebase 控制台](https://console.firebase.google.com)
2. 选择项目：**study-hub-1297a**
3. 点击右上角的齿轮图标 ⚙️
4. 选择 **"Project settings"**（项目设置）

#### 步骤 2: 找到 Google Cloud 项目链接
1. 在项目设置页面，找到 **"Project ID"** 部分
2. 你会看到项目 ID：`study-hub-1297a`
3. 点击项目 ID 旁边的链接，或者
4. 在页面底部找到 **"Google Cloud Platform"** 部分
5. 点击 **"Open in Google Cloud Console"**（在 Google Cloud Platform 中打开）

这会直接打开对应的 Google Cloud 项目。

### 方法 2: 直接在 Google Cloud Console 中搜索

1. 访问 [Google Cloud Console](https://console.cloud.google.com)
2. 确保使用**与 Firebase 相同的 Google 账户**登录
3. 在顶部项目选择器中，点击下拉菜单
4. 在搜索框中输入：`study-hub-1297a`
5. 如果项目存在，应该会显示出来

### 方法 3: 检查是否使用了不同的 Google 账户

可能的情况：
- Firebase 使用账户 A
- Google Cloud Console 使用账户 B

**解决方案**：
1. 在 Google Cloud Console 右上角，点击账户头像
2. 检查当前登录的账户
3. 如果不对，点击 **"切换账户"** 或 **"Add account"**
4. 使用与 Firebase 相同的账户登录

### 方法 4: 项目可能还没有被创建

如果 Firebase 项目是新创建的，对应的 Google Cloud 项目可能需要一些时间才能显示。

**解决方案**：
1. 等待几分钟
2. 刷新 Google Cloud Console
3. 或者按照方法 1，从 Firebase 控制台直接打开

## 🔍 验证项目是否存在

### 在 Firebase 控制台中检查：

1. 进入 **Project settings**（项目设置）
2. 查看 **"Project ID"**：应该是 `study-hub-1297a`
3. 查看 **"Project number"**：记录这个数字

### 在 Google Cloud Console 中验证：

1. 打开 [Google Cloud Console](https://console.cloud.google.com)
2. 在项目选择器中，应该能看到 `study-hub-1297a`
3. 如果看不到，使用项目编号搜索

## ⚠️ 重要提示

### 关于 OAuth 同意屏幕的域名显示

**即使找不到 Google Cloud 项目，Google 登录仍然可以正常工作！**

- Google OAuth 弹窗显示 `study-hub-1297a.firebaseapp.com` 是**正常的**
- 这是 Firebase 项目的默认域名，作为安全标识
- **功能不受影响**：用户仍然可以正常登录

### 如果你想要显示自定义域名

如果你确实想要在 OAuth 同意屏幕中显示 `studiply.it`，需要：

1. **找到或创建 Google Cloud 项目**（使用上面的方法）
2. **配置 OAuth 同意屏幕**（参考 `CUSTOM_DOMAIN_OAUTH.md`）

但这**不是必须的**，因为：
- 登录功能已经正常工作
- 用户主要看到的是应用名称（可以在 Firebase 项目设置中配置）
- 域名显示在较小的地方，不影响用户体验

## 🎯 快速检查清单

- [ ] 使用与 Firebase 相同的 Google 账户登录 Google Cloud Console
- [ ] 从 Firebase 控制台的项目设置中打开 Google Cloud Console
- [ ] 在 Google Cloud Console 中搜索项目 ID：`study-hub-1297a`
- [ ] 如果找不到，等待几分钟后重试
- [ ] 确认 Google 登录功能是否正常工作（即使显示 Firebase 域名）

## 🆘 如果仍然找不到项目

### 选项 1: 继续使用（推荐）
- Google 登录功能已经正常工作
- 显示 Firebase 域名是正常的
- 不需要额外配置

### 选项 2: 联系 Firebase 支持
如果确实需要配置 OAuth 同意屏幕但找不到项目：
1. 在 Firebase 控制台点击 **"Help"**（帮助）
2. 选择 **"Contact support"**（联系支持）
3. 说明情况并请求帮助

### 选项 3: 检查项目权限
确保你的 Google 账户有项目访问权限：
1. 在 Firebase 控制台 → Project settings → Users and permissions
2. 确认你的账户在列表中
3. 确认有适当的权限（Owner 或 Editor）

## 📝 总结

**最重要的是**：Google 登录功能已经正常工作。OAuth 同意屏幕显示 Firebase 域名是正常且安全的行为，不需要额外配置。

如果你确实想要自定义显示，可以：
1. 从 Firebase 控制台打开 Google Cloud Console
2. 配置 OAuth 同意屏幕
3. 但这完全是可选的，不影响功能
