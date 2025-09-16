// 미리보기 https://claude.ai/public/artifacts/416895e6-a811-4e8c-afdf-1bdd479ad77f
import React from "react";

// Avatar 컴포넌트의 Props 타입 정의
interface AvatarProps {
  src?: string;
  alt?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  shape?: "circle" | "square";
  fallback?: string; // 이미지가 없을 때 보여줄 텍스트 (이니셜 등)
  status?: "online" | "offline" | "busy" | "away";
  className?: string;
  onClick?: () => void;
  isEditable?: boolean;
  onEdit?: () => void;
  onRemove?: () => void;
}

// 사이즈별 클래스 매핑
const sizeClasses = {
  xs: "w-8 h-8 text-xs",
  sm: "w-10 h-10 text-sm",
  md: "w-12 h-12 text-base",
  lg: "w-16 h-16 text-lg",
  xl: "w-24 h-24 text-xl",
};

// 상태별 클래스 매핑
const statusClasses = {
  online: "bg-green-500",
  offline: "bg-gray-500",
  busy: "bg-red-500",
  away: "bg-yellow-500",
};

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "Avatar",
  size = "md",
  shape = "circle",
  fallback,
  status,
  className = "",
  onClick,
  isEditable = false,
  onEdit,
  onRemove,
}) => {
  const [imageError, setImageError] = React.useState(false);

  const handleImageError = () => {
    setImageError(true);
  };

  // 랜덤 색상 생성 함수 (fallback prop을 기반으로 일관된 색상 생성)
  const generateColorFromText = (text: string): string => {
    if (!text) return "bg-gray-300";

    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-pink-500",
      "bg-indigo-500", "bg-red-500", "bg-yellow-500", "bg-orange-500",
      "bg-teal-500", "bg-cyan-500", "bg-violet-500", "bg-rose-500"
    ];

    // 텍스트의 첫 글자로 색상 인덱스 생성 (일관성을 위해)
    const charCode = text.charCodeAt(0);
    const colorIndex = charCode % colors.length;
    return colors[colorIndex];
  };

  const shapeClass = shape === "circle" ? "rounded-full" : "rounded-lg";
  const cursorClass = onClick ? "cursor-pointer hover:opacity-80" : "";

  // Fallback 컴포넌트 (이미지가 없거나 로드 실패 시)
  const FallbackAvatar = () => {
    const bgColor = fallback ? generateColorFromText(fallback) : "bg-gray-300";

    return (
      <div
        className={`${sizeClasses[size]} ${shapeClass} ${bgColor} ${cursorClass} ${className} flex items-center justify-center text-white font-semibold`}
        onClick={onClick}
      >
        {fallback ? (
          <span className="uppercase">{fallback}</span>
        ) : (
          <svg
            className="w-1/2 h-1/2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </div>
    );
  };

  return (
    <div className="relative inline-block">
      {/* Avatar 이미지 또는 Fallback */}
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          className={`${sizeClasses[size]} ${shapeClass} ${cursorClass} ${className} object-cover`}
          onClick={onClick}
          onError={handleImageError}
        />
      ) : (
        <FallbackAvatar />
      )}

      {/* 상태 표시기 */}
      {status && (
        <span
          className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${statusClasses[status]}`}
        />
      )}

      {/* 편집 가능한 경우 버튼들 표시 */}
      {isEditable && (
        <div
          className={`absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity bg-black bg-opacity-50 ${shapeClass}`}
        >
          <div className="flex gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-2 py-1 text-xs text-black bg-white rounded hover:bg-gray-100"
                type="button"
              >
                변경
              </button>
            )}
            {onRemove && (
              <button
                onClick={onRemove}
                className="px-2 py-1 text-xs text-white bg-red-500 rounded hover:bg-red-600"
                type="button"
              >
                제거
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// AvatarGroup 컴포넌트 - 여러 Avatar를 그룹으로 표시
interface AvatarGroupProps {
  children: React.ReactNode;
  max?: number;
  spacing?: "tight" | "normal" | "loose";
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 3,
  spacing = "normal",
}) => {
  const spacingClasses = {
    tight: "-space-x-3",
    normal: "-space-x-2",
    loose: "-space-x-1",
  };

  const childrenArray = React.Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={`flex ${spacingClasses[spacing]}`}>
      {visibleChildren.map((child, index) => (
        <div key={index} className="relative" style={{ zIndex: max - index }}>
          {child}
        </div>
      ))}
      {remainingCount > 0 && (
        <div
          className="relative flex items-center justify-center w-10 h-10 text-sm font-medium text-gray-700 bg-gray-300 rounded-full"
          style={{ zIndex: 0 }}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};

// 타입 export
export type { AvatarProps, AvatarGroupProps };
