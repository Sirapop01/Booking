import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";

const AuthChecker = () => {
    const navigate = useNavigate();
    const location = useLocation(); // ✅ ตรวจสอบเส้นทางปัจจุบัน

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            // ✅ กำหนดหน้าที่ไม่ต้องตรวจสอบ Token
            const allowedPages = [
                "/login",
                "/customer-register",
                "/forgot-password",
                "/reset-password",
                "/information",
                "/promotion",
                "/RegisterOpera",
                "/RegisterArena",
                "/RegisterChoice",
                "/admin/register",
                "/verifyOwners",
                "/superadmin/login"
            ];

            // ✅ ถ้าผู้ใช้กำลังอยู่ในหน้าที่ไม่ต้องตรวจสอบ Token ให้ข้ามไปเลย
            if (allowedPages.some(path => location.pathname.startsWith(path))) {
                return;
            }

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000; // ✅ เวลาปัจจุบันแบบ UNIX Timestamp

                    if (decoded.exp < currentTime) {
                        console.warn("❌ Token หมดอายุ ออกจากระบบ...");
                        logout();
                    }
                } catch (error) {
                    console.error("❌ Token ไม่ถูกต้อง ออกจากระบบ...");
                    logout();
                }
            } else {
                console.warn("⚠️ ไม่พบ Token, กำลังเปลี่ยนไปหน้า Login...");
                navigateToLogin();
            }
        };

        const logout = () => {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");

            // ✅ แสดงแจ้งเตือนก่อนเปลี่ยนไปหน้า Login
            Swal.fire({
                title: "หมดเวลาการใช้งาน!",
                text: "กรุณาเข้าสู่ระบบใหม่",
                icon: "warning",
                confirmButtonText: "ไปที่หน้า Login",
                allowOutsideClick: false,
            }).then(() => {
                navigateToLogin();
            });
        };

        const navigateToLogin = () => {
            if (location.pathname !== "/login") {
                navigate("/login");
            }
        };

        checkToken();

        // ✅ ตั้งค่าให้เช็ค Token ทุก 1 นาที ป้องกันหมดอายุระหว่างใช้งาน
        const interval = setInterval(checkToken, 60000);

        return () => clearInterval(interval);
    }, [navigate, location]);

    return null;
};

export default AuthChecker;
