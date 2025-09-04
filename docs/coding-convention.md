# 🧭 코딩 컨벤션

## 0. 🎯 목적

- **가독성 및 일관성**: 누가 작성해도 비슷한 스타일의 코드를 유지
- **효율성**: 코드 리뷰 시간 단축 및 신규 팀원 빠른 적응
- **안정성**: 버그 발생 가능성 최소화 및 유지보수 비용 절감

---

## 1. 🧱 공통

### 1.1. 코딩 스타일

- 들여쓰기: 스페이스 2칸 사용 (탭 금지)
- 세미콜론: 문장 끝에 항상 사용
- 문자열: `'작은따옴표'` 기본, 변수 삽입 시 `템플릿 리터럴`
- 변수 선언: `const` 기본, 재할당 시 `let` 사용 (`var` 금지)
- 동등 비교: `===`, `!==` 사용
- Nullish 연산자: `??` 권장, `||`는 논리적 OR일 때만 사용

### 1.2. 네이밍 컨벤션

| 항목                 | 규칙                                         | 예시                               |
| -------------------- | -------------------------------------------- | ---------------------------------- |
| 변수/함수            | `camelCase`                                  | `userProfile` ⭕ / `uProf` ❌      |
| 불리언               | `is`, `has`, `can`, `should` 접두어          | `isLoggedIn`, `hasPermission`      |
| 타입/클래스/컴포넌트 | `PascalCase`                                 | `UserInfo`, `ApiService`           |
| 전역 상수            | `SCREAMING_SNAKE_CASE`                       | `MAX_REQUEST_COUNT`                |
| 폴더/파일            | `kebab-case` (React 컴포넌트는 `PascalCase`) | `user-service/`, `UserProfile.tsx` |
| NestJS 파일          | 접미사 명확히                                | `*.controller.ts`, `*.dto.ts` 등   |

### 1.3. 주석 및 문서화

- "무엇"이 아닌 "왜"를 설명
- JSDoc: 공용 함수/API/DTO에 타입 및 설명 명시

---

## 2. 🎨 프론트엔드 (React + TypeScript + TailwindCSS)

### 2.1. 컴포넌트 작성 규칙

- 함수형 컴포넌트 사용
- Props 타입 명확히 정의, 선택적 prop 구분
- 이벤트 핸들러는 `handle` 접두어 사용 (`handleClick`)
- 리스트 렌더링 시 `index` 대신 고유 `id`를 `key`로 사용
- 접근성 고려: 시맨틱 태그 사용, `<img>`에는 `alt` 필수

### 2.2. 상태 관리

- 파생 상태 금지: 서버 데이터를 그대로 `useState`에 저장 ❌
- useEffect 의존성 배열: 명확하게 관리

### 2.3. 스타일링 (TailwindCSS)

- 인라인 스타일 지양: `style={{ color: 'red' }}` ❌
- 반복 클래스는 컴포넌트화 또는 `clsx`, `tailwind-merge` 활용

---

## 3. ⚙️ 백엔드 (NestJS + TypeScript)

### 3.1. 핵심 컨벤션

- DI: `private readonly` 생성자 주입
- DTO: 목적 명확히 (`CreateUserDto`, `UpdateUserDto`)
- 유효성 검사: `class-validator`, `ValidationPipe` 사용
- 예외 처리: `HttpException`, 전역 필터로 일관된 응답 유지
- API 문서화: Swagger(OpenAPI)로 자동 생성 및 최신 유지

### 3.2. 데이터베이스 (TypeORM/Prisma)

- 테이블/컬럼: `snake_case` 사용 (`user_profiles`, `created_at`)
- 공통 컬럼: `id`, `created_at`, `updated_at` 포함 권장
- 마이그레이션: 반드시 파일로 관리

### 3.3. API 규약

- 버전 관리: `/api/v1` 형식
- RESTful 원칙: 복수 명사 + HTTP 메서드 (`GET /users`)
- 응답 형식: `{ data: T }` 또는 `{ data: T, meta: { ... } }`

---

## 4. 🚀 워크플로우 (Git)

### 4.1. 브랜치 전략

- 브랜치 이름: 목적 명확히 (`feature/`, `fix/`, `refactor/`)
- 예시: `feature/login-page`, `fix/user-auth-bug`

### 4.2. 커밋 메시지

- Conventional Commits 형식: `type(scope): subject`

| 타입       | 설명                      |
| ---------- | ------------------------- |
| `feat`     | 새로운 기능 추가          |
| `fix`      | 버그 수정                 |
| `docs`     | 문서 변경                 |
| `style`    | 코드 스타일 수정          |
| `refactor` | 기능 변경 없는 리팩토링   |
| `test`     | 테스트 코드 관련          |
| `chore`    | 빌드, 패키지 등 기타 변경 |
