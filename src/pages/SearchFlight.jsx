// src/pages/SearchFlight.jsx

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import FlightCard from '../components/FlightCard';
import './css/SearchFlight.css'; // Đảm bảo bạn có file CSS này

function SearchFlightPage() {
  const [searchUrlParams] = useSearchParams();
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // State cho form tìm kiếm, nhận giá trị ban đầu từ URL
  const [formData, setFormData] = useState({
    diem_di: searchUrlParams.get('diem_di') || '',
    diem_den: searchUrlParams.get('diem_den') || '',
    ngay_di: '',
    ngay_ve: '',
    loai_ve: 'Thương gia',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFlights([]);

    const activeParams = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '')
    );
    const queryString = new URLSearchParams(activeParams).toString();

    try {
      const response = await fetch(`http://localhost:5001/api/flights/search?${queryString}`);
      if (!response.ok) {
        throw new Error('Lỗi khi tải dữ liệu');
      }
      const data = await response.json();
      setFlights(data);
    } catch (error) {
      console.error('Lỗi khi tìm kiếm chuyến bay:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="search-page-container">
      <div className="search-widget-container">
        <h2>Tìm kiếm chuyến bay</h2>
        <form className="detailed-search-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <input type="text" name="diem_di" value={formData.diem_di} onChange={handleChange} placeholder="Từ" />
            <input type="text" name="diem_den" value={formData.diem_den} onChange={handleChange} placeholder="Đến" />
            <input type="date" name="ngay_di" value={formData.ngay_di} onChange={handleChange} />
            <input type="date" name="ngay_ve" value={formData.ngay_ve} onChange={handleChange} placeholder="Ngày về (tùy chọn)" />
            <select name="loai_ve" value={formData.loai_ve} onChange={handleChange}>
              <option value="Phổ thông">Phổ thông</option>
              <option value="Thương gia">Thương gia</option>
            </select>
          </div>
          <button type="submit" className="confirm-button" disabled={isLoading}>
            {isLoading ? 'Đang tìm...' : 'Xác nhận'}
          </button>
        </form>
      </div>

      <div className="flight-results-container">
        <h3>Danh sách chuyến bay</h3>
        {isLoading && <p>Đang tải kết quả...</p>}
        <div className="flights-grid">
          {!isLoading && flights.length === 0 && <p>Không tìm thấy chuyến bay nào phù hợp. Vui lòng thử lại.</p>}
          {flights.map(flight => (
            <FlightCard key={flight.MACHUYEN} flight={flight} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default SearchFlightPage;