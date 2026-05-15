// [역할] 로그인 관련 공통 기능 커스텀 훅. 로그인/로그아웃 실행, 페이지 이동, 인증 에러 처리(REQUIRE_LOGIN·ERROR_ACCESSDENIED)를 하나의 훅으로 제공하여 컴포넌트 간 로그인 로직 중복을 제거한다.
import {createSearchParams, Navigate, useNavigate} from "react-router-dom";
import {useCallback} from "react";
// createSearchParams: 객체 → URL 쿼리스트링 변환 (예: {error:"REQUIRE_LOGIN"} → "error=REQUIRE_LOGIN")
// Navigate: 컴포넌트로 사용하는 리다이렉트 (JSX 반환 시 사용)
// useNavigate: 함수로 사용하는 페이지 이동 (이벤트 핸들러 등에서 사용)
import {useDispatch, useSelector} from "react-redux"; // Redux store 접근 훅
import {loginPostAsync, logout} from "../slice/loginSlice.jsx"; // 로그인/로그아웃 Redux action

const useCustomLogin = () => {
  // 로그인 관련 공통 기능을 묶은 커스텀 훅
  // 여러 컴포넌트에서 동일한 로그인 로직을 반복하지 않도록 훅으로 추출

  const navigate = useNavigate() // 페이지 이동 함수
  const dispatch = useDispatch() // Redux action을 실행하는 함수
  const loginState = useSelector(state => state.loginSlice)
  // Redux store에서 loginSlice 상태 읽기 → { email, nickName, accessToken, refreshToken, roleNames }
  // store.jsx에서 "loginSlice": loginSlice 로 등록했으므로 state.loginSlice로 접근

  const isLogin = loginState.email ? true : false
  // email이 있으면 로그인 상태, 빈 문자열("")이면 비로그인 상태
  // initState = { email: '' } → 비로그인 시 email이 빈 문자열

  const doLogin = async (loginParam) => {
    // 로그인 실행 함수
    // loginParam = { email, pw } → loginPostAsync → Spring /api/member/login에 POST
    const action = await dispatch(loginPostAsync(loginParam))
    // dispatch(createAsyncThunk): Promise 반환 → await로 결과 대기
    // action = { type: "loginPostAsync/fulfilled", payload: 서버응답 }
    return action.payload // { email, nickName, accessToken, refreshToken, error? } 반환
  }

  const doLogout = () => {
    // 로그아웃 실행 함수
    dispatch(logout())
    // loginSlice.logout: 쿠키 삭제 + store 초기화 → isLogin이 false로 변경
  }

  const moveToPath = (path) => {
    // 지정한 경로로 이동하는 함수
    navigate({pathname: path}, {replace: true})
    // replace:true → 현재 페이지를 히스토리에서 교체 (뒤로가기 방지)
  }

  const moveToLogin = () => {
    // 로그인 페이지로 이동하는 함수 (이벤트 핸들러용)
    navigate({pathname: '/member/login'}, {replace: true})
  }

  const moveToLoginReturn = () => {
    // 로그인 페이지로 이동하는 컴포넌트를 반환하는 함수 (JSX return 위치에서 사용)
    // 예: if(!isLogin) return moveToLoginReturn() → <Navigate> 컴포넌트를 렌더링해 리다이렉트
    return <Navigate replace to={"/member/login"}/>
  }

  const exceptionHandle = useCallback((ex) => {
    // API 호출 에러를 처리하는 함수
    // jwtAxios의 beforeReq에서 REQUIRE_LOGIN, Spring의 CustomAccessDeniedHandler에서 ERROR_ACCESSDENIED 발생
    console.log("Exception-----------------")
    console.log(ex)
    const errorMsg = ex.response.data.error // 에러 코드 추출 (예: "REQUIRE_LOGIN")
    const errorStr = createSearchParams({error: errorMsg}).toString()
    // createSearchParams({error: "REQUIRE_LOGIN"}) → "error=REQUIRE_LOGIN" 문자열로 변환

    if(errorMsg === 'REQUIRE_LOGIN') {
      alert('로그인 해야 합니다')
      navigate({pathname:'/member/login', search:errorStr})
      // /member/login?error=REQUIRE_LOGIN 으로 이동 → 로그인 페이지에서 이 파라미터를 읽어 안내 메시지 표시 가능
      return
    }
    if(ex.response.data.error === 'ERROR_ACCESSDENIED') {
      alert("해당 메뉴를 사용할 수 있는 권한이 없습니다.")
      navigate({pathname:'/member/login', search:errorStr})
      // /member/login?error=ERROR_ACCESSDENIED 로 이동
      return;
    }
  }, [navigate])

  return {loginState, isLogin, doLogin, doLogout, moveToLogin, moveToPath, moveToLoginReturn, exceptionHandle}
  // 훅 사용 예시:
  // const { isLogin, doLogin, doLogout, moveToLogin, exceptionHandle } = useCustomLogin()
}

export default useCustomLogin
