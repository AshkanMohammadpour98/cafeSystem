@echo off
cd /d %~dp0

echo --------------------------------------
echo Starting your Next.js project...
echo --------------------------------------

start cmd /k "npm run dev"
start cmd /k "npm run json-server"

timeout /t 3 >nul

REM باز کردن مرورگر در آدرس localhost:3000
start http://localhost:3000

pause
