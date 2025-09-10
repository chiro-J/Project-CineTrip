import Card from '../../components/ui/Card';
import { GridLayout } from '../../components/layout/ImageContainer';
import { Button } from '../../components/ui/Button';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

// 테스트를 위한 목업 이미지
const MOCK_GRID_IMAGES1 = Array.from({ length: 5 }, (_, i) => ({
    id: `grid-${i + 1}`,
    src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=Grid+${i + 1}`,
    alt: `Grid Image ${i + 1}`
}));

const MOCK_GRID_IMAGES2 = Array.from({ length: 4 }, (_, i) => ({
    id: `grid-${i + 1}`,
    src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=Grid+${i + 1}`,
    alt: `Grid Image ${i + 1}`,
    likes: Math.floor(Math.random() * 2000) + 100, // 각 이미지에 랜덤 좋아요 수 추가
}));

const MOCK_GRID_IMAGES3 = Array.from({ length: 3 }, (_, i) => ({
    id: `grid-${i + 1}`,
    src: `https://placehold.co/400x400/2B4162/FFFFFF/png?text=Grid+${i + 1}`,
    alt: `Grid Image ${i + 1}`,
    likes: Math.floor(Math.random() * 2000) + 100, // 각 이미지에 랜덤 좋아요 수 추가
}));

// --- 시각적 확인을 위한 임시 플레이스홀더 컴포넌트 ---

// 별점 표시 컴포넌트 플레이스홀더
const StarRating = ({ rating }: { rating: number }) => {
    // 로컬 별점 이미지를 사용한다고 가정합니다.
    // 실제 구현에서는 점수에 따라 동적으로 별 이미지를 렌더링해야 합니다.
    const starImageBaseUrl = './images/'; // 로컬 이미지 경로 (가정)
    return (
        <div className="flex items-center mt-2">
            <div className="inline-flex items-center gap-[2px]">
                {/* 예시: 3.6점을 표현 */}
                <img src={`${starImageBaseUrl}star_full.svg`} alt="Full Star" className="w-6 h-6" />
                <img src={`${starImageBaseUrl}star_full.svg`} alt="Full Star" className="w-6 h-6" />
                <img src={`${starImageBaseUrl}star_full.svg`} alt="Full Star" className="w-6 h-6" />
                <img src={`${starImageBaseUrl}star_half.svg`} alt="Half Star" className="w-6 h-6" />
                <img src={`${starImageBaseUrl}star_empty.svg`} alt="Empty Star" className="w-6 h-6" />
            </div>
            <span className="ml-3 text-xl font-bold text-gray-800">{rating}</span>
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
  return (
    <>
        <div>
            <Header />
        </div>
        <body className='bg-white'>
            <div className="bg-white text-[#111827]" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
            <div className="container px-4 py-12 mx-auto sm:px-6 lg:px-8">
                
                {/* 1. 영화 정보 섹션 */}
                <section className="mb-18">
                    <h2 className="mt-8 mb-12 text-2xl font-bold text-center">영화 정보</h2>
                    <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12">
                        
                        {/* 영화 포스터 (Card 컴포넌트 위치) */}
                        <div className="col-span-1">
                            <Card src="https://placehold.co/400x500/E0E0E0/333333?text=Movie+Poster" alt="영화 포스터"/>
                        </div>

                        {/* 영화 상세 정보 */}
                        <div className="col-span-2 space-y-6">
                            <div className='mb-8'>
                                <h3 className="mb-8 text-3xl font-bold">스파이더맨: 파 프롬 홈</h3>
                                <StarRating rating={3.6} />
                            </div>
                            <div className='mb-8 text-left'>
                                <h4 className="text-lg font-semibold">줄거리</h4>
                                <p className="mt-2 text-sm leading-relaxed text-gray-600">
                                    '엔드게임' 이후 변화된 세상, 스파이더맨 '피터 파커'는 학교 친구들과 유럽 여행을 떠나게 된다. 그런 그의 앞에 '닉 퓨리'가 나타나 도움을 요청하고, 정체불명의 조력자 '미스테리오'까지 합류하게 되면서 전 세계를 위협하는 새로운 빌런 '엘리멘탈 크리쳐스'와 맞서야만 하는 상황에 놓이게 되는데…
                                </p>
                            </div>
                            <div className='text-left'>
                                <h4 className="text-lg font-semibold">개봉일자</h4>
                                <p className="mt-2 text-sm text-gray-600">2019년 7월 2일</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 영화 명장면 촬영지 섹션 */}
                <section className="mb-18">
                    <h2 className="mb-8 text-2xl font-bold text-center">영화 명장면 촬영지</h2>
                    {/* Grid 컴포넌트 위치 (5개 아이템) */}
                    <GridLayout
                        images={MOCK_GRID_IMAGES1}
                        className='grid-cols-5'
                    />
                </section>

                {/* 3. 명장면 인근 추천 장소 섹션 */}
                <section className="mb-18">
                    <div className='grid items-center grid-cols-3 mb-8'>
                        <div />
                        <h2 className="text-2xl font-bold text-center">촬영지 인근 추천 장소</h2>
                        <div className='justify-self-end'>
                            {/* 더보기 버튼 */}
                            <Button variant="outline" onClick={handleClick}>
                                더보기
                            </Button>
                        </div>
                        
                    </div>
                    {/* Grid 컴포넌트 (4개 아이템) */}
                    <GridLayout
                        images={MOCK_GRID_IMAGES2}
                        className='grid-cols-4'
                    />
                </section>

                {/* 4. 유저 사진 섹션 */}
                <section>
                    <div className='grid items-center grid-cols-3 mb-8'>
                        <div />
                        <h2 className="text-2xl font-bold text-center">유저 사진</h2>
                        <div className='justify-self-end'>
                            {/* 더보기 버튼 */}
                            <Button variant="outline" onClick={handleClick}>
                                더보기
                            </Button>
                        </div>
                        
                    </div>
                    {/* Grid 컴포넌트 위치 */}
                    <GridLayout
                        images={MOCK_GRID_IMAGES3}
                        className='grid-cols-3'
                    />
                </section>

            </div>
        </div>
        </body>
        <Footer />
    </>
  );
};

export default MovieDetails;
