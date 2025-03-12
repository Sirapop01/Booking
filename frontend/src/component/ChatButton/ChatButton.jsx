import React, { useState } from "react";
import { FaComment } from "react-icons/fa";
import ChatPopup from "../ChatPopup/ChatPopup";
import "./ChatButton.css";
import { jwtDecode } from "jwt-decode";

const ChatButton = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  let userId = null;
  let userType = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
      userType = decoded.role.toLowerCase(); // แปลงให้เป็น lowercase
    } catch (error) {
      console.error("❌ Error decoding token:", error);
    }
  }

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {userId ? (
        <>
          <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>
            <FaComment size={24} />
          </button>
          {isOpen && (
            <ChatPopup
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              userId={userId}
              userType={userType}
              receiverId={null} // ไม่ต้องกำหนด เพราะส่งไปหากลุ่ม
              receiverType="admin"
            />
          )}
        </>
      ) : (
        <p className="chat-error-message">กรุณาเข้าสู่ระบบเพื่อใช้งานแชท</p>
      )}
    </>
  );
};

export default ChatButton;
