@echo off
title UTMCC - UTM Course Craft
cd /d "%~dp0"
echo ===================================================
echo            UTMCC - UTM Course Craft
echo ===================================================
echo Starting local web server on port 8080...
echo Opening browser to http://localhost:8080 ...
echo.
echo (Keep this window open while playing! Press Ctrl+C to stop.)
echo ===================================================

start "" "http://localhost:8080"

where py >nul 2>nul
if %errorlevel% equ 0 (
    py -m http.server 8080
) else (
    python -m http.server 8080
)

pause
