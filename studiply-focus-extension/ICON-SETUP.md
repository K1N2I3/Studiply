# 🎨 图标设置说明

## 问题解决

如果遇到 "Could not load icon" 错误，请按以下步骤操作：

### 方法1：使用在线图标生成器（推荐）

1. 访问 [Favicon Generator](https://www.favicon-generator.org/)
2. 上传一个简单的图片或使用文字生成器
3. 下载生成的图标包
4. 将以下文件复制到 `icons/` 文件夹：
   - `favicon-16x16.png` → 重命名为 `icon16.png`
   - `favicon-32x32.png` → 重命名为 `icon48.png` 
   - `favicon-96x96.png` → 重命名为 `icon128.png`

### 方法2：使用现有图标

1. 从网上下载任何16x16、48x48、128x128的PNG图标
2. 重命名为 `icon16.png`、`icon48.png`、`icon128.png`
3. 放入 `icons/` 文件夹

### 方法3：临时移除图标（快速解决）

如果急需测试，可以临时移除图标要求：

1. 编辑 `manifest.json`
2. 删除以下部分：
```json
"icons": {
  "16": "icons/icon16.png",
  "48": "icons/icon48.png", 
  "128": "icons/icon128.png"
}
```

### 方法4：使用emoji作为图标

1. 创建一个简单的HTML文件：
```html
<!DOCTYPE html>
<html>
<body>
    <canvas id="canvas" width="16" height="16"></canvas>
    <script>
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        ctx.font = '14px Arial';
        ctx.fillText('🎯', 0, 14);
        const link = document.createElement('a');
        link.download = 'icon16.png';
        link.href = canvas.toDataURL();
        link.click();
    </script>
</body>
</html>
```

2. 在浏览器中打开，会自动下载图标
3. 重复此过程创建48x48和128x128版本

## 验证安装

图标设置完成后：

1. 重新加载扩展程序
2. 检查扩展程序列表中是否显示图标
3. 确认没有错误信息

---

**注意**：图标不是必需的，扩展程序在没有图标的情况下也能正常工作，只是看起来不够专业。
