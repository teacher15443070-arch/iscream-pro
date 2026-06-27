// 헤더 / GNB 컴포넌트. DOM 요소를 생성해 반환하는 순수 함수.

const MENUS = [
  { label: "과정", href: "#courses" },
  { label: "견적 요청", href: "#inquiry" },
  { label: "도입 안내", href: "#process" },
  { label: "분야별 과정", href: "#categories" },
  { label: "Q&A", href: "#inquiry" },
];

export function Header() {
  const header = document.createElement("header");
  header.className = "header";

  const inner = document.createElement("div");
  inner.className = "container header__inner";

  // 브랜드 로고
  const brand = document.createElement("a");
  brand.className = "brand";
  brand.href = "#top";
  brand.innerHTML = `
    <span class="brand__mark">🍦</span>
    <span>아이스크림 <span class="brand__pro">프로</span></span>
  `;

  // 메뉴
  const gnb = document.createElement("nav");
  gnb.className = "gnb";
  MENUS.forEach((m) => {
    const a = document.createElement("a");
    a.className = "gnb__link";
    a.href = m.href;
    a.textContent = m.label;
    gnb.appendChild(a);
  });

  // 우측 액션 버튼
  const actions = document.createElement("div");
  actions.className = "header__actions";
  actions.innerHTML = `
    <a class="btn btn--ghost" href="#inquiry">로그인</a>
    <a class="btn btn--primary" href="#inquiry">회원가입</a>
  `;

  inner.append(brand, gnb, actions);
  header.appendChild(inner);
  return header;
}
