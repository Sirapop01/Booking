import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registeropera.css";
import logo from '../assets/logo.png';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";


//Fix
const RegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    idCard: "",
    firstName: "",
    lastName: "",
    dob: "",
    phoneNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    // ✅ ตรวจสอบเฉพาะตัวเลข และจำกัดไม่เกิน 13 หลัก
    if (name === "idCard") {
      if (/^\d{0,13}$/.test(value)) {  // ตรวจสอบว่ามีเฉพาะตัวเลขไม่เกิน 13 หลัก
        setFormData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: type === "checkbox" ? checked : value,
      }));

      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: value ? "" : prevErrors[name],
      }));
    }
  };

  const validateIdCard = (idCard) => {
    if (idCard.length !== 13) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(idCard.charAt(i)) * (13 - i);
    }

    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === parseInt(idCard.charAt(12));
  };


  const validateForm = () => {
    let newErrors = {};
    if (!formData.idCard) newErrors.idCard = "กรุณากรอกเลขบัตรประชาชน";
    if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!formData.dob) newErrors.dob = "กรุณาระบุวันเกิด";
    if (!formData.phoneNumber) newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.email) newErrors.email = "กรุณากรอกอีเมล";
    if (!formData.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!formData.acceptTerms) newErrors.acceptTerms = "โปรดยอมรับเงื่อนไข";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return; // ✅ ตรวจสอบข้อมูลก่อนส่ง

    console.log("🚀 Data being sent to backend:", formData);

    try {
      const response = await axios.post("http://localhost:4000/api/business/register",
        { ...formData, role: "owner" },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        // ✅ เก็บ Email ใน LocalStorage
        localStorage.setItem("registeredEmail", formData.email);

        // ✅ ส่ง Email แจ้งเตือนให้ User
        // await axios.post("http://localhost:4000/api/notifications/send-email", { email: formData.email });

        alert("สมัครสมาชิกสำเร็จ! โปรดกรอกข้อมูลสนามและรอการอนุมัติ!");
        navigate("/RegisterArena");
      } else {
        alert(response.data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก");
      }
    } catch (error) {
      console.error("🚨 Error registering user:", error.response?.data || error);
      alert("❌ เกิดข้อผิดพลาด: " + (error.response?.data?.message || "ลองใหม่อีกครั้ง"));
    }
  };



  return (
    <>


      <div className="registration-container1">
        <header className="registration-header1">
          <h1>
            <img
              src={logo}
              alt="MatchWeb Logo"
              style={{ height: "40px", verticalAlign: "middle", marginRight: "10px" }}
            />
            MatchWeb
          </h1>
          <p>ระบบลงทะเบียนสำหรับผู้ประกอบการ</p>

        </header>
        <main className="registration-content1">
          <h2>ยืนยันข้อมูลการสมัครสมาชิกสำหรับผู้ประกอบการ</h2>
          <p>กรุณากรอกข้อมูลและตรวจสอบข้อมูลให้ครบถ้วน</p>
          <form className="registration-form1" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                เลขบัตรประชาชน *
                {errors.idCard && <span className="error-message">{errors.idCard}</span>}

                <input
                  type="text"
                  name="idCard"
                  value={formData.idCard}
                  onChange={handleChange}
                  maxLength="13"  // ✅ จำกัดไม่เกิน 13 ตัว
                  pattern="\d*"   // ✅ ให้กรอกได้เฉพาะตัวเลข
                  placeholder="กรอกเลขบัตรประชาชน 13 หลัก"
                />
              </label>

              <label>
                ชื่อจริง * {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              </label>

              <label>
                นามสกุล * {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              </label>

              <label>
                วัน/เดือน/ปีเกิด * {errors.dob && <span className="error-message">{errors.dob}</span>}
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} />
              </label>
            </div>

            <div className="form-group">
              <label>
                เบอร์โทรศัพท์มือถือ * {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} />
              </label>

              <label>
                อีเมล * {errors.email && <span className="error-message">{errors.email}</span>}
                <input type="email" name="email" value={formData.email} onChange={handleChange} />
              </label>

              {/* รหัสผ่าน */}
              <label className="password-label">
                รหัสผ่าน * {errors.password && <span className="error-message">{errors.password}</span>}
              </label>

              <div className="password-container">
                <input
                  type={showPassword ? "text" : "password"}  // ✅ เปลี่ยนระหว่าง "text" และ "password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <IoEyeSharp /> : <FaEyeSlash />}
                </button>
              </div>

              {/* ยืนยันรหัสผ่าน */}
              <label>
                ยืนยันรหัสผ่าน * {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
              </label>
              <input
                type={showPassword ? "text" : "password"}  // ✅ ใช้แสดง/ซ่อนเหมือนกัน
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <div className="form-terms">
              <label>
                <input
                  type="checkbox"
                  name="acceptTerms"
                  checked={formData.acceptTerms}
                  onChange={handleChange}
                />
                <span className="accept-text">ยอมรับ</span>
                <Link to="/OperaRequri" className="highlight-conditions"> ข้อกำหนดและเงื่อนไข</Link>
              </label>
              {errors.acceptTerms && <span className="error-message">{errors.acceptTerms}</span>}
            </div>


            <div className="submit-button-container">
              <button type="submit" className="submit-button">ดำเนินการต่อ</button>
            </div>
          </form>
        </main>
      </div>
    </>
  );
};

export default RegistrationForm;
