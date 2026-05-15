// [역할] Todo 목록 UI 컴포넌트. useCustomMove로 URL의 page/size를 읽어 getList() API를 호출하고 Todo 카드 목록과 PageComponent 페이지네이션을 렌더링한다.
import {useEffect, useState} from "react"; // 부수효과(API 호출)와 상태 관리 훅
import {getList} from "../../api/todoApi.jsx"; // Todo 목록 조회 API 함수
import useCustomMove from "../../hooks/useCustomMove.jsx"; // 페이지 이동 및 페이지네이션 커스텀 훅
import PageComponent from "../common/PageComponent.jsx"; // 페이지네이션 UI 컴포넌트

const initState = {
  // 서버에서 데이터를 받기 전 초기 상태 (PageResponseDTO 구조와 동일)
  dtoList: [], // Todo 항목 배열 (처음엔 빈 배열)
  pageNumList: [], // 표시할 페이지 번호 배열
  pageRequestDTO: null, // 요청 파라미터 정보
  prev: false, // 이전 페이지 그룹 존재 여부
  next: false, // 다음 페이지 그룹 존재 여부
  totalCount: 0, // 전체 Todo 개수
  prevPage: 0, // 이전 그룹의 마지막 페이지 번호
  nextPage: 0, // 다음 그룹의 첫 번째 페이지 번호
  totalPage: 0, // 전체 페이지 수
  current: 0 // 현재 페이지 번호
}

const ListComponent = () => {
  const {page, size, refresh, moveToList, moveToRead} = useCustomMove();
  // page, size: URL 쿼리스트링에서 읽은 현재 페이지 번호와 페이지 크기
  // refresh: 목록 새로고침 트리거 (boolean toggle)
  // moveToList: 페이지 이동 함수, moveToRead: 상세 페이지 이동 함수

  const [serverData, setServerData] = useState(initState)
  // 서버에서 받은 PageResponseDTO를 저장하는 state

  useEffect(() => {
    // page, size, refresh가 변경될 때마다 API 호출
    // 페이지 번호 클릭 → URL 변경 → page/size 변경 → useEffect 재실행 → 새 데이터 로드
    // moveToList 호출 후 refresh 토글 → useEffect 재실행 → 목록 갱신
    getList({page, size}).then(data => {
      console.log(data);
      setServerData(data); // 서버 응답으로 state 업데이트 → 컴포넌트 재렌더링
    })
  }, [page, size, refresh]) // 의존성 배열: 이 값들이 변경될 때만 실행

  return (
    <div className={"border-2 border-blue-100 mt-10 mr-2 ml-2"}>

      <div className={"flex flex-wrap mx-auto justify-center p-6"}>

        {serverData.dtoList.map(todo =>
          // dtoList의 각 TodoDTO를 카드 형태로 렌더링
          <div key={todo.tno} className={"w-full min-w-[400px] p-2 m-2 rounded shadow-md"} onClick={() => moveToRead(todo.tno)}>
            {/* key={todo.tno}: React 리스트 렌더링 최적화 (각 항목 고유 식별) */}
            {/* onClick: 카드 클릭 시 해당 Todo 상세 페이지로 이동 */}
            <div className={"flex"}>
              <div className={"font-extrabold text-2xl p-2 w-1/12"}>
                {todo.tno} {/* Todo 번호 */}
              </div>
              <div className={"text-1xl m-2 p-2 w-8/12 font-extrabold"}>
                {todo.title} {/* Todo 제목 */}
              </div>
              <div className={"text-1xl m-1 p-2 w-2/10 font-medium"}>
                {todo.dueDate} {/* 마감일 (Spring에서 @JsonFormat으로 "yyyy-MM-dd" 형식으로 직렬화) */}
              </div>
            </div>
          </div>)}
      </div>
      <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
      {/* PageComponent: prev/pageNumList/next 버튼 렌더링, 클릭 시 moveToList 호출 */}
    </div>
  );
}

export default ListComponent;
