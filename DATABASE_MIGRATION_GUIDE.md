# 🔄 数据库迁移指南：从 Firebase 迁移到其他数据库

## 📊 当前 Firebase 使用情况

### 使用的 Firebase 服务

1. **Firestore（数据库）** - 主要使用
   - 存储用户数据 (`users` 集合)
   - 存储用户进度 (`studyprogress` 集合)
   - 存储聊天消息、通知、日历事件等
   - 实时监听 (`onSnapshot`)

2. **Firebase Auth（认证）** - 部分使用
   - 某些地方使用 Firebase Auth
   - 但主要使用自定义的 `simpleAuth` 系统

3. **Firebase Admin（后端）** - 后端使用
   - 用于发送 streak 提醒邮件

## ✅ 可以迁移吗？

**完全可以！** 但需要一些工作。

## 🎯 推荐的替代方案

### 方案 1: MongoDB（推荐）⭐

**优势：**
- ✅ 你的后端已经在使用 MongoDB
- ✅ 可以统一前后端数据库
- ✅ 支持实时更新（通过 WebSocket 或轮询）
- ✅ 文档型数据库，迁移相对容易

**需要做的：**
- 将所有 Firestore 操作改为 MongoDB 操作
- 创建数据访问层（抽象数据库操作）
- 实现实时更新机制（WebSocket 或轮询）

### 方案 2: Supabase

**优势：**
- ✅ 类似 Firebase 的 API，迁移相对容易
- ✅ 使用 PostgreSQL（关系型数据库）
- ✅ 内置实时功能
- ✅ 开源，可以自托管

**需要做的：**
- 替换 Firebase SDK 为 Supabase SDK
- 调整数据模型（从 NoSQL 到 SQL）
- 迁移数据

### 方案 3: PostgreSQL + Prisma

**优势：**
- ✅ 强大的关系型数据库
- ✅ Prisma 提供类型安全的 ORM
- ✅ 适合复杂查询

**需要做的：**
- 设计 SQL 数据库架构
- 使用 Prisma 作为 ORM
- 迁移所有数据访问代码

## 📋 需要修改的文件

### 前端服务文件（约 30+ 个文件）

所有在 `src/services/` 目录下的文件：
- `leaderboardService.js`
- `streakService.js`
- `cloudQuestService.js`
- `chatService.js`
- `calendarService.js`
- `friendsService.js`
- `tutorService.js`
- `sessionService.js`
- `notificationService.js`
- `presenceService.js`
- `ratingService.js`
- `skillTreeService.js`
- `userService.js`
- ... 等等

### 前端页面文件（约 20+ 个文件）

所有使用 Firebase 的页面：
- `Rewards.jsx`
- `Header.jsx`
- `Dashboard.jsx`
- `Chat.jsx`
- `Calendar.jsx`
- ... 等等

### 认证相关文件

- `src/firebase/auth.js`
- `src/firebase/simpleAuth.js`
- `src/contexts/SimpleAuthContext.jsx`
- `src/contexts/AuthContext.jsx`

### 后端文件

- `backend/server.js`（Firebase Admin 部分）

## 🛠️ 迁移策略

### 策略 1: 创建数据访问层（推荐）

创建一个抽象层，将所有数据库操作封装起来：

```javascript
// src/services/database.js
class DatabaseService {
  // 统一的接口
  async getUser(userId) { }
  async createUser(userData) { }
  async updateUser(userId, data) { }
  // ... 等等
}

// 然后创建不同的实现
// src/services/database/firebase.js
// src/services/database/mongodb.js
// src/services/database/supabase.js
```

这样，迁移时只需要：
1. 创建新的数据库实现
2. 切换配置
3. 所有服务文件自动使用新数据库

### 策略 2: 逐步迁移

1. **第一阶段**：保持 Firebase，但添加 MongoDB 支持
2. **第二阶段**：逐步将功能迁移到 MongoDB
3. **第三阶段**：完全移除 Firebase

## 💡 推荐方案：MongoDB

### 为什么选择 MongoDB？

1. **后端已在使用**：你的 `backend/server.js` 已经在使用 MongoDB
2. **统一数据库**：前后端使用同一个数据库，简化架构
3. **迁移相对容易**：从 Firestore（NoSQL）到 MongoDB（NoSQL）相对简单

### 迁移步骤

#### 步骤 1: 创建数据访问层

创建统一的数据库接口，所有服务通过这个接口访问数据。

#### 步骤 2: 实现 MongoDB 版本

实现 MongoDB 版本的数据访问层。

#### 步骤 3: 创建 API 端点

在后端创建 REST API 或 GraphQL API，前端通过 API 访问数据。

#### 步骤 4: 逐步迁移服务

一个服务一个服务地迁移，确保每个功能都正常工作。

#### 步骤 5: 数据迁移

将现有 Firebase 数据导出并导入到 MongoDB。

## ⚠️ 注意事项

### 实时更新

Firebase 的 `onSnapshot` 提供实时更新。迁移后需要：
- **MongoDB**: 使用 WebSocket 或轮询
- **Supabase**: 使用 Supabase 的实时功能
- **PostgreSQL**: 使用 WebSocket 或轮询

### 认证系统

如果使用 Firebase Auth，需要：
- 迁移到自定义 JWT 认证（你已经部分实现了）
- 或使用其他认证服务（Auth0、Clerk 等）

### 数据迁移

需要编写脚本将 Firebase 数据导出并导入到新数据库。

## 📊 工作量估算

- **小型迁移**（只迁移部分功能）：1-2 周
- **完整迁移**（迁移所有功能）：4-8 周
- **使用数据访问层**：可以分阶段迁移，降低风险

## 🚀 快速开始建议

如果你想迁移到 MongoDB：

1. **先创建数据访问层**（抽象层）
2. **实现 MongoDB 版本**
3. **创建后端 API**
4. **逐步迁移服务**

这样可以：
- ✅ 降低风险（可以逐步迁移）
- ✅ 保持系统运行（Firebase 和新数据库可以并存）
- ✅ 便于测试（可以对比两个数据库的结果）

---

**总结**：完全可以迁移，但需要一些工作。推荐使用 MongoDB，因为你的后端已经在使用它。建议创建数据访问层来简化迁移过程。

