import React from "react";
import { useState, useEffect, useMemo } from "react";
import Card from "../ui/Card";

// Card가 사용할 이미지 아이템의 타입을 정의

type ImageItem = {
  id: string | number;
  src: string;
  alt?: string;
  likes?: number;
};

type GridLayoutProps = {
  images: ImageItem[];
  className?: string;
};

// 중앙 정렬 없는 기존 그리드 임시로 주석 처리 추후 수정 혹은 삭제

// const GridLayout: React.FC<GridLayoutProps> = ({ images, className = '' }) => {
//   return (

//     <div
//       className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 ${className}`}
//     >
//       {images.map((image) => (
//         <Card
//           key={image.id}
//           src={image.src}
//           alt={image.alt}
//           fit="cover" // 이미지가 컨테이너를 꽉 채우도록 'cover' fit 사용
//           className="aspect-square" //aspect-square 대신 h-64나 h-96 같은 고정 높이 클래스를 전달하면 사이즈 조정 가능
//           likes={image.likes}
//         >
//         </Card>
//       ))}
//     </div>
//   );
// };

//새로 테스트 중인 그리드

const GridLayout: React.FC<GridLayoutProps> = ({ images, className = "" }) => {
  return (
      <div className={`grid gap-8 ${className}`}> {/* 컴포넌트 사용시 className에 grid-cols- 선언하기 */}
        {images.map((image) => (
          <div key={image.id} className="text-center">
            <Card
              src={image.src}
              alt={image.alt}
              likes={image.likes}
              className="aspect-square" // 4:5 비율로 설정
            />
            <p className="mt-2 text-sm font-semibold">{image.alt}</p>
          </div>
        ))}
      </div>
  );
};

type MasonryLayoutProps = {
  images: ImageItem[];
  className?: string;
};

const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  images,
  className = "",
}) => {
  return (
    <div className={`columns-2 sm:columns-3 md:columns-4 gap-4 ${className}`}>
      {images.map((image) => (
        <div key={image.id} className="mb-4 break-inside-avoid">
          {/* fit prop을 명시하지 않으면 ImageContainer의 기본값인 'contain'이 적용됩니다. */}
          <Card src={image.src} alt={image.alt} likes={image.likes} />
        </div>
      ))}
    </div>
  );
};

/**
 * 화면 너비에 따라 반응형으로 열(column) 개수를 반환하는 커스텀 훅
 */
const useResponsiveColumns = () => {
  const getColumns = () => {
    if (typeof window === "undefined") return 4; // SSR 환경 기본값
    if (window.innerWidth >= 1024) return 4;
    if (window.innerWidth >= 768) return 3;
    return 2;
  };

  const [numColumns, setNumColumns] = useState(getColumns());

  useEffect(() => {
    const handleResize = () => {
      setNumColumns(getColumns());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return numColumns;
};

const InfiniteMasonryLayout = ({ images }: { images: ImageItem[] }) => {
  const numColumns = useResponsiveColumns();

  // 이미지들을 각 열에 분배합니다.
  const columns = useMemo(() => {
    const newColumns: ImageItem[][] = Array.from(
      { length: numColumns },
      () => []
    );
    images.forEach((image, index) => {
      newColumns[index % numColumns].push(image);
    });
    return newColumns;
  }, [images, numColumns]);

  return (
    <div className="flex gap-4">
      {columns.map((columnImages, colIndex) => (
        <div key={colIndex} className="flex flex-col w-full gap-4">
          {columnImages.map((image) => (
            <Card
              key={image.id}
              src={image.src}
              alt={image.alt}
              likes={image.likes}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export { GridLayout, MasonryLayout, InfiniteMasonryLayout };
