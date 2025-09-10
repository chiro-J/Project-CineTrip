import { useState } from "react";
import { Button } from "../../components/ui/Button";
import { GridLayout } from "../../components/layout/ImageContainer";

import Header from "../../components/layout/Header";
import SideNavigationBar from "../../components/layout/SideNavigationBar";

// 테스트용 더미 이미지
const MOCK_GRID_IMAGES = Array.from({ length: 10 }, (_, i) => ({
  id: `grid-${i + 1}`,
  src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=Grid+${i + 1}`,
  alt: `Grid Image ${i + 1}`,
  // likes: Math.floor(Math.random() * 2000) + 100,     // 영화 검색 페이지에는 likes가 필요 없으므로 제외
}));

// 메인 컴포넌트
const MovieSearchMain = () => {
  const [activeFilter, setActiveFilter] = useState("latest");
  const [searchQuery, setSearchQuery] = useState("");

  const filterOptions = [
    { id: "latest", label: "최신순" },
    { id: "bookmark", label: "북마크순" },
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  const handleSearch = () => {
    console.log("Searching for:", searchQuery);
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

      {/* 영화 카드 그리드 */}
      <GridLayout
        images={MOCK_GRID_IMAGES}
        className="md:grid-cols-3 lg:grid-cols-4"
      />
    </div>
  );
};

export default MovieSearchMain;
