// src/components/PopularFlights.jsx

import React, { useState, useEffect } from 'react';
import FlightCard from './FlightCard';
import './PopularFlights.css';
import API_BASE_URL from '../config/api';

function PopularFlights() {
  const [popularFlights, setPopularFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_BASE_URL}/api/flights/popular`)
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setPopularFlights(data);
          localStorage.setItem('searchResults', JSON.stringify(data)); // ✅ Lưu để BookingPage đọc
        } else {
          setPopularFlights([]);
          console.error("API không trả về một mảng:", data);
        }
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi tải các chuyến bay phổ biến:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Đang tải...</p>;
  }

  return (
    <section className="popular-flights-section">
      <h2 className="section-title">Khám Phá Các Chuyến Bay Phổ Biến Nhất Của Chúng Tôi</h2>
      <div className="popular-flights-grid">
        {popularFlights.map(flight => (
          <FlightCard key={flight.MACHUYEN || flight.MA_CHUYEN_BAY} flight={flight} />
        ))}
      </div>
    </section>
  );
}

export default PopularFlights;
