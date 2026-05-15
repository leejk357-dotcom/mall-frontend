// [역할] /todo 하위 라우터 설정. /todo/list, /todo/read/:tno, /todo/add, /todo/modify/:tno 경로를 지연 로딩 방식으로 각 Todo 페이지에 매핑한다.
import {Suspense, lazy} from "react"; // 지연 로딩(코드 분할)을 위한 React 기능
import {Navigate} from "react-router-dom"; // 특정 경로로 자동 이동시키는 컴포넌트

const Loading = <div>Loading....</div> // 컴포넌트 로딩 중 표시할 대체 UI

// eslint-disable-next-line react-refresh/only-export-components
const TodoList = lazy(() => import("../pages/todo/ListPage.jsx")); // Todo 목록 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const TodoMain = lazy(() => import("../pages/todo/todoMainPage.jsx")); // Todo 메인 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const TodoRead = lazy(() => import("../pages/todo/ReadPage.jsx")); // Todo 상세 조회 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const TodoAdd = lazy(() => import("../pages/todo/AddPage.jsx")); // Todo 등록 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const TodoModify = lazy(() => import("../pages/todo/ModifyPage.jsx")); // Todo 수정 페이지 (지연 로딩)

const todoRouter = () => {
  // /todo 하위 경로의 라우트 설정을 반환하는 함수
  // root.jsx의 children: todoRouter()로 중첩 라우터에 등록됨

  return [
    {
      path: "list", // /todo/list → Todo 목록 페이지
      element: <Suspense fallback={Loading}><TodoList/></Suspense>,
      // Suspense: 지연 로딩 컴포넌트가 준비될 때까지 fallback(Loading) 표시
    },
    {
      path: "", // /todo → /todo/list로 자동 이동
      element: <Navigate replace to={"list"}/>,
      // replace: 브라우저 히스토리에 현재 경로 대신 새 경로를 덮어씀 (뒤로가기 방지)
    },
    {
      path: "read/:tno", // /todo/read/33 → tno=33인 Todo 상세 페이지
      element: <Suspense fallback={Loading}><TodoRead/></Suspense>,
    },
    {
      path: "add", // /todo/add → Todo 등록 페이지
      element: <Suspense fallback={Loading}><TodoAdd/></Suspense>,
    },
    {
      path: "modify/:tno", // /todo/modify/33 → tno=33인 Todo 수정 페이지
      element: <Suspense fallback={Loading}><TodoModify/></Suspense>,
    }
  ]
}

export default todoRouter;
