import React from 'react';
import Card from '../ui/Card';

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

const GridLayout: React.FC<GridLayoutProps> = ({ images, className = '' }) => {
    return (
    
        <div className={`container mx-auto px-6`}>
            <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 ${className}`}>
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
        </div>
    );
};

type MasonryLayoutProps = {
    images: ImageItem[];
    className?: string;
};

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ images, className = '' }) => {
    return (
        <div className={`columns-2 sm:columns-3 md:columns-4 gap-4 ${className}`}>
            {images.map((image) => (
                <div key={image.id} className="mb-4 break-inside-avoid">
                    {/* fit prop을 명시하지 않으면 ImageContainer의 기본값인 'contain'이 적용됩니다. */}
                    <Card
                        src={image.src}
                        alt={image.alt}
                        likes={image.likes}
                    />
                </div>
            ))}
        </div>
    );
};


export { GridLayout, MasonryLayout };

