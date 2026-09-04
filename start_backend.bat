@echo off
title Kshetrix-AI Backend & Android Bridge Server
color 0A

echo =======================================================
echo    Kshetrix-AI Backend & Android Bridge Service
echo =======================================================
echo.
echo [1/2] Checking Python and ADB...

set "ADB_PATH=%LOCALAPPDATA%\Android\Sdk\platform-tools\adb.exe"

if exist "%ADB_PATH%" (
    echo [OK] Found ADB at: %ADB_PATH%
) else (
    echo [WARNING] ADB not found at standard path. ADB reverse will be skipped.
)

echo.
echo [2/2] Starting Python FastAPI backend on port 8001...
echo       Your OTP emails and API routes will be active!
echo.

:: Start the ADB Reverse watcher in background
start /B "" cmd /c "for /L %%i in (1,0,2) do ( if exist \"%ADB_PATH%\" (\"%ADB_PATH%\" reverse tcp:8001 tcp:8001 >nul 2>&1 ) & timeout /t 3 >nul )"

:: Start Uvicorn Backend
cd /d "%~dp0backend"
python -m uvicorn main:app --host 0.0.0.0 --port 8001 --reload

pause
