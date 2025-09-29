export class CommentResponseDto {
  id: number;
  text: string;
  userId: number;
  postId: number;
  user: {
    id: number;
    username: string;
    profileImageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
