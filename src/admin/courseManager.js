// 관리자 - 과정 관리 컴포넌트 (읽기 전용).
// 과정 데이터는 구글 시트에서 관리하므로, 여기서는 시트 내용을 확인하고
// 편집은 구글 시트로 이동하도록 안내한다.

import { getCourses, SHEET_EDIT_URL, statusLabels } from "../data/api.js";

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function CourseManager() {
  const section = document.createElement("section");
  section.className = "admin-panel";

  async function render() {
    const list = await getCourses();
    section.innerHTML = `
      <div class="admin-panel__head">
        <h2>과정 관리</h2>
        <span class="admin-count">전체 ${list.length}개 · 구글 시트 연동</span>
      </div>
      <div class="admin-note">
        과정 데이터는 <b>구글 시트</b>에서 관리됩니다. 추가·수정·삭제는 시트에서 하세요.
        <a class="btn btn--primary btn--sm" href="${SHEET_EDIT_URL}" target="_blank" rel="noopener">구글 시트 열기 ↗</a>
      </div>
    `;

    const table = document.createElement("table");
    table.className = "admin-table";
    table.innerHTML = `
      <thead>
        <tr><th>과정명</th><th>분류</th><th>학점</th><th>강사</th><th>상태</th></tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");
    list.forEach((c) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="cell-title">${esc(c.title)}</td>
        <td>${esc(c.categoryName)}</td>
        <td>${esc(c.credit) || "-"}</td>
        <td>${esc(c.teacher) || "-"}</td>
        <td>${statusLabels[c.status]?.text || c.status}</td>
      `;
      tbody.appendChild(tr);
    });
    section.appendChild(table);
  }

  render();
  return section;
}
