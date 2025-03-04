import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ ใช้ Navigate สำหรับ Redirect
import "./AdminChat.css";
import homeLogo from "../assets/logoalt.png";
import sendIcon from "../assets/icons/send.png"; // ไอคอนส่งข้อความ

const AdminChat = () => {
  const [users, setUsers] = useState([]); // รายชื่อผู้ใช้
  const [selectedUser, setSelectedUser] = useState(null); // ผู้ใช้ที่ถูกเลือก
  const [messages, setMessages] = useState([]); // รายการข้อความ
  const [newMessage, setNewMessage] = useState(""); // ข้อความใหม่
  const [loading, setLoading] = useState(true); // ✅ สถานะ Loading
  const [error, setError] = useState(null); // ✅ สถานะ Error
  const chatEndRef = useRef(null); // ✅ ใช้สำหรับเลื่อน Scrollbar ไปยังข้อความล่าสุด
  const navigate = useNavigate(); // ✅ ใช้สำหรับ Redirect

  // ✅ ฟังก์ชันดึง Token อย่างปลอดภัย
  const getToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    console.log("🔍 Token from Storage:", token); // Debug
    return token ? `Bearer ${token}` : null;
  };  
  const token = getToken();

  console.log("🔍 Token from Storage:", token); // ✅ Debug Token

  // ✅ ถ้าไม่มี Token ให้ Redirect ไปหน้า Login
  useEffect(() => {
    if (!token) {
      console.warn("❌ No token found! Redirecting to login...");
      navigate("/login"); 
    }
  }, [token, navigate]);

  // ✅ โหลดรายชื่อผู้ใช้จาก API
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    console.log("📡 Fetching users with token:", token);
    
    axios.get("http://localhost:4000/api/chat/chat-users", {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log("✅ Users received:", response.data);
      setUsers(response.data);
      if (response.data.length > 0) {
        setSelectedUser(response.data[0]);
      }
    })
    .catch((error) => {
      console.error("❌ Error fetching users:", error.response ? error.response.data : error.message);
      setError("เกิดข้อผิดพลาดในการโหลดรายชื่อผู้ใช้");
    })
    .finally(() => setLoading(false));
  }, [token]);

  // ✅ โหลดข้อความแชทเมื่อเลือกผู้ใช้ใหม่ หรืออัปเดตทุก 3 วินาที
  const fetchMessages = useCallback(() => {
    if (!selectedUser || !token) return;

    console.log("📡 Fetching chat history for:", selectedUser?._id);
    
    axios.get(`http://localhost:4000/api/chat/chat-history/${selectedUser?._id}`, {
      headers: { Authorization: token },
    })
    .then((response) => {
      console.log("✅ Chat history received:", response.data);
      setMessages(response.data);
    })
    .catch((error) => {
      console.error("❌ Error fetching chat history:", error.response ? error.response.data : error.message);
      setError("เกิดข้อผิดพลาดในการโหลดแชท");
    });
  }, [selectedUser, token]);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 3000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  // ✅ ฟังก์ชันส่งข้อความ
  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    console.log("📡 Sending message:", { userId: selectedUser?._id, content: newMessage });

    axios.post(`http://localhost:4000/api/chat/chat/${selectedUser?._id}`, 
      { sender: "admin", content: newMessage },
      { headers: { Authorization: token } }
    )
    .then((response) => {
      console.log("✅ Message sent successfully:", response.data);
      setMessages((prevMessages) => [...prevMessages, response.data]);
      setNewMessage("");
    })
    .catch((error) => {
      console.error("❌ Error sending message:", error.response ? error.response.data : error.message);
      setError("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่!");
    });
  };

  // ✅ เลื่อน Scrollbar ไปที่ข้อความล่าสุดเมื่อมีข้อความใหม่
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="admin-chat-container">
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      <h1 className="page-title2">ศูนย์ช่วยเหลือ</h1>

      <div className="chat-content">
        <div className="user-list-container2">
          <div className="user-list2">
            <div className="list-header2">ผู้ใช้</div>
            {loading ? (
              <div className="loading">⏳ กำลังโหลด...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : users.length > 0 ? (
              users.map((user) => (
                <div
                  key={user._id}
                  className={`user-item2 ${selectedUser?._id === user._id ? "selected" : ""}`}
                  onClick={() => setSelectedUser(user)}
                >
                  {user.firstName} {user.lastName}
                </div>
              ))
            ) : (
              <div className="no-users">⚠️ ไม่มีผู้ใช้ที่มีแชท</div>
            )}
          </div>
        </div>

        <div className="chat-box-container2">
          <div className="chat-box">
            <div className="chat-header">
              {selectedUser ? `แชทกับ ${selectedUser.firstName} ${selectedUser.lastName}` : "เลือกผู้ใช้"}
            </div>
            <div className="chat-messages">
              {error ? (
                <div className="error-message">{error}</div>
              ) : messages.length > 0 ? (
                messages.map((msg, index) => (
                  <div key={index} className={`chat-message ${msg.sender === "admin" ? "admin-message" : "user-message"}`}>
                    <span>{msg.content}</span>
                  </div>
                ))
              ) : (
                <div className="no-messages">📭 ไม่มีข้อความ</div>
              )}
              <div ref={chatEndRef} />
            </div>

            <div className="message-input">
              <input
                type="text"
                placeholder="พิมพ์ข้อความ..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                disabled={!selectedUser}
              />
              <button onClick={sendMessage} disabled={!selectedUser}>
                <img src={sendIcon} alt="Send" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminChat;
