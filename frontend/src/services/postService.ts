import { api, PostData, CreatePostData, UpdatePostData } from './api';

export const postService = {
  async getPosts(userId?: string): Promise<PostData[]> {
    const params = userId ? { userId } : {};
    const response = await api.get('/posts', { params });
    return response.data;
  },

  async getPost(id: string, userId?: string): Promise<PostData> {
    const params = userId ? { userId } : {};
    const response = await api.get(`/posts/${id}`, { params });
    return response.data;
  },

  async getPostsByAuthor(authorId: string, userId?: string): Promise<PostData[]> {
    const params = userId ? { userId } : {};
    const response = await api.get(`/posts/user/${authorId}`, { params });
    return response.data;
  },

  async createPost(postData: CreatePostData): Promise<PostData> {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  async updatePost(id: string, postData: UpdatePostData): Promise<PostData> {
    const response = await api.patch(`/posts/${id}`, postData);
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  async toggleLike(postId: string): Promise<{ isLiked: boolean; likesCount: number }> {
    const response = await api.post(`/likes/${postId}/toggle`);
    return response.data;
  },

  async getLikeStatus(postId: string): Promise<{ isLiked: boolean }> {
    const response = await api.get(`/likes/${postId}/status`);
    return response.data;
  },

  async getLikesCount(postId: string): Promise<{ likesCount: number }> {
    const response = await api.get(`/likes/${postId}/count`);
    return response.data;
  },
};