import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; // ⬅ Thêm dòng này đầu file

import './css/BookingPage.css';

function BookingPage() {
  const { id } = useParams();
  const [flight, setFlight] = useState(null);
  const [khuHoi, setKhuHoi] = useState(false);
  const [ngayDi, setNgayDi] = useState('');
  const [ngayVe, setNgayVe] = useState('');
  const [soLuong, setSoLuong] = useState(1);
  const [hangGhe, setHangGhe] = useState('Phổ thông');
  const [error, setError] = useState('');
  const [services, setServices] = useState({
    seat: false,
    meal: false,
    baggage: false,
    wifi: false,
  });
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({ name: '', phone: '', email: '' });
const today = new Date();
  const minNgayDi = new Date(today);
  minNgayDi.setDate(today.getDate() + 10);
  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('searchResults') || '[]');
    const found = data.find(f => f.MACHUYEN === id || f.MA_CHUYEN_BAY === id);
    setFlight(found);
  }, [id]);

  

  const handleNgayDiChange = (e) => {
    const value = e.target.value;
    const selected = new Date(value);

    if (selected < minNgayDi) {
      setError('Hãy chọn ngày đi hợp lệ!');
    } else {
      setError('');
    }
    setNgayDi(value);

    if (khuHoi && ngayVe && new Date(ngayVe) < selected) {
      setError('Ngày về không được trước ngày đi!');
    }
  };

  const handleNgayVeChange = (e) => {
    const value = e.target.value;
    if (new Date(value) < new Date(ngayDi)) {
      setError('Ngày về không được trước ngày đi!');
    } else {
      setError('');
    }
    setNgayVe(value);
  };

  const handleServiceChange = (e) => {
    const { name, checked } = e.target;
    setServices(prev => ({ ...prev, [name]: checked }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => {
    let base = flight?.GIA_VE_GOC || 0;

    // Hệ số hạng ghế
    const heSoHangghe = {
      'Phổ thông': 1,
      'Thương gia': 1.5,
      'Hạng nhất': 2,
    };

    let total = base * heSoHangghe[hangGhe] * soLuong;

    if (services.seat) total += 200000 * soLuong;
    if (services.baggage) total += 100000 * soLuong;
    if (services.wifi) total += 50000 * soLuong;

    return total;
  };

  const handleConfirm = () => {
  if (!ngayDi || (khuHoi && !ngayVe)) return;
if (!customer.name || !customer.phone || !customer.email) {
  setError('Vui lòng nhập đầy đủ thông tin khách hàng.');
  return;
}
if (error) {
  document.querySelector('.total-section').scrollIntoView({ behavior: 'smooth' });
  return;
}

  const bookingInfo = {
    flight,
    khuHoi,
    ngayDi,
    ngayVe,
    soLuong,
    hangGhe,
    services,
    customer,
    total: calculateTotal(),
  };

  navigate('/payment', { state: bookingInfo });
};

  if (!flight) return <div>❌ Không tìm thấy mã chuyến bay: {id}</div>;

  return (
    <div className="booking-container">
      <h2>Thông tin chi tiết vé</h2>

      <div className="ticket-box">
        <div className="ticket-left">
          <label>
            Hình thức:
            <select value={khuHoi ? 'Khứ hồi' : 'Một chiều'} onChange={(e) => setKhuHoi(e.target.value === 'Khứ hồi')}>
              <option>Khứ hồi</option>
              <option>Một chiều</option>
            </select>
          </label>

         <label>
  Ngày đi:
  <input
    type="date"
    value={ngayDi}
    onChange={handleNgayDiChange}
    min={minNgayDi.toISOString().split('T')[0]} // ✅ Giới hạn ngày tối thiểu
    required
  />
</label>

{khuHoi && (
  <label>
    Ngày về:
    <input
      type="date"
      value={ngayVe}
      onChange={handleNgayVeChange}
      min={
        ngayDi
          ? new Date(new Date(ngayDi).setDate(new Date(ngayDi).getDate() + 1))
              .toISOString()
              .split('T')[0]
          : ''
      }
      required
    />
  </label>
)}


          <label>
            Hạng ghế:
            <select value={hangGhe} onChange={(e) => setHangGhe(e.target.value)}>
              <option>Phổ thông</option>
              <option>Thương gia</option>
              <option>Hạng nhất</option>
            </select>
          </label>

          <label>
            Số lượng:
            <input type="number" min={1} value={soLuong} onChange={(e) => setSoLuong(parseInt(e.target.value))} />
          </label>

          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        <div className="ticket-center">
          <h3>{flight.HANG_HANG_KHONG} – {flight.SO_HIEU_CHUYEN_BAY}</h3>
          <p>{new Date(flight.GIO_DI).toLocaleTimeString('vi-VN')} – {new Date(flight.GIO_DEN).toLocaleTimeString('vi-VN')}</p>
          <p>{flight.SAN_BAY_DI} → {flight.SAN_BAY_DEN}</p>
        </div>

        <div className="ticket-right">
          <h4>Dịch vụ đi kèm</h4>
          <label><input type="checkbox" name="seat" onChange={handleServiceChange} /> Ghế ngồi phía trước (+200K/người)</label>
          <label><input type="checkbox" name="meal" onChange={handleServiceChange} /> Suất ăn đặc biệt</label>
          <label><input type="checkbox" name="baggage" onChange={handleServiceChange} /> Hành lý thêm 20kg (+100K/người)</label>
          <label><input type="checkbox" name="wifi" onChange={handleServiceChange} /> Wifi trên chuyến bay (+50K/người)</label>
        </div>
      </div>

      <h3>Thông tin khách hàng</h3>
      <div className="customer-info">
        <input type="text" name="name" value={customer.name} placeholder="Họ và tên" onChange={handleInputChange} />
        <input type="tel" name="phone" value={customer.phone} placeholder="Số điện thoại" onChange={handleInputChange} />
        <input type="email" name="email" value={customer.email} placeholder="Email" onChange={handleInputChange} />
      </div>

      <div className="total-section">
  <div className="breakdown">
    <p>🎫 Giá vé gốc: {flight.GIA_VE_GOC.toLocaleString('vi-VN')} x {soLuong} = {(flight.GIA_VE_GOC * soLuong).toLocaleString('vi-VN')} VND</p>
    <p>💺 Hạng ghế: {hangGhe} {hangGhe !== 'Phổ thông' && `(phụ thu x${hangGhe === 'Thương gia' ? 1.5 : 2})`}</p>

    {services.seat && <p>➕ Ghế ngồi phía trước: {(200000 * soLuong).toLocaleString('vi-VN')} VND</p>}
    {services.baggage && <p>➕ Hành lý thêm 20kg: {(100000 * soLuong).toLocaleString('vi-VN')} VND</p>}
    {services.wifi && <p>➕ Wifi: {(50000 * soLuong).toLocaleString('vi-VN')} VND</p>}
    {services.meal && <p>🍱 Suất ăn đặc biệt: Miễn phí</p>}

    <hr />
    <p><strong>🧾 Tổng tiền cần thanh toán: {calculateTotal().toLocaleString('vi-VN')} VND</strong></p>
  </div>
  <button onClick={handleConfirm}>Xác nhận đặt vé</button>
</div>

    </div>
  );
}

export default BookingPage;
