# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 언어 및 커뮤니케이션 규칙
- 기본 응답 언어: 한국어 / 코드 주석·커밋·문서: 한국어 / 변수·함수명: 영어
- 워크스페이스 전반 안내는 상위 `C:\Users\USER\my-work\CLAUDE.md` 참고.

## 프로젝트 개요
`03.homepage`는 **"아이스크림 프로" — 아이스크림연수원의 B2G(교육청·교육지원청·재단 대상)
위탁연수 영업 랜딩 사이트**다. 벤치마크는 티처빌 프로(teacherville.co.kr/b2g/support/index.edu).
빌드 도구 없이 HTML + CSS + ES 모듈로 동작한다. 요구사항은 `PRD.md` 참고.

## 실행
빌드/테스트 스크립트 없음. ES 모듈이라 `file://` 불가 → **이 폴더를 루트로 정적 서버** 실행.
⚠️ 이 PC는 `python`(스토어 스텁)·`node`가 실제 실행되지 않는다. PowerShell `System.Net.HttpListener`
정적 서버를 써 왔다(과거 포트 8021). 렌더 확인은 `msedge --headless --screenshot`.

## 아키텍처 (여러 파일을 함께 봐야 보이는 큰 그림)

### 컴포넌트
- `index.html`(`#app`) → `src/main.js`가 컴포넌트를 생성해 `appendChild`로 조립.
- 컴포넌트(`src/components/*`)는 **DOM을 반환하는 순수 함수**. 프레임워크 없음.
- 디자인 토큰은 `src/style.css` 상단 `:root` CSS 변수.

### 데이터 계층 — 핵심 (`src/data/api.js`)
- **모든 데이터 접근은 `api.js` 단일 창구**를 통한다. 컴포넌트는 원본(JSON/DB)을 직접 읽지 않고
  `api.js`의 **비동기 함수**(`getCourses`, `getCategories`, `getBanners`, `getRegions`,
  `submitInquiry`, `getInquiries`)만 호출한다. `statusLabels`(표현용 설정)도 여기서 export.
- **현재 구현**: `src/data/*.json`을 `fetch`(경로는 `import.meta.url` 기준)로 읽고 메모리 캐시.
  문의는 `submitInquiry`가 **localStorage**에 저장.
- **이전 목표(PRD 확정)**: **Supabase(PostgreSQL)** 로 이관. `api.js` 내부의 fetch 대상만
  Supabase REST(`/rest/v1/...`, anon key + RLS)로 바꾸면 화면 코드는 그대로다.
  테이블 DDL·RLS·seed는 `supabase/schema.sql`에 준비돼 있다(courses·categories·inquiries).
  이관 시 사용자에게 Project URL + anon public key를 받아 `api.js` 상단 CONFIG에 넣는다.

### 실제 데이터 출처 (중요)
- 과정/분류는 **아이스크림연수원 실제 데이터**다. 사이트가 과정 목록을 불러올 때 쓰는
  내부 API `POST https://teacher.i-scream.co.kr/course/crs/getCrsList.json`
  (data: `searchOrdinalTyCode=TY01&searchOrderField=NEW&pageIndex=1&recordCountPerPage=N`)
  의 응답 `data.crsList`에서 추출했다. 필드 매핑: `crsNm`→title, `credit`("X"=비학점),
  `crsLCodeNm`→분류(디지털역량/인문소양/교수학습/어학/학급경영), `crsCost`→price,
  `crsCode`→상세링크(`/course/crs/creditView.do?crsCode=...`).
- `creditList.do`의 정적 HTML에는 과정이 없다(AJAX로 로드). 메인 페이지는 Incapsula 봇차단·JS렌더링.
- **실시간 자동 동기화는 불가**(브라우저 CORS·봇차단). 최신화는 위 API로 1회 재추출 → JSON/DB 갱신.
- 재추출 시 `jq`/node/python이 없으므로 **PowerShell `ConvertFrom-Json`** 으로 파싱한다.

## 작업 시 유의사항
- import 경로에 **`.js` 확장자 필수**(브라우저 ES 모듈 규칙).
- 과정 카드(`courseCard.js`)는 `course.url`로 **실제 아이스크림 상세 페이지**를 새 탭 링크한다.
- 데이터 스키마를 바꾸면 `courses.json`/`categories.json`, `courseCard.js`, `supabase/schema.sql`을 함께 맞춘다.
