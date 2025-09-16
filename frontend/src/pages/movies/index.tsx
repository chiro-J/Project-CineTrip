// index.tsx (MovieSearchMain)
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "../../components/ui/Button";
import { GridLayout } from "../../components/layout/ImageContainer";

import Header from "../../components/layout/Header";
import SideNavigationBar from "../../components/layout/SideNavigationBar";
import { tmdbService } from "../../services/tmdbService";
import {
  type Movie,
  convertMovieToImage,
  type MovieImage,
} from "../../types/movie";

// 메인 컴포넌트
const MovieSearchMain = () => {
  const navigate = useNavigate();
  const [sp] = useSearchParams();

  const [activeFilter, setActiveFilter] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movieImages, setMovieImages] = useState<MovieImage[]>([]);

  const filterOptions = [
    { id: "latest", label: "최신순" },
    { id: "popular", label: "인기순" },
  ];

  // 영화 데이터 로드
  const loadMovies = async (filter: string) => {
    setLoading(true);
    setError(null);
    try {
      let response;
      if (filter === "latest") {
        response = await tmdbService.getLatestMovies();
      } else if (filter === "popular") {
        response = await tmdbService.getPopularMovies();
      } else {
        response = await tmdbService.getLatestMovies();
      }

      setMovies(response.results);
      const images = response.results.map(convertMovieToImage);
      setMovieImages(images);
    } catch (err) {
      setError("영화 데이터를 불러오는데 실패했습니다.");
      console.error("Error loading movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // 페이지 로드 시: URL ?q=가 있으면 그걸로 자동 검색, 없으면 기본 목록
  useEffect(() => {
    const urlQ = (sp.get("q") ?? "").trim();
    if (urlQ) {
      setSearchQuery(urlQ);
      // 기존 handleSearch 수정 없이 여기서 직접 검색 실행
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await tmdbService.searchMovies(urlQ);
          setMovies(response.results);
          const images = response.results.map(convertMovieToImage);
          setMovieImages(images);
        } catch (err) {
          setError("영화 검색에 실패했습니다.");
          console.error("Error searching movies:", err);
        } finally {
          setLoading(false);
        }
      })();
    } else {
      loadMovies(activeFilter);
    }
  }, [sp]);

  // 필터 변경 시: URL에 q가 없을 때만 동작(검색 결과 덮어쓰지 않도록)
  useEffect(() => {
    const hasQ = !!(sp.get("q") ?? "").trim();
    if (!hasQ) {
      loadMovies(activeFilter);
    }
  }, [activeFilter, sp]);

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const response = await tmdbService.searchMovies(searchQuery);
      setMovies(response.results);
      const images = response.results.map(convertMovieToImage);
      setMovieImages(images);
    } catch (err) {
      setError("영화 검색에 실패했습니다.");
      console.error("Error searching movies:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleGridClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const imgElement = target.closest("img");

    if (imgElement && imgElement.src) {
      // 클릭된 이미지의 src와 일치하는 영화를 찾습니다
      const foundImage = movieImages.find((img) => img.src === imgElement.src);
      if (foundImage) {
        navigate(`/movies/${foundImage.id}`);
      }
    }
  };

  return (
    <div className="px-4 py-24 mx-auto max-w-7xl">
      <Header />
      <SideNavigationBar />
      <div className="mb-24 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Find Your Next Movie
        </h1>
        <p className="mb-10 text-lg text-gray-600">
          Search across movies, users, and databases.
        </p>

        {/* 검색 바 */}
        <div className="flex max-w-2xl gap-2 mx-auto">
          <input
            type="text"
            placeholder="Enter movie title"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button onClick={handleSearch} className="px-8">
            Search
          </Button>
        </div>
      </div>

      {/* 필터 버튼들 */}
      <div className="flex justify-center gap-8 mb-12">
        {filterOptions.map((option) => (
          <Button
            key={option.id}
            variant={activeFilter === option.id ? "primary" : "secondary"}
            size="sm"
            onClick={() => handleFilterChange(option.id)}
            className="min-w-[100px]"
          >
            {option.label}
          </Button>
        ))}
      </div>

      {/* 로딩 및 에러 상태 */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-gray-600">
            영화 데이터를 불러오는 중.
          </div>
        </div>
      )}

      {error && (
        <div className="flex items-center justify-center py-20">
          <div className="text-lg text-red-600">{error}</div>
        </div>
      )}

      {/* 영화 카드 그리드 */}
      {!loading && !error && (
        <div onClick={handleGridClick} className="cursor-pointer">
          <div className="[&_.aspect-square]:aspect-[2/3]">
            <GridLayout
              images={movieImages}
              className="md:grid-cols-3 lg:grid-cols-4"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieSearchMain;
