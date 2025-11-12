# 📧 日历事件提醒功能测试指南

## 🎯 测试方法

### 方法 1：使用页面上的测试按钮（推荐）

1. **打开 Calendar 页面**
   - 登录你的账号
   - 导航到 Calendar 页面

2. **点击测试按钮**
   - 在页面顶部的 Hero section 中，你会看到一个 **"测试提醒功能"** 按钮
   - 点击这个按钮，系统会立即检查所有符合条件的事件并发送提醒

3. **查看测试结果**
   - 按钮旁边会显示测试结果：
     - ✅ 绿色：成功发送提醒
     - ❌ 红色：测试失败或出错
   - 结果会显示发送了多少个提醒邮件

4. **检查控制台日志**
   - 打开浏览器开发者工具（F12）
   - 查看 Console 标签页
   - 你会看到详细的日志信息，包括：
     - `📧 Sending event reminder email...` - 正在发送提醒
     - `✅ Event reminder sent for: [事件标题]` - 成功发送
     - `Reminder already sent today for event: [事件标题]` - 今天已发送过

---

### 方法 2：创建测试事件

#### 快速测试（推荐）

1. **创建一个明天的事件**
   - 点击 "Add Event" 按钮
   - 填写事件信息：
     - **Title**: "测试提醒事件"
     - **Time**: 任意时间（如 "14:00"）
     - **Type**: 任意类型
     - **Reminder Days Before**: 选择 **"1 day before"**
     - **Description**: 可选
   - 将日期选择为 **明天**
   - 点击 "Add Event" 保存

2. **立即测试**
   - 点击页面上的 **"测试提醒功能"** 按钮
   - 系统会检查并发送提醒邮件

3. **检查邮箱**
   - 打开你的邮箱（注册时使用的邮箱地址）
   - 查看收件箱，应该会收到一封提醒邮件
   - 如果没收到，检查垃圾邮件文件夹

#### 详细测试步骤

**测试场景 1：提前 1 天提醒**
1. 创建一个事件，日期设置为明天
2. 设置 "Reminder Days Before" 为 **1 day before**
3. 点击 "测试提醒功能" 按钮
4. 应该会收到提醒邮件

**测试场景 2：提前 2 天提醒**
1. 创建一个事件，日期设置为后天
2. 设置 "Reminder Days Before" 为 **2 days before**
3. 点击 "测试提醒功能" 按钮
4. 应该会收到提醒邮件

**测试场景 3：提前 3 天提醒**
1. 创建一个事件，日期设置为 3 天后
2. 设置 "Reminder Days Before" 为 **3 days before**
3. 点击 "测试提醒功能" 按钮
4. 应该会收到提醒邮件

**测试场景 4：提前 1 周提醒**
1. 创建一个事件，日期设置为 7 天后
2. 设置 "Reminder Days Before" 为 **1 week before**
3. 点击 "测试提醒功能" 按钮
4. 应该会收到提醒邮件

**测试场景 5：避免重复发送**
1. 创建一个符合条件的事件
2. 点击 "测试提醒功能" 按钮（第一次）
3. 应该会收到邮件
4. 再次点击 "测试提醒功能" 按钮（第二次）
5. 不应该收到重复邮件（控制台会显示 "Reminder already sent today"）

---

## 🔍 如何验证功能是否正常工作

### ✅ 成功标志

1. **测试按钮显示成功**
   - 点击测试按钮后，显示绿色成功消息
   - 消息显示 "已发送 X 个提醒邮件"

2. **控制台日志正常**
   - 打开浏览器控制台（F12）
   - 看到 `📧 Sending event reminder email...` 日志
   - 看到 `✅ Event reminder sent for: [事件标题]` 日志

3. **收到邮件**
   - 检查注册邮箱的收件箱
   - 邮件主题应该包含事件标题
   - 邮件内容应该包含：
     - 事件标题
     - 事件日期（格式：Monday, January 15, 2024）
     - 事件时间
     - 事件类型
     - 提醒天数

### ❌ 失败标志

1. **测试按钮显示错误**
   - 显示红色错误消息
   - 消息可能包含错误原因

2. **控制台显示错误**
   - 看到 `Error sending event reminder:` 或类似错误
   - 检查错误信息以了解问题

3. **常见错误原因**
   - EmailJS 模板配置不正确
   - EmailJS Service ID 或 Template ID 错误
   - 用户邮箱地址无效
   - 网络连接问题

---

## 🛠️ 调试技巧

### 1. 检查 EmailJS 配置

确保 `src/config/emailjs.js` 中的配置正确：
```javascript
export const emailjsConfig = {
  publicKey: 'q3eK04PCYjcxxpUzh',
  serviceId: 'service_wx8tfa8',
  eventReminderTemplateId: 'template_5fhs9v8', // 确保这个 ID 正确
}
```

### 2. 检查 EmailJS 模板

在 EmailJS Dashboard 中检查模板 `template_5fhs9v8`：
- 确保模板包含所有必需的变量：
  - `{{to_email}}`
  - `{{to_name}}`
  - `{{event_title}}`
  - `{{event_date}}`
  - `{{event_time}}`
  - `{{event_type}}`
  - `{{reminder_days}}`
  - `{{event_subject}}` (可选)
  - `{{event_description}}` (可选)

### 3. 检查 Firestore 数据

在 Firebase Console 中检查：
- `users/{userId}/calendarEvents` - 确保事件已保存
- `users/{userId}/calendarEvents/{eventId}/reminders/sent` - 检查提醒发送记录

### 4. 检查浏览器控制台

打开开发者工具（F12），查看 Console 标签页：
- 查看所有日志信息
- 查找错误信息
- 检查网络请求（Network 标签页）

---

## 📝 测试清单

- [ ] 创建测试事件（明天，1 day before）
- [ ] 点击 "测试提醒功能" 按钮
- [ ] 检查测试结果消息
- [ ] 检查浏览器控制台日志
- [ ] 检查邮箱收件箱
- [ ] 检查垃圾邮件文件夹
- [ ] 验证邮件内容正确
- [ ] 测试重复发送保护（同一天不重复发送）
- [ ] 测试不同提醒天数（1天、2天、3天、1周）
- [ ] 测试不同事件类型

---

## 🚨 常见问题

### Q: 点击测试按钮后没有收到邮件？
**A:** 
1. 检查邮箱地址是否正确（注册时使用的邮箱）
2. 检查垃圾邮件文件夹
3. 检查浏览器控制台的错误信息
4. 确认 EmailJS 模板配置正确

### Q: 测试按钮显示 "已发送 0 个提醒邮件"？
**A:**
1. 检查是否有符合条件的事件（日期和提醒天数匹配）
2. 确保事件日期是未来日期
3. 确保 `reminderDays` 设置正确
4. 检查事件是否已保存到 Firestore

### Q: 控制台显示 "Reminder already sent today"？
**A:**
这是正常行为，系统会防止同一天重复发送同一事件的提醒。如果你想重新测试：
1. 删除 Firestore 中的提醒记录：`users/{userId}/calendarEvents/{eventId}/reminders/sent`
2. 或者创建一个新的事件

### Q: 如何清除提醒发送记录？
**A:**
在 Firebase Console 中：
1. 导航到 `users/{userId}/calendarEvents/{eventId}/reminders/sent`
2. 删除这个文档
3. 重新测试

---

## 📞 需要帮助？

如果测试过程中遇到问题：
1. 检查浏览器控制台的错误信息
2. 检查 EmailJS Dashboard 的发送日志
3. 检查 Firebase Console 的数据
4. 提供详细的错误信息和截图

---

**最后更新**: 2024年1月

