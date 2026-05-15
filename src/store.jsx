// [역할] Redux store 설정. loginSlice reducer를 등록하여 앱 전체의 로그인 상태를 단일 상태 트리로 관리한다.
import {configureStore} from "@reduxjs/toolkit"; // Redux Toolkit의 store 생성 함수 (보일러플레이트 최소화)
import loginSlice from "./slice/loginSlice.jsx"; // 로그인 상태 관리 슬라이스의 reducer
import cartSlice from "./slice/cartSlice.jsx"; // 장바구니 상태 관리 슬라이스의 reducer

export default configureStore({
  // Redux store 생성: 앱 전체의 상태를 하나의 객체 트리(state)로 관리
  reducer: {
    "loginSlice": loginSlice,
    // state.loginSlice로 접근 가능 → useSelector(state => state.loginSlice)
    // 여러 슬라이스가 있으면 여기에 추가 → state.productSlice, state.cartSlice 등
    "cartSlice" : cartSlice
    // state.cartSlice로 접근 가능 → useSelector(state => state.cartSlice)
  }
})
