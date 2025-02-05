import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AdminChat.css";
import homeLogo from "../assets/logoalt.png";
import sendIcon from "../assets/icons/send.png"; // ไอคอนส่งข้อความ

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // ✅ โหลดรายชื่อผู้ใช้จาก API
  useEffect(() => {
    axios.get("http://localhost:4000/api/chat-users")
      .then(response => {
        setUsers(response.data);
        if (response.data.length > 0) {
          setSelectedUser(response.data[0]); // เลือกผู้ใช้แรกเป็นค่าเริ่มต้น
        }
      })
      .catch(error => console.error("Error fetching users:", error));
  }, []);

  // ✅ โหลดข้อความแชทเมื่อเลือกผู้ใช้ใหม่
  useEffect(() => {
    if (selectedUser) {
      axios.get(`http://localhost:4000/api/chat-history/${selectedUser._id}`)
        .then(response => setMessages(response.data))
        .catch(error => console.error("Error fetching messages:", error));
    }
  }, [selectedUser]);

  // ✅ ฟังก์ชันส่งข้อความ
  const sendMessage = () => {
    if (newMessage.trim() === "") return;
    
    const messageData = {
      sender: "admin",
      content: newMessage,
      timestamp: new Date().toISOString(),
    };

    axios.post(`http://localhost:4000/api/chat/${selectedUser._id}`, messageData)
      .then(response => {
        setMessages([...messages, response.data]); // เพิ่มข้อความใหม่ลง UI
        setNewMessage("");
      })
      .catch(error => console.error("Error sending message:", error));
  };

  return (
    <div className="admin-chat-container">
      {/* 🔙 ปุ่มกลับไปยังหน้า Home */}
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      <h1 className="page-title2">ศูนย์ช่วยเหลือ</h1>

      <div className="chat-content">
        {/* 📜 รายชื่อผู้ใช้ */}
        <div className="user-list-container2">
          <div className="user-list2">
            <div className="list-header2">ผู้ใช้</div>
            {users.map((user) => (
              <div
                key={user._id}
                className={`user-item2 ${selectedUser?._id === user._id ? "selected" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                {user.username}
              </div>
            ))}
          </div>
        </div>

        {/* 💬 Chat Box */}
        <div className="chat-box-container2">
          <div className="chat-box">
            <div className="chat-header">แชท</div>
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-message ${msg.sender === "admin" ? "admin-message" : "user-message"}`}>
                  <span>{msg.content}</span>
                </div>
              ))}
            </div>
            
            {/* ✅ กล่องป้อนข้อความ */}
            <div className="message-input">
              <input
                type="text"
                placeholder="พิมพ์ข้อความ..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              />
              <button onClick={sendMessage}>
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
