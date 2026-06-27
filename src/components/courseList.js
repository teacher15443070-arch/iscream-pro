// 위탁연수 과정 목록 컴포넌트.
// 필터를 분야/시간/대상 "가로 탭"으로 배치. 탭을 누르면 해당 항목 칩이 아래에 표시되고,
// 선택은 탭별로 함께(AND) 적용된다. 데이터는 구글 시트(api)에서 온다.

import {
  getCourses,
  getCategories,
  getHoursOptions,
  getTargets,
} from "../data/api.js";
import { CourseCard } from "./courseCard.js";

const PAGE = 24; // 한 번에 보여줄 카드 수

export function CourseList() {
  const section = document.createElement("section");
  section.className = "section";
  section.id = "courses";

  const head = document.createElement("div");
  head.className = "section__head";
  head.innerHTML = `
    <h2 class="section__title">아이스크림연수원 연수 과정</h2>
    <p class="section__desc">구글 시트로 관리되는 실제 과정 데이터입니다. (탭으로 분야·시간·대상을 좁혀 보세요)</p>
  `;
  section.appendChild(head);

  // 필터: 가로 탭 + 그 아래 칩
  const filters = document.createElement("div");
  filters.className = "filters";
  const tabsEl = document.createElement("div");
  tabsEl.className = "filter-tabs";
  const chipsEl = document.createElement("div");
  chipsEl.className = "filter-chips";
  filters.append(tabsEl, chipsEl);
  section.appendChild(filters);

  const grid = document.createElement("div");
  grid.className = "course-grid";
  section.appendChild(grid);

  const more = document.createElement("div");
  more.className = "course-more";
  section.appendChild(more);

  const facet = { category: null, hours: null, target: null }; // 선택된 필터
  const opts = { category: [], hours: [], target: [] }; // 각 탭의 선택지
  let tabs = []; // 표시할 탭 목록
  let activeTab = "category";
  let shown = PAGE;
  let current = [];

  // 탭바 렌더(선택된 필터가 있으면 점으로 표시).
  function renderTabs() {
    tabsEl.innerHTML = "";
    tabs.forEach((t) => {
      const btn = document.createElement("button");
      btn.className =
        "filter-tab" +
        (t.key === activeTab ? " filter-tab--active" : "") +
        (facet[t.key] ? " filter-tab--has" : "");
      btn.textContent = t.label;
      btn.addEventListener("click", () => {
        activeTab = t.key;
        renderTabs();
        renderChips();
      });
      tabsEl.appendChild(btn);
    });
  }

  // 현재 탭의 칩 렌더.
  function renderChips() {
    chipsEl.innerHTML = "";
    const list = [{ key: null, label: "전체" }, ...opts[activeTab]];
    list.forEach((o) => {
      const chip = document.createElement("button");
      chip.className =
        "filter-chip" + (facet[activeTab] === o.key ? " filter-chip--active" : "");
      chip.textContent = o.label;
      chip.addEventListener("click", () => {
        facet[activeTab] = o.key;
        renderTabs();
        renderChips();
        load();
      });
      chipsEl.appendChild(chip);
    });
  }

  // 카드 그리드 + 더보기.
  function paint() {
    grid.innerHTML = "";
    if (current.length === 0) {
      grid.innerHTML = `<p class="section__desc">조건에 맞는 과정이 없습니다.</p>`;
      more.innerHTML = "";
      return;
    }
    current.slice(0, shown).forEach((c) => grid.appendChild(CourseCard(c)));
    const visible = Math.min(shown, current.length);
    more.innerHTML = `<p class="course-more__count">전체 ${current.length}개 중 ${visible}개 표시</p>`;
    if (shown < current.length) {
      const btn = document.createElement("button");
      btn.className = "btn btn--ghost";
      btn.textContent = "더보기";
      btn.addEventListener("click", () => {
        shown += PAGE;
        paint();
      });
      more.appendChild(btn);
    }
  }

  // 현재 필터로 데이터 로드.
  async function load() {
    const f = {};
    if (facet.category) f.category = facet.category;
    if (facet.hours) f.hours = facet.hours;
    if (facet.target) f.target = facet.target;
    current = await getCourses(f);
    shown = PAGE;
    paint();
  }

  // 탭/선택지 초기화.
  async function initFilters() {
    const [cats, hours, targets] = await Promise.all([
      getCategories(),
      getHoursOptions(),
      getTargets(),
    ]);
    opts.category = cats.map((c) => ({ key: c.key, label: c.label }));
    opts.hours = hours.map((h) => ({ key: h, label: h }));
    opts.target = targets.map((t) => ({ key: t, label: t }));
    tabs = [
      { key: "category", label: "분야" },
      { key: "hours", label: "시간" },
    ];
    // '연수대상' 열이 있을 때만 대상 탭 추가.
    if (targets.length) tabs.push({ key: "target", label: "대상" });
    renderTabs();
    renderChips();
  }

  initFilters();
  load();
  return section;
}
