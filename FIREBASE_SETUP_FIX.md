# 🔧 Firebase 设置修复指南

## 问题诊断
根据诊断结果，主要问题是 **403 Forbidden** 错误，这表明：
- Firebase API 可以访问
- 但是权限被拒绝
- 通常是 Email/Password 认证未启用

## 🚨 紧急修复步骤

### 第一步：启用 Email/Password 认证
1. 访问 [Firebase 控制台](https://console.firebase.google.com)
2. 选择项目：**study-hub-1297a**
3. 点击左侧菜单 **"Authentication"**
4. 点击 **"Sign-in method"** 标签
5. 找到 **"Email/Password"** 行
6. 点击 **"Email/Password"** 进入设置
7. 确保 **"Enable"** 开关是打开的
8. 点击 **"Save"**

### 第二步：检查 API 密钥权限
1. 在 Firebase 控制台中
2. 点击右上角齿轮图标 → **"Project settings"**
3. 滚动到 **"Your apps"** 部分
4. 确认 Web 应用配置正确
5. 检查 **"Public-facing name"** 和 **"Support email"**

### 第三步：验证项目状态
1. 确保项目没有达到配额限制
2. 检查项目是否有任何警告或错误
3. 确认计费账户状态正常

## 🧪 测试步骤

### 测试 1：注册新账户
使用调试工具尝试注册：
- Email: `test@example.com`
- Password: `password123`

### 测试 2：如果注册成功
立即尝试登录相同账户

### 测试 3：如果注册失败
检查 Firebase 控制台中的错误日志

## 🔍 常见问题解决

### 问题 1：Email/Password 已启用但仍然 403
**解决方案**：
- 等待 5-10 分钟让设置生效
- 清除浏览器缓存
- 重新加载页面

### 问题 2：API 密钥权限问题
**解决方案**：
- 重新生成 API 密钥
- 更新 `src/firebase/config.js` 中的配置

### 问题 3：项目配额超限
**解决方案**：
- 检查 Firebase 控制台中的使用量
- 升级计费计划（如果需要）

## 📞 如果问题仍然存在

1. 检查 Firebase 控制台中的 **"Authentication" → "Users"** 标签
2. 查看是否有任何用户账户
3. 检查 **"Authentication" → "Sign-in method"** 中的状态
4. 查看 Firebase 控制台中的错误日志

## 🎯 预期结果

修复后，诊断工具应该显示：
- ✅ Project ID: study-hub-1297a
- ✅ 注册测试成功
- ✅ 登录测试成功
