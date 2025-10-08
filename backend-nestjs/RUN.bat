@echo off
echo ========================================
echo  E-Commerce Platform - Backend Server
echo ========================================
echo.
echo Starting NestJS server...
echo.
echo Press Ctrl+C to stop the server
echo.

cd /d %~dp0
call npm run start:dev

