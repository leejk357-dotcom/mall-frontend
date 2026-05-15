// [역할] 장바구니 상태 Redux 슬라이스. createAsyncThunk로 장바구니 조회(getCartItemsAsync)와 변경(postChangeCartAsync) API를 비동기 호출하고, fulfilled 결과로 store의 장바구니 배열을 업데이트한다.
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit"; // Redux Toolkit 핵심 함수들
import {getCartItems, postChangeCart} from "../api/cartApi.jsx"; // 장바구니 조회·변경 API 함수

export const getCartItemsAsync = createAsyncThunk('getCartItemsAsync', () => {
  // 장바구니 항목 전체 조회 thunk
  // CartComponent의 useEffect에서 로그인 시 호출 → 사이드바 장바구니 목록 갱신
  return getCartItems()
})

export const postChangeCartAsync = createAsyncThunk('postCartItemsAsync', (param) => {
  // 장바구니 항목 추가·수량 변경 thunk
  // param = { email, pno, qty } → postChangeCart → Spring /api/cart/change POST
  return postChangeCart(param)
})

const initState = [] // 장바구니 초기 상태 (빈 배열 → 로그인 전 또는 데이터 미로드 상태)

const cartSlice = createSlice({
  name: 'cartSlice', // Redux DevTools에 표시될 슬라이스 이름
  initialState: initState,
  // loginSlice와 달리 동기 reducers 없음 → 모든 상태 변경은 extraReducers(비동기 결과)로만 처리

  extraReducers: (builder) => {
    // extraReducers: createAsyncThunk로 만든 비동기 action의 결과를 처리
    builder.addCase(
      getCartItemsAsync.fulfilled, (state, action) => {
        // fulfilled: 장바구니 조회 API 성공 시 실행
        console.log("getCartItemsAsync fulfilled")
        // Array.isArray 방어: 토큰 갱신 race condition 등으로 payload가 배열이 아닐 경우 기존 state 유지
        return Array.isArray(action.payload) ? action.payload : state
      }
    )
      .addCase(
        postChangeCartAsync.fulfilled, (state, action) => {
          // fulfilled: 장바구니 변경 API 성공 시 실행
          console.log("postCartItemsAsync fulfilled")
          return Array.isArray(action.payload) ? action.payload : state
        }
      )
  }
})

export default cartSlice.reducer // store에 등록할 reducer 내보내기
