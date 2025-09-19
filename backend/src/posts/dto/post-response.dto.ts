export class PostResponseDto {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  location?: string;
  likesCount: number;
  commentsCount: number;
  authorId: number;
  author: {
    id: number;
    username: string;
    profileImageUrl?: string;
  };
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
