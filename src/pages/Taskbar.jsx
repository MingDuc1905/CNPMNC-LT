import React from 'react';
import './css/Taskbar.css'; // Đừng quên tạo file CSS riêng để tạo kiểu

const Taskbar = () => {
  return (
    <div className="taskbar">
      <div className="logo">FlightBooking</div>
      <nav className="navigation">
        <a href="/">Trang chủ</a>
        <a href="/booking">Đặt vé</a>
        <a href="/about">Về chúng tôi</a>
        <a href="/contact">Liên hệ</a>
      </nav>
    </div>
  );
};

export default Taskbar;

