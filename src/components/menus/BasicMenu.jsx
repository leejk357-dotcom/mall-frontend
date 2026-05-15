// [역할] 상단 내비게이션 메뉴 컴포넌트. Redux loginSlice의 로그인 상태를 읽어 비로그인 시 Login 링크, 로그인 시 Todo·Products 메뉴와 Logout 링크를 조건부 렌더링한다.
import {Link} from "react-router-dom"; // 페이지 이동 링크 컴포넌트 (새로고침 없이 SPA 방식으로 이동)
import {useSelector} from "react-redux"; // Redux store에서 상태를 읽는 훅

const BasicMenu = () => {
  // 앱 상단에 표시되는 내비게이션 메뉴 컴포넌트
  // 로그인 상태에 따라 메뉴 항목과 로그인/로그아웃 버튼을 조건부 렌더링

  const loginState = useSelector(state => state.loginSlice);
  // Redux store에서 로그인 상태 읽기 → { email, nickName, accessToken, ... }
  // 로그인 시: email 있음, 비로그인 시: email = '' (initState)

  return (
    <nav id={"navbar"} className={"flex bg-blue-300"}>
      {/* nav: 시맨틱 HTML5 내비게이션 요소 */}
      {/* flex: 자식 요소들을 가로로 배치 */}

      <div className={"w-4/5 bg-gray-500"}>
        {/* 왼쪽 4/5: 메인 메뉴 영역 */}
        <ul className={"flex p-4 text-white font-bold"}>
          <li className={"pr-6 text-2xl"}>
            <Link to={'/'}>Main</Link> {/* 메인 페이지 링크 */}
          </li>
          <li className={"pr-6 text-2xl"}>
            <Link to={'/about'}>About</Link> {/* About 페이지 링크 */}
          </li>

          {loginState.email ?
            // 로그인 상태(email이 있는 경우)에만 Todo, Products 메뉴 표시
            <>
              <li className={"pr-6 text-2xl"}>
                <Link to={'/todo/'}>Todo</Link> {/* /todo/ → todoRouter의 Navigate가 /todo/list로 이동 */}
              </li>
              <li className={"pr-6 text-2xl"}>
                <Link to={'/products/'}>Products</Link> {/* /products/ → productsRouter의 Navigate가 /products/list로 이동 */}
              </li>
            </>
            :
            <></> // 비로그인 상태: Todo, Products 메뉴 숨김
          }
        </ul>
      </div>

      <div className={"w-1/5 flex justify-end bg-orange-300 p-4 font-medium"}>
        {/* 오른쪽 1/5: 로그인/로그아웃 버튼 영역 (flex justify-end: 오른쪽 정렬) */}
        {!loginState.email ?
          // 비로그인 상태: Login 링크 표시
          <div className={"text-white text-sm m-1 rounded"}>
            <Link to={'/member/login'}>Login</Link>
          </div>
          :
          // 로그인 상태: Logout 링크 표시
          <div className={"text-white text-sm m-1 rounded"}>
            <Link to={'/member/logout'}>Logout</Link>
          </div> }
      </div>

    </nav>
  );
}

export default BasicMenu;
