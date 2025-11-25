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

# Kill các process đang chiếm port 3000, 5001, 8080
$ports = @(3000, 5001, 8080)
foreach ($port in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    foreach ($conn in $connections) {
        Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}

# Kill tất cả terminal PowerShell cũ (trừ terminal hiện tại)
$currentPID = $PID
Get-Process pwsh -ErrorAction SilentlyContinue | Where-Object { $_.Id -ne $currentPID } | Stop-Process -Force -ErrorAction SilentlyContinue

Write-Host "   Da xoa tat ca process va terminal cu!" -ForegroundColor Green
Start-Sleep -Seconds 3

# Khởi động Backend
Write-Host "[2/4] Khoi dong Backend API (port 5001)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\backend'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 3

# Khởi động Frontend (localhost)
Write-Host "[3/4] Khoi dong Frontend localhost (port 3000)..." -ForegroundColor Yellow
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ProjectCNPM'; `$env:REACT_APP_API_URL='http://localhost:5001'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 5

# Khởi động Frontend cho mạng LAN (port 8080) - TỰ ĐỘNG DETECT IP
Write-Host "[4/4] Khoi dong Frontend LAN (port 8080) - Tu dong detect IP..." -ForegroundColor Yellow
$env:REACT_APP_API_URL = "http://${NetworkIP}:5001"
$env:HOST = "0.0.0.0"
$env:PORT = "8080"
$env:BROWSER = "none"
Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot\ProjectCNPM'; `$env:REACT_APP_API_URL='http://${NetworkIP}:5001'; `$env:HOST='0.0.0.0'; `$env:PORT='8080'; `$env:BROWSER='none'; `$env:CI='true'; npm start" -WindowStyle Normal

Start-Sleep -Seconds 5

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
