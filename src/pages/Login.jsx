import React, { useState } from 'react';
import './css/Auth.css';

const Login = ({ users, onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = users.find((u) => u.username === username && u.password === password);
    if (user) {
      onLogin(user);
      alert(`Đăng nhập thành công! Vai trò của bạn: ${user.role}`);
    } else {
      alert('Sai tài khoản hoặc mật khẩu!');
    }
  };

  return (
    <div className="auth-container">
      <h2>Đăng nhập</h2>
      <input type="text" placeholder="Tên đăng nhập" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Mật khẩu" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Đăng nhập</button>
    </div>
  );
};

export default Login;
