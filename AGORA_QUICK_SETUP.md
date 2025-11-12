# 🚀 Agora 视频通话快速设置指南

## 问题解决
你遇到的错误 `CAN_NOT_GET_GATEWAY_SERVER` 是因为 Agora App ID 没有正确配置。

## 快速解决步骤

### 1. 注册 Agora 账户
1. 访问 [https://www.agora.io](https://www.agora.io)
2. 点击 "Sign Up" 注册账户
3. 验证邮箱并完成注册

### 2. 创建项目
1. 登录 Agora 控制台
2. 点击 "Projects" → "Create"
3. 输入项目名称：`Study Hub Tutoring`
4. 选择认证方式：`APP ID + App Certificate`
5. 点击 "Submit" 创建项目

### 3. 获取 App ID
1. 在项目列表中点击你的项目
2. 复制 `App ID` (类似：`1234567890abcdef1234567890abcdef`)
3. 保存这个ID

### 4. 配置环境变量
在项目根目录创建 `.env.local` 文件：

```bash
# Agora配置
VITE_AGORA_APP_ID=你的_APP_ID_这里
VITE_AGORA_APP_CERTIFICATE=你的_APP_CERTIFICATE_这里
```

### 5. 重启开发服务器
```bash
# 停止当前服务器 (Ctrl+C)
# 然后重新启动
npm run dev
# 或
yarn dev
```

## 免费额度
- 每月 10,000 分钟免费通话时长
- 支持最多 100 个并发用户
- 适合中小型应用

## 测试配置
如果暂时不想设置 Agora，视频通话功能会显示配置错误页面，但不影响其他功能的正常使用。

## 故障排除
- 确保 App ID 是32位字符串
- 确保环境变量名使用 `VITE_` 前缀
- 重启开发服务器使环境变量生效
- 检查浏览器控制台是否有其他错误信息

配置完成后，视频通话功能将正常工作！