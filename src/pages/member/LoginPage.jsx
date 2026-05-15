// [역할] 로그인 페이지(/member/login). BasicLayout 없이 전체 화면 레이아웃으로 BasicMenu와 LoginComponent(이메일/비밀번호 폼 + 카카오 로그인 버튼)를 배치한다.
import BasicMenu from "../../components/menus/BasicMenu.jsx"; // 상단 내비게이션 메뉴 컴포넌트
import LoginComponent from "../../components/member/LoginComponent.jsx"; // 로그인 폼 컴포넌트

const LoginPage = () => {
  // 로그인 페이지 (/member/login)
  // BasicLayout을 사용하지 않고 직접 레이아웃 구성 → 로그인 폼을 화면 중앙에 전체 표시

  return (
    <div className={"fixed top-0 left-0 z-[1055] flex flex-col h-full w-full"}>
      {/* fixed: 스크롤 위치와 무관하게 화면에 고정 */}
      {/* z-[1055]: 다른 요소 위에 표시 (모달처럼 전체 화면 덮기) */}
      {/* flex flex-col: BasicMenu + LoginComponent를 세로로 배치 */}
      <BasicMenu/>
      <div className={"flex flex-wrap w-full h-full justify-center items-center border-2"}>
        {/* justify-center items-center: LoginComponent를 가운데 정렬 */}
        <LoginComponent/>
      </div>
    </div>
  )
}
export default LoginPage
