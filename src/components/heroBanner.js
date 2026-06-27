// 히어로 배너 컴포넌트. 슬라이드를 일정 간격으로 자동 전환한다.

import { getBanners } from "../data/api.js";

export function HeroBanner() {
  const section = document.createElement("section");
  section.className = "hero";
  section.id = "top";

  const inner = document.createElement("div");
  inner.className = "container hero__inner";
  section.appendChild(inner);

  // 비동기로 데이터를 받아 슬라이드를 구성한다.
  getBanners().then((banners) => {
    let current = 0;

    // 한 장을 그리는 내부 렌더 함수.
    const render = () => {
      const b = banners[current];
      inner.innerHTML = `
        <span class="hero__eyebrow">${b.eyebrow}</span>
        <h2 class="hero__title">${b.title}</h2>
        <p class="hero__desc">${b.description}</p>
        <a class="btn btn--point hero__cta" href="${b.ctaHref}">${b.ctaText}</a>
      `;

      // 인디케이터 도트
      const dots = document.createElement("div");
      dots.className = "hero__dots";
      banners.forEach((_, i) => {
        const dot = document.createElement("button");
        dot.className =
          "hero__dot" + (i === current ? " hero__dot--active" : "");
        dot.setAttribute("aria-label", `${i + 1}번째 배너`);
        dot.addEventListener("click", () => {
          current = i;
          render();
        });
        dots.appendChild(dot);
      });
      inner.appendChild(dots);
    };

    render();

    // 5초마다 자동 전환.
    setInterval(() => {
      current = (current + 1) % banners.length;
      render();
    }, 5000);
  });

  return section;
}
