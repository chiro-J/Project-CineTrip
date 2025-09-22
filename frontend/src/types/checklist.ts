/**
 * @typedef {object} ChecklistItemType
 * @property {number} id - 체크리스트 아이템의 고유 ID
 * @property {string} title - 체크리스트 아이템의 제목
 * @property {string} description - 체크리스트 아이템의 상세 설명
 * @property {string} category - 카테고리
 * @property {boolean} completed - 완료 여부
 */
export type ChecklistItemType = {
  id: string;
  title: string;
  description: string;
  category: string;
  priority?: 'high' | 'medium' | 'low';
  completed: boolean;
  location?: {
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
};
/**
 * @typedef {object} ChecklistType
 * @property {number} id - 체크리스트의 고유 ID
 * @property {string} title - 체크리스트의 제목
 * @property {ChecklistItemType[]} items - 체크리스트에 포함된 아이템 목록
 */
export type ChecklistType = {
  id: number;
  movie_title?: string;
  tmdb_id: number;
  user_id: number;
  travel_schedule: {
    startDate: string;
    endDate: string;
    destinations: string[];
  };
  items: ChecklistItemType[];
  notes?: string;
  created_at: string;
  updated_at: string;
};

/**
 * @typedef {object} NewChecklistDataType
 * @description 모달에서 새 체크리스트를 생성할 때 사용되는 데이터 구조
 * @property {string} movie - 선택된 영화 이름
 * @property {string} location - 선택된 촬영지
 * @property {string} startDate - 여행 시작일
 * @property {string} endDate - 여행 종료일
 */
export type NewChecklistDataType = {
  movie: string;
  location: string;
  startDate: string;
  endDate: string;
};

/**
 * @typedef {'noBookmarks' | 'noChecklist' | 'hasChecklist'} ViewState
 * @description 메인 페이지의 다양한 UI 상태
 */
export type ViewState = "noBookmarks" | "noChecklist" | "hasChecklist";
