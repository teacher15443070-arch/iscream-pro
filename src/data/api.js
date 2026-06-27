// 데이터 접근 통로(단일 창구).
//
// 과정·분류: 구글 시트(공개 CSV)에서 라이브로 읽는다. (DB 역할)
//   시트에서 수정 → 사이트 새로고침이면 반영된다.
// 배너·지역: 정적 JSON.
// 문의: localStorage(쓰기). 구글 시트는 쓰기가 어려워 문의는 브라우저 저장 유지.

const url = (file) => new URL(`./${file}`, import.meta.url);

// === 구글 시트 (과정 DB) ===
// gviz CSV 엔드포인트: 브라우저 fetch 시 Google이 요청 Origin을 CORS 허용한다.
const SHEET_CSV_URL =
  "https://docs.google.com/spreadsheets/d/19RPFtiW2noMceUO3C0_IhNdJ_nJ9rIYNOCXXK5ziG4Q/gviz/tq?tqx=out:csv&gid=2076903071";

// 분류별 아이콘 (시트의 '카테고리' 한글값 → 아이콘).
const CATEGORY_ICONS = {
  인문소양: "📖",
  교수학습: "📚",
  디지털역량: "🤖",
  어학: "🗣️",
  생활교육: "🌱",
  교육정책: "🏛️",
  학급경영: "🏫",
  진로진학: "🧭",
  학교행정: "📋",
};

// 간단한 CSV 파서(따옴표·콤마·줄바꿈 처리).
function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\r") {
      /* 무시 */
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  if (field.length || row.length) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// 시트를 받아 과정 객체 배열로 변환(메모리 캐시).
let sheetCache = null;
async function fetchSheetRows() {
  if (sheetCache) return sheetCache;
  const res = await fetch(SHEET_CSV_URL);
  if (!res.ok) throw new Error(`구글 시트 로드 실패: ${res.status}`);
  const rows = parseCsv(await res.text());
  const header = rows[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  const c = {
    num: idx("순번"),
    hours: idx("시간/차시"),
    credit: idx("학점"),
    cat: idx("카테고리"),
    title: idx("과정명"),
    teacher: idx("강사명"),
    // 연수대상 열은 선택사항(시트에 추가하면 자동 인식). 띄어쓰기 변형도 허용.
    target: idx("연수대상") >= 0 ? idx("연수대상") : idx("연수 대상"),
    url: idx("URL"),
  };
  const val = (r, i) => (i >= 0 && r[i] != null ? r[i].trim() : "");
  sheetCache = rows
    .slice(1)
    .filter((r) => val(r, c.title))
    .map((r, i) => ({
      id: Number(val(r, c.num)) || i + 1,
      title: val(r, c.title),
      credit: val(r, c.credit),
      category: val(r, c.cat),
      categoryName: val(r, c.cat),
      teacher: val(r, c.teacher),
      hours: val(r, c.hours),
      target: val(r, c.target),
      url: val(r, c.url),
      status: "open",
    }));
  return sheetCache;
}

// 과정 목록 조회(분야/상태 필터).
export async function getCourses(filter = {}) {
  let result = [...(await fetchSheetRows())];
  if (filter.category) result = result.filter((c) => c.category === filter.category);
  if (filter.hours) result = result.filter((c) => c.hours === filter.hours);
  if (filter.target) result = result.filter((c) => c.target === filter.target);
  if (filter.status) result = result.filter((c) => c.status === filter.status);
  return result;
}

// 분류 조회: 시트의 '카테고리'에서 등장순으로 고유값 추출 + 아이콘.
export async function getCategories() {
  const rows = await fetchSheetRows();
  const seen = [];
  for (const r of rows) if (r.category && !seen.includes(r.category)) seen.push(r.category);
  return seen.map((c) => ({ key: c, label: c, icon: CATEGORY_ICONS[c] || "📌" }));
}

// 시간(시간/차시) 옵션: 고유값 + 보기 좋은 순서로 정렬.
const HOURS_ORDER = ["15시간 이하", "15시간", "30시간", "60시간"];
export async function getHoursOptions() {
  const rows = await fetchSheetRows();
  const seen = [];
  for (const r of rows) if (r.hours && !seen.includes(r.hours)) seen.push(r.hours);
  return seen.sort((a, b) => {
    const ia = HOURS_ORDER.indexOf(a);
    const ib = HOURS_ORDER.indexOf(b);
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib);
  });
}

// 연수대상 옵션: 시트에 '연수대상' 열이 있으면 고유값 목록(없으면 빈 배열).
export async function getTargets() {
  const rows = await fetchSheetRows();
  const seen = [];
  for (const r of rows) if (r.target && !seen.includes(r.target)) seen.push(r.target);
  return seen;
}

// === 정적 JSON ===
export async function getBanners() {
  const res = await fetch(url("banners.json"));
  return res.json();
}
export async function getRegions() {
  const res = await fetch(url("regions.json"));
  return res.json();
}

// === 문의 (localStorage) ===
const INQUIRY_KEY = "iscream_pro_inquiries";

export async function getInquiries() {
  try {
    return JSON.parse(localStorage.getItem(INQUIRY_KEY)) || [];
  } catch {
    return [];
  }
}
export async function submitInquiry(payload) {
  const list = await getInquiries();
  const record = {
    id: Date.now(),
    createdAt: new Date().toISOString(),
    status: "new",
    ...payload,
  };
  list.push(record);
  localStorage.setItem(INQUIRY_KEY, JSON.stringify(list));
  return { ok: true, message: "문의가 정상적으로 접수되었습니다." };
}
export async function updateInquiry(id, patch) {
  const list = await getInquiries();
  const i = list.findIndex((r) => r.id === id);
  if (i === -1) return null;
  list[i] = { ...list[i], ...patch };
  localStorage.setItem(INQUIRY_KEY, JSON.stringify(list));
  return list[i];
}
export async function deleteInquiry(id) {
  const list = await getInquiries();
  localStorage.setItem(INQUIRY_KEY, JSON.stringify(list.filter((r) => r.id !== id)));
}

// 라벨.
export const statusLabels = {
  upcoming: { text: "예정", tone: "upcoming" },
  open: { text: "모집중", tone: "open" },
  closed: { text: "신청마감", tone: "closed" },
};
export const inquiryStatusLabels = { new: "접수", done: "처리완료" };

// 시트 편집 주소(관리자에서 안내용).
export const SHEET_EDIT_URL =
  "https://docs.google.com/spreadsheets/d/19RPFtiW2noMceUO3C0_IhNdJ_nJ9rIYNOCXXK5ziG4Q/edit";
