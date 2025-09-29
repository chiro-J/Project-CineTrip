<img width="3262" height="800" alt="image" src="https://github.com/user-attachments/assets/813c2753-09a3-4e94-a10e-f4ac88879a60" />

## _장면과 여행, 그리고 세상을 엮다_

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

## 💡 주요 기능 설명

👤 사용자 인증 및 프로필 관리

- 1.1 프로필 관리
  - 사용자 정보: username, email, profile_image_url, bio
  - 팔로우 시스템: 팔로워/팔로잉 카운트 관리
  - 프로필 수정: 개인정보 업데이트 기능

🎥 영화 검색 및 북마크 시스템

- 2.1 영화 검색
  - TMDB API 연동으로 영화 정보 조회
  - 영화 포스터, 제목, 평점, 개봉일 등 상세 정보
  - 실시간 검색 및 필터링
- 2.2 영화 북마크
  - 개인 북마크: 관심 영화 저장/삭제
  - 북마크 목록: 사용자별 북마크된 영화 관리
  - 즉시 동기화: 실시간 북마크 상태 업데이트
- 2.3 영화 상세 페이지
  - 영화 정보: TMDB API 데이터 표시
  - 촬영지 정보: LLM 기반 촬영지 5개 추천
  - 사용자 사진: 해당 영화 관련 업로드된 사진들
  - 북마크 토글: 즉시 북마크 추가/제거

📍 위치 및 촬영지 관리

- 3.1 촬영지 정보 생성
  - LLM 기반 촬영지 추출: 영화별 주요 촬영지 5개 자동 생성
  - 위치 데이터: 위도/경도, 주소, 국가, 도시 정보
  - 장면 설명: 해당 장소에서 촬영된 영화 장면 설명

✅ LLM 기반 체크리스트 생성

- 4.1 여행 체크리스트 생성
  - 개인화된 체크리스트: 영화와 여행 일정 기반 맞춤 체크리스트
  - 카테고리별 분류: 준비물, 장소, 활동 등으로 분류
  - 완료 상태 관리: 체크리스트 항목 완료/미완료 토글

📷 사진 업로드 및 갤러리 시스템

- 5.1 사진 업로드
  - AWS S3 연동: 클라우드 스토리지에 이미지 저장
  - 이미지 압축: 업로드 전 이미지 최적화
  - 다단계 업로드: 사진 선택 → 위치 설정 → 영화 연결 → 업로드
- 5.2 갤러리 관리
  - 개인 갤러리: 내가 업로드한 사진들
  - 공개 갤러리: 다른 사용자들의 사진들
  - 탭별 분류: Photos, Movies, Bookmarks 탭으로 구분
- 5.3 사진 상세 정보
  - 메타데이터: 제목, 설명, 위치, 업로드일
  - 영화 연결: 관련 영화 정보 표시
  - 작성자 정보: 업로드한 사용자 정보

💬 소셜 기능 (팔로우, 좋아요, 댓글)

- 6.1 팔로우 시스템
  - 팔로우/언팔로우: 다른 사용자 팔로우 토글
  - 팔로워/팔로잉 카운트: 실시간 카운트 업데이트
  - 팔로우 상태 확인: 현재 팔로우 여부 확인
- 6.2 좋아요 시스템
  - 게시물 좋아요: 사진에 좋아요 토글
  - 좋아요 카운트: 실시간 좋아요 수 표시
  - 중복 방지: 한 사용자당 한 번만 좋아요 가능
- 6.3 댓글 시스템
  - 댓글 작성: 게시물에 댓글 추가
  - 댓글 조회: 게시물별 댓글 목록 표시
  - 댓글 삭제: 본인 댓글 삭제 가능

---

## ⚙️ 사용 기술 스택

