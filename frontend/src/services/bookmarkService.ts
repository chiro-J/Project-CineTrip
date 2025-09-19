import { apiHelpers } from "./api";

export interface Bookmark {
  id: number;
  userId: string;
  tmdbId: number;
}

export interface BookmarkResponse {
  isBookmarked: boolean;
  bookmark?: Bookmark;
}

export interface BookmarkCheckResponse {
  isBookmarked: boolean;
}

class BookmarkService {
  // 인증 필요: 본인의 북마크 관리
  async toggleBookmark(
    _userId: string,
    tmdbId: number
  ): Promise<BookmarkResponse> {
    try {
      return await apiHelpers.toggleBookmark(tmdbId);
    } catch (error) {
      console.error("북마크 토글 실패:", error);
      throw error;
    }
  }

  async addBookmark(_userId: string, tmdbId: number): Promise<Bookmark> {
    try {
      const response = await apiHelpers.toggleBookmark(tmdbId);
      return response.bookmark!;
    } catch (error) {
      console.error("북마크 추가 실패:", error);
      throw error;
    }
  }

  async removeBookmark(_userId: string, tmdbId: number): Promise<void> {
    try {
      await apiHelpers.toggleBookmark(tmdbId);
    } catch (error) {
      console.error("북마크 제거 실패:", error);
      throw error;
    }
  }

  // 인증 불필요: 다른 사용자의 북마크 조회 (갤러리용)
  async getUserBookmarks(userId: string): Promise<Bookmark[]> {
    try {
      console.log("북마크 서비스: API 호출 시작, userId:", userId);
      // userId가 숫자 문자열인지 확인
      const numericUserId = parseInt(userId);
      if (isNaN(numericUserId)) {
        throw new Error("Invalid userId: must be a number");
      }
      const data = await apiHelpers.getUserBookmarks(numericUserId);
      console.log("북마크 서비스: 응답 데이터:", data);
      return data;
    } catch (error) {
      console.error("사용자 북마크 조회 실패:", error);
      throw error;
    }
  }

  // 인증 필요: 본인의 북마크 상태 확인
  async isBookmarked(_userId: string, tmdbId: number): Promise<boolean> {
    try {
      return await apiHelpers.isBookmarked(tmdbId);
    } catch (error) {
      console.error("북마크 상태 확인 실패:", error);
      return false; // 에러 시 기본값으로 false 반환
    }
  }
}

export const bookmarkService = new BookmarkService();
