# 🔧 Agora 故障排除指南

## 错误：`CAN_NOT_GET_GATEWAY_SERVER: dynamic use static key`

这个错误通常表示 Agora App ID 配置有问题。以下是解决方案：

### 1. 检查 Agora 控制台设置

1. **登录 Agora 控制台**：https://console.agora.io
2. **检查项目状态**：
   - 确保项目状态为 "Active"（活跃）
   - 如果项目被暂停，需要重新激活
3. **检查 App ID**：
   - 确认 App ID 是正确的：`b6fb553e52ee4443a865014b65568c57`
   - App ID 应该是 32 位十六进制字符串

### 2. 项目配置检查

在 Agora 控制台中：

1. **进入项目设置**
2. **检查认证方式**：
   - 如果选择了 "APP ID + App Certificate"，需要配置 App Certificate
   - 如果选择了 "APP ID"，则不需要 App Certificate
3. **启用服务**：
   - 确保 "Voice & Video Call" 服务已启用
   - 检查是否有任何限制或暂停

### 3. 常见解决方案

#### 方案 1：使用 APP ID 模式（推荐用于测试）
1. 在 Agora 控制台中，将认证方式改为 "APP ID"
2. 这样就不需要 App Certificate
3. 重新测试连接

#### 方案 2：获取正确的 App Certificate
1. 如果项目使用 "APP ID + App Certificate" 模式
2. 在控制台中找到 App Certificate
3. 更新 `.env.local` 文件：
   ```bash
   VITE_AGORA_APP_ID=b6fb553e52ee4443a865014b65568c57
   VITE_AGORA_APP_CERTIFICATE=你的_实际_证书_这里
   ```

#### 方案 3：创建新项目
如果问题持续存在：
1. 在 Agora 控制台创建新项目
2. 选择 "APP ID" 认证方式
3. 获取新的 App ID
4. 更新 `.env.local` 文件

### 4. 测试步骤

1. **访问测试页面**：`http://localhost:5173/agora-test`
2. **点击 "测试 Agora 连接"**
3. **查看控制台日志**获取详细错误信息
4. **根据错误信息调整配置**

### 5. 网络和权限检查

- 确保网络连接正常
- 检查浏览器是否允许摄像头和麦克风权限
- 尝试在不同浏览器中测试
- 检查防火墙设置

### 6. 联系支持

如果问题仍然存在：
- 检查 Agora 官方文档
- 联系 Agora 技术支持
- 查看 Agora 社区论坛

## 测试命令

```bash
# 检查环境变量
cat .env.local

# 重启开发服务器
npm run dev
# 或
yarn dev
```

## 成功标志

当配置正确时，你应该看到：
- ✅ "Agora 连接成功！"
- 控制台显示 "Successfully joined channel"
- 测试页面显示 "已连接" 状态
