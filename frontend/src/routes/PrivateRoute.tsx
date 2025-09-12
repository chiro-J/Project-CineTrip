import { Navigate, Outlet, useParams } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

const PrivateRoute = () => {
  const user = useAuthStore((state) => state.user);
  const { userId } = useParams();

  // 로그인 상태 확인 및 URL 파라미터와 유저 ID 일치 여부 확인
  // TODO: 테스트를 위해 임시로 주석 처리 - 나중에 복구 필요

  // if (!user || user.id !== userId) {
  //   return <Navigate to="/" replace />;
  // }

  // ※   테스트 후 해야 할 일:
  // 1. PrivateRoute.tsx의 인증 체크 로직 복구
  // 2. 실제 로그인된 사용자 ID를 사용하도록 navigate 경로 수정

  return <Outlet />;
};

export default PrivateRoute;
