import React from 'react';
import { useNavigate } from 'react-router-dom';
import './SuperAdminDashboard.css'; // นำเข้าไฟล์ CSS

function SuperAdminDashboard() {
  const navigate = useNavigate();

  return (
    <div className="superadmin-container">
      <div className="superadmin-box">
        <h1 className="superadmin-title">Super Admin Dashboard</h1>
        <p className="superadmin-subtitle">จัดการและดูแลระบบทั้งหมดของแพลตฟอร์ม</p>
        <div className="superadmin-button-group">
          <button className="superadmin-button primary" onClick={() => navigate('/admin/register')}>
            ➕ สมัคร Admin ใหม่
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;
