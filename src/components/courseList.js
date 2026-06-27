// 위탁연수 과정 목록 컴포넌트.
// 필터를 분야 / 시간 / 대상 세 줄로 동시에 표시하고, 함께(AND) 적용한다.
// 데이터는 구글 시트(api)에서 온다.

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
    <p class="section__desc">구글 시트로 관리되는 실제 과정 데이터입니다. (분야·시간·대상으로 좁혀 보세요)</p>
  `;
  section.appendChild(head);

  const filters = document.createElement("div");
  filters.className = "filters";
  section.appendChild(filters);

  const grid = document.createElement("div");
  grid.className = "course-grid";
  section.appendChild(grid);

  const more = document.createElement("div");
  more.className = "course-more";
  section.appendChild(more);

  const facet = { category: null, hours: null, target: null };
  let shown = PAGE;
  let current = [];

  // 한 줄(라벨 + 칩들) 생성.
  function buildGroup(label, key, options) {
    const wrap = document.createElement("div");
    wrap.className = "filter-group";
    const lab = document.createElement("span");
    lab.className = "filter-group__label";
    lab.textContent = label;
    wrap.appendChild(lab);
    [{ key: null, label: "전체" }, ...options].forEach((o) => {
      const chip = document.createElement("button");
      chip.className =
        "filter-chip" + (facet[key] === o.key ? " filter-chip--active" : "");
      chip.textContent = o.label;
      chip.addEventListener("click", () => {
        facet[key] = o.key;
        renderFilters();
        load();
      });
      wrap.appendChild(chip);
    });
    return wrap;
  }

  // 필터 세 줄 다시 그리기.
  async function renderFilters() {
    const [cats, hours, targets] = await Promise.all([
      getCategories(),
      getHoursOptions(),
      getTargets(),
    ]);
    filters.innerHTML = "";
    filters.appendChild(
      buildGroup("분야", "category", cats.map((c) => ({ key: c.key, label: c.label })))
    );
    filters.appendChild(
      buildGroup("시간", "hours", hours.map((h) => ({ key: h, label: h })))
    );
    // '연수대상' 열이 있을 때만 대상 줄 표시.
    if (targets.length) {
      filters.appendChild(
        buildGroup("대상", "target", targets.map((t) => ({ key: t, label: t })))
      );
    }
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

  renderFilters();
  load();
  return section;
}
