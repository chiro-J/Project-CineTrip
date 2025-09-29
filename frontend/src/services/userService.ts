import { api } from './api';

export interface UserSearchResult {
  id: number;
  uuid: string;
  username: string;
  email: string;
  profile_image_url?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

export const userService = {
  // 사용자 검색
  searchUsers: async (query: string): Promise<UserSearchResult[]> => {
    try {
      const response = await api.get(`/user?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Failed to search users:', error);
      throw error;
    }
  },

  // 모든 사용자 조회 (검색어 없을 때)
  getAllUsers: async (): Promise<UserSearchResult[]> => {
    try {
      const response = await api.get('/user');
      return response.data;
    } catch (error) {
      console.error('Failed to get all users:', error);
      throw error;
    }
  },

  // 특정 사용자 조회
  getUserById: async (userId: string): Promise<UserSearchResult> => {
    try {
      const response = await api.get(`/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Failed to get user:', error);
      throw error;
    }
  },

  // 팔로우 관련
  toggleFollow: async (userId: string): Promise<{ isFollowing: boolean; followersCount: number }> => {
    try {
      const response = await api.post(`/user/${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Failed to toggle follow:', error);
      throw error;
    }
  },

  getFollowStatus: async (userId: string): Promise<{ isFollowing: boolean }> => {
    try {
      const response = await api.get(`/user/${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Failed to get follow status:', error);
      throw error;
    }
  },

  getFollowers: async (userId: string): Promise<UserSearchResult[]> => {
    try {
      const response = await api.get(`/user/${userId}/followers`);
      return response.data;
    } catch (error) {
      console.error('Failed to get followers:', error);
      throw error;
    }
  },

  getFollowing: async (userId: string): Promise<UserSearchResult[]> => {
    try {
      const response = await api.get(`/user/${userId}/following`);
      return response.data;
    } catch (error) {
      console.error('Failed to get following:', error);
      throw error;
    }
  },

  getFollowersCount: async (userId: string): Promise<{ followersCount: number }> => {
    try {
      const response = await api.get(`/user/${userId}/followers/count`);
      return response.data;
    } catch (error) {
      console.error('Failed to get followers count:', error);
      throw error;
    }
  },

  getFollowingCount: async (userId: string): Promise<{ followingCount: number }> => {
    try {
      const response = await api.get(`/user/${userId}/following/count`);
      return response.data;
    } catch (error) {
      console.error('Failed to get following count:', error);
      throw error;
    }
  }
};
