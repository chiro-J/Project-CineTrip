//미리보기: https://g.co/gemini/share/cc229dcc3f07

import Header from "../../components/layout/Header";
import SideNavigationBar from "../../components/layout/SideNavigationBar";
import { Button } from "../../components/ui/Button";
import { GridLayout } from "../../components/layout/ImageContainer";
import ChecklistPage from "../../components/checklist/ChecklistPage";
import { Avatar } from "../../components/ui/Avatar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { type Item } from "../../types/common";
import PostModal from "../../components/post/PostModal";
import { useState } from "react";
import { tmdbService } from "../../services/tmdbService";
import { getImageUrl } from "../../types/movie";

/**
 * 사용자 프로필 페이지
 * @returns {React.ReactElement}
 */
const UserProfilePage = (): React.ReactElement => {
  const navigate = useNavigate();
  const { user, userPhotosForProfile, userMoviesForProfile } = useAuth();

  const handleEditProfileClick = (): void => {
    console.log("Edit Profile button clicked");
    // 실제로는 로그인된 사용자의 ID를 사용해야 합니다
    navigate("/user/1/edit"); // 임시로 1을 사용, 실제로는 useAuthStore에서 user.id를 가져와야 함
  };
  const handleEditPhotosClick = (): void => {
    console.log("Edit photos button clicked");
    navigate("/profile/gallery");
  };
  const handleMoreMoviesClick = (): void => {
    console.log("More movies button clicked");
    navigate("/profile/gallery?tab=movies");
  };

  const [selectedImage, setSelectedImage] = useState<Item | null>(null);

  // Mock 데이터 함수 (Gallery와 동일한 로직)
  const getMockPhotoData = (itemId: string) => {
    const mockData = {
      "photo-1": {
        id: "photo-1",
        authorId: "1",
        authorName: "cinephile_user",
        location: "도쿄, 일본",
        description: "인셉션 촬영지입니다.",
      },
      "photo-2": {
        id: "photo-2",
        authorId: "1",
        authorName: "cinephile_user",
        location: "뉴욕, 미국",
        description: "어벤져스 촬영지입니다.",
      },
      "photo-3": {
        id: "photo-3",
        authorId: "1",
        authorName: "cinephile_user",
        location: "런던, 영국",
        description: "해리포터 촬영지입니다.",
      },
      "admin-photo-1": {
        id: "admin-photo-1",
        authorId: "admin-001",
        authorName: "Admin",
        location: "뉴질랜드, 웰링턴",
        description: "아바타 촬영지입니다.",
      },
      "admin-photo-2": {
        id: "admin-photo-2",
        authorId: "admin-001",
        authorName: "Admin",
        location: "뉴질랜드, 호비튼",
        description: "반지의 제왕 촬영지입니다.",
      }
    };

    // Mock 데이터에 없으면 현재 로그인한 사용자의 새 게시물로 간주
    return mockData[itemId as keyof typeof mockData] || {
      id: itemId,
      authorId: user?.id || "unknown",
      authorName: user?.username || "사용자",
      location: "새로 업로드된 위치",
      description: "새로 업로드된 게시물입니다.",
    };
  };

  const selectedPhotoData = selectedImage ? getMockPhotoData(selectedImage.id) : null;

  // 사진 클릭 핸들러
  const handleUserImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const imgElement = target.closest("img");

    if (imgElement && imgElement.src) {
      const foundImage = userPhotosForProfile.find(
        (img) => img.src === imgElement.src
      );
      if (foundImage) {
        setSelectedImage(foundImage);
      }
    }
  };

  // 영화 클릭 핸들러
  const handleMovieImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const imgElement = target.closest("img");

    if (imgElement && imgElement.src) {
      const foundMovie = userMoviesForProfile.find(
        (movie) => movie.src === imgElement.src
      );
      if (foundMovie && (foundMovie as any).movieId) {
        navigate(`/movies/${(foundMovie as any).movieId}`);
      }
    }
  };

  return (
    <div className="flex font-sans bg-white max-w-screen">
      <SideNavigationBar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-16">
          {/* 1. 사용자 프로필 섹션 */}
          <section className="flex justify-between mt-6">
            <div className="flex gap-6">
              <Avatar
                size="xl"
                src={user?.avatarUrl || undefined}
                fallback={user?.username?.charAt(0).toUpperCase()}
              />
              <div className="text-left" style={{ textAlign: "left" }}>
                <h1 className="text-2xl font-bold">{user?.username}</h1>
                <p className="mt-1 text-gray-600">Traveler, Foodie</p>
                <p className="mt-1 text-gray-600">
                  Adventure seeker and culinary enthusiast.
                </p>
              </div>
            </div>
            <div className="mt-6">
              <Button
                variant="primary"
                onClick={handleEditProfileClick}
                size="md"
              >
                Edit Profile
              </Button>
            </div>
          </section>

          {/* 2. 체크리스트 섹션 */}
          <div className="mt-24">
            <ChecklistPage />
          </div>

          {/* 3. 업로드한 사진 섹션 */}
          <section>
            <div className="flex items-center justify-between mt-24 mb-4">
              <h2 className="text-2xl font-bold">업로드한 사진</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleEditPhotosClick}
              >
                edit
              </Button>
            </div>
            <div onClick={handleUserImageClick} className="cursor-pointer">
              <GridLayout images={userPhotosForProfile} className="grid-cols-4" />
            </div>
          </section>

          {/* 4. 감상한 영화 섹션 */}
          <section className="mt-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">감상한 영화</h2>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMoreMoviesClick}
              >
                more
              </Button>
            </div>
            <div onClick={handleMovieImageClick} className="cursor-pointer">
              <GridLayout images={userMoviesForProfile} className="grid-cols-4" />
            </div>
          </section>
        </main>
      </div>
      {/* 4. selectedImage가 있을 때만 PostModal을 렌더링합니다. */}
      {selectedImage && selectedPhotoData && (
        <PostModal
          key={`${selectedImage.id}-${selectedPhotoData.location}-${selectedPhotoData.description}`}
          item={selectedImage}
          onClose={() => setSelectedImage(null)} // 모달을 닫을 때 state를 null로 초기화합니다.
          authorId={selectedPhotoData.authorId}
          authorName={selectedPhotoData.authorName}
          photoId={selectedPhotoData.id}
          locationLabel={selectedPhotoData.location}
          descriptionText={selectedPhotoData.description}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
