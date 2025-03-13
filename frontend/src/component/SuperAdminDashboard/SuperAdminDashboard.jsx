import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuperAdminDashboard.css'; // นำเข้าไฟล์ CSS
import { FaUserPlus, FaCheckCircle, FaComments } from "react-icons/fa";

function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="superadmin-container">
      <div className="superadmin-box">
        <h1 className="superadmin-title">Super Admin Dashboard</h1>
        <p className="superadmin-subtitle">จัดการและดูแลระบบทั้งหมดของแพลตฟอร์ม</p>
        <div className="superadmin-button-group">
        <button className="superadmin-button primary" onClick={() => navigate('/admin/register')}>
  <FaUserPlus style={{ marginRight: "8px" }} /> สมัคร Admin ใหม่
</button>

<button className="superadmin-button secondary" onClick={() => navigate('/verifyowners')}>
  <FaCheckCircle style={{ marginRight: "8px" }} /> ยืนยันข้อมูลผู้ประกอบการ
</button>

<button className="superadmin-button secondary" onClick={() => navigate('/AdminChat')}>
  <FaComments style={{ marginRight: "8px" }} /> Admin Chat
</button>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
