import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";

// 페이지 컴포넌트
import { Landing } from "../pages/landing";
import SocialLoginPage from "../pages/auth/Callback";
import Home from "../pages/home";
import Profile from "../pages/user/Profile";
import ProfileEditPage from "../pages/user/ProfileEdit";
import UserProfilePage from "../pages/user/MyProfile";
import GalleryPage from "../pages/gallery/GalleryPage";
import SearchResultPage from "../pages/search/SearchResultPage";
import MovieSearchMain from "../pages/movies";
import MovieDetails from "../pages/movies/Detail";

// 조건부 라우팅 래퍼
import ProtectedRoute from "./ProtectedRoute";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";

// 레이아웃 컴포넌트 임포트
import Layout from "../components/layout/Layout";
import SocialLoginModal from "../components/auth/Login";

// OAuth
import AuthStart from "../components/auth/AuthStart";



function AppRoutes() {
  // Zustand 스토어에서 모달 상태를 가져옵니다.
  const { isLoginModalOpen } = useAuthStore();
  return (
    <BrowserRouter>
      {/* 로그인 모달을 Routes 외부에 배치하여 전역적으로 렌더링 */}
      {isLoginModalOpen && <SocialLoginModal />}
      <Routes>
        <Route element={<Layout />}>
          {/* 비회원도 접근 가능한 페이지들 */}
          <Route element={<PublicRoute />}>
            <Route path="/" element={<Landing />} />
            <Route path="/home" element={<Home />} />
            <Route path="/profile/gallery" element={<GalleryPage />} />
            <Route path="/auth/callback" element={<SocialLoginPage />} />
            <Route path="/auth/start" element={<AuthStart />} />
          </Route>

          {/* 로그인 필요 페이지들 */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/user/:userId" element={<Profile />} />
            <Route path="/user/:userId/gallery" element={<GalleryPage />} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/movies" element={<MovieSearchMain />} />
            <Route path="/movies/:movieId" element={<MovieDetails />} />
            {/* <Route path="/search?q=:query" element={<Search />} 서치 페이지가 아직 없음/> */}
          </Route>

          {/* 본인만 접근 가능한 페이지들 */}
          <Route element={<PrivateRoute />}>
            <Route path="/user/:userId/edit" element={<ProfileEditPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
