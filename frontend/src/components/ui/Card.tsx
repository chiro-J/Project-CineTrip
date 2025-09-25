import React from "react";

type CardProps = {
  src?: string;
  alt?: string;
  className?: string;
  children?: React.ReactNode;
  fit?: "cover" | "contain"; // 'cover'는 그리드용, 'contain'은 Masonry용
  likes?: number; // '좋아요' 수를 받기 위한 prop 추가
  // 영화 촬영지 방문 진행도 관련 props
  isBookmarked?: boolean; // 북마크 여부
  visitedLocations?: number; // 방문한 촬영지 개수
  totalLocations?: number; // 전체 촬영지 개수 (기본값: 5)
  isCompleted?: boolean; // 모든 촬영지 방문 완료 여부
};

const Card: React.FC<CardProps> = ({
  src,
  alt = "image",
  className = "",
  children,
  fit = "contain", // Masonry를 위한 기본값 설정
  likes, // props에서 likes 값 받기
  isBookmarked = false,
  visitedLocations = 0,
  totalLocations = 5,
  isCompleted = false,
}) => {
  const cardBaseClasses =
    "bg-base-200 rounded-lg overflow-hidden relative group cursor-pointer transition-transform duration-300 ease-in-out hover:scale-105";
  const placeholderClasses = "aspect-square flex items-center justify-center";

  // fit prop에 따라 이미지 스타일을 동적으로 결정
  const imageClasses =
    fit === "cover"
      ? "w-full h-full object-cover" // GridLayout용: 컨테이너를 꽉 채움 object-cover 대신 object-fill 사용시 실제 이미지와 그리드 이미지 사이즈가 맞지 않아도 원본 비율을 무시하고 채움
      : "w-full h-auto block"; // MasonryLayout용: 이미지 비율 유지

  return (
    <div
      className={`${cardBaseClasses} ${!src ? placeholderClasses : ""} ${className}`}
    >
      {src ? (
        <>
          <img
            src={src}
            alt={alt}
            className={`${imageClasses} ${isBookmarked && !isCompleted ? "opacity-60" : ""}`}
          />

          {/* 북마크된 영화의 촬영지 방문 진행도 오버레이 */}
          {isBookmarked && (
            <div className="absolute inset-0 flex items-center justify-center">
              {isCompleted ? (
                /* 완료된 경우 COMPLETED 스탬프 이미지 표시 */
                <div className="relative">
                  <img
                    src="/completed-fix.png"
                    alt="COMPLETED"
                    className="object-contain w-40 h-40 transform opacity-90 rotate-12"
                  />
                </div>
              ) : visitedLocations > 0 ? (
                /* 일부 방문한 경우 진행도 표시 */
                <div className="px-3 py-1 text-lg font-bold text-white bg-black bg-opacity-75 rounded-full">
                  {visitedLocations}/{totalLocations}
                </div>
              ) : null}
            </div>
          )}
        </>
      ) : (
        <span className="text-sm text-opacity-50 text-base-content">Photo</span>
      )}

      {/* 'likes' prop이 존재할 경우에만 '좋아요' UI를 렌더링합니다. */}
      {likes !== undefined && (
        <div className="absolute flex items-center px-2 py-1 space-x-1 text-xs font-semibold text-white transition-opacity duration-300 bg-black bg-opacity-50 rounded-full opacity-0 top-2 right-2 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="1"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
          <span>{likes.toLocaleString()}</span>
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
