# Script tự động cấu hình SQL Server cho mạng LAN
# Chạy với quyền Administrator

Write-Host "=== CAU HINH SQL SERVER CHO MANG LAN ===" -ForegroundColor Cyan
Write-Host ""

# 1. Bật TCP/IP cho SQL Server instance SEVER01
Write-Host "[1/5] Bat TCP/IP protocol..." -ForegroundColor Yellow

# Import SQL Server WMI Provider
$null = [System.Reflection.Assembly]::LoadWithPartialName('Microsoft.SqlServer.SqlWmiManagement')

try {
    $smo = New-Object Microsoft.SqlServer.Management.Smo.Wmi.ManagedComputer
    $instance = $smo.ServerInstances['SEVER01']
    
    if ($instance) {
        $tcp = $instance.ServerProtocols['Tcp']
        
        if ($tcp.IsEnabled -eq $false) {
            $tcp.IsEnabled = $true
            $tcp.Alter()
            Write-Host "   Da bat TCP/IP protocol" -ForegroundColor Green
        } else {
            Write-Host "   TCP/IP da duoc bat san" -ForegroundColor Green
        }
        
        # Đặt port 1433
        foreach ($ipAddress in $tcp.IPAddresses) {
            if ($ipAddress.Name -eq 'IPAll') {
                $ipAddress.IPAddressProperties['TcpDynamicPorts'].Value = ''
                $ipAddress.IPAddressProperties['TcpPort'].Value = '1433'
                Write-Host "   Da dat port 1433 cho IPAll" -ForegroundColor Green
            }
        }
        $tcp.Alter()
    } else {
        Write-Host "   Khong tim thay instance SEVER01" -ForegroundColor Red
    }
} catch {
    Write-Host "   Loi: $_" -ForegroundColor Red
    Write-Host "   Ban can mo SQL Server Configuration Manager thu cong:" -ForegroundColor Yellow
    Write-Host "   1. Nhan Windows + R" -ForegroundColor White
    Write-Host "   2. Go: compmgmt.msc" -ForegroundColor White
    Write-Host "   3. Services and Applications > SQL Server Configuration Manager" -ForegroundColor White
}

# 2. Restart SQL Server service
Write-Host ""
Write-Host "[2/5] Khoi dong lai SQL Server service..." -ForegroundColor Yellow
try {
    Restart-Service -Name "MSSQL`$SEVER01" -Force -ErrorAction Stop
    Write-Host "   Da khoi dong lai SQL Server" -ForegroundColor Green
} catch {
    Write-Host "   Loi khoi dong lai service: $_" -ForegroundColor Red
}

Start-Sleep -Seconds 3

# 3. Mở firewall
Write-Host ""
Write-Host "[3/5] Mo firewall cho port 1433..." -ForegroundColor Yellow
New-NetFirewallRule -DisplayName "SQL Server TCP/IP" -Direction Inbound -LocalPort 1433 -Protocol TCP -Action Allow -ErrorAction SilentlyContinue
Write-Host "   Da mo firewall port 1433" -ForegroundColor Green

# 4. Enable SQL Server Authentication
Write-Host ""
Write-Host "[4/5] Bat SQL Server Authentication..." -ForegroundColor Yellow
Write-Host "   Can thuc hien thu cong trong SSMS:" -ForegroundColor Yellow
Write-Host "   1. Ket noi SSMS voi Windows Authentication" -ForegroundColor White
Write-Host "   2. Right-click Server > Properties > Security" -ForegroundColor White
Write-Host "   3. Chon: SQL Server and Windows Authentication mode" -ForegroundColor White
Write-Host "   4. Click OK va restart SQL Server" -ForegroundColor White

# 5. Enable SA login
Write-Host ""
Write-Host "[5/5] Kich hoat login 'sa'..." -ForegroundColor Yellow
$sqlCmd = @"
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = '123456';
USE SkyPremier2;
GRANT CONNECT TO sa;
"@

try {
    Invoke-Sqlcmd -ServerInstance "DESKTOP-R7C4RRK\SEVER01" -Query $sqlCmd -TrustServerCertificate -ErrorAction Stop
    Write-Host "   Da kich hoat va cap nhat password cho 'sa'" -ForegroundColor Green
} catch {
    Write-Host "   Loi: $_" -ForegroundColor Red
    Write-Host "   Ban can chay lenh SQL trong SSMS:" -ForegroundColor Yellow
    Write-Host "   $sqlCmd" -ForegroundColor White
}

Write-Host ""
Write-Host "=== HOAN TAT CAU HINH ===" -ForegroundColor Green
Write-Host ""
Write-Host "Kiem tra ket noi:" -ForegroundColor Cyan
Write-Host "  netstat -ano | Select-String ':1433'" -ForegroundColor White
Write-Host ""
Write-Host "Test tu dien thoai:" -ForegroundColor Cyan
Write-Host "  http://10.21.15.57:5001/api/flights/popular" -ForegroundColor White
Write-Host ""
Write-Host "Nhan Enter de thoat..." -ForegroundColor Gray
Read-Host
