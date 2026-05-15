// [역할] 회원 정보 수정 UI 컴포넌트. Redux store의 로그인 정보로 폼을 초기화하고 modifyMember() API 호출 후 자동 로그아웃·로그인 페이지로 이동한다.
import {useEffect, useState} from "react"; // 부수효과(초기화)와 상태 관리 훅
import {useSelector} from "react-redux"; // Redux store에서 로그인 상태 읽기
import {modifyMember} from "../../api/memberApi.jsx"; // 회원 정보 수정 API 함수
import useCustomLogin from "../../hooks/useCustomLogin.jsx"; // 로그인 관련 커스텀 훅
import ResultModal from "../common/ResultModal.jsx"; // 결과 모달 컴포넌트

const initState = {
  // 회원 정보 폼의 초기 상태
  email: '',
  pw: '',
  nickname: ''
}

const ModifyComponent = () => {
  const [member, setMember] = useState(initState); // 수정 중인 회원 정보 state
  const loginInfo = useSelector(state => state.loginSlice)
  // Redux store에서 현재 로그인 정보 읽기 → { email, nickName, accessToken, ... }

  const{moveToLogin, doLogout} = useCustomLogin()
  // moveToLogin: 로그인 페이지로 이동, doLogout: 로그아웃 처리
  const[result, setResult] = useState() // 수정 결과 (undefined: 모달 숨김, 'Modified': 모달 표시)

  /*useEffect(() => {
    setMember({...loginInfo, pw: 'ABCD'})
  }, [loginInfo])*/
  // 이전 버전: loginInfo를 직접 스프레드 → nickname 필드가 없으면 uncontrolled input 경고 발생

  useEffect(() => {
    // loginInfo가 변경될 때마다 폼을 로그인 정보로 초기화
    setMember({
      ...initState,   // ← 기본값 먼저 (nickname: '' 등 누락 필드를 initState로 보장)
      ...loginInfo,   // ← loginInfo로 덮어씀 (email 등 실제 값 채우기)
      pw: 'ABCD' // 보안상 실제 비밀번호를 클라이언트에 전달하지 않으므로 임시값으로 초기화
    })
  }, [loginInfo]) // 의존성: loginInfo가 변경될 때만 실행 (새로고침 후 쿠키 복원 시에도 실행)

  const handleChange = (e) => {
    // 입력 필드 변경 시 member state 업데이트 (controlled input)
    setMember({...member, [e.target.name]: e.target.value})
  }

  const handleClickModify = () => {
    // Modify 버튼 클릭 시 회원 정보 수정 처리
    modifyMember(member).then(result => {
      // jwtAxios로 PUT /api/member/modify 요청 → Spring @PreAuthorize("hasRole('USER')") 통과 필요
      setResult('Modified') // 모달 표시용 결과 state 설정
    })
  }

  const closeModal = () => {
    // 모달 닫기 후 로그아웃 + 로그인 페이지로 이동
    setResult(null)
    doLogout() // 회원 정보가 변경되었으므로 기존 JWT 토큰 무효화 → 다시 로그인하도록 로그아웃 처리
    moveToLogin() // 로그인 페이지로 이동
  }

  return (
      <div className={"mt-6"}>

        {result? <ResultModal title={'회원정보'} content={'정보수정완료'} callbackFn={closeModal}></ResultModal> : <></> }
        {/* result가 있으면('Modified') 모달 표시 */}

        <div className={"flex justify-center"}>
          <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
            <div className={"w-1/5 p-6 text-right font-bold"}>Email</div>
            <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                   name={"email"} type={"text"} value={member.email} readOnly></input>
            {/* readOnly: 이메일은 수정 불가 (회원 식별자이므로 변경 금지) */}
          </div>
        </div>

        <div className={"flex justify-center"}>
          <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
            <div className={"w-1/5 p-6 text-right font-bold"}>Password</div>
            <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                   name={"pw"} type={"password"} value={member.pw} onChange={handleChange}></input>
            {/* type="password": 입력 내용 마스킹, 초기값 'ABCD'는 실제 비밀번호 아님 → 사용자가 직접 새 비밀번호 입력 */}
          </div>
        </div>

        <div className={"flex justify-center"}>
          <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
            <div className={"w-1/5 p-6 text-right font-bold"}>Nickname</div>
            <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                   name={"nickname"} type={"text"} value={member.nickname} onChange={handleChange}></input>
          </div>
        </div>

        <div className={"flex justify-center"}>
          <div className={"relative mb-4 flex w-full flex-wrap justify-end"}>
            <button type={"button"} className={"rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"}
            onClick={handleClickModify}>Modify</button>
          </div>
        </div>
      </div>
  )
}

export default ModifyComponent;
