import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { FaTimes, FaPaperPlane } from "react-icons/fa";
import "./ChatPopup.css";

const socket = io.connect("http://localhost:4000");

const ChatPopup = ({ isOpen, onClose, userId, userType }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const chatBoxRef = useRef(null);

  // ✅ โหลดประวัติแชท
  // ✅ ฟังก์ชันโหลดประวัติแชททุก 5 วินาที (อัพเดตข้อความใหม่ตลอด)
  useEffect(() => {
    if (!isOpen || !userId || !userType) return;

    const userModel = userType === "customer" ? "User" : "BusinessOwner";

    const fetchMessages = () => {

      fetch(`http://localhost:4000/api/chat/history/${userId}/${userModel}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setMessages(data.data);
            scrollToBottom();
          }
        })
        .catch((err) => console.error("❌ Error loading chat history:", err));
    };

    fetchMessages(); // โหลดแชทครั้งแรก
    const interval = setInterval(fetchMessages, 5000); // รีเฟรชทุก 5 วินาที

    return () => clearInterval(interval);
  }, [isOpen, userId, userType]);

  // ✅ ฟังก์ชันส่งข้อความ
  const sendMessage = () => {
    if (!message.trim() || !userId) {
      console.error("❌ Cannot send message, missing userId or message is empty");
      return;
    }

    const newMessage = {
      senderId: userId,
      senderModel: userType === "customer" ? "User" : "BusinessOwner",
      senderRole: userType.toLowerCase(),
      receiverId: null, // ✅ ไม่ต้องกำหนด ID เพราะส่งไปที่กลุ่ม
      receiverModel: "Group",
      receiverRole: "admin",
      message,
      timestamp: new Date().toISOString(),
    };

    fetch("http://localhost:4000/api/chat/sendMessage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMessage),
    })
      .then((res) => res.json())
      .then((response) => {
        if (response.success) {
          console.log("✅ Message Sent Response:", response);
          setMessages((prev) => [...prev, response.data]);
          setMessage("");
          scrollToBottom();
          socket.emit("sendMessage", response.data); // ส่งข้อความใหม่ไปที่ socket
        } else {
          console.error("❌ Failed to send message:", response.message);
        }
      })
      .catch((err) => console.error("❌ Failed to send message:", err));
  };

  // ✅ รองรับข้อความเรียลไทม์ผ่าน WebSocket
  useEffect(() => {
    const handleReceiveMessage = (newMessage) => {
      setMessages((prev) => {
        if (!prev.some((msg) => msg._id === newMessage._id)) {
          return [...prev, newMessage]; // หากยังไม่มีข้อความนี้ใน messages, เพิ่มเข้าไป
        }
        return prev;
      });
      scrollToBottom();
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, []);

  // ✅ เลื่อนแชทลงล่างอัตโนมัติ
  const scrollToBottom = () => {
    setTimeout(() => {
      if (chatBoxRef.current) {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }, 100);
  };

  return (
    isOpen && (
      <div className="chat-popup">
        <div className="chat-header">
          <h4>แชทกับแอดมิน</h4>
          <FaTimes onClick={onClose} className="close-icon" />
        </div>
        <div className="chat-body" ref={chatBoxRef}>
          {messages.length === 0 ? (
            <p className="chat-placeholder">เริ่มต้นการสนทนา...</p>
          ) : (
            messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.senderId === userId ? "sent" : "received"}`}>
                {msg.message}
              </div>
            ))
          )}
        </div>
        <div className="chat-footer">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="พิมพ์ข้อความ..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>
            <FaPaperPlane />
          </button>
        </div>
      </div>
    )
  );
};

export default ChatPopup;
