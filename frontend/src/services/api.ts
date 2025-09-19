import axios from "axios";
import {
  sceneLocationsByTmdbResponseSchema,
  type SceneLocationsByTmdbResponse,
} from "../types/scene";
import type { BookmarkResponse, Bookmark } from "../services/bookmarkService";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface PostData {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  authorId: string;
  author: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
  isLiked?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CommentData {
  id: string;
  text: string;
  userId: string;
  postId: string;
  user: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  title: string;
  description?: string;
  imageUrl: string;
  location?: string;
}

export interface UpdatePostData {
  title?: string;
  description?: string;
  location?: string;
}

export interface CreateCommentData {
  text: string;
}

export interface TravelSchedule {
  startDate: string;
  endDate: string;
  destinations?: string[];
  budget?: number;
  travelers?: number;
}

// API 헬퍼 함수들
export const apiHelpers = {
  // 북마크 관련
  async toggleBookmark(tmdbId: number): Promise<BookmarkResponse> {
    const response = await api.post("/bookmarks/me/toggle", { tmdbId });
    return response.data;
  },

  async isBookmarked(tmdbId: number): Promise<boolean> {
    const response = await api.get(`/bookmarks/me/check?tmdbId=${tmdbId}`);
    return response.data.isBookmarked;
  },

  async getUserBookmarks(userId: number): Promise<Bookmark[]> {
    const response = await api.get(`/bookmarks/user/${userId}`);
    return response.data;
  },

  // 체크리스트 관련
  async generateChecklist(
    tmdbId: number,
    travelSchedule: TravelSchedule,
    movieTitle?: string
  ): Promise<any> {
    const response = await api.post("/llm/prompt/checklist", {
      tmdbId,
      travelSchedule,
      movieTitle,
    });
    return response.data;
  },

  // 유저 관련 (백엔드에 구현되지 않음 - 임시 제거)
  // async getUserById(id: number): Promise<any> {
  //   const response = await api.get(`/users/${id}`);
  //   return response.data;
  // },

  // async getUserByUuid(uuid: string): Promise<any> {
  //   const response = await api.get(`/users/uuid/${uuid}`);
  //   return response.data;
  // },

  // 게시물 관련
  async getPosts(page = 1, limit = 10): Promise<PostData[]> {
    const response = await api.get(`/posts?page=${page}&limit=${limit}`);
    return response.data;
  },

  async createPost(postData: CreatePostData): Promise<PostData> {
    const response = await api.post("/posts", postData);
    return response.data;
  },

  async updatePost(
    postId: string,
    postData: UpdatePostData
  ): Promise<PostData> {
    const response = await api.patch(`/posts/${postId}`, postData);
    return response.data;
  },

  async deletePost(postId: string): Promise<void> {
    await api.delete(`/posts/${postId}`);
  },

  // 댓글 관련
  async getComments(postId: string): Promise<CommentData[]> {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  async createComment(
    postId: string,
    commentData: CreateCommentData
  ): Promise<CommentData> {
    const response = await api.post(`/posts/${postId}/comments`, commentData);
    return response.data;
  },

  async deleteComment(postId: string, commentId: string): Promise<void> {
    await api.delete(`/posts/${postId}/comments/${commentId}`);
  },

  // 좋아요 관련
  async toggleLike(
    postId: string
  ): Promise<{ likeId: number; likesCount: number }> {
    const response = await api.post(`/posts/${postId}/likes`);
    return response.data;
  },

  // 촬영지 관련
  async fetchSceneLocationsByTmdb(
    tmdbId: number,
    opts?: {
      regen?: boolean;
      movieInfo?: {
        title?: string;
        originalTitle?: string;
        country?: string;
        language?: string;
      };
    }
  ): Promise<SceneLocationsByTmdbResponse> {
    console.log("API 호출: POST /llm/scenes", { tmdbId, opts });

    try {
      const response = await api.post("/llm/scenes", { tmdbId });
      console.log("API 응답 데이터:", response.data);

      // 백엔드 응답 형식에 맞게 래핑
      const responseData = {
        tmdbId: tmdbId,
        items: response.data.items || [],
      };

      return sceneLocationsByTmdbResponseSchema.parse(responseData);
    } catch (error: any) {
      console.error("API 에러:", error);
      throw new Error(error.response?.data?.message ?? "API Error");
    }
  },
};

export default api;
