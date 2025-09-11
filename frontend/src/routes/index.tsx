import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

// 페이지 컴포넌트
import { Landing } from '../pages/landing';
import Home from '../pages/home';
import Profile from '../pages/user/Profile';
import ProfileEditPage from '../pages/user/ProfileEdit';
import UserProfilePage from '../pages/user/MyProfile';
import GalleryPage from '../pages/gallery';
import MovieSearchMain from '../pages/movies';
import MovieDetails from '../pages/movies/Detail';



// 조건부 라우팅 래퍼
import ProtectedRoute from './ProtectedRoute';
import PrivateRoute from './PrivateRoute';

// 공통 컴포넌트
import SocialLoginModal from '../pages/auth/Callback';

function AppRoutes() {
  const isLoginModalOpen = useAuthStore((state) => state.isLoginModalOpen);

  return (
    <BrowserRouter>
      {/* 전역 로그인 모달 */}
      {isLoginModalOpen && <SocialLoginModal />}
      
      <Routes>
        {/* 누구나 접근 가능한 페이지 */}
        <Route path="/" element={<Landing />} />

        {/* 로그인 필요 페이지 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/profile/gallery" element={<GalleryPage />} />
          <Route path="/user/:userId" element={<Profile />} />
          <Route path="/user/:userId/gallery" element={<GalleryPage />} />
          <Route path="/movies" element={<MovieSearchMain />} />
          <Route path="/movies/:movieId" element={<MovieDetails />} />
          {/* <Route path="/search?q=:query" element={<Search />} 서치 페이지가 아직 없음/> */}
        </Route>

        {/* 본인만 접근 가능한 페이지 */}
        <Route element={<PrivateRoute />}>
          <Route path="/profile/edit" element={<ProfileEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;