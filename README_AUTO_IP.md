# 🚀 KHỞI ĐỘNG DỰ ÁN (TỰ ĐỘNG PHÁT HIỆN IP)

## Chạy 1 lệnh duy nhất:
```powershell
cd "d:\CNPM NC\CNPM\CNPM"
.\start.ps1
```

## Tự động phát hiện IP mạng:
- ✅ **Backend** tự động detect IP khi khởi động
- ✅ **Frontend** tự động dùng IP từ URL truy cập
- ✅ **Không cần đổi config** khi đổi mạng WiFi

## Cách hoạt động:

### Backend (server.js):
```javascript
// Tự động phát hiện IP mạng LAN
function getNetworkIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}
```

### Frontend (src/config/api.js):
```javascript
// Tự động dùng IP từ URL truy cập
const getApiUrl = () => {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5001';
    }
    
    // Dùng cùng IP với URL đang truy cập
    return `http://${hostname}:5001`;
};
```

## Truy cập:
- 💻 **Localhost**: http://localhost:8080
- 📱 **Điện thoại**: http://[IP-TỰ-ĐỘNG]:8080

IP sẽ tự động hiển thị khi chạy `.\start.ps1`

## Đổi mạng WiFi:
1. Chỉ cần chạy lại: `.\start.ps1`
2. IP mới tự động được phát hiện
3. Không cần sửa code!
