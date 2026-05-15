// [역할] 앱 전체 라우터 설정. createBrowserRouter로 /, /about, /todo, /products, /member 경로를 각 모듈의 IndexPage 및 중첩 라우터와 연결하며 코드 분할(lazy/Suspense)을 적용한다.
import {createBrowserRouter} from "react-router-dom"; // 라우터 설정 객체를 생성하는 함수 (React Router v6.4+)
import {Suspense, lazy} from "react";
// Suspense와 lazy는 필요한 순간까지 컴포넌트를 메모리상으로 올리지 않도록 지연로딩하기 위함. ->
// ""혹은 "/"로 접속할 경우에는 MainPage 컴포넌트만 로딩해서 보여줌.
// SPA방식의 리액트 앱은 기본적으로 처음에 필요한 모든 컴포넌트를 로딩하기 때문에 초기 실행시간이 오래 걸리는 단점이 있음 ->
// Suspense와 lazy를 이용해서 분할로딩 [코드분할]로써 해결
import todoRouter from "./todoRouter.jsx"; // /todo 하위 경로 설정
import productsRouter from "./productsRouter.jsx"; // /products 하위 경로 설정
import memberRouter from "./memberRouter.jsx"; // /member 하위 경로 설정

const Loading = <div>Loading....</div> // 지연 로딩 중 표시할 대체 UI

// eslint-disable-next-line react-refresh/only-export-components
const Main = lazy(() => import("../pages/MainPage.jsx")); // 메인 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const About = lazy(() => import("../pages/AboutPage.jsx")); // About 페이지 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const TodoIndex = lazy(() => import("../pages/todo/IndexPage.jsx")); // Todo 모듈 진입점 (지연 로딩)
// eslint-disable-next-line react-refresh/only-export-components
const ProductIndex = lazy(() => import("../pages/products/IndexPage.jsx")); // Products 모듈 진입점 (지연 로딩)

const root = createBrowserRouter([
  // createBrowserRouter: HTML5 History API 기반 라우터 생성
  // 배열의 각 객체가 하나의 라우트 설정 → { path, element, children }

  {
    path: "", // "/" (루트 경로) → 메인 페이지
    element: <Suspense fallback={Loading}><Main/></Suspense>
    // 컴포넌트의 처리가 끝나지 않았다면 화면에 간단히 'Loading....'메시지를 보여줌
  },
  {
    path: "about", // "/about" → About 페이지 (로그인 필요)
    element: <Suspense fallback={Loading}><About/></Suspense>
  },
  {
    path: "todo", // "/todo" → Todo 모듈 진입점 (IndexPage가 레이아웃 역할)
    element: <Suspense fallback={Loading}><TodoIndex/></Suspense>,
    children: todoRouter()
    // children: todoRouter()가 반환하는 라우트 배열 → IndexPage의 <Outlet/>에 렌더링됨
    // 예: /todo/list → TodoIndex(IndexPage) 렌더링 + Outlet 위치에 ListPage 렌더링
  },
  {
    path: "products", // "/products" → Products 모듈 진입점
    element: <Suspense fallback={Loading}><ProductIndex/></Suspense>,
    children: productsRouter()
    // children: productsRouter()가 반환하는 라우트 배열
  },
  {
    path: "member", // "/member" → 회원 관련 페이지 (로그인/로그아웃/수정/카카오 콜백)
    children: memberRouter()
    // element 없음: /member 자체는 렌더링할 레이아웃이 없음
    // children의 각 페이지(LoginPage, LogoutPage 등)가 직접 BasicMenu + 레이아웃을 포함
  }

])

export default root;

//root.js는 createBrowserRouter를 통해, 어떤 경로에 어떤 컴포넌트를 보여줄 것인지를 결정하는 역할
