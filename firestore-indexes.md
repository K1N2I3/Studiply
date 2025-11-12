# 🔥 Firestore 索引配置指南

为了确保Friends和Chat功能正常工作，需要在Firebase控制台中创建以下索引：

## 📋 必需的索引

### 1. friendRequests 集合索引

**集合**: `friendRequests`

**索引配置**:
```
字段: toUserId (升序)
字段: status (升序) 
字段: createdAt (降序)
```

**用途**: 用于获取特定用户的朋友请求，按状态过滤并按时间排序

### 2. messages 集合索引

**集合**: `messages`

**索引配置**:
```
字段: senderId (升序)
字段: receiverId (升序)
字段: timestamp (升序)
```

**用途**: 用于获取两个用户之间的聊天消息，按时间排序

## 🚀 如何创建索引

### 方法1: 自动创建（推荐）
1. 访问 [Firebase控制台](https://console.firebase.google.com)
2. 选择项目：**study-hub-1297a**
3. 进入 **Firestore Database** → **Indexes**
4. 当应用运行时，Firebase会自动提示创建缺失的索引
5. 点击提示中的链接自动创建

### 方法2: 手动创建
1. 在Firebase控制台中进入 **Firestore Database** → **Indexes**
2. 点击 **"Create Index"**
3. 选择集合名称
4. 添加字段并设置排序顺序
5. 点击 **"Create"**

## ⚡ 临时解决方案

如果不想创建复合索引，代码已经修改为使用简化的查询：

- **朋友请求**: 只按 `toUserId` 查询，然后在代码中过滤状态
- **聊天消息**: 分别查询两个方向的消息，然后在代码中合并

这样可以避免复杂的复合索引，但性能可能稍低。

## 🔧 索引创建链接

如果Firebase提示创建索引，可以直接点击以下链接：

**朋友请求索引**:
```
https://console.firebase.google.com/v1/r/project/study-hub-1297a/firestore/indexes?create_composite=ClZwcm9qZWN0cy9zdHVkeS1odWItMTI5N2EvZGF0YWJhc2VzLyhkZWZhdWx0KS9jb2xsZWN0aW9uR3JvdXBzL2ZyaWVuZFJlcXVlc3RzL2luZGV4ZXMvXxABGgoKBnN0YXR1cxABGgwKCHRvVXNlcklkEAEaDQoJY3JlYXRlZEF0EAIaDAoIX19uYW1lX18QAg
```

## ✅ 验证索引

创建索引后，Friends和Chat功能应该可以正常工作，不再出现索引错误。
