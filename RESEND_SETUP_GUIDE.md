# 🚀 Resend 邮件服务设置指南

## 为什么使用 Resend？

- ⚡ **速度快**：通常几秒内送达（相比 SMTP 的几分钟）
- 🎯 **专为开发者设计**：简单的 API，易于集成
- 💰 **免费额度**：每月 3,000 封邮件（足够小到中型应用使用）
- 📊 **实时分析**：邮件发送状态、打开率等
- 🔒 **高可靠性**：99.9% 送达率

## 设置步骤

### 1. 注册 Resend 账户

1. 访问 [https://resend.com](https://resend.com)
2. 点击 "Sign Up" 注册账户
3. 验证你的邮箱

### 2. 获取 API Key

1. 登录后进入 Dashboard
2. 点击左侧菜单 "API Keys"
3. 点击 "Create API Key"
4. 输入名称（如 "Studiply Production"）
5. 选择权限（选择 "Sending access"）
6. 复制 API Key（格式：`re_xxxxxxxxxxxxx`）

⚠️ **重要**：API Key 只显示一次，请立即保存！

### 3. 验证域名（可选但推荐）

为了使用 `noreply@studiply.it` 这样的自定义发件地址：

1. 进入 "Domains" 页面
2. 点击 "Add Domain"
3. 输入你的域名（如 `studiply.it`）
4. 按照提示添加 DNS 记录到你的域名提供商
5. 等待验证完成（通常几分钟）

如果不想验证域名，可以使用 Resend 提供的测试域名（如 `onboarding@resend.dev`）

### 4. 配置环境变量

在 Render（或你的部署平台）添加以下环境变量：

```bash
# Resend API Key（必需）
RESEND_API_KEY=re_your_api_key_here

# 发件邮箱（如果验证了域名，使用你的域名邮箱）
RESEND_FROM_EMAIL=noreply@studiply.it

# 或者使用 Resend 测试域名
# RESEND_FROM_EMAIL=onboarding@resend.dev
```

### 5. 安装依赖

代码已经更新，只需要安装新的依赖：

```bash
cd backend
npm install
```

### 6. 部署

1. 提交代码到 GitHub
2. Render 会自动检测并部署
3. 检查部署日志确认没有错误

## 测试

部署完成后，测试注册功能：

1. 访问你的应用
2. 尝试注册新账户
3. 检查邮箱（应该在几秒内收到验证码）

## 监控

在 Resend Dashboard 可以查看：

- 📧 发送的邮件数量
- ✅ 送达率
- 📊 打开率（如果启用）
- ⚠️ 错误日志

## 费用

- **免费计划**：每月 3,000 封邮件
- **Pro 计划**：$20/月，50,000 封邮件
- **更多计划**：查看 [Resend 定价](https://resend.com/pricing)

## 故障排除

### 邮件发送失败

1. 检查 API Key 是否正确
2. 检查 `RESEND_FROM_EMAIL` 是否已验证
3. 查看 Resend Dashboard 的错误日志
4. 检查后端日志

### 仍然使用 SMTP

如果没有设置 `RESEND_API_KEY`，系统会自动回退到 SMTP。确保设置了正确的环境变量。

## 迁移完成

✅ 验证码邮件现在使用 Resend（快速）
✅ 其他邮件（日历提醒等）仍使用 SMTP（作为备选）
✅ 系统会自动选择最快的可用服务

---

**需要帮助？** 查看 [Resend 文档](https://resend.com/docs) 或创建 Issue。

