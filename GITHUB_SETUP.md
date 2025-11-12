# GitHub 仓库设置指南

## 步骤 1: 在 GitHub 上创建仓库

1. 访问 https://github.com
2. 登录你的账户
3. 点击右上角的 "+" → "New repository"
4. 填写信息：
   - **Repository name**: `studiply` (或你喜欢的名字)
   - **Description**: `Studiply Learning Platform`
   - **Visibility**: 选择 Public 或 Private
   - **不要**勾选 "Initialize this repository with a README"（因为我们已经有了代码）
5. 点击 "Create repository"

## 步骤 2: 连接本地仓库到 GitHub

创建仓库后，GitHub 会显示一个页面，上面有命令。但我会帮你执行：

### 方法 1: 使用 HTTPS（推荐）

```bash
cd "/Users/ken.lin/Desktop/Study Hub"
git remote add origin https://github.com/你的用户名/studiply.git
git branch -M main
git push -u origin main
```

### 方法 2: 使用 SSH

如果你配置了 SSH key：

```bash
cd "/Users/ken.lin/Desktop/Study Hub"
git remote add origin git@github.com:你的用户名/studiply.git
git branch -M main
git push -u origin main
```

## 步骤 3: 推送代码

执行上面的命令后，代码就会被推送到 GitHub。

## 重要提示

- `.env` 文件已经被 `.gitignore` 忽略，不会上传到 GitHub（这是安全的）
- 敏感信息（如 API keys）不会泄露
- 只有代码会上传到 GitHub

## 下一步：部署后端到 Railway

代码推送到 GitHub 后：

1. 访问 https://railway.app
2. 用 GitHub 登录
3. 创建新项目 → "Deploy from GitHub repo"
4. 选择你的 `studiply` 仓库
5. 设置 Root Directory 为 `backend`
6. 添加环境变量
7. 部署！

## 需要帮助？

告诉我你的 GitHub 用户名，我可以帮你生成完整的命令。

