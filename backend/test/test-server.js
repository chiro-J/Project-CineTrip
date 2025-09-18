const express = require('express');
const jwt = require('jsonwebtoken');
const { z } = require('zod');
const app = express();

app.use(express.json());

// Zod 스키마 정의
const PostSchema = z.object({
  description: z.string().optional().default(''), // 게시물 내용
  imageUrl: z.string()
    .min(1, '이미지는 반드시 1개가 필요합니다.')
    .url('올바른 이미지 URL 형식이 아닙니다.')
    .regex(/^https?:\/\/.+/, 'http:// 또는 https://로 시작해야 합니다.'),
  location: z.string().optional().default('')
});

const PostUpdateSchema = z.object({
  description: z.string().optional(), // 게시물 내용만 수정 가능
  location: z.string().optional()     // 위치만 수정 가능
}).strict(); // 다른 필드는 수정 불가

const CommentSchema = z.object({
  content: z.string()
    .min(1, '댓글 내용은 필수입니다.')
    .trim()
    .refine(val => val !== null, '댓글 내용은 null이 될 수 없습니다.')
}).strict(); // strict()로 다른 필드 허용 안함

// JWT 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, 'your-jwt-secret-key', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Mock 데이터
let posts = [];
let comments = [];
let likes = [];
let postIdCounter = 1;
let commentIdCounter = 1;
let likeIdCounter = 1;

console.log('🚀 테스트 서버 엔드포인트:');
console.log('');

// Posts API
console.log('📝 Posts API:');
console.log('GET    http://localhost:3000/api/posts              - 게시물 전체 조회');
console.log('POST   http://localhost:3000/api/posts              - 게시물 생성 (JWT 필요)');
console.log('GET    http://localhost:3000/api/posts/:postId      - 게시물 상세 조회');
console.log('PATCH  http://localhost:3000/api/posts/:postId      - 게시물 수정 (JWT 필요)');
console.log('DELETE http://localhost:3000/api/posts/:postId      - 게시물 삭제 (JWT 필요)');

