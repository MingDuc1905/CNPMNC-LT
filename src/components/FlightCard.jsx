// src/components/FlightCard.jsx

import React from 'react';
import { useNavigate } from 'react-router-dom';
import './FlightCard.css'; // Đảm bảo đã import file CSS

// Import các hình ảnh
import hanoiImage from '../assets/images/hanoi.png';
import danangImage from '../assets/images/danang.png';
import hcmcImage from '../assets/images/hcmc.png';
import pqimage from '../assets/images/phuquoc.png';
import ntimage from '../assets/images/nhatrang.png';
import defaultLocationImage from '../assets/images/default_location.png';

function FlightCard({ flight }) {
  const navigate = useNavigate();

  const getLocationImage = (cityName) => {
    if (!cityName) return defaultLocationImage;
    const normalizedCityName = cityName.toLowerCase();
    if (normalizedCityName.includes('hà nội')) return hanoiImage;
    if (normalizedCityName.includes('đà nẵng')) return danangImage;
    if (normalizedCityName.includes('hồ chí minh')) return hcmcImage;
    if (normalizedCityName.includes('phú quốc')) return pqimage;
    if (normalizedCityName.includes('nha trang')) return ntimage;
    return defaultLocationImage;
  };

  const handleSelectFlight = () => {
    navigate(`/booking/${flight.MACHUYEN}`);
  };

  const price = flight.GIA_VE_GOC
    ? parseFloat(flight.GIA_VE_GOC).toLocaleString('vi-VN') + ' VNĐ'
    : 'Xem chi tiết';

  return (
    // SỬ DỤNG CLASS "flight-card" LÀM THẺ CHÍNH
    <div className="flight-card">
      {/* CẤU TRÚC CHO HÌNH NỀN VÀ LỚP PHỦ */}
      <div className="flight-card-image-wrapper">
        <img
          src={getLocationImage(flight.TEN_THANH_PHO_DEN)}
          alt={flight.TEN_THANH_PHO_DEN}
          // Class cho ảnh nền đã khớp với CSS
          className="flight-card-bg-image"
        />
        {/* LỚP PHỦ CHỨA TOÀN BỘ THÔNG TIN */}
        <div className="card-overlay">
          <div className="overlay-content">
            {/* Phần thông tin hãng bay */}
            <div className="overlay-airline-info">
              <span>{flight.HANG_HANG_KHONG}</span>
              <span>{flight.SO_HIEU_CHUYEN_BAY}</span>
            </div>

            {/* Phần thông tin chặng bay */}
            <div className="overlay-route-info">
              <span className="overlay-city">{flight.TEN_THANH_PHO_DI}</span>
              <span className="overlay-plane-icon">✈️</span>
              <span className="overlay-city">{flight.TEN_THANH_PHO_DEN}</span>
            </div>

            {/* Phần chân của lớp phủ, chứa giá và nút */}
            <div className="overlay-footer">
              <span className="overlay-price">{price}</span>
              <button className="overlay-button" onClick={handleSelectFlight}>
                Chọn vé
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FlightCard;