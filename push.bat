@echo off
chcp 65001 >nul
echo ====================================================
echo  WW2 East Front - GitHub Otomatik Guncelleme
echo ====================================================

git add .

if "%~1"=="" (
    set "COMMIT_MSG=Guncelleme: %date% %time%"
) else (
    set "COMMIT_MSG=%~1"
)

git commit -m "%COMMIT_MSG%"

echo.
echo GitHub deposuna gonderiliyor...
git push origin main

if %errorlevel% equ 0 (
    echo.
    echo [BASARILI] Degisiklikler basariyla GitHub'a gonderildi!
) else (
    echo.
    echo [BILGI] Push basarisiz oldu. Lutfen kimlik dogrulamasini (GitHub Login) kontrol edin.
)
pause
