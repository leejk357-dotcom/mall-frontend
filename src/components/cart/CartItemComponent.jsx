// [역할] 장바구니 항목 개별 UI 컴포넌트. 상품 썸네일·이름·가격·수량을 표시하며 +/-로 수량 조절, X 버튼으로 항목 전체 삭제를 changeCart로 처리한다.
import {API_SERVER_HOST} from "../../api/todoApi.jsx"; // Spring 서버 호스트 주소 (이미지 URL 조합용)

const host = API_SERVER_HOST // 이미지 URL 조합에 사용 (예: http://localhost:8082)

const CartItemComponent = ({cino, pname, price, pno, qty, imageFile, changeCart, email}) => {
  // cino: 장바구니 항목 번호, pname: 상품명, price: 가격, pno: 상품번호
  // qty: 현재 수량, imageFile: 대표 이미지 파일명
  // changeCart: 수량 변경·삭제 함수 (useCustomCart의 changeCart), email: 사용자 이메일 (사용자 식별용)

  const handleClickQty = (amount) => {
    // 수량 버튼(+/- 또는 X) 클릭 시 장바구니 항목 수량 변경 처리
    // amount: +1(증가), -1(감소), -qty(전체 삭제 → qty가 0이 되면 Spring에서 항목 삭제)
    changeCart({email, cino: cino, pno: pno, qty: qty+amount})
    // Spring /api/cart/change POST → qty <= 0이면 해당 CartItem 삭제, 아니면 수량 업데이트
  }

  return (
    <li key={cino} className={"border-2"}>
      {/* li: 장바구니 목록(ul)의 개별 항목 */}
      <div className={"w-full border-2"}>
        <div className={"m-1 p-1"}>
          <img src={`${host}/api/products/view/s_${imageFile}`}/>
          {/* 썸네일 이미지: s_ 접두사(서버에서 생성한 축소 이미지) */}
        </div>

        <div className={"justify-center p-2 text-xl"}>
          <div className={"justify-end w-full"}>
          </div>
          <div>Cart Item No: {cino}</div>
          <div>Pno: {pno}</div>
          <div>Name: {pname}</div>
          <div>Price: {price}</div>
          <div className={"flex"}>
            <div className={"w-2/3"}>
              Qty: {qty}
            </div>
            <div>
              <button className={"m-1 p-1 text-2xl bg-orange-500 w-8 rounded-lg"} onClick={() => handleClickQty(1)}>
                + {/* 수량 1 증가 */}
              </button>
              <button className={"m-1 p-1 text-2xl bg-orange-500 w-8 rounded-lg"} onClick={() => handleClickQty(-1)}>
                - {/* 수량 1 감소 (qty가 1이면 0이 되어 Spring에서 항목 삭제) */}
              </button>
            </div>
          </div>
          <div>
            <div className={"flex text-white font-bold p-2 justify-center"}>
              <button className={"m-1 p-1 text-xl text-white bg-red-500 w-8 rounded-lg"} onClick={() => handleClickQty(-1*qty)}>
                X {/* 전체 삭제: qty를 0으로 만들어 Spring에서 해당 CartItem 삭제 */}
              </button>
            </div>
            <div className={"font-extrabold border-t-2 text-right m-2 pr-4"}>
              {qty * price} 원 {/* 해당 항목의 소계 (수량 × 단가) */}
            </div>
          </div>
        </div>

      </div>
    </li>
  )
}

export default CartItemComponent
