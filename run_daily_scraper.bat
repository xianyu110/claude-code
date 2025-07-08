@echo off
echo ====================================
echo    小红书AI话题每日采集系统
echo ====================================
echo.

REM 切换到脚本所在目录
cd /d "%~dp0"

REM 设置环境变量
set NODE_ENV=production

REM 记录开始时间
echo [%date% %time%] 开始执行每日AI话题采集任务

REM 运行Node.js脚本
node daily_ai_scraper.js

REM 检查执行结果
if %ERRORLEVEL% EQU 0 (
    echo [%date% %time%] 任务执行成功
) else (
    echo [%date% %time%] 任务执行失败，错误代码: %ERRORLEVEL%
)

echo.
echo ====================================
echo            任务完成
echo ====================================

REM 如果是手动运行，等待用户按键
if "%1" NEQ "auto" (
    pause
) 