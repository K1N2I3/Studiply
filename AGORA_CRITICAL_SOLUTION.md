# 🔥 Agora 关键错误解决方案

## 错误分析
```
CAN_NOT_GET_GATEWAY_SERVER: dynamic use static key
```

这个错误表明：
- **App ID 正确**：`b6fb553e52ee4443a865014b65568c57` (32位，格式正确)
- **问题根源**：Agora 项目设置为 **"App ID + App Certificate"** 认证模式
- **代码现状**：只提供了 App ID，没有提供 Token

## 🚀 解决方案（选择其一）

### 方案一：修改 Agora 项目设置（推荐）

1. **登录 Agora 控制台**
   - 访问：https://console.agora.io
   - 使用你的账号登录

2. **进入项目设置**
   - 找到你的项目（App ID: `b6fb553e52ee4443a865014b65568c57`）
   - 点击项目名称进入详情页

3. **修改认证设置**
   - 找到 **"Authentication"** 或 **"认证"** 设置
   - 将认证方式从 **"App ID + App Certificate"** 改为 **"App ID"**
   - 保存设置

4. **验证修改**
   - 等待 1-2 分钟让设置生效
   - 重新测试视频通话功能

### 方案二：获取 App Certificate（高级）

如果你需要保持 "App ID + App Certificate" 模式：

1. **获取 App Certificate**
   - 在项目设置中找到 App Certificate
   - 复制证书字符串

2. **生成 Token**
   - 使用 Agora Token 生成器
   - 或使用服务器端 SDK 生成临时 Token

3. **修改代码**
   - 在 `RealVideoCall.jsx` 中使用生成的 Token
   - 替换 `null` token

## 🎯 推荐操作步骤

**立即执行：**
1. 登录 https://console.agora.io
2. 进入项目设置
3. 找到 Authentication 选项
4. 改为 "App ID" 模式
5. 保存并等待生效

## ✅ 验证方法

修改后，你应该看到：
- 视频通话正常启动
- 没有 `CAN_NOT_GET_GATEWAY_SERVER` 错误
- 能够成功加入频道

## 🔍 故障排除

如果修改后仍有问题：
1. 确认项目状态为 "Active"
2. 检查网络连接
3. 尝试创建新项目（选择 App ID 模式）
4. 清除浏览器缓存

## 📞 需要帮助？

如果无法找到认证设置：
1. 截图你的项目设置页面
2. 或创建新的 Agora 项目
3. 确保选择 "App ID" 认证模式
