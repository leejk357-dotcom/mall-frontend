// [역할] 사이드바 장바구니 UI 컴포넌트. 로그인 상태일 때만 장바구니 목록(CartItemComponent)과 총합 금액을 렌더링하며, 로그인 시 자동으로 장바구니 항목을 조회한다.
import useCustomLogin from "../../hooks/useCustomLogin.jsx"; // 로그인 상태 확인 커스텀 훅
import {useDispatch, useSelector} from "react-redux"; // (import되었지만 useCustomCart 내부에서 처리 - 직접 미사용)
import {useEffect, useMemo} from "react"; // 부수효과(로그인 시 장바구니 조회)와 메모이제이션(총합 계산) 훅
import {getCartItemsAsync} from "../../slice/cartSlice.jsx"; // (import되었지만 useCustomCart의 refreshCart로 처리 - 직접 미사용)
import useCustomCart from "../../hooks/useCustomCart.jsx"; // 장바구니 조회·변경 커스텀 훅
import CartItemComponent from "../cart/CartItemComponent.jsx"; // 장바구니 항목 개별 UI 컴포넌트

const CartComponent = () => {
  // 사이드바에 표시되는 장바구니 컴포넌트 (BasicLayout의 <aside>에 배치)

  const {isLogin, loginState} = useCustomLogin()
  // isLogin: 로그인 여부, loginState.nickname: 사용자 닉네임 (장바구니 헤더 표시용)

  const {refreshCart, cartItems, changeCart} = useCustomCart()
  // cartItems: Redux store의 장바구니 항목 배열
  // refreshCart: 서버에서 장바구니 목록 재조회
  // changeCart: 장바구니 항목 추가·수량 변경

  const total = useMemo(() => {
    // 장바구니 항목들의 총 금액을 계산하는 메모이제이션 값
    // useMemo: cartItems가 변경될 때만 재계산 → 불필요한 재계산 방지
    let total = 0
    for(const item of cartItems) {
      total += item.price*item.qty // 각 항목의 (가격 × 수량)을 합산
    }
    return total
  },[cartItems]) // 의존성: cartItems가 변경될 때만 재계산

  useEffect(() => {
    // 로그인 상태가 변경될 때마다 실행 → 로그인 시 장바구니 목록 자동 조회
    if (isLogin) {
      refreshCart() // 로그인 상태이면 서버에서 장바구니 항목 가져오기
    }
  }, [isLogin, refreshCart]) // 의존성: isLogin 또는 refreshCart 변경 시 실행

  return (
    <div className={"w-full"}>
      {isLogin ?
        // 로그인 상태에서만 장바구니 내용 표시 (비로그인 시 빈 Fragment)
        <div className={"flex flex-col"}>
          <div className={"w-full flex"}>
            <div className={"font-extrabold text-2xl w-4/5"}>
              {loginState.nickname}'s Cart
              {/* 닉네임: loginState.nickname (쿠키의 nickName 필드) */}
            </div>
            <div
              className={"bg-orange-600 text-center text-white font-bold w-1/5 rounded-full m-1"}>{cartItems.length}</div>
            {/* 장바구니 항목 수 (배지) */}
          </div>

          <div>
            <ul>
              {cartItems.map(item =>
                // 각 장바구니 항목을 CartItemComponent로 렌더링
                <CartItemComponent {...item} key={item.cino} changeCart={changeCart} email={loginState.email} />)}
              {/* item의 모든 프로퍼티를 spread로 전달 + changeCart(수량 변경 함수) + email(사용자 식별) */}
            </ul>
          </div>
          <div>
            <div className={"text-2xl text-right font-extrabold"}>
              TOTAL: {total}
              {/* useMemo로 계산된 총 금액 (price × qty 합산) */}
            </div>
          </div>
        </div>

        : <></>
        // 비로그인 상태: 빈 Fragment (아무것도 표시하지 않음)
      }
    </div>
  )
}

export default CartComponent
