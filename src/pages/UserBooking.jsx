import React, { useState } from 'react';
import './css/UserBooking.css';

const UserBooking = () => {
  const [bookings, setBookings] = useState([]);

  const bookFlight = () => {
    const newBooking = { id: bookings.length + 1, from: 'Hà Nội', to: 'TP. Hồ Chí Minh', status: 'Đã đặt' };
    setBookings([...bookings, newBooking]);
  };

  const cancelBooking = (id) => {
    setBookings(bookings.map((booking) => (booking.id === id ? { ...booking, status: 'Đã huỷ' } : booking)));
  };

  return (
    <div className="user-booking">
      <h2>Quản lý vé của tôi</h2>

      <button onClick={bookFlight}>Đặt vé</button>

      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.from} → {booking.to} - {booking.status} 
            {booking.status === 'Đã đặt' && <button onClick={() => cancelBooking(booking.id)}>Hủy vé</button>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserBooking;
