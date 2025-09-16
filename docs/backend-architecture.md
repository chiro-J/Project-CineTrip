# 백엔드 아키텍처

```
src/
├── auth/                    # 인증 관련
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   └── dto/, guards/, strategies/
│
├── users/                   # 사용자 관리 + 팔로우
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.module.ts
│   ├── follow/
│   │   ├── follow.controller.ts
│   │   └── follow.service.ts
│   └── dto/, entities/
│
├── posts/                   # 게시물 + 좋아요 + 댓글
│   ├── posts.controller.ts
│   ├── posts.service.ts
│   ├── posts.module.ts
│   ├── comments/
│   │   ├── comments.controller.ts
│   │   └── comments.service.ts
│   ├── likes/
│   │   ├── likes.controller.ts
│   │   └── likes.service.ts
│   └── dto/, entities/
│
├── movies/                  # 영화 + 북마크
│   ├── movies.controller.ts
│   ├── movies.service.ts
│   ├── movies.module.ts
│   ├── bookmarks/
│   │   ├── bookmarks.controller.ts
│   │   └── bookmarks.service.ts
│   └── dto/, entities/
│
├── locations/               # 위치/지도 관련
│   ├── locations.controller.ts
│   ├── locations.service.ts
│   ├── locations.module.ts
│   └── dto/, entities/
│
├── llm/                     # LLM + 체크리스트
│   ├── llm.controller.ts
│   ├── llm.service.ts
│   ├── llm.module.ts
│   └── dto/, entities/
│
├── upload/                  # 파일 업로드
│   ├── upload.controller.ts
│   ├── upload.service.ts
│   └── upload.module.ts
│
└── common/                  # 공통 기능
    ├── decorators/
    ├── filters/
    ├── guards/
    ├── interceptors/
    └── pipes/
```
