import React, { useState, useRef, useEffect } from "react";
import { Avatar } from "../../components/ui/Avatar"; // 가정된 Avatar 컴포넌트 경로
import logo from "../../assets/logos/logo.png";
import { GridLayout } from "../../components/layout/ImageContainer";
import Footer from "../../components/layout/Footer";
import SocialLoginModal from "../../components/auth/Login";

/**
 * 사용자 프로필 정보 인터페이스
 * @property username - 사용자 이름
 * @property email - 사용자 이메일 (드롭다운 메뉴에서 필요)
 * @property avatarUrl - 사용자 아바타 이미지 URL
 */
interface UserProfile {
  username: string;
  email: string; // 드롭다운 메뉴에서 사용하기 위해 email 추가
  avatarUrl: string;
}

interface HeaderProps {
  user?: UserProfile;
}

interface LandingHeaderProps {
  user?: UserProfile;
  onLoginClick: () => void;
}

/**
 * 랜딩페이지용 헤더 컴포넌트
 */
const Header = ({ user, onLoginClick }: LandingHeaderProps): React.ReactElement => {
  return (
    <nav className="fixed top-0 left-0 z-50 flex items-center justify-between w-full px-6 py-3 bg-white shadow-md">
      {/* 1. 로고 영역 (이동 기능 제거) */}
      <div className="flex items-center space-x-2">
        <img
          src={logo}
          alt="CineTrip Logo"
          className="w-8 h-8 rounded-full" // 로고 스타일에 맞게 className을 수정하세요.
        />
        <span className="text-xl font-bold text-gray-800">CineTrip</span>
      </div>

      {/* 3. 사용자 정보 및 드롭다운 영역 */}
      <div className="relative">
        {user ? (
          // 로그인 상태: 클릭 가능한 사용자 프로필 영역
          <>
            <button className="flex items-center space-x-3">
              <Avatar size="md" src={user.avatarUrl} alt={user.username} />
              <span className="font-medium text-gray-700">{user.username}</span>
            </button>
          </>
        ) : (
          // 로그아웃 상태: 로그인 버튼
          <button 
            onClick={onLoginClick}
            className="px-4 py-1.5 text-sm font-medium text-black bg-white rounded-md hover:!bg-gray-400"
          >
            로그인
          </button>
        )}
      </div>
    </nav>
  );
};

const LandingStyles = () => (
  <>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" />

    <link
      href="https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700&family=Noto+Sans+KR:wght@400;500;700&display=swap"
      rel="stylesheet"
    />

    <style>{`
        body {
            font-family: 'Noto Sans KR', sans-serif;
            // background-color: #FFFFFF; /* 흰색 배경으로 변경 */
            color: #000000; /* 기본 텍스트 검은색으로 변경 */
            overflow-x: hidden;
        }
        .font-serif {
            font-family: 'Nanum Myeongjo', serif;
        }
        .decorative-text {
            position: absolute;
            font-size: 12rem;
            font-weight: bold;
            color: rgba(0, 0, 0, 0.04); /* 어두운 색으로 변경 */
            z-index: 0;
            user-select: none;
        }
        /* Cover Flow Carousel Styles */
        #carousel-viewport {
            perspective: 2000px;
            overflow: hidden;
        }
        #scene-carousel {
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
        }
        .carousel-slide {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
            transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1),
                        opacity 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
    `}</style>
  </>
);

