import { Navigate, Outlet } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ roles }) => {
  const token = sessionStorage.getItem("token") || localStorage.getItem("token");

  if (!token) {
    console.warn(" Access Denied: No Token Found");
    return <Navigate to="/superadmin/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    console.log(" Decoded Token:", decodedToken);

    if (!roles.includes(decodedToken.role)) {
      console.warn(" Access Denied: Unauthorized Role");
      return <Navigate to="/superadmin/login" replace />;
    }

    return <Outlet />;
  } catch (error) {
    console.error(" Invalid Token:", error);
    return <Navigate to="/superadmin/login" replace />;
  }
};

export default ProtectedRoute;