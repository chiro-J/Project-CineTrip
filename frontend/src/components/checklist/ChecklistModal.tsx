//미리보기: https://gemini.google.com/share/50249a0df69d

/**
 * @file 체크리스트 생성을 위한 모달 컴포넌트
 */
import { useState } from "react";
import type { FC } from "react";
import type { NewChecklistDataType } from "../../types/checklist";
import { CloseIcon } from "./ChecklistPage";
import { Button } from "../ui/Button";

/**
 * 체크리스트 생성 모달 컴포넌트
 */
const CreateChecklistModal: FC<{
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: NewChecklistDataType) => void;
  movies: string[];
  locations: { [key: string]: string[] };
}> = ({ isOpen, onClose, onCreate, movies, locations }) => {
  const [selectedMovie, setSelectedMovie] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleSelectMovie = (movie: string) => {
    setSelectedMovie((prev) => (prev === movie ? null : movie));
    setSelectedLocation("");
  };

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
    onCreate({
      movie: selectedMovie,
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
            <p className="mb-2 font-semibold">영화</p>
            <div className="flex flex-wrap gap-2">
              {movies.map((movie) => (
                <button
                  key={movie}
                  onClick={() => handleSelectMovie(movie)}
                  className={`px-4 py-1.5 border rounded-md transition-colors text-sm ${
                    selectedMovie === movie
                      ? "bg-gray-300 text-black border-gray-800"
                      : "bg-white text-gray-700 border-gray-300 hover:border-black"
                  }`}
                >
                  {movie}
                </button>
              ))}
            </div>
          </div>

          {/* 항목 2: 촬영지 선택 (영화 선택 시 표시) */}
          {selectedMovie && (
            <div className="py-6">
              <label
                htmlFor="location-select"
                className="block mb-2 font-semibold"
              >
                촬영지 선택
              </label>
              <select
                id="location-select"
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-800"
              >
                <option value="" disabled>
                  촬영지를 선택하세요
                </option>
                {locations[selectedMovie]?.map((location) => (
                  <option key={location} value={location}>
                    {location}
                  </option>
                ))}
              </select>
            </div>
          )}

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
          <Button variant="outline" onClick={handleCreate}>
            생성하기
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateChecklistModal;
