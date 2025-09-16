# 프론트엔드 아키텍처

```
src/
├── pages/                        # URL에 대응하는 페이지
│   ├── landing/
│   │   └── index.tsx            # 비회원 랜딩 페이지 (첫 진입)
│   ├── auth/
│   │   ├── Profile.tsx          # 회원가입 후 프로필 설정 페이지
│   │   └── Callback.tsx         # OAuth 콜백 처리
│   ├── home/
│   │   └── index.tsx            # 회원 메인 피드 페이지
│   ├── search/
│   │   └── index.tsx            # 검색창 + 검색 결과 페이지
│   ├── movies/
│   │   ├── index.tsx            # 영화 목록 페이지 (API 포스터들)
│   │   └── Detail.tsx           # 영화 상세 페이지 (/movies/:id)
│   │                            # - 영화 정보 (API)
│   │                            # - 촬영지 5개
│   │                            # - 유저 추천 장소들
│   │                            # - 유저 사진들
│   ├── User/
│   │   ├── Profile.tsx          # 다른 유저 프로필 페이지 (공개) (/user/:id)
│   │   └── MyProfile.tsx        # 내 프로필 페이지 (수정 가능) (/mypage)
│   │                            # - 체크리스트 관리
│   │                            # - 업로드한 사진 관리
│   └── Gallery/
│       ├── index.tsx            # 공개 갤러리 페이지 (다른 유저도 볼 수 있음)
│       └── MyGallery.tsx        # 내 갤러리 페이지 (수정/추가 가능)
│                                # - 북마크한 영화들
│                                # - 올린 사진들
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   ├── Loading.tsx
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   └── SearchBar.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   ├── Navigation.tsx
│   │   └── Layout.tsx
│   │
│   ├── auth/
│   │   └── Login.tsx              # GoogleLoginModal + LoginButton + ProfileSetup 통합
│   │
│   ├── movie/
│   │   ├── MovieGrid.tsx          # MovieCard + MovieGrid 통합
│   │   └── MovieDetails.tsx       # MovieDetail + MovieInfo 통합
│   │
│   ├── location/
│   │   └── Locations.tsx          # LocationCard + LocationList + LocationMap + SceneInfo 통합
│   │
│   ├── checklist/
│   │   └── Checklist.tsx
│   │            # CheckListModal + CheckListItem +EmptyCheckLis + CheckListCreated + CheckListDetail 통합
│   │
│   ├── photo/
│   │   ├── Photo.tsx              # PhotoCard + LikeButton 통합
│   │   └── Comment.tsx            # CommentItem + CommentForm 통합
│   │
│   ├── upload/
│   │   └── Upload.tsx
│   │     # UploadModal + ContentSelector + PhotoUploadStep + RecommendStep + PhotoDetailsSte+ UploadProgress 통합
│   │
│   ├── recommend/
│   │   └── Recommendations.tsx    # RecommendCard + RecommendList 통합
│   │
│   ├── feed/
│   │   └── Feed.tsx               # FeedItem + FeedList + FeedFilter 통합
│   │
│   └── gallery/
│       └── Gallery.tsx            # GalleryGrid + BookmarkSection + MyPhotosSection + GalleryFilter 통합
│
├── hooks/
│   ├── useMovies.ts
│   ├── useUpload.ts
│   ├── useCheckList.ts
│   └── useLocalStorage.ts
│
├── utils/                       # 자주 쓰는 함수들
│   ├── api.ts                  # 외부 API (TMDB, Google Auth)
│   ├── database.ts             # 데이터베이스 조회 함수들
│   ├── helpers.ts              # 날짜, 포맷팅, 유효성검사 등 통합
│   └── constants.ts            # 상수들
│
├── contexts/                    # 공유 상태
│   ├── AuthContext.tsx         # 로그인 상태 + 사용자 정보
│   ├── AppContext.tsx          # 앱 전체 상태 (영화, 사진, 업로드 등)
│   └── ThemeContext.tsx        # 테마 설정
│
├── routes/                      # URL 라우팅 정의
│   ├── index.tsx               # 라우터 설정
│   ├── ProtectedRoute.tsx      # 로그인 필요한 페이지
│   └── PrivateRoute.tsx        # 본인만 접근 가능한 페이지
│
├── data/                        # 예제/더미 데이터
│   ├── locations.ts            # 더미 촬영지 데이터 (5개씩)
│   ├── users.ts                # 더미 사용자 데이터
│   ├── photos.ts               # 더미 사진 데이터
│   └── recommendations.ts      # 더미 추천 장소 데이터
│
├── theme/                       # DaisyUI 테마 커스터마이징
│   ├── daisyui/
│   └── tailwind/
│
├── types/
│   ├── auth.ts
│   ├── movie.ts
│   ├── content.ts
│   └── common.ts
│
├── assets/
│   ├── images/
│   │   ├── landing/
│   │   ├── placeholders/
│   │   └── checklist/
│   │
│   ├── icons/
│   └── logos/
│
├── dist/                    #빌드 파일 저장
│
├── App.css
├── App.tsx
├── main.tsx
├── vite-env.d.ts
└── index.css
```

## 비고

- hooks - useAuth 혹은 contexts - AuthContext.tsx 중에 하나 택 일.
- 일관성 유지 중요 (기능별, 표기법)
- 설치 패키지: `yarn`
- `ESLint, Prettier`
- 환경: `Node.js, React, vite`
- 언어: `TypeScript`
- `Tailwind CSS`
- 상태관리: `Zustand`