// 게시물 전체 조회
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// 게시물 생성
app.post('/api/posts', authenticateToken, (req, res) => {
  try {
    // Zod 유효성 검사
    const validatedData = PostSchema.parse(req.body);

    const post = {
      id: String(postIdCounter++),
      description: validatedData.description,
      imageUrl: validatedData.imageUrl,
      location: validatedData.location,
      authorId: req.user.id,
      createdAt: new Date(),
      likesCount: 0,
      commentsCount: 0
    };
    posts.push(post);
    res.status(201).json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];
      return res.status(400).json({
        message: firstError.message,
        field: firstError.path.join('.'),
        errors: error.errors
      });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 게시물 상세 조회
app.get('/api/posts/:postId', (req, res) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  res.json(post);
});

// 게시물 수정
app.patch('/api/posts/:postId', authenticateToken, (req, res) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });
  if (post.authorId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  try {
    // 수정용 Zod 유효성 검사 (description, location만 허용)
    const validatedData = PostUpdateSchema.parse(req.body);

    // 유효한 필드만 업데이트
    if (validatedData.description !== undefined) {
      post.description = validatedData.description;
    }
    if (validatedData.location !== undefined) {
      post.location = validatedData.location;
    }

    res.json(post);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];

      // 허용되지 않는 필드 수정 시도 시
      if (firstError.code === 'unrecognized_keys') {
        return res.status(400).json({
          message: '게시물 수정 시에는 내용(description)과 위치(location)만 변경할 수 있습니다.',
          field: firstError.keys.join(', '),
          errors: error.errors
        });
      }

      return res.status(400).json({
        message: firstError.message,
        field: firstError.path.join('.'),
        errors: error.errors
      });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 게시물 삭제
app.delete('/api/posts/:postId', authenticateToken, (req, res) => {
  const postIndex = posts.findIndex(p => p.id === req.params.postId);
  if (postIndex === -1) return res.status(404).json({ message: 'Post not found' });
  if (posts[postIndex].authorId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  posts.splice(postIndex, 1);
  res.status(204).send();
});

console.log('');
console.log('❤️  Likes API:');
console.log('POST   http://localhost:3000/api/posts/:postId/likes           - 좋아요 추가 (JWT 필요)');
console.log('DELETE http://localhost:3000/api/posts/:postId/likes/:likeId   - 좋아요 취소 (JWT 필요)');

// 좋아요 추가
app.post('/api/posts/:postId/likes', authenticateToken, (req, res) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  const existingLike = likes.find(l => l.postId === req.params.postId && l.userId === req.user.id);
  if (existingLike) return res.status(400).json({ message: 'Already liked' });

  const like = {
    id: String(likeIdCounter++),
    postId: req.params.postId,
    userId: req.user.id,
    createdAt: new Date()
  };
  likes.push(like);
  post.likesCount++;

  res.status(201).json({ likeId: like.id, likesCount: post.likesCount });
});

// 좋아요 취소
app.delete('/api/posts/:postId/likes/:likeId', authenticateToken, (req, res) => {
  const likeIndex = likes.findIndex(l => l.id === req.params.likeId);
  if (likeIndex === -1) return res.status(404).json({ message: 'Like not found' });
  if (likes[likeIndex].userId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  const post = posts.find(p => p.id === req.params.postId);
  if (post) post.likesCount--;

  likes.splice(likeIndex, 1);
  res.status(204).send();
});

console.log('');
console.log('💬 Comments API:');
console.log('POST   http://localhost:3000/api/posts/:postId/comments                    - 댓글 생성 (JWT 필요)');
console.log('GET    http://localhost:3000/api/posts/:postId/comments                    - 댓글 조회');
console.log('DELETE http://localhost:3000/api/posts/:postId/comments/:commentId        - 댓글 삭제 (JWT 필요)');

// 댓글 생성
app.post('/api/posts/:postId/comments', authenticateToken, (req, res) => {
  const post = posts.find(p => p.id === req.params.postId);
  if (!post) return res.status(404).json({ message: 'Post not found' });

  try {
    // Zod 유효성 검사 (strict 모드로 이미지 필드 자동 차단)
    const validatedData = CommentSchema.parse(req.body);

    const comment = {
      id: String(commentIdCounter++),
      postId: req.params.postId,
      content: validatedData.content,
      authorId: req.user.id,
      createdAt: new Date()
    };
    comments.push(comment);
    post.commentsCount++;

    res.status(201).json(comment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors[0];

      // 알 수 없는 필드가 있는 경우 특별 처리
      if (firstError.code === 'unrecognized_keys') {
        return res.status(400).json({
          message: '댓글에는 텍스트만 허용됩니다. 이미지나 다른 필드는 첨부할 수 없습니다.',
          field: firstError.keys.join(', '),
          errors: error.errors
        });
      }

      return res.status(400).json({
        message: firstError.message,
        field: firstError.path.join('.'),
        errors: error.errors
      });
    }
    res.status(500).json({ message: '서버 오류가 발생했습니다.' });
  }
});

// 댓글 조회
app.get('/api/posts/:postId/comments', (req, res) => {
  const postComments = comments.filter(c => c.postId === req.params.postId);
  res.json(postComments);
});

// 댓글 삭제
app.delete('/api/posts/:postId/comments/:commentId', authenticateToken, (req, res) => {
  const commentIndex = comments.findIndex(c => c.id === req.params.commentId);
  if (commentIndex === -1) return res.status(404).json({ message: 'Comment not found' });
  if (comments[commentIndex].authorId !== req.user.id) return res.status(403).json({ message: 'Forbidden' });

  const post = posts.find(p => p.id === req.params.postId);
  if (post) post.commentsCount--;

  comments.splice(commentIndex, 1);
  res.status(204).send();
});

// 서버 시작
const PORT = 3000;
app.listen(PORT, () => {
  console.log('');
  console.log(`🎯 테스트 서버가 포트 ${PORT}에서 실행중입니다!`);
  console.log('');
  console.log('🔑 JWT 토큰 생성: node test/generate-test-jwt.js');
  console.log('📋 포스트맨에서 Authorization 헤더에 "Bearer {토큰}" 형식으로 추가하세요');
});