# 🎥 Agora视频会议设置指南

## 📋 概述
这个指南将帮助你设置真实的视频会议功能，使用Agora.io的专业服务。

## 🚀 快速开始

### 1. 注册Agora账户
1. 访问 [Agora.io](https://www.agora.io/)
2. 点击 "Sign Up" 注册账户
3. 验证邮箱并完成注册

### 2. 创建项目
1. 登录Agora控制台
2. 点击 "Projects" → "Create"
3. 输入项目名称：`Studiply Tutoring`
4. 选择认证方式：`APP ID + App Certificate`
5. 点击 "Submit" 创建项目

### 3. 获取App ID
1. 在项目列表中点击你的项目
2. 复制 `App ID` (类似：`1234567890abcdef1234567890abcdef`)
3. 保存这个ID，稍后会用到

### 4. 配置环境变量
在项目根目录创建 `.env.local` 文件：

```bash
# Agora配置
REACT_APP_AGORA_APP_ID=你的_APP_ID_这里
REACT_APP_AGORA_APP_CERTIFICATE=你的_APP_CERTIFICATE_这里
```

### 5. 更新代码配置
编辑 `src/config/agora.js`：

```javascript
export const AGORA_CONFIG = {
  APP_ID: process.env.REACT_APP_AGORA_APP_ID,
  // ... 其他配置
}
```

## 🔧 部署配置

### Vercel部署
1. 在Vercel项目设置中添加环境变量：
   - `REACT_APP_AGORA_APP_ID`: 你的Agora App ID
   - `REACT_APP_AGORA_APP_CERTIFICATE`: 你的App Certificate

### Netlify部署
1. 在Netlify项目设置中添加环境变量
2. 重新部署项目

## 💰 费用说明

### 免费额度
- 每月10,000分钟免费通话时长
- 支持最多100个并发用户
- 适合中小型应用

### 付费计划
- 超出免费额度后按分钟计费
- 价格：$0.99/1000分钟
- 支持更多功能和更高并发

## 🔒 安全配置

### Token认证 (生产环境推荐)
1. 在Agora控制台启用Token认证
2. 生成App Certificate
3. 实现服务器端Token生成逻辑

### 示例Token服务器 (Node.js)
```javascript
const express = require('express');
const { RtcTokenBuilder, RtcRole } = require('agora-access-token');

const app = express();
const APP_ID = process.env.AGORA_APP_ID;
const APP_CERTIFICATE = process.env.AGORA_APP_CERTIFICATE;

app.post('/generate-token', (req, res) => {
  const { channelName, uid } = req.body;
  
  const expirationTimeInSeconds = 3600; // 1小时
  const role = RtcRole.PUBLISHER;
  
  const token = RtcTokenBuilder.buildTokenWithUid(
    APP_ID,
    APP_CERTIFICATE,
    channelName,
    uid,
    role,
    expirationTimeInSeconds
  );
  
  res.json({ token });
});
```

## 🧪 测试

### 本地测试
1. 启动开发服务器：`npm run dev`
2. 打开两个浏览器窗口
3. 分别以不同用户登录
4. 测试视频通话功能

### 生产测试
1. 部署到生产环境
2. 使用不同设备和网络测试
3. 验证音视频质量

## 🐛 常见问题

### Q: 无法连接视频会议？
A: 检查App ID是否正确，确保网络连接正常

### Q: 音视频质量差？
A: 检查网络带宽，调整视频分辨率设置

### Q: Token认证失败？
A: 检查App Certificate是否正确，确认Token未过期

## 📞 支持
- Agora文档：https://docs.agora.io/
- 技术支持：https://www.agora.io/en/support/
- 社区论坛：https://github.com/AgoraIO

## 🔄 从演示版本切换到真实版本

### 1. 更新导入
在 `src/pages/Tutoring.jsx` 和 `src/pages/TutorDashboard.jsx` 中：

```javascript
// 替换这行
import VideoCall from '../components/VideoCall'

// 改为
import RealVideoCall from '../components/RealVideoCall'
```

### 2. 更新组件使用
```javascript
// 替换VideoCall组件
<RealVideoCall
  isOpen={showVideoCall}
  onClose={() => {
    setShowVideoCall(false)
    setVideoCallSession(null)
  }}
  sessionData={videoCallSession}
  user={user}
/>
```

### 3. 测试功能
- 确保Agora App ID配置正确
- 测试两个用户之间的真实视频通话
- 验证音视频控制和挂断功能

## ✅ 完成检查清单
- [ ] Agora账户注册完成
- [ ] 项目创建并获取App ID
- [ ] 环境变量配置完成
- [ ] 代码更新完成
- [ ] 本地测试通过
- [ ] 生产环境部署
- [ ] 真实用户测试完成

---

**注意**：在生产环境中，强烈建议使用Token认证来确保安全性。演示版本仅用于开发测试，不适合生产使用。
