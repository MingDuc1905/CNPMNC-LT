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
  const [searchParams, setSearchParams] = useState({
    san_bay_di: '',
    san_bay_den: '',
    ngay_di: '',
    ngay_ve: '',
    khu_hoi: false,
    so_luong: 1,
    hang_ve: 'Phổ thông',
    khuyen_mai: ''
  });

  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const queryString = new URLSearchParams(searchParams).toString();
    navigate(`/flights/search?${queryString}`);
  };

  return (
    <>
      {/* FORM TÌM KIẾM */}
      <div className="booking-widget">
        <div className="widget-tabs">
          <button
            className={`tab-item ${activeTab === 'buy-ticket' ? 'active' : ''}`}
            onClick={() => setActiveTab('buy-ticket')}
          >
            ✈️ Mua vé
          </button>
        </div>

        <div className="widget-content">
          {activeTab === 'buy-ticket' && (
            <form className="search-form-horizontal" onSubmit={handleSearch}>
              <div className="search-top-row">
                <select
                  name="khu_hoi"
                  value={searchParams.khu_hoi ? 'Khứ hồi' : 'Một chiều'}
                  onChange={(e) =>
                    setSearchParams({ ...searchParams, khu_hoi: e.target.value === 'Khứ hồi' })
                  }
                >
                  <option>Khứ hồi</option>
                  <option>Một chiều</option>
                </select>

                <select name="so_luong" value={searchParams.so_luong} onChange={handleChange}>
                  {[...Array(9)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {`${i + 1} hành khách, ${searchParams.hang_ve}`}
                    </option>
                  ))}
                </select>

                <select name="khuyen_mai" value={searchParams.khuyen_mai} onChange={handleChange}>
                  <option value="">Mã khuyến mãi</option>
                  <option value="KM10">KM10</option>
                  <option value="GROUP5">GROUP5</option>
                </select>
              </div>

              <div className="search-bottom-row">
                <input
                  type="text"
                  name="san_bay_di"
                  value={searchParams.san_bay_di}
                  onChange={handleChange}
                  placeholder="Từ"
                  required
                />

                <input
                  type="text"
                  name="san_bay_den"
                  value={searchParams.san_bay_den}
                  onChange={handleChange}
                  placeholder="Đến"
                  required
                />

                <input
                  type="date"
                  name="ngay_di"
                  value={searchParams.ngay_di}
                  onChange={handleChange}
                  required
                />

                <input
                  type="date"
                  name="ngay_ve"
                  value={searchParams.ngay_ve || ''}
                  onChange={handleChange}
                  disabled={!searchParams.khu_hoi}
                />

                <button type="submit" className="search-button">
                  Tìm kiếm
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* TIÊU ĐỀ TRÊN BANNER */}
      <div className="hero-title-above">
        <h1 className="hero-title">Giá Hời Bay Muôn Nơi</h1>
      </div>

      {/* BANNER SLIDESHOW */}
      <div className="hero-section-container">
        {banners.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`banner-${index}`}
            className={`hero-image ${index === currentBanner ? 'active' : ''}`}
          />
        ))}
        <div className="hero-overlay"></div>
      </div>

      {/* ƯU ĐÃI DƯỚI BANNER */}
      <div className="promo-below-banner">
        <p className="banner-subtitle">ƯU ĐÃI THEO NHÓM - TIẾT KIỆM ĐẾN 10%</p>
      </div>
    </>
  );
}

export default Hero;
