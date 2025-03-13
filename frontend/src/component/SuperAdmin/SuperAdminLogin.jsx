import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2"; // ✅ Import SweetAlert2
import "./SuperAdminLogin.css"; // ✅ Import CSS

const SuperAdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:4000/api/superadmin/login", formData);
      const { token, user } = response.data;

      // ✅ เก็บ token ไว้ใน session storage
      sessionStorage.setItem("token", token);

      // ✅ แสดง SweetAlert2 แจ้งเตือนเข้าสู่ระบบสำเร็จ
      Swal.fire({
        title: "เข้าสู่ระบบสำเร็จ!",
        text: "กำลังนำทางไปยังแดชบอร์ด...",
        icon: "success",
        timer: 2000, // ⏳ 2 วินาที
        showConfirmButton: false,
      });

      setTimeout(() => {
        navigate("/superadmin/dashboard");
      }, 2000); // ⏳ รอให้ Swal แสดงก่อนนำทาง
    } catch (error) {
      // ✅ แสดง SweetAlert2 เมื่อเกิดข้อผิดพลาด
      Swal.fire({
        title: "เข้าสู่ระบบล้มเหลว",
        text: error.response?.data?.message || "เกิดข้อผิดพลาด",
        icon: "error",
      });

      setError(error.response?.data?.message || "เกิดข้อผิดพลาด");
    }
  };

  return (
    <div className="superadmin-login-container">
      <form onSubmit={handleSubmit} className="login-super-form">
        <h2>Admin Login</h2>
        <p className="super-admin-subtitle">"สำหรับผู้ดูแลระบบที่ได้รับอนุญาตเท่านั้น"</p>

        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        
        <button type="submit" className="login-buttonss">เข้าสู่ระบบ</button>
      </form>
    </div>
  );
};

export default SuperAdminLogin;
