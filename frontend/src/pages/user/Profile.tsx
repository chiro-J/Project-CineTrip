import { useState, useRef } from "react";
import { Button } from "../../components/ui/Button";
import { Avatar } from "../../components/ui/Avatar";
import Card from "../../components/ui/Card";
import { GridLayout } from "../../components/layout/ImageContainer";
import Header from "../../components/layout/Header";
import SideNavigationBar from "../../components/layout/SideNavigationBar";
import { type Item } from "../../types/common";
import PostModal from "../../components/post/PostModal";
import { useAuth } from "../../contexts/AuthContext";

// 테스트용 모의(mock) 데이터입니다. 실제로는 API를 통해 받아오게 됩니다.
// 이미지 URL은 AWS S3 URL을 가정합니다.
// --- Mock Data ---
const MOCK_GRID_IMAGES1 = Array.from({ length: 3 }, (_, i) => ({
  id: `grid-${i + 1}`,
  src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=Grid+${i + 1}`,
  alt: `Grid Image ${i + 1}`,
  likes: Math.floor(Math.random() * 2000) + 100, // 각 이미지에 랜덤 좋아요 수 추가
}));

const MOCK_GRID_IMAGES2 = Array.from({ length: 5 }, (_, i) => ({
  id: `grid-${i + 1}`,
  src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=Grid+${i + 1}`,
  alt: `Grid Image ${i + 1}`,
  likes: Math.floor(Math.random() * 2000) + 100, // 각 이미지에 랜덤 좋아요 수 추가
}));

const recommendedPlaces = [
  {
    id: 1,
    src: "https://placehold.co/100x100/A3BFFA/FFFFFF/png?text=서울숲",
    location: "서울특별시 성동구 뚝섬로 273",
    relatedScene: "'도둑들' 촬영지A",
    movieTitle: "'도둑들'",
  },
  {
    id: 2,
    src: "https://placehold.co/100x100/A3FAD5/FFFFFF/png?text=부산",
    location: "부산광역시 수영구 광안해변로 219",
    relatedScene: "'해운대' 촬영지C",
    movieTitle: "'해운대'",
  },
  {
    id: 3,
    src: "https://placehold.co/100x100/FABDA3/FFFFFF/png?text=전주",
    location: "전북특별자치도 전주시 완산구 기린대로 99",
    relatedScene: "'구르미 그린 달빛' 촬영지E",
    movieTitle: "'구르미 그린 달빛'",
  },
  {
    id: 4,
    src: "https://placehold.co/100x100/F0A3FA/FFFFFF/png?text=제주",
    location: "제주특별자치도 서귀포시 성산읍 섭지코지로 261",
    relatedScene: "'건축학개론' 촬영지B",
    movieTitle: "'건축학개론'",
  },
];

/**
 * 사용자 프로필 페이지 컴포넌트
 */
