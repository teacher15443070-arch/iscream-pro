// 관리자 페이지 진입점. 탭(문의 관리 / 과정 관리) 전환.

import { InquiryTable } from "./inquiryTable.js";
import { CourseManager } from "./courseManager.js";

const root = document.getElementById("admin");

const TABS = [
  { key: "inquiry", label: "문의 관리", render: InquiryTable },
  { key: "course", label: "과정 관리", render: CourseManager },
];

// 초기 탭: URL 해시(#course 등)가 있으면 그 탭으로.
let current = TABS.some((t) => t.key === location.hash.slice(1))
  ? location.hash.slice(1)
  : "inquiry";

// 헤더
const header = document.createElement("header");
header.className = "admin-header";
header.innerHTML = `
  <div class="admin-header__inner">
    <h1>🍦 아이스크림 프로 <span>관리자</span></h1>
    <a class="btn btn--ghost btn--sm" href="index.html">← 홈페이지 보기</a>
  </div>
`;

// 탭바
const tabbar = document.createElement("nav");
tabbar.className = "admin-tabs";

// 콘텐츠 영역
const content = document.createElement("div");
content.className = "admin-content container";

function renderTabs() {
  tabbar.innerHTML = "";
  TABS.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "admin-tab" + (t.key === current ? " admin-tab--active" : "");
    btn.textContent = t.label;
    btn.addEventListener("click", () => {
      current = t.key;
      location.hash = t.key;
      renderTabs();
      renderContent();
    });
    tabbar.appendChild(btn);
  });
}

function renderContent() {
  content.innerHTML = "";
  const tab = TABS.find((t) => t.key === current);
  content.appendChild(tab.render());
}

const tabWrap = document.createElement("div");
tabWrap.className = "container";
tabWrap.appendChild(tabbar);

root.append(header, tabWrap, content);
renderTabs();
renderContent();
