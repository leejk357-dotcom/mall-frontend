// [역할] 앱 공통 레이아웃 컴포넌트. BasicMenu(상단 내비게이션)와 메인 콘텐츠 영역, 사이드바를 반응형으로 배치하며 대부분의 페이지를 감싼다.
import BasicMenu from "../components/menus/BasicMenu.jsx";
import CartComponent from "../components/menus/CartComponent.jsx"; // 상단 내비게이션 메뉴 컴포넌트

const BasicLayout = ({children}) => {
  // 앱 전체에서 공통으로 사용하는 레이아웃 컴포넌트
  // children: 각 페이지 컴포넌트 → root.jsx의 <Outlet/>이 실제 내용으로 대체됨
  // 사용 방식: root.jsx에서 <BasicLayout><Outlet/></BasicLayout> 으로 감쌈

  return (
    <>
      {/* React Fragment: 불필요한 <div> 래퍼 없이 여러 요소를 반환 */}

      <BasicMenu/> {/* 모든 페이지 상단에 공통으로 표시되는 내비게이션 */}

      <div className={"bg-white my-5 w-full min-w-full flex flex-col space-y-1 md:flex-row md:space-x-1 md:space-y-0"}>
        {/* 반응형 레이아웃: 모바일(기본)은 세로 정렬(flex-col), 중간 이상(md:)은 가로 정렬(flex-row) */}

        <main className={"bg-sky-300 md:w-2/3 lg:w-3/4 px-5 py-5"}>{children}</main>
        {/* 메인 콘텐츠 영역: 중간 화면(md:)에서 4/5, 큰 화면(lg:)에서 3/4 너비 */}
        {/* children: root.jsx의 <Outlet/>이 각 라우트의 페이지 컴포넌트로 교체됨 */}

        <aside className={"bg-green-300 md:w-1/3 lg:w-1/4 px-5 flex py-5"}>
          {/* 사이드바 영역: 중간 화면(md:)에서 1/5, 큰 화면(lg:)에서 1/4 너비 */}

          <CartComponent/>

        </aside>

      </div>

    </>
  );
}

export default BasicLayout;
