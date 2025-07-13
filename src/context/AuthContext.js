// src/context/AuthContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Đổi tên import

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    // Khi component được tải, kiểm tra xem có token trong localStorage không
    if (token) {
      try {
        const decodedUser = jwtDecode(token);
        // Kiểm tra token hết hạn
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
        } else {
          // Token đã hết hạn
          localStorage.removeItem('token');
          setUser(null);
        }
      } catch (error) {
        console.error("Lỗi giải mã token:", error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, [token]);

  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    const decodedUser = jwtDecode(newToken);
    setUser(decodedUser);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // Có thể thêm navigate('/') ở đây nếu cần
  };

  const value = { user, token, login, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Tạo một custom hook để dễ dàng sử dụng context
export const useAuth = () => {
  return useContext(AuthContext);
};