// Cấu hình API URL - Tự động detect localhost hoặc network
// Khi chạy trên máy tính: http://localhost:5001
// Khi chạy trên điện thoại: http://IP:5001

const getApiUrl = () => {
    // Nếu có cấu hình trong env, dùng nó
    if (process.env.REACT_APP_API_URL) {
        return process.env.REACT_APP_API_URL;
    }

    // Tự động detect: nếu hostname là localhost thì dùng localhost
    // Nếu là IP thì dùng IP
    const hostname = window.location.hostname;

    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5001';
    }

    // Nếu đang truy cập qua IP, dùng cùng IP đó cho API
    return `http://${hostname}:5001`;
};

const API_BASE_URL = getApiUrl();

console.log('🌐 API URL:', API_BASE_URL);

export default API_BASE_URL;
