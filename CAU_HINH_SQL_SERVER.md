# ⚙️ CẤU HÌNH SQL SERVER CHO MẠNG LAN

## ❌ VẤN ĐỀ
Dữ liệu từ điện thoại/thiết bị mạng LAN không lưu vào SQL Server vì:
- SQL Server chỉ chấp nhận kết nối từ localhost
- Chưa bật TCP/IP protocol
- Chưa cấu hình SQL Authentication cho mạng

## ✅ GIẢI PHÁP (Thực hiện theo thứ tự)

### Bước 1: Mở SQL Server Configuration Manager
1. Nhấn `Windows + R`
2. Gõ: `SQLServerManager16.msc` (hoặc 15.msc, 14.msc tùy phiên bản)
3. Click **OK**

### Bước 2: Bật TCP/IP Protocol
1. Trong SQL Server Configuration Manager:
   - Mở: **SQL Server Network Configuration**
   - Chọn: **Protocols for SEVER01** (instance của bạn)
   
2. Tìm **TCP/IP** trong danh sách:
   - Right-click → **Enable**
   
3. Double-click **TCP/IP** → Tab **IP Addresses**:
   - Kéo xuống phần **IPAll**:
     - **TCP Dynamic Ports**: (để trống)
     - **TCP Port**: `1433`
   - Click **OK**

### Bước 3: Restart SQL Server Service
1. Trong SQL Server Configuration Manager:
   - Chọn: **SQL Server Services**
   - Right-click **SQL Server (SEVER01)**
   - Chọn: **Restart**

**Hoặc dùng PowerShell:**
```powershell
Restart-Service -Name "MSSQL$SEVER01" -Force
Write-Host "Da khoi dong lai SQL Server" -ForegroundColor Green
```

### Bước 4: Bật SQL Server Authentication
1. Mở **SQL Server Management Studio (SSMS)**
2. Connect với Windows Authentication
3. Right-click vào **Server name** → **Properties**
4. Chọn tab **Security**:
   - Chọn: **SQL Server and Windows Authentication mode**
   - Click **OK**
5. Restart SQL Server lại (Bước 3)

### Bước 5: Tạo Login cho mạng (nếu cần)
Trong SSMS, chạy query:
```sql
-- Kiểm tra user 'sa' đã enable chưa
ALTER LOGIN sa ENABLE;
ALTER LOGIN sa WITH PASSWORD = '123456';
GO

-- Cấp quyền cho database
USE SkyPremier2;
GO
GRANT CONNECT TO sa;
GO
```

### Bước 6: Test kết nối từ mạng
**Từ máy tính khác hoặc điện thoại**, dùng app database client (như SQL Server Mobile hoặc web tool):
```
Server: 10.21.15.57,1433
Database: SkyPremier2
User: sa
Password: 123456
```

### Bước 7: Kiểm tra Firewall (Đã làm)
✅ Port 1433 đã được mở
✅ Port 5001 (Backend API) đã được mở
✅ Port 8080 (Frontend) đã được mở

---

## 🧪 TEST API TỪ ĐIỆN THOẠI

### Test Backend kết nối SQL Server:
Mở trình duyệt điện thoại, truy cập:
```
http://10.21.15.57:5001/api/flights/popular
```

**Nếu thấy dữ liệu JSON** → SQL Server đã nhận kết nối từ mạng LAN ✅

**Nếu lỗi** → Kiểm tra lại các bước trên

---

## 🔧 SAU KHI CẤU HÌNH XONG

### Khởi động lại toàn bộ:
```powershell
cd "d:\CNPM NC\CNPM\CNPM"
.\stop.ps1
.\start.ps1
```

### Test đăng ký/đăng nhập từ điện thoại:
1. Truy cập: http://10.21.15.57:8080
2. Đăng ký tài khoản mới
3. Kiểm tra trong SSMS:
```sql
USE SkyPremier2;
SELECT * FROM KHACH_HANG ORDER BY MAKH DESC;
```

**Nếu thấy dữ liệu mới** → Hoàn tất! ✅

---

## ⚠️ LƯU Ý

1. **Firewall Windows:** Đã được mở cho port 1433, 5001, 8080
2. **SQL Browser:** Đang chạy (cho phép tìm instance)
3. **IP tĩnh:** Nên đặt IP tĩnh cho máy tính (10.21.15.57) để không đổi
4. **Bảo mật:** Đổi password 'sa' nếu deploy production

---

## 📋 CHECKLIST

- [ ] Mở SQL Server Configuration Manager
- [ ] Enable TCP/IP cho SEVER01 instance
- [ ] Set TCP Port = 1433 trong IPAll
- [ ] Restart SQL Server service
- [ ] Bật SQL Server Authentication mode
- [ ] Enable và set password cho login 'sa'
- [ ] Test kết nối từ điện thoại
- [ ] Khởi động lại ứng dụng với `.\start.ps1`
