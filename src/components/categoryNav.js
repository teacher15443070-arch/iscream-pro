// 담당분야별 분류 탐색 컴포넌트.

import { getCategories } from "../data/api.js";

export function CategoryNav() {
  const wrap = document.createElement("section");
  wrap.className = "category-nav";
  wrap.id = "categories";

  const inner = document.createElement("div");
  inner.className = "container section";

  const head = document.createElement("div");
  head.className = "section__head";
  head.innerHTML = `
    <h2 class="section__title">담당분야별 과정 찾기</h2>
    <p class="section__desc">관심 분야를 선택하면 관련 위탁연수 과정을 모아 볼 수 있습니다.</p>
  `;

  const grid = document.createElement("div");
  grid.className = "category-grid";

  getCategories().then((categories) => {
    categories.forEach((cat) => {
      const item = document.createElement("a");
      item.className = "category-item";
      item.href = "#courses";
      item.innerHTML = `
        <span class="category-item__icon">${cat.icon}</span>
        <span class="category-item__label">${cat.label}</span>
      `;
      grid.appendChild(item);
    });
  });

  inner.append(head, grid);
  wrap.appendChild(inner);
  return wrap;
}
