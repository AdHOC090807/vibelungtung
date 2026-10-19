@echo off
chcp 65001 >nul
cd /d "%~dp0"
title FlashLearn - Japanese Full-stack Server (FastAPI + SQLite + Edge-TTS)

echo ========================================================
echo   FlashLearn - Web Flashcard Tieng Nhat Full-Stack
echo ========================================================
echo.
echo [1/3] Dang kiem tra moi truong Python...

REM 1. Thu tim 'py' (Python Launcher tren Windows)
where py >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=py
    goto FOUND_PYTHON
)

REM 2. Thu tim 'python'
where python >nul 2>nul
if %errorlevel% equ 0 (
    set PY_CMD=python
    goto FOUND_PYTHON
)

REM 3. Kiem tra cac thu muc cai dat Python pho bien tren Windows
if exist "%LocalAppData%\Programs\Python\Python313\python.exe" (
    set PY_CMD="%LocalAppData%\Programs\Python\Python313\python.exe"
    goto FOUND_PYTHON
)
if exist "%LocalAppData%\Programs\Python\Python312\python.exe" (
    set PY_CMD="%LocalAppData%\Programs\Python\Python312\python.exe"
    goto FOUND_PYTHON
)
if exist "%LocalAppData%\Programs\Python\Python311\python.exe" (
    set PY_CMD="%LocalAppData%\Programs\Python\Python311\python.exe"
    goto FOUND_PYTHON
)
if exist "%ProgramFiles%\Python313\python.exe" (
    set PY_CMD="%ProgramFiles%\Python313\python.exe"
    goto FOUND_PYTHON
)
if exist "%ProgramFiles%\Python312\python.exe" (
    set PY_CMD="%ProgramFiles%\Python312\python.exe"
    goto FOUND_PYTHON
)

echo.
echo [LOI] Khong tim thay Python tren may tinh cua ban!
echo Vui long cai dat Python tai https://www.python.org/downloads/
echo Hoac tich vao o 'Add python.exe to PATH' khi cai dat.
echo.
pause
exit /b 1

:FOUND_PYTHON
echo [2/3] Kiem tra cac thu vien can thiet...
%PY_CMD% -c "import fastapi, uvicorn, edge_tts" >nul 2>nul
if %errorlevel% neq 0 (
    echo Dang tu dong cai dat cac thu vien con thieu tu requirements.txt...
    %PY_CMD% -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo.
        echo [LOI] Cai dat thu vien that bai! Vui long kiem tra ket noi mang.
        pause
        exit /b 1
    )
)

:RUN
echo [3/3] Dang khoi dong FlashLearn Server va mo trinh duyet Chrome...
echo ========================================================
echo Web dang chay tai: http://localhost:8000
echo Cua so Chrome se tu dong duoc mo sau 1 giay.
echo De tat server, hay nhan to hop phim Ctrl + C trong cua so nay.
echo ========================================================
echo.

%PY_CMD% server.py
if %errorlevel% neq 0 (
    echo.
    echo Server da dung lai.
    pause
)