| 분류         | 기술명                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 프론트엔드   | <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/TailwindCSS-1572B6?style=flat-square&logo=tailwindcss&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" style="border-radius:10px"> <img src="https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black" style="border-radius:10px"> |
| 백엔드       | <img src="https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/Nest.js-E0234E?style=flat-square&logo=nestjs&logoColor=white" style="border-radius:10px">                                                                                                                                                                                                                                                                                                                                                                                                                  |
| 인프라       | <img src="https://img.shields.io/badge/Amazon%20EC2-FF9900?style=flat-square&logo=Amazon%20EC2&logoColor=white"> <img src="https://img.shields.io/badge/Amazon%20S3-569A31?style=flat-square&logo=Amazon%20S3&logoColor=white"> <img src="https://img.shields.io/badge/CloudFront-80247B?style=flat-square&logo=Amazon%20S3&logoColor=white">                                                                                                                                                                                                                                                                                                                                         |
| 커뮤니케이션 | <img src="https://img.shields.io/badge/Discord-5865F2?style=flat-square&logo=discord&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/Notion-000000?style=flat-square&logo=notion&logoColor=white" style="border-radius:10px">                                                                                                                                                                                                                                                                                                                                                                                                                     |
| 기타         | <img src="https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/Google%20Drive-4285F4?style=flat-square&logo=googledrive&logoColor=white" style="border-radius:10px"> <img src="https://img.shields.io/badge/Google%20Sheets-34A853?style=flat-square&logo=googlesheets&logoColor=white" style="border-radius:10px">                                                                                                                                 |

---

## 🧱 프로젝트 구조

### Frontend

[프론트엔드 아키텍처](./docs/frontend-architecture.md)

### Backend

[백엔드 아키텍처](./docs/backend-architecture.md)

---

## 🚀 시작하기 (Getting Started)

Prerequisites

- Node.js (v18.x 이상)
- Yarn
- MySQL

Frontend

```
Bash

# Frontend 디렉토리로 이동
$ cd frontend

# 의존성 설치
$ yarn install

# 개발 서버 실행
$ yarn dev
```

Backend

```
Bash

# Backend 디렉토리로 이동

$ cd backend

# 의존성 설치
$ yarn install

# .env 파일 설정 (DB 정보, JWT 시크릿 등)
$ cp .env.example .env

# 개발 서버 실행
$ yarn start:dev
이제 브라우저에서 http://localhost:5173 (Frontend)으로 접속하여 CineTrip을 만나보세요!
```

---

## 🖼️ 데모 화면

### ✅ 메인화면

<details>
<summary>메인 피드</summary>

## 메인 피드입니다.

<img width="1824" height="1792" alt="image" src="https://github.com/user-attachments/assets/a0fbf36b-32e8-407d-96a1-7e5544510a8d" />
</details>

<details>
<summary>갤러리 페이지</summary>

## 갤러리 페이지입니다.

<img width="1824" height="668" alt="image" src="https://github.com/user-attachments/assets/d0192722-542c-4a61-9ed5-ea6f5ef54ad0" />
</details>

<details>
<summary>영화 검색 페이지</summary>

## 영화 검색 페이지입니다.

<img width="1824" height="3792" alt="image" src="https://github.com/user-attachments/assets/5be01ca0-7f6c-41dd-833b-b7bc0ab33e99" />

</details>

<details>
<summary>내 Profile 페이지</summary>

## 내 Profile 페이지입니다.

<img width="1824" height="4148" alt="image" src="https://github.com/user-attachments/assets/12939295-d90f-4978-8ce4-6c6e752a52df" />

</details>

<details>
<summary>다른사용자 Profile 페이지</summary>

## 다른 사용자 Profile 페이지입니다.

<img width="1824" height="1480" alt="image" src="https://github.com/user-attachments/assets/7de9c6db-8735-4a23-9396-5ba631469e1e" />

</details>

<details>
<summary>사용자 정보 수정 페이지</summary>

## 사용자 정보 수정 페이지입니다.

<img width="2824" height="2030" alt="image" src="https://github.com/user-attachments/assets/686048fc-8a0c-42de-b1cb-037fa66e6e60" />
</details>
---
<br><br><br>

# 📜 문서자료

[코딩 컨벤션](./docs/coding-convention.md)

[팀프로젝트 드라이브](https://drive.google.com/drive/folders/1d_BWiEdW2WFQr20Z-tjzqK8EcEafP2Ih?usp=sharing)

[화면설계서](https://www.figma.com/design/yNXL7zAFWojHc7Ltbbd2TA/%EC%8B%9C%EB%84%A4%ED%8A%B8%EB%A6%BD-%ED%99%94%EB%A9%B4%EC%84%A4%EA%B3%84%EC%84%9C?node-id=0-1&p=f&t=hPUxnlU5IGaXRypg-0)

[WBS](https://docs.google.com/spreadsheets/d/10xFtgunZDW_-YtESeNXM0pqH3nmljE8b/edit?usp=sharing&ouid=117370317488578441607&rtpof=true&sd=true)

[회의록](https://www.notion.so/Project-CineTrip-feat-Team-PopcornMate-261fff2fd51580ba81ddf96f85d5e5fc?source=copy_link)
