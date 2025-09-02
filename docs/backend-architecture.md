# Backend Architecture

backend/
├── src/
│ ├── main.ts
│ ├── app.module.ts
│ ├── app.controller.ts
│ ├── app.service.ts
│ │
│ ├── modules/
│ │ ├── auth/ # 인증 시스템
│ │ │ ├── auth.module.ts
│ │ │ ├── auth.controller.ts
│ │ │ ├── auth.service.ts
│ │ │ ├── dto/
│ │ │ │ ├── google-login.dto.ts
│ │ │ │ ├── profile-setup.dto.ts
│ │ │ │ └── login-response.dto.ts
│ │ │ ├── strategies/
│ │ │ │ ├── jwt.strategy.ts
│ │ │ │ └── google.strategy.ts
│ │ │ └── guards/
│ │ │ ├── jwt-auth.guard.ts
│ │ │ └── google-auth.guard.ts
│ │ │
│ │ ├── users/ # 사용자 관리
│ │ │ ├── users.module.ts
│ │ │ ├── users.controller.ts
│ │ │ ├── users.service.ts
│ │ │ ├── entities/
│ │ │ │ └── user.entity.ts
│ │ │ └── dto/
│ │ │ ├── create-user.dto.ts
│ │ │ ├── update-profile.dto.ts
│ │ │ └── user-response.dto.ts
│ │ │
│ │ ├── movies/ # 영화 데이터
│ │ │ ├── movies.module.ts
│ │ │ ├── movies.controller.ts
│ │ │ ├── movies.service.ts
│ │ │ ├── entities/
│ │ │ │ ├── movie.entity.ts
│ │ │ │ └── movie-bookmark.entity.ts
│ │ │ └── dto/
│ │ │ ├── movie-search.dto.ts
│ │ │ ├── movie-detail.dto.ts
│ │ │ └── bookmark-movie.dto.ts
│ │ │
│ │ ├── locations/ # 촬영지 관리
│ │ │ ├── locations.module.ts
│ │ │ ├── locations.controller.ts
│ │ │ ├── locations.service.ts
│ │ │ ├── entities/
│ │ │ │ ├── location.entity.ts
│ │ │ │ └── movie-location.entity.ts
│ │ │ └── dto/
│ │ │ ├── create-location.dto.ts
│ │ │ ├── location-detail.dto.ts
│ │ │ └── movie-locations.dto.ts
│ │ │
│ │ ├── photos/ # 사진 업로드/관리
│ │ │ ├── photos.module.ts
│ │ │ ├── photos.controller.ts
│ │ │ ├── photos.service.ts
│ │ │ ├── entities/
│ │ │ │ ├── photo.entity.ts
│ │ │ │ └── photo-like.entity.ts
│ │ │ └── dto/
│ │ │ ├── upload-photo.dto.ts
│ │ │ ├── photo-detail.dto.ts
│ │ │ └── like-photo.dto.ts
│ │ │
│ │ ├── comments/ # 댓글 시스템
│ │ │ ├── comments.module.ts
│ │ │ ├── comments.controller.ts
│ │ │ ├── comments.service.ts
│ │ │ ├── entities/
│ │ │ │ └── comment.entity.ts
│ │ │ └── dto/
│ │ │ ├── create-comment.dto.ts
│ │ │ └── comment-response.dto.ts
│ │ │
│ │ ├── checklist/ # 체크리스트
│ │ │ ├── checklist.module.ts
│ │ │ ├── checklist.controller.ts
│ │ │ ├── checklist.service.ts
│ │ │ ├── entities/
│ │ │ │ ├── checklist.entity.ts
│ │ │ │ └── checklist-item.entity.ts
│ │ │ └── dto/
│ │ │ ├── create-checklist.dto.ts
│ │ │ ├── update-checklist.dto.ts
│ │ │ └── checklist-item.dto.ts
│ │ │
│ │ ├── recommendations/ # 추천 시스템
│ │ │ ├── recommendations.module.ts
│ │ │ ├── recommendations.controller.ts
│ │ │ ├── recommendations.service.ts
│ │ │ ├── entities/
│ │ │ │ └── recommendation.entity.ts
│ │ │ └── dto/
│ │ │ ├── create-recommendation.dto.ts
│ │ │ └── recommendation-response.dto.ts
│ │ │
│ │ ├── feed/ # 피드 시스템
│ │ │ ├── feed.module.ts
│ │ │ ├── feed.controller.ts
│ │ │ ├── feed.service.ts
│ │ │ ├── entities/
│ │ │ │ └── feed-item.entity.ts
│ │ │ └── dto/
│ │ │ ├── feed-filter.dto.ts
│ │ │ └── feed-response.dto.ts
│ │ │
│ │ ├── gallery/ # 갤러리
│ │ │ ├── gallery.module.ts
│ │ │ ├── gallery.controller.ts
│ │ │ ├── gallery.service.ts
│ │ │ └── dto/
│ │ │ ├── gallery-filter.dto.ts
│ │ │ └── gallery-response.dto.ts
│ │ │
│ │ ├── search/ # 검색 기능
│ │ │ ├── search.module.ts
│ │ │ ├── search.controller.ts
│ │ │ ├── search.service.ts
│ │ │ └── dto/
│ │ │ ├── search-query.dto.ts
│ │ │ └── search-result.dto.ts
│ │ │
│ │ └── upload/ # 파일 업로드
│ │ ├── upload.module.ts
│ │ ├── upload.controller.ts
│ │ ├── upload.service.ts
│ │ └── dto/
│ │ ├── upload-request.dto.ts
│ │ └── upload-response.dto.ts
│ │
│ ├── common/
│ │ ├── guards/
│ │ │ ├── jwt-auth.guard.ts
│ │ │ ├── roles.guard.ts
│ │ │ └── owner.guard.ts # 본인 리소스만 접근
│ │ ├── decorators/
│ │ │ ├── current-user.decorator.ts
│ │ │ ├── roles.decorator.ts
│ │ │ └── public.decorator.ts
│ │ ├── filters/
│ │ │ ├── http-exception.filter.ts
│ │ │ └── validation-exception.filter.ts
│ │ ├── interceptors/
│ │ │ ├── logging.interceptor.ts
│ │ │ ├── transform.interceptor.ts
│ │ │ └── cache.interceptor.ts
│ │ ├── pipes/
│ │ │ ├── validation.pipe.ts
│ │ │ └── parse-objectid.pipe.ts
│ │ ├── middleware/
│ │ │ ├── cors.middleware.ts
│ │ │ └── logger.middleware.ts
│ │ ├── interfaces/
│ │ │ ├── user.interface.ts
│ │ │ ├── pagination.interface.ts
│ │ │ └── api-response.interface.ts
│ │ └── types/
│ │ ├── auth.types.ts
│ │ ├── upload.types.ts
│ │ └── database.types.ts
│ │
│ ├── external/ # 외부 API 연동
│ │ ├── tmdb/
│ │ │ ├── tmdb.module.ts
│ │ │ ├── tmdb.service.ts
│ │ │ └── dto/
│ │ │ ├── tmdb-movie.dto.ts
│ │ │ └── tmdb-search.dto.ts
│ │ ├── google/
│ │ │ ├── google.module.ts
│ │ │ └── google.service.ts
│ │ └── storage/ # AWS S3, Google Cloud Storage 등
│ │ ├── storage.module.ts
│ │ ├── storage.service.ts
│ │ └── interfaces/
│ │ └── storage.interface.ts
│ │
│ ├── database/
│ │ ├── database.module.ts
│ │ ├── database.service.ts
│ │ ├── migrations/
│ │ └── seeds/ # 더미 데이터
│ │ ├── locations.seed.ts
│ │ ├── movies.seed.ts
│ │ └── users.seed.ts
│ │
│ ├── config/
│ │ ├── app.config.ts
│ │ ├── database.config.ts
│ │ ├── jwt.config.ts
│ │ ├── google.config.ts
│ │ ├── tmdb.config.ts
│ │ ├── storage.config.ts
│ │ └── swagger.config.ts
│ │
│ └── utils/
│ ├── pagination.util.ts
│ ├── file.util.ts
│ ├── date.util.ts
│ ├── validation.util.ts
│ └── constants.ts
│
├── test/ # 테스트
│ ├── app.e2e-spec.ts
│ ├── auth.e2e-spec.ts
│ ├── movies.e2e-spec.ts
│ └── jest-e2e.json
│
├── uploads/ # 로컬 파일 저장 (개발환경)
│ ├── photos/
│ └── temp/
│
├── logs/
│ ├── error.log
│ └── combined.log
│
├── .env # 환경변수
├── .env.example
├── .env.development
├── .env.production
├── .gitignore
├── .prettierrc
├── .eslintrc.js
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── tsconfig.json
├── tsconfig.build.json
└── README.md
