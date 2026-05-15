// [역할] Todo 수정 페이지(/todo/modify/:tno). URL에서 tno를 추출해 ModifyComponent에 전달하고 IndexPage의 Outlet에 렌더링된다.
import {createSearchParams, useNavigate, useParams, useSearchParams} from 'react-router-dom'
// useParams: URL 경로 파라미터를 읽는 훅 (예: /todo/modify/:tno → {tno: "33"})
// useNavigate, createSearchParams, useSearchParams: (import되었지만 현재 미사용 - 아래 주석 처리된 코드에서 사용)
import ModifyComponent from "../../components/todo/ModifyComponent.jsx"; // Todo 수정 폼 컴포넌트

const ModifyPage = () => {
  // Todo 수정 페이지 (/todo/modify/:tno) → IndexPage의 Outlet 위치에 렌더링됨

  const {tno} = useParams();
  // URL 경로 파라미터에서 tno 추출
  // 예: /todo/modify/33 → tno = "33"

/*  const navigate = useNavigate();
  const [queryParams] = useSearchParams();

  const page = queryParams.get("page") ? parseInt(queryParams.get("page")) : 1;
  const size = queryParams.get("size") ? parseInt(queryParams.get("size")) : 10;
  const queryStr = createSearchParams({page, size}).toString();


  const moveToRead = () => {
    navigate({pathname: `/todo/read/${tno}`, search: queryStr});
  }

  const moveToList = () => {
    navigate({pathname: `/todo/list`, search: queryStr});
  }*/
  // 이전 버전: 페이지 이동 로직을 ModifyPage에서 직접 구현 → ModifyComponent에 콜백으로 전달
  // 현재 버전: ModifyComponent 내부의 useCustomMove 훅이 이동 처리 → 더 간결


  return (
    <div className={"p-4 w-full bg-white"}>
    <div className={"text-3xl font-extrabold"}>Todo Modify Page</div>
      <ModifyComponent tno={tno}/>
      {/* tno를 ModifyComponent에 props로 전달 → getOne(tno)로 기존 데이터 로드 + 수정/삭제 처리 */}
    </div>
  );
}

export default ModifyPage;
