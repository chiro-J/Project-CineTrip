import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const ProtectedRoute = () => {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);

  if (!isLoggedIn) {
    openLoginModal();
    return null; // 모달을 열고 렌더링을 중단
  }

  return <Outlet />;
};

export default ProtectedRoute;