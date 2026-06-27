// 푸터 컴포넌트. 회사 정보·고객센터·약관 표기.

export function Footer() {
  const footer = document.createElement("footer");
  footer.className = "footer";

  const inner = document.createElement("div");
  inner.className = "container";
  inner.innerHTML = `
    <div class="footer__brand">아이스크림 프로 · 위탁연수</div>
    <div class="footer__info">
      <p>(주)아이스크림에듀 | 대표 이재준 | 사업자등록번호 120-87-97004</p>
      <p>서울특별시 서초구 매헌로 16, 16·18층</p>
      <p>고객센터 1544-3070 (평일 09:00~18:00) | 위탁연수 전담 070-0000-0000</p>
    </div>
    <div class="footer__copy">
      ⓒ i-Scream Edu. 본 페이지는 아이스크림연수원 위탁연수 영업용 데모입니다.
      · <a href="admin.html" style="color:#9aa3b5;text-decoration:underline;">관리자</a>
    </div>
  `;

  footer.appendChild(inner);
  return footer;
}
