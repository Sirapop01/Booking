import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminRegister.css";

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    birthdate: "",
    idCardNumber: "",
    email: "",
    password: "",
    profileImage: null,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    let newErrors = {};

    if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!formData.birthdate) newErrors.birthdate = "กรุณาเลือกวันเกิด";
    
    if (!formData.idCardNumber) {
      newErrors.idCardNumber = "กรุณากรอกเลขบัตรประชาชน";
    } else if (!/^\d{13}$/.test(formData.idCardNumber)) {
      newErrors.idCardNumber = "เลขบัตรประชาชนต้องมี 13 หลัก";
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "เบอร์โทรศัพท์ต้องมี 10 หลัก";
    }

    if (!formData.email) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "รูปแบบอีเมลไม่ถูกต้อง";
    }

    if (!formData.password) {
      newErrors.password = "กรุณากรอกรหัสผ่าน";
    } else if (formData.password.length < 6) {
      newErrors.password = "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
    }

    if (!formData.profileImage) {
      newErrors.profileImage = "กรุณาอัปโหลดรูปโปรไฟล์";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value);
      });

      const token = localStorage.getItem("token");
      await axios.post("http://localhost:4000/api/admins/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ สมัคร Admin สำเร็จ!");
      navigate("/superadmin/dashboard");
    } catch (error) {
      setErrors({ form: error.response?.data?.message || "เกิดข้อผิดพลาด" });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="admin-register-background">
      <div className="admin-register-container">
        <h2>สมัคร Admin</h2>
        <form onSubmit={handleSubmit} className="admin-register-form">
          <input type="text" name="firstName" placeholder="ชื่อจริง" onChange={handleChange} required />
          {errors.firstName && <p className="error-message">{errors.firstName}</p>}
  
          <input type="text" name="lastName" placeholder="นามสกุล" onChange={handleChange} required />
          {errors.lastName && <p className="error-message">{errors.lastName}</p>}
  
          <input type="date" name="birthdate" onChange={handleChange} required />
          {errors.birthdate && <p className="error-message">{errors.birthdate}</p>}
  
          <input type="text" name="idCardNumber" placeholder="เลขบัตรประชาชน" maxLength="13" onChange={handleChange} required />
          {errors.idCardNumber && <p className="error-message">{errors.idCardNumber}</p>}
  
          <input type="tel" name="phoneNumber" placeholder="เบอร์โทรศัพท์" maxLength="10" onChange={handleChange} required />
          {errors.phoneNumber && <p className="error-message">{errors.phoneNumber}</p>}
  
          <input type="email" name="email" placeholder="อีเมล" onChange={handleChange} required />
          {errors.email && <p className="error-message">{errors.email}</p>}
  
          <input type="password" name="password" placeholder="รหัสผ่าน (ขั้นต่ำ 6 ตัว)" onChange={handleChange} required />
          {errors.password && <p className="error-message">{errors.password}</p>}
  
          <label>รูปโปรไฟล์:</label>
          <input type="file" name="profileImage" accept="image/*" onChange={handleChange} required />
          
          {errors.profileImage && <p className="error-message">{errors.profileImage}</p>}
  
          {errors.form && <p className="error-message">{errors.form}</p>}
          <button type="submit" className="admin-register-button" disabled={loading}>
          {loading ? "⏳ กำลังสมัคร..." : " สมัคร Admin"}
          </button>

        </form>
      </div>
    </div>
  );
  
};

export default AdminRegister;
