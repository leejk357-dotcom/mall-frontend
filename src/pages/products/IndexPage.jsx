// [역할] Products 모듈 최상위 레이아웃 페이지(/products). BasicLayout과 List/Add 서브 내비게이션, Outlet을 제공하며 하위 경로(/products/list, /products/add 등)의 컴포넌트를 Outlet에 렌더링한다.
import {Outlet, useNavigate} from "react-router-dom";
// Outlet: 중첩 라우터에서 하위 경로의 컴포넌트가 렌더링될 자리
// useNavigate: 페이지 이동 함수 훅
import BasicLayout from "../../layouts/BasicLayout.jsx"; // 공통 레이아웃 컴포넌트
import {useCallback} from "react"; // 함수 메모이제이션 훅

const IndexPage = () => {
  // Products 모듈의 최상위 레이아웃 페이지 (/products)
  // Todo IndexPage와 동일한 구조 → List/Add 서브 내비게이션 + Outlet

  const navigate = useNavigate();

  const handleClickList = useCallback(() => {
    navigate({pathname:'list'}) // 상대 경로 → /products/list
  },[navigate])

  const handleClickAdd = useCallback(() => {
    navigate({pathname:'add'}) // 상대 경로 → /products/add
  },[navigate])



  return (
    <BasicLayout>
      <div className={"text-black font-extrabold -mt-10"}>
        Products Menus
        {/* -mt-10: 음수 마진으로 위쪽 여백 제거 */}
      </div>

      <div className={"w-full flex m-2 p-2"}>
        {/* Products 모듈 내부 서브 내비게이션 */}
        <div className={"text-xl m-1 p-2 w-20 font-extrabold text-center underline"} onClick={handleClickList}>List</div>
        <div className={"text-xl m-1 p-2 w-20 font-extrabold text-center underline"} onClick={handleClickAdd}>Add</div>
      </div>

      <div className={"flex flex-wrap w-full"}>
        <Outlet/>
        {/* Outlet: /products/list → ListPage, /products/add → AddPage, /products/read/:pno → ReadPage */}
      </div>

    </BasicLayout>
  );
}

export default IndexPage;
