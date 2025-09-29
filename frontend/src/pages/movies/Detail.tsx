import Card from "../../components/ui/Card";
import { GridLayout } from "../../components/layout/ImageContainer";
import { Button } from "../../components/ui/Button";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SideNavigationBar from "../../components/layout/SideNavigationBar";
import PostModal from "../../components/post/PostModal";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { type Item } from "../../types/common";
import { tmdbService } from "../../services/tmdbService";
import { type Movie, getImageUrl } from "../../types/movie";
import { useAuth } from "../../contexts/AuthContext";
import { useLocationStore } from "../../stores/locationStrore";

// 테스트를 위한 목업 이미지

const MOCK_GRID_IMAGES2 = Array.from({ length: 4 }, (_, i) => ({
  id: `nearby-${i + 1}`,
  src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=Nearby+${i + 1}`,
  alt: `Nearby Place ${i + 1}`,
  likes: Math.floor(Math.random() * 2000) + 100, // 각 이미지에 랜덤 좋아요 수 추가
}));

const MOCK_GRID_IMAGES3 = Array.from({ length: 3 }, (_, i) => ({
  id: `user-${i + 1}`,
  src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=User+${i + 1}`,
  alt: `User Photo ${i + 1}`,
  likes: Math.floor(Math.random() * 2000) + 100, // 각 이미지에 랜덤 좋아요 수 추가
}));

// --- 시각적 확인을 위한 임시 플레이스홀더 컴포넌트 ---

