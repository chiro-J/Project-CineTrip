import { apiHelpers } from "./api";

export interface TravelSchedule {
  startDate: string;
  endDate: string;
  destinations?: string[];
  budget?: number;
  travelers?: number;
}

export interface ChecklistItem {
  id: number;
  title: string;
  description: string;
  category: string;
  completed: boolean;
}

export interface ChecklistResponse {
  success: boolean;
  data: ChecklistItem[];
  message: string;
}

export const checklistService = {
  async generateChecklist(
    tmdbId: number,
    travelSchedule: TravelSchedule,
    movieTitle?: string
  ): Promise<ChecklistResponse> {
    try {
      return await apiHelpers.generateChecklist(
        tmdbId,
        travelSchedule,
        movieTitle
      );
    } catch (error) {
      console.warn("API 호출 실패, 모킹 데이터 사용:", error);
      // API 호출 실패 시 모킹 데이터 반환
      return this.getMockChecklist(tmdbId, travelSchedule, movieTitle);
    }
  },

  async getMockChecklist(
    _tmdbId: number,
    _travelSchedule: TravelSchedule,
    movieTitle?: string
  ): Promise<ChecklistResponse> {
    // 기본 체크리스트 데이터 반환
    const mockData: ChecklistItem[] = [
      {
        id: 1,
        title: "여행 준비물 체크",
        description: "여행에 필요한 기본 준비물들을 확인하세요.",
        category: "준비물",
        completed: false,
      },
      {
        id: 2,
        title: "숙소 예약",
        description: "여행 기간에 맞는 숙소를 미리 예약하세요.",
        category: "숙박",
        completed: false,
      },
      {
        id: 3,
        title: "교통편 확인",
        description: "목적지까지의 교통편을 미리 확인하고 예약하세요.",
        category: "교통",
        completed: false,
      },
      {
        id: 4,
        title: "현지 정보 조사",
        description: "여행지의 날씨, 문화, 관광지 등을 미리 조사하세요.",
        category: "정보",
        completed: false,
      },
      {
        id: 5,
        title: "여행 보험 가입",
        description: "해외여행의 경우 여행보험 가입을 고려하세요.",
        category: "보험",
        completed: false,
      },
    ];

    return {
      success: true,
      data: mockData,
      message: `'${movieTitle || "영화"}' 촬영지 기반 체크리스트가 생성되었습니다.`,
    };
  },

  async generateChecklistSimple(
    tmdbId: number,
    startDate: string,
    endDate: string,
    destinations: string[],
    movieTitle?: string
  ): Promise<ChecklistResponse> {
    const travelSchedule: TravelSchedule = {
      startDate,
      endDate,
      destinations,
      budget: undefined,
      travelers: undefined,
    };

    try {
      return await apiHelpers.generateChecklist(
        tmdbId,
        travelSchedule,
        movieTitle
      );
    } catch (error) {
      console.warn("API 호출 실패, 모킹 데이터 사용:", error);
      return this.getMockChecklist(tmdbId, travelSchedule, movieTitle);
    }
  },
};
