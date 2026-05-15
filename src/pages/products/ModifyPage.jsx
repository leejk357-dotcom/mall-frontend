// [역할] 상품 수정 페이지(/products/modify/:pno). URL에서 pno를 추출해 ModifyComponent에 전달하고 IndexPage의 Outlet에 렌더링된다.
import {useParams} from "react-router-dom"; // URL 경로 파라미터를 읽는 훅
import ModifyComponent from "../../components/products/ModifyComponent.jsx"; // 상품 수정 폼 컴포넌트

const ModifyPage = () => {
  // 상품 수정 페이지 (/products/modify/:pno) → IndexPage의 Outlet 위치에 렌더링됨

  const {pno} = useParams()
  // URL 경로 파라미터에서 pno 추출 (문자열)
  // 예: /products/modify/5 → pno = "5"

  return (
    <div className={"p-4 w-full bg-white"}>
      <div className={"text-3xl font-extrabold"}>
        Products Modify Page
      </div>

      <ModifyComponent pno={pno}/>
      {/* pno를 ModifyComponent에 props로 전달 → getOne(pno)로 기존 데이터 로드 + 수정/삭제 처리 */}
    </div>
  )
}

export default ModifyPage;
