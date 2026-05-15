// [역할] Todo 상세 조회 페이지(/todo/read/:tno). URL에서 tno를 추출해 ReadComponent에 전달하고 IndexPage의 Outlet에 렌더링된다.
import {useParams, useNavigate, createSearchParams, useSearchParams} from "react-router-dom";
// useParams: URL 경로 파라미터를 읽는 훅 (예: /todo/read/:tno → {tno: "33"})
// useNavigate, createSearchParams, useSearchParams: (import되었지만 현재 미사용 - 아래 주석 처리된 코드에서 사용)
import {useCallback} from "react"; // (import되었지만 현재 미사용)
import ReadComponenetItem from "../../components/todo/ReadComponent.jsx" // (import되었지만 미사용 - 아래 ReadComponenet 사용)
import ReadComponenet from "../../components/todo/ReadComponent.jsx"; // Todo 상세 조회 컴포넌트

const ReadPage = () => {
  // Todo 상세 조회 페이지 (/todo/read/:tno) → IndexPage의 Outlet 위치에 렌더링됨

  const {tno} = useParams();
  // URL 경로 파라미터에서 tno 추출 (문자열)
  // 예: /todo/read/33 → tno = "33"

/*  const navigate = useNavigate();
  const [queryParams] = useSearchParams();
  const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1;
  const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10;

  const queryStr = createSearchParams({page, size}).toString();

  const moveToModify = useCallback((tno) => {
    navigate({
      pathname: `/todo/modify/${tno}`,
      search: queryStr
    })
  }, [navigate, queryStr])

  const moveToList = useCallback(() => {
    navigate({
      pathname: `/todo/list`,
      search: queryStr
    })
  }, [navigate, queryStr])*/
  // 이전 버전: 페이지 이동 로직을 ReadPage에서 직접 구현 → ReadComponent에 콜백으로 전달
  // 현재 버전: ReadComponent 내부의 useCustomMove 훅이 이동 처리 → 더 간결

  return (
    <div className={"font-extrabold w-full bg-white mt-6"}>
      <div className={"text-2xl"}>Todo Read Page Component {tno}
        {/*<div>
          <button onClick={() => moveToModify(tno)}>Test Modify</button>
          <button onClick={() => moveToList()}>Test List</button>
        </div>*/}
      </div>
      <ReadComponenet tno = {tno}></ReadComponenet>
      {/* tno를 ReadComponent에 props로 전달 → getOne(tno) API 호출로 상세 데이터 조회 */}
    </div>
  );
}

export default ReadPage;
