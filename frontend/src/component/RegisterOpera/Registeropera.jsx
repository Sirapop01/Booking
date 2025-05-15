import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Registeropera.css";
import logo from '../assets/logo.png';
import { IoEyeSharp } from "react-icons/io5";
import { FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

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
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // ✅ แปลงเป็น YYYY-MM-DD
  };

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

  // ✅ ตรวจสอบเลขบัตรประชาชนให้ถูกต้อง
  const validateIdCard = (idCard) => {
    if (idCard.length !== 13) return false;

    let sum = 0;
    for (let i = 0; i < 12; i++) {
      sum += parseInt(idCard.charAt(i)) * (13 - i);
    }

    const checkDigit = (11 - (sum % 11)) % 10;
    return checkDigit === parseInt(idCard.charAt(12));
  };


  // ✅ ตรวจสอบข้อมูลก่อนส่ง
  const validateForm = () => {
    let newErrors = {};
    if (!formData.idCard) newErrors.idCard = "กรุณากรอกเลขบัตรประชาชน";
    else if (!validateIdCard(formData.idCard)) newErrors.idCard = "เลขบัตรประชาชนไม่ถูกต้อง";

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

  const sendOtp = async () => {
    try {
      Swal.fire({ title: 'กำลังส่ง OTP...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      await axios.post('http://localhost:4000/api/auth/send-otp', { email: formData.email });
      setOtpSent(true);
      setOtpSentTime(Date.now());
      Swal.fire('ส่ง OTP สำเร็จ', 'โปรดตรวจสอบอีเมล', 'success');
      return true; // ✅ ส่ง OTP สำเร็จ
    } catch (error) {
      const message = error.response?.data?.message || 'เกิดข้อผิดพลาด';
      Swal.fire('ส่ง OTP ไม่สำเร็จ', message, 'error');
      return false; // ✅ แจ้งว่าไม่ควรไปต่อ
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validateForm()) return;
  
    if (!otpSent) {
      const otpSentSuccess = await sendOtp();
      if (!otpSentSuccess) return; // ⛔ หยุดทันทีถ้าอีเมลซ้ำ หรือส่ง OTP ไม่ได้
    }
  
    let otpVerified = false;
    const otpExpiryTime = 5 * 60 * 1000;
  
    while (!otpVerified) {
      const currentTime = Date.now();
      const timeLeft = otpSentTime ? otpExpiryTime - (currentTime - otpSentTime) : otpExpiryTime;
  
      if (timeLeft <= 0) {
        const resendOtp = await Swal.fire({
          icon: 'warning',
          title: '⚠️ OTP หมดอายุแล้ว',
          text: 'กรุณาส่ง OTP อีกครั้ง',
          confirmButtonText: 'ส่ง OTP อีกครั้ง',
          cancelButtonText: 'ยกเลิก',
          showCancelButton: true,
          customClass: {
            popup: 'otp-popup',
            confirmButton: 'otp-popup-confirm-btn',
            cancelButton: 'otp-popup-cancel-btn',
          }
        });
  
        if (resendOtp.isConfirmed) {
          const resendSuccess = await sendOtp();
          if (!resendSuccess) return; // ⛔ หยุดถ้าส่ง OTP ใหม่ไม่สำเร็จ
          continue;
        } else {
          navigate('/login');
          return;
        }
      }
  
      const { value: otp, dismiss } = await Swal.fire({
        title: '<strong class="otp-swal-title">📧 ยืนยัน OTP</strong>',
        input: 'text',
        inputPlaceholder: 'รหัส OTP 6 หลัก',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน OTP',
        cancelButtonText: 'ยกเลิก',
        footer: `<span>OTP จะหมดอายุภายใน ${Math.floor(timeLeft / 60000)} นาที ${Math.floor((timeLeft % 60000) / 1000)} วินาที</span>`,
        inputAttributes: { maxlength: 6, autocapitalize: 'off', autocorrect: 'off', style: 'text-align:center;font-size:18px;' },
        customClass: {
          popup: 'otp-popup',
          input: 'otp-popup-input',
          confirmButton: 'otp-popup-confirm-btn',
          cancelButton: 'otp-popup-cancel-btn',
        },
        preConfirm: (otpValue) => {
          if (!otpValue || !/^\d{6}$/.test(otpValue)) {
            Swal.showValidationMessage('กรุณากรอก OTP เป็นตัวเลข 6 หลัก');
          }
          return otpValue;
        },
      });
  
      if (dismiss === Swal.DismissReason.cancel || dismiss === Swal.DismissReason.close) {
        Swal.fire('ยกเลิกการลงทะเบียน', 'ระบบจะนำคุณไปยังหน้า Login', 'info')
          .then(() => navigate('/login'));
        return;
      }
  
      try {
        await axios.post('http://localhost:4000/api/auth/verify-otp', { email: formData.email, otp });
        otpVerified = true;
      } catch (error) {
        Swal.fire('OTP ไม่ถูกต้อง', 'กรุณากรอก OTP อีกครั้ง', 'error');
      }
    }
  
    Swal.fire({ title: "กำลังสมัครสมาชิก...", allowOutsideClick: false, didOpen: () => Swal.showLoading() });
  
    try {
      const response = await axios.post("http://localhost:4000/api/business/register", formData);
    
      const { token } = response.data;
      if (token) {
        localStorage.setItem("token", token); // ✅ บันทึก token
      }
    
      Swal.fire('สำเร็จ!', 'ลงทะเบียนสำเร็จแล้ว', 'success')
        .then(() => navigate("/RegisterArena"));
    } catch (error) {
      Swal.fire('เกิดข้อผิดพลาด', error.response?.data?.message || 'ลองใหม่อีกครั้ง', 'error');
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
                <input type="date" name="dob" value={formData.dob} max={getCurrentDate()} onChange={handleChange} />
              </label>
            </div>

            <div className="form-group">
              <label>
                เบอร์โทรศัพท์มือถือ * {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                <input type="text" name="phoneNumber" value={formData.phoneNumber} maxLength="10" inputMode="numeric" onChange={handleChange} />
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
                  className="toggle-password-aeye"
                  onClick={() => setShowPassword(!showPassword)}
                >
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


            
              <button type="submit" className="submit-button-rehere">ดำเนินการต่อ</button>
            
          </form>
        </main>
      </div>
    </>
  );
};

export default RegistrationForm;
