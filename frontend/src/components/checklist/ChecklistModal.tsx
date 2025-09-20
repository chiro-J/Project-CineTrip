//미리보기: https://gemini.google.com/share/50249a0df69d

/**
 * @file 체크리스트 생성을 위한 모달 컴포넌트
 */
import { useState, useEffect } from "react";
import type { FC } from "react";
import type { NewChecklistDataType } from "../../types/checklist";
import { CloseIcon } from "./ChecklistPage";
import { Button } from "../ui/Button";
import { useAuth } from "../../contexts/AuthContext";
import { bookmarkService } from "../../services/bookmarkService";
import { tmdbService } from "../../services/tmdbService";

/**
 * 체크리스트 생성 모달 컴포넌트
 */
const CreateChecklistModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewChecklistDataType) => void;
}> = ({ isOpen, onClose, onCreate }) => {
  const { user } = useAuth();
  const [selectedMovie, setSelectedMovie] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sceneLocations, setSceneLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [bookmarkedMovies, setBookmarkedMovies] = useState<any[]>([]);
  const [loadingBookmarks, setLoadingBookmarks] = useState(false);

  // 모달 스크롤 락
  useEffect(() => {
    if (isOpen) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [isOpen]);

  // 북마크된 영화 로드
  useEffect(() => {
    if (isOpen && user) {
      const loadBookmarkedMovies = async () => {
        setLoadingBookmarks(true);
        try {
          console.log("체크리스트 모달: 북마크 로드 시작, userId:", user.id);
          const bookmarks = await bookmarkService.getUserBookmarks(user.id.toString());
          console.log("체크리스트 모달: 북마크 데이터:", bookmarks);

          // 북마크된 영화의 상세 정보 가져오기
          const movieDetails = await Promise.all(
            bookmarks.map(async (bookmark) => {
              try {
                console.log('북마크 데이터:', bookmark);
                const movieDetail = await tmdbService.getMovieDetails(
                  bookmark.tmdb_id
                );
                return {
                  id: bookmark.id,
                  tmdbId: bookmark.tmdb_id,
                  title: movieDetail.title,
                  movieTitle: movieDetail.title,
                  posterPath: movieDetail.poster_path,
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

          setBookmarkedMovies(movieDetails.filter(Boolean));
        } catch (error) {
          console.error("북마크된 영화 로드 실패:", error);
          setBookmarkedMovies([]);
        } finally {
          setLoadingBookmarks(false);
        }
      };

      loadBookmarkedMovies();
    }
  }, [isOpen, user]);

  // 영화 선택 시 촬영지 로드
  useEffect(() => {
    if (selectedMovie) {
      const loadSceneLocations = async () => {
        setLoading(true);
        try {
          // 선택된 영화 정보 가져오기
          const selectedMovieData = bookmarkedMovies.find(
            (movie) => movie.tmdbId.toString() === selectedMovie
          );

          // 쿼리 파라미터 구성
          const params = new URLSearchParams();
          if (selectedMovieData?.movieTitle) {
            params.set("title", selectedMovieData.movieTitle);
          }

          const response = await fetch(
            `http://localhost:3000/llm/prompt/scene/${selectedMovie}?${params}`
          );
          const data = await response.json();
          setSceneLocations(data.items || []);
        } catch (error) {
          console.error("촬영지 로드 실패:", error);
          setSceneLocations([]);
        } finally {
          setLoading(false);
        }
      };
      loadSceneLocations();
    } else {
      setSceneLocations([]);
    }
  }, [selectedMovie, bookmarkedMovies]);

  if (!isOpen) {
    return null;
  }

  const handleCreate = () => {
    // 유효성 검사
    if (!selectedMovie) {
      alert("영화를 선택해주세요.");
      return;
    }
    if (!selectedLocation) {
      alert("촬영지를 선택해주세요.");
      return;
    }
    if (!startDate || !endDate) {
      alert("여행 기간을 선택해주세요.");
      return;
    }

    const selectedMovieData = bookmarkedMovies.find(
      (movie) => movie.tmdbId.toString() === selectedMovie
    );
    const movieTitle = selectedMovieData?.movieTitle || "영화 촬영지";

    // 모달 닫기
    onClose();

    // 체크리스트 생성 시작
    onCreate({
      movie: movieTitle,
      location: selectedLocation,
      startDate,
      endDate,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
      <div className="relative w-full max-w-lg p-8 bg-white rounded-lg shadow-xl">
        <Button
          variant="outline"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5"
        >
          <CloseIcon />
        </Button>

        <h2 className="mb-8 text-2xl font-bold">체크리스트 생성하기</h2>

        <div className="divide-y divide-gray-200">
          {/* 항목 1: 영화 선택 */}
          <div className="py-6 first:pt-0">
            <label htmlFor="movie-select" className="block mb-2 font-semibold">
              영화 선택 <span className="text-red-500">*</span>
            </label>
            <select
              id="movie-select"
              value={selectedMovie}
              onChange={(e) => {
                setSelectedMovie(e.target.value);
                setSelectedLocation(""); // 영화 변경 시 촬영지 초기화
              }}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              required
              disabled={loadingBookmarks}
            >
              <option value="">
                {loadingBookmarks
                  ? "북마크 로딩 중..."
                  : "북마크된 영화를 선택하세요"}
              </option>
              {bookmarkedMovies.map((movie) => (
                <option key={movie.id} value={movie.tmdbId}>
                  {movie.movieTitle}
                </option>
              ))}
            </select>
            {!loadingBookmarks && bookmarkedMovies.length === 0 && (
              <p className="mt-2 text-sm text-gray-500">
                북마크된 영화가 없습니다. 영화 상세 페이지에서 영화를
                북마크해주세요.
              </p>
            )}
          </div>

          {/* 항목 2: 촬영지 선택 */}
          <div className="py-6">
            <label
              htmlFor="location-select"
              className="block mb-2 font-semibold"
            >
              촬영지 선택 <span className="text-red-500">*</span>
            </label>
            {!selectedMovie ? (
              <div className="w-full px-3 py-2 text-center text-gray-500 bg-gray-100 rounded-md">
                먼저 영화를 선택해주세요
              </div>
            ) : loading ? (
              <div className="w-full px-3 py-2 text-center text-gray-500">
                촬영지 정보를 불러오는 중...
              </div>
            ) : (
              <select
                id="location-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
                required
              >
                <option value="" disabled>
                  촬영지를 선택하세요
                </option>
                {sceneLocations.map((location) => (
                  <option key={location.id} value={location.name}>
                    {location.name} ({location.city}, {location.country}) -{" "}
                    {location.scene}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 항목 3: 여행 기간 선택 (시작일) */}
          <div className="py-6">
            <label htmlFor="start-date" className="block mb-2 font-semibold">
              여행 기간 선택 (시작일)
            </label>
            <input
              type="date"
              id="start-date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>

          {/* 항목 4: 여행 기간 선택 (종료일) */}
          <div className="py-6 last:pb-0">
            <label htmlFor="end-date" className="block mb-2 font-semibold">
              여행 기간 선택 (종료일)
            </label>
            <input
              type="date"
              id="end-date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
            />
          </div>
        </div>

        {/* 생성하기 버튼 */}
        <div className="mt-10 text-right">
          <Button
            variant="outline"
            onClick={handleCreate}
            disabled={
              !selectedMovie || !selectedLocation || !startDate || !endDate
            }
          >
            생성하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateChecklistModal;
