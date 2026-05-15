// [역할] 상품 목록 페이지(/products/list). IndexPage의 Outlet에 렌더링되며 실제 데이터 조회·페이지네이션은 ListComponent에 위임한다.
import ListComponent from "../../components/products/ListComponent.jsx"; // 상품 목록 컴포넌트

const ListPage = () => {
  // 상품 목록 페이지 (/products/list) → IndexPage의 Outlet 위치에 렌더링됨
  // 실제 데이터 조회 및 페이지네이션 처리는 ListComponent에서 담당

  return (
    <div className={"p-4 w-full bg-white"}>
      <div className={"text-3xl font-extrabold"}>
        Products List Page
      </div>
      <ListComponent />
      {/* ListComponent: URL에서 page, size를 읽어 getList() 호출 → 상품 카드 목록 + 페이지네이션 */}
    </div>
  );
}

export default ListPage;
