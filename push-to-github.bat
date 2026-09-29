@echo off
title Push ERP FBD to GitHub
cd /d "%~dp0"
set "PATH=%LOCALAPPDATA%\Programs\Git\cmd;%PATH%"

echo ========================================================
echo   Push ERP Project to GitHub (VAISHNAV-IDEAPAD/erp_fbd)
echo ========================================================
echo.

set "REPO_URL=https://github.com/VAISHNAV-IDEAPAD/erp_fbd.git"

echo Adding changes...
git add .

set /p COMMIT_MSG="Enter commit message (or press Enter for 'Update ERP'): "
if "%COMMIT_MSG%"=="" set "COMMIT_MSG=Update ERP"

git commit -m "%COMMIT_MSG%"

echo.
echo Ensuring remote origin: %REPO_URL%
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo Pushing main branch to GitHub...
git branch -M main
git push -u origin main

echo.
if %ERRORLEVEL% equ 0 (
    echo [SUCCESS] Code successfully pushed to GitHub!
    echo Vercel will automatically trigger a new deployment.
) else (
    echo [ERROR] Push failed. Please check network connection or credentials.
)

pause
