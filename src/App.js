// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useAuth } from './context/AuthContext'; // Import hook useAuth

// Import các trang
import HomePage from './pages/HomePages';
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import SearchFlightPage from './pages/SearchFlight';
import UserBookingPage from './pages/UserBooking';
import BookingPage from './pages/BookingPage';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';
import siteLogo from './assets/images/logo.png';
import './App.css';

function App() {
  const { user, logout } = useAuth(); // Lấy thông tin user và hàm logout từ context

  const handleLogout = () => {
    logout();
    alert("Bạn đã đăng xuất thành công.");
    // Router sẽ tự động chuyển về trang chủ hoặc trang login nếu cần
  };

  return (
    <Router>
      <div className="app-container">
        <header className="site-header">
          <div className="top-bar">
            <div className="container">
              <div className="top-bar-left">
                <span>✈️ SKY PREMIER chuyển toàn bộ chuyến bay nội địa sang nhà ga T3 Tân Sơn Nhất</span>
              </div>
              <div className="top-bar-right">
                <Link to="/help">TRỢ GIÚP</Link>

                {/* HIỂN THỊ ĐỘNG TÙY THEO TRẠNG THÁI ĐĂNG NHẬP */}
                {user ? (
                  <>
                    <Link to="/profile" className="user-info">
                      <img
                        src={`https://ui-avatars.com/api/?name=${user.ho_ten.replace(/\s/g, "+")}&background=0D8ABC&color=fff`}
                        alt="avatar"
                        className="user-avatar"
                      />
                      <span>{user.ho_ten}</span>
                    </Link>
                    <button onClick={handleLogout} className="logout-button">Đăng xuất</button>
                  </>
                ) : (
                  <>
                    <Link to="/signup">ĐĂNG KÝ</Link>
                    <Link to="/login">ĐĂNG NHẬP</Link>
                  </>
                )}
                <span>VIETNAM - TIẾNG VIỆT</span>
              </div>
            </div>
          </div>

          <nav className="main-nav">
            <div className="container">
              <Link to="/" className="navbar-brand">
                <img src={siteLogo} alt="SkyPremier Logo" style={{ height: '40px' }} />
                <span>SkyPremier</span>
              </Link>
              <ul className="nav-links">
                <li><Link to="/flights">Mua vé & Sản phẩm khác</Link></li>
                <li><Link to="/plan">Lên kế hoạch</Link></li>
                <li><Link to="/trip-info">Thông tin hành trình</Link></li>
                <li><Link to="/lotusmiles">Lotusmiles</Link></li>
              </ul>
            </div>
          </nav>
        </header>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/flights" element={<SearchFlightPage />} />
            <Route path="/bookings" element={<UserBookingPage />} />
            <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/profile" element={<div>Trang thông tin cá nhân của {user?.ho_ten}</div>} />
            <Route path="/help" element={<div>Trang Trợ giúp</div>} />
            <Route path="/plan" element={<div>Trang Lên kế hoạch</div>} />
            <Route path="/trip-info" element={<div>Trang Thông tin hành trình</div>} />
            <Route path="/lotusmiles" element={<div>Trang Lotusmiles</div>} />
          </Routes>
        </main>

        <footer className="app-footer">
          <p>&copy; {new Date().getFullYear()} SkyPremier Airlines. All Rights Reserved.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;