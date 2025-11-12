# Studiply Launcher

一个简单的macOS应用，用于启动Studiply Web应用。

## 功能特性

- ✅ **一键启动** - 点击图标直接打开Web应用
- ✅ **原生体验** - 提供macOS原生窗口和界面
- ✅ **加载状态** - 显示加载动画和错误处理
- ✅ **网络检测** - 自动检测网络连接状态
- ✅ **开发者工具** - 内置Web开发者工具支持

## 系统要求

- macOS 13.0 或更高版本
- Xcode 15.0 或更高版本（用于构建）

## 构建和运行

1. 打开 `StudiplyLauncher.xcodeproj`
2. 选择目标设备或模拟器
3. 按 `Cmd + R` 运行应用

## 技术栈

- **SwiftUI** - 用户界面框架
- **WebKit** - Web内容渲染
- **Combine** - 响应式编程

## 项目结构

```
StudiplyLauncher/
├── StudiplyLauncherApp.swift    # 应用入口点
├── ContentView.swift            # 主界面
├── Assets.xcassets/            # 应用资源
├── Info.plist                  # 应用配置
└── StudiplyLauncher.entitlements # 权限配置
```

## 许可证

Copyright © 2025 Ken Lin. All rights reserved.
