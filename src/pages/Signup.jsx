import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Signup.css'; 

function SignupPage() {
  // THAY ĐỔI 1: Cập nhật state để khớp với backend
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    mat_khau: '',
    sdt: ''
  });
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      // API endpoint đã đúng, body sẽ được gửi đi từ state đã thay đổi
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đã có lỗi xảy ra.');
      }
      
      alert('Đăng ký thành công! Bạn sẽ được chuyển đến trang đăng nhập.');
      navigate('/login');

    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-form-container">
        <h2>Tạo tài khoản SkyPremier</h2>
        <p>Bắt đầu hành trình của bạn với chúng tôi.</p>
        <form onSubmit={handleSubmit}>
          {/* THAY ĐỔI 2: Cập nhật các trường input trong form */}
          <div className="form-group">
            <label>Họ và tên</label>
            <input type="text" name="ho_ten" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" name="email" onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Số điện thoại</label>
            <input type="tel" name="sdt" onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Mật khẩu</label>
            <input type="password" name="mat_khau" onChange={handleChange} required />
          </div>
          <button type="submit" className="auth-button" disabled={isLoading}>
            {isLoading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
        {message && <p className="error-message">{message}</p>}
      </div>
    </div>
  );
}

export default SignupPage;