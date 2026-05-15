// [역할] 로그인 폼 UI 컴포넌트. email·pw 입력과 LOGIN 버튼으로 useCustomLogin의 doLogin()을 호출하며 KakaoLoginComponent(카카오 로그인 버튼)도 함께 렌더링한다.
import {useState} from "react"; // 상태 관리 훅
import {useDispatch} from "react-redux"; // Redux action 실행 훅 (import되었지만 useCustomLogin 내부에서 사용)
import {login, loginPostAsync} from "../../slice/loginSlice.jsx"; // (import되었지만 useCustomLogin의 doLogin 사용)
import {useNavigate} from "react-router-dom"; // (import되었지만 useCustomLogin의 moveToPath 사용)
import useCustomLogin from "../../hooks/useCustomLogin.jsx"; // 로그인 관련 공통 기능 커스텀 훅
import KakaoLoginComponent from "./KakaoLoginComponent.jsx"; // 카카오 로그인 버튼 컴포넌트

const initState = {
  // 로그인 폼의 초기 상태
  email: '',
  pw: ''
}

const LoginComponent = () => {

  const [loginParam, setLoginParam] = useState({...initState});
  // 로그인 폼의 email, pw 입력 값 state

  const {doLogin, moveToPath} = useCustomLogin()
  // doLogin: loginPostAsync → Spring /api/member/login POST 호출 → JWT 토큰 반환
  // moveToPath: 특정 경로로 이동하는 함수

  const handleChange = (e) => {
    // 입력 필드 변경 시 loginParam state 업데이트 (controlled input)
    setLoginParam({...loginParam, [e.target.name]: e.target.value})
    // [e.target.name]: 동적 키 → name="email"이면 loginParam.email 업데이트
  }

  const handleClickLogin = (e) => {
    // LOGIN 버튼 클릭 시 로그인 처리
    doLogin(loginParam)
      // doLogin은 loginPostAsync → Spring 서버에 인증 요청 → { email, nickName, accessToken, refreshToken, error? } 반환
      .then(data => {
        console.log(data)

        if(data.error) {
          alert("이메일과 패스워드를 다시 확인하세요")
          // Spring APILoginFailHandler에서 보낸 에러 응답 (error 필드 존재)
        }else {
          alert("로그인 성공")
          moveToPath('/') // 메인 페이지로 이동 (replace:true → 뒤로가기 방지)
        }
      })
  }

  return (
    <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>
      <div className={" flex justify-center"}>
        <div className={"text-4xl m-4 p-4 font-extrabold text-blue-500"}>Login Component</div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-full p-3 text-left font-bold"}>Email</div>
          <input className={"w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"}
                 name={"email"} type={"text"} value={loginParam.email} onChange={handleChange}></input>
          {/* controlled input: value + onChange 조합으로 React가 입력 값 제어 */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-full p-3 text-left font-bold"}>Password</div>
          <input className={"w-full p-3 rounded-r border border-solid border-neutral-500 shadow-md"}
                 name={"pw"} type={"password"} value={loginParam.pw} onChange={handleChange}></input>
          {/* type="password": 입력 내용이 마스킹되어 표시됨 */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full justify-center"}>
          <div className={"w-2/5 p-6 flex justify-center font-bold"}>
            <button className={"rounded p-4 w-36 bg-blue-500 text-xl text-white"} onClick={handleClickLogin}>LOGIN</button>
          </div>
        </div>
      </div>
      <KakaoLoginComponent/>
      {/* 카카오 로그인 버튼: 클릭 시 카카오 인증 페이지로 이동 */}
    </div>
  )
}

export default LoginComponent;
