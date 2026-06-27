// 위탁연수 빠른 문의 폼 컴포넌트.
// 1단계에서는 프론트 목업 — 입력 검증 후 api.submitInquiry로 전달하고 완료 메시지를 표시한다.

import { getRegions, submitInquiry } from "../data/api.js";

export function QuickInquiryForm() {
  const aside = document.createElement("aside");
  aside.className = "inquiry";
  aside.id = "inquiry";

  aside.innerHTML = `
    <h3 class="inquiry__title">위탁연수 빠른 문의</h3>
    <p class="inquiry__sub">담당 매니저가 1영업일 내 연락드립니다.</p>
    <form novalidate>
      <div class="field" data-field="org">
        <label for="iq-org">기관명</label>
        <input id="iq-org" name="org" type="text" placeholder="○○교육청 / ○○재단" />
        <span class="field__error"></span>
      </div>
      <div class="field" data-field="region">
        <label for="iq-region">지역</label>
        <select id="iq-region" name="region"></select>
        <span class="field__error"></span>
      </div>
      <div class="field" data-field="phone">
        <label for="iq-phone">연락처</label>
        <input id="iq-phone" name="phone" type="tel" placeholder="010-0000-0000" />
        <span class="field__error"></span>
      </div>
      <div class="field" data-field="message">
        <label for="iq-message">문의 내용</label>
        <textarea id="iq-message" name="message" placeholder="원하시는 연수 주제, 인원, 시기 등을 적어주세요."></textarea>
        <span class="field__error"></span>
      </div>
      <button class="btn btn--point inquiry__submit" type="submit">문의 요청하기</button>
    </form>
    <p class="inquiry__tel">위탁연수 전담 고객센터<b>1544-3070</b></p>
  `;

  const form = aside.querySelector("form");

  // 지역 옵션 채우기.
  getRegions().then((regions) => {
    const select = form.querySelector("#iq-region");
    regions.forEach((r) => {
      const opt = document.createElement("option");
      opt.value = r;
      opt.textContent = r;
      select.appendChild(opt);
    });
  });

  // 특정 필드에 에러 표시/해제.
  const setError = (name, msg) => {
    const field = form.querySelector(`[data-field="${name}"]`);
    field.classList.toggle("field--error", Boolean(msg));
    field.querySelector(".field__error").textContent = msg || "";
  };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());

    // 입력 검증.
    let valid = true;
    if (!data.org.trim()) {
      setError("org", "기관명을 입력해주세요.");
      valid = false;
    } else setError("org", "");

    // 휴대전화 형식: 숫자 9~11자리(하이픈 허용).
    const phoneDigits = data.phone.replace(/[^0-9]/g, "");
    if (phoneDigits.length < 9 || phoneDigits.length > 11) {
      setError("phone", "연락처를 정확히 입력해주세요.");
      valid = false;
    } else setError("phone", "");

    if (!data.message.trim()) {
      setError("message", "문의 내용을 입력해주세요.");
      valid = false;
    } else setError("message", "");

    if (!valid) return;

    // 접수(목업).
    const res = await submitInquiry(data);
    if (res.ok) {
      form.innerHTML = `<p class="inquiry__done">✅ ${res.message}<br>빠르게 연락드리겠습니다.</p>`;
    }
  });

  return aside;
}
