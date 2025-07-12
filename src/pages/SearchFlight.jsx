import React, { useState, useEffect } from 'react';
import FlightCard from '../components/FlightCard';
function SearchFlightPage() {
  const [flights, setFlights] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Gọi API backend
    fetch('http://localhost:5001/api/flights')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setFlights(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Lỗi khi tải danh sách chuyến bay:', error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Đang tải danh sách chuyến bay...</div>;
  }

  return (
    <div>
      <h1>Tất cả chuyến bay</h1>
      {/* Trong tương lai, bạn có thể thêm form tìm kiếm ở đây */}
      
      {/* THAY THẾ BẢNG BẰNG DANH SÁCH CÁC THẺ FLIGHTCARD */}
      <div className="flight-list-container">
        {flights.length > 0 ? (
          flights.map(flight => (
            <FlightCard key={flight.FlightID} flight={flight} />
          ))
        ) : (
          <p>Không tìm thấy chuyến bay nào.</p>
        )}
      </div>
    </div>
  );
}

export default SearchFlightPage;