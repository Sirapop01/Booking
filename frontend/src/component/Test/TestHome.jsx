import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode"; // เอา {} ออก เพราะ jwtDecode เป็น default export
import Test from "./Test";

const TestHome = () => {
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null); // เก็บ Token ที่ Decode แล้ว
  const [token, setToken] = useState(""); // เก็บ Token ที่ดึงจาก localStorage
  const [isAdmin, setIsAdmin] = useState(false); // เช็ค role

  useEffect(() => {
    // ดึง Token จาก Local Storage
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        // ถอดรหัส JWT Token
        const decoded = jwtDecode(storedToken);
        console.log("✅ Token Decoded:", decoded);

        // บันทึกค่า Token และข้อมูลที่ Decode ได้
        setToken(storedToken);
        setDecodedToken(decoded);

        // ตรวจสอบ Role
        CheckRole(decoded);
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        setDecodedToken(null);
      }
    }
  }, []); // ทำงานครั้งเดียวเมื่อ Component โหลด

  // ฟังก์ชันเช็ค Role
  const CheckRole = (decoded) => {
    if (decoded?.role === "admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  };

  return (
    <div className="container">
      {/* แสดง Test เฉพาะเมื่อ isAdmin เป็น true */}
      {isAdmin && <Test />}
    </div>
  );
};

export default TestHome;
