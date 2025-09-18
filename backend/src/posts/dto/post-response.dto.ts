export class PostResponseDto {
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
  createdAt: Date;
  updatedAt: Date;
}