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
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userPhotosForGallery, userMoviesForGallery, userBookmarksForGallery } = useAuth();
  const [activeTab, setActiveTab] = useState<"photos" | "movies" | "bookmarks">(
    "photos"
  );

  // URL 파라미터에서 tab 값을 읽어서 activeTab 설정
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["photos", "movies", "bookmarks"].includes(tabParam)) {
      setActiveTab(tabParam as "photos" | "movies" | "bookmarks");
    }
  }, [searchParams]);

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

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
    <div className="w-full h-full bg-gray-50">
      <Header />
      <SideNavigationBar />

      <div className="p-4 md:p-8">
        <nav className="sticky z-10 flex w-full mt-16 mb-10 border-b border-gray-200 top-24 bg-gray-50">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 text-sm font-semibold text-center transition-colors duration-200 ${activeTab === tab.id ? "border-b-2 border-gray-900 text-gray-900" : "text-gray-500 hover:text-gray-800"}`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <main className="grid flex-1 grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {renderContent()}
        </main>
        <PostModal item={selectedItem} onClose={closeModal} />
        <PostUploadModal
          isOpen={isUploadModalOpen}
          onClose={closeUploadModal}
        />
      </div>
    </div>
  );
};

export default GalleryPage;
