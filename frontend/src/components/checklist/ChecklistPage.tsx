//미리보기: https://gemini.google.com/share/50249a0df69d

//테스트를 위한 더미데이터
export const MOCK_MOVIES: string[] = ["영화 A", "영화 B", "영화 C"];

export const MOCK_FILMING_LOCATIONS: { [key: string]: string[] } = {
  "영화 A": ["촬영지1", "촬영지2", "촬영지3", "촬영지4", "촬영지5"],
  "영화 B": ["촬영지6", "촬영지8", "촬영지9", "촬영지10", "촬영지11"],
  "영화 C": ["촬영지12", "촬영지13", "촬영지14", "촬영지15", "촬영지16"],
};

export const INITIAL_CHECKLISTS: ChecklistType[] = [
  {
    id: 1,
    title: "Check List 1",
    items: [
      { id: 101, content: "content1", isCompleted: false },
      { id: 102, content: "content2", isCompleted: true },
    ],
  },
  {
    id: 2,
    title: "Check List 2",
    items: [
      { id: 201, content: "content1", isCompleted: false },
      { id: 202, content: "content2", isCompleted: false },
    ],
  },
];

/**
 * @file 체크리스트 기능 전체를 담당하는 재사용 가능한 페이지 컴포넌트입니다.
 */
import { useState, useMemo } from "react";
import type { FC } from "react";
import type {
  ChecklistItemType,
  ChecklistType,
  NewChecklistDataType,
  ViewState,
  ChecklistPageProps,
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

  const handleToggleItem = (itemId: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
      )
    );
  };

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      if (a.isCompleted === b.isCompleted) return 0;
      return a.isCompleted ? 1 : -1;
    });
  }, [items]);

  return (
    <div className="p-4 text-left bg-white border border-gray-200 rounded-lg">
      <h3 className="mb-3 font-bold text-left">{checklist.title}</h3>
      <div className="space-y-2">
        {sortedItems.map((item) => (
          <div key={item.id} className="flex items-center justify-start gap-2">
            <input
              type="checkbox"
              id={`item-${item.id}`}
              checked={item.isCompleted}
              onChange={() => handleToggleItem(item.id)}
              className="w-5 h-5 text-gray-800 rounded cursor-pointer focus:ring-gray-700"
            />
            <label
              htmlFor={`item-${item.id}`}
              className={`flex-1 cursor-pointer text-left ${
                item.isCompleted
                  ? "text-gray-400 line-through"
                  : "text-gray-800"
              }`}
            >
              {item.content}
            </label>
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

const ChecklistPage: FC<ChecklistPageProps> = ({
  movies = MOCK_MOVIES,
  locations = MOCK_FILMING_LOCATIONS,
}) => {
  const [viewState, setViewState] = useState<ViewState>("hasChecklist");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [checklists, setChecklists] =
    useState<ChecklistType[]>(INITIAL_CHECKLISTS);
  const [showAll, setShowAll] = useState(true); // 처음에는 모든 체크리스트를 보여줍니다.

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleCreateChecklist = (data: NewChecklistDataType) => {
    const newChecklist: ChecklistType = {
      id: Date.now(),
      title: `${data.movie} - ${data.location} (${data.startDate} ~ ${data.endDate})`,
      items: [
        {
          id: Date.now() + 1,
          content: `${data.location} 방문하기`,
          isCompleted: false,
        },
        {
          id: Date.now() + 2,
          content: "여행 준비물 챙기기",
          isCompleted: false,
        },
      ],
    };

    setChecklists((prevChecklists) => [...prevChecklists, newChecklist]);
    setViewState("hasChecklist");
    handleCloseModal();
    setShowAll(false); // 새로 생성 후에는 최신 것만 보여주도록 상태 변경
  };

  const handleShowAll = () => {
    setShowAll(true);
  };

  const handleCloseAll = () => {
    setShowAll(false);
  };

  const renderContent = () => {
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
            buttonText="이동하기"
            onButtonClick={() => {}}
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
      {" "}
      {/* 임베드 섹션: 높이 고정/배경/패딩 없음 */}
      <main>{renderContent()}</main>
      <CreateChecklistModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onCreate={handleCreateChecklist}
        movies={movies}
        locations={locations}
      />
    </section>
  );
};

export default ChecklistPage;
