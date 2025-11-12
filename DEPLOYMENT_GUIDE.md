# 🚀 Studiply 生产环境部署指南

## 📋 部署选项

### 选项 1: 全栈部署 (推荐)

#### 后端部署 (Railway/Heroku)
1. **创建 Railway 账户**: https://railway.app
2. **连接 GitHub 仓库**
3. **设置环境变量**:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/studyhub
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=your-app-password
   PORT=3003
   ```

#### 前端部署 (Vercel/Netlify)
1. **创建 Vercel 账户**: https://vercel.com
2. **连接 GitHub 仓库**
3. **设置环境变量**:
   ```
   NODE_ENV=production
   REACT_APP_API_URL=https://your-backend-url.railway.app/api
   ```

### 选项 2: 数据库即服务 (MongoDB Atlas)

#### 设置 MongoDB Atlas
1. **创建账户**: https://www.mongodb.com/atlas
2. **创建集群**
3. **获取连接字符串**:
   ```
   mongodb+srv://username:password@cluster.mongodb.net/studyhub
   ```

## 🛠️ 本地开发设置

### 1. 安装后端依赖
```bash
cd backend
npm install
```

### 2. 设置环境变量
```bash
# 复制环境变量模板
cp env.example .env

# 编辑 .env 文件
MONGODB_URI=mongodb://localhost:27017/studyhub
JWT_SECRET=your-super-secret-jwt-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
PORT=3003
```

### 3. 安装 MongoDB (本地开发)
```bash
# macOS
brew install mongodb-community

# 启动 MongoDB
brew services start mongodb-community
```

### 4. 启动后端服务
```bash
cd backend
npm run dev
```

### 5. 启动前端服务
```bash
# 在项目根目录
npm run dev
```

## 📧 邮件服务配置

### Gmail App Password 设置
1. **启用 2FA**: Google 账户 → 安全 → 两步验证
2. **生成 App Password**: Google 账户 → 安全 → 应用专用密码
3. **使用 App Password**: 不是你的 Gmail 密码

### 其他邮件服务
- **SendGrid**: 专业邮件服务
- **Mailgun**: 开发者友好
- **AWS SES**: 企业级解决方案

## 🔐 安全配置

### JWT Secret
```bash
# 生成强密码
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 环境变量安全
- ✅ 使用 `.env` 文件 (本地开发)
- ✅ 使用环境变量 (生产环境)
- ❌ 不要在代码中硬编码敏感信息

## 🌐 域名和 SSL

### 自定义域名
1. **购买域名**: Namecheap, GoDaddy
2. **配置 DNS**: 指向你的部署平台
3. **SSL 证书**: 自动提供 (Vercel, Netlify)

### CORS 配置
```javascript
// 在生产环境中更新 CORS 设置
app.use(cors({
  origin: ['https://your-frontend-domain.com'],
  credentials: true
}))
```

## 📊 监控和日志

### 推荐工具
- **Sentry**: 错误监控
- **LogRocket**: 用户会话重放
- **MongoDB Atlas**: 数据库监控

## 💰 成本估算

### 免费方案
- **Vercel**: 免费 (个人项目)
- **Railway**: 免费额度
- **MongoDB Atlas**: 免费 512MB

### 付费方案
- **Vercel Pro**: $20/月
- **Railway**: $5/月
- **MongoDB Atlas**: $9/月

## 🚀 快速部署步骤

### 1. 准备代码
```bash
# 确保所有代码已提交到 GitHub
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 2. 部署后端
1. 连接 Railway 到 GitHub
2. 选择 backend 文件夹
3. 设置环境变量
4. 部署

### 3. 部署前端
1. 连接 Vercel 到 GitHub
2. 设置环境变量 (API_URL)
3. 部署

### 4. 测试部署
1. 访问前端 URL
2. 测试注册功能
3. 检查邮箱验证
4. 测试登录功能

## 🔧 故障排除

### 常见问题
1. **CORS 错误**: 检查后端 CORS 配置
2. **数据库连接失败**: 检查 MongoDB URI
3. **邮件发送失败**: 检查 Gmail App Password
4. **JWT 错误**: 检查 JWT_SECRET

### 调试技巧
```bash
# 查看后端日志
railway logs

# 查看前端构建日志
vercel logs
```

## 📝 生产环境检查清单

- [ ] 环境变量已设置
- [ ] 数据库连接正常
- [ ] 邮件服务配置正确
- [ ] SSL 证书有效
- [ ] CORS 配置正确
- [ ] 错误监控已设置
- [ ] 备份策略已实施

## 🎯 下一步

1. **性能优化**: 添加缓存、CDN
2. **功能扩展**: 添加更多学习功能
3. **移动端**: 开发 React Native 应用
4. **分析**: 添加用户行为分析

---

**需要帮助？** 查看 [FAQ](./FAQ.md) 或创建 Issue。
