# CineTrip (feat. _Team. POPCORN MATES_)

## Stamp Your Scene, Share Your Story.

영화 속 멋있는 장소나 아름다운 자연경관이 나왔을 때 영화 속 주인공처럼 나도 한번 저 장소에 가보고 싶다는 누구나 할 법한 생각을 가진 사람들끼리의 커뮤니티 공간을 만들고자 했습니다.

---

### Target Users

1. 여행을 계획 중인데 미리 작성해둘 체크리스트가 필요한 사람
2. 영화의 한 장면에 나온 장소를 직접 방문해보고 싶은 사람
3. 영화의 한 장면에 나왔던 내가 다녀온 장소를 다른 사람들과 소통하고 싶은 사람

## 📆 프로젝트 기간

- 시작일: 2025.08.06
- 종료일: 2025.09.30

---

## 🎯 주요 목표

- ✅ 월별 달력 자동 렌더링
- ✅ 오늘 날짜 강조 및 시각 표시
- ✅ 날짜별 트래커 체크 표시 (❌ 토글)
- ✅ 로컬스토리지 기반 데이터 저장
- ✅ 월 목표 입력 및 저장
- ✅ 랜덤 명언 출력 기능

---

## ⚙️ 사용 기술 스택

| 분류       | 기술명                |
| ---------- | --------------------- |
| 프론트엔드 | HTML, CSS, JavaScript |
| 기타       | Git, GitHub           |

---

## 🧱 프로젝트 구조

### Frontend

```bash
📁 aaar/
├── index.html        # 메인 HTML
├── daymarker.css     # 전체 스타일
├── daymarker.js      # 날짜 렌더링 & 로직
├── logo.png          # DayMarker 로고
└── README.md         # 프로젝트 소개 문서
```

### Backend

```bash
📁 aaar/
├── index.html        # 메인 HTML
├── daymarker.css     # 전체 스타일
├── daymarker.js      # 날짜 렌더링 & 로직
├── logo.png          # DayMarker 로고
└── README.md         # 프로젝트 소개 문서
```

---

## 💡 주요 기능 설명

### 🗓️ 기능 1: 달력 렌더링

- 현재 월 기준 7x6 격자 달력 자동 생성
- 월 이동 버튼(◀ ▶) 클릭 시 이전/다음 달 렌더링
- 오늘 날짜는 연한 파란색 배경으로 강조

### ❌ 기능 2: 날짜 트래커

- 날짜 셀 클릭 시 빨간 ❌ 마크 표시
- 다시 클릭하면 ❌ 제거 (토글 방식)
- ❌ 정보는 로컬스토리지에 **월별로 저장**됨

### 🎯 기능 3: 월 목표 입력

- 사이드바에 목표 입력창(`textarea`) 제공
- `Enter` 키 입력 시 해당 월 목표가 저장됨
- 월 변경 시 저장된 목표 불러오기

### 💬 기능 4: 랜덤 명언 표시

- 새로고침 또는 월 이동 시 명언 한 줄 무작위 표시
- 명언은 자극적이지 않으면서도 실습용으로 가볍게 구성됨

---

## 🖼️ 데모 화면

### ✅ 메인화면

사용자 목표 입력, 명언 표시, 달력 구조가 포함된 기본 화면입니다.

---

### ✅ 목표 설정 시 안내

목표 입력 후 `Enter` 키를 누르면 로컬스토리지에 저장되고, 저장 완료 알림이 표시됩니다.

---

### ✅ 트래커 ❌ 표시 + 현재 날짜 강조

❌ 클릭 토글 방식으로 데일리 완료 상태를 기록할 수 있으며,  
오늘 날짜는 연한 파란색 배경으로 표시되어 시각적으로 구분됩니다.

---

### 🔧 보완하고 싶은 점

- 하루에 여러 개의 할 일을 관리할 수 있는 **투두리스트 기능** 추가
- **반응형 디자인** 적용 (모바일 대응)
- ❌ 외에 **색상/체크 아이콘 등 다양한 마커 기능** 추가

<br><br><br>

# 기타

