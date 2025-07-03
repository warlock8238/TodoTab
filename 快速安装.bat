@echo off
chcp 65001 >nul
echo ========================================
echo           待办提醒助手 - 快速安装
echo ========================================
echo.
echo 正在打开Chrome扩展管理页面...
echo.
echo 安装步骤：
echo 1. 在打开的页面中开启"开发者模式"
echo 2. 点击"加载已解压的扩展程序"
echo 3. 选择当前文件夹："%~dp0"
echo 4. 插件安装完成！
echo.
echo 如果Chrome没有自动打开，请手动访问：
echo chrome://extensions/
echo.
pause
start chrome "chrome://extensions/" 