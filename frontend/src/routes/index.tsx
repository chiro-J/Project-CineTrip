import { BrowserRouter, Routes, Route } from "react-router-dom";

// 페이지 컴포넌트
import { Landing } from "../pages/landing";
import Home from "../pages/home";
import Profile from "../pages/user/Profile";
import ProfileEditPage from "../pages/user/ProfileEdit";
import UserProfilePage from "../pages/user/MyProfile";
import GalleryPage from "../pages/gallery/GalleryPage";
import SearchResultPage from "../pages/search/SearchResultPage";
import MovieDetails from "../pages/movies/Detail";

// 조건부 라우팅 래퍼
import ProtectedRoute from "./ProtectedRoute";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import MovieSearchMain from "../pages/movies";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 비회원도 접근 가능한 페이지들 */}
        <Route element={<PublicRoute />}>
          <Route path="/" element={<Landing />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile/gallery" element={<GalleryPage />} />
        </Route>

        {/* 로그인 필요 페이지들 */}
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/user/:userId" element={<Profile />} />
          <Route path="/user/:userId/gallery" element={<GalleryPage />} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/movies/:movieId" element={<MovieDetails />} />
          <Route path="/movies" element={<MovieSearchMain />} />
        </Route>

        {/* 본인만 접근 가능한 페이지들 */}
        <Route element={<PrivateRoute />}>
          <Route path="/user/:userId/edit" element={<ProfileEditPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
