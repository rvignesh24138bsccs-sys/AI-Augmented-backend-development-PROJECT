@echo off
title FitTrack AI - Starting Servers
echo ========================================================
echo   Starting FitTrack AI (Backend Port 5000 + Frontend Port 3000)
echo ========================================================
echo Freeing port 5000 and 3000...
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":5000"') do taskkill /f /pid %%a >nul 2>&1
for /f "tokens=5" %%a in ('netstat -aon ^| findstr ":3000"') do taskkill /f /pid %%a >nul 2>&1
echo Ports ready!
echo Starting full app...
npm run dev
pause