// 별점 표시 컴포넌트
const StarRating = ({ rating }: { rating: number }) => {
  // 10점 만점을 5점 만점으로 변환
  const normalizedRating = rating / 2;

  // 별 개수 계산 (0-5)
  const fullStars = Math.floor(normalizedRating);
  const hasHalfStar = normalizedRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center mt-2">
      <div className="inline-flex items-center gap-[2px]">
        {/* 완전한 별들 */}
        {Array.from({ length: fullStars }, (_, i) => (
          <svg
            key={`full-${i}`}
            className="w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}

        {/* 절반 별 */}
        {hasHalfStar && (
          <div className="relative w-6 h-6">
            <svg
              className="w-6 h-6 text-gray-300"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="absolute inset-0 w-1/2 overflow-hidden">
              <svg
                className="w-6 h-6 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          </div>
        )}

        {/* 빈 별들 */}
        {Array.from({ length: emptyStars }, (_, i) => (
          <svg
            key={`empty-${i}`}
            className="w-6 h-6 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="ml-3 text-xl font-bold text-gray-800">
        {(rating / 2).toFixed(1)}
      </span>
    </div>
  );
};

const handleClick = () => {
  console.log("Button clicked!");
};

/**
 * 영화 상세 정보 페이지 컴포넌트
 */
const MovieDetails = () => {
  const { movieId } = useParams<{ movieId: string }>();
  const { toggleBookmark, isBookmarked } = useAuth();
  const [selectedImage, setSelectedImage] = useState<Item | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookmarked, setBookmarked] = useState(false);

  // 촬영지 관련 상태
  const {
    items: sceneItems,
    loading: sceneLoading,
    error: sceneError,
    loadByTmdb,
  } = useLocationStore();

  // 북마크 토글 핸들러
  const handleBookmarkToggle = async () => {
    if (movieId) {
      await toggleBookmark(parseInt(movieId));
      // 북마크 상태 업데이트
      const isBooked = await isBookmarked(parseInt(movieId));
      setBookmarked(isBooked);
    }
  };

  // 영화 데이터 로드 (TMDB API만)
  useEffect(() => {
    const loadMovieDetails = async () => {
      if (!movieId) {
        setError("영화 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const movieData = await tmdbService.getMovieDetails(parseInt(movieId));
        setMovie(movieData);
        
        // 북마크 상태 확인
        const isBooked = await isBookmarked(parseInt(movieId));
        setBookmarked(isBooked);
      } catch (err) {
        setError("영화 정보를 불러오는데 실패했습니다.");
        console.error("Error loading movie details:", err);
      } finally {
        setLoading(false);
      }
    };

    loadMovieDetails();
  }, [movieId, isBookmarked]);

  // 촬영지 정보 로드 (영화 데이터 로드 후 별도로 실행)
  useEffect(() => {
    const loadSceneLocations = async () => {
      if (!movieId || !movie) return;

      try {
        await loadByTmdb(parseInt(movieId), {
          movieInfo: {
            title: movie.title,
            originalTitle: movie.original_title,
            country: movie.production_countries?.[0]?.name,
            language: movie.original_language,
          },
        });
      } catch (err) {
        console.error("Error loading scene locations:", err);
      }
    };

    loadSceneLocations();
  }, [movieId, movie, loadByTmdb]);

  // '유저 사진' 그리드에서 이미지를 클릭했을 때 실행될 핸들러 함수를 추가합니다.
  const handleUserImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const imgElement = target.closest("img"); // 클릭된 요소가 이미지인지 확인합니다.

    if (imgElement && imgElement.src) {
      // 클릭된 이미지의 src와 일치하는 데이터를 MOCK_GRID_IMAGES3에서 찾습니다.
      const foundImage =
        [...MOCK_GRID_IMAGES3, ...MOCK_GRID_IMAGES2].find(
          (img) => img.src === imgElement.src
        ) || null;
      if (foundImage) {
        setSelectedImage(foundImage); // 찾은 이미지로 state를 업데이트하여 모달을 엽니다.
      }
    }
  };

  // 에러 상태 (영화 정보 로딩 실패)
  if (error || (!loading && !movie)) {
    return (
      <>
        <Header />
        <SideNavigationBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-red-600">
            {error || "영화를 찾을 수 없습니다."}
          </div>
        </div>
      </>
    );
  }

  // 영화 정보 로딩 중
  if (loading || !movie) {
    return (
      <>
        <Header />
        <SideNavigationBar />
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">
            영화 정보를 불러오는 중...
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <Header />
        <SideNavigationBar />
      </div>
      <div
        className="text-[#111827]"
        style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
      >
        <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
          {/* 1. 영화 정보 섹션 */}
          <section className="mb-18">
            <h2 className="mt-8 mb-12 text-2xl font-bold text-center">
              영화 정보
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
              {/* 영화 포스터 (Card 컴포넌트 위치) */}
              <div className="col-span-1">
                <Card
                  src={getImageUrl(movie.poster_path, "w500")}
                  alt={movie.title}
                />
              </div>

              {/* 영화 상세 정보 */}
              <div className="col-span-2 space-y-6">
                <div className="mb-8">
                  <h3 className="mb-8 text-3xl font-bold">{movie.title}</h3>
                  <StarRating rating={movie.vote_average} />
                </div>
                <div className="mb-8 text-left">
                  <h4 className="text-lg font-semibold">줄거리</h4>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">
                    {movie.overview || "줄거리 정보가 없습니다."}
                  </p>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-semibold">개봉일자</h4>
                  <p className="mt-2 text-sm text-gray-600">
                    {movie.release_date
                      ? new Date(movie.release_date).toLocaleDateString("ko-KR")
                      : "개봉일 정보가 없습니다."}
                  </p>
                </div>
                <div className="text-left">
                  <Button
                    variant={bookmarked ? "secondary" : "primary"}
                    onClick={handleBookmarkToggle}
                    className={`mt-4 ${bookmarked ? "bg-gray-500 hover:bg-gray-600" : ""}`}
                  >
                    {bookmarked ? "✓ 북마크됨" : "+ 북마크"}
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 영화 명장면 촬영지 섹션 */}
          <section className="mb-18">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold">영화 명장면 촬영지</h2>
            </div>

            {sceneLoading && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="w-8 h-8 mb-4 border-4 border-blue-200 rounded-full border-t-blue-600 animate-spin"></div>
                <div className="text-lg text-gray-600">
                  촬영지 정보를 불러오는 중...
                </div>
                <div className="mt-2 text-sm text-gray-400">
                  AI가 영화 장면을 분석하고 있습니다
                </div>
              </div>
            )}

            {sceneError && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="mb-2 text-lg text-red-600">
                    ⚠️ 오류가 발생했습니다
                  </div>
                  <div className="text-gray-500">{sceneError}</div>
                </div>
              </div>
            )}

            {!sceneLoading && !sceneError && sceneItems.length === 0 && (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="mb-2 text-lg text-gray-500">📍</div>
                  <div className="text-gray-500">촬영지 정보가 없어요.</div>
                </div>
              </div>
            )}

            {!sceneLoading && !sceneError && sceneItems.length > 0 && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
                {sceneItems.map((scene: any) => (
                  <div
                    key={scene.id}
                    className="flex flex-col w-full h-48 p-3 transition-shadow border border-gray-200 rounded-lg cursor-pointer scene-card hover:shadow-md"
                    onClick={() => {
                      const query = encodeURIComponent(
                        `${scene.name} ${scene.address}`
                      );
                      window.open(
                        `https://www.google.com/maps/search/?api=1&query=${query}`,
                        "_blank"
                      );
                    }}
                  >
                    <div className="flex flex-col h-full gap-3">
                      <div className="flex flex-col flex-1">
                        <div
                          className="mb-1 text-lg font-semibold truncate"
                          title={scene.name}
                        >
                          {scene.name}
                        </div>
                        <div
                          className="mb-1 text-sm text-gray-600 truncate"
                          title={`${scene.country} · ${scene.city}`}
                        >
                          {scene.country} · {scene.city}
                        </div>
                        <div
                          className="mb-2 text-sm text-gray-500 truncate"
                          title={scene.address}
                        >
                          {scene.address}
                        </div>
                        <div className="flex flex-col justify-between flex-1 p-2 text-sm rounded bg-blue-50">
                          <div>
                            <span className="font-medium">장면:</span>
                            <div className="mt-1 marquee" title={scene.scene}>
                              <span className="marquee-text">
                                {scene.scene}
                              </span>
                            </div>
                          </div>
                          {scene.timestamp && (
                            <div className="mt-1 text-xs font-medium text-gray-600">
                              ⏰ {scene.timestamp}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* 3. 명장면 인근 추천 장소 섹션 */}
          <section className="mb-18">
            <div className="grid items-center grid-cols-3 mb-8">
              <div />
              <h2 className="text-2xl font-bold text-center">
                촬영지 인근 추천 장소
              </h2>
              <div className="justify-self-end">
                {/* 더보기 버튼 */}
                <Button variant="outline" onClick={handleClick}>
                  더보기
                </Button>
              </div>
            </div>
            {/* Grid 컴포넌트 (4개 아이템) */}
            <div onClick={handleUserImageClick} className="cursor-pointer">
              <GridLayout images={MOCK_GRID_IMAGES2} className="grid-cols-4" />
            </div>
          </section>

          {/* 4. 유저 사진 섹션 */}
          <section>
            <div className="grid items-center grid-cols-3 mb-8">
              <div />
              <h2 className="text-2xl font-bold text-center">유저 사진</h2>
              <div className="justify-self-end">
                {/* 더보기 버튼 */}
                <Button variant="outline" onClick={handleClick}>
                  더보기
                </Button>
              </div>
            </div>
            {/* Grid 컴포넌트 위치 */}
            <div onClick={handleUserImageClick} className="cursor-pointer">
              <GridLayout images={MOCK_GRID_IMAGES3} className="grid-cols-3" />
            </div>
          </section>
        </div>
      </div>
      <Footer />

      {/* 4. selectedImage가 있을 때만 PostModal을 렌더링합니다. */}
      {selectedImage && (
        <PostModal
          item={selectedImage}
          onClose={() => setSelectedImage(null)} // 모달을 닫을 때 state를 null로 초기화합니다.
        />
      )}
    </>
  );
};

export default MovieDetails;
