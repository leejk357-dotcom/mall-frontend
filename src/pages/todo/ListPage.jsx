// [역할] Todo 목록 페이지(/todo/list). IndexPage의 Outlet에 렌더링되며 실제 데이터 조회·페이지네이션은 ListComponent에 위임한다.
import {useSearchParams} from "react-router-dom"; // (import되었지만 현재 미사용 - 아래 주석 처리된 코드에서 사용)
import ListComponent from "../../components/todo/ListComponent.jsx"; // Todo 목록 컴포넌트

const ListPage = () => {
  // Todo 목록 페이지 (/todo/list) → IndexPage의 Outlet 위치에 렌더링됨
  // 실제 데이터 조회 및 페이지네이션 처리는 ListComponent에서 담당

  /*const [queryParams] = useSearchParams();

  const page = queryParams.get('page')? parseInt(queryParams.get('page')) : 1;
  const size = queryParams.get('size')? parseInt(queryParams.get('size')) : 10;*/
  // 이전 버전: 페이지 파라미터를 ListPage에서 직접 읽어 ListComponent에 전달
  // 현재 버전: ListComponent 내부의 useCustomMove 훅이 URL 파라미터를 직접 읽음 → 더 간결

  return (
    <div className={"p-4 w-full bg-white"}>
      <div className={"text-3xl font-extrabold"}>Todo List Page Component</div>
      <ListComponent />
      {/* ListComponent: URL에서 page, size를 읽어 getList() 호출 → 목록 렌더링 + 페이지네이션 */}
    </div>
  );
}

export default ListPage;
