# Somniverse Frontend (React + TypeScript)

> 백엔드: `wgrgwg/somniverse-backend` dev 브랜치 API 명세 기반  
> BASE URL: `.env`의 `VITE_API_BASE_URL="http://localhost:8080/api"`

## 기술 스택

- React, TypeScript, Vite
- axios (+ 인터셉터로 토큰 자동첨부/재발급)
- @tanstack/react-query (데이터 캐싱/로딩/에러 표준화)
- TailwindCSS + DaisyUI (UI)

## 라우팅 개요

- `/` 공개 꿈 목록 (`GET /api/dreams`)
- `/login`, `/signup`, `/oauth2/redirect`
- 보호 라우트(로그인 필요):
    - `/me` 내정보
    - `/dreams/me` 내 꿈 목록 (`GET /api/dreams/me`)
    - `/dreams/new`, `/dreams/:id`, `/dreams/:id/edit`
- 관리자 전용:
    - `/admin/dreams` 전체 꿈 목록 (`GET /api/admin/dreams`)
    - `/admin/members`, `/admin/members/:id`

## 인증/권한

- 로그인: `POST /api/auth/tokens` → accessToken 저장, refresh는 HttpOnly 쿠키
- 인터셉터: 401 발생 시 `PUT /api/auth/tokens`로 재발급, 실패 시 로그아웃
- 상단바:
    - 항상 `꿈일기`
    - 로그인 시 `내정보`
    - ADMIN 시 `회원관리`

## UI 가이드

- DaisyUI 컴포넌트 조합: `card`, `btn`, `input`, `textarea`, `table`, `toggle`, `alert`, `loading` 등
- `components/`의 재사용 컴포넌트를 우선 사용해 중복 최소화