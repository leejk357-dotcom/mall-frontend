// [역할] 장바구니 CRUD axios API 함수 모음. jwtAxios를 사용해 Spring /api/cart/** 엔드포인트에 요청하며 장바구니 항목 조회와 추가·수량 변경을 처리한다.
import {API_SERVER_HOST} from "./todoApi.jsx"; // Spring 서버 호스트 주소 (todoApi.jsx에서 공통으로 export)
import jwtAxios from "../util/jwtUtil.jsx"; // JWT 인터셉터가 적용된 axios 인스턴스 (Authorization 헤더 자동 첨부)

const host = `${API_SERVER_HOST}/api/cart` // 장바구니 API의 기본 URL

export const getCartItems = async () => {
  // 현재 로그인한 사용자의 장바구니 항목 전체를 조회하는 함수
  // jwtAxios: Authorization 헤더에 JWT 토큰 자동 첨부 → Spring의 JWTCheckFilter를 통과
  const res = await jwtAxios.get(`${host}/items`)
  return res.data // 장바구니 항목 배열 (CartItemDTO[]) 반환
}

export const postChangeCart = async (cartItem) => {
  // 장바구니 항목을 추가하거나 수량을 변경하는 함수 (추가/증가/감소/삭제 모두 이 함수로 처리)
  // cartItem = { email, pno, qty } → qty가 0이면 Spring에서 해당 항목 삭제 처리
  const res = await jwtAxios.post(`${host}/change`, cartItem)
  return res.data // 변경 후 전체 장바구니 항목 배열 반환
}
