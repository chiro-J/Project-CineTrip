import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = () => {
  const { isLoggedIn } = useAuth();

  // 로그인하지 않은 사용자는 랜딩 페이지로 리다이렉트
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
