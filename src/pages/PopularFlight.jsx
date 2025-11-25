import React, { useState, useEffect } from 'react';
import FlightCard from './FlightCard';
import API_BASE_URL from '../config/api';
// import './PopularFlights.css'; // Tạm thời không dùng file CSS ngoài

function PopularFlights() {
  const [popularFlights, setPopularFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/flights/popular`)
      .then(response => response.json())
      .then(data => {
        setPopularFlights(data.slice(0, 3));
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi tải các chuyến bay phổ biến:', error);
        setIsLoading(false);
      });
  }, []);

  // --- STYLE TRỰC TIẾP ĐỂ KIỂM TRA ---
  const sectionStyle = {
    padding: '40px 20px',
    backgroundColor: '#f9f9f9',
  };

  const titleStyle = {
    textAlign: 'center',
    fontSize: '2em',
    marginBottom: '30px',
    color: '#333',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
  };
  // ------------------------------------

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  return (
    // Áp dụng style trực tiếp vào thẻ HTML
    <section style={sectionStyle}>
      {/* === THAY ĐỔI DÒNG NÀY ĐỂ KIỂM TRA === */}
      <h2 style={titleStyle}>KIỂM TRA - CÁC CHUYẾN BAY PHỔ BIẾN</h2>
      <div style={gridStyle}>
        {popularFlights.map(flight => (
          <FlightCard key={flight.FlightID} flight={flight} />
        ))}
      </div>
    </section>
  );
}

export default PopularFlights;
