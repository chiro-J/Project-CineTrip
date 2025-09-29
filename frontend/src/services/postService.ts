import { api } from "./api";
import type { PostData, CreatePostData, UpdatePostData } from "./api";

export const postService = {
  async getPosts(userId?: string): Promise<PostData[]> {
    const params = userId ? { userId } : {};
    const response = await api.get("/posts", { params });
    return response.data;
  },

  async getPost(id: string, userId?: string): Promise<PostData> {
    const params = userId ? { userId } : {};
    const response = await api.get(`/posts/${id}`, { params });
    return response.data;
  },

  // 작성자별 게시물 조회 (백엔드에 구현되지 않음 - 임시 제거)
  // async getPostsByAuthor(
  //   authorId: string,
  //   userId?: string
  // ): Promise<PostData[]> {
  //   const params = userId ? { userId } : {};
  //   const response = await api.get(`/posts/user/${authorId}`, { params });
  //   return response.data;
  // },

  async createPost(postData: CreatePostData): Promise<PostData> {
    const response = await api.post("/posts", postData);
    return response.data;
  },

  async updatePost(id: string, postData: UpdatePostData): Promise<PostData> {
    const response = await api.patch(`/posts/${id}`, postData);
    return response.data;
  },

  async deletePost(id: string): Promise<void> {
    await api.delete(`/posts/${id}`);
  },

  async toggleLike(
    postId: string
  ): Promise<{ isLiked: boolean; likesCount: number; likeId?: number }> {
    const response = await api.post(`/posts/${postId}/likes/toggle`);
    return response.data;
  },

  async removeLike(
    postId: string,
    likeId: string
  ): Promise<void> {
    await api.delete(`/posts/${postId}/likes/${likeId}`);
  },
};
