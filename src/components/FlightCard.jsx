import React from 'react';
import { useNavigate } from 'react-router-dom';

import hanoiImage from '../assets/images/hanoi.png';
import danangImage from '../assets/images/danang.png';
import hcmcImage from '../assets/images/hcmc.png';
import phuquocImage from '../assets/images/phuquoc.png';
import hueImage from '../assets/images/hue.png';
import nhatrangImage from '../assets/images/nhatrang.png';
import defaultLocationImage from '../assets/images/default_location.png';

function FlightCard({ flight }) {
  console.log('Flight Data:', flight);

  const navigate = useNavigate();

  const departureTime = flight.GIO_DI
    ? new Date(flight.GIO_DI).toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'N/A';

  const price = flight.GIA_VE_GOC
    ? 'Từ ' + flight.GIA_VE_GOC.toLocaleString('vi-VN') + ' VNĐ'
    : 'Xem chi tiết';

  const removeVietnameseTones = (str) =>
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  const getLocationImage = (cityName) => {
    if (!cityName) return defaultLocationImage;

    const normalized = removeVietnameseTones(cityName.trim());

    if (normalized.includes('ha noi') || normalized.includes('han')) return hanoiImage;
    if (normalized.includes('da nang') || normalized.includes('dad')) return danangImage;
    if (normalized.includes('ho chi minh') || normalized.includes('hcm') || normalized.includes('sgn')) return hcmcImage;
    if (normalized.includes('phu quoc') || normalized.includes('pqc')) return phuquocImage;
    if (normalized.includes('hue')) return hueImage;
    if (normalized.includes('nha trang') || normalized.includes('cxr')) return nhatrangImage;

    return defaultLocationImage;
  };

  const handleImageError = (e) => {
    e.target.src = defaultLocationImage;
  };

  const handleBookClick = () => {
  if (flight.MACHUYEN) {
    navigate(`/booking/${flight.MACHUYEN}`);
  } else {
    alert('Không tìm thấy mã chuyến bay!');
  }
};

  return (
    <div className="flight-card" style={{ cursor: 'default' }}>
      <div className="flight-card-image">
        <img
          src={getLocationImage(flight.SAN_BAY_DEN)}
          alt={flight.SAN_BAY_DEN}
          onError={handleImageError}
        />
      </div>

      <div className="flight-card-details">
        <div className="flight-info">
          <div className="airline">{flight.HANG_HANG_KHONG} - {flight.SO_HIEU_CHUYEN_BAY}</div>
          <div className="route-point">{flight.SAN_BAY_DI} → {flight.SAN_BAY_DEN}</div>
          <div className="time">Khởi hành: {departureTime}</div>
        </div>

        <div className="flight-booking-info">
          <div className="price">{price}</div>
          <button className="book-button" onClick={handleBookClick}>
            Chọn vé
          </button>
        </div>
      </div>
    </div>
  );
}

export default FlightCard;
