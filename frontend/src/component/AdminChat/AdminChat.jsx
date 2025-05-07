import React, { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./AdminChat.css";
import homeLogo from "../assets/logoalt.png";
import sendIcon from "../assets/icons/send.png";
import { io } from "socket.io-client"; // เพิ่มบรรทัดนี้เพื่อเชื่อมต่อกับ Socket.io

const AdminChat = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chatEndRef = useRef(null);
  const navigate = useNavigate();

  // ✅ Toggle ระหว่าง Customers และ Owners
  const [activeCategory, setActiveCategory] = useState("customer");

  const getToken = () => {
    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    return token ? `Bearer ${token}` : null;
  };

  const token = getToken();
  const decoded = token ? jwtDecode(token) : null;
  const adminId = decoded?.id;
  const [newMessages, setNewMessages] = useState({});


  useEffect(() => {
    if (!token || !decoded) {
      console.warn("❌ No token found! Redirecting to login...");
      navigate("/login");
    }
  }, [token, decoded, navigate]);

  // ✅ โหลดรายชื่อผู้ใช้ที่มีแชท
  useEffect(() => {
    if (!token) return;
  
    const fetchUserList = () => {
      console.log("📡 Fetching chat users...");
      axios
        .get("http://localhost:4000/api/chat/chat-users", {
          headers: { Authorization: token },
        })
        .then((response) => {
          console.log("✅ Users list updated:", response.data.data);
  
          if (!Array.isArray(response.data.data)) {
            throw new Error("⚠️ API response format incorrect");
          }
  
          const processedUsers = response.data.data.map(user => ({
            ...user,
            name: user.name || user.businessName || user.email || "ไม่ทราบชื่อ",
          }));
  
          setUsers(processedUsers);
  
          // ถ้าไม่มี user ที่ถูกเลือกอยู่แล้ว ให้เลือกคนแรก
          if (!selectedUser || !processedUsers.some(u => u._id === selectedUser?._id)) {
            setSelectedUser(processedUsers[0] || null);
          }
        })
        .catch((error) => {
          console.error("❌ Error loading users:", error.response ? error.response.data : error.message);
        });
    };
  
    fetchUserList(); // โหลดรายชื่อครั้งแรก
    const userInterval = setInterval(fetchUserList, 5000); // รีเฟรชทุก 5 วินาที
  
    return () => clearInterval(userInterval); // ล้าง interval เมื่อ component ถูก unmount
  }, [token, selectedUser]);
  

  // ✅ กรอง Users ตามหมวดหมู่ที่เลือก
  const filteredUsers = users.filter((user) => {
    if (activeCategory === "customer") return user.role === "customer";
    if (activeCategory === "owner") return user.role === "owner"; // ปรับเป็น "owner"
    return false;
  });
  console.log("📢 Filtering Users for:", activeCategory);
  console.log("✅ Filtered Users:", filteredUsers);

  // ✅ ดึงประวัติแชทของผู้ใช้ที่เลือก
  const fetchMessages = useCallback(() => {
    if (!selectedUser || !selectedUser._id || !token) {
      console.warn("⚠️ fetchMessages skipped due to missing parameters", {
        selectedUser,
        token
      });
      return;
    }

    console.log("📡 Fetching chat history for:", {
      userId: selectedUser._id,
      userModel: selectedUser.role === "customer" ? "User" : "BusinessOwner" // ใช้ BusinessOwner สำหรับ Owner
    });

    axios.get(`http://localhost:4000/api/chat/history/${selectedUser._id}/${selectedUser.role === "customer" ? "User" : "BusinessOwner"}`, {
      headers: { Authorization: token }
    })
    .then((response) => {
      console.log("✅ Chat history received:", response.data);
      setMessages(response.data.data || []);
    })
    .catch((error) => {
      console.error("❌ Error fetching chat history:", error);
    });
  }, [selectedUser, token]);

  // ✅ การตั้งค่า Socket.io
  useEffect(() => {
    const socket = io("http://localhost:4000"); // เชื่อมต่อกับเซิร์ฟเวอร์ WebSocket
  
    socket.on("receiveMessage", (newMessage) => {
      console.log("📩 New message received:", newMessage);
  
      // ✅ ตรวจสอบว่าแชทที่ได้รับมาจาก User จริง ๆ
      const senderId = newMessage.senderId || newMessage.userId; 
  
      // ✅ ถ้าแชทที่เปิดอยู่เป็นของ senderId → ไม่ต้องแจ้งเตือน
      if (selectedUser && selectedUser._id === senderId) {
        return;
      }
  
      // ✅ อัปเดต state เพื่อบอกว่า userId นี้มีข้อความใหม่
      setNewMessages((prev) => ({
        ...prev,
        [senderId]: true, // เพิ่ม userId ที่มีข้อความใหม่
      }));
    });
  
    return () => {
      socket.off("receiveMessage"); // Cleanup WebSocket เมื่อ component ถูก unmount
    };
  }, [selectedUser]);
  

  // ✅ Scroll ไปยังข้อความล่าสุด
  useEffect(() => {
    console.log("Updated Messages:", messages); // เพิ่ม console.log เพื่อตรวจสอบค่าของ messages
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // ใช้ messages เป็น dependency

  // ✅ ส่งข้อความ
  const sendMessageToUserOrOwner = () => {
    if (!newMessage.trim() || !selectedUser || !decoded?.id) {
      console.error("❌ Missing required fields for sending message:", {
        newMessage,
        selectedUser,
        senderId: decoded?.id,
      });
      return;
    }

    console.log("📡 Sending message:", {
      userId: selectedUser?._id,
      content: newMessage,
    });

    const payload = {
      senderId: decoded.id,
      senderModel: "Admin",
      senderRole: "admin",
      receiverId: selectedUser?._id, // ส่งไปยังผู้ใช้หรือเจ้าของสนาม
      receiverModel: selectedUser.role === "customer" ? "User" : "BusinessOwner",
      receiverRole: selectedUser.role,
      message: newMessage,
    };

    axios
      .post("http://localhost:4000/api/chat/sendMessageToUserOrOwner", payload, {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log("✅ Message sent successfully:", response.data);
        setMessages((prevMessages) => [...prevMessages, response.data.data]);
        setNewMessage("");
      })
      .catch((error) => {
        console.error("❌ Error sending message:", error.response ? error.response.data : error.message);
        setError("ไม่สามารถส่งข้อความได้ กรุณาลองใหม่!");
      });
  };

  useEffect(() => {
    if (!selectedUser) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);

    return () => clearInterval(interval);
  }, [selectedUser, fetchMessages]);
  

  return (
    <div className="admin-chat-container">
      
      <header className="admin-chat-header">
        <a href="/superadmin/dashboard" className="home-button">
          <img src={homeLogo} alt="Home Logo" className="home-logo" />
        </a>
        <h1 className="page-title2">ศูนย์ช่วยเหลือ</h1>
      </header>


        

     
      <div className="chat-layout">
  {/* 🔵 User List Container */}
  <div className="user-list-container2">
    
    {/* ✅ ปุ่ม Toggle ลูกค้า / เจ้าของสนาม */}
    <div className="category-toggle">
      <button
        className={activeCategory === "customer" ? "active" : ""}
        onClick={() => setActiveCategory("customer")}
      >
        ลูกค้า
      </button>
      <button
        className={activeCategory === "owner" ? "active" : ""}
        onClick={() => setActiveCategory("owner")}
      >
        เจ้าของสนาม
      </button>
    </div>

    {/* ✅ รายชื่อผู้ใช้ */}
    <div className="user-list2">
      <div className="list-header2">ผู้ใช้</div>
      {filteredUsers.map((user) => (
        <div
          key={user._id}
          className={`user-item2 ${selectedUser?._id === user._id ? "selected" : ""}`}
          onClick={() => {
            setSelectedUser(user);
            setNewMessages((prev) => ({
              ...prev,
              [user._id]: false, 
            }));
          }}
        >
          {user.name || user.email || "ไม่ทราบชื่อ"}
          {newMessages[user._id] && <span className="chat-notification-dot"></span>}
        </div>            
      ))}
    </div>
  </div>

  {/* 🟠 Chat Box Container */}
  <div className="chat-box-container2">
    <div className="chat-box">
      <div className="chat-header">
        {selectedUser ? `แชทกับ ${selectedUser.name || selectedUser.email}` : "เลือกผู้ใช้"}
      </div>
      <div className="chat-messages">
        {messages.length > 0
          ? messages.map((msg, index) => (
              <div key={index} className={`chat-message ${msg.senderRole === "admin" ? "admin-message" : "user-message"}`}>
                <span>{msg.message}</span>
              </div>
            ))
          : <div className="no-messages">📭 ไม่มีข้อความ</div>}
      </div>
    </div>

    <div className="message-input">
      <input 
        type="text" 
        placeholder="พิมพ์ข้อความ..." 
        value={newMessage} 
        onChange={(e) => setNewMessage(e.target.value)} 
        onKeyDown={(e) => e.key === "Enter" && sendMessageToUserOrOwner()} 
        disabled={!selectedUser} 
      />
      <button onClick={sendMessageToUserOrOwner} disabled={!selectedUser}>
        <img src={sendIcon} alt="Send" />
      </button>
    </div>
  </div>
</div>
</div>

    
  );
};

export default AdminChat;
