import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterCustomer.css';
import logo from '../assets/logo.png';
import axios from 'axios';
import Swal from 'sweetalert2';
function RegisterCustomer() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpSentTime, setOtpSentTime] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    gender: '',
    phoneNumber: '',
    birthdate: '',
    interestedSports: '',
    province: '',
    district: '',
    subdistrict: '',
    profileImage: null,
    role: 'customer',
  });

  const [errors, setErrors] = useState({});
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [subdistricts, setSubdistricts] = useState([]);

  // ✅ โหลดรายชื่อจังหวัดจาก API เมื่อ Component โหลด
  useEffect(() => {
    axios.get("http://localhost:4000/api/location/provinces")
      .then((res) => setProvinces(res.data))
      .catch((err) => console.error("❌ Error fetching provinces:", err));
  }, []);

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0]; // ✅ แปลงเป็น YYYY-MM-DD
  };

  // ✅ โหลดรายชื่ออำเภอเมื่อเปลี่ยนจังหวัด
  const handleProvinceChange = async (e) => {
    const provinceName = e.target.value;
    setFormData({ ...formData, province: provinceName, district: "", subdistrict: "" });

    try {
      const res = await axios.get(`http://localhost:4000/api/location/districts/${encodeURIComponent(provinceName)}`);
      setDistricts(res.data);
      setSubdistricts([]); // รีเซ็ตตำบล
    } catch (error) {
      console.error("❌ Error fetching districts:", error);
    }
  };


  // ✅ โหลดรายชื่อตำบลเมื่อเปลี่ยนอำเภอ
  const handleDistrictChange = async (e) => {
    const districtId = e.target.value;
    setFormData({ ...formData, district: districtId, subdistrict: "" });

    try {
      const res = await axios.get(`http://localhost:4000/api/location/subdistricts/${formData.province}/${districtId}`);
      setSubdistricts(res.data);
    } catch (error) {
      console.error("❌ Error fetching subdistricts:", error);
    }
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.profileImage) newErrors.profileImage = "กรุณาใส่รูปโปรไฟล์";
    if (!formData.firstName) newErrors.firstName = "กรุณากรอกชื่อจริง";
    if (!formData.lastName) newErrors.lastName = "กรุณากรอกนามสกุล";
    if (!formData.email) {
      newErrors.email = "กรุณากรอกอีเมล";
    } else if (!formData.email.endsWith("@gmail.com")) {
      newErrors.email = "อีเมลต้องเป็น @gmail.com เท่านั้น";
    }
    if (!formData.phoneNumber) newErrors.phoneNumber = "กรุณากรอกเบอร์โทรศัพท์";
    if (!formData.password) newErrors.password = "กรุณากรอกรหัสผ่าน";
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = "รหัสผ่านไม่ตรงกัน";
    if (!formData.birthdate) newErrors.birthdate = "กรุณาเลือกวัน/เดือน/ปีเกิด";
    if (!formData.interestedSports) newErrors.interestedSports = "กรุณากรอกกีฬาที่สนใจ";
    if (!formData.province || !formData.district || !formData.subdistrict) newErrors.location = "กรุณากรอกข้อมูลที่อยู่ให้ครบ";
    if (!formData.gender) newErrors.gender = "กรุณาเลือกเพศ";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "province") {
      setFormData({ ...formData, province: value, district: "", subdistrict: "" });
      setDistricts([]);
      setSubdistricts([]);

      try {
        const res = await axios.get(`http://localhost:4000/api/location/districts/${value}`);
        setDistricts(res.data);
      } catch (error) {
        console.error("❌ Error fetching districts:", error);
      }
    }

    if (name === "district") {
      setFormData({ ...formData, district: value, subdistrict: "" });
      setSubdistricts([]);

      try {
        const res = await axios.get(`http://localhost:4000/api/location/subdistricts/${formData.province}/${value}`);
        setSubdistricts(res.data);
      } catch (error) {
        console.error("❌ Error fetching subdistricts:", error);
      }
    }
  };

  const handleActualRegister = async () => {
    try {
      const submitFormData = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'confirmPassword') submitFormData.append(key, value);
      });

      await axios.post('http://localhost:4000/api/auth/register', submitFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire("สมัครสมาชิกสำเร็จ!", "คุณสามารถเข้าสู่ระบบได้ทันที", "success")
        .then(() => navigate('/login'));

    } catch (err) {
      Swal.fire("เกิดข้อผิดพลาด", err.response?.data?.message, "error");
    }
  };


  const handleRegister = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const sendOtp = async () => {
      Swal.fire({
        title: 'กำลังส่ง OTP...',
        text: 'โปรดรอสักครู่',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      try {
        await axios.post('http://localhost:4000/api/auth/send-otp', { email: formData.email });
        setOtpSent(true);
        setOtpSentTime(Date.now());
        Swal.close();
        return true;
      } catch (error) {
        const message = error.response?.data?.message || 'ลองใหม่อีกครั้ง';
        Swal.fire('❌ ส่ง OTP ไม่สำเร็จ', message, 'error');

        if (message.includes("อีเมลนี้ถูกใช้งานแล้ว")) {
          return false; // ⛔ บอกให้ handleRegister หยุด
        }

        return false;
      }
    };


    if (!otpSent) {
      const otpSentSuccess = await sendOtp();
      if (!otpSentSuccess) return; // ⛔ หยุด flow ถ้าส่ง OTP ไม่ได้ (เช่น อีเมลซ้ำ)
    }


    let otpVerified = false;
    const otpExpiryTime = 5 * 60 * 1000; // 5 นาที

    while (!otpVerified) {
      const currentTime = Date.now();
      const timeLeft = otpSentTime ? (otpExpiryTime - (currentTime - otpSentTime)) : otpExpiryTime;

      if (timeLeft <= 0) {
        const resendOtp = await Swal.fire({
          icon: 'warning',
          title: '⚠️ OTP หมดอายุแล้ว',
          text: 'กรุณาส่ง OTP อีกครั้ง',
          confirmButtonText: 'ส่ง OTP อีกครั้ง',
          cancelButtonText: 'ยกเลิก',
          showCancelButton: true,
          confirmButtonColor: '#2E4374',
        });

        if (resendOtp.isConfirmed) {
          await sendOtp();
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
        inputAttributes: {
          maxlength: 6,
          autocapitalize: 'off',
          autocorrect: 'off',
          style: 'text-align:center;font-size:18px;',
        },
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

      if (otp) {
        Swal.fire({
          title: 'กำลังตรวจสอบ OTP...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        try {
          await axios.post('http://localhost:4000/api/auth/verify-otp', {
            email: formData.email,
            otp,
          });
          Swal.close();
          otpVerified = true;
        } catch (error) {
          Swal.fire({
            icon: 'error',
            title: '❌ OTP ไม่ถูกต้อง',
            text: error.response?.data?.message || 'ลองอีกครั้ง',
            confirmButtonText: 'ตกลง',
          });
        }
      }
    }

    Swal.fire({
      title: 'กำลังบันทึกข้อมูล...',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });

    try {
      await handleActualRegister();
      Swal.close();
    } catch (error) {
      Swal.fire('❌ เกิดข้อผิดพลาด', error.response?.data?.message || 'ลองใหม่อีกครั้ง', 'error');
    }
  };




  const sportsOptions = [
    "Football",
    "Basketball",
    "Badminton",
    "Tennis",
    "Volleyball",
    "Table Tennis",
    "Boxing",
    "Bowling",
    "Golf"
  ];

  const handleSportChange = (e) => {
    setFormData({ ...formData, interestedSports: e.target.value });
  };


  return (
    <div className="container1">
      <div className="right-side">
        <header className="register-header">
          <h1>
            <img src={logo} alt="MatchWeb Logo" className="register-logo" />
            <span>MatchWeb</span> {/* 🔹 ใส่ <span> เพื่อให้ขยับเฉพาะข้อความ */}
          </h1>
          <p>ระบบลงทะเบียนสำหรับผู้ใช้งาน</p>
        </header>

        <h2 className="register-heading">ยืนยันข้อมูลการสมัครสมาชิกสำหรับผู้ใช้งาน</h2>
        <p className="subtext">กรุณากรอกข้อมูลและตรวจสอบให้ครบถ้วน</p>
        <form onSubmit={handleRegister}>
          <div className="profile-gender-phone-container">
            <div className="profile-section">
              <label>รูปโปรไฟล์ *{errors.profileImage && <span className="error-message-register">{errors.profileImage}</span>}</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
              />
            </div>
            <div className="gender-section">
              <label>เพศ *{errors.gender && <span className="error-message-register">{errors.gender}</span>}</label>
              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">-- กรุณาเลือกเพศ --</option>
                <option value="ชาย">ชาย</option>
                <option value="หญิง">หญิง</option>
                <option value="อื่นๆ">อื่นๆ</option>
              </select>
            </div>
            <div className="phone-section">
              <label>เบอร์โทรศัพท์มือถือ *{errors.phoneNumber && <span className="error-message-register">{errors.phoneNumber}</span>}</label>
              <input type="tel" name="phoneNumber" value={formData.phoneNumber} inputMode="numeric" maxLength="10" onChange={handleChange} />
            </div>
          </div>

          <div className="form-container1414">
            <div className="form-column">
              <label>ชื่อจริง *{errors.firstName && <span className="error-message-register">{errors.firstName}</span>}</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
              <label>นามสกุล *{errors.lastName && <span className="error-message-register">{errors.lastName}</span>}</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
              <label>กีฬาที่สนใจ *</label>
              <select
                name="interestedSports"
                value={formData.interestedSports || ""}
                onChange={handleSportChange}
              >
                <option value="">-- เลือกกีฬา --</option>
                {sportsOptions.map((sport) => (
                  <option key={sport} value={sport}>
                    {sport}
                  </option>
                ))}
              </select>
              <label>วัน/เดือน/ปีเกิด *{errors.birthdate && <span className="error-message-register">{errors.birthdate}</span>}</label>
              <input type="date" name="birthdate" value={formData.birthdate} max={getCurrentDate()} onChange={handleChange} />
            </div>

            <div className="form-column">
              <label>อีเมล *{errors.email && <span className="error-message-register">{errors.email}</span>}</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
              <label>รหัสผ่าน *{errors.password && <span className="error-message-register">{errors.password}</span>}</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} />
              <label>ยืนยันรหัสผ่าน *{errors.confirmPassword && <span className="error-message-register">{errors.confirmPassword}</span>}</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
              <label>จังหวัด / อำเภอ / ตำบล *{errors.location && <span className="error-message-register">{errors.location}</span>}</label>
              <div className="location-container">
                <label>จังหวัด</label>
                <select name="province" value={formData.province} onChange={handleChange}>
                  <option value="">เลือกจังหวัด</option>
                  {provinces.map((province) => (
                    <option key={province.id} value={province.name_th}>{province.name_th}</option>
                  ))}
                </select>

                <label>อำเภอ</label>
                <select name="district" value={formData.district} onChange={handleChange} disabled={!districts.length}>
                  <option value="">เลือกอำเภอ</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.name_th}>{district.name_th}</option>
                  ))}
                </select>

                <label>ตำบล</label>
                <select name="subdistrict" value={formData.subdistrict} onChange={(e) => setFormData({ ...formData, subdistrict: e.target.value })} disabled={!subdistricts.length}>
                  <option value="">เลือกตำบล</option>
                  {subdistricts.map((subdistrict) => (
                    <option key={subdistrict.id} value={subdistrict.name_th}>{subdistrict.name_th}</option>
                  ))}
                </select>

              </div>
            </div>
          </div>
          <div className="button-container">
            <button type="submit" className="register-button">ลงทะเบียน</button>
          </div>
        </form>
      </div>
    </div>
  );


}

export default RegisterCustomer;