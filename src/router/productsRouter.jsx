// [역할] /products 하위 라우터 설정. /products/list, /products/read/:pno, /products/add, /products/modify/:pno 경로를 지연 로딩 방식으로 각 상품 페이지에 매핑한다.
import {Suspense, lazy} from "react"; // 지연 로딩(코드 분할)을 위한 React 기능
import {Navigate} from 'react-router-dom'; // 특정 경로로 자동 이동시키는 컴포넌트

const productsRouter = () => {
  // /products 하위 경로의 라우트 설정을 반환하는 함수
  // root.jsx의 children: productsRouter()로 중첩 라우터에 등록됨
  // todoRouter와 달리 lazy/Loading을 함수 내부에서 선언 → 함수 호출 시마다 재생성되지만 실제로는 1회만 호출됨

  const Loading = <div>Loading...</div>; // 지연 로딩 중 표시할 대체 UI
  const ProductsList = lazy(() => import ("../pages/products/ListPage.jsx")); // 상품 목록 페이지 (지연 로딩)
  const ProductsAdd = lazy(() => import("../pages/products/AddPage.jsx")); // 상품 등록 페이지 (지연 로딩)
  const ProductsRead = lazy(() => import("../pages/products/ReadPage.jsx")); // 상품 상세 조회 페이지 (지연 로딩)
  const ProductsModify = lazy(() => import("../pages/products/ModifyPage.jsx")); // 상품 수정 페이지 (지연 로딩)

  return [
    {
      path: "list", // /products/list → 상품 목록 페이지
      element: <Suspense fallback={Loading}><ProductsList/></Suspense>
    },
    {
      path: "", // /products → /products/list로 자동 이동
      element: <Navigate replace to={"/products/list"}/>
      // replace: 브라우저 히스토리에 현재 경로 대신 새 경로를 덮어씀 (뒤로가기 방지)
      // todoRouter의 "list"와 달리 절대 경로("/products/list") 사용 → 현재 위치와 무관하게 동일하게 이동
    },
    {
      path: "add", // /products/add → 상품 등록 페이지
      element: <Suspense fallback={Loading}><ProductsAdd/></Suspense>
    },
    {
      path: "read/:pno", // /products/read/5 → pno=5인 상품 상세 페이지
      element: <Suspense fallback={Loading}><ProductsRead/></Suspense>
    },
    {
      path: "modify/:pno", // /products/modify/5 → pno=5인 상품 수정 페이지
      element: <Suspense fallback={Loading}><ProductsModify/></Suspense>
    }
  ]
}

export default productsRouter;
