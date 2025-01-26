import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RegisterCustomer.css';
import registerImage from '../assets/threeman.png'; 
import logo from '../assets/logo.png'

function RegisterCustomer() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [gender, setGender] = useState(''); // เพิ่ม state สำหรับเพศ
  const [phoneNumber, setPhoneNumber] = useState('');
  const [interestedSports, setInterestedSports] = useState('');
  const [province, setProvince] = useState(''); // เพิ่ม state สำหรับจังหวัด
  const [district, setDistrict] = useState(''); // เพิ่ม state สำหรับอำเภอ
  const [subdistrict, setSubdistrict] = useState(''); // เพิ่ม state สำหรับตำบล

  const handleRegister = () => {
    // TODO: ตรวจสอบข้อมูล (เช่น password ตรงกันหรือไม่) 
    // TODO: ส่งข้อมูลไปยัง backend (เช่น API) เพื่อบันทึกข้อมูลลง database
    console.log('Email:', email);
    console.log('Password:', password);
    // ... (log ข้อมูลอื่นๆ)
  };

  const handleGoBack = () => {
    navigate('/login'); // เปลี่ยน path ไปยังหน้า Login
  };

  return (
    <div className="container">
      <div className="left-side">
        <div className="image-container"> 
          <img src={registerImage} alt="Register" className="register-image" />
          <img src={logo} alt="Logo" className="logo-on-image" />
          <p className="logo-text-on-image">MatchWeb</p> 
        </div>
      </div>
      <div className="right-side">
        <h1 className="register-heading">ลงทะเบียน</h1>
        <div className="form-container">
          {/* ลบ input fields ออกทั้งหมด */}
          <button className="register-button" onClick={handleRegister}>
            ลงทะเบียน
          </button>
          <p className="login-link" onClick={handleGoBack}>
            กลับไปลงชื่อเข้าใช้
          </p>
        </div>
      </div>
    </div>
  );
}

export default RegisterCustomer;