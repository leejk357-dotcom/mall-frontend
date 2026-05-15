// [역할] Todo 모듈 최상위 레이아웃 페이지(/todo). BasicLayout과 List/Add 서브 내비게이션, Outlet을 제공하며 하위 경로(/todo/list, /todo/add 등)의 컴포넌트를 Outlet에 렌더링한다.
import {Outlet, useNavigate} from "react-router-dom";
// Outlet: 중첩 라우터에서 하위 경로의 컴포넌트가 렌더링될 자리를 표시하는 컴포넌트
// useNavigate: 페이지 이동 함수 훅
import BasicLayout from "../../layouts/BasicLayout.jsx"; // 공통 레이아웃 컴포넌트
import {useCallback} from "react"; // 함수 메모이제이션 훅

const IndexPage = () => {
  // Todo 모듈의 최상위 레이아웃 페이지 (/todo)
  // root.jsx에서 /todo 경로에 이 컴포넌트 배치, children(todoRouter)을 Outlet으로 표시

  const navigate = useNavigate();

  const handleClickList = useCallback(() => {
    navigate({pathname:'list'}) // 상대 경로 → /todo/list
  },[navigate])
  // useCallback: navigate가 변경되지 않으면 함수를 재생성하지 않음 → 불필요한 렌더링 방지

  const handleClickAdd = useCallback(() => {
    navigate({pathname:'add'}) // 상대 경로 → /todo/add
  },[navigate])



  return (
    <BasicLayout>
      {/* BasicLayout: 상단 메뉴 + 메인 콘텐츠 영역 + 사이드바 */}

      <div className={"w-full flex m-2 p-2"}>
        {/* Todo 모듈 내부 서브 내비게이션 (List / Add 버튼) */}
        <div className={"text-xl m-1 p-2 w-20 font-extrabold text-center underline"} onClick={handleClickList}>List</div>
        <div className={"text-xl m-1 p-2 w-20 font-extrabold text-center underline"} onClick={handleClickAdd}>Add</div>
      </div>

      <div className={"flex flex-wrap w-full"}>
        <Outlet/>
        {/* Outlet: 현재 URL에 매칭된 하위 라우트 컴포넌트가 여기에 렌더링됨 */}
        {/* /todo/list → ListPage, /todo/add → AddPage, /todo/read/:tno → ReadPage */}
      </div>

    </BasicLayout>
  );
}

export default IndexPage;

// Outlet은 중첩적으로 라우팅이 적용될 때 기존 컴포넌트의 구조를 유지할 수 있게 함 ->
// /todo/list와 같이 하위 경로에 맞는 페이지 컴포넌트를 제작할 때 index Page의 구조가 유지될 수 있게 됨 =>
// 모듈의 공통 레이아웃 + 내부 라우터 진입점

/*
root.jsx          ← 앱 전체의 라우터
└── /todo         → IndexPage (todo 모듈의 root 역할)
    └── <Outlet/> ← todo 모듈 내부의 라우터
        ├── list  → ListPage
        ├── add   → AddPage
        └── read/:tno → ReadPage
*/

/* 애초에 root.jsx에서 IndexPage로 넘어가고
IndexPage에 있는 outlet에 컴포넌트로서 들어와서 나타난다고 보면 되니까.
 */
