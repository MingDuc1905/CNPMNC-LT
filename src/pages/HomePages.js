import React from 'react';

// Import các component chính để xây dựng trang chủ
import Hero from '../components/Hero';
import ServicesMenu from '../components/ServicesMenu';
import PopularFlights from '../components/PopularFlights';

function HomePage() {
  return (
    // Sử dụng React Fragment (<>) để không tạo ra thẻ div thừa
    <>
      <Hero />
      <ServicesMenu />
      
      {/* Thêm một container để nội dung không bị tràn ra toàn màn hình */}
      <div className="app-content">
        <PopularFlights />
      </div>
    </>
  );
}

export default HomePage;
