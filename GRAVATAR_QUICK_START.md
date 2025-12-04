# 🚀 Gravatar 快速开始指南

## 📝 简单 3 步设置头像

### 步骤 1: 注册 Gravatar 账户

1. **访问 Gravatar 网站**
   - 打开 [https://gravatar.com](https://gravatar.com)
   - 点击右上角 "Sign In" 或 "Create Your Gravatar"

2. **注册账户**
   - 如果已有 WordPress.com 账户，直接登录
   - 如果没有，点击 "Create Account" 注册
   - 使用你的邮箱地址注册（建议使用 `no-reply@studiply.it`）

### 步骤 2: 上传头像

1. **登录后，点击 "Add a new image"**
   - 在 Gravatar 主页，点击左侧菜单或页面上的 "Add a new image"

2. **选择上传方式**
   - **方式 1**：从电脑上传（推荐）
     - 点击 "Upload new"
     - 选择你的 Studiply Logo 图片
   - **方式 2**：从 URL 导入
     - 输入图片 URL（如 `https://www.studiply.it/studiply-logo.png`）

3. **裁剪和调整**
   - 调整图片大小和位置
   - 点击 "Crop and Finish"

4. **选择评级**
   - 选择 **G（通用）** - 最安全，所有邮件客户端都支持
   - 点击 "Set Rating"

### 步骤 3: 关联邮箱地址

**⚠️ 重要提示**：Gravatar 需要向每个邮箱地址发送验证邮件。只有**可以接收邮件的真实邮箱地址**才能添加。

1. **添加邮箱地址**
   - 在 Gravatar 主页，点击 "My Gravatars"
   - 点击 "Add email address"
   - **只添加可以接收邮件的邮箱地址**（一次一个）
   - 例如：`no-reply@studiply.it`（如果该邮箱可以接收邮件）

2. **接收验证邮件**
   - Gravatar 会向该邮箱发送验证邮件
   - 登录该邮箱，点击验证链接
   - 验证成功后，邮箱地址才会被添加

3. **为每个邮箱选择头像**
   - 点击每个已验证的邮箱地址
   - 选择你刚才上传的头像
   - 点击 "Confirm"

**💡 如果某些邮箱地址无法接收邮件**：
- 这些地址可能只是发件别名，不是真实邮箱
- 解决方案：在代码中统一使用一个可以接收邮件的邮箱地址（如 `no-reply@studiply.it`）
- 这样只需要在 Gravatar 中设置这一个邮箱的头像即可

## ✅ 完成！现在等待生效

### 等待时间
- **最快**：5-10 分钟
- **通常**：1-2 小时
- **最慢**：24-48 小时

### 如何测试

#### 方法 1: 使用 Gravatar 测试工具（最快）

1. 访问 [Gravatar 测试页面](https://gravatar.com)
2. 在页面顶部输入你的邮箱地址（如 `no-reply@studiply.it`）
3. 查看是否显示头像

#### 方法 2: 发送测试邮件

1. 在你的应用中触发发送验证码邮件
2. 发送到你的 Gmail 或 Outlook
3. 检查发件人头像是否显示

## 📋 完整检查清单

- [ ] 在 Gravatar 注册账户
- [ ] 上传 Studiply Logo 作为头像
- [ ] 添加 `no-reply@studiply.it` 并关联头像
- [ ] 添加 `change-email@studiply.it` 并关联头像
- [ ] 添加 `calendar@studiply.it` 并关联头像
- [ ] 添加 `notification@studiply.it` 并关联头像
- [ ] 等待 1-2 小时
- [ ] 使用 Gravatar 测试工具验证
- [ ] 发送测试邮件到 Gmail 检查

## 🎨 头像图片要求

### 推荐设置
- **尺寸**：512x512 像素（正方形）
- **格式**：PNG（支持透明背景）或 JPG
- **大小**：小于 2MB
- **内容**：Studiply Logo

### 如何准备图片

如果你有 Studiply Logo：
1. 打开图片编辑软件（如 Photoshop、Canva、在线编辑器）
2. 调整尺寸为 512x512 像素
3. 保存为 PNG 或 JPG 格式
4. 上传到 Gravatar

如果没有现成的 Logo：
- 可以使用文字 Logo
- 或使用简单的品牌标识

## 🔍 验证设置

### 在 Gravatar 中检查

1. 登录 Gravatar
2. 点击 "My Gravatars"
3. 你应该看到所有 4 个邮箱地址：
   - ✅ `no-reply@studiply.it` - 显示头像
   - ✅ `change-email@studiply.it` - 显示头像
   - ✅ `calendar@studiply.it` - 显示头像
   - ✅ `notification@studiply.it` - 显示头像

### 在线测试

访问以下任一工具测试：

1. **Gravatar 官方测试**
   - 访问 [https://gravatar.com](https://gravatar.com)
   - 在页面输入邮箱地址
   - 查看头像预览

2. **第三方测试工具**
   - 搜索 "Gravatar checker" 或 "Gravatar test"
   - 输入邮箱地址查看

## ⚠️ 常见问题

### Q: 头像上传后不显示？

**A: 检查以下几点：**
1. 确认邮箱地址拼写正确（区分大小写）
2. 等待 1-2 小时让缓存更新
3. 确认头像评级为 G（通用）
4. 清除浏览器缓存后重试

### Q: 某些邮箱地址看不到头像？

**A: 可能的原因：**
1. 该邮箱地址还没在 Gravatar 中添加
2. 该邮箱地址还没关联头像
3. 等待时间不够（再等几小时）

### Q: 测试邮件中头像不显示？

**A: 这是正常的：**
1. 邮件客户端缓存可能需要 24-48 小时更新
2. 某些邮件客户端可能不支持 Gravatar
3. 如果收件人将你加入联系人，会使用联系人头像

### Q: 可以更换头像吗？

**A: 可以！**
1. 登录 Gravatar
2. 上传新头像
3. 为所有邮箱地址选择新头像
4. 等待 1-2 小时生效

## 🎯 预期效果

设置完成后：

- ✅ 在 Gmail 中，发件人头像显示为 Studiply Logo
- ✅ 在 Outlook 中，发件人头像显示为 Studiply Logo  
- ✅ 在 Apple Mail 中，发件人头像显示为 Studiply Logo
- ✅ 在 Gravatar 测试工具中，所有邮箱都显示头像

## 📞 需要帮助？

如果遇到问题：

1. **Gravatar 支持**：support@gravatar.com
2. **检查文档**：查看 `GRAVATAR_SETUP_CHECKLIST.md`
3. **等待更长时间**：某些情况下需要 48 小时

---

**提示**：设置一次，永久有效！所有使用这些邮箱地址发送的邮件都会显示头像。

