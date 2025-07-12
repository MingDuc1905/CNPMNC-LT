
import { useState } from "react"
import { useNavigate } from "react-router-dom" // Import useNavigate hook
import "./css/Login.css" // Đảm bảo DÒNG NÀY là Login.css
import { FaUser, FaLock, FaEye, FaEyeSlash, FaPlane } from "react-icons/fa"

const Login = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate() // Initialize navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simulate API call - replace with your actual authentication logic
      console.log("Tên đăng nhập:", username)
      console.log("Mật khẩu:", password)

      // Here you would typically make an API call to verify credentials
      // For demo purposes, we'll simulate a successful login after 1 second
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Store user data in localStorage (optional)
      localStorage.setItem("isLoggedIn", "true")
      localStorage.setItem("username", username)

      // Navigate to home page
      navigate("/home") // or navigate('/') if home is at root
    } catch (error) {
      console.error("Lỗi đăng nhập:", error)
      alert("Đăng nhập thất bại! Vui lòng kiểm tra lại thông tin.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>Đăng nhập</h2>
        <form onSubmit={handleSubmit} className="signup-form-content">
          <div className="input-group">
            <FaUser className="icon" />
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="has-icon"
              disabled={isLoading}
            />
          </div>
          <div className="input-group">
            <FaLock className="icon" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="has-icon"
              disabled={isLoading}
            />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
        </form>

        {/* Icon máy bay lớn mờ - Đảm bảo nó nằm ĐÚNG CHỖ này */}
        <div className="airplane-bg">
          <FaPlane />
        </div>

        {/* Chữ SkyPremier - Đảm bảo nó nằm ĐÚNG CHỖ này */}
        <p className="skypremier-text">SkyPremier</p>

        {/* Nút Đăng nhập - Đảm bảo nó nằm ĐÚNG CHỖ này (cuối cùng trong signup-card) */}
        <button type="submit" className="signup-button" disabled={isLoading} onClick={handleSubmit}>
          {isLoading ? <div className="loading-spinner">⟳</div> : <FaPlane className="airplane-icon" />}
        </button>
      </div>
    </div>
  )
}

export default Login
