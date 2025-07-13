import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Đang kiểm tra kết quả...");

  useEffect(() => {
    const status = searchParams.get('vnp_TransactionStatus');
    if (status === '00') {
      setMessage("✅ Thanh toán thành công! Cảm ơn bạn đã sử dụng SkyPremier.");
    } else {
      setMessage("❌ Thanh toán không thành công hoặc bị hủy.");
    }
  }, [searchParams]);

  return (
    <div className="payment-container">
      <h2>Kết quả thanh toán</h2>
      <p>{message}</p>
    </div>
  );
}

export default PaymentSuccess;
