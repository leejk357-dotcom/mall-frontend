// [역할] 로그인 상태 Redux 슬라이스. createAsyncThunk로 Spring 서버 로그인 API를 비동기 호출하고, 결과를 쿠키와 store에 저장하며 페이지 새로고침 시 쿠키에서 상태를 복원한다.
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"; // Redux Toolkit 핵심 함수들
import {loginPost} from "../api/memberApi.jsx"; // Spring 서버 /api/member/login에 POST 요청하는 함수
import {getCookie, removeCookie, setCookie} from "../util/cookieUtil.jsx"; // 쿠키 읽기·쓰기·삭제 유틸리티

const initState = {
  email: '' // 로그인하지 않은 초기 상태 (이메일이 빈 문자열 → 비로그인)
}

const loadMemberCookie = () => {
  // 페이지 새로고침 시 쿠키에서 로그인 정보를 복원하는 함수
  // → Redux store는 새로고침 시 초기화되지만 쿠키는 유지되므로 쿠키에서 복원
  const memberInfo = getCookie("member") // "member" 쿠키에서 로그인 정보 가져옴

  if(memberInfo && memberInfo.nickName) {
    memberInfo.nickName = decodeURIComponent(memberInfo.nickName)
    // 쿠키에 저장 시 한글 닉네임이 URL 인코딩되므로 디코딩 처리
  }

  return memberInfo; // 쿠키가 없으면 undefined 반환 → initialState로 initState 사용
}

export const loginPostAsync = createAsyncThunk('loginPostAsync', (param) => {
  // createAsyncThunk: 비동기 작업(API 호출 등)을 Redux action으로 감싸는 함수
  // 'loginPostAsync': action type의 접두사 (fulfilled → 'loginPostAsync/fulfilled')
  // param: doLogin(loginParam)에서 전달된 { email, pw } 객체
  return loginPost(param); // Spring 서버에 로그인 POST 요청 → Promise 반환
})

const loginSlice = createSlice({
  name: 'LoginSlice', // Redux DevTools에 표시될 슬라이스 이름
  initialState: loadMemberCookie() || initState,
  // 쿠키에 로그인 정보가 있으면 복원, 없으면 initState({ email: '' }) 사용
  reducers: {
    login: (state, action) => {
      // 직접 dispatch(login(memberInfo)) 호출 시 실행 (카카오 로그인에서 사용)
      console.log("login....")

      const payload = action.payload // dispatch에 전달된 로그인 정보

      setCookie("member", JSON.stringify(payload), 1) // 로그인 정보를 "member" 쿠키에 1일 동안 저장
      return payload // store의 loginSlice 상태를 payload로 교체
    },
    logout: (state, action) => {
      // dispatch(logout()) 호출 시 실행
      console.log("logout....")

      removeCookie("member") // "member" 쿠키 삭제

      return {...initState} // store의 loginSlice 상태를 초기값({ email: '' })으로 리셋
    }
  },
  extraReducers: (builder) => {
    // extraReducers: createAsyncThunk로 만든 비동기 action의 결과를 처리
    builder.addCase(loginPostAsync.fulfilled, (state, action) => {
      // fulfilled: API 요청 성공 시 실행
      console.log("fulfilled")

      const payload = action.payload; // Spring 서버가 반환한 로그인 결과 (JWT 토큰 + 사용자 정보)

      if(!payload.error){
        // error 필드가 없으면 정상 로그인 성공
        setCookie("member", JSON.stringify(payload), 1) // 로그인 정보를 쿠키에 1일 저장
      }

      return payload; // store 상태 업데이트 (error가 있어도 payload 반환 → 컴포넌트에서 error 확인)

    }).addCase(loginPostAsync.pending, (state, action) => {
      // pending: API 요청 진행 중 (로딩 상태 표시에 활용 가능)
      console.log("pending")
    }).addCase(loginPostAsync.rejected, (state, action) => {
      // rejected: API 요청 실패 (네트워크 오류 등)
      console.log("rejected")
    })
  }
})

export const {login, logout} = loginSlice.actions; // 컴포넌트에서 dispatch할 수 있는 action creator 내보내기

export default loginSlice.reducer // store에 등록할 reducer 내보내기