[팀프로젝트 드라이브](https://drive.google.com/drive/folders/1d_BWiEdW2WFQr20Z-tjzqK8EcEafP2Ih?usp=sharing)

[화면설계서](https://www.figma.com/design/yNXL7zAFWojHc7Ltbbd2TA/%EC%8B%9C%EB%84%A4%ED%8A%B8%EB%A6%BD-%ED%99%94%EB%A9%B4%EC%84%A4%EA%B3%84%EC%84%9C?node-id=0-1&p=f&t=hPUxnlU5IGaXRypg-0)

[WBS](https://docs.google.com/spreadsheets/d/10xFtgunZDW_-YtESeNXM0pqH3nmljE8b/edit?usp=sharing&ouid=117370317488578441607&rtpof=true&sd=true)

[회의록](https://www.notion.so/Project-CineTrip-feat-Team-PopcornMate-261fff2fd51580ba81ddf96f85d5e5fc?source=copy_link)

```
Project-CineTrip
├─ backend
│  ├─ .pnp.cjs
│  ├─ .pnp.loader.mjs
│  ├─ .prettierrc
│  ├─ .yarn
│  │  ├─ install-state.gz
│  │  └─ unplugged
│  │     ├─ @nestjs-core-virtual-76c27c62bb
│  │     ├─ @scarf-scarf-npm-1.4.0-f6114c29f9
│  │     ├─ @unrs-resolver-binding-win32-x64-msvc-npm-1.11.1-4121c06678
│  │     ├─ bcrypt-npm-6.0.0-fb16e34c40
│  │     ├─ node-addon-api-npm-8.5.0-2920c05027
│  │     ├─ node-gyp-npm-11.4.2-75a7da9a3c
│  │     ├─ prettier-npm-3.6.2-2668152203
│  │     └─ unrs-resolver-npm-1.11.1-9828edd1f1
│  ├─ dist
│  │  ├─ app.controller.d.ts
│  │  ├─ app.controller.js
│  │  ├─ app.controller.js.map
│  │  ├─ app.module.d.ts
│  │  ├─ app.module.js
│  │  ├─ app.module.js.map
│  │  ├─ app.service.d.ts
│  │  ├─ app.service.js
│  │  ├─ app.service.js.map
│  │  ├─ main.d.ts
│  │  ├─ main.js
│  │  ├─ main.js.map
│  │  ├─ modules
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.d.ts
│  │  │  │  ├─ auth.controller.js
│  │  │  │  ├─ auth.controller.js.map
│  │  │  │  ├─ auth.module.d.ts
│  │  │  │  ├─ auth.module.js
│  │  │  │  ├─ auth.module.js.map
│  │  │  │  ├─ auth.service.d.ts
│  │  │  │  ├─ auth.service.js
│  │  │  │  └─ auth.service.js.map
│  │  │  ├─ checklist
│  │  │  │  ├─ checklist.controller.d.ts
│  │  │  │  ├─ checklist.controller.js
│  │  │  │  ├─ checklist.controller.js.map
│  │  │  │  ├─ checklist.module.d.ts
│  │  │  │  ├─ checklist.module.js
│  │  │  │  ├─ checklist.module.js.map
│  │  │  │  ├─ checklist.service.d.ts
│  │  │  │  ├─ checklist.service.js
│  │  │  │  └─ checklist.service.js.map
│  │  │  ├─ comments
│  │  │  │  ├─ comments.controller.d.ts
│  │  │  │  ├─ comments.controller.js
│  │  │  │  ├─ comments.controller.js.map
│  │  │  │  ├─ comments.module.d.ts
│  │  │  │  ├─ comments.module.js
│  │  │  │  ├─ comments.module.js.map
│  │  │  │  ├─ comments.service.d.ts
│  │  │  │  ├─ comments.service.js
│  │  │  │  └─ comments.service.js.map
│  │  │  ├─ feed
│  │  │  │  ├─ feed.controller.d.ts
│  │  │  │  ├─ feed.controller.js
│  │  │  │  ├─ feed.controller.js.map
│  │  │  │  ├─ feed.module.d.ts
│  │  │  │  ├─ feed.module.js
│  │  │  │  ├─ feed.module.js.map
│  │  │  │  ├─ feed.service.d.ts
│  │  │  │  ├─ feed.service.js
│  │  │  │  └─ feed.service.js.map
│  │  │  ├─ gallery
│  │  │  │  ├─ gallery.controller.d.ts
│  │  │  │  ├─ gallery.controller.js
│  │  │  │  ├─ gallery.controller.js.map
│  │  │  │  ├─ gallery.module.d.ts
│  │  │  │  ├─ gallery.module.js
│  │  │  │  ├─ gallery.module.js.map
│  │  │  │  ├─ gallery.service.d.ts
│  │  │  │  ├─ gallery.service.js
│  │  │  │  └─ gallery.service.js.map
│  │  │  ├─ locations
│  │  │  │  ├─ locations.controller.d.ts
│  │  │  │  ├─ locations.controller.js
│  │  │  │  ├─ locations.controller.js.map
│  │  │  │  ├─ locations.module.d.ts
│  │  │  │  ├─ locations.module.js
│  │  │  │  ├─ locations.module.js.map
│  │  │  │  ├─ locations.service.d.ts
│  │  │  │  ├─ locations.service.js
│  │  │  │  └─ locations.service.js.map
│  │  │  ├─ movies
│  │  │  │  ├─ movies.controller.d.ts
│  │  │  │  ├─ movies.controller.js
│  │  │  │  ├─ movies.controller.js.map
│  │  │  │  ├─ movies.module.d.ts
│  │  │  │  ├─ movies.module.js
│  │  │  │  ├─ movies.module.js.map
│  │  │  │  ├─ movies.service.d.ts
│  │  │  │  ├─ movies.service.js
│  │  │  │  └─ movies.service.js.map
│  │  │  ├─ photos
│  │  │  │  ├─ photos.controller.d.ts
│  │  │  │  ├─ photos.controller.js
│  │  │  │  ├─ photos.controller.js.map
│  │  │  │  ├─ photos.module.d.ts
│  │  │  │  ├─ photos.module.js
│  │  │  │  ├─ photos.module.js.map
│  │  │  │  ├─ photos.service.d.ts
│  │  │  │  ├─ photos.service.js
│  │  │  │  └─ photos.service.js.map
│  │  │  ├─ recommendations
│  │  │  │  ├─ recommendations.controller.d.ts
│  │  │  │  ├─ recommendations.controller.js
│  │  │  │  ├─ recommendations.controller.js.map
│  │  │  │  ├─ recommendations.module.d.ts
│  │  │  │  ├─ recommendations.module.js
│  │  │  │  ├─ recommendations.module.js.map
│  │  │  │  ├─ recommendations.service.d.ts
│  │  │  │  ├─ recommendations.service.js
│  │  │  │  └─ recommendations.service.js.map
│  │  │  ├─ search
│  │  │  │  ├─ search.controller.d.ts
│  │  │  │  ├─ search.controller.js
│  │  │  │  ├─ search.controller.js.map
│  │  │  │  ├─ search.module.d.ts
│  │  │  │  ├─ search.module.js
│  │  │  │  ├─ search.module.js.map
│  │  │  │  ├─ search.service.d.ts
│  │  │  │  ├─ search.service.js
│  │  │  │  └─ search.service.js.map
│  │  │  ├─ upload
│  │  │  │  ├─ upload.controller.d.ts
│  │  │  │  ├─ upload.controller.js
│  │  │  │  ├─ upload.controller.js.map
│  │  │  │  ├─ upload.module.d.ts
│  │  │  │  ├─ upload.module.js
│  │  │  │  ├─ upload.module.js.map
│  │  │  │  ├─ upload.service.d.ts
│  │  │  │  ├─ upload.service.js
│  │  │  │  └─ upload.service.js.map
│  │  │  └─ users
│  │  │     ├─ users.controller.d.ts
│  │  │     ├─ users.controller.js
│  │  │     ├─ users.controller.js.map
│  │  │     ├─ users.module.d.ts
│  │  │     ├─ users.module.js
│  │  │     ├─ users.module.js.map
│  │  │     ├─ users.service.d.ts
│  │  │     ├─ users.service.js
│  │  │     └─ users.service.js.map
│  │  └─ tsconfig.build.tsbuildinfo
│  ├─ eslint.config.mjs
│  ├─ logs
│  ├─ nest-cli.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ README.md
│  ├─ src
│  │  ├─ app.controller.spec.ts
│  │  ├─ app.controller.ts
│  │  ├─ app.module.ts
│  │  ├─ app.service.ts
│  │  ├─ common
│  │  │  ├─ decorators
│  │  │  ├─ interfaces
│  │  │  ├─ middleware
│  │  │  └─ types
│  │  ├─ config
│  │  ├─ database
│  │  │  ├─ migrations
│  │  │  └─ seeds
│  │  ├─ external
│  │  │  ├─ storage
│  │  │  │  └─ interfaces
│  │  │  └─ tmdb
│  │  │     └─ dto
│  │  ├─ main.ts
│  │  ├─ modules
│  │  │  ├─ auth
│  │  │  │  ├─ auth.controller.spec.ts
│  │  │  │  ├─ auth.controller.ts
│  │  │  │  ├─ auth.module.ts
│  │  │  │  ├─ auth.service.spec.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  ├─ dto
│  │  │  │  ├─ guards
│  │  │  │  └─ strategies
│  │  │  ├─ checklist
│  │  │  │  ├─ checklist.controller.spec.ts
│  │  │  │  ├─ checklist.controller.ts
│  │  │  │  ├─ checklist.module.ts
│  │  │  │  ├─ checklist.service.spec.ts
│  │  │  │  ├─ checklist.service.ts
│  │  │  │  ├─ dto
│  │  │  │  └─ entities
│  │  │  ├─ comments
│  │  │  │  ├─ comments.controller.spec.ts
│  │  │  │  ├─ comments.controller.ts
│  │  │  │  ├─ comments.module.ts
│  │  │  │  ├─ comments.service.spec.ts
│  │  │  │  ├─ comments.service.ts
│  │  │  │  ├─ dto
│  │  │  │  └─ entities
│  │  │  ├─ feed
│  │  │  │  ├─ dto
│  │  │  │  ├─ entities
│  │  │  │  ├─ feed.controller.spec.ts
│  │  │  │  ├─ feed.controller.ts
│  │  │  │  ├─ feed.module.ts
│  │  │  │  ├─ feed.service.spec.ts
│  │  │  │  └─ feed.service.ts
│  │  │  ├─ gallery
│  │  │  │  ├─ dto
│  │  │  │  ├─ gallery.controller.spec.ts
│  │  │  │  ├─ gallery.controller.ts
│  │  │  │  ├─ gallery.module.ts
│  │  │  │  ├─ gallery.service.spec.ts
│  │  │  │  └─ gallery.service.ts
│  │  │  ├─ locations
│  │  │  │  ├─ dto
│  │  │  │  ├─ entities
│  │  │  │  ├─ locations.controller.spec.ts
│  │  │  │  ├─ locations.controller.ts
│  │  │  │  ├─ locations.module.ts
│  │  │  │  ├─ locations.service.spec.ts
│  │  │  │  └─ locations.service.ts
│  │  │  ├─ movies
│  │  │  │  ├─ dto
│  │  │  │  ├─ entities
│  │  │  │  ├─ movies.controller.spec.ts
│  │  │  │  ├─ movies.controller.ts
│  │  │  │  ├─ movies.module.ts
│  │  │  │  ├─ movies.service.spec.ts
│  │  │  │  └─ movies.service.ts
│  │  │  ├─ photos
│  │  │  │  ├─ dto
│  │  │  │  ├─ entities
│  │  │  │  ├─ photos.controller.spec.ts
│  │  │  │  ├─ photos.controller.ts
│  │  │  │  ├─ photos.module.ts
│  │  │  │  ├─ photos.service.spec.ts
│  │  │  │  └─ photos.service.ts
│  │  │  ├─ recommendations
│  │  │  │  ├─ dto
│  │  │  │  ├─ entities
│  │  │  │  ├─ recommendations.controller.spec.ts
│  │  │  │  ├─ recommendations.controller.ts
│  │  │  │  ├─ recommendations.module.ts
│  │  │  │  ├─ recommendations.service.spec.ts
│  │  │  │  └─ recommendations.service.ts
│  │  │  ├─ search
│  │  │  │  ├─ dto
│  │  │  │  ├─ search.controller.spec.ts
│  │  │  │  ├─ search.controller.ts
│  │  │  │  ├─ search.module.ts
│  │  │  │  ├─ search.service.spec.ts
│  │  │  │  └─ search.service.ts
│  │  │  ├─ upload
│  │  │  │  ├─ dto
│  │  │  │  ├─ upload.controller.spec.ts
│  │  │  │  ├─ upload.controller.ts
│  │  │  │  ├─ upload.module.ts
│  │  │  │  ├─ upload.service.spec.ts
│  │  │  │  └─ upload.service.ts
│  │  │  └─ users
│  │  │     ├─ dto
│  │  │     ├─ entities
│  │  │     ├─ users.controller.spec.ts
│  │  │     ├─ users.controller.ts
│  │  │     ├─ users.module.ts
│  │  │     ├─ users.service.spec.ts
│  │  │     └─ users.service.ts
│  │  └─ utils
│  ├─ test
│  │  ├─ app.e2e-spec.ts
│  │  └─ jest-e2e.json
│  ├─ tsconfig.build.json
│  ├─ tsconfig.json
│  ├─ uploads
│  │  ├─ photos
│  │  └─ temp
│  └─ yarn.lock
├─ docs
│  ├─ backend-architecture.md
│  ├─ coding-convention.md
│  ├─ erd.png
│  ├─ frontend-architecture.md
│  └─ git-branch.png
├─ frontend
│  ├─ eslint.config.js
│  ├─ index.html
│  ├─ package.json
│  ├─ postcss.config.js
│  ├─ public
│  │  └─ vite.svg
│  ├─ src
│  │  ├─ App.css
│  │  ├─ App.tsx
│  │  ├─ assets
│  │  │  └─ logos
│  │  │     └─ react.svg
│  │  ├─ components
│  │  │  ├─ auth
│  │  │  │  └─ Login.tsx
│  │  │  ├─ checklist
│  │  │  │  └─ Checklist.tsx
│  │  │  ├─ feed
│  │  │  │  └─ Feed.tsx
│  │  │  ├─ gallery
│  │  │  │  └─ Gallery.tsx
│  │  │  ├─ layout
│  │  │  │  ├─ Footer.tsx
│  │  │  │  ├─ Header.tsx
│  │  │  │  ├─ Layout.tsx
│  │  │  │  └─ Navigation.tsx
│  │  │  ├─ location
│  │  │  │  └─ Locations.tsx
│  │  │  ├─ movie
│  │  │  │  ├─ MovieDetails.tsx
│  │  │  │  └─ MovieGrid.tsx
│  │  │  ├─ photo
│  │  │  │  ├─ Comment.tsx
│  │  │  │  └─ Photo.tsx
│  │  │  ├─ recommend
│  │  │  │  └─ Recommendations.tsx
│  │  │  ├─ ui
│  │  │  │  ├─ Avatar.tsx
│  │  │  │  ├─ Badge.tsx
│  │  │  │  ├─ Button.tsx
│  │  │  │  ├─ Card.tsx
│  │  │  │  ├─ Input.tsx
│  │  │  │  ├─ Loading.tsx
│  │  │  │  ├─ Modal.tsx
│  │  │  │  └─ SearchBar.tsx
│  │  │  └─ upload
│  │  │     └─ Upload.tsx
│  │  ├─ contexts
│  │  │  ├─ AppContext.tsx
│  │  │  ├─ AuthContext.tsx
│  │  │  └─ ThemeContext.tsx
│  │  ├─ data
│  │  │  └─ mock.tsx
│  │  ├─ hooks
│  │  │  ├─ useCheckList.ts
│  │  │  ├─ useLocalStorage.ts
│  │  │  ├─ useMovies.ts
│  │  │  └─ useUpload.ts
│  │  ├─ index.css
│  │  ├─ main.tsx
│  │  ├─ pages
│  │  │  ├─ auth
│  │  │  │  ├─ Callback.tsx
│  │  │  │  └─ Profile.tsx
│  │  │  ├─ gallery
│  │  │  │  ├─ index.tsx
│  │  │  │  └─ MyGallery.tsx
│  │  │  ├─ home
│  │  │  │  └─ index.tsx
│  │  │  ├─ landing
│  │  │  │  └─ index.tsx
│  │  │  ├─ movies
│  │  │  │  ├─ Detail.tsx
│  │  │  │  └─ index.tsx
│  │  │  ├─ search
│  │  │  │  └─ index.tsx
│  │  │  └─ user
│  │  │     ├─ MyProfile.tsx
│  │  │     └─ Profile.tsx
│  │  ├─ routes
│  │  │  ├─ index.tsx
│  │  │  ├─ PrivateRoute.tsx
│  │  │  └─ ProtectedRoute.tsx
│  │  ├─ theme
│  │  │  ├─ daisyui
│  │  │  │  └─ daisyui
│  │  │  └─ tailwind
│  │  │     └─ tailwind.config.js
│  │  ├─ types
│  │  │  ├─ auth.ts
│  │  │  ├─ common.ts
│  │  │  ├─ content.ts
│  │  │  └─ movie.ts
│  │  ├─ utils
│  │  │  ├─ api.ts
│  │  │  ├─ constants.ts
│  │  │  ├─ database.ts
│  │  │  └─ helpers.ts
│  │  └─ vite-env.d.ts
│  ├─ tailwind.config.js
│  ├─ tsconfig.app.json
│  ├─ tsconfig.json
│  ├─ tsconfig.node.json
│  ├─ vite.config.ts
│  └─ yarn.lock
├─ README.md
└─ references
   ├─ coding-convention(file-structure, name-rule).png
   ├─ meeting-records.png
   ├─ schedules.png
   └─ team introduction.png

```