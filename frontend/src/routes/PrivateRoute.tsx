import { Navigate, Outlet, useParams } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const PrivateRoute = () => {
  const { user } = useAuthStore((state) => ({ user: state.user }));
  const { userId } = useParams();

  // 로그인 상태 확인 및 URL 파라미터와 유저 ID 일치 여부 확인
  if (!user || user.id !== userId) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;