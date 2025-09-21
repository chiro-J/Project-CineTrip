export type Item = {
  id: string | number;
  src: string;
  alt?: string;
  likes?: number;
  // 갤러리 페이지에서 사용하는 추가 필드들
  title?: string;
  location?: string;
  description?: string;
  authorId?: string | number;
  authorName?: string;
  author_id?: number;
  author?: {
    id: number;
    username: string;
    profile_image_url?: string;
  };
  image_url?: string;
  createdAt?: string;
  updatedAt?: string;
};
