// 위탁연수 과정 목록 컴포넌트.
// 상단에 분야 필터 칩, 아래에 과정 카드 그리드(+더보기)를 렌더링한다.
// 데이터는 구글 시트(api.getCourses/getCategories)에서 온다.

import { getCourses, getCategories } from "../data/api.js";
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
    <p class="section__desc">구글 시트로 관리되는 실제 과정 데이터입니다. (분야로 좁혀 보세요)</p>
  `;
  section.appendChild(head);

  const filters = document.createElement("div");
  filters.className = "filters";
  section.appendChild(filters);

  const grid = document.createElement("div");
  grid.className = "course-grid";
  section.appendChild(grid);

  // 더보기 영역(카운트 + 버튼)
  const more = document.createElement("div");
  more.className = "course-more";
  section.appendChild(more);

  let activeCategory = null; // null = 전체
  let shown = PAGE;
  let current = []; // 현재 필터된 전체 목록

  // 현재 상태로 그리드/더보기 다시 그리기.
  const paint = () => {
    grid.innerHTML = "";
    if (current.length === 0) {
      grid.innerHTML = `<p class="section__desc">해당 분야의 과정이 없습니다.</p>`;
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
  };

  // 데이터 로드 후 그리기.
  const load = async () => {
    current = await getCourses(activeCategory ? { category: activeCategory } : {});
    shown = PAGE;
    paint();
  };

  // 필터 칩 구성.
  getCategories().then((categories) => {
    const all = [{ key: null, label: "전체" }, ...categories];
    all.forEach((cat) => {
      const chip = document.createElement("button");
      chip.className =
        "filter-chip" + (cat.key === activeCategory ? " filter-chip--active" : "");
      chip.textContent = cat.label;
      chip.addEventListener("click", () => {
        activeCategory = cat.key;
        filters
          .querySelectorAll(".filter-chip")
          .forEach((c) => c.classList.remove("filter-chip--active"));
        chip.classList.add("filter-chip--active");
        load();
      });
      filters.appendChild(chip);
    });
  });

  load();
  return section;
}
