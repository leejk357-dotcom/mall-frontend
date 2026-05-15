// [역할] 상품 상세 조회 페이지(/products/read/:pno). URL에서 pno를 추출해 ReadComponent에 전달하고 IndexPage의 Outlet에 렌더링된다.
import {useParams} from "react-router-dom"; // URL 경로 파라미터를 읽는 훅
import ReadComponent from "../../components/products/ReadComponent.jsx"; // 상품 상세 조회 컴포넌트

const ReadPage = () => {
  // 상품 상세 조회 페이지 (/products/read/:pno) → IndexPage의 Outlet 위치에 렌더링됨

  const {pno} = useParams()
  // URL 경로 파라미터에서 pno 추출 (문자열)
  // 예: /products/read/5 → pno = "5"

  return (
    <div className={"p-4 w-full bg-white"}>
      <div className={"text-3xl font-extrabold"}>
        Products Read Page
      </div>
      <ReadComponent pno={pno}></ReadComponent>
      {/* pno를 ReadComponent에 props로 전달 → getOne(pno) API 호출로 상세 데이터 조회 */}
    </div>
  )
}

export default ReadPage;
