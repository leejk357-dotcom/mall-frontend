// [역할] 상품 상세 조회 UI 컴포넌트. pno props로 getOne() API를 호출해 상품명·설명·전체 이미지(원본)를 표시하며 수정/목록 이동 버튼을 제공한다.
import {getOne} from "../../api/productsApi.jsx"; // 특정 상품 조회 API 함수
import {API_SERVER_HOST} from "../../api/todoApi.jsx"; // Spring 서버 호스트 주소 (이미지 URL 조합용)
import useCustomMove from "../../hooks/useCustomMove.jsx"; // 페이지 이동 커스텀 훅
import {useEffect, useState} from "react"; // 부수효과(API 호출)와 상태 관리 훅
import FetchingModal from "../common/FetchingModal.jsx"; // 로딩 중 표시할 모달 컴포넌트
import useCustomCart from "../../hooks/useCustomCart.jsx"; // 장바구니 조회·변경 커스텀 훅
import useCustomLogin from "../../hooks/useCustomLogin.jsx"; // 로그인 상태 커스텀 훅 (email 등 로그인 정보 접근용)

const initState = {
  // 서버 데이터를 받기 전 초기 상태 (ProductDTO 구조와 동일)
  pno: 0,
  pname: '',
  pdesc: '',
  price: 0,
  uploadFileNames: [] // 이미지 파일명 배열
}

const host = API_SERVER_HOST // 이미지 URL 조합에 사용

const ReadComponent = ({pno}) => {
  // pno: 라우트 파라미터에서 받은 상품 번호 (ReadPage.jsx에서 useParams로 추출해 전달)

  const [product, setProduct] = useState(initState); // 서버에서 받은 ProductDTO 저장
  const {moveToList, moveToModify} = useCustomMove() // 목록/수정 페이지 이동 함수
  const [fetching, setFetching] = useState(false) // 로딩 중 여부
  const {changeCart, cartItems} = useCustomCart() // changeCart: 장바구니 항목 추가·수량 변경, cartItems: 현재 장바구니 목록
  const {loginState} = useCustomLogin() // loginState.email: 장바구니 담기 시 사용자 식별용

  const handleClickAddCart = () => {
    // Add Cart 버튼 클릭 시 장바구니에 상품 추가 처리
    let qty = 1 // 기본 수량 1로 시작
    const addedItem = cartItems.filter(item => item.pno === parseInt(pno))[0]
    // 이미 장바구니에 담긴 동일 상품 찾기 (pno 일치 여부로 판단, 없으면 undefined)

    if(addedItem) {
      // 이미 장바구니에 있는 상품이면 수량 증가 여부 사용자에게 확인
      if(window.confirm("이미 추가된 상품입니다. 추가하시겠습니까?") === false) {
        return // 취소 시 아무 동작 없이 종료
      }
      qty = addedItem.qty + 1 // 기존 수량에 1 추가
    }
    changeCart({email: loginState.email, pno:pno, qty:qty})
    // Redux thunk → Spring /api/cart/change POST 호출 → 장바구니 항목 추가 또는 수량 업데이트
  }

  useEffect(() => {
    // pno가 변경될 때마다 해당 상품 데이터를 서버에서 조회
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFetching(true) // 로딩 모달 표시
    getOne(pno).then(data => {

      setProduct(data) // 서버 응답(ProductDTO)으로 state 업데이트
      setFetching(false) // 로딩 모달 숨김

    })
  }, [pno]) // 의존성 배열: pno가 변경될 때만 실행

  return (
    <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>

      {fetching ? <FetchingModal/> : <></>}
      {/* 로딩 중이면 FetchingModal 표시 */}

      <div className={"flex justify-center mt-10"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>PNO</div>
          <div className={"w-4/5 p-6 rounded-r border border-solid shadow-md"}>{product.pno}</div>
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>PNAME</div>
          <div className={"w-4/5 p-6 rounded-r border border-solid shadow-md"}>{product.pname}</div>
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>PDESC</div>
          <div className={"w-4/5 p-6 rounded-r border border-solid shadow-md"}>{product.pdesc}</div>
        </div>
      </div>

      <div className={"w-full justify-center flex flex-col m-auto items-center"}>
        {product.uploadFileNames.map((imgFile, i) =>
        <img alt={"product"} key={i} className={"p-4 w-1/2"} src={`${host}/api/products/view/${imgFile}`}/> )}
        {/* uploadFileNames 전체를 렌더링 (목록에서는 첫 번째만 보여줬지만 상세에서는 전부 표시) */}
        {/* 썸네일 접두사 없이 원본 이미지 표시 (목록의 s_ 접두 썸네일과 달리 원본) */}
      </div>

      <div className={"flex justify-end p-4"}>
        <button type={"button"} className={"inline-block rounded p-4 m-2 text-xl w-32 text-white bg-green-500"}
                onClick={handleClickAddCart}>
          Add Cart
        </button>
      </div>
      <div className={"flex justify-end p-4"}>
        <button type={"button"} className={"inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"}
                onClick={() => moveToModify(pno)}>Modify</button>
        {/* 수정 페이지로 이동 (/products/modify/pno) */}
        <button type={"button"} className={"rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"}
                onClick={moveToList}>List</button>
        {/* 목록 페이지로 이동 (현재 page, size 유지) */}
      </div>
    </div>
  )

}

export default ReadComponent;
