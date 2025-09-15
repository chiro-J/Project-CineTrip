import { GridLayout } from "../../components/layout/ImageContainer";
import { Avatar } from "../../components/ui/Avatar";
import Header from "../../components/layout/Header";
import { useEffect, useState } from "react";
import { Button } from "../../components/ui/Button";
import { ChevronUp } from "lucide-react";
import PostModal from "../../components/post/PostModal";
import SideNavigationBar from "../../components/layout/SideNavigationBar";
import Footer from "../../components/layout/Footer";
import { type Item } from "../../types/common";
import { useSearchParams } from "react-router-dom";


// --- 타입 정의 ---

type UserProfile = {
  id: number;
  avatarUrl: string;
  username: string;
  handle: string;
  bio: string;
};

// --- Mock 데이터 및 API 시뮬레이션 ---

const mockUsers: UserProfile[] = [
  {
    id: 1,
    avatarUrl: "https://placehold.co/100x100/EFEFEF/333333?text=User1",
    username: "사용자 이름 1",
    handle: "traveler_dev",
    bio: "모험을 즐기는 개발자.",
  },
  {
    id: 2,
    avatarUrl: "https://placehold.co/100x100/EFEFEF/333333?text=User2",
    username: "다른 사용자 2",
    handle: "photo_master",
    bio: "세상을 사진으로 담아냅니다.",
  },
];

const MOCK_MOVIE_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  id: `movie-${i + 1}`,
  src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=Movie+${i + 1}`,
  alt: `Movie Image ${i + 1}`,
}));

const fetchPosts = (page: number): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newImages = Array.from({ length: 20 }, (_, i) => {
        const id = (page - 1) * 20 + i;
        return {
          id: `post-${id + 1}`,
          src: `https://placehold.co/400x400/CCCCCC/333333?text=Post+${id + 1}`,
          alt: `검색된 게시물 ${id + 1}`,
          likes: Math.floor(Math.random() * 100),
        };
      });
      resolve(newImages);
    }, 500);
  });
};

// --- 개별 결과 컴포넌트 ---

const MovieResults = () => {
  const [activeFilter, setActiveFilter] = useState("latest");
  const filterOptions = [
    { id: "latest", label: "최신순" },
    { id: "bookmark", label: "북마크순" },
  ];

  return (
    <div>
      <div className="flex justify-center gap-8 mb-12">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeFilter === option.id ? "primary" : "secondary"}
            size="sm"
            onClick={() => setActiveFilter(option.id)}
            className="min-w-[100px]"
          >
            {option.label}
          </Button>
        ))}
      </div>
      <GridLayout
        images={MOCK_MOVIE_IMAGES}
        className="md:grid-cols-3 lg:grid-cols-4"
      />
    </div>
  );
};

const PostResults = () => {
  const [posts, setPosts] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  // 컴포넌트가 처음 렌더링될 때 한 번만 게시물을 불러옵니다.
  useEffect(() => {
    const getInitialPosts = async () => {
      const initialPosts = await fetchPosts(1);
      setPosts(initialPosts);
    };
    getInitialPosts();
  }, []);

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const img = target.closest("img");
    if (img?.src) {
      const item = posts.find((p) => p.src === img.src);
      if (item) setSelectedItem(item);
    }
  };

  return (
    <section>
      <h2 className="pb-3 mb-6 text-2xl font-bold text-gray-800 border-b">
        게시물
      </h2>
      <div onClick={handleGridClick}>
        <GridLayout images={posts} className="md:grid-cols-3 lg:grid-cols-4" />
      </div>
      {selectedItem && (
        <PostModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
};

const UserResults = () => {
  const UserCard = ({ user }: { user: UserProfile }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    return (
      <div className="flex flex-wrap items-center justify-between w-full gap-4 py-4 border-b">
        <div className="flex items-center gap-4">
          <Avatar size="xl" />
          <div className="text-left">
            <p className="text-lg font-bold">{user.username}</p>
            <p className="text-sm text-gray-500">@{user.handle}</p>
            <p className="mt-1 text-sm text-gray-700">{user.bio}</p>
          </div>
        </div>
        <Button
          onClick={() => setIsFollowing(!isFollowing)}
          variant={isFollowing ? "secondary" : "primary"}
          size="lg"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>
    );
  };

  return (
    <>
      <section className="mb-16 ">
        <h2 className="pb-3 mb-4 text-2xl font-bold text-gray-800 border-b">
          사용자
        </h2>
        <div className="flex flex-col">
          {mockUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))}
        </div>
      </section>
      <PostResults />
    </>
  );
};

// --- 메인 통합 검색 페이지 컴포넌트 ---

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [activeTab, setActiveTab] = useState("movie");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const tabOptions = [
    { id: "movie", label: "영화" },
    { id: "user", label: "사용자" },
  ];

  const handleSearch = () => {
    console.log(`Searching for '${searchQuery}' in '${activeTab}'...`);
  };

  useEffect(() => {
    const handleScroll = () => setShowScrollButton(window.scrollY > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const queryParam = searchParams.get("q");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  useEffect(() => {
    const root = document.getElementById("root");
    if (!root) return;

    const prevWidth = root.style.width;
    const prevMaxWidth = root.style.maxWidth;
    root.style.width = "1280px"; // 고정 폭 root.style.maxWidth = 'none'; // 기존 max-width 영향 차단(선택)
    return () => {
      root.style.width = prevWidth;
      root.style.maxWidth = prevMaxWidth;
    };
  }, []);

  return (
    <div className="px-4 mx-auto pt-18 max-w-7xl sm:px-6 lg:px-8">
      <Header />
      <SideNavigationBar />

      <div className="mb-16 text-center">
        {searchQuery ? (
          <p className="mt-6 text-lg text-gray-600">
            "<span className="font-semibold">{searchQuery}</span>" 검색 결과
          </p>
        ) : (
          <p className="mt-6 text-lg text-gray-600">
            영화, 사용자, 게시물을 한 곳에서 검색하세요.
          </p>
        )}
        <div className="flex max-w-2xl gap-2 mx-auto mt-10">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button onClick={handleSearch} className="px-8" variant="primary">
            Search
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200">
        <nav className="flex justify-center -mb-px space-x-8" aria-label="Tabs">
          {tabOptions.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm transition-colors duration-200 ease-in-out ${
                activeTab === tab.id
                  ? "border-black text-black"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-8">
        {activeTab === "movie" && <MovieResults />}
        {activeTab === "user" && <UserResults />}
      </div>

      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed z-50 flex items-center justify-center w-12 h-12 text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-full shadow-lg bottom-8 right-8 hover:bg-gray-100 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" strokeWidth={2} />
        </button>
      )}
      <div className="pt-20" />
      <Footer />
    </div>
  );
};

export default SearchPage;
