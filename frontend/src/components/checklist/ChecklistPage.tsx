//미리보기: https://gemini.google.com/share/50249a0df69d

import {
  checklistService,
  type TravelSchedule,
} from "../../services/checklistService";
import { useAuth } from "../../contexts/AuthContext";
import { bookmarkService } from "../../services/bookmarkService";
import { tmdbService } from "../../services/tmdbService";

/**
 * @file 체크리스트 기능 전체를 담당하는 재사용 가능한 페이지 컴포넌트입니다.
 */
import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import type { FC } from "react";
import type {
  ChecklistItemType,
  ChecklistType,
  NewChecklistDataType,
  ViewState,
} from "../../types/checklist";
import CreateChecklistModal from "./ChecklistModal";
import { Button } from "../ui/Button";

// --- 아이콘 컴포넌트 ---
export const CloseIcon: FC<{ className?: string }> = ({
  className = "w-6 h-6",
}) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-labelledby="closeIconTitle"
  >
    <title id="closeIconTitle">Close Icon</title>
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

const InfoIcon: FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    role="img"
    aria-labelledby="infoIconTitle"
  >
    <title id="infoIconTitle">Info Icon</title>
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="16" x2="12" y2="12"></line>
    <line x1="12" y1="8" x2="12.01" y2="8"></line>
  </svg>
);

// --- UI 서브 컴포넌트 ---

const EmptyState: FC<{
  message: string;
  buttonText: string;
  onButtonClick: () => void;
}> = ({ message, buttonText, onButtonClick }) => {
  return (
    <div className="w-full p-8 mx-auto text-center bg-white border border-gray-200 rounded-lg">
      <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 border-2 border-gray-300 rounded-full">
        <CloseIcon className="w-12 h-12 text-gray-400" />
      </div>
      <div className="flex items-center justify-center gap-2 mb-6 text-gray-600">
        <InfoIcon className="w-5 h-5" />
        <p>{message}</p>
      </div>
      <Button variant="outline" onClick={onButtonClick}>
        {buttonText}
      </Button>
    </div>
  );
};

