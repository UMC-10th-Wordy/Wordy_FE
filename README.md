# Wordy FE

UMC 10th Wordy 프로젝트 프론트엔드

## 기술 스택

- React 19 + TypeScript
- Vite
- Tailwind CSS v4

## 시작하기

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 빌드
pnpm build
```

## 환경 변수

`.env.example`을 복사해서 `.env` 파일을 만들어주세요.

```bash
cp .env.example .env
```

## 스크립트

| 명령어            | 설명                    |
| ----------------- | ----------------------- |
| `pnpm dev`        | 개발 서버 실행          |
| `pnpm build`      | 프로덕션 빌드           |
| `pnpm check`      | 포맷팅 + 린트 자동 수정 |
| `pnpm lint`       | 린트 검사               |
| `pnpm format`     | 포맷팅                  |
| `pnpm type-check` | 타입 체크               |
| `pnpm preview`    | 빌드 결과 로컬 미리보기 |

---

## 협업 규칙

### 브랜치 전략

```
main        — 배포 브랜치. 직접 push 금지
develop     — 개발 통합 브랜치
feat/#이슈번호-기능명  — 기능 개발
fix/#이슈번호-버그명   — 버그 수정
```

**예시**

```
feat/#12-login-page
fix/#34-button-style
```

### 커밋 컨벤션

```
타입: 제목
```

| 타입       | 설명                            |
| ---------- | ------------------------------- |
| `feat`     | 새로운 기능                     |
| `fix`      | 버그 수정                       |
| `style`    | UI/스타일 변경 (기능 변화 없음) |
| `refactor` | 리팩토링                        |
| `chore`    | 설정, 패키지 등 기타 변경       |
| `docs`     | 문서 수정                       |
| `test`     | 테스트 추가/수정                |
| `revert`   | 커밋 되돌리기                   |

**예시**

```
feat: 로그인 페이지 구현
fix: 버튼 클릭 시 이벤트 중복 실행 수정
style: 헤더 높이 조정
chore: ESLint 설정 추가
```

> 커밋 형식이 맞지 않으면 자동으로 커밋이 막힙니다.

### PR 규칙

- 브랜치는 반드시 `develop`으로 PR
- PR 제목은 커밋 컨벤션과 동일한 형식
- 이슈 없이 PR 금지 (`closes #이슈번호` 필수)
- 최소 1명 이상 리뷰 승인 후 머지

### 이슈 규칙

- 작업 시작 전 이슈 먼저 생성
- 이슈 제목 형식: `[FEAT] 기능명` / `[BUG] 버그명`
