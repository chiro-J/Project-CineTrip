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
import { useSearchParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

// --- 타입 정의 ---
type UserProfile = {
  id: number;
  avatarUrl: string;
  username: string;
  handle: string;
  bio: string;
};

// --- Mock 데이터 ---
const allMockUsers: UserProfile[] = [
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
  {
    id: 3,
    avatarUrl: "https://placehold.co/100x100/EFEFEF/333333?text=User3",
    username: "영화 덕후",
    handle: "movie_lover",
    bio: "영화를 사랑하는 사람입니다.",
  },
  {
    id: 4,
    avatarUrl: "https://placehold.co/100x100/EFEFEF/333333?text=User4",
    username: "여행가",
    handle: "travel_enthusiast",
    bio: "세계 여행을 꿈꾸는 모험가입니다.",
  },
  {
    id: 5,
    avatarUrl: "https://placehold.co/100x100/EFEFEF/333333?text=User5",
    username: "개발자 김철수",
    handle: "dev_kim",
    bio: "풀스택 개발자로 일하고 있습니다.",
  },
];

const searchUsers = (query: string): UserProfile[] => {
  if (!query.trim()) return allMockUsers.slice(0, 2);

  return allMockUsers.filter(user =>
    user.username.toLowerCase().includes(query.toLowerCase()) ||
    user.handle.toLowerCase().includes(query.toLowerCase()) ||
    user.bio.toLowerCase().includes(query.toLowerCase())
  );
};

const fetchPosts = (page: number, query?: string): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const baseCount = query && query.trim() ? 8 + Math.floor(Math.random() * 12) : 20;
      const newImages = Array.from({ length: baseCount }, (_, i) => {
        const id = (page - 1) * baseCount + i;
        const searchTerm = query ? query.trim() : "기본";
        return {
          id: `post-${searchTerm}-${id + 1}`,
          src: `https://placehold.co/400x400/CCCCCC/333333?text=${encodeURIComponent(searchTerm)}+${id + 1}`,
          alt: `"${searchTerm}" 검색 결과 게시물 ${id + 1}`,
          likes: Math.floor(Math.random() * 100),
        };
      });
      resolve(newImages);
    }, 500);
  });
};

// --- 결과 컴포넌트들 ---
const PostResults = ({ searchQuery }: { searchQuery: string }) => {
  const [posts, setPosts] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  useEffect(() => {
    const getInitialPosts = async () => {
      const initialPosts = await fetchPosts(1, searchQuery);
      setPosts(initialPosts);
    };
    getInitialPosts();
  }, [searchQuery]);

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const img = target.closest("img") as HTMLImageElement | null;
    if (img?.src) {
      const item = posts.find((p) => p.src === img.src);
      if (item) setSelectedItem(item);
    }
  };

  return (
    <section>
      <h2 className="pt-4 pb-3 mb-6 text-2xl font-bold text-gray-800 border-b-3">
        게시물
      </h2>
      <div onClick={handleGridClick} className="pt-4">
        <GridLayout images={posts} className="md:grid-cols-3 lg:grid-cols-4" />
      </div>
      {selectedItem && (
        <PostModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </section>
  );
};

const UserResults = ({ searchQuery }: { searchQuery: string }) => {
  const [filteredUsers, setFilteredUsers] = useState<UserProfile[]>([]);

  useEffect(() => {
    const users = searchUsers(searchQuery);
    setFilteredUsers(users);
  }, [searchQuery]);

  const UserCard = ({ user }: { user: UserProfile }) => {
    const [isFollowing, setIsFollowing] = useState(false);
    return (
      <div className="flex flex-wrap items-center justify-between w-full gap-4 py-4">
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
      <section className="mb-16">
        <h2 className="pb-3 mb-4 text-2xl font-bold text-gray-800 border-b-3">
          사용자 ({filteredUsers.length}명)
        </h2>
        <div className="flex flex-col">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <UserCard key={user.id} user={user} />
            ))
          ) : (
            <p className="py-8 text-center text-gray-500">
              "{searchQuery}" 검색어에 해당하는 사용자가 없습니다.
            </p>
          )}
        </div>
      </section>
      <PostResults searchQuery={searchQuery} />
    </>
  );
};

// --- 메인 검색 페이지 (사용자만 남김) ---
const SearchResultPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      setSearchParams({ q: searchQuery.trim() });
    } else {
      setSearchParams({});
    }
    console.log(`Searching users & posts for '${searchQuery}'...`);
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
    root.style.width = "1280px"; // 고정 폭
    root.style.maxWidth = "none"; // 기존 max-width 영향 차단(선택)
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
            사용자와 게시물을 검색하세요.
          </p>
        )}
        <div className="flex max-w-2xl gap-2 mx-auto mt-10">
          <input
            type="text"
            placeholder="검색어를 입력하세요..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button onClick={handleSearch} className="px-8" variant="primary">
            Search
          </Button>
        </div>
        <div className="pt-4">
          <p className="mt-3 text-sm text-gray-500">
            영화를 검색하시나요?{" "}
            <Link
              to={
                searchQuery
                  ? `/movies?q=${encodeURIComponent(searchQuery)}`
                  : "/movies"
              }
              className="font-medium text-blue-600 hover:underline"
            >
              영화 검색으로 이동
            </Link>
          </p>
        </div>
      </div>

      {/* 탭 제거, 사용자 결과만 렌더 */}
      <div className="mt-8">
        <UserResults searchQuery={searchQuery} />
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

export default SearchResultPage;
