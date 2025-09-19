import Card from "../../components/ui/Card";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../../components/layout/Header";
import { Button } from "../../components/ui/Button";
import SideNavigationBar from "../../components/layout/SideNavigationBar";
import PostModal from "../../components/post/PostModal";
import PostUploadModal from "../../components/upload/Upload";
import { type Item } from "../../types/common";
import { useAuth } from "../../contexts/AuthContext";
import { getImageUrl } from "../../types/movie";
import { bookmarkService } from "../../services/bookmarkService";
import { tmdbService } from "../../services/tmdbService";
/**
 * 데이터가 없을 때 표시할 UI 컴포넌트
 */
const EmptyState: React.FC<{
  message: string;
  action?: { label: string; onClick: () => void };
}> = ({ message, action }) => (
  <div className="min-h-[400px] flex flex-col items-center justify-center bg-gray-100 rounded-lg w-250 col-span-full">
    <svg
      className="text-gray-400 w-50 h-50 "
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
      />
    </svg>
    <p className="mt-4 mb-4 text-base font-medium text-gray-500">{message}</p>
    {action && (
      <Button variant="outline" onClick={action.onClick}>
        {action.label}
      </Button>
    )}
  </div>
);

interface TabContentProps {
  items: Item[];
  emptyMessage: string;
  isPhotoTab?: boolean;
  onAddClick?: () => void;
  onSearchMoviesClick?: () => void;
  isOwner: boolean;
  onItemClick?: (item: Item) => void;
}

/**
 * 탭 콘텐츠를 렌더링하는 컴포넌트
 */
const TabContent: React.FC<TabContentProps> = ({
  items,
  emptyMessage,
  isPhotoTab = false,
  onAddClick,
  onSearchMoviesClick,
  isOwner,
  onItemClick,
}) => {
  if (!isPhotoTab && items.length === 0) {
    // isOwner가 true일 때만 action 버튼을 생성합니다.
    const action =
      isOwner && onSearchMoviesClick
        ? { label: "영화 검색하러 가기", onClick: onSearchMoviesClick }
        : undefined;
    return <EmptyState message={emptyMessage} action={action} />;
  }

  return (
    <>
      {/* isOwner가 true이고 사진 탭일 때만 'Add new photo' 버튼을 보여줍니다. */}
      {isOwner && isPhotoTab && (
        <button
          type="button"
          onClick={onAddClick}
          className="flex items-center justify-center transition-colors border-2 border-gray-300 border-dashed rounded-lg group aspect-square hover:border-gray-400 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <div className="text-center text-gray-400 group-hover:text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-8 h-8 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            <span className="block mt-1 text-xs font-medium">
              Add new photo
            </span>
          </div>
        </button>
      )}
      {items.map((item) => (
        <div
          key={item.id}
          role="button"
          tabIndex={0}
          onClick={() => onItemClick?.(item)}
          onKeyDown={(e) => e.key === "Enter" && onItemClick?.(item)}
          className="rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <Card
            key={item.id}
            src={item.src}
            alt={item.alt}
            likes={item.likes}
            fit="cover"
            className={isPhotoTab ? "aspect-square" : "aspect-[2/3]"}
          />
        </div>
      ))}
    </>
  );
};

/**
 * 메인 컴포넌트
 * @param isOwner - 현재 보고 있는 프로필이 로그인한 사용자의 것인지 여부
 */
