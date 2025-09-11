//미리보기: https://g.co/gemini/share/cc229dcc3f07

import Header from "../../components/layout/Header";
import SideNavigationBar from "../../components/layout/SideNavigationBar";
import { Button } from "../../components/ui/Button";
import { GridLayout } from "../../components/layout/ImageContainer";
import ChecklistPage from "../../components/checklist/ChecklistPage";
import { Avatar } from "../../components/ui/Avatar";

// --- Mock Data ---
const uploadedPhotos = [
  {
    id: 1,
    src: "https://placehold.co/400x400/f0f0f0/333?text=Nature",
    alt: "Sunset at Grand Canyon",
    likes: 100,
  },
  {
    id: 2,
    src: "https://placehold.co/400x400/e0e0e0/333?text=Food",
    alt: "Tacos in Mexico",
    likes: 200,
  },
  {
    id: 3,
    src: "https://placehold.co/400x400/d0d0d0/333?text=Architecture",
    alt: "Cathedral in Barcelona",
    likes: 150,
  },
];

const watchedMovies = [
  { id: 1, src: "https://placehold.co/400x600/f8d7da/333?text=Movie+1" },
  { id: 2, src: "https://placehold.co/400x600/d1ecf1/333?text=Movie+2" },
  { id: 3, src: "https://placehold.co/400x600/d4edda/333?text=Movie+3" },
  { id: 4, src: "https://placehold.co/400x600/fff3cd/333?text=Movie+4" },
];

/**
 * 사용자 프로필 페이지
 * @returns {React.ReactElement}
 */
const UserProfilePage = (): React.ReactElement => {
  const handleEditProfileClick = (): void => {
    console.log("Edit Profile button clicked");
  };
  const handleEditPhotosClick = (): void => {
    console.log("Edit photos button clicked");
  };
  const handleMoreMoviesClick = (): void => {
    console.log("More movies button clicked");
  };

  return (
    <div className="flex min-h-screen font-sans bg-white">
      <SideNavigationBar isLoggedIn={true} />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-16">
          {/* 1. 사용자 프로필 섹션 */}
          <section className="flex justify-between mt-6">
            <div className="flex gap-6">
              <Avatar size="xl" />
              <div className="text-left" style={{ textAlign: "left" }}>
                <h1 className="text-2xl font-bold">사용자 이름</h1>
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
            <GridLayout images={uploadedPhotos} />
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
            <GridLayout images={watchedMovies} />
          </section>
        </main>
      </div>
    </div>
  );
};

export default UserProfilePage;
