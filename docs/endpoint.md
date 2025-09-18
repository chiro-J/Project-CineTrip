| 설명                               | 메서드 | 경로                                   |
| ---------------------------------- | ------ | -------------------------------------- |
| Google 로그인                      | GET    | /auth/google                           |
| Google 콜백 + JWT 발급 + 쿠키 세팅 | GET    | /auth/google/callback                  |
| 초기 프로필 데이터 조회            | GET    | /auth/me                               |
| 로그아웃, 토큰 삭제                | POST   | /auth/logout                           |
| 프로필 정보 조회                   | GET    | /user/me                               |
| 프로필 정보 수정                   | PATCH  | /user/me                               |
| 영화 북마크                        | POST   | /user/me/bookmarks                     |
| 영화 북마크 목록 조회              | GET    | /user/me/bookmarks                     |
| 영화 북마크 삭제                   | DELETE | /user/me/bookmarks/:movieId            |
| 사용자 조회                        | GET    | /user/:userId                          |
| 팔로우 추가                        | POST   | /user/:userid/follow                   |
| 팔로우 조회                        | GET    | /user/:userid/follow                   |
| 팔로우 삭제                        | DELETE | /user/:userid/follow/:followId         |
| AWS S3에 사진 업로드               | POST   | /upload/photos                         |
| 게시물 전체 조회                   | GET    | /posts                                 |
| 게시물 생성                        | POST   | /posts                                 |
| 게시물 상세 조회                   | GET    | /posts/:postId                         |
| 게시물 수정                        | PATCH  | /posts/:postId                         |
| 게시물 삭제                        | DELETE | /posts/:postId                         |
| 좋아요 추가                        | POST   | /posts/:postId/likes                   |
| 좋아요 취소                        | DELETE | /posts/:postId/likes/:likeId           |
| 댓글 생성                          | POST   | /posts/:postId/comments                |
| 댓글 조회                          | GET    | /posts/:postId/comments                |
| 댓글 삭제                          | DELETE | /posts/:postId/comments/:commentId     |
| LLM에 프롬프트 전송 및 DB 저장     | POST   | /llm/prompt                            |
| TMDB ID를 DB 저장                  | POST   | /movies                                |
| 영화 촬영지 정보 조회 (LLM 기반)   | GET    | /movies/:movieId/locations/:locationId |
| 장소에 대한 관련 영화 조회         | GET    | /locations/:locationId/movies          |
| 체크리스트 정보 조회 (LLM 기반)    | GET    | /profile/checklist                     |
| 서버 헬스 체크 (Cloudfront)        | GET    | /health                                |
