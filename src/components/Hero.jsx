// src/components/Hero.jsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
import banner0 from '../assets/images/banner.png';
import banner1 from '../assets/images/banner1.png';
import banner2 from '../assets/images/banner2.png';
import banner3 from '../assets/images/banner3.png';

const banners = [banner0, banner1, banner2, banner3];

function Hero() {
  const [activeTab, setActiveTab] = useState('buy-ticket');
  const [currentBanner, setCurrentBanner] = useState(0);

  // Chỉ cần lấy điểm đi và điểm đến
  const [searchParams, setSearchParams] = useState({
    diem_di: '',
    diem_den: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryString = new URLSearchParams(searchParams).toString();
    // Chuyển hướng đến /flights (đường dẫn của SearchFlightPage)
    navigate(`/flights?${queryString}`);
  };

  return (
    <>
      <div className="hero-section-container">
        {banners.map((img, index) => (
          <img key={index} src={img} alt={`banner-${index}`} className={`hero-image ${index === currentBanner ? 'active' : ''}`} />
        ))}
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content">
        <div className="hero-text">
          <h1>Giá Hời Bay Muôn Nơi</h1>
        </div>
        <div className="booking-widget">
          <div className="widget-tabs">
            <button className={`tab-item ${activeTab === 'buy-ticket' ? 'active' : ''}`} onClick={() => setActiveTab('buy-ticket')}>
              ✈️ Mua vé
            </button>
          </div>
          <div className="widget-content">
            {activeTab === 'buy-ticket' && (
              <form className="search-form" onSubmit={handleSearch}>
                <div className="form-group">
                  <label>Từ</label>
                  <input type="text" name="diem_di" value={searchParams.diem_di} onChange={handleChange} placeholder="Nhập thành phố đi" />
                </div>
                <div className="form-group">
                  <label>Đến</label>
                  <input type="text" name="diem_den" value={searchParams.diem_den} onChange={handleChange} placeholder="Nhập thành phố đến" />
                </div>
                <button type="submit" className="search-button">
                  Tìm kiếm
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Hero;