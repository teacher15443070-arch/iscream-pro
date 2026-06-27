// 관리자 - 문의 관리 컴포넌트. 접수 문의 목록 조회·상태변경·삭제.

import {
  getInquiries,
  updateInquiry,
  deleteInquiry,
  inquiryStatusLabels,
} from "../data/api.js";

export function InquiryTable() {
  const section = document.createElement("section");
  section.className = "admin-panel";

  async function render() {
    const list = (await getInquiries()).slice().sort((a, b) => b.id - a.id);
    const newCount = list.filter((r) => r.status === "new").length;

    section.innerHTML = `
      <div class="admin-panel__head">
        <h2>문의 관리</h2>
        <span class="admin-count">전체 ${list.length}건 · 미처리 ${newCount}건</span>
      </div>
    `;

    if (list.length === 0) {
      section.insertAdjacentHTML(
        "beforeend",
        `<p class="empty">접수된 문의가 없습니다.</p>`
      );
      return;
    }

    const table = document.createElement("table");
    table.className = "admin-table";
    table.innerHTML = `
      <thead>
        <tr>
          <th>접수일</th><th>기관명</th><th>지역</th><th>연락처</th>
          <th>문의내용</th><th>상태</th><th>관리</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;
    const tbody = table.querySelector("tbody");

    list.forEach((r) => {
      const tr = document.createElement("tr");
      if (r.status === "done") tr.classList.add("is-done");
      const date = (r.createdAt || "").slice(0, 10);
      tr.innerHTML = `
        <td>${date}</td>
        <td>${esc(r.org)}</td>
        <td>${esc(r.region)}</td>
        <td>${esc(r.phone)}</td>
        <td class="cell-msg">${esc(r.message)}</td>
      `;

      // 상태 변경 셀렉트
      const tdStatus = document.createElement("td");
      const sel = document.createElement("select");
      sel.className = "select select--sm";
      Object.entries(inquiryStatusLabels).forEach(([val, label]) => {
        const opt = document.createElement("option");
        opt.value = val;
        opt.textContent = label;
        if (val === r.status) opt.selected = true;
        sel.appendChild(opt);
      });
      sel.addEventListener("change", async () => {
        await updateInquiry(r.id, { status: sel.value });
        render();
      });
      tdStatus.appendChild(sel);

      // 삭제
      const tdAct = document.createElement("td");
      const del = document.createElement("button");
      del.className = "btn btn--danger btn--sm";
      del.textContent = "삭제";
      del.addEventListener("click", async () => {
        if (confirm("이 문의를 삭제할까요?")) {
          await deleteInquiry(r.id);
          render();
        }
      });
      tdAct.appendChild(del);

      tr.append(tdStatus, tdAct);
      tbody.appendChild(tr);
    });

    section.appendChild(table);
  }

  render();
  return section;
}

function esc(s = "") {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
