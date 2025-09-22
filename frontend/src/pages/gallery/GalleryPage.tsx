import Card from "../../components/ui/Card";
import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
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
  isOwner: propIsOwner,
}) => {
  const { userId } = useParams<{ userId: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userPhotosForGallery, userMoviesForGallery, user, deletePhoto } =
    useAuth();

  // 현재 사용자와 URL의 userId를 비교하여 isOwner 결정
  // /profile/gallery 경로에서는 userId가 없으므로 로그인한 사용자가 소유자
  // /user/:userId/gallery 경로에서는 userId(string)와 현재 사용자 ID(number)를 비교
  const isOwner =
    propIsOwner ??
    (!userId
      ? true // /profile/gallery 경로 - 로그인한 사용자가 소유자
      : user?.id?.toString() === userId); // /user/:userId/gallery 경로 - ID 비교 (number를 string으로 변환)

  // 디버깅: 소유자 확인 로직 검증 (개발 환경에서만)
  if (process.env.NODE_ENV === "development") {
    console.log("=== 소유자 확인 디버깅 ===");
    console.log("현재 경로:", window.location.pathname);
    console.log("user?.id (number):", user?.id);
    console.log("userId (from URL):", userId);
    console.log("isOwner (calculated):", isOwner);
    console.log("========================");
  }

  // 해당 유저의 갤러리 데이터를 위한 상태
  const [targetUserPhotos, setTargetUserPhotos] = useState<Item[]>([]);
  const [targetUserMovies, setTargetUserMovies] = useState<Item[]>([]);
  const [targetUserBookmarks, setTargetUserBookmarks] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const [activeTab, setActiveTab] = useState<"photos" | "movies" | "bookmarks">(
    "photos"
  );
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [userBookmarksForGallery, setUserBookmarksForGallery] = useState<
    Item[]
  >([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // 갤러리 데이터 가져오기 (소유자와 다른 사용자 모두)
  useEffect(() => {
    const fetchGalleryData = async () => {
      // 소유자인 경우 userId가 없으면 user.id 사용, 있으면 userId 사용
      const targetUserId = isOwner ? userId || user?.id?.toString() : userId;

      if (!targetUserId) return;

      setLoading(true);
      try {
        // 해당 유저의 게시물(사진) 가져오기
        const postsResponse = await fetch(
          `http://localhost:3000/api/posts?userId=${targetUserId}`
        );
        if (postsResponse.ok) {
          const posts = await postsResponse.json();
          console.log("API Response posts:", posts);
          const photoItems = posts.map((post: any) => {
            console.log("Individual post:", post);
            console.log("Post author data:", post.author);
            return {
              id: post.id.toString(),
              src: post.imageUrl || post.image_url,
              alt: post.title,
              likes: post.likesCount || 0,
              location: post.location,
              description: post.description,
              authorId: post.authorId, // 백엔드 PostResponseDto의 authorId 사용
              authorName: post.author?.username || "알 수 없는 사용자",
              // 백엔드 Post 엔티티 필드들 추가
              title: post.title,
              image_url: post.imageUrl || post.image_url,
              author_id: post.authorId, // 백엔드 PostResponseDto의 authorId 사용
              author: post.author,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
            };
          });
          console.log("Processed photo items:", photoItems);
          setTargetUserPhotos(photoItems);
        } else {
          console.error(
            "Failed to fetch posts:",
            postsResponse.status,
            postsResponse.statusText
          );
        }

        // 해당 유저의 북마크 가져오기 (영화)
        const bookmarksResponse = await fetch(
          `http://localhost:3000/api/user/${targetUserId}/bookmarks`
        );
        if (bookmarksResponse.ok) {
          const bookmarks = await bookmarksResponse.json();
          const movieItems = bookmarks.map((bookmark: any) => ({
            id: bookmark.id.toString(),
            src: getImageUrl(bookmark.posterPath),
            alt: bookmark.title,
            title: bookmark.title,
            releaseDate: bookmark.releaseDate,
            movieId: bookmark.tmdb_id, // 영화 상세페이지로 이동하기 위한 movieId 추가
          }));
          setTargetUserMovies(movieItems);
          setTargetUserBookmarks(movieItems);
        }
      } catch (error) {
        console.error("Failed to fetch gallery data:", error);
      } finally {
        setLoading(false);
      }
    };

    // 소유자든 다른 사용자든 데이터 로드
    fetchGalleryData();
  }, [userId, isOwner, user?.id]);

  // 사진 업로드 후 갤러리 데이터 새로고침 (소유자만)
  useEffect(() => {
    if (isOwner && user && userPhotosForGallery.length > 0) {
      // userPhotosForGallery가 변경되면 갤러리 데이터 새로고침
      const refreshGalleryData = async () => {
        try {
          const postsResponse = await fetch(
            `http://localhost:3000/api/posts?userId=${user.id}`
          );
          if (postsResponse.ok) {
            const posts = await postsResponse.json();
            const photoItems = posts.map((post: any) => ({
              id: post.id.toString(),
              src: post.imageUrl || post.image_url,
              alt: post.title,
              likes: post.likesCount || 0,
              location: post.location,
              description: post.description,
              authorId: post.authorId || post.author_id,
              authorName:
                post.author?.username ||
                post.author?.displayName ||
                "알 수 없는 사용자",
              title: post.title,
              image_url: post.imageUrl || post.image_url,
              author_id: post.authorId || post.author_id,
              author: post.author,
              createdAt: post.createdAt,
              updatedAt: post.updatedAt,
            }));
            setTargetUserPhotos(photoItems);
          }
        } catch (error) {
          console.error("Failed to refresh gallery data:", error);
        }
      };

      refreshGalleryData();
    }
  }, [isOwner, user, userPhotosForGallery.length]);

  // 실제 데이터에서 게시물 정보 찾기 (백엔드 Post 구조 기준)
  const getPhotoData = (itemId: string) => {
    // targetUserPhotos에서 찾기
    const photoData = targetUserPhotos.find(
      (photo) => photo.id.toString() === itemId
    );

    if (photoData) {
      console.log("Found photo data:", photoData);
      return {
        id: photoData.id,
        authorId: photoData.authorId || 0,
        authorName: photoData.authorName || "알 수 없는 사용자",
        location: photoData.location || "위치 정보 없음",
        description: photoData.description || "설명 없음",
        image_url:
          photoData.image_url ||
          photoData.src ||
          "https://via.placeholder.com/400x300?text=No+Image",
        title: photoData.title || "제목 없음",
        createdAt: photoData.createdAt,
      };
    }

    // 찾지 못한 경우 기본값 반환 (이미지 URL 포함)
    console.log("Photo data not found for itemId:", itemId);
    return {
      id: itemId,
      authorId: user?.id || 0,
      authorName: user?.username || "사용자",
      location: "위치 정보 없음",
      description: "설명 없음",
      image_url: "https://via.placeholder.com/400x300?text=No+Image",
      title: "제목 없음",
      createdAt: new Date().toISOString(),
    };
  };

  const selectedPhotoData = selectedItem
    ? getPhotoData(String(selectedItem.id))
    : null;

  // 디버깅: 선택된 데이터 확인
  console.log("Selected item:", selectedItem);
  console.log("Target user photos:", targetUserPhotos);
  console.log("Selected photo data:", selectedPhotoData);
  console.log("Current user ID:", user?.id);
  console.log("Selected photo authorId:", selectedPhotoData?.authorId);
  console.log("Is owner check:", user?.id === selectedPhotoData?.authorId);

  // 북마크된 영화 로드 (본인 갤러리일 때만)
  useEffect(() => {
    if (user && isOwner) {
      const loadBookmarkedMovies = async () => {
        setLoadingBookmarks(true);
        try {
          console.log("갤러리 페이지: 북마크 로드 시작, userId:", user.id);
          const bookmarks = await bookmarkService.getUserBookmarks(
            user.id.toString()
          );
          console.log("갤러리 페이지: 북마크 데이터:", bookmarks);

          // 북마크된 영화의 상세 정보 가져오기
          const movieDetails = await Promise.all(
            bookmarks.map(async (bookmark) => {
              try {
                console.log("북마크 데이터:", bookmark);
                const movieDetail = await tmdbService.getMovieDetails(
                  bookmark.tmdb_id
                );
                return {
                  id: `bookmark-${bookmark.id}`,
                  src: getImageUrl(movieDetail.poster_path),
                  alt: movieDetail.title,
                  likes: 0, // 북마크에는 좋아요 수가 없으므로 0으로 설정
                  movieId: bookmark.tmdb_id, // 영화 상세페이지로 이동하기 위한 movieId 추가
                };
              } catch (error) {
                console.error(
                  `영화 ${bookmark.tmdb_id} 상세 정보 로드 실패:`,
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
  }, [user, isOwner]);

  // URL 파라미터에서 tab 값을 읽어서 activeTab 설정
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam && ["photos", "movies", "bookmarks"].includes(tabParam)) {
      setActiveTab(tabParam as "photos" | "movies" | "bookmarks");
    }
  }, [searchParams]);

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    const prevWidth = root.style.width;
    const prevMaxWidth = root.style.maxWidth;
    root.style.width = "1280px"; // 고정 폭
    root.style.maxWidth = "none"; // 기존 max-width 영향 차단(선택)
    return () => {
      root.style.width = prevWidth;
      root.style.maxWidth = prevMaxWidth;
    };
  }, []);

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
    // 로딩 중일 때
    if (loading) {
      return (
        <div className="w-full p-8 mx-auto text-center bg-white border border-gray-200 rounded-lg col-span-full">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 border-2 border-gray-300 rounded-full">
            <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
          </div>
          <p className="text-gray-600">갤러리를 로딩하고 있습니다...</p>
        </div>
      );
    }

    switch (activeTab) {
      case "photos":
        return (
          <TabContent
            items={targetUserPhotos}
            emptyMessage="업로드한 사진이 없습니다."
            isPhotoTab={true}
            onAddClick={handleAddPhotoClick}
            isOwner={isOwner}
            onItemClick={handleItemClick}
          />
        );
      case "movies":
        return (
          <TabContent
            items={isOwner ? userMoviesForGallery : targetUserMovies}
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
            items={isOwner ? userBookmarksForGallery : targetUserBookmarks}
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
            key={`${selectedItem.id}-${(selectedPhotoData as any).location || ""}-${(selectedPhotoData as any).description || ""}`}
            item={selectedItem}
            onClose={closeModal}
            authorId={(selectedPhotoData as any).authorId}
            authorName={(selectedPhotoData as any).authorName}
            photoId={(selectedPhotoData as any).id?.toString()}
            locationLabel={(selectedPhotoData as any).location}
            descriptionText={(selectedPhotoData as any).description}
            onDelete={deletePhoto}
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
