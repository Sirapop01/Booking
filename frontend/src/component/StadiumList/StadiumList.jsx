import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "./StadiumList.css";
import NavbarStadiumlist from "../NavbarStadiumlist/NavbarStadiumlist";
import Swal from "sweetalert2";
import "sweetalert2/dist/sweetalert2.min.css"; // ✅ นำเข้า CSS ของ SweetAlert2

function StadiumList() {
    const navigate = useNavigate();
    const [stadiums, setStadiums] = useState([]);
    const [selectedStadium, setSelectedStadium] = useState(null);
    const [loading, setLoading] = useState(false); // ✅ ป้องกันการกดปุ่มซ้ำ
    const [ownerId, setOwnerId] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token");

        if (!token) {
            alert("Session หมดอายุ! กรุณาเข้าสู่ระบบใหม่");
            navigate("/login");
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const userId = decoded.id;

            if (!userId) {
                console.error("⚠️ ไม่พบ ID ใน Token");
                return;
            }

            setOwnerId(userId);
        } catch (error) {
            console.error("⚠️ ไม่สามารถถอดรหัส Token:", error);
            alert("Session ไม่ถูกต้อง กรุณาเข้าสู่ระบบใหม่");
            navigate("/login");
        }
    }, [navigate]);

    // ✅ ฟังก์ชันโหลดข้อมูลสนาม
    const fetchStadiumsStatus = async () => {
        try {
            if (!ownerId) {
                console.warn("⚠️ ownerId ยังไม่ได้กำหนด, ไม่สามารถโหลดข้อมูลสนามได้");
                return;
            }

            console.log("📢 ownerId ที่ถูกส่งไป:", ownerId);

            const response = await axios.get(`http://localhost:4000/api/stadium/getArenas?owner_id=${ownerId}`);
            console.log("📢 ข้อมูลสนามที่โหลดใหม่:", response.data);

            if (!response.data || response.data.length === 0) {
                console.warn("⚠️ ไม่มีสนามที่โหลดได้");
            }

            setStadiums(response.data);
        } catch (error) {
            console.error("❌ ไม่สามารถโหลดข้อมูลสนาม:", error);
        }
    };

    useEffect(() => {
        if (ownerId) {
            fetchStadiumsStatus();
        }
    }, [ownerId]); // ✅ โหลดข้อมูลเมื่อ ownerId เปลี่ยนแปลง

    // ✅ เปิด/ปิดสถานะสนาม
    const toggleStadium = async (arenaId, openState) => {
        try {
            console.log("📢 กำลังอัปเดตสถานะสนาม:", arenaId, openState);
            setLoading(true);

            const response = await axios.post(`http://localhost:4000/api/arenas/toggleStatus`, {
                arenaId,
                open: openState,
            });

            console.log("✅ อัปเดตสถานะสำเร็จ:", response.data);

            if (response.status === 200) {
                await fetchStadiumsStatus(); // ✅ โหลดข้อมูลใหม่

                Swal.fire({
                    title: openState ? "✅ เปิดสนามสำเร็จ!" : "❌ ปิดสนามแล้ว",
                    text: openState ? "สนามนี้เปิดให้จองแล้ว" : "สนามนี้ปิดชั่วคราว",
                    icon: openState ? "success" : "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "ตกลง",
                });
            }
        } catch (error) {
            console.error("⚠️ ไม่สามารถเปลี่ยนสถานะสนาม:", error);
            Swal.fire({
                title: "❌ เกิดข้อผิดพลาด",
                text: "ไม่สามารถเปลี่ยนสถานะสนามได้ กรุณาลองใหม่",
                icon: "error",
                confirmButtonColor: "#d33",
                confirmButtonText: "ตกลง",
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="stadium-page-container">
            <NavbarStadiumlist />

            {/* ✅ ตารางสนาม */}
            <table className="stadium-table-stadiumlist">
                <thead>
                    <tr>
                        <th style={{ width: "25%" }}>ชื่อสนาม</th>
                        <th style={{ width: "20%" }}>สถานะ</th>
                        <th style={{ width: "20%" }}>เปิด/ปิด</th>
                        <th style={{ width: "25%" }}>ตัวเลือก</th>
                    </tr>
                </thead>
                <tbody>
                    {stadiums.length > 0 ? (
                        stadiums.map((stadium) => {
                            const isSelected = selectedStadium === stadium._id;
                            return (
                                <tr
                                    key={stadium._id}
                                    className={`table-row-stadiumlist ${isSelected ? "selected" : ""}`}
                                    onClick={() => setSelectedStadium(isSelected ? null : stadium._id)}
                                >
                                    <td className="stadium-name-stadiumlist">{stadium.fieldName ?? "ไม่ระบุชื่อ"}</td>
                                    <td className="status-stadiumlist">{stadium.open ? "✅ เปิดใช้งาน" : "❌ ปิด"}</td>
                                    <td className="status-toggle-stadiumlist">
                                        <span>{stadium.open ? "✅ เปิด" : "❌ ปิด"}</span>
                                    </td>
                                    <td className="action-buttons-stadiumlist">
                                        <button
                                            className={`toggle-btn-stadiumlist ${stadium.open ? "btn-close-stadiumlist" : "btn-open-stadiumlist"}`}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleStadium(stadium._id, !stadium.open);
                                            }}
                                            disabled={loading}
                                        >
                                            {stadium.open ? "❌ ปิดสนาม" : "✅ เปิดสนาม"}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan="4" className="no-data-stadiumlist">⚠️ ไม่มีสนามที่ลงทะเบียน</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {/* ✅ ปุ่มด้านล่าง */}
            <div className="bottom-buttons-stadiumlist">
                <button
                    className={`btn-stadiumlist ${selectedStadium ? "" : "disabled"}`}
                    onClick={() => navigate(`/Registerarena/${selectedStadium}`)}
                    disabled={!selectedStadium}
                >
                    แก้ไข
                </button>
                <button onClick={() => navigate("/Registerarena")} className="btn-stadiumlist">
                    เพิ่มสนามใหม่
                </button>
                <button
                    className={`btn-stadiumlist ${selectedStadium ? "" : "disabled"}`}
                    onClick={() => navigate(`/manage-sub-stadium/${selectedStadium}`)}
                    disabled={!selectedStadium}
                >
                    จัดการสนามย่อย
                </button>
            </div>
        </div>
    );
}

export default StadiumList;
