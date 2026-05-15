// [역할] 카카오 로그인 버튼 UI 컴포넌트. getKakaoLoginLink()로 생성한 카카오 인증 URL로 연결되는 Link를 렌더링하여 카카오 OAuth2 Authorization Code Flow를 시작한다.
import {getKakaoLoginLink} from "../../api/kakaoApi.jsx"; // 카카오 인증 URL 생성 함수
import {Link} from "react-router-dom"; // SPA 방식 페이지 이동 컴포넌트

const KakaoLoginComponent = () => {
  const link = getKakaoLoginLink()
  // 카카오 인증 URL 생성
  // 예: https://kauth.kakao.com/oauth/authorize?client_id=xxx&redirect_uri=http://localhost:5173/member/kakao&response_type=code

  return (
    <div className={"flex flex-col"}>
      <div className={"text-center text-blue-500"}>로그인시 자동 가입처리 됩니다.</div>
      {/* 카카오 최초 로그인 시 회원 자동 등록 안내 (Spring SocialController에서 처리) */}
      <div className={"flex justify-center w-full"}>
        <div className={"text-3xl text-center m-6 text-white font-extrabold w-3/4 bg-yellow-500 shadow-sm rounded p-2"}>
          <Link to={link}>KAKAO LOGIN</Link>
          {/* Link to={link}: 카카오 인증 URL로 이동 */}
          {/* 이동 흐름: KAKAO LOGIN 클릭 → 카카오 로그인 화면 → 동의 → /member/kakao?code=인가코드 로 리다이렉트 */}
          {/* KakaoRedirectPage.jsx에서 URL의 code 파라미터를 읽어 getMemberWithAccessToken(code) 호출 */}
        </div>
      </div>
    </div>
  )
}

export default KakaoLoginComponent
