
// src/pages/Signup.jsx

import React, { useState } from 'react';
import './css/Signup.css';

import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPlane } from 'react-icons/fa';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Tên đăng nhập:', username);
    console.log('Email:', email);
    console.log('Mật khẩu:', password);
    alert('Đăng ký tài khoản thành công! (Đây là một demo frontend)');
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Đăng ký tài khoản</h2>

        {/* === BẮT ĐẦU KHỐI FORM MỚI === */}
        <div className="signup-form-content">
          <form onSubmit={handleSubmit} style={{ width: '100%', textAlign: 'center' }}> {/* Thêm style inline để form căn giữa các input */}
            {/* Input cho Tên đăng nhập */}
            <div className="input-group">
              <FaUser className="icon" />
              <input
                type="text"
                placeholder="Tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="has-icon"
              />
            </div>

            {/* Input cho Địa chỉ email / Số điện thoại */}
            <div className="input-group">
              <FaEnvelope className="icon" />
              <input
                type="text"
                placeholder="yourname@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="has-icon"
              />
            </div>

            {/* Input cho Mật khẩu */}
            <div className="input-group">
              <FaLock className="icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="has-icon"
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {/* Đóng form ở đây, trước khi đến máy bay và chữ SkyPremier */}
          </form>
        </div>
        {/* === KẾT THÚC KHỐI FORM MỚI === */}

        {/* Icon máy bay lớn mờ - Nằm giữa form và chữ SkyPremier */}
        <div className="airplane-bg">
          <FaPlane />
        </div>

        {/* Chữ SkyPremier */}
        <p className="skypremier-text">SkyPremier</p>

        {/* Nút Đăng ký */}
        <button type="submit" className="signup-button">
          <FaPlane className="airplane-icon" />
        </button>
      </div>
    </div>
  );
};

export default Signup;