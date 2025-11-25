# 📱 HƯỚNG DẪN CHẠY ỨNG DỤNG

## 🚀 KHỞI ĐỘNG NHANH (Khuyên dùng)

### Chạy tất cả cùng lúc:
```powershell
cd "d:\CNPM NC\CNPM\CNPM"
.\start.ps1
```

### Dừng tất cả:
```powershell
.\stop.ps1
```

**Truy cập:**
- 💻 Localhost: http://localhost:3000
- 📱 Điện thoại: http://10.21.15.57:8080

---

## 🔧 KHỞI ĐỘNG THỦ CÔNG

### Chỉ chạy localhost:
```powershell
cd "d:\CNPM NC\CNPM\CNPM\ProjectCNPM"
npm run start:local
```

### Chỉ chạy cho mạng LAN:
```powershell
cd "d:\CNPM NC\CNPM\CNPM\ProjectCNPM"
npm run build:network
npm run serve
```

---

## 📱 TRUY CẬP TỪ ĐIỆN THOẠI

### Yêu cầu:
1. ✅ Điện thoại và máy tính phải **cùng mạng WiFi** (đang dùng: 10.21.x.x)
2. ✅ Tắt Firewall hoặc cho phép port 3000 và 5001

### Bước 1: Kiểm tra Firewall
Chạy lệnh sau trong PowerShell (Admin):
```powershell
# Cho phép port 3000 (Frontend)
New-NetFirewallRule -DisplayName "React Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Cho phép port 5001 (Backend)
New-NetFirewallRule -DisplayName "Node Backend" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow
```

### Bước 2: Mở trình duyệt trên điện thoại
Nhập địa chỉ: **http://10.21.15.57:3000**

---

## 🔧 NẾU ĐỔI IP MÁY TÍNH

Nếu IP máy tính thay đổi, cập nhật 2 file:

### 1. Backend (.env)
```
DB_HOST=DESKTOP-R7C4RRK\\SEVER01
DB_USER=sa
DB_PASSWORD=123456
DB_DATABASE=SkyPremier2
```

### 2. Frontend (.env)
```
HOST=0.0.0.0
REACT_APP_API_URL=http://[IP_MỚI]:5001
```

### 3. Frontend config (src/config/api.js)
```javascript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://[IP_MỚI]:5001';
```

### 4. Backend (server.js) - dòng cuối
```javascript
console.log(`📱 Để truy cập từ điện thoại, dùng: http://[IP_MỚI]:${port}`);
```

---

## 🧪 KIỂM TRA KẾT NỐI

### Từ máy tính:
```bash
curl http://localhost:5001/api/flights/popular
curl http://10.21.15.57:5001/api/flights/popular
```

### Từ điện thoại:
Mở trình duyệt và truy cập:
- Backend API: http://10.21.15.57:5001/api/flights/popular
- Frontend: http://10.21.15.57:3000

---

## ⚠️ LƯU Ý

1. Đảm bảo cả 2 thiết bị cùng mạng WiFi
2. Tắt VPN nếu có
3. Kiểm tra Firewall Windows
4. Nếu không kết nối được, thử tắt Firewall tạm thời để test

---

## 📋 DANH SÁCH FILE ĐÃ CẬP NHẬT

✅ Backend:
- backend/server.js (lắng nghe trên 0.0.0.0)
- backend/.env (cấu hình SQL Server)

✅ Frontend:
- ProjectCNPM/.env (HOST=0.0.0.0)
- ProjectCNPM/src/config/api.js (API URL config)
- ProjectCNPM/src/pages/Login.jsx
- ProjectCNPM/src/pages/Signup.jsx
- ProjectCNPM/src/pages/SearchFlight.jsx
- ProjectCNPM/src/pages/PopularFlight.jsx
- ProjectCNPM/src/pages/PaymentPage.jsx
- ProjectCNPM/src/components/PopularFlights.jsx
- ProjectCNPM/src/components/admin/AccountManagementPage.jsx

---

## 🎉 HOÀN TẤT!

Giờ bạn có thể truy cập ứng dụng từ điện thoại!
