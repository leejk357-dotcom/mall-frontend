// [역할] 장바구니 관련 공통 기능 커스텀 훅. Redux store의 cartSlice 상태 읽기(cartItems)와 장바구니 조회(refreshCart)·변경(changeCart) dispatch를 하나의 훅으로 제공하여 컴포넌트 간 장바구니 로직 중복을 제거한다.
import {useDispatch, useSelector} from "react-redux"; // Redux store 접근 훅
import {useCallback} from "react"; // 함수 메모이제이션 훅 (의존성이 바뀌지 않으면 함수 재생성 방지)
import {getCartItemsAsync, postChangeCartAsync} from "../slice/cartSlice.jsx"; // 장바구니 조회·변경 Redux thunk

const useCustomCart = () => {
  // 장바구니 관련 공통 기능을 묶은 커스텀 훅
  // CartComponent, ReadComponent(상품 상세) 등 여러 컴포넌트에서 공통으로 사용

  const cartItems = useSelector(state => state.cartSlice)
  // Redux store에서 cartSlice 상태 읽기 → 장바구니 항목 배열 (CartItemDTO[])
  // store.jsx에서 "cartSlice": cartSlice 로 등록했으므로 state.cartSlice로 접근

  const dispatch = useDispatch(); // Redux action을 실행하는 함수

  const refreshCart = useCallback(() => {
    // 장바구니 항목 전체를 서버에서 다시 조회하는 함수
    // CartComponent의 useEffect에서 isLogin 변경 시 호출 → 로그인 후 장바구니 목록 동기화
    dispatch(getCartItemsAsync())
  }, [dispatch]) // 의존성: dispatch는 변경되지 않으므로 함수를 재생성하지 않음

  const changeCart = useCallback((param) => {
    // 장바구니 항목을 추가하거나 수량을 변경하는 함수
    // param = { email, pno, qty } → postChangeCartAsync → Spring /api/cart/change POST
    dispatch(postChangeCartAsync(param))
  }, [dispatch])

  return {cartItems, refreshCart, changeCart}
  // 훅 사용 예시:
  // const { cartItems, refreshCart, changeCart } = useCustomCart()
  // cartItems: 현재 장바구니 항목 배열, refreshCart: 목록 새로고침, changeCart: 항목 추가·변경
}

export default useCustomCart;
