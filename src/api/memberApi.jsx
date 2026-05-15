// [역할] 회원 관련 axios API 함수 모음. Spring Security 폼 로그인(application/x-www-form-urlencoded)과 jwtAxios를 사용한 회원 정보 수정 요청을 담당한다.
import axios from "axios"; // JWT 인터셉터 없는 기본 axios (로그인은 토큰 없이 호출)
import {API_SERVER_HOST} from "./todoApi.jsx"; // Spring 서버 호스트 주소
import jwtAxios from "../util/jwtUtil.jsx"; // JWT 인터셉터가 적용된 axios 인스턴스

const host = `${API_SERVER_HOST}/api/member` // 회원 API의 기본 URL

export const loginPost = async (loginParam) => {
  // Spring Security의 폼 로그인 엔드포인트에 로그인 요청을 보내는 함수
  // loginParam = { email, pw } → loginSlice의 loginPostAsync에서 전달
  const header = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}}
  // application/x-www-form-urlencoded: Spring Security의 UsernamePasswordAuthenticationFilter가 요구하는 형식
  // JSON으로 보내면 Spring Security가 파라미터를 읽지 못함

  const form = new FormData()
  form.append("username", loginParam.email)
  // Spring Security는 기본적으로 "username" 파라미터를 읽음 → SecurityConfig에서 usernameParameter("username") 설정
  form.append("password", loginParam.pw)
  // "password" 파라미터도 Spring Security 기본 설정

  const res = await axios.post(`${host}/login`, form, header)
  // 일반 axios 사용 (jwtAxios 아님) → 로그인 시에는 JWT 토큰이 없으므로 인터셉터 불필요
  // Spring Security가 form 데이터를 읽어 인증 처리 → 성공 시 APILoginSuccessHandler 실행

  return res.data
  // 반환: { email, nickname, rolenames, accessToken, refreshToken } (APILoginSuccessHandler에서 JSON으로 응답)
}

export const modifyMember = async (member) => {
  // 회원 정보를 수정하는 함수
  // member = { email, pw, nickname } → Spring의 @PutMapping("/modify") + @RequestBody MemberModifyDTO 매핑
  const res = await jwtAxios.put(`${host}/modify`, member)
  // jwtAxios 사용: 로그인된 사용자만 수정 가능 → JWT 토큰 필요
  return res.data // Spring이 반환한 수정 결과
}
