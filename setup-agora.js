#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎥 Studiply - Agora视频会议设置向导\n');

async function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAgora() {
  try {
    console.log('请输入你的Agora配置信息：\n');
    
    const appId = await question('1. 你的Agora App ID: ');
    const appCertificate = await question('2. 你的Agora App Certificate: ');
    
    if (!appId || !appCertificate) {
      console.log('❌ App ID和App Certificate都是必需的！');
      process.exit(1);
    }
    
    // 创建.env.local文件
    const envContent = `# Agora配置
VITE_AGORA_APP_ID=${appId}
VITE_AGORA_APP_CERTIFICATE=${appCertificate}

# Token服务器配置
VITE_TOKEN_SERVER_URL=http://localhost:3001

# 服务器端配置
AGORA_APP_ID=${appId}
AGORA_APP_CERTIFICATE=${appCertificate}
PORT=3001`;

    fs.writeFileSync('.env.local', envContent);
    console.log('✅ 已创建 .env.local 文件');
    
    // 创建服务器环境文件
    const serverEnvContent = `AGORA_APP_ID=${appId}
AGORA_APP_CERTIFICATE=${appCertificate}
PORT=3001`;

    fs.writeFileSync('server/.env', serverEnvContent);
    console.log('✅ 已创建 server/.env 文件');
    
    console.log('\n🎉 设置完成！');
    console.log('\n下一步：');
    console.log('1. 启动Token服务器: cd server && npm start');
    console.log('2. 启动前端应用: npm run dev');
    console.log('3. 测试视频会议功能');
    
  } catch (error) {
    console.error('❌ 设置失败:', error.message);
  } finally {
    rl.close();
  }
}

setupAgora();
