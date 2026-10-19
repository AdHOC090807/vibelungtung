@echo off
chcp 65001 >nul
title FlashLearn - ElevenLabs AI Voice Server
echo ========================================================
echo   FlashLearn - Flashcard Voi Giong Doc AI ElevenLabs
echo ========================================================
echo.
echo [1/2] Dang kiem tra moi truong chay Python...

where py >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=py
    goto RUN
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=python
    goto RUN
)

echo [LOI] Khong tim thay Python tren may cua ban!
echo Vui long cai dat Python tai https://www.python.org/downloads/
echo Hoac dam bao Python da duoc tich vao o 'Add Python to PATH' khi cai dat.
pause
exit /b 1

:RUN
echo [2/2] Dang khoi chay FlashLearn Server tren http://localhost:3000 ...
start "" http://localhost:3000
%PY_CMD% server.py
pause
