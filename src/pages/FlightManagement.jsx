import React, { useState } from 'react';
import './css/FlightManagement.css';

const FlightManagement = () => {
  const [flights, setFlights] = useState([
    { id: 1, from: 'Hà Nội', to: 'TP. Hồ Chí Minh', price: '1.500.000 VND' },
    { id: 2, from: 'Đà Nẵng', to: 'Hà Nội', price: '1.200.000 VND' },
  ]);

  const [newFlight, setNewFlight] = useState({ from: '', to: '', price: '' });

  const addFlight = () => {
    if (newFlight.from && newFlight.to && newFlight.price) {
      setFlights([...flights, { id: flights.length + 1, ...newFlight }]);
      setNewFlight({ from: '', to: '', price: '' });
    }
  };

  const deleteFlight = (id) => {
    setFlights(flights.filter((flight) => flight.id !== id));
  };

  return (
    <div className="flight-management">
      <h2>Quản lý chuyến bay</h2>

      <div className="add-flight">
        <input type="text" placeholder="Điểm đi" value={newFlight.from} onChange={(e) => setNewFlight({ ...newFlight, from: e.target.value })} />
        <input type="text" placeholder="Điểm đến" value={newFlight.to} onChange={(e) => setNewFlight({ ...newFlight, to: e.target.value })} />
        <input type="text" placeholder="Giá vé" value={newFlight.price} onChange={(e) => setNewFlight({ ...newFlight, price: e.target.value })} />
        <button onClick={addFlight}>Thêm chuyến bay</button>
      </div>

      <ul>
        {flights.map((flight) => (
          <li key={flight.id}>
            {flight.from} → {flight.to} - {flight.price} 
            <button onClick={() => deleteFlight(flight.id)}>Xóa</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FlightManagement;
