// [역할] React 앱 진입점. StrictMode와 Redux Provider로 App 컴포넌트를 감싸 index.html의 root div에 마운트한다.
import {StrictMode} from 'react' // React 18의 개발 모드 컴포넌트 (잠재적 문제를 감지해서 경고 출력)
import {createRoot} from 'react-dom/client' // React 18의 새 렌더링 API (기존 ReactDOM.render 대체)
import './index.css' // 전역 CSS 스타일 파일 임포트 (Tailwind CSS 등 기본 스타일)
import App from './App.jsx' // 앱의 최상위 컴포넌트
import {Provider} from 'react-redux' // Redux store를 하위 컴포넌트에 주입하는 컨텍스트 컴포넌트
import store from './store' // configureStore로 생성한 Redux store 객체

createRoot(document.getElementById('root')).render(
  // index.html의 <div id="root">를 찾아서 React 앱의 렌더링 루트로 설정
  <StrictMode>
    {/* StrictMode: 컴포넌트 이중 렌더링, 구식 API 사용 경고 등 잠재적 문제를 개발 환경에서 감지 */}
    <Provider store={store}>
      {/* Provider: store를 앱 전체에 공급 → 어느 컴포넌트에서든 useSelector/useDispatch 사용 가능 */}
      <App/>
    </Provider>
  </StrictMode>
)
