import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SuperAdminLogin.css"; // ✅ Import CSS

const SuperAdminLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(""); // ✅ เก็บข้อความ Error
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      console.log(formData)
      const response = await axios.post("http://localhost:4000/api/superadmin/login", formData);
      console.log("✅ Login Success:", response.data);

      // 🔑 บันทึก Token ใน LocalStorage
      localStorage.setItem("token", response.data.token);

      navigate("/superadmin/dashboard");
    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data?.message || error.message);
      setError(error.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="superadmin-login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Super Admin Login</h2>

        {error && <p className="error-message">{error}</p>} {/* ✅ แสดงข้อความ Error */}

        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

        <button type="submit">เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};

export default SuperAdminLogin;
