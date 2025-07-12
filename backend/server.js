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
    password: '',
    database: 'SkyPremier',
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

// ==== API CHUYẾN BAY ====
app.get('/api/flights/search', async (req, res) => {
    try {
        const { san_bay_di, san_bay_den, ngay_di } = req.query;

        let baseQuery = `
            SELECT cb.*, MIN(g.GIA) AS GIA_VE_GOC
            FROM CHUYEN_BAY cb
            LEFT JOIN GIA_VE_THEO_HANG g ON cb.MACHUYEN = g.MACHUYEN
        `;

        const conditions = [];
        const params = [];

        if (san_bay_di) {
            conditions.push('cb.SAN_BAY_DI LIKE ?');
            params.push(`%${san_bay_di}%`);
        }
        if (san_bay_den) {
            conditions.push('cb.SAN_BAY_DEN LIKE ?');
            params.push(`%${san_bay_den}%`);
        }
        if (ngay_di) {
            conditions.push('DATE(cb.GIO_DI) = ?');
            params.push(ngay_di);
        }

        let finalQuery = baseQuery;
        if (conditions.length) finalQuery += ' WHERE ' + conditions.join(' AND ');
        finalQuery += ' GROUP BY cb.MACHUYEN';

        const [rows] = await pool.query(finalQuery, params);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi tìm kiếm chuyến bay');
    }
});

app.get('/api/flights/popular', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT cb.*, MIN(g.GIA) AS GIA_VE_GOC
            FROM CHUYEN_BAY cb
            LEFT JOIN GIA_VE_THEO_HANG g ON cb.MACHUYEN = g.MACHUYEN
            GROUP BY cb.MACHUYEN
            ORDER BY GIA_VE_GOC ASC
            LIMIT 7
        `);
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi lấy danh sách phổ biến');
    }
});

app.get('/api/flights/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query(`
            SELECT cb.*, MIN(g.GIA) AS GIA_VE_GOC
            FROM CHUYEN_BAY cb
            LEFT JOIN GIA_VE_THEO_HANG g ON cb.MACHUYEN = g.MACHUYEN
            WHERE cb.MACHUYEN = ?
            GROUP BY cb.MACHUYEN
        `, [id]);

        if (!rows.length) return res.status(404).json({ message: 'Không tìm thấy chuyến bay' });
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Lỗi chi tiết chuyến bay');
    }
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
