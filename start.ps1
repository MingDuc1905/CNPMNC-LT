# Script khởi động tự động cho dự án Flight Booking
# Chạy cả Backend + Frontend (localhost và LAN)

Write-Host "=== KHOI DONG DU AN FLIGHT BOOKING ===" -ForegroundColor Cyan
Write-Host ""

# Tự động phát hiện IP mạng
$NetworkIP = (Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -like '192.168.*' -or $_.IPAddress -like '10.*' } | Select-Object -First 1).IPAddress
if (-not $NetworkIP) { $NetworkIP = "localhost" }
Write-Host "IP mang hien tai: $NetworkIP" -ForegroundColor Green
Write-Host ""

# Dừng các tiến trình node đang chạy
Write-Host "[1/4] Dung cac tien trinh cu..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Khởi động Backend
Write-Host "[2/4] Khoi dong Backend API (port 5001)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

# Khởi động Frontend (localhost)
Write-Host "[3/4] Khoi dong Frontend localhost (port 3000)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ProjectCNPM'; `$env:REACT_APP_API_URL='http://localhost:5001'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 5

# Build và serve cho mạng LAN
Write-Host "[4/4] Build va serve cho mang LAN (port 8080)..." -ForegroundColor Yellow
cd "$PSScriptRoot\ProjectCNPM"
$env:REACT_APP_API_URL = "http://${NetworkIP}:5001"
npm run build | Out-Null
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ProjectCNPM'; serve -s build -l 8080" -WindowStyle Normal

Start-Sleep -Seconds 3

Write-Host ""
Write-Host "=== HOAN TAT! ===" -ForegroundColor Green
Write-Host ""
Write-Host "Truy cap:" -ForegroundColor Cyan
Write-Host "  - Localhost:        http://localhost:3000" -ForegroundColor White
Write-Host "  - Mang LAN (PC):    http://${NetworkIP}:8080" -ForegroundColor White
Write-Host "  - Mang LAN (Phone): http://${NetworkIP}:8080" -ForegroundColor White
Write-Host "  - Backend API:      http://localhost:5001 hoac http://${NetworkIP}:5001" -ForegroundColor White
Write-Host ""
Write-Host "Nhan Enter de thoat..." -ForegroundColor Gray
Read-Host
