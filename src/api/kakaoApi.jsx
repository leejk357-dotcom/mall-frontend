// [역할] 카카오 OAuth2 API 함수 모음. 카카오 인가 URL 생성(getKakaoLoginLink)과 인가코드를 Spring 서버로 전달하는(getMemberWithAccessToken) 함수를 제공한다. 토큰 교환은 보안상 Spring 서버에서 처리한다.
/*
import axios from "axios";
import {API_SERVER_HOST} from "./todoApi.jsx";

const rest_api_key = ``
const redirect_uri = `http://localhost:5173/member/kakao`

const auth_code_path = `https://kauth.kakao.com/oauth/authorize`

const access_token_url = `https://kauth.kakao.com/oauth/token`

const client_secret = ``

export const getKakaoLoginLink = () => {

  const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`;

  return kakaoURL
}

export const getAccessToken = async (authCode) => {
  const header = {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    }
  }
  const params = {
    grant_type: "authorization_code",
    client_id: rest_api_key,
    redirect_uri: redirect_uri,
    code: authCode,
    client_secret: client_secret
  }

  const res = await axios.post(access_token_url, params, header)
  const accessToken = res.data.access_token
  return accessToken
}

export const getMemberWithAccessToken = async (accessToken) => {

  const res = await axios.get(`${API_SERVER_HOST}/api/member/kakao?accessToken=${accessToken}`)
  return res.data
}*/

// ===== 구버전 (위) vs 현재 버전 (아래) 비교 =====
// 구버전: 브라우저(React)에서 카카오 토큰 서버 직접 호출 → client_secret 노출 위험
// 현재: authCode만 Spring 서버로 전달 → Spring에서 카카오 토큰 교환 (보안 강화)

import axios from "axios"; // 기본 axios (JWT 인터셉터 불필요 - 카카오 로그인은 토큰 없이 시작)
import {API_SERVER_HOST} from "./todoApi.jsx"; // Spring 서버 호스트 주소

const rest_api_key = `` // 카카오 앱의 REST API 키 (카카오 개발자 콘솔에서 발급)
const redirect_uri = `http://localhost:5173/member/kakao` // 카카오 인증 후 리다이렉트될 React 앱 경로
const auth_code_path = `https://kauth.kakao.com/oauth/authorize` // 카카오 인가 코드 요청 URL

export const getKakaoLoginLink = () => {
  // 카카오 로그인 버튼 클릭 시 이동할 URL을 생성하는 함수
  // 흐름: 사용자가 이 URL로 이동 → 카카오 로그인 화면 → 동의 → redirect_uri?code=인가코드 로 리다이렉트
  const kakaoURL = `${auth_code_path}?client_id=${rest_api_key}&redirect_uri=${redirect_uri}&response_type=code`
  // client_id: 어떤 앱에서 요청하는지 식별
  // redirect_uri: 인증 후 돌아올 주소 (카카오 앱 설정에 등록된 주소와 일치해야 함)
  // response_type=code: 인가 코드 방식 (OAuth 2.0 Authorization Code Flow)
  return kakaoURL
}

// ❌ getAccessToken 완전 제거 (브라우저에서 카카오 직접 호출 금지)
// 이유: client_secret을 브라우저에 노출하면 탈취 위험 → 서버에서만 처리해야 함

// ✅ authCode를 Spring 서버로 바로 전달
export const getMemberWithAccessToken = async (authCode) => {
  // 카카오에서 받은 인가코드(authCode)를 Spring 서버로 전달하는 함수
  // Spring 서버(SocialController)에서 인가코드로 카카오 액세스 토큰 교환 + 회원 조회/등록 후 JWT 발급
  // KakaoRedirectPage.jsx에서 URL 파라미터로 받은 code를 이 함수에 전달
  const res = await axios.get(`${API_SERVER_HOST}/api/member/kakao?authCode=${authCode}`)
  // GET /api/member/kakao?authCode=xxxx → Spring SocialController.getMemberFromKakao() 호출
  return res.data
  // 반환: { email, nickName, roleNames, accessToken, refreshToken } → Redux loginSlice에 저장
}
