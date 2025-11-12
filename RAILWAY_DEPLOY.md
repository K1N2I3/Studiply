# Railway 后端部署指南

## 步骤 1: 创建 Railway 账户

1. 访问 https://railway.app
2. 点击 "Start a New Project"
3. 选择 "Login with GitHub"
4. 授权 Railway 访问你的 GitHub 账户

## 步骤 2: 部署后端

1. 在 Railway Dashboard，点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的 `Studiply` 仓库
4. **重要**: 在部署设置中，设置 **Root Directory** 为 `backend`
5. Railway 会自动检测到 `package.json` 并开始部署

## 步骤 3: 配置环境变量

在 Railway 项目设置中，添加以下环境变量：

### 必需的环境变量：

```env
MONGODB_URI=你的MongoDB连接字符串
JWT_SECRET=生成一个强密钥（可以使用 node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"）
EMAIL_USER=你的邮箱地址
EMAIL_PASSWORD=你的邮箱应用密码
TWILIO_ACCOUNT_SID=从Twilio获取
TWILIO_AUTH_TOKEN=从Twilio获取
TWILIO_VERIFY_SERVICE_SID=从Twilio获取
PORT=3003
```

### 如何获取 MongoDB URI：

1. 访问 https://www.mongodb.com/atlas
2. 创建免费账户
3. 创建集群
4. 获取连接字符串

### 如何获取 Twilio 凭证：

1. 登录 Twilio Console
2. Account SID 和 Auth Token 在 Account Info 页面
3. Verify Service SID 在 Verify → Services 页面

## 步骤 4: 获取后端 URL

部署成功后：

1. 在 Railway 项目页面，点击你的服务
2. 在 "Settings" → "Networking" 中
3. 生成一个 Public Domain（或使用提供的默认域名）
4. 复制这个 URL（例如：`https://studiply-backend.railway.app`）

## 步骤 5: 配置前端

1. 登录 Vercel Dashboard
2. 进入你的项目设置
3. 点击 "Environment Variables"
4. 添加：
   - **Name**: `VITE_API_BASE_URL`
   - **Value**: `https://你的railway-url/api`（注意末尾的 `/api`）
   - **Environment**: Production, Preview, Development
5. 保存后重新部署前端

## 步骤 6: 测试

1. 打开你的网站
2. 尝试注册新账户
3. 输入手机号并测试 SMS 验证
4. 检查浏览器控制台是否有错误

## 故障排除

### 后端无法启动
- 检查环境变量是否全部设置
- 查看 Railway 日志

### CORS 错误
- 确保后端 CORS 配置包含你的前端域名
- 检查 `backend/server.js` 中的 CORS 设置

### SMS 验证失败
- 检查 Twilio 凭证是否正确
- 确认 Twilio 账户有足够的余额
- 检查 Railway 日志中的错误信息

## 成本

- **Railway**: 免费额度 $5/月，之后按使用量付费
- **MongoDB Atlas**: 免费 512MB
- **Twilio**: 试用账户有 $15.50 免费额度

## 下一步

部署完成后，告诉我你的后端 URL，我会帮你更新前端配置！

