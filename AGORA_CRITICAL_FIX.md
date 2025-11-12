# 🚨 Agora 关键问题修复

## 问题分析

从日志分析，你的 Agora App ID `b6fb553e52ee4443a865014b65568c57` 格式正确（32位十六进制），但是持续出现 `CAN_NOT_GET_GATEWAY_SERVER: dynamic use static key` 错误。

这个错误的具体含义：
- **"dynamic use static key"** 表示 Agora 服务器期望动态密钥，但收到了静态 App ID
- 这通常意味着你的 Agora 项目配置为需要 **App Certificate** 模式，但代码中使用的是 **App ID** 模式

## 🔧 立即解决方案

### 方案 1：切换到 App ID 模式（推荐）

1. **登录 Agora 控制台**：https://console.agora.io
2. **进入你的项目**：找到 App ID `b6fb553e52ee4443a865014b65568c57`
3. **检查认证方式**：
   - 如果显示 "APP ID + App Certificate"，需要改为 "APP ID"
   - 或者创建新项目时选择 "APP ID" 模式

### 方案 2：获取 App Certificate

如果你的项目必须使用 App Certificate 模式：

1. 在 Agora 控制台中找到你的 App Certificate
2. 更新 `.env.local` 文件：
   ```bash
   VITE_AGORA_APP_ID=b6fb553e52ee4443a865014b65568c57
   VITE_AGORA_APP_CERTIFICATE=你的实际证书
   ```

### 方案 3：创建新项目（最简单）

1. 在 Agora 控制台创建新项目
2. **选择 "APP ID" 认证方式**（不要选择 App Certificate）
3. 获取新的 App ID
4. 更新 `.env.local` 文件

## 🔍 验证步骤

1. **检查项目状态**：
   - 确保项目状态为 "Active"
   - 确保没有暂停或限制

2. **检查服务启用状态**：
   - Voice & Video Call 服务必须启用
   - 检查是否有地区限制

3. **测试连接**：
   - 访问 `http://localhost:5173/agora-test`
   - 点击 "测试 Agora 连接"
   - 查看详细错误信息

## 📋 常见原因

1. **项目认证方式错误**：最常见的原因
2. **项目被暂停**：检查项目状态
3. **地区限制**：某些地区可能有限制
4. **App ID 格式错误**：虽然你的格式看起来正确
5. **网络问题**：防火墙或代理设置

## 🎯 推荐行动

**立即尝试方案 1**：在 Agora 控制台中将认证方式改为 "APP ID"，这是最简单的解决方案。

如果方案 1 不工作，请尝试方案 3 创建新项目。

## 📞 需要帮助？

如果以上方案都不工作：
1. 检查 Agora 控制台中的项目设置
2. 联系 Agora 技术支持
3. 查看 Agora 官方文档

---

**重要**：`dynamic use static key` 错误几乎总是认证方式配置问题，而不是代码问题。
