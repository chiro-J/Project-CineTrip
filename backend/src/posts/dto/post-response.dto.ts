export class PostResponseDto {
  id: number;
  title: string;
  description?: string;
  imageUrl: string;
  location?: string;
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
