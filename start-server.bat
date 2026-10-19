@echo off
chcp 65001 >nul
title FlashLearn - Japanese Full-stack Server (FastAPI + SQLite + Edge-TTS)
echo ========================================================
echo   FlashLearn - Web Flashcard Tieng Nhat Full-Stack
echo ========================================================
echo.
echo [1/3] Kiem tra moi truong Python...

where py >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=py
    goto CHECK_DEPS
)

where python >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=python
    goto CHECK_DEPS
)

echo [LOI] Khong tim thay Python tren may cua ban!
echo Vui long cai dat Python tai https://www.python.org/downloads/
echo Hoac dam bao Python da duoc tich vao o 'Add Python to PATH' khi cai dat.
pause
exit /b 1

:CHECK_DEPS
echo [2/3] Kiem tra thu vien phan mem can thiet...
%PY_CMD% -c "import fastapi, uvicorn, edge_tts" >nul 2>nul
if %errorlevel% neq 0 (
    echo Dang tu dong cai dat thu vien (fastapi, uvicorn, edge-tts)...
    %PY_CMD% -m pip install -r requirements.txt
)

:RUN
echo [3/3] Dang khoi chay FlashLearn Full-stack Server tren http://localhost:8000 ...
start "" http://localhost:8000
%PY_CMD% server.py
pause
