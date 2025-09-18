export class CommentResponseDto {
  id: string;
  text: string;
  userId: string;
  postId: string;
  user: {
    id: string;
    username: string;
    profileImageUrl?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
