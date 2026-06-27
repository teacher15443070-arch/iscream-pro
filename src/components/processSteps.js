// 위탁연수 도입 절차 컴포넌트.

const STEPS = [
  { no: 1, title: "문의·상담", desc: "기관 수요와 일정 확인" },
  { no: 2, title: "과정 제안", desc: "맞춤 과정·견적 제시" },
  { no: 3, title: "계약·개설", desc: "협약 후 연수 개설" },
  { no: 4, title: "연수 운영", desc: "수강·진도·이수 관리" },
  { no: 5, title: "결과·정산", desc: "이수 결과 보고·정산" },
];

export function ProcessSteps() {
  const section = document.createElement("section");
  section.className = "section";
  section.id = "process";

  const inner = document.createElement("div");
  inner.className = "container";

  const head = document.createElement("div");
  head.className = "section__head";
  head.innerHTML = `
    <h2 class="section__title">도입 절차</h2>
    <p class="section__desc">문의부터 정산까지, 전담 매니저가 전 과정을 지원합니다.</p>
  `;

  const grid = document.createElement("div");
  grid.className = "process-grid";
  STEPS.forEach((s) => {
    const step = document.createElement("div");
    step.className = "process-step";
    step.innerHTML = `
      <div class="process-step__no">${s.no}</div>
      <div class="process-step__title">${s.title}</div>
      <div class="process-step__desc">${s.desc}</div>
    `;
    grid.appendChild(step);
  });

  inner.append(head, grid);
  section.appendChild(inner);
  return section;
}
