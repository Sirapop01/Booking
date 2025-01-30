import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ใช้สำหรับถอดรหัส JWT

const Test = () => {
  const navigate = useNavigate();
  const [decodedToken, setDecodedToken] = useState(null); // เก็บ Token ที่ Decode แล้ว
  const [token, setToken] = useState(""); // เก็บ Token ที่ดึงจาก localStorage

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
      } catch (error) {
        console.error("❌ Error decoding token:", error);
        setDecodedToken(null);
      }
    }
  }, []); // [] ทำให้ useEffect ทำงานครั้งเดียวเมื่อ Component โหลด

  return (
    <div className="container">
      <h1>MatchWeb</h1>
      {token ? (
        <>
          <p>🔑 **Token:** {token}</p>
          {decodedToken ? (
            <>
              <p>👤 **อีเมล:** {decodedToken.email}</p>
              <p>🆔 **name:** {decodedToken.name}</p>
              <p>⏳ **หมดอายุ:** {new Date(decodedToken.exp * 1000).toLocaleString()}</p>
            </>
          ) : (
            <p>❌ **ไม่สามารถถอดรหัส Token ได้**</p>
          )}
        </>
      ) : (
        <p>🔑 **ไม่พบ Token ใน Local Storage**</p>
      )}

      <button onClick={() => navigate("/login")}>🔙 กลับหน้าlogin</button>
      <button onClick={() => navigate("/profile")}>🔙 กลับหน้าprofile</button>
    </div>
  );
};

export default Test;
