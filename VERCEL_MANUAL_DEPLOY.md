# Vercel 手动部署指南

## 方法 1: 通过 Vercel Dashboard 手动触发部署（推荐）

### 步骤：

1. **访问 Vercel Dashboard**
   - 打开 https://vercel.com/dashboard
   - 登录你的账户

2. **找到你的项目**
   - 在项目列表中找到 `Studiply` 项目
   - 点击进入项目详情页

3. **手动触发部署**
   - 点击顶部的 **"Deployments"** 标签
   - 点击右上角的 **"Redeploy"** 按钮（三个点的菜单中）
   - 选择 **"Redeploy"**
   - 在弹出窗口中：
     - 选择 **"Use existing Build Cache"**（快速）或 **"Rebuild"**（完全重新构建，推荐）
     - 点击 **"Redeploy"** 按钮

4. **等待部署完成**
   - 部署通常需要 1-3 分钟
   - 可以在 Deployments 页面查看部署进度
   - 部署完成后会显示绿色的勾 ✓

## 方法 2: 使用 Vercel CLI（命令行）

### 安装 Vercel CLI：

```bash
npm install -g vercel
```

### 登录 Vercel：

```bash
vercel login
```

### 部署项目：

```bash
# 在项目根目录执行
vercel --prod
```

## 方法 3: 检查并修复 GitHub 自动部署

### 检查 GitHub 集成：

1. **在 Vercel Dashboard 中**：
   - 进入项目设置（Settings）
   - 点击 **"Git"** 标签
   - 确认：
     - ✅ GitHub 仓库已连接
     - ✅ 监听的分支是 `main`
     - ✅ Webhook 状态正常

2. **在 GitHub 中检查 Webhook**：
   - 访问 https://github.com/K1N2I3/Studiply/settings/hooks
   - 查看是否有 Vercel 的 webhook
   - 如果 webhook 不存在或失败，需要重新连接

### 重新连接 GitHub：

1. 在 Vercel Dashboard → 项目 Settings → Git
2. 点击 **"Disconnect"** 断开当前连接
3. 点击 **"Connect Git Repository"**
4. 选择你的 GitHub 仓库
5. 确认设置后，Vercel 会自动创建 webhook

## 方法 4: 通过 GitHub 触发（临时方案）

如果自动部署不工作，可以创建一个空的 commit 来触发：

```bash
git commit --allow-empty -m "trigger vercel deployment"
git push origin main
```

## 常见问题排查

### 1. 部署失败
- 检查 Vercel Dashboard 中的部署日志
- 查看是否有构建错误
- 确认环境变量配置正确

### 2. Webhook 不工作
- 在 GitHub Settings → Webhooks 中检查
- 确认 webhook URL 正确
- 尝试重新连接 GitHub

### 3. 环境变量缺失
- 在 Vercel Dashboard → Settings → Environment Variables
- 确认 `VITE_API_BASE_URL` 等变量已设置
- 重新部署以应用新的环境变量

## 快速检查清单

- [ ] 代码已推送到 GitHub main 分支
- [ ] Vercel 项目已连接到正确的 GitHub 仓库
- [ ] 环境变量已正确配置
- [ ] 构建脚本在 package.json 中正确（`npm run build`）
- [ ] 在 Vercel Dashboard 中手动触发了一次部署
