# 코딩 컨벤션

## Frontend

- Framework: `React`
- Language: `Typescript`
- Styling: `TailwindCSS`

1. 변수 선언

- `const`: 기본 사용.
- `let`: 기본적으로 지양, 필요할 경우에만 사용.
- `var`: 절대 사용 금지.

2. 네이밍 규칙
   a. 변수명

   - `camelCase` 사용
   - 축약어 지양 → `res` ❌, `result` ✅
   - Boolean은 `is`, `has`, `can` 등 명확한 접두어 사용

   b. 이벤트 핸들러

   - `handle` 접두어 사용

3. 함수 선언

- 화살표 함수 (`const FC = () => {}`) 우선 사용
- camelCase 사용
- 해당 함수가 무슨 기능을 하는 지 한 줄로 정리해서 주석으로 달아 놓기

4. 컴포넌트 작성

- 함수형 컴포넌트 사용
- 파일명은 PascalCase (`NavBar.tsx`)
- 컴포넌트 하나에 과도한 함수 사용 금지
- 각 컴포넌트 별로 어떤 기능을 하는 지 문서화 필요

5. 스타일

6. 기타

- 코드 정리는 Prettier로 자동화
- 불필요한 주석, 콘솔 로그 제거 후 커밋.

## Backend