const ChecklistCard: FC<{ checklist: ChecklistType }> = ({ checklist }) => {
  const [items, setItems] = useState<ChecklistItemType[]>(checklist.items);

  const handleToggleItem = (itemId: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      // 완료 여부별 정렬 (미완료 > 완료)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      return 0;
    });
  }, [items]);

  return (
    <div className="p-4 text-left bg-white border border-gray-200 rounded-lg">
      <h3 className="mb-3 font-bold text-left">
        {checklist.movie_title || `체크리스트 ${checklist.id}`}
      </h3>
      <div className="space-y-3">
        {sortedItems.map((item) => (
          <div key={item.id} className="flex items-start justify-start gap-3">
            <input
              type="checkbox"
              id={`item-${item.id}`}
              checked={item.completed}
              onChange={() => handleToggleItem(item.id)}
              className="w-5 h-5 mt-0.5 text-gray-800 rounded cursor-pointer focus:ring-gray-700"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <label
                  htmlFor={`item-${item.id}`}
                  className={`cursor-pointer text-left font-bold ${
                    item.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-800"
                  }`}
                >
                  {item.title}
                </label>
                <span className="px-2 py-1 text-xs text-gray-500 bg-gray-100 rounded-full">
                  {item.category}
                </span>
              </div>
              <p
                className={`text-sm ${
                  item.completed
                    ? "text-gray-400 line-through"
                    : "text-gray-600"
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ChecklistDisplay: FC<{
  checklists: ChecklistType[];
  onCreateNew: () => void;
  onShowMore: () => void;
  showMoreButton: boolean;
  onCloseMore: () => void;
  showCloseButton: boolean;
}> = ({
  checklists,
  onCreateNew,
  onShowMore,
  showMoreButton,
  onCloseMore,
  showCloseButton,
}) => {
  return (
    <div className="w-full mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">체크리스트</h2>
        <Button variant="outline" onClick={onCreateNew}>
          새로 생성하기
        </Button>
      </div>
      <div className="flex flex-col gap-6">
        {checklists.map((list) => (
          <ChecklistCard key={list.id} checklist={list} />
        ))}
      </div>
      {showMoreButton && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={onShowMore}>
            펼치기
          </Button>
        </div>
      )}
      {showCloseButton && (
        <div className="mt-6 text-center">
          <Button variant="outline" onClick={onCloseMore}>
            접기
          </Button>
        </div>
      )}
    </div>
  );
};

// --- 메인 페이지 컴포넌트 ---

const ChecklistPage: FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<ViewState>("noChecklist");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checklists, setChecklists] = useState<ChecklistType[]>([]);
  const [showAll, setShowAll] = useState(false); // 처음에는 최신 체크리스트만 표시
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bookmarkedMovies, setBookmarkedMovies] = useState<any[]>([]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  // 영화 검색 페이지로 이동
  const handleGoToMovies = () => {
    navigate("/movies");
  };

  // 북마크된 영화와 체크리스트 로드
  useEffect(() => {
    if (user) {
      const loadData = async () => {
        try {
          // 사용자 ID를 문자열로 변환 (admin-001 같은 경우 처리)
          const userId =
            user && typeof user.id === "string"
              ? user.id
              : typeof user.id === "number"
                ? String(user.id)
                : "";

          if (!userId || typeof userId !== "string" || userId.trim() === "") {
            throw new Error("유효하지 않은 사용자 ID입니다.");
          }

          // 북마크된 영화 로드
          const bookmarks = await bookmarkService.getUserBookmarks(userId);

          // 북마크된 영화의 상세 정보 가져오기
          const movieDetails = await Promise.all(
            bookmarks.map(async (bookmark) => {
              try {
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

          // DB에서 체크리스트 로드
          const dbChecklists = await checklistService.getUserChecklists();
          console.log("DB에서 로드된 체크리스트:", dbChecklists);

          if (dbChecklists && dbChecklists.length > 0) {
            // DB 데이터를 프론트엔드 형식으로 변환
            const formattedChecklists = dbChecklists.map(
              (dbChecklist: any) => ({
                id: dbChecklist.id,
                movie_title: dbChecklist.movie_title,
                tmdb_id: dbChecklist.tmdb_id,
                user_id: dbChecklist.user_id,
                travel_schedule: dbChecklist.travel_schedule,
                items: dbChecklist.items || [],
                notes: dbChecklist.notes,
                created_at: dbChecklist.created_at,
                updated_at: dbChecklist.updated_at,
              })
            );

            setChecklists(formattedChecklists);
            setViewState("hasChecklist");
          } else {
            // DB에 체크리스트가 없으면 로컬 스토리지에서 로드
            const savedChecklists = localStorage.getItem("userChecklists");
            const localChecklists = savedChecklists
              ? JSON.parse(savedChecklists)
              : [];
            setChecklists(localChecklists);

            // 상태 설정
            if (movieDetails.filter(Boolean).length === 0) {
              setViewState("noBookmarks");
            } else if (localChecklists.length === 0) {
              setViewState("noChecklist");
            } else {
              setViewState("hasChecklist");
            }
          }
        } catch (error) {
          console.error("데이터 로드 실패:", error);
          setBookmarkedMovies([]);
          setViewState("noBookmarks");
        }
      };

      loadData();
    }
  }, [user]);

  const handleCreateChecklist = async (data: NewChecklistDataType) => {
    setIsLoading(true);
    setError(null);

    try {
      // 북마크된 영화에서 선택된 영화 찾기
      const selectedMovie = bookmarkedMovies?.find(
        (movie) => movie.movieTitle === data.movie
      );

      if (!selectedMovie) {
        throw new Error("선택된 영화를 찾을 수 없습니다.");
      }

      const travelSchedule: TravelSchedule = {
        startDate: data.startDate,
        endDate: data.endDate,
        destinations: [data.location],
      };

      // 체크리스트 생성 API 호출
      const response = await checklistService.generateChecklist(
        selectedMovie.tmdbId,
        travelSchedule,
        selectedMovie.movieTitle
      );

      if (response.success) {
        // 체크리스트 생성 성공 후 DB에서 최신 데이터 다시 로드
        const dbChecklists = await checklistService.getUserChecklists();
        console.log("체크리스트 생성 후 DB에서 로드된 데이터:", dbChecklists);

        if (dbChecklists && dbChecklists.length > 0) {
          // DB 데이터를 프론트엔드 형식으로 변환
          const formattedChecklists = dbChecklists.map((dbChecklist: any) => ({
            id: dbChecklist.id,
            movie_title: dbChecklist.movie_title,
            tmdb_id: dbChecklist.tmdb_id,
            user_id: dbChecklist.user_id,
            travel_schedule: dbChecklist.travel_schedule,
            items: dbChecklist.items || [],
            notes: dbChecklist.notes,
            created_at: dbChecklist.created_at,
            updated_at: dbChecklist.updated_at,
          }));

          setChecklists(formattedChecklists);
          setViewState("hasChecklist");
          setShowAll(true); // 모든 체크리스트 표시
          handleCloseModal();
        } else {
          // DB에서 로드 실패 시 기존 방식으로 처리
          const newChecklist: ChecklistType = {
            id: Date.now(),
            movie_title: selectedMovie.movieTitle,
            tmdb_id: selectedMovie.tmdbId,
            user_id: user?.id || 0,
            travel_schedule: {
              startDate: data.startDate,
              endDate: data.endDate,
              destinations: [data.location],
            },
            items: response.data.map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description,
              category: item.category,
              priority: item.priority,
              completed: false,
              location: item.location,
            })),
            notes: "",
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          };

          const updatedChecklists = [...checklists, newChecklist];
          setChecklists(updatedChecklists);
          // 로컬 스토리지에 저장
          localStorage.setItem(
            "userChecklists",
            JSON.stringify(updatedChecklists)
          );
          setViewState("hasChecklist");
          setShowAll(true); // 모든 체크리스트 표시
          handleCloseModal();
        }
      } else {
        throw new Error(response.message || "체크리스트 생성에 실패했습니다.");
      }
    } catch (err) {
      console.error("체크리스트 생성 오류:", err);
      setError(
        err instanceof Error ? err.message : "체크리스트 생성에 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleCloseAll = () => {
    setShowAll(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="w-full p-8 mx-auto text-center bg-white border border-gray-200 rounded-lg">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 border-2 border-gray-300 rounded-full">
            <div className="w-8 h-8 border-4 border-gray-300 rounded-full border-t-gray-600 animate-spin"></div>
          </div>
          <p className="text-gray-600">체크리스트를 생성하고 있습니다...</p>
          <p className="mt-2 text-sm text-gray-500">잠시만 기다려주세요.</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="w-full p-8 mx-auto text-center bg-white border border-red-200 rounded-lg">
          <div className="flex items-center justify-center w-24 h-24 mx-auto mb-6 border-2 border-red-300 rounded-full">
            <CloseIcon className="w-12 h-12 text-red-400" />
          </div>
          <p className="mb-4 text-red-600">{error}</p>
          <Button variant="outline" onClick={handleOpenModal}>
            다시 시도하기
          </Button>
        </div>
      );
    }

    if (viewState === "hasChecklist" && checklists.length === 0) {
      return (
        <EmptyState
          message="체크리스트가 없습니다."
          buttonText="생성하기"
          onButtonClick={handleOpenModal}
        />
      );
    }

    switch (viewState) {
      case "noBookmarks":
        return (
          <EmptyState
            message="북마크 해 둔 영화가 없습니다."
            buttonText="영화 검색하러 가기"
            onButtonClick={handleGoToMovies}
          />
        );
      case "noChecklist":
        return (
          <EmptyState
            message="체크리스트가 없습니다."
            buttonText="생성하기"
            onButtonClick={handleOpenModal}
          />
        );
      case "hasChecklist":
        const displayedChecklists = showAll ? checklists : checklists.slice(-1);
        const shouldShowMoreButton = !showAll && checklists.length > 1;
        const shouldShowCloseButton = showAll && checklists.length > 1;
        return (
          <ChecklistDisplay
            checklists={displayedChecklists}
            onCreateNew={handleOpenModal}
            onShowMore={handleShowAll}
            showMoreButton={shouldShowMoreButton}
            onCloseMore={handleCloseAll}
            showCloseButton={shouldShowCloseButton}
          />
        );
      default:
        return null;
    }
  };

  return (
    <section className="w-full">
      {/* 임베드 섹션: 높이 고정/배경/패딩 없음 */}
      <main>{renderContent()}</main>
      <CreateChecklistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateChecklist}
      />
    </section>
  );
};

export default ChecklistPage;