const GalleryPage: React.FC<{ isOwner?: boolean }> = ({
  isOwner = true, // 기본값을 true로 설정하여 본인 프로필로 간주합니다.
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userPhotosForGallery, userMoviesForGallery, user, isFollowing } =
    useAuth();

  const [activeTab, setActiveTab] = useState<"photos" | "movies" | "bookmarks">(
    "photos"
  );
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userBookmarksForGallery, setUserBookmarksForGallery] = useState<
    Item[]
  >([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // Mock 데이터로 테스트
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
      },
    };

    // Mock 데이터에 없으면 현재 로그인한 사용자의 새 게시물로 간주
    return (
      mockData[itemId as keyof typeof mockData] || {
        id: itemId,
        authorId: user?.id || "unknown",
        authorName: user?.username || "사용자",
        location: "새로 업로드된 위치",
        description: "새로 업로드된 게시물입니다.",
      }
    );
  };

  const selectedPhotoData = selectedItem
    ? getMockPhotoData(String(selectedItem.id))
    : null;

  // 디버깅: 선택된 데이터 확인
  console.log("Selected item:", selectedItem);
  console.log("Mock photo data:", selectedPhotoData);

  // 북마크된 영화 로드
  useEffect(() => {
    if (user) {
      const loadBookmarkedMovies = async () => {
        setLoadingBookmarks(true);
        try {
          console.log("갤러리 페이지: 북마크 로드 시작, userId:", user.id);
          const bookmarks = await bookmarkService.getUserBookmarks(user.id);
          console.log("갤러리 페이지: 북마크 데이터:", bookmarks);

          // 북마크된 영화의 상세 정보 가져오기
          const movieDetails = await Promise.all(
            bookmarks.map(async (bookmark) => {
              try {
                const movieDetail = await tmdbService.getMovieDetails(
                  bookmark.tmdbId
                );
                return {
                  id: `bookmark-${bookmark.id}`,
                  src: getImageUrl(movieDetail.poster_path),
                  alt: movieDetail.title,
                  likes: 0, // 북마크에는 좋아요 수가 없으므로 0으로 설정
                };
              } catch (error) {
                console.error(
                  `영화 ${bookmark.tmdbId} 상세 정보 로드 실패:`,
                  error
                );
                return null;
              }
            })
          );

          setUserBookmarksForGallery(movieDetails.filter(Boolean) as Item[]);
        } catch (error) {
          console.error("북마크된 영화 로드 실패:", error);
          setUserBookmarksForGallery([]);
        } finally {
          setLoadingBookmarks(false);
        }
      };

      loadBookmarkedMovies();
    }
  }, [user]);

  // URL 파라미터에서 tab 값을 읽어서 activeTab 설정
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["photos", "movies", "bookmarks"].includes(tabParam)) {
      setActiveTab(tabParam as "photos" | "movies" | "bookmarks");
    }
  }, [searchParams]);

  // 탭 변경 핸들러 - URL 업데이트
  const handleTabChange = (tabId: "photos" | "movies" | "bookmarks") => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
  };

  const handleItemClick = (item: Item) => {
    // movieId가 있으면 영화 디테일 페이지로 이동
    if ((item as any).movieId) {
      navigate(`/movies/${(item as any).movieId}`);
    } else {
      // 사진인 경우 모달 열기
      setSelectedItem(item);
    }
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleAddPhotoClick = () => {
    setIsUploadModalOpen(true);
  };

  const closeUploadModal = () => {
    setIsUploadModalOpen(false);
  };

  const handleSearchMoviesClick = () => {
    navigate("/movies");
  };

  const TABS = [
    { id: "photos", label: "사진" },
    { id: "movies", label: "영화" },
    { id: "bookmarks", label: "북마크" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "photos":
        return (
          <TabContent
            items={userPhotosForGallery}
            emptyMessage=""
            isPhotoTab={true}
            onAddClick={handleAddPhotoClick}
            isOwner={isOwner}
            onItemClick={handleItemClick}
          />
        );
      case "movies":
        return (
          <TabContent
            items={userMoviesForGallery}
            emptyMessage="감상한 영화가 없습니다."
            isOwner={isOwner}
            onItemClick={handleItemClick}
          />
        );
      case "bookmarks":
        if (loadingBookmarks) {
          return (
            <div className="w-full p-8 mx-auto text-center bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 border-2 border-gray-300 rounded-full">
                <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
              </div>
              <p className="text-gray-600">북마크를 로딩하고 있습니다...</p>
            </div>
          );
        }
        return (
          <TabContent
            items={userBookmarksForGallery}
            emptyMessage="북마크한 영화가 없습니다."
            onSearchMoviesClick={handleSearchMoviesClick}
            isOwner={isOwner}
            onItemClick={handleItemClick}
          />
        );
      default:
        return null;
    }
  };
  return (
    // 전체 레이아웃을 스크롤 가능하게 만듭니다.
    <div className="w-full min-h-screen bg-gray-50">
      <Header />
      <SideNavigationBar />

      <div className="p-4 md:p-8">
        <nav className="sticky z-10 flex w-full mt-16 mb-10 border-b border-gray-200 top-24 bg-gray-50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() =>
                handleTabChange(tab.id as "photos" | "movies" | "bookmarks")
              }
              className={`flex-1 py-3 px-4 text-sm font-semibold text-center transition-colors duration-200 ${activeTab === tab.id ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {renderContent()}
        </main>
        {selectedItem && selectedPhotoData && (
          <PostModal
            key={`${selectedItem.id}-${selectedPhotoData.location}-${selectedPhotoData.description}`}
            item={selectedItem}
            onClose={closeModal}
            authorId={selectedPhotoData.authorId}
            authorName={selectedPhotoData.authorName}
            photoId={selectedPhotoData.id}
            locationLabel={selectedPhotoData.location}
            descriptionText={selectedPhotoData.description}
          />
        )}
        <PostUploadModal
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
        />
      </div>
    </div>
  );
};

export default GalleryPage;
