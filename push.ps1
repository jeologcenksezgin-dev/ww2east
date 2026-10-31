param(
    [string]$Message = ""
)

Write-Host "====================================================" -ForegroundColor Cyan
Write-Host " WW2 East Front - GitHub Otomatik Guncelleme" -ForegroundColor Yellow
Write-Host "====================================================" -ForegroundColor Cyan

if (-not $Message) {
    $Message = "Guncelleme: " + (Get-Date -Format "yyyy-MM-dd HH:mm:ss")
}

git add .
git commit -m $Message
Write-Host "`nGitHub deposuna gonderiliyor (origin main)..." -ForegroundColor Green
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n[BASARILI] Degisiklikler basariyla GitHub'a push edildi!" -ForegroundColor Green
} else {
    Write-Host "`n[UYARI] Push sirasinda kimlik dogrulama (GitHub Sign-In) gerekebilir." -ForegroundColor Yellow
}
