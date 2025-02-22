import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ role }) => {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("❌ Access Denied: No Token Found");
        return <Navigate to="/superadmin/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token); // ✅ ถอดรหัส JWT
        console.log("🚀 Decoded Token:", decodedToken);

        if (decodedToken.role !== role) {
            console.warn("❌ Access Denied: Unauthorized Role");
            return <Navigate to="/superadmin/login" replace />;
        }

        return <Outlet />; // ✅ อนุญาตให้เข้าถึงหน้าได้
    } catch (error) {
        console.error("🚨 Invalid Token:", error);
        return <Navigate to="/superadmin/login" replace />;
    }
};

export default ProtectedRoute;
