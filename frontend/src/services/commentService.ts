import { api, CommentData, CreateCommentData } from './api';

export const commentService = {
  async getCommentsByPost(postId: string): Promise<CommentData[]> {
    const response = await api.get(`/comments/posts/${postId}`);
    return response.data;
  },

  async getComment(id: string): Promise<CommentData> {
    const response = await api.get(`/comments/${id}`);
    return response.data;
  },

  async createComment(postId: string, commentData: CreateCommentData): Promise<CommentData> {
    const response = await api.post(`/comments/posts/${postId}`, commentData);
    return response.data;
  },

  async deleteComment(id: string): Promise<void> {
    await api.delete(`/comments/${id}`);
  },
};