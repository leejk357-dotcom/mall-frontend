// [역할] 로그아웃 페이지(/member/logout). 전체 화면 레이아웃으로 BasicMenu와 LogoutComponent(로그아웃 버튼)를 배치하며 버튼 클릭 시 쿠키 삭제·Redux 초기화 후 메인 페이지로 이동한다.
import BasicMenu from "../../components/menus/BasicMenu.jsx"; // 상단 내비게이션 메뉴 컴포넌트
import LogoutComponent from "../../components/member/LogoutComponent.jsx"; // 로그아웃 버튼 컴포넌트
import useCustomLogin from "../../hooks/useCustomLogin.jsx"; // (import되었지만 현재 미사용)

const LogoutPage = () => {
  // 로그아웃 페이지 (/member/logout)
  // BasicMenu 상단 메뉴의 "Logout" 링크 클릭 시 이 페이지로 이동

  return (
    <div className={"fixed top-0 left-0 z-[1055] flex flex-col h-full w-full"}>
      {/* LoginPage와 동일한 전체 화면 레이아웃 */}
      <BasicMenu/>

      <div className={"w-full flex flex-wrap h-full justify-center items-center border-2"}>
        <LogoutComponent></LogoutComponent>
        {/* LogoutComponent: LOGOUT 버튼 클릭 → 쿠키 삭제 + Redux 초기화 + "/" 이동 */}
      </div>
    </div>
  )
}

export default LogoutPage
