import { InfiniteMasonryLayout } from "../../components/layout/ImageContainer";
import { Avatar } from "../../components/ui/Avatar";
import Header from "../../components/layout/Header";
import { useEffect, useState, useRef } from "react";
import { Button } from "../../components/ui/Button";
import { ChevronUp } from "lucide-react";
import PostModal from "../../components/post/PostModal";
import SideNavigationBar from "../../components/layout/SideNavigationBar";

type UserProfile = {
  id: number;
  avatarUrl: string;
  username: string;
  handle: string;
  bio: string;
};

type Item = {
  id: string | number;
  src: string;
  alt?: string;
  likes?: number;
};

// --- Mock Data & API 시뮬레이션 ---
const mockUsers: UserProfile[] = [
  {
    id: 1,
    avatarUrl: "https://placehold.co/100x100/EFEFEF/333333?text=User",
    username: "사용자 이름",
    handle: "traveler_dev",
    bio: "Adventure seeker and culinary enthusiast.",
  },
  {
    id: 2,
    avatarUrl: "https://placehold.co/100x100/EFEFEF/333333?text=User",
    username: "다른 사용자",
    handle: "photo_master",
    bio: "Exploring the world one photo at a time.",
  },
];

const fetchPosts = (page: number): Promise<Item[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newImages = Array.from({ length: 20 }, (_, i) => {
        const id = (page - 1) * 20 + i;
        return {
          id: `post-${id + 1}`,
          src: `https://placehold.co/400x${Math.floor(
            Math.random() * (600 - 300 + 1) + 300
          )}/CCCCCC/333333?text=Post+${id + 1}`,
          alt: `검색된 게시물 ${id + 1}`,
          likes: Math.floor(Math.random() * 100),
        };
      });
      resolve(newImages);
    }, 500);
  });
};

const UserCard = ({ user }: { user: UserProfile }) => {
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollowClick = () => {
    setIsFollowing(!isFollowing);
  };

  return (
    <div className="flex flex-wrap items-center justify-between w-full gap-4 py-4 ">
      <div className="flex items-center gap-4">
        <Avatar size="xl" />
        <div className="text-left">
          <p className="text-lg font-bold">{user.username}</p>
          <p className="text-sm text-gray-500">@{user.handle}</p>
          <p className="mt-1 text-sm text-gray-700">{user.bio}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-center"></div>
        <Button
          onClick={handleFollowClick}
          variant={isFollowing ? "secondary" : "primary"}
          size="lg"
        >
          {isFollowing ? "Following" : "Follow"}
        </Button>
      </div>
    </div>
  );
};

const SearchResultPage = () => {
  const [posts, setPosts] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerTarget = useRef(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const loadMorePosts = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newPosts = await fetchPosts(page);
    if (newPosts.length === 0) {
      setHasMore(false);
    } else {
      setPosts((prevPosts) => [...prevPosts, ...newPosts]);
      setPage((prevPage) => prevPage + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          loadMorePosts();
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, hasMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const [selectedItem, setSelectedItem] = useState<Item | null>(null);

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const img = target.closest("img") as HTMLImageElement | null;
    if (!img) return;

    const src = img.getAttribute("src");
    if (!src) return;

    const item = posts.find((p) => p.src === src);
    if (item) setSelectedItem(item);
  };

  return (
    <div className="w-full min-h-screen ">
      <SideNavigationBar />
      <div className="container p-4 mx-auto sm:p-6 md:p-8">
        <Header />
        <main>
          <h1 className="pt-10 mb-8 text-3xl font-extrabold tracking-tight text-gray-900">
            검색 결과
          </h1>
          <section className="mb-12">
            <h2 className="pb-3 mb-4 text-2xl font-bold text-gray-800 border-b">
              사용자
            </h2>
            <div className="flex flex-col divide-y divide-gray-200">
              {mockUsers.length > 0 ? (
                mockUsers.map((user) => <UserCard key={user.id} user={user} />)
              ) : (
                <p className="py-4 text-gray-500">
                  일치하는 사용자가 없습니다.
                </p>
              )}
            </div>
          </section>

          <section>
            <h2 className="pb-3 mb-6 text-2xl font-bold text-gray-800 border-b">
              게시물
            </h2>
            <div onClick={handleGridClick}>
              {posts.length > 0 ? (
                <InfiniteMasonryLayout images={posts} />
              ) : (
                !loading &&
                !hasMore && (
                  <p className="py-4 text-gray-500">
                    일치하는 게시물이 없습니다.
                  </p>
                )
              )}
            </div>
            <div ref={observerTarget} style={{ height: "50px" }} />
            {loading && (
              <p className="py-4 text-center text-gray-500">불러오는 중...</p>
            )}
            {!hasMore && posts.length > 0 && (
              <p className="py-4 text-center text-gray-500">
                모든 게시물을 불러왔습니다.
              </p>
            )}
          </section>
        </main>
      </div>
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed z-50 flex items-center justify-center text-gray-700 transition-all duration-300 bg-white border border-gray-200 rounded-full shadow-lg bottom-8 right-8 hover:bg-gray-100 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ChevronUp className="w-6 h-6" strokeWidth={2} />
        </button>
      )}
      {selectedItem && <PostModal item={selectedItem} onClose={closeModal} />}
    </div>
  );
};

export default SearchResultPage;
