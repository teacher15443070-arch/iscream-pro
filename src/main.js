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

// 메인 영역: 과정 목록(전체 너비) → 빠른 문의 폼(별도 섹션)
const main = document.createElement("main");

const coursesWrap = document.createElement("div");
coursesWrap.className = "container";
coursesWrap.appendChild(CourseList());
main.appendChild(coursesWrap);

const inquiryWrap = document.createElement("div");
inquiryWrap.className = "container inquiry-section";
inquiryWrap.appendChild(QuickInquiryForm());
main.appendChild(inquiryWrap);

app.appendChild(main);

// 분류 탐색 + 도입 절차 + 푸터
app.appendChild(CategoryNav());
app.appendChild(ProcessSteps());
app.appendChild(Footer());
