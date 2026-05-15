// [역할] About 페이지(/about) 컴포넌트. useCustomLogin의 isLogin으로 비로그인 시 로그인 페이지로 즉시 리다이렉트하는 인증 필요 페이지 예시다.
import BasicLayout from "../Layouts/BasicLayout.jsx"; // 공통 레이아웃 컴포넌트
import useCustomLogin from "../hooks/useCustomLogin.jsx"; // 로그인 상태 확인 커스텀 훅

const AboutPage = () => {
  // About 페이지 (/about) → 로그인한 사용자만 접근 가능 (인증 필요 페이지 예시)

  const {isLogin, moveToLoginReturn} = useCustomLogin()
  // isLogin: 로그인 상태 여부 (Redux store의 loginSlice.email 존재 여부)
  // moveToLoginReturn: <Navigate replace to="/member/login"/> 컴포넌트를 반환하는 함수

  if(!isLogin){
    return moveToLoginReturn()
    // 비로그인 상태: <Navigate replace to="/member/login"/> 반환 → 로그인 페이지로 즉시 리다이렉트
    // 컴포넌트가 렌더링되는 대신 Navigate가 렌더링되어 URL이 /member/login으로 변경됨
  }

  return (
    <BasicLayout>

      <div className={"text-3xl"}>About Page</div>

    </BasicLayout>
  );
}

export default AboutPage;
