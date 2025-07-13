// src/pages/Login.jsx

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext'; // Import hook useAuth
import "./css/Login.css"; // Đảm bảo bạn có file CSS này
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaPlane } from "react-icons/fa";

const Login = () => {
  const { login } = useAuth(); // Lấy hàm login từ context
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    mat_khau: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Đăng nhập thất bại.');
      }
      
      // Sử dụng hàm login từ context để cập nhật trạng thái toàn cục
      login(data.token);
      
      alert('Đăng nhập thành công!');
      navigate("/"); // Chuyển về trang chủ

    } catch (error) {
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="signup-form-content">
          <div className="input-group">
            <FaEnvelope className="icon" />
            <input 
              type="email" 
              placeholder="Email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
              className="has-icon" 
              disabled={isLoading} 
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mật khẩu" 
              name="mat_khau" 
              value={formData.mat_khau} 
              onChange={handleChange} 
              required 
              className="has-icon" 
              disabled={isLoading} 
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </form>

        <div className="airplane-bg"><FaPlane /></div>
        <p className="skypremier-text">SkyPremier</p>
        {message && <p className="error-message" style={{color: 'red', marginBottom: '10px'}}>{message}</p>}
        <button type="submit" className="signup-button" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? <div className="loading-spinner">⟳</div> : <FaPlane className="airplane-icon" />}
        </button>
      </div>
    </div>
  );
};

export default Login;