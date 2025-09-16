import { useState, useEffect, useRef } from "react";
import { InfiniteMasonryLayout } from "../../components/layout/ImageContainer";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";
import PostModal from "../../components/post/PostModal";


// --- 시각적 확인을 위한 임시 플레이스홀더 컴포넌트 ---

type ImageItem = {
  id: string | number;
  src: string;
  alt?: string;
  likes?: number;
};

/**
 * 서버에서 데이터를 가져오는 함수를 시뮬레이션
 * 실제로는 fetch나 axios를 사용하여 API를 호출
 * @param page - 요청할 페이지 번호
 * @returns {Promise<ImageItem[]>} - 이미지 데이터 배열을 반환하는 프로미스
 */
const fetchImages = (page: number): Promise<ImageItem[]> => {
  return new Promise((resolve) => {
    console.log(`Fetching page ${page}...`);
    setTimeout(() => {

      const newImages = Array.from({ length: 5 }, (_, i) => {
        const id = page * 5 + i;

        const height = Math.floor(Math.random() * 600) + 200; // 200 to 800px
        return {
          id: `m-${id}`,
          src: `https://placehold.co/600x${height}/gray/white?text=Image+${id}`,
          alt: `Image ${id}`,
          likes: Math.floor(Math.random() * 2000) + 100,
        };
      });
      resolve(newImages);
    }, 1000); // 1초 딜레이 시뮬레이션
  });
};

/**
 * 피드 페이지 컴포넌트
 */

const Home = () => {
  // Zustand 스토어에서 로그인 상태와 모달 상태를 가져옵니다.
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn);
  const isLoginModalOpen = useAuthStore((state) => state.isLoginModalOpen);
  const openLoginModal = useAuthStore((state) => state.openLoginModal);
  const closeLoginModal = useAuthStore((state) => state.closeLoginModal);
  
  const navigate = useNavigate();
  const [images, setImages] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const observerTarget = useRef(null); // 스크롤 감지를 위한 타겟 요소
  const [showScrollButton, setShowScrollButton] = useState(false); // 스크롤 최상단 이동 버튼 표시 여부
  const [showLoginModal, setShowLoginModal] = useState(false); // 로그인 모달 표시 여부
  const [hasTriggeredModal, setHasTriggeredModal] = useState(false); // 모달이 이미 트리거되었는지 확인

  // 로그인 상태 변경 시 상태 초기화
  useEffect(() => {
    if (isLoggedIn) {
      setShowLoginModal(false);
      setHasTriggeredModal(false);
    }
  }, [isLoggedIn]);

  // 비로그인 사용자 스크롤 감지
  useEffect(() => {
    if (!isLoggedIn && !hasTriggeredModal) {
      const handleScroll = () => {
        // 화면 높이의 절반 정도 스크롤하면 로그인 모달 표시
        if (window.scrollY > window.innerHeight * 0.5) {
          setShowLoginModal(true);
          setHasTriggeredModal(true);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [isLoggedIn, hasTriggeredModal]);

  // 이미지 데이터를 불러오는 함수
  const loadMoreImages = async () => {
    if (loading || !hasMore) return;

    // 비로그인 사용자이고 로그인 모달이 표시되었으면 로딩 중지
    if (!isLoggedIn && showLoginModal) return;

    setLoading(true);
    const newImages = await fetchImages(page);
    if (newImages.length === 0) {
      setHasMore(false); // 더 이상 데이터가 없으면 hasMore를 false로 설정
    } else {
      setImages((prevImages) => [...prevImages, ...newImages]);
      setPage((prevPage) => prevPage + 1);
    }
    setLoading(false);
  };

  // Intersection Observer 설정
  useEffect(() => {
    // 비로그인 상태에서 모달이 이미 트리거되었으면 observer를 아예 설정하지 않음
    if (!isLoggedIn && hasTriggeredModal) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 로그인 모달이 표시되었거나 비로그인 상태에서 모달이 트리거되었으면 로딩 중지
        if (!isLoggedIn && showLoginModal) return;

        if (entries[0] && entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { rootMargin: "1500px" } // 뷰포트 경계를 500px 확장, 스크롤이 끝나기 전 로딩
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, hasMore, isLoggedIn]); // hasTriggeredModal과 showLoginModal을 dependency에서 제거

  // 스크롤 위치를 감지하여 버튼 표시 여부를 결정하는 Effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 최상단 이동 함수
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // 로그인 모달 닫기 핸들러 - Landing 페이지로 이동
  const handleLoginModalClose = () => {
    if (!isLoggedIn) {
      navigate("/");
    } else {
      setShowLoginModal(false);
    }
  };
  // post-modal 관련 함수
  const [selectedItem, setSelectedItem] = useState<ImageItem | null>(null);

  const closeModal = () => {
    setSelectedItem(null);
  };

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const img = target.closest("img") as HTMLImageElement | null;
    if (!img) return;

    const src = img.getAttribute("src");
    if (!src) return;

    const item = images.find((p) => p.src === src);
    if (item) setSelectedItem(item);
  };

  return (
    <>
      <div onClick={handleGridClick}>
        <main className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
          <InfiniteMasonryLayout images={images} />
          {/* 스크롤 감지를 위한 타겟 요소 */}
          <div ref={observerTarget} style={{ height: "20px" }} />
          {/* 로딩 중일 때와 더 이상 데이터가 없을 때 메시지 표시 */}
          {loading && <p className="text-center">Loading more images...</p>}
          {!hasMore && <p className="text-center">All images loaded.</p>}
        </main>
      </div>

      {/* 스크롤 최상단 이동 버튼 */}
      {showScrollButton && (
        <button
          onClick={scrollToTop}
          className="fixed z-50 flex items-center justify-center text-gray-700 transition-colors duration-300 bg-white border border-gray-200 rounded-full shadow-lg bottom-8 right-8 w-18 h-18 hover:bg-gray-100"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
      )}

      {selectedItem && <PostModal item={selectedItem} onClose={closeModal} />}
    </>
  );
};

export default Home;
