# Script dừng tất cả tiến trình

Write-Host "Dang dung tat ca tien trinh..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Write-Host "Da dung!" -ForegroundColor Green
Start-Sleep -Seconds 2
