import React from 'react';
import './ServicesMenu.css';

const services = [
  { icon: '🧳', name: 'Hành lý trả trước' },
  { icon: '✈️', name: 'Nâng hạng & chọn chỗ' },
  { icon: '🛍️', name: 'Mua sắm' },
  { icon: '🏨', name: 'Khách sạn & Tour' },
  { icon: '🛡️', name: 'Bảo hiểm' },
  { icon: '✨', name: 'Dịch vụ khác' },
];

function ServicesMenu() {
  return (
    <div className="services-menu-container">
      {/* THÊM DÒNG TIÊU ĐỀ Ở ĐÂY */}
      <h2 className="services-title">KHÁM PHÁ LỢI ÍCH KHI ĐẶT VÉ TRỰC TUYẾN</h2>

      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-item">
            <div className="service-icon">{service.icon}</div>
            <span className="service-name">{service.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ServicesMenu;
