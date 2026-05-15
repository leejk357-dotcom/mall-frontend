// [역할] 상품 등록 페이지(/products/add). IndexPage의 Outlet에 렌더링되며 FormData 구성·multipart POST·결과 모달은 AddComponent에 위임한다.
import AddComponent from "../../components/products/AddComponent.jsx"; // 상품 등록 폼 컴포넌트

const AddPage = () => {
  // 상품 등록 페이지 (/products/add) → IndexPage의 Outlet 위치에 렌더링됨
  // 실제 등록 로직(FormData 구성, postAdd API 호출, 결과 모달)은 AddComponent에서 담당

  return (
    <div className={"p-4 w-full bg-white"}>
      <div className={"text-3xl font-extrabold"}>
        Products Add Page
      </div>
      <AddComponent />
      {/* AddComponent: pname/pdesc/price 입력 + 파일 선택 → ADD → FormData로 multipart/form-data POST */}
    </div>
  )
}

export default AddPage;
