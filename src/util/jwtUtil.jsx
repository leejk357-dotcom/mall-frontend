// [역할] JWT 자동 처리 axios 인스턴스. 요청 전 쿠키의 accessToken을 Authorization 헤더에 첨부하고, 응답에서 토큰 만료(ERROR_ACCESS_TOKEN) 감지 시 refreshToken으로 자동 재발급한 뒤 원래 요청을 재시도한다.
import axios from "axios"; // HTTP 요청 라이브러리 (기본 인스턴스)
import {getCookie, setCookie} from "./cookieUtil.jsx"; // 쿠키 읽기·쓰기 유틸리티
import {API_SERVER_HOST} from "../api/todoApi.jsx"; // Spring 서버 호스트 주소

const jwtAxios = axios.create()
// axios.create(): 기본 axios와 독립적인 새 인스턴스 생성
// 이 인스턴스에만 인터셉터를 등록해서 일반 axios 호출(카카오, 로그인 등)은 영향받지 않음

let refreshPromise = null
// 동시 토큰 갱신 방지: 여러 요청이 동시에 ERROR_ACCESS_TOKEN을 받았을 때
// 단 하나의 refreshJWT 호출만 실행하고 나머지는 같은 Promise를 공유해 대기
// → race condition 방지 (중복 refresh 요청 → 쿠키 덮어쓰기 → 재시도 토큰 불일치 방지)

const refreshJWT = async (accessToken, refreshToken) => {
  // accessToken 만료 시 refreshToken으로 새 토큰 쌍을 발급받는 함수
  // Spring의 APIRefreshController.refresh()를 호출
  const host = API_SERVER_HOST

  const header = {headers: {'Authorization': `Bearer ${accessToken}`}};
  // 만료된 accessToken도 함께 전달 → Spring에서 refreshToken 유효성 + accessToken 만료 여부를 함께 검증

  const res = await axios.get(`${host}/api/member/refresh?refreshToken=${refreshToken}`, header)
  // 일반 axios 사용 (jwtAxios 사용 시 무한 루프 발생 → 인터셉터가 또 refreshJWT 호출)
  // GET /api/member/refresh?refreshToken=xxx (Authorization 헤더에 만료된 accessToken 포함)

  console.log("-----------------------")
  console.log(res.data)

  return res.data
  // 반환: { accessToken: 새토큰, refreshToken: 새토큰 }
}

const beforeReq = (config) => {
  // 모든 jwtAxios 요청 전에 실행되는 인터셉터 (Request Interceptor)
  // config: axios 요청 설정 객체 (URL, 헤더, 바디 등)
  console.log("before request......")

  const memberInfo = getCookie("member")
  // 쿠키에서 로그인 정보 읽기 → { email, nickName, accessToken, refreshToken, roleNames }

  if(!memberInfo){
    console.log("Member Not Found")
    return Promise.reject(
      {response: {data: {error: "REQUIRE_LOGIN"}}}
    )
    // 쿠키가 없으면 로그인이 필요한 상태 → 에러를 던져 요청 중단
    // {response: {data: {error: "REQUIRE_LOGIN"}}} 형태로 던지면 컴포넌트의 catch에서 error.response.data.error로 접근 가능
  }

  const {accessToken} = memberInfo // 쿠키에서 accessToken만 추출

  config.headers.Authorization = `Bearer ${accessToken}`
  // Authorization 헤더에 JWT 토큰 첨부 → Spring의 JWTCheckFilter가 이 헤더를 읽어 인증 처리

  return config // 수정된 config 반환 → 실제 HTTP 요청 진행
}

const requestFail = (err) => {
  // 요청 인터셉터에서 에러 발생 시 실행 (예: beforeReq에서 Promise.reject 호출)
  console.log("request error......")

  return Promise.reject(err) // 에러를 그대로 전파 → API 호출 코드의 catch로 전달
}

const beforeRes = async (res) =>{
  // 모든 jwtAxios 응답 후에 실행되는 인터셉터 (Response Interceptor)
  // res: axios 응답 객체 (data, status, headers, config 등 포함)
  console.log("before return response......")

  console.log(res)
  const data = res.data

  if(data && data.error==='ERROR_ACCESS_TOKEN'){
    // Spring JWTCheckFilter가 accessToken 만료를 감지하면 { error: "ERROR_ACCESS_TOKEN" }을 응답 바디에 포함
    // HTTP 상태코드는 200이지만 바디에 error 필드가 있음 → 여기서 감지

    if (!refreshPromise) {
      // 첫 번째 만료 감지 요청만 실제 갱신 수행 → 나머지 병렬 요청은 아래에서 동일 Promise 대기
      const memberCookieValue = getCookie("member") // 현재 쿠키에서 만료된 토큰 정보 가져오기
      refreshPromise = refreshJWT(memberCookieValue.accessToken, memberCookieValue.refreshToken)
        .then(result => {
          // Spring에 토큰 재발급 요청 → 새 accessToken + refreshToken 받기
          console.log("refreshJWT RESULT", result)
          memberCookieValue.accessToken = result.accessToken // 쿠키 객체에 새 accessToken으로 갱신
          memberCookieValue.refreshToken = result.refreshToken // 쿠키 객체에 새 refreshToken으로 갱신
          setCookie("member", JSON.stringify(memberCookieValue), 1)
          // 갱신된 토큰 정보를 쿠키에 다시 저장 (1일 유지)
          return result
        })
        .finally(() => {
          refreshPromise = null
          // 갱신 완료(성공/실패 무관) 후 초기화 → 다음 만료 시 새 갱신 가능
        })
    }

    const result = await refreshPromise
    // 병렬 요청들이 여기서 하나의 갱신 Promise를 공유해 대기 → 모두 같은 새 토큰 사용
    const originalRequest = res.config // 실패했던 원래 요청의 설정 (URL, 메서드, 바디 등)
    originalRequest.headers.Authorization = `Bearer ${result.accessToken}`
    // 새 accessToken으로 Authorization 헤더 교체 ("Bearer " + 공백 + 토큰 형식)
    return await axios(originalRequest) // 원래 요청을 새 토큰으로 재시도
  }

  return res // 정상 응답이면 그대로 반환
}

const responseFail = (err) => {
  // 응답 인터셉터에서 에러 발생 시 실행 (HTTP 4xx, 5xx 상태코드 등)
  console.log("response fail error......")
  return Promise.reject(err) // 에러를 그대로 전파
}

jwtAxios.interceptors.request.use(beforeReq, requestFail)
// request 인터셉터 등록: 요청 전 beforeReq 실행, 요청 중 에러 시 requestFail 실행
jwtAxios.interceptors.response.use(beforeRes, responseFail)
// response 인터셉터 등록: 응답 후 beforeRes 실행, 응답 에러(4xx/5xx) 시 responseFail 실행

export default jwtAxios
// jwtAxios를 default export → import jwtAxios from "../util/jwtUtil.jsx" 로 가져다 사용
