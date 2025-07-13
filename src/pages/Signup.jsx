// src/pages/Signup.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Signup.css'; // Đảm bảo bạn có file CSS này
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPlane, FaPhone } from 'react-icons/fa';

const Signup = () => {
  // THAY ĐỔI 1: Quản lý form bằng một state object duy nhất
  const [formData, setFormData] = useState({
    ho_ten: '',
    email: '',
    sdt: '',
    mat_khau: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // THAY ĐỔI 2: Viết lại hàm handleSubmit để gọi API thật
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng ký thất bại.');
      }

      alert('Đăng ký tài khoản thành công! Vui lòng đăng nhập.');
      navigate('/login'); // Chuyển hướng đến trang đăng nhập

    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Đăng ký tài khoản</h2>
        <div className="signup-form-content">
          {/* THAY ĐỔI 3: Cập nhật lại form */}
          <form onSubmit={handleSubmit} style={{ width: '100%', textAlign: 'center' }}>
            {/* Input cho Họ và tên */}
            <div className="input-group">
              <FaUser className="icon" />
              <input type="text" placeholder="Họ và tên" name="ho_ten" value={formData.ho_ten} onChange={handleChange} required className="has-icon" />
            </div>
            {/* Input cho Email */}
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input type="email" placeholder="yourname@email.com" name="email" value={formData.email} onChange={handleChange} required className="has-icon" />
            </div>
            {/* Input cho Số điện thoại */}
            <div className="input-group">
              <FaPhone className="icon" />
              <input type="tel" placeholder="Số điện thoại" name="sdt" value={formData.sdt} onChange={handleChange} className="has-icon" />
            </div>
            {/* Input cho Mật khẩu */}
            <div className="input-group">
              <FaLock className="icon" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu" name="mat_khau" value={formData.mat_khau} onChange={handleChange} required className="has-icon" />
              <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {/* Nút submit được chuyển ra ngoài form để giữ giao diện */}
          </form>
        </div>
        <div className="airplane-bg"><FaPlane /></div>
        <p className="skypremier-text">SkyPremier</p>
        {message && <p className="error-message" style={{color: 'red', marginBottom: '10px'}}>{message}</p>}
        {/* Nút đăng ký sẽ trigger submit của form */}
        <button type="submit" className="signup-button" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? <div className="loading-spinner">⟳</div> : <FaPlane className="airplane-icon" />}
        </button>
      </div>
    </div>
  );
};

export default Signup;