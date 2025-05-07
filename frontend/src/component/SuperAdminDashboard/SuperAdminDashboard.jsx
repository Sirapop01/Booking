import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './SuperAdminDashboard.css'; 
import { FaUserPlus, FaCheckCircle, FaComments, FaSignOutAlt, FaFileInvoiceDollar, FaUsersCog } from "react-icons/fa";

function Dashboard() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const token = sessionStorage.getItem('token'); // ใช้ sessionStorage
    console.log("Token from sessionStorage:", token);

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);
        setRole(decoded.role);
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("No token found in sessionStorage");
    }
  }, []);

  // ฟังก์ชัน Logout
  const handleLogout = () => {
    sessionStorage.removeItem('token'); // ลบ Token
    navigate('/login'); // กลับไปที่หน้าล็อกอิน
  };

  return (
    <div className="superadmin-container">
      <div className="superadmin-box">
        {/* ✅ เปลี่ยนหัวข้อ Dashboard ตาม Role ✅ */}
        <h1 className="superadmin-title">
          {role === "superadmin" ? "Super Admin Dashboard" : "Admin Dashboard"}
        </h1>
        <p className="superadmin-subtitle">จัดการและดูแลระบบทั้งหมดของแพลตฟอร์ม</p>
        <div className="superadmin-button-group">

          {/* ✅ แสดงปุ่มสมัคร Admin เฉพาะ Superadmin ✅ */}
          {role === "superadmin" && (
            <button className="superadmin-button primary" onClick={() => navigate('/admin/register')}>
              <FaUserPlus style={{ marginRight: "8px" }} /> สมัคร Admin ใหม่
            </button>
          )}

          <button className="superadmin-button secondary" onClick={() => navigate('/verifyowners')}>
            <FaCheckCircle style={{ marginRight: "8px" }} /> ยืนยันข้อมูลผู้ประกอบการ
          </button>

          {/* ✅ ปุ่มจัดการบัญชีผู้ใช้ ✅ */}
          <button className="superadmin-button secondary" onClick={() => navigate('/ManageAccount')}>
            <FaUsersCog style={{ marginRight: "8px" }} /> จัดการบัญชีผู้ใช้
          </button>

          <button className="superadmin-button secondary" onClick={() => navigate('/AdminChat')}>
            <FaComments style={{ marginRight: "8px" }} /> ศูนย์ช่วยเหลือ
          </button>

          {/* ✅ ปุ่มตรวจสอบรายการบัญชี ✅ */}
          <button className="superadmin-button secondary" onClick={() => navigate('/AdminOwnersLedger')}>
            <FaFileInvoiceDollar style={{ marginRight: "8px" }} /> ตรวจสอบรายการบัญชี
          </button>

          {/* ปุ่ม Logout */}
          <button className="superadmin-button logout" onClick={handleLogout}>
            <FaSignOutAlt style={{ marginRight: "8px" }} /> ออกจากระบบ
          </button>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;
