import React from 'react';
import './ServicesMenu.css';

const services = [
  { icon: '🎫', name: 'Miễn phí xuất vé' },
  { icon: '⚡', name: 'Nhanh chóng, tiện lợi' },
  { icon: '🎁', name: 'Ưu đãi ngập tràn' },
];

function ServicesMenu() {
  return (
    <div className="services-menu-container">
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
