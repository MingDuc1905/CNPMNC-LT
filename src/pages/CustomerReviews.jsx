import React from 'react';
import './css/CustomerReviews.css';
const reviews = [
    { name: 'Nguyễn Văn A', comment: 'Dịch vụ tuyệt vời, đặt vé nhanh chóng!' },
    { name: 'Trần Thị B', comment: 'Giá vé hợp lý, nhiều lựa chọn chuyến bay.' },
  ];
  
  const CustomerReviews = () => {
    return (
      <div className="customer-reviews">
        <h2>Phản hồi từ khách hàng</h2>
        <ul>
          {reviews.map((review, index) => (
            <li key={index}><strong>{review.name}:</strong> {review.comment}</li>
          ))}
        </ul>
      </div>
    );
  };
  
  export default CustomerReviews;
  