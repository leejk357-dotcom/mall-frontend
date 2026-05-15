// [역할] 로그아웃 UI 컴포넌트. LOGOUT 버튼 클릭 시 useCustomLogin의 doLogout()으로 쿠키 삭제·Redux store 초기화 후 메인 페이지로 이동한다.
/*import {useDispatch} from "react-redux";
import {logout} from "../../slice/loginSlice.jsx";*/
// 이전 버전: useDispatch + logout을 직접 import해서 사용
// 현재 버전: useCustomLogin의 doLogin 훅을 사용 → 로직 중복 제거
import useCustomLogin from "../../hooks/useCustomLogin.jsx"; // 로그아웃 기능이 포함된 커스텀 훅

const LogoutComponent = () => {

  const {doLogout, moveToPath} = useCustomLogin()
  // doLogout: dispatch(logout()) → 쿠키 삭제 + Redux store 초기화
  // moveToPath: 특정 경로로 이동하는 함수

  //const dispatch = useDispatch()

  const handleClickLogout = () => {
    // LOGOUT 버튼 클릭 시 로그아웃 처리
    doLogout() // 쿠키 삭제 + Redux loginSlice 초기화 → isLogin = false
    alert('로그아웃되었습니다.')
    moveToPath("/") // 메인 페이지로 이동
  }


  return (
    <div className={"border-2 border-red-200 mt-10 m-2 p-4"}>
      <div className={"flex justify-center"}>
        <div className={"text-4xl m-4 p-4 font-extrabold text-red-500"}>
          Logout Component
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full justify-center"}>
          <div className={"w-2/5 p-6 flex justify-center font-bold"}>
            <button className={"rounded p-4 w-36 bg-red-500 text-xl text-white"} onClick={handleClickLogout}>LOGOUT</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LogoutComponent
