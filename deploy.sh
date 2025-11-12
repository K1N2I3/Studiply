#!/bin/bash

echo "🚀 Study Hub 部署脚本"
echo "========================"

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

echo "✅ Node.js 和 npm 已安装"

# 安装依赖
echo "📦 安装依赖..."
npm install

# 构建项目
echo "🔨 构建项目..."
npm run build

# 检查构建是否成功
if [ $? -eq 0 ]; then
    echo "✅ 构建成功！"
    echo "📁 构建文件位于 dist/ 目录"
    echo ""
    echo "🌐 部署选项："
    echo "1. 将 dist/ 文件夹拖拽到 Netlify"
    echo "2. 将 dist/ 文件夹拖拽到 Vercel"
    echo "3. 使用 Firebase Hosting: firebase deploy"
    echo "4. 使用 GitHub Pages: npm run deploy"
    echo ""
    echo "📋 记得设置环境变量："
    echo "- VITE_AGORA_APP_ID=你的Agora_APP_ID"
    echo ""
    echo "🎉 准备就绪，可以发布了！"
else
    echo "❌ 构建失败，请检查错误信息"
    exit 1
fi
