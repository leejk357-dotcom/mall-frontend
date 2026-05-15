// [역할] /member 하위 라우터 설정. /member/login, /member/logout, /member/kakao(카카오 OAuth 콜백), /member/modify 경로를 지연 로딩 방식으로 각 회원 페이지에 매핑한다.
import {Router} from "react-router-dom"; // (미사용 import - Router는 실제로 쓰이지 않음, Navigate 등으로 교체 필요)
import {lazy, Suspense} from "react"; // 지연 로딩을 위한 React 기능

const Loading = <div>Loading....</div> // 지연 로딩 중 표시할 대체 UI
// eslint-disable-next-line react-refresh/only-export-components
const Login = lazy(() => import("../pages/member/LoginPage.jsx")) // 로그인 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const LogoutPage = lazy(() => import("../pages/member/LogoutPage.jsx")) // 로그아웃 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const KakaoRedirect = lazy(() => import("../pages/member/KakaoRedirectPage.jsx")) // 카카오 OAuth 리다이렉트 처리 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const MemberModify = lazy(() => import("../pages/member/ModifyPage.jsx")) // 회원 정보 수정 페이지 (지연 로딩)

const memberRouter = () => {
  // /member 하위 경로의 라우트 설정을 반환하는 함수
  // root.jsx의 children: memberRouter()로 중첩 라우터에 등록됨

  return[
    {
      path:"login", // /member/login → 로그인 페이지
      element: <Suspense fallback={Loading}><Login/></Suspense>
    },
    {
      path:"logout", // /member/logout → 로그아웃 처리 페이지
      element: <Suspense fallback={Loading}><LogoutPage/></Suspense>
    },
    {
      path:"kakao", // /member/kakao → 카카오 로그인 인가코드 처리
      // 카카오 OAuth 흐름: 카카오 로그인 버튼 클릭 → 카카오 인증 서버 → 이 경로로 code 파라미터와 함께 리다이렉트
      // URL 예: /member/kakao?code=AUTHORIZATION_CODE
      element: <Suspense fallback={Loading}><KakaoRedirect/></Suspense>
    },
    {
      path:"modify", // /member/modify → 회원 정보 수정 페이지 (로그인 필요)
      element: <Suspense fallback={Loading}><MemberModify/></Suspense>
    }
  ]

}

export default memberRouter;
