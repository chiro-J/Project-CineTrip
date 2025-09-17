import { api } from './api';

export interface UserData {
  id: string;
  username: string;
  email: string;
  profileImageUrl?: string;
  bio?: string;
  followersCount: number;
  followingCount: number;
  createdAt: string;
  updatedAt: string;
}

export const followService = {
  async toggleFollow(userId: string): Promise<{ isFollowing: boolean; followersCount: number }> {
    const response = await api.post(`/follow/${userId}/toggle`);
    return response.data;
  },

  async getFollowStatus(userId: string): Promise<{ isFollowing: boolean }> {
    const response = await api.get(`/follow/${userId}/status`);
    return response.data;
  },

  async getFollowers(userId: string): Promise<UserData[]> {
    const response = await api.get(`/follow/${userId}/followers`);
    return response.data;
  },

  async getFollowing(userId: string): Promise<UserData[]> {
    const response = await api.get(`/follow/${userId}/following`);
    return response.data;
  },

  async getFollowersCount(userId: string): Promise<{ followersCount: number }> {
    const response = await api.get(`/follow/${userId}/followers/count`);
    return response.data;
  },

  async getFollowingCount(userId: string): Promise<{ followingCount: number }> {
    const response = await api.get(`/follow/${userId}/following/count`);
    return response.data;
  },
};