const Profile = () => {
  const { user } = useAuth();
  // '추천 장소' 섹션 확장 여부를 위한 State
  const [isRecommendedExpanded, setIsRecommendedExpanded] = useState(false);
  // 스크롤 컨테이너를 참조하기 위한 ref
  const recommendedContainerRef = useRef<HTMLDivElement>(null);
  // 팔로우 여부를 위한 State
  const [isFollowing, setIsFollowing] = useState(false);

  const handleClick = () => {
    console.log("Button clicked!");
  };

  const [selectedImage, setSelectedImage] = useState<Item | null>(null);

  // '유저 사진' 그리드에서 이미지를 클릭했을 때 실행될 핸들러 함수를 추가합니다.
  const handleUserImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const imgElement = target.closest("img"); // 클릭된 요소가 이미지인지 확인합니다.

    if (imgElement && imgElement.src) {
      // 클릭된 이미지의 src와 일치하는 데이터를 MOCK_GRID_IMAGES3에서 찾습니다.
      const foundImage = MOCK_GRID_IMAGES1.find(
        (img) => img.src === imgElement.src
      );
      if (foundImage) {
        setSelectedImage(foundImage); // 찾은 이미지로 state를 업데이트하여 모달을 엽니다.
      }
    }
  };

  // '더보기'/'간략히 보기' 버튼 클릭 핸들러
  const handleToggleRecommended = () => {
    // 목록을 닫을 때 (즉, isRecommendedExpanded가 true일 때) 스크롤을 맨 위로 초기화
    if (isRecommendedExpanded && recommendedContainerRef.current) {
      recommendedContainerRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
    // 확장/축소 상태를 토글
    setIsRecommendedExpanded((prev) => !prev);
  };

  return (
    <>
      <SideNavigationBar />
      <nav>
        <Header />
      </nav>
      <div
        className="mt-8 bg-white text-[#111827]"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
          {/* 1. 사용자 프로필 정보 섹션 */}
          <section className="flex flex-col items-center justify-between mb-20 sm:flex-row">
            <div className="flex items-center">
              <Avatar
                src={user?.avatarUrl || undefined}
                size="lg"
                fallback={user?.username?.charAt(0).toUpperCase()}
              />
              <div className="ml-6">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-bold">{user?.username || "사용자 이름"}</h2>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    ></path>
                  </svg>
                </div>
                <p className="text-sm text-left text-gray-500">
                  Traveler, Foodie
                </p>
                <p className="mt-1 text-sm text-left text-gray-700">
                  Adventure seeker and culinary enthusiast.
                </p>
              </div>
            </div>
            <div className="flex-shrink-0 mt-6 sm:mt-0">
              <Button
                variant="outline"
                onClick={() => setIsFollowing(!isFollowing)}
              >
                {isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          </section>

          {/* 2. 사용자가 추천한 장소 섹션 */}
          <section className="mb-20">
            <h3 className="mb-10 text-xl font-bold">사용자가 추천한 장소</h3>
            {/* 스크롤 및 높이 제어 컨테이너 */}
            <div
              ref={recommendedContainerRef}
              className={`transition-all duration-700 ease-in-out ${isRecommendedExpanded ? "max-h-96 overflow-y-auto" : "max-h-[116px] overflow-hidden"}`}
            >
              <div className="space-y-4">
                {recommendedPlaces.map((place) => (
                  <div
                    key={place.id}
                    className="flex items-center gap-4 p-2 pr-4 border rounded-lg"
                  >
                    <div className="flex-shrink-0 w-24 h-24">
                      <Card
                        src={place.src}
                        alt={place.location}
                        className="w-full h-full"
                      />
                    </div>
                    <div className="text-left">
                      <div className="flex items-center font-semibold text-gray-800">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4 mr-1.5 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <h4>{place.location}</h4>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">
                        {place.relatedScene}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-1 text-xs text-gray-600 bg-gray-100 rounded-full">
                          {place.movieTitle}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {recommendedPlaces.length > 1 && (
              <div className="mt-8 text-center">
                <Button variant="outline" onClick={handleToggleRecommended}>
                  {isRecommendedExpanded ? "접기" : "펼치기"}
                </Button>
              </div>
            )}
          </section>

          {/* 3. 사용자가 업로드한 사진 섹션 */}
          <section className="mb-20">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">사용자가 업로드한 사진</h3>
              {/* 더보기 버튼 */}
              <Button variant="outline" onClick={handleClick}>
                more
              </Button>
            </div>
            <div onClick={handleUserImageClick} className="cursor-pointer">
              <GridLayout images={MOCK_GRID_IMAGES1} className="grid-cols-3" />
            </div>
          </section>

          {/* 4. 사용자가 감상한 영화 섹션 */}
          <section>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold">사용자가 감상한 영화</h3>
              {/* 더보기 버튼 */}
              <Button variant="outline" onClick={handleClick}>
                more
              </Button>
            </div>
            <GridLayout images={MOCK_GRID_IMAGES2} className="grid-cols-5" />
          </section>
        </div>
        {/* 4. selectedImage가 있을 때만 PostModal을 렌더링합니다. */}
        {selectedImage && (
          <PostModal
            item={selectedImage}
            onClose={() => setSelectedImage(null)} // 모달을 닫을 때 state를 null로 초기화합니다.
          />
        )}
      </div>
    </>
  );
};

export default Profile;
