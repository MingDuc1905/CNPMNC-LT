console.log("--- DANG CHAY PHIEN BAN MOI NHAT (MySQL - SkyPremier) ---");

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');
require('dotenv').config();

console.log("✅ ENV CONFIG:");
console.log("VNP_TMNCODE:", process.env.VNP_TMNCODE);
console.log("VNP_HASHSECRET:", process.env.VNP_HASHSECRET);
console.log("VNP_URL:", process.env.VNP_URL);
console.log("VNP_RETURNURL:", process.env.VNP_RETURNURL);

const app = express();
const port = 5001;

app.use(express.json());
app.use(cors());

// ==== KẾT NỐI DATABASE ====
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Mh05072005@',
    database: 'SkyPremier2',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const JWT_SECRET = "your_super_secret_key_that_is_long_and_random";

// ==== CẤU HÌNH VNPAY ====
const vnp_TmnCode = process.env.VNP_TMNCODE;
const vnp_HashSecret = process.env.VNP_HASHSECRET;
const vnp_Url = process.env.VNP_URL;
const vnp_ReturnUrl = process.env.VNP_RETURNURL;

// ==== AUTH ====
app.post('/api/auth/register', async (req, res) => {
    const { email, mat_khau, ho_ten, sdt } = req.body;
    if (!email || !mat_khau || !ho_ten) {
        return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin.' });
    }
    try {
        const hashedPassword = await bcrypt.hash(mat_khau, 10);
        const makh = 'KH' + Date.now().toString().slice(-6);
        const ma_loai_default = 'LTV01';

        await pool.query(
            'INSERT INTO KHACH_HANG (MAKH, HO_TEN, EMAIL, SDT, MAT_KHAU, MA_LOAI) VALUES (?, ?, ?, ?, ?, ?)',
            [makh, ho_ten, email, sdt, hashedPassword, ma_loai_default]
        );

        res.status(201).json({ message: 'Đăng ký thành công!' });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email đã tồn tại.' });
        }
        console.error(err);
        res.status(500).json({ message: 'Lỗi server' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    const { email, mat_khau } = req.body;
    try {
        const [rows] = await pool.query('SELECT * FROM KHACH_HANG WHERE EMAIL = ?', [email]);
        const user = rows[0];
        if (!user) return res.status(401).json({ message: 'Sai thông tin đăng nhập.' });

        const isMatch = await bcrypt.compare(mat_khau, user.MAT_KHAU);
        if (!isMatch) return res.status(401).json({ message: 'Sai thông tin đăng nhập.' });

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
        const params = [];

        if (diem_di) {
            conditions.push('tp_di.TEN_THANH_PHO LIKE ?');
            params.push(`%${diem_di}%`);
        }
        if (diem_den) {
            conditions.push('tp_den.TEN_THANH_PHO LIKE ?');
            params.push(`%${diem_den}%`);
        }
        if (ngay_di) {
            conditions.push('DATE(cb.GIO_DI) = ?');
            params.push(ngay_di);
        }

        let finalQuery = baseQuery;
        if (conditions.length) {
            finalQuery += ' WHERE ' + conditions.join(' AND ');
        }
        finalQuery += ' GROUP BY cb.MACHUYEN';

        const [rows] = await pool.query(finalQuery, params);
        res.json(rows);
    } catch (err) {
        console.error('Lỗi khi tìm kiếm chuyến bay:', err);
        res.status(500).send('Lỗi tìm kiếm chuyến bay');
    }
});


app.get('/api/flights/popular', async (req, res) => {
    try {
        const query = `
            SELECT 
                cb.*, 
                tp_di.TEN_THANH_PHO AS TEN_THANH_PHO_DI,
                tp_den.TEN_THANH_PHO AS TEN_THANH_PHO_DEN,
                MIN(g.GIA) AS GIA_VE_GOC
            FROM 
                CHUYEN_BAY cb
                LEFT JOIN GIA_VE_THEO_HANG g ON cb.MACHUYEN = g.MACHUYEN
                -- Thêm các JOIN còn thiếu để lấy tên thành phố
                JOIN SAN_BAY sb_di ON cb.MA_SAN_BAY_DI = sb_di.MA_SAN_BAY
                JOIN THANH_PHO tp_di ON sb_di.MA_THANH_PHO = tp_di.MA_THANH_PHO
                JOIN SAN_BAY sb_den ON cb.MA_SAN_BAY_DEN = sb_den.MA_SAN_BAY
                JOIN THANH_PHO tp_den ON sb_den.MA_THANH_PHO = tp_den.MA_THANH_PHO
            GROUP BY 
                cb.MACHUYEN
            ORDER BY 
                GIA_VE_GOC ASC
            LIMIT 7
        `;
        const [rows] = await pool.query(query);
        res.json(rows);
    } catch (err) {
        console.error('Lỗi khi lấy chuyến bay phổ biến:', err);
        res.status(500).send('Lỗi phía server');
    }
});
app.get('/api/flights', (req, res) => {
    // Lấy tất cả các cột từ bảng 'chuyen_bay' (hoặc tên bảng của bạn)
    const sqlQuery = "SELECT * FROM chuyen_bay";
  
    db.query(sqlQuery, (err, results) => {
      if (err) {
        console.error('Lỗi truy vấn:', err);
        return res.status(500).send('Lỗi phía server');
      }
      res.json(results); // Trả về một mảng chứa tất cả chuyến bay
    });
  });

// ==== THANH TOÁN VNPAY ====
app.post('/api/payment/create', (req, res) => {
    const ipAddr = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';
    const { amount } = req.body;

    console.log("=== Thanh toán qua VNPAY ===");
    console.log("Amount nhận được từ client:", amount);

    const orderId = moment().format('YYYYMMDDHHmmss');
    const orderInfo = 'Thanh toan ve may bay SkyPremier'; // KHÔNG DẤU
    const locale = 'vn';

    const vnp_Params = {
        vnp_Version: '2.1.0',
        vnp_Command: 'pay',
        vnp_TmnCode,
        vnp_Locale: locale,
        vnp_CurrCode: 'VND',
        vnp_TxnRef: orderId,
        vnp_OrderInfo: orderInfo,
        vnp_OrderType: 'other',
        vnp_Amount: amount * 100,
        vnp_ReturnUrl,
        vnp_IpAddr: ipAddr,
        vnp_CreateDate: orderId,
    };

    const sortedParams = sortObject(vnp_Params);
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac('sha512', vnp_HashSecret);
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

// ==== KHỞI ĐỘNG SERVER ====
app.listen(port, () => {
    console.log(`✅ Backend server chạy tại http://localhost:${port}`);
});
