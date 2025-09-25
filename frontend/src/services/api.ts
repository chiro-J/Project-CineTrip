import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
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

export default api;