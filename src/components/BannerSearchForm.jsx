import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerSearchForm from '../components/BannerSearchForm';
const BannerSearchForm = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    diemDi: '',
    diemDen: '',
    ngayDi: '',
    ngayVe: '',
    khuHoi: false,
    soLuongHanhKhach: 1,
    hangVe: 'Phổ thông',
    maKhuyenMai: ''
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Điều hướng sang trang tìm kiếm với query
    navigate(`/flights?${new URLSearchParams(formData).toString()}`);
  };

  return (
    <div className="banner-search-form">
      <form onSubmit={handleSubmit} className="search-form">
        <div>
          <label>Điểm đi:</label>
          <input name="diemDi" value={formData.diemDi} onChange={handleChange} required />
        </div>
        <div>
          <label>Điểm đến:</label>
          <input name="diemDen" value={formData.diemDen} onChange={handleChange} required />
        </div>
        <div>
          <label>Ngày đi:</label>
          <input type="date" name="ngayDi" value={formData.ngayDi} onChange={handleChange} required />
        </div>
        {formData.khuHoi && (
          <div>
            <label>Ngày về:</label>
            <input type="date" name="ngayVe" value={formData.ngayVe} onChange={handleChange} />
          </div>
        )}
        <div>
          <label>
            <input type="checkbox" name="khuHoi" checked={formData.khuHoi} onChange={handleChange} />
            Vé khứ hồi
          </label>
        </div>
        <div>
          <label>Số lượng hành khách:</label>
          <input type="number" name="soLuongHanhKhach" min="1" value={formData.soLuongHanhKhach} onChange={handleChange} />
        </div>
        <div>
          <label>Hạng vé:</label>
          <select name="hangVe" value={formData.hangVe} onChange={handleChange}>
            <option>Phổ thông</option>
            <option>Thương gia</option>
            <option>Hạng nhất</option>
          </select>
        </div>
        <div>
          <label>Mã khuyến mãi:</label>
          <input name="maKhuyenMai" value={formData.maKhuyenMai} onChange={handleChange} />
        </div>
        <button type="submit">Tìm chuyến bay</button>
      </form>
    </div>
  );
};

export default BannerSearchForm;
