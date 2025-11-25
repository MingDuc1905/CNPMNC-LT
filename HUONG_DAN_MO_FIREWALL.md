# 🔥 HƯỚNG DẪN MỞ FIREWALL CHO ĐIỆN THOẠI TRUY CẬP

## Cách 1: Dùng PowerShell (Khuyến nghị)

### Bước 1: Mở PowerShell với quyền Administrator
1. Nhấn phím Windows
2. Gõ "PowerShell"
3. Chuột phải vào "Windows PowerShell"
4. Chọn "Run as administrator"

### Bước 2: Chạy lệnh sau
```powershell
# Mở port 3000 cho React Frontend
New-NetFirewallRule -DisplayName "React Dev Server" -Direction Inbound -LocalPort 3000 -Protocol TCP -Action Allow

# Mở port 5001 cho Node Backend
New-NetFirewallRule -DisplayName "Node Backend API" -Direction Inbound -LocalPort 5001 -Protocol TCP -Action Allow
```

---

## Cách 2: Dùng Windows Defender Firewall GUI

### Bước 1: Mở Windows Defender Firewall
1. Nhấn Windows + R
2. Gõ: `wf.msc`
3. Nhấn Enter

### Bước 2: Tạo Inbound Rule cho port 3000
1. Click "Inbound Rules" ở bên trái
2. Click "New Rule..." ở bên phải
3. Chọn "Port" → Next
4. Chọn "TCP" và gõ "3000" → Next
5. Chọn "Allow the connection" → Next
6. Chọn tất cả (Domain, Private, Public) → Next
7. Đặt tên: "React Dev Server" → Finish

### Bước 3: Tạo Inbound Rule cho port 5001
1. Click "New Rule..." lại
2. Chọn "Port" → Next
3. Chọn "TCP" và gõ "5001" → Next
4. Chọn "Allow the connection" → Next
5. Chọn tất cả (Domain, Private, Public) → Next
6. Đặt tên: "Node Backend API" → Finish

---

## Cách 3: Tạm thời TẮT Firewall (Chỉ để test)

⚠️ **CHỈ dùng để test, nhớ BẬT lại sau!**

1. Mở Windows Defender Firewall
2. Click "Turn Windows Defender Firewall on or off"
3. Chọn "Turn off" cho Private network
4. Chọn "Turn off" cho Public network
5. Click OK

### Sau khi test xong:
- Quay lại và BẬT lại Firewall!

---

## ✅ KIỂM TRA ĐÃ MỞ FIREWALL CHƯA

### Từ máy tính, mở PowerShell và chạy:
```powershell
# Kiểm tra port 3000
Test-NetConnection -ComputerName 10.21.15.57 -Port 3000

# Kiểm tra port 5001
Test-NetConnection -ComputerName 10.21.15.57 -Port 5001
```

Nếu thấy `TcpTestSucceeded : True` là OK!

---

## 📱 SAU KHI MỞ FIREWALL

### Từ điện thoại:
1. Kết nối cùng WiFi với máy tính
2. Mở trình duyệt
3. Truy cập: **http://10.21.15.57:3000**

### Test Backend API trực tiếp:
- Mở: **http://10.21.15.57:5001/api/flights/popular**
- Nếu thấy JSON data → Backend OK!

---

## 🚨 NẾU VẪN KHÔNG KẾT NỐI ĐƯỢC

1. ✅ Kiểm tra cả 2 thiết bị cùng mạng WiFi
2. ✅ Ping máy tính từ điện thoại (dùng app Network Utilities)
3. ✅ Kiểm tra IP máy tính có đúng không: `ipconfig`
4. ✅ Restart cả backend và frontend
5. ✅ Thử tắt hẳn Firewall để test
6. ✅ Kiểm tra Antivirus có chặn không

---

## 🎯 TRẠNG THÁI HIỆN TẠI

✅ Backend đang chạy:
- Local: http://localhost:5001
- Network: **http://10.21.15.57:5001**

✅ Frontend đang chạy:
- Đang compile, sẽ tự động mở trình duyệt

🔥 **FIREWALL: Cần mở port 3000 và 5001**

---

Sau khi mở Firewall, bạn sẽ truy cập được ứng dụng từ điện thoại! 🎉
