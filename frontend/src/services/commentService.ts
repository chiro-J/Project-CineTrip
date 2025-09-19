import { api } from "./api";
import type { CommentData, CreateCommentData } from "./api";

export const commentService = {
  async getCommentsByPost(postId: string): Promise<CommentData[]> {
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
};
