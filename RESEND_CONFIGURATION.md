# 📧 Resend 邮件服务配置指南

## ✅ 已完成的配置

你已经：
- ✅ 在 Resend 上注册了域名 `studiply.it`
- ✅ 创建了不同的邮箱地址用于不同用途
- ✅ 获取了 API Key

## 🔧 需要在 Render 设置的环境变量

在 Render Dashboard 中，进入你的后端服务，添加以下环境变量：

### 必需的环境变量：

```bash
# Resend API Key（必需）
RESEND_API_KEY=re_CT8bkJqY_NKrRjboXZZq7RGVHN62BPU3E

# Resend 邮箱地址（已验证的域名）
RESEND_FROM_EMAIL=noreply@studiply.it              # 注册验证码邮件
RESEND_CHANGE_EMAIL=change-email@studiply.it        # 更换邮箱验证
RESEND_CALENDAR_EMAIL=calendar@studiply.it          # 日历提醒
RESEND_NOTIFICATION_EMAIL=notification@studiply.it # 所有提醒（包括 streak）
```

### 其他环境变量（如果还没有设置）：

```bash
# 前端 URL（用于邮件中的链接）
FRONTEND_URL=https://www.studiply.it

# 其他必需的环境变量
MONGODB_URI=你的MongoDB连接字符串
JWT_SECRET=你的JWT密钥
PORT=3003
```

## 📋 邮件类型和发件地址映射

| 邮件类型 | 发件地址 | 用途 |
|---------|---------|------|
| 注册验证码 | `noreply@studiply.it` | 用户注册时的验证码 |
| 更换邮箱验证 | `change-email@studiply.it` | 用户更换邮箱时的验证 |
| 日历提醒 | `calendar@studiply.it` | 日历事件提醒 |
| 连续学习提醒 | `notification@studiply.it` | Day streak 提醒 |

## 🚀 部署步骤

1. **在 Render Dashboard 设置环境变量**
   - 进入你的后端服务
   - 点击 "Environment" 标签
   - 添加上述所有环境变量
   - 保存

2. **重新部署**
   - Render 会自动检测环境变量变化
   - 或者手动触发重新部署

3. **验证配置**
   - 检查部署日志，确认没有错误
   - 测试发送验证码邮件
   - 检查 Resend Dashboard 的发送统计

## ✅ 验证清单

- [ ] `RESEND_API_KEY` 已设置
- [ ] `RESEND_FROM_EMAIL` 已设置
- [ ] `RESEND_CHANGE_EMAIL` 已设置
- [ ] `RESEND_CALENDAR_EMAIL` 已设置
- [ ] `RESEND_NOTIFICATION_EMAIL` 已设置
- [ ] `FRONTEND_URL` 已设置
- [ ] 所有邮箱地址已在 Resend 验证
- [ ] 代码已部署

## 🔍 测试

部署完成后，测试以下功能：

1. **注册验证码**：尝试注册新用户
2. **更换邮箱**：尝试更换邮箱地址
3. **日历提醒**：创建日历事件并设置提醒
4. **Streak 提醒**：等待晚上 8-9 点或手动触发

## 📊 监控

在 Resend Dashboard 可以查看：
- 📧 发送的邮件数量
- ✅ 送达率
- ⚠️ 错误日志
- 📈 发送统计

## 🆘 故障排除

### 邮件发送失败

1. 检查 API Key 是否正确
2. 检查邮箱地址是否已验证
3. 查看 Render 日志
4. 查看 Resend Dashboard 的错误日志

### 邮件被标记为垃圾邮件

1. 确保所有邮箱地址都已验证
2. 检查 SPF/DKIM/DMARC 记录（Resend 自动配置）
3. 查看 `EMAIL_SPAM_PREVENTION_GUIDE.md`

---

**配置完成后，所有邮件将通过 Resend 发送，速度更快，送达率更高！** 🚀