export const Landing = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const viewportRef = useRef(null);
  const slidesRef = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const isAnimatingRef = useRef(false);

  const slidesData = [
    {
      id: "A",
      text: "첫 번째 명장면 대사",
      movie: "영화 제목 1 | 촬영 장소",
      color: "BDBDBD",
    },
    {
      id: "B",
      text: "두 번째 명장면 대사",
      movie: "영화 제목 2 | 촬영 장소",
      color: "9E9E9E",
    },
    {
      id: "C",
      text: "세 번째 명장면 대사",
      movie: "영화 제목 3 | 촬영 장소",
      color: "757575",
    },
    {
      id: "D",
      text: "네 번째 명장면 대사",
      movie: "영화 제목 4 | 촬영 장소",
      color: "616161",
    },
  ];
  const totalSlides = slidesData.length;

  // 그리드용 목 데이터 추가
  const MOCK_GRID_IMAGES = [
    {
      id: "grid-1",
      src: "https://placehold.co/400x500/E0E0E0/333333?text=User+Trip+1",
      alt: "장소 이름 (영화 제목)",
      likes: 138,
    },
    {
      id: "grid-2",
      src: "https://placehold.co/400x500/E0E0E0/333333?text=User+Trip+2",
      alt: "장소 이름 (영화 제목)",
      likes: 102,
    },
    {
      id: "grid-3",
      src: "https://placehold.co/400x500/E0E0E0/333333?text=User+Trip+3",
      alt: "장소 이름 (영화 제목)",
      likes: 95,
    },
  ];

  // Effect to update carousel styles when activeIndex changes
  useEffect(() => {
    slidesRef.current.forEach((slide, i) => {
      if (!slide) return;

      let offset = i - activeIndex;

      if (Math.abs(offset) > totalSlides / 2) {
        offset = offset > 0 ? offset - totalSlides : offset + totalSlides;
      }

      const zIndex = totalSlides - Math.abs(offset);
      let translateX, translateZ, scale, opacity;

      let baseTranslateZ = -400;
      let baseScale = 0.5;

      if (offset === 0) {
        // Center card
        translateX = 0;
        translateZ = 0;
        scale = 1;
        opacity = 1;
      } else if (Math.abs(offset) === 1) {
        // Side cards
        translateX = offset * 300;
        translateZ = -200;
        scale = 0.8;
        opacity = 1;
      } else {
        // Hidden cards moving to the back
        translateX = offset > 0 ? 150 : -150;
        translateZ = baseTranslateZ;
        scale = baseScale;
        opacity = 0;
      }

      slide.style.transform = `translateX(${translateX}px) translateZ(${translateZ}px) scale(${scale})`;
      slide.style.opacity = `${opacity}`;
      slide.style.zIndex = `${zIndex}`;
      slide.style.pointerEvents = Math.abs(offset) > 0 ? "none" : "auto";
    });
  }, [activeIndex, totalSlides]);


  // Effect to set up and clean up the wheel event listener
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (isAnimatingRef.current) return;

      isAnimatingRef.current = true;

      if (e.deltaY < 0) {
        // Scroll Up
        setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
      } else {
        // Scroll Down
        setActiveIndex((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
      }

      setTimeout(() => {
        isAnimatingRef.current = false;
      }, 400);
    };

    const viewport = viewportRef.current;
    if (viewport) {
      (viewport as HTMLDivElement).addEventListener("wheel", handleWheel, {
        passive: false,
      });
    }

    return () => {
      if (viewport) {
        (viewport as HTMLDivElement).removeEventListener("wheel", handleWheel);
      }
    };
  }, [totalSlides]);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleLoginModalClose = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <>
      <Header onLoginClick={handleLoginClick} />
      <SocialLoginModal isOpen={isLoginModalOpen} onClose={handleLoginModalClose} />
      <LandingStyles />
      <main className="relative mt-16" onClick={handleLoginClick}>
        {/* Hero Section */}
        <section className="relative h-[70vh] flex flex-col items-center justify-center text-center px-6 overflow-hidden bg-gray-700 text-white">
          <div className="relative z-10 space-y-4">
            <p className="font-serif text-4xl md:text-5xl">영화 속 그곳,</p>
            <h2 className="text-3xl font-bold md:text-4xl">
              당신의 다음 여행지가 됩니다.
            </h2>
            <p className="max-w-sm mx-auto text-sm text-gray-300">
              이곳 저곳 헤매며 찾지 말고, 영화 속 그곳을 CINE TRIP에서 바로
              확인하세요.
            </p>
            <div className="flex justify-center pt-6 space-x-4">
              <button 
                onClick={handleLoginClick}
                className="px-8 py-3 text-sm font-bold text-white transition-all bg-black rounded-md hover:bg-gray-800"
              >
                내 여행지 찾아보기
              </button>
              <button 
                onClick={handleLoginClick}
                className="px-8 py-3 text-sm text-gray-400 transition-all border border-gray-500 rounded-md hover:bg-gray-600"
              >
                오늘의 추천 명소
              </button>
            </div>
          </div>
        </section>

        {/* Location Highlight - 삭제 (디자인 시안에 없음) */}

        {/* Cover Flow Carousel Section */}
        <section className="relative py-24 mt-12 text-black">
          <span className="font-serif -translate-x-1/2 decorative-text -top-8 left-1/2 opacity-5">
            Movie
          </span>
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold">오늘의 영화 명장면</h3>
            <p className="mt-2 text-sm text-gray-600">
              마우스 스크롤로 명장면을 넘겨보세요.
            </p>
          </div>
          <div
            id="carousel-viewport"
            ref={viewportRef}
            className="relative w-full h-[450px] mx-auto"
          >
            <div id="scene-carousel">
              {slidesData.map((slide, index) => (
                <div
                  key={slide.id}
                  ref={(el) => {
                    slidesRef.current[index] = el;
                  }}
                  className="flex items-center justify-center p-4 carousel-slide"
                >
                  <div className="relative text-center">
                    <img
                      src={`https://placehold.co/600x400/${slide.color}/333333?text=Main+Scene+${slide.id}`}
                      alt={`메인 장면 ${slide.id}`}
                      className="object-cover w-full max-w-md rounded-lg"
                    />
                    <p className="mt-4 text-sm font-semibold">"{slide.text}"</p>
                    <p className="text-xs text-gray-500">{slide.movie}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* User Trips Grid Section */}
        <section className="relative py-24 text-black">
          <span className="font-serif translate-x-1/2 decorative-text -top-8 right-1/2 opacity-5">
            Where
          </span>
          <div className="mb-12 text-center">
            <h3 className="text-3xl font-bold">
              다른 유저들은 어디에 갔을까요?
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              사용자들이 공유한 영화 속 여행지를 확인해보세요.
            </p>
          </div>
          <GridLayout images={MOCK_GRID_IMAGES} className="grid-cols-3" />
        </section>
      </main>
      <Footer />
    </>
  );


};

// function App() {
//   return (
//     <div>
//       <Landing />
//     </div>
//   );
// }

// export default App;

// 랜딩 페이지 예제 코드

// import { Landing, Header } from "./pages/landing";

// import "./App.css";

// function App() {
//   return (
//     <div>
//       <Header />
//       <Landing />
//     </div>
//   );
// }

// export default App;
