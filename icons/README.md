# 图标文件说明

## 需要的图标文件

Chrome插件需要以下尺寸的PNG图标文件：

- `icon16.png` - 16x16 像素
- `icon48.png` - 48x48 像素  
- `icon128.png` - 128x128 像素

## 如何创建图标

### 方法一：使用在线工具

1. 访问在线SVG转PNG工具，如：
   - https://convertio.co/svg-png/
   - https://cloudconvert.com/svg-to-png
   - https://www.svgviewer.dev/

2. 上传 `icon.svg` 文件
3. 分别设置输出尺寸为 16x16、48x48、128x128
4. 下载生成的PNG文件并重命名

### 方法二：使用图像编辑软件

1. 使用 Photoshop、GIMP、Inkscape 等软件
2. 打开 `icon.svg` 文件
3. 分别导出为不同尺寸的PNG文件

### 方法三：使用命令行工具

如果你安装了 ImageMagick：

```bash
# 安装 ImageMagick
# Windows: 下载安装包
# macOS: brew install imagemagick
# Linux: sudo apt-get install imagemagick

# 转换图标
convert icon.svg -resize 16x16 icon16.png
convert icon.svg -resize 48x48 icon48.png
convert icon.svg -resize 128x128 icon128.png
```

### 方法四：使用简单的纯色图标

如果不想使用复杂图标，可以创建简单的纯色图标：

```html
<!-- 16x16 简单图标 -->
<svg width="16" height="16" viewBox="0 0 16 16">
  <rect width="16" height="16" fill="#667eea"/>
  <text x="8" y="12" text-anchor="middle" fill="white" font-size="12">✓</text>
</svg>

<!-- 48x48 简单图标 -->
<svg width="48" height="48" viewBox="0 0 48 48">
  <rect width="48" height="48" fill="#667eea"/>
  <text x="24" y="32" text-anchor="middle" fill="white" font-size="24">✓</text>
</svg>

<!-- 128x128 简单图标 -->
<svg width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" fill="#667eea"/>
  <text x="64" y="80" text-anchor="middle" fill="white" font-size="64">✓</text>
</svg>
```

## 图标要求

- 格式：PNG
- 背景：透明或纯色
- 清晰度：高清晰度，避免模糊
- 风格：简洁明了，易于识别

## 临时解决方案

如果暂时没有图标文件，插件仍然可以正常工作，只是会显示默认的Chrome扩展图标。你可以稍后再添加自定义图标。 