import { Outlet } from "react-router-dom";

/**
 * 비회원도 접근 가능한 페이지들을 위한 라우트
 * landing, gallery, home 페이지 등
 */
const PublicRoute = () => {
  return <Outlet />;
};

export default PublicRoute;