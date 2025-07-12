import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// 1. IMPORT CÁC TRANG CỦA BẠN
import HomePage from './pages/HomePages'; 
import LoginPage from './pages/Login';
import SignupPage from './pages/Signup';
import SearchFlightPage from './pages/SearchFlight';
import BookingPage from './pages/BookingPage'; // 
import siteLogo from './assets/images/logo.png';
import PaymentPage from './pages/PaymentPage';
import PaymentSuccess from './pages/PaymentSuccess';

// Import file CSS chính
import './App.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        
        {/* === HEADER === */}
        <header className="site-header">
          {/* Tầng trên: Thanh thông tin phụ */}
          <div className="top-bar">
            <div className="container">
              <div className="top-bar-left">
                <span>✈️ SKY PREMIER chuyển toàn bộ chuyến bay nội địa sang nhà ga T3 Tân Sơn Nhất</span>
              </div>
              <div className="top-bar-right">
                <Link to="/help">TRỢ GIÚP</Link>
                <Link to="/signup">ĐĂNG KÝ</Link> 
                <Link to="/login">ĐĂNG NHẬP</Link>
                <span>VIETNAM - TIẾNG VIỆT</span>
              </div>
            </div>
          </div>

          {/* Tầng dưới: Thanh điều hướng chính */}
          <nav className="main-nav">
            <div className="container">
              <Link to="/" className="navbar-brand">
                <img src={siteLogo} alt="SkyPremier Logo" style={{height: '40px'}} />
                <span>SkyPremier</span>
              </Link>
              {/* === CẬP NHẬT THỨ TỰ CÁC LIÊN KẾT CHÍNH === */}
              {/* Đưa mục quan trọng nhất "Mua vé" lên đầu tiên */}
              <ul className="nav-links">
                <li><Link to="/flights">Mua vé & Sản phẩm khác</Link></li>
                <li><Link to="/plan">Lên kế hoạch</Link></li>
                <li><Link to="/trip-info">Thông tin hành trình</Link></li>
                <li><Link to="/lotusmiles">Lotusmiles</Link></li>
              </ul>
            </div>
          </nav>
        </header>

        {/* Phần nội dung chính của trang */}
        <main className="app-content">
          <Routes>
            {/* Các route cho các trang đã tạo */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/flights" element={<SearchFlightPage />} />
              <Route path="/booking/:id" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />




            {/* Các route placeholder cho các link mới trên menu */}
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
