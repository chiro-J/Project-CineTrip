import { useState, useEffect, useRef } from 'react';
import { InfiniteMasonryLayout } from "../../components/layout/ImageContainer";
import Header from '../../components/layout/Header';
import SideNavigationBar from '../../components/layout/SideNavigationBar';


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
    return new Promise(resolve => {
        console.log(`Fetching page ${page}...`);
        setTimeout(() => {
            const newImages = Array.from({ length: 20 }, (_, i) => {
                const id = page * 20 + i;
                const height = Math.floor(Math.random() * 600) + 200; // 200 to 800px
                return {
                    id: `m-${id}`,
                    src: `https://placehold.co/600x${height}/gray/white?text=Image+${id}`,
                    alt: `Image ${id}`,
                    likes: Math.floor(Math.random() * 2000) + 100
                };
            });
            resolve(newImages);
        }, 500); // 1초 딜레이 시뮬레이션
    });
};

/**
 * 피드 페이지 컴포넌트
 */

const Home = () => {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true); // 더 불러올 데이터가 있는지 여부
  const observerTarget = useRef(null); // 스크롤 감지를 위한 타겟 요소
  const [showScrollButton, setShowScrollButton] = useState(false); // 스크롤 최상단 이동 버튼 표시 여부

  // 이미지 데이터를 불러오는 함수
  const loadMoreImages = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    const newImages = await fetchImages(page);
    if (newImages.length === 0) {
        setHasMore(false); // 더 이상 데이터가 없으면 hasMore를 false로 설정
    } else {
        setImages(prevImages => [...prevImages, ...newImages]);
        setPage(prevPage => prevPage + 1);
    }
    setLoading(false);
  };

  // Intersection Observer 설정
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0] && entries[0].isIntersecting) {
          loadMoreImages();
        }
      },
      { rootMargin: '1500px' } // 뷰포트 경계를 500px 확장, 스크롤이 끝나기 전 로딩
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loading, hasMore]); // loading, hasMore가 바뀔 때 observer를 재설정

  // 스크롤 위치를 감지하여 버튼 표시 여부를 결정하는 Effect
  useEffect(() => {
    const handleScroll = () => {
        if (window.scrollY > 300) {
            setShowScrollButton(true);
        } else {
            setShowScrollButton(false);
        }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
        window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 최상단 이동 함수
  const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
  };

  return (
    <body className='bg-white'>
        <SideNavigationBar isLoggedIn={true} />
        <div className="bg-white mb-6 text-[#111827]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            <nav>
                <Header />
            </nav>
        </div>
        <main className="container px-4 py-12 mx-auto sm:px-6 lg:px-8 bg-white">
            <InfiniteMasonryLayout images={images} />
            {/* 스크롤 감지를 위한 타겟 요소 */}
            <div ref={observerTarget} style={{ height: "20px" }} />
            {/* 로딩 중일 때와 더 이상 데이터가 없을 때 메시지 표시 */}
            {loading && <p className="text-center">Loading more images...</p>}
            {!hasMore && <p className="text-center">All images loaded.</p>}
        </main>
        {/* 스크롤 최상단 이동 버튼 */}
        {showScrollButton && (
            <button 
                onClick={scrollToTop}
                className="fixed bottom-8 right-8 z-50 w-18 h-18 bg-white border border-gray-200 text-gray-700 rounded-full flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors duration-300"
                aria-label="Scroll to top"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        )}
    </body>
  );
};

export default Home;
