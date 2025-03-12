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

  useEffect(() => {
    if (!token || !decoded) {
      console.warn("❌ No token found! Redirecting to login...");
      navigate("/login");
    }
  }, [token, decoded, navigate]);
  
  // ✅ โหลดรายชื่อผู้ใช้ที่มีแชท
  useEffect(() => {
    if (!token) return;

    setLoading(true);
    console.log("📡 Fetching all chat users with token:", token);

    axios
      .get("http://localhost:4000/api/chat/chat-users", {
        headers: { Authorization: token },
      })
      .then((response) => {
        console.log("✅ Users received from API:", response.data.data);

        if (!Array.isArray(response.data.data)) {
          throw new Error("รูปแบบข้อมูลจาก API ไม่ถูกต้อง");
        }

        // ✅ ตรวจสอบ `user.role` ก่อนใช้ `map()`
        response.data.data.forEach(user => {
          console.log("🔍 Checking user:", user);
        });

        // ✅ ตรวจสอบให้แน่ใจว่า name มีค่าถูกต้อง
        const processedUsers = response.data.data.map(user => ({
          ...user,
          name: user.name || user.businessName || user.email || "ไม่ทราบชื่อ"
        }));

        console.log("✅ Processed Users:", processedUsers);

        setUsers(processedUsers);

        if (processedUsers.length > 0 && processedUsers[0]._id) {
          setSelectedUser(processedUsers[0]);
        } else {
          setSelectedUser(null);
        }
      })
      .catch((error) => {
        console.error("❌ Error fetching users:", error.response ? error.response.data : error.message);
        setError("เกิดข้อผิดพลาดในการโหลดรายชื่อผู้ใช้");
      })
      .finally(() => setLoading(false));

}, [token]);


  // ✅ กรอง Users ตามหมวดหมู่ที่เลือก

    const filteredUsers = users.filter((user) => {
      if (activeCategory === "customer") return user.role === "customer";
      if (activeCategory === "owner") return user.role === "owner"; // ปรับเป็น "owner"
      return false;
    });     
  console.log("📢 Filtering Users for:", activeCategory);
  console.log("✅ Filtered Users:", filteredUsers);


  // ✅ ดึงประวัติแชทของผู้ใช้ที่เลือก
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
  const socket = io("http://localhost:4000"); // ใช้ URL ของ server ของคุณ

  // เมื่อมีข้อความใหม่เข้ามา
  socket.on("receiveMessage", (newMessage) => {
    console.log("📡 New message received:", newMessage);
    setMessages((prevMessages) => [...prevMessages, newMessage]); // เพิ่มข้อความใหม่ใน messages
  });

  // Cleanup function เพื่อลบ socket เมื่อ component ถูก unmount
  return () => {
    socket.disconnect();
  };
}, []); // ใช้ [] เพื่อให้ทำงานแค่ครั้งเดียวเมื่อ component โหลด

// ✅ Scroll ไปยังข้อความล่าสุด
useEffect(() => {
  console.log("Updated Messages:", messages); // เพิ่ม console.log เพื่อตรวจสอบค่าของ messages
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);

  

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
    if (selectedUser) {
      fetchMessages();
    }
  }, [selectedUser, fetchMessages]);
  

  return (
    <div className="admin-chat-container">
      <a href="/" className="home-button">
        <img src={homeLogo} alt="Home Logo" className="home-logo" />
      </a>

      <h1 className="page-title2">ศูนย์ช่วยเหลือ</h1>

      {/* ✅ ปุ่ม Toggle ลูกค้า / เจ้าของสนาม */}
        <div className="category-toggle">
          <button
            className={activeCategory === "customer" ? "active" : ""}
            onClick={() => {
              console.log("📢 Switching to Customers");
              setActiveCategory("customer");
            }}
          >
            ลูกค้า (Customers)
          </button>
          <button
            className={activeCategory === "owner" ? "active" : ""}
            onClick={() => {
              console.log("📢 Switching to Owners");
              setActiveCategory("owner");
            }}
          >
            เจ้าของสนาม (Owners)
          </button>
        </div>

      <div className="chat-content">
        <div className="user-list-container2">
          <div className="user-list2">
            <div className="list-header2">ผู้ใช้</div>
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className={`user-item2 ${selectedUser?._id === user._id ? "selected" : ""}`}
                onClick={() => setSelectedUser(user)}
              >
                {user.name || user.email || "ไม่ทราบชื่อ"} {/* ตรวจสอบการตั้งค่า name */}
              </div>
            ))}
          </div>
        </div>

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
            <input type="text" placeholder="พิมพ์ข้อความ..." value={newMessage} onChange={(e) => setNewMessage(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessageToUserOrOwner()} disabled={!selectedUser} />
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
