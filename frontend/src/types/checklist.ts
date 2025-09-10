/**
 * @typedef {object} ChecklistItemType
 * @property {number} id - 체크리스트 아이템의 고유 ID
 * @property {string} content - 체크리스트 아이템의 내용
 * @property {boolean} isCompleted - 완료 여부
 */
export type ChecklistItemType = {
  id: number;
  content: string;
  isCompleted: boolean;
};

/**
 * @typedef {object} ChecklistType
 * @property {number} id - 체크리스트의 고유 ID
 * @property {string} title - 체크리스트의 제목
 * @property {ChecklistItemType[]} items - 체크리스트에 포함된 아이템 목록
 */
export type ChecklistType = {
  id: number;
  title: string;
  items: ChecklistItemType[];
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
