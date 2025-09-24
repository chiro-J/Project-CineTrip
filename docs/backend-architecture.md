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

## 비고

- TypeScript 기반의 NestJS
- LLM api를 호출하여 전송해서 받은 반환 값을 DB에 저장하는 로직 포함.
- 실제 AWS 클라우드 서비스와 연동시켜 저장 및 CRUD 로직 구현
