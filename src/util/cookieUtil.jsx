// [역할] react-cookie 기반 쿠키 유틸리티. 로그인 정보(JWT 토큰+사용자 정보)를 setCookie/getCookie/removeCookie로 관리하며 브라우저 새로고침 후 Redux store 상태 복원에 사용된다.
import {Cookies} from "react-cookie"; // react-cookie 라이브러리의 Cookies 클래스 (브라우저 쿠키를 React 친화적으로 관리)

const cookies = new Cookies()
// Cookies 인스턴스 생성 → 파일 전체에서 공유 (모듈 스코프 = 싱글톤처럼 동작)

export const setCookie = (name, value, days) => {
  // 쿠키를 설정하는 함수
  // name: 쿠키 이름 (예: "member"), value: 저장할 값 (JSON 문자열), days: 만료 기간(일)
  const expires = new Date()
  expires.setUTCDate(expires.getUTCDate() + days)
  // setUTCDate: 현재 날짜에 days를 더해 만료일 계산 (UTC 기준 → 시간대 영향 없음)
  // 예: 오늘이 5월 1일이고 days=1이면 expires는 5월 2일

  return cookies.set(name, value, {path:'/', expires: expires})
  // path:'/': 앱 전체 경로에서 쿠키 접근 가능 (path를 제한하면 특정 경로에서만 쿠키 읽힘)
  // expires: 만료일 설정 → 브라우저 닫아도 days일 동안 쿠키 유지
}

export const getCookie = (name) => {
  // 이름으로 쿠키 값을 읽는 함수
  // react-cookie는 JSON 문자열을 자동으로 파싱해서 객체로 반환
  // 예: cookies.set("member", '{"email":"a@a.com"}', ...) → getCookie("member") = { email: "a@a.com" }
  return cookies.get(name)
}

export const removeCookie = (name, path="/") => {
  // 쿠키를 삭제하는 함수
  // path: 쿠키가 설정된 경로와 동일해야 삭제됨 (기본값 "/" → setCookie의 path와 일치)
  // 로그아웃 시 loginSlice.logout()에서 removeCookie("member") 호출
  cookies.remove(name, {path})
}
