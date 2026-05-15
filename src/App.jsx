// [역할] 최상위 컴포넌트. RouterProvider에 root.jsx의 라우터 설정을 연결하여 URL 기반 페이지 라우팅을 활성화한다.
import{RouterProvider} from 'react-router-dom';
// RouterProvider: createBrowserRouter로 생성한 라우터 설정을 앱 전체에 공급하는 컴포넌트
// React Router v6.4+ 방식 → 이전의 <BrowserRouter><Routes><Route> 중첩 방식을 대체
import root from "./router/root.jsx" // createBrowserRouter로 생성한 라우터 설정 객체

function App() {
  // 앱의 최상위 컴포넌트 → main.jsx의 <Provider store={store}><App/></Provider> 로 렌더링됨
  // RouterProvider가 모든 라우팅을 처리 → 현재 URL에 맞는 컴포넌트를 렌더링
  return (
    <RouterProvider router={root}/>
    // router={root}: root.jsx에서 만든 라우트 설정 적용
    // 내부적으로 BrowserRouter + Routes + Route를 모두 처리
  );
}

export default App

// App파일은 프로젝트 실행시 가장 먼저 실행됨.

// 브라우저 주소창을 변경한다는 것은 모든 것을 지우고 새로 시작함을 의미 ->
// 리액트 앱에서 단순히 보이는 컴포넌트가 변경되는 것이 아닌 완전히 처음부터 새로 앱이 로딩되고 처리됨 =>
// SPA(Single Page Application)에서는 새로운 창을 띄우거나 브러우저의 '새로고침'과 같이 새로운 경로를 실행하는 것을 주의해야함.
// (기존의 HTML에서 사용했던 <a>태그는 브라우저 주소창을 변경하면서 앱자체의 로딩부터 새로 시작
// React Router의 <Link> 컴포넌트를 사용하면 브라우저 새로고침 없이 SPA 방식으로 URL만 변경 → 해당 컴포넌트만 교체)
