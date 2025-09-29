import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Post } from '../../posts/entities/post.entity';
import { Like } from '../../posts/likes/entities/like.entity';
import { Comment } from '../../posts/comments/entities/comment.entity';
import { Follow } from '../follow/entities/follow.entity';
import { Bookmark } from '../../movies/bookmarks/entities/bookmark.entity';
import { Checklist } from '../../llm/entities/checklist.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, generated: 'uuid' })
  uuid: string;

  @Column({ unique: true })
  username: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  profile_image_url: string;

  @Column({ nullable: true })
  bio: string;

  @OneToMany(() => Post, (post) => post.author)
  posts: Post[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Follow, (follow) => follow.follower)
  following: Follow[];

  @OneToMany(() => Follow, (follow) => follow.following)
  followers: Follow[];

  @OneToMany(() => Bookmark, (bookmark) => bookmark.user_id)
  bookmarks: Bookmark[];

  @OneToMany(() => Checklist, (checklist) => checklist.user)
  checklists: Checklist[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
