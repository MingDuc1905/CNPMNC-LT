// Test kết nối SQL Server
require('dotenv').config();
const sql = require('mssql');

const config = {
    server: 'DESKTOP-R7C4RRK\\SEVER01',
    database: 'SkyPremier2',
    user: 'sa',
    password: '123456',
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true
    }
};

async function testConnection() {
    try {
        console.log('Đang kết nối SQL Server...');
        const pool = await sql.connect(config);
        console.log('✅ Kết nối thành công!');

        const result = await pool.request().query('SELECT TOP 3 * FROM KHACH_HANG');
        console.log('✅ Truy vấn thành công!');
        console.log('Số bản ghi:', result.recordset.length);
        console.log('Dữ liệu mẫu:', result.recordset);

        await pool.close();
        console.log('\n=== TEST HOÀN TẤT ===');
    } catch (err) {
        console.error('❌ Lỗi:', err.message);
    }
}

testConnection();
