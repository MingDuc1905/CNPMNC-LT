import React from 'react';
import { useLocation } from 'react-router-dom';

function PaymentPage() {
  const location = useLocation();
  const bookingInfo = location.state;

  const handleThanhToan = async () => {
    if (!bookingInfo || !bookingInfo.total) {
      alert("Thiếu thông tin đặt vé.");
      return;
    }

    try {
      console.log("Số tiền cần thanh toán:", bookingInfo.total);

      const res = await fetch('http://localhost:5001/api/payment/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: bookingInfo.total })
      });

      const data = await res.json();
      console.log("Kết quả thanh toán:", data);

      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        alert("Không thể tạo URL thanh toán.");
      }
    } catch (err) {
      console.error("Lỗi khi gửi thanh toán:", err);
      alert("Lỗi khi thanh toán");
    }
  };

  return (
    <div className="payment-container">
      <h2>Thanh toán cho chuyến bay</h2>
      <p>Khách hàng: {bookingInfo?.customer?.name}</p>
      <p>Số tiền: <strong>{bookingInfo.total?.toLocaleString('vi-VN')} VND</strong></p>
<button onClick={handleThanhToan}>Thanh toán qua VNPAY</button>
    </div>
  );
}

export default PaymentPage;
