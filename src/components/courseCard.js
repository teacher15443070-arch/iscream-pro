// 연수 과정 카드 컴포넌트. 구글 시트의 과정 1건을 받아 카드 DOM을 반환한다.
// 필드: title(과정명), credit(학점), categoryName(카테고리), teacher(강사명), hours(시간/차시)

import { statusLabels } from "../data/api.js";

// HTML 이스케이프.
function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function CourseCard(course) {
  const card = document.createElement("article");
  card.className = "course-card";

  const status = statusLabels[course.status] || statusLabels.open;
  const credit = course.credit || "비학점";

  // 강사·시간은 있을 때만 표시.
  const teacher = course.teacher ? `<span>👤 ${esc(course.teacher)}</span>` : "";
  const hours = course.hours ? `<span>⏱ ${esc(course.hours)}</span>` : "";

  // URL이 있으면 과정명을 새 창 링크로, 없으면 일반 텍스트로.
  const titleHtml = course.url
    ? `<a href="${esc(course.url)}" target="_blank" rel="noopener">${esc(course.title)}</a>`
    : esc(course.title);

  card.innerHTML = `
    <div class="course-card__top">
      <span class="course-card__agency">${esc(course.categoryName)}</span>
      <span class="badge badge--${status.tone}">${status.text}</span>
    </div>
    <h3 class="course-card__title">${titleHtml}</h3>
    <div class="course-card__meta">
      <span>📘 ${esc(credit)}</span>
      ${teacher}
      ${hours}
    </div>
  `;

  return card;
}
