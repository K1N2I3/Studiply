# 启用 Google 登录提供者指南

## 🎯 问题
错误信息：**"Google login is not enabled"**

这意味着 Firebase 控制台中还没有启用 Google 登录提供者。

## ✅ 解决方案

### 步骤 1: 打开 Firebase 控制台

1. 访问 [Firebase 控制台](https://console.firebase.google.com)
2. 使用你的 Google 账户登录
3. 选择项目：**study-hub-1297a**

### 步骤 2: 进入 Authentication 设置

1. 在左侧菜单中，点击 **"Authentication"**（认证）
2. 如果这是第一次使用 Authentication，点击 **"Get started"**（开始使用）
3. 点击顶部的 **"Sign-in method"**（登录方法）标签

### 步骤 3: 启用 Google 登录

1. 在登录方法列表中，找到 **"Google"** 行
2. 点击 **"Google"** 这一行（不是开关，而是整行）
3. 会弹出一个设置对话框

### 步骤 4: 配置 Google 登录

在设置对话框中：

1. **启用开关**：点击顶部的 **"Enable"**（启用）开关，将其打开
2. **Project support email**：选择一个邮箱地址
   - 这通常是你的项目邮箱或 Google 账户邮箱
   - 从下拉菜单中选择一个邮箱
3. **点击 "Save"**（保存）按钮

### 步骤 5: 验证设置

1. 保存后，你应该看到 **"Google"** 行的状态变为 **"Enabled"**（已启用）
2. 状态图标应该显示为绿色或已启用状态

## 📸 视觉指南

### 在 Sign-in method 页面，你应该看到：

```
┌─────────────────────────────────────────┐
│ Sign-in method                          │
├─────────────────────────────────────────┤
│ Email/Password    [Enabled]  [Edit]     │
│ Google            [Disabled] [Edit] ← 点击这里
│ Facebook          [Disabled] [Edit]     │
│ ...                                      │
└─────────────────────────────────────────┘
```

### 点击 Google 后，会弹出设置对话框：

```
┌─────────────────────────────────────────┐
│ Google                                  │
├─────────────────────────────────────────┤
│ Enable                                  │
│ [●] Enable  ← 点击这个开关              │
│                                          │
│ Project support email                   │
│ [下拉菜单] ← 选择一个邮箱               │
│                                          │
│ [Cancel]  [Save] ← 点击 Save            │
└─────────────────────────────────────────┘
```

## ⚠️ 常见问题

### 问题 1: 找不到 "Sign-in method" 标签
**解决方案**：
- 确保你已经点击了左侧菜单的 **"Authentication"**
- 如果看到 "Get started"，先点击它来初始化 Authentication

### 问题 2: 没有 "Google" 选项
**解决方案**：
- 刷新页面
- 确保你使用的是正确的 Firebase 项目
- 检查项目是否有权限限制

### 问题 3: 无法选择 Project support email
**解决方案**：
- 确保你的 Google 账户有项目访问权限
- 尝试刷新页面
- 如果下拉菜单为空，可能需要先配置项目设置

### 问题 4: 保存后仍然显示 "Disabled"
**解决方案**：
- 刷新页面
- 检查是否有错误提示
- 确保你点击了 "Save" 按钮
- 等待几秒钟让设置生效

## 🔍 验证步骤

启用后，验证设置是否正确：

1. **检查状态**：在 Sign-in method 页面，Google 应该显示为 "Enabled"
2. **测试登录**：返回你的应用，尝试 Google 登录
3. **检查控制台**：如果仍有问题，查看浏览器控制台的错误信息

## 📝 完整流程总结

1. ✅ 访问 Firebase 控制台
2. ✅ 选择项目：**study-hub-1297a**
3. ✅ 点击 **Authentication** → **Sign-in method**
4. ✅ 点击 **Google** 行
5. ✅ 启用 **Enable** 开关
6. ✅ 选择 **Project support email**
7. ✅ 点击 **Save**
8. ✅ 等待几秒钟
9. ✅ 测试 Google 登录

## 🆘 如果仍然有问题

如果按照以上步骤操作后仍然无法启用：

1. **检查项目权限**：确保你的账户有项目管理员权限
2. **检查浏览器**：尝试使用不同的浏览器或清除缓存
3. **查看 Firebase 状态**：访问 [Firebase Status](https://status.firebase.google.com) 检查是否有服务中断
4. **联系支持**：如果问题持续，可以在 Firebase 控制台提交支持请求

## 🎯 下一步

启用 Google 登录后：

1. **添加授权域名**（如果还没有）：
   - 参考 `ADD_AUTHORIZED_DOMAIN.md` 文件
   - 在 Authentication → Settings → Authorized domains 中添加你的域名

2. **测试登录**：
   - 返回你的应用
   - 点击 Google 登录按钮
   - 应该能正常弹出 Google 登录窗口

3. **配置 OAuth 同意屏幕**（如果需要）：
   - 如果是第一次使用，可能需要配置 OAuth 同意屏幕
   - 参考 `GOOGLE_LOGIN_SETUP.md` 文件中的步骤 2
