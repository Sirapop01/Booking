import React, { useState, useEffect } from "react";
import { FaComment } from "react-icons/fa";
import ChatPopup from "../ChatPopup/ChatPopup";
import "./ChatButton.css";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";

const socket = io.connect("http://localhost:4000"); // เชื่อมต่อ Socket.io

const ChatButton = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  let userId = null;
  let userType = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id;
      userType = decoded.role.toLowerCase(); // แปลงเป็น lowercase
    } catch (error) {
      console.error("❌ Error decoding token:", error);
    }
  }

  const [isOpen, setIsOpen] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  // ✅ โหลดจำนวนข้อความล่าสุด
  const fetchMessageCount = () => {
    if (!userId) return;

    fetch(`http://localhost:4000/api/chat/history/${userId}/${userType === "customer" ? "User" : "BusinessOwner"}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const newCount = data.data.length;
          console.log(`📩 Loaded Messages: ${newCount}, Previous: ${messageCount}`);

          // ✅ ถ้า ChatPopup ไม่ได้เปิดอยู่ และมีข้อความใหม่ → แสดงจุดแจ้งเตือน
          if (!isOpen && newCount > messageCount) {
            setHasNewMessage(true);
            console.log("🔴 Showing notification dot!");
          }

          setMessageCount(newCount);
        }
      })
      .catch((err) => console.error("❌ Error loading message count:", err));
  };

  // ✅ โหลดจำนวนข้อความใหม่ทุก 5 วินาที
  useEffect(() => {
    fetchMessageCount(); // โหลดครั้งแรก
    const interval = setInterval(fetchMessageCount, 5000);
    return () => clearInterval(interval);
  }, [userId, isOpen]);

  // ✅ รับข้อความใหม่ผ่าน WebSocket
  useEffect(() => {
    if (!userId) return;

    socket.on("receiveMessage", (newMessage) => {
      console.log("📩 New message received:", newMessage);

      // ✅ ถ้า ChatPopup ไม่ได้เปิดอยู่ → แสดงจุดแจ้งเตือน
      if (!isOpen) {
        setHasNewMessage(true);
        console.log("🔴 Showing notification dot!");
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [isOpen, userId]);

  return (
    <>
      {userId ? (
        <>
          <button className="chat-button" onClick={() => {
            setIsOpen(!isOpen);
            setHasNewMessage(false); // ✅ ปิดแจ้งเตือนเมื่อเปิด ChatPopup
          }}>
            <FaComment size={24} />
            {hasNewMessage && <span className="chat-notification-dot"></span>}
          </button>
          {isOpen && (
            <ChatPopup
              isOpen={isOpen}
              onClose={() => setIsOpen(false)}
              userId={userId}
              userType={userType}
              receiverId={null}
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
