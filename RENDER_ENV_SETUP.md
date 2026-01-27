# Render 环境变量配置指南 - 忘记密码功能

## 📋 必需的环境变量

在 Render Dashboard 中，进入你的后端服务 → **Environment** 选项卡，添加以下环境变量：

### 1. Resend 邮件服务（必需）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `RESEND_API_KEY` | `re_CT8bkJqY_NKrRjboXZZq7RGVHN62BPU3E` | Resend API 密钥 |
| `RESEND_FROM_EMAIL` | `noreply@studiply.it` | 发件人邮箱（必须在 Resend 中验证） |

### 2. Firebase Admin（必需 - 用于更新 Firestore 密码）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `FIREBASE_PROJECT_ID` | `你的项目ID` | Firebase 项目 ID |
| `FIREBASE_CLIENT_EMAIL` | `firebase-adminsdk-xxx@xxx.iam.gserviceaccount.com` | Firebase Admin SDK 服务账号邮箱 |
| `FIREBASE_PRIVATE_KEY` | `-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n` | Firebase Admin SDK 私钥（完整格式，包含换行符） |

**如何获取 Firebase Admin 凭证：**
1. 访问 [Firebase Console](https://console.firebase.google.com)
2. 选择你的项目
3. 点击 ⚙️ **Project Settings** → **Service Accounts**
4. 点击 **Generate New Private Key**
5. 下载 JSON 文件，复制以下字段：
   - `project_id` → `FIREBASE_PROJECT_ID`
   - `client_email` → `FIREBASE_CLIENT_EMAIL`
   - `private_key` → `FIREBASE_PRIVATE_KEY`（注意：需要保留 `\n` 换行符）

### 3. MongoDB（必需）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `MONGODB_URI` | `mongodb+srv://...` | MongoDB 连接字符串 |

### 4. JWT Secret（必需）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `JWT_SECRET` | `你的密钥` | JWT 签名密钥（建议使用强随机字符串） |

### 5. 前端 URL（可选，但推荐）

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `FRONTEND_URL` | `https://www.studiply.it` | 前端 URL（用于邮件中的链接） |

## 🔧 配置步骤

1. **登录 Render Dashboard**：https://dashboard.render.com

2. **找到你的后端服务**（例如：`studiply-backend`）

3. **点击服务** → **Environment** 选项卡

4. **添加所有必需的环境变量**

5. **重要：对于 `FIREBASE_PRIVATE_KEY`**：
   - 在 Render 的 Environment 变量中，直接粘贴完整的私钥
   - 包括 `-----BEGIN PRIVATE KEY-----` 和 `-----END PRIVATE KEY-----`
   - 保留所有的 `\n` 换行符（Render 会自动处理）

6. **保存后，手动触发重新部署**：
   - 点击 **Manual Deploy** → **Deploy latest commit**

## ✅ 验证配置

部署完成后，检查日志应该看到：
```
✅ Connected to MongoDB
✅ Firebase Admin initialized for streak reminders
```

## 🧪 测试忘记密码功能

1. 访问：https://www.studiply.it/forgot-password
2. 输入注册邮箱
3. 检查邮箱是否收到 6 位验证码
4. 输入验证码和新密码
5. 尝试用新密码登录

## ⚠️ 常见问题

### 问题 1：邮件没有发送
- 检查 `RESEND_API_KEY` 是否正确
- 检查 `RESEND_FROM_EMAIL` 是否在 Resend 中验证
- 查看 Render 日志中的错误信息

### 问题 2：Firestore 密码没有更新
- 检查 Firebase Admin 环境变量是否正确
- 确认 `FIREBASE_PRIVATE_KEY` 包含完整的私钥（包括 BEGIN/END 标记）
- 查看 Render 日志中是否有 Firebase 初始化错误

### 问题 3：验证码无效
- 确认 MongoDB 和 Firestore 中都有存储验证码
- 检查验证码是否过期（10 分钟有效期）

## 📝 注意事项

- 所有环境变量添加后，**必须重新部署**才能生效
- `FIREBASE_PRIVATE_KEY` 是敏感信息，不要泄露
- Resend 有免费额度限制，注意监控使用量
