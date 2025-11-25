console.log("--- DANG CHAY PHIEN BAN MOI NHAT (SQL Server - SkyPremier2) ---");

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sql = require('mssql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
const os = require('os');

console.log("✅ ENV CONFIG:");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_DATABASE:", process.env.DB_DATABASE);
console.log("VNP_TMNCODE:", process.env.VNP_TMNCODE);
console.log("VNP_HASHSECRET:", process.env.VNP_HASHSECRET);
console.log("VNP_URL:", process.env.VNP_URL);
console.log("VNP_RETURNURL:", process.env.VNP_RETURNURL);

const app = express();
const port = process.env.PORT || 5001;

app.use(express.json());
app.use(cors());

// ==== KẾT NỐI SQL SERVER ====
const config = {
    server: 'DESKTOP-R7C4RRK\\SEVER01',
    database: 'SkyPremier2',
    user: 'sa',
    password: '123456',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

// Tạo connection pool
let pool;
const connectDB = async () => {
    try {
        pool = await sql.connect(config);
        console.log('✅ Kết nối SQL Server thành công!');
    } catch (err) {
        console.error('❌ Lỗi kết nối SQL Server:', err);
        process.exit(1);
    }
};

connectDB();

const JWT_SECRET = process.env.JWT_SECRET;

// ==== CẤU HÌNH VNPAY ====
const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURNURL;

// ==== AUTH (PLAIN TEXT PASSWORD - KHÔNG MÃ HÓA) ====
app.post('/api/auth/register', async (req, res) => {
    const { email, mat_khau, ho_ten, sdt } = req.body;
    if (!email || !mat_khau || !ho_ten) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }
    try {
        const makh = 'KH' + Date.now().toString().slice(-6);
        const ma_loai_default = 'LTV01';

        const request = pool.request();
        await request
            .input('makh', sql.VarChar, makh)
            .input('ho_ten', sql.NVarChar, ho_ten)
            .input('email', sql.VarChar, email)
            .input('sdt', sql.VarChar, sdt)
            .input('mat_khau', sql.VarChar, mat_khau)
            .input('ma_loai', sql.VarChar, ma_loai_default)
            .query('INSERT INTO KHACH_HANG (MAKH, HO_TEN, EMAIL, SDT, MAT_KHAU, MA_LOAI) VALUES (@makh, @ho_ten, @email, @sdt, @mat_khau, @ma_loai)');

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        if (err.number === 2627) { // SQL Server duplicate key error
            return res.status(409).json({ message: 'Email đã tồn tại.' });
        }
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, mat_khau } = req.body;
    try {
        const request = pool.request();
        const result = await request
            .input('email', sql.VarChar, email)
            .query('SELECT * FROM KHACH_HANG WHERE EMAIL = @email');

        const user = result.recordset[0];
        if (!user) return res.status(401).json({ message: 'Sai thông tin đăng nhập.' });

        // So sánh plain text password
        if (mat_khau !== user.MAT_KHAU) {
            return res.status(401).json({ message: 'Sai thông tin đăng nhập.' });
        }

        const token = jwt.sign(
            { makh: user.MAKH, email: user.EMAIL, ho_ten: user.HO_TEN },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ message: 'Đăng nhập thành công', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

// CẬP NHẬT: API tìm kiếm để xử lý logic tìm theo tên thành phố
app.get('/api/flights/search', async (req, res) => {
    try {
        const { diem_di, diem_den, ngay_di } = req.query;

        let baseQuery = `
            SELECT 
                cb.*, 
                sb_di.TEN_SAN_BAY AS TEN_SAN_BAY_DI,
                tp_di.TEN_THANH_PHO AS TEN_THANH_PHO_DI,
                sb_den.TEN_SAN_BAY AS TEN_SAN_BAY_DEN,
                tp_den.TEN_THANH_PHO AS TEN_THANH_PHO_DEN,
                MIN(g.GIA) AS GIA_VE_GOC
            FROM 
                CHUYEN_BAY cb
                JOIN SAN_BAY sb_di ON cb.MA_SAN_BAY_DI = sb_di.MA_SAN_BAY
                JOIN THANH_PHO tp_di ON sb_di.MA_THANH_PHO = tp_di.MA_THANH_PHO
                JOIN SAN_BAY sb_den ON cb.MA_SAN_BAY_DEN = sb_den.MA_SAN_BAY
                JOIN THANH_PHO tp_den ON sb_den.MA_THANH_PHO = tp_den.MA_THANH_PHO
                LEFT JOIN GIA_VE_THEO_HANG g ON cb.MACHUYEN = g.MACHUYEN
        `;

        const conditions = [];
        const request = pool.request();

        if (diem_di) {
            conditions.push('tp_di.TEN_THANH_PHO LIKE @diem_di');
            request.input('diem_di', sql.NVarChar, `%${diem_di}%`);
        }
        if (diem_den) {
            conditions.push('tp_den.TEN_THANH_PHO LIKE @diem_den');
            request.input('diem_den', sql.NVarChar, `%${diem_den}%`);
        }
        if (ngay_di) {
            conditions.push('CAST(cb.GIO_DI AS DATE) = @ngay_di');
            request.input('ngay_di', sql.Date, ngay_di);
        }

        let finalQuery = baseQuery;
        if (conditions.length) {
            finalQuery += ' WHERE ' + conditions.join(' AND ');
        }
        finalQuery += ' GROUP BY cb.MACHUYEN, cb.SO_HIEU_CHUYEN_BAY, cb.HANG_HANG_KHONG, cb.MA_SAN_BAY_DI, cb.MA_SAN_BAY_DEN, cb.GIO_DI, cb.GIO_DEN, sb_di.TEN_SAN_BAY, tp_di.TEN_THANH_PHO, sb_den.TEN_SAN_BAY, tp_den.TEN_THANH_PHO';

        const result = await request.query(finalQuery);
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi tìm kiếm chuyến bay:', err);
        res.status(500).send('Lỗi tìm kiếm chuyến bay');
    }
});


app.get('/api/flights/popular', async (req, res) => {
    try {
        const query = `
            SELECT TOP 7
                cb.MACHUYEN,
                cb.SO_HIEU_CHUYEN_BAY,
                cb.HANG_HANG_KHONG,
                cb.MA_SAN_BAY_DI,
                cb.MA_SAN_BAY_DEN,
                cb.GIO_DI,
                cb.GIO_DEN,
                tp_di.TEN_THANH_PHO AS TEN_THANH_PHO_DI,
                tp_den.TEN_THANH_PHO AS TEN_THANH_PHO_DEN,
                MIN(g.GIA) AS GIA_VE_GOC
            FROM 
                CHUYEN_BAY cb
                LEFT JOIN GIA_VE_THEO_HANG g ON cb.MACHUYEN = g.MACHUYEN
                JOIN SAN_BAY sb_di ON cb.MA_SAN_BAY_DI = sb_di.MA_SAN_BAY
                JOIN THANH_PHO tp_di ON sb_di.MA_THANH_PHO = tp_di.MA_THANH_PHO
                JOIN SAN_BAY sb_den ON cb.MA_SAN_BAY_DEN = sb_den.MA_SAN_BAY
                JOIN THANH_PHO tp_den ON sb_den.MA_THANH_PHO = tp_den.MA_THANH_PHO
            GROUP BY 
                cb.MACHUYEN,
                cb.SO_HIEU_CHUYEN_BAY,
                cb.HANG_HANG_KHONG,
                cb.MA_SAN_BAY_DI,
                cb.MA_SAN_BAY_DEN,
                cb.GIO_DI,
                cb.GIO_DEN,
                tp_di.TEN_THANH_PHO,
                tp_den.TEN_THANH_PHO
            ORDER BY 
                GIA_VE_GOC ASC
        `;
        const request = pool.request();
        const result = await request.query(query);
        res.json(result.recordset);
    } catch (err) {
        console.error('Lỗi khi lấy chuyến bay phổ biến:', err);
        res.status(500).json({ error: 'Lỗi phía server' });
    }
});



// ==== THANH TOÁN VNPAY ====
app.post('/api/payment/create', (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const { amount } = req.body;

    console.log("=== Thanh toán qua VNPAY ===");
    console.log("Amount nhận được từ client:", amount);

    const orderId = moment().format('YYYYMMDDHHmmss');
    const orderInfo = 'ThanhToanVeMayBay'; const locale = 'vn';

    const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: encodeURIComponent(orderInfo), // <-- Đã mã hóa ở đây
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100,
        vnp_ReturnUrl: encodeURIComponent(vnp_ReturnUrl), // <-- ReturnUrl cũng nên mã hóa
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: orderId,
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha256', vnp_HashSecret);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
    sortedParams.vnp_SecureHash = signed;

    const paymentUrl = vnp_Url + '?' + querystring.stringify(sortedParams, { encode: false });

    console.log("Raw string to hash:", signData);
    console.log("Generated vnp_SecureHash:", signed);
    console.log("🔗 Redirect URL:", paymentUrl);

    res.json({ paymentUrl });
});

// ==== HÀM SẮP XẾP OBJECT ====
function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    for (const key of keys) {
        sorted[key] = obj[key];
    }
    return sorted;
}

// ==== TỰ ĐỘNG PHÁT HIỆN IP MẠNG ====
function getNetworkIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Bỏ qua địa chỉ internal và IPv6
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// ==== KHỞI ĐỘNG SERVER ====
app.listen(port, '0.0.0.0', () => {
    const networkIP = getNetworkIP();
    console.log(`✅ Backend server chạy tại:`);
    console.log(`   - Local: http://localhost:${port}`);
    console.log(`   - Network: http://${networkIP}:${port}`);
    console.log(`📱 Để truy cập từ điện thoại, dùng: http://${networkIP}:${port}`);
});
