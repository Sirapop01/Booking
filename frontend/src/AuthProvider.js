import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const AuthChecker = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const checkToken = () => {
            const token = localStorage.getItem("token") || sessionStorage.getItem("token");

            if (token) {
                try {
                    const decoded = jwtDecode(token);
                    const currentTime = Date.now() / 1000;

                    if (decoded.exp < currentTime) {
                        console.warn("❌ Token หมดอายุ ออกจากระบบ...");
                        logout();
                    }
                } catch (error) {
                    console.error("❌ Token ไม่ถูกต้อง ออกจากระบบ...");
                    logout();
                }
            } else {
                console.warn("⚠️ ไม่พบ Token, ไปที่หน้า Login");
                navigate("/login");
            }
        };

        const logout = () => {
            localStorage.removeItem("token");
            sessionStorage.removeItem("token");
            navigate("/login");
        };

        checkToken();

        // ✅ เช็คทุก 1 นาที (ป้องกัน Token หมดอายุระหว่างใช้งาน)
        const interval = setInterval(checkToken, 60000);

        return () => clearInterval(interval);
    }, [navigate]);

    return null;
};

export default AuthChecker;
