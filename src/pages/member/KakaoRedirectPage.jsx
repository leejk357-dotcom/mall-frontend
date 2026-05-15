// [역할] 카카오 OAuth 리다이렉트 처리 페이지(/member/kakao). URL의 code 파라미터(카카오 인가코드)를 Spring 서버로 전달하고 반환된 JWT 토큰과 사용자 정보를 Redux store·쿠키에 저장한 뒤 페이지를 이동한다.
import {useSearchParams} from "react-router-dom"; // URL 쿼리스트링 파라미터를 읽는 훅
import {useEffect, useRef} from "react"; // 부수효과와 DOM 참조 훅
import {getMemberWithAccessToken} from "../../api/kakaoApi.jsx"; // authCode → Spring 서버로 전달하는 API 함수
import {useDispatch} from "react-redux"; // Redux action 실행 훅
import {login} from "../../slice/loginSlice.jsx"; // 로그인 상태를 저장하는 Redux action
import useCustomLogin from "../../hooks/useCustomLogin.jsx"; // 페이지 이동 커스텀 훅

const KakaoRedirectPage = () => {
  // 카카오 OAuth 리다이렉트 처리 페이지 (/member/kakao)
  // 카카오 인증 서버가 인가코드와 함께 이 URL로 리다이렉트 → /member/kakao?code=인가코드
  // 흐름: KakaoLoginComponent 클릭 → 카카오 로그인 → /member/kakao?code=xxx 리다이렉트 → 여기서 처리

  const [searchParams] = useSearchParams()
  // URL의 쿼리스트링을 읽는 훅 (URLSearchParams 래퍼)

  const dispatch = useDispatch() // Redux action 실행 함수

  const authCode = searchParams.get("code")
  // URL에서 "code" 파라미터 추출 → 카카오가 발급한 인가코드
  // 예: /member/kakao?code=AbCdEf1234 → authCode = "AbCdEf1234"

  const {moveToPath} = useCustomLogin() // 페이지 이동 함수

  /*useEffect(() => {
    getAccessToken(authCode).then(accessToken => {
      console.log(accessToken)

      getMemberWithAccessToken(accessToken).then(memberInfo => {
        console.log("--------------------")
        console.log(memberInfo)
      })
    })
  }, [authCode]);*/
  // 이전 버전: 브라우저에서 직접 카카오 액세스 토큰 교환 (client_secret 노출 위험)
  // 현재 버전: authCode만 Spring 서버로 전달 → Spring에서 토큰 교환 (보안 강화)

  const isExecuted = useRef(false)  // ← 중복 실행 방지
  // React StrictMode에서 useEffect가 개발 환경에서 2번 실행됨
  // useRef: 렌더링과 무관하게 값 유지 → isExecuted.current를 true로 설정 후 두 번째 실행 시 조기 반환

  useEffect(() => {
    if (!authCode || isExecuted.current) return
    // authCode가 없거나 이미 실행됐으면 중단 (StrictMode 이중 실행 방지)
    isExecuted.current = true // 실행 완료 표시

    getMemberWithAccessToken(authCode).then(memberInfo => {
      // GET /api/member/kakao?authCode=xxx → Spring SocialController.getMemberFromKakao()
      // Spring에서: authCode → 카카오 액세스 토큰 교환 → 카카오 사용자 정보 조회 → 회원 등록/조회 → JWT 발급
      console.log("-------------------")
      console.log(memberInfo)
      dispatch(login(memberInfo))
      // login(memberInfo): loginSlice.reducers.login 실행
      // → 쿠키에 저장 + Redux store 업데이트 → isLogin = true

      if (memberInfo && !memberInfo.social) {
        moveToPath("/") // 기존 일반 회원이 카카오로 로그인 → 메인 페이지로 이동
      } else {
        moveToPath("/member/modify") // 카카오로 최초 가입한 회원 → 닉네임 등 추가 정보 입력을 위해 수정 페이지로 이동
      }
    })
  }, [authCode, dispatch, moveToPath]) // 의존성 배열: authCode, dispatch, moveToPath


  return (
    <div>
      <div>Kakao Login Redirect</div>
      <div>{authCode}</div>
      {/* 처리 중임을 알리는 임시 UI (실제로는 FetchingModal 등으로 교체 가능) */}
    </div>

  )
}

export default KakaoRedirectPage
