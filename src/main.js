// 앱 진입점: 각 컴포넌트를 생성해 #app에 마운트한다.
// 컴포넌트는 DOM을 반환하는 순수 함수이며, 여기서 appendChild로 조립한다.

import { Header } from "./components/header.js";
import { HeroBanner } from "./components/heroBanner.js";
import { CourseList } from "./components/courseList.js";
import { QuickInquiryForm } from "./components/quickInquiryForm.js";
import { CategoryNav } from "./components/categoryNav.js";
import { ProcessSteps } from "./components/processSteps.js";
import { Footer } from "./components/footer.js";

const app = document.getElementById("app");

// 헤더 + 히어로 배너
app.appendChild(Header());
app.appendChild(HeroBanner());

// 메인 영역: 좌측 과정목록 + 우측 빠른 문의 폼 (2단 그리드)
const main = document.createElement("main");
const mainInner = document.createElement("div");
mainInner.className = "container main-grid";
mainInner.appendChild(CourseList());
mainInner.appendChild(QuickInquiryForm());
main.appendChild(mainInner);
app.appendChild(main);

// 분류 탐색 + 도입 절차 + 푸터
app.appendChild(CategoryNav());
app.appendChild(ProcessSteps());
app.appendChild(Footer());
