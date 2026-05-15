// [역할] 페이지 이동 및 페이지네이션 상태 관리 커스텀 훅. URL 쿼리스트링에서 page/size를 읽고 목록·상세·수정 페이지 간 이동 함수와 새로고침 트리거를 제공하여 Todo·Product 컴포넌트에서 공통 사용한다.
import {createSearchParams, useNavigate, useSearchParams} from "react-router-dom";
// createSearchParams: 객체 → URL 쿼리스트링 변환
// useNavigate: 페이지 이동 함수
// useSearchParams: 현재 URL의 쿼리스트링 파라미터를 읽는 훅
import {useState} from "react"; // 상태 관리 훅

const getNum = (param, defaultValue) => {
  // 쿼리스트링 파라미터(문자열 또는 null)를 숫자로 변환하는 헬퍼 함수
  // queryParams.get('page')는 문자열 "1" 또는 파라미터 없으면 null 반환
  if(!param){
    return defaultValue; // null 또는 빈 문자열이면 기본값 반환
  }
  return parseInt(param) // 문자열 "1" → 숫자 1 변환
}

const useCustomMove = () => {
  // 목록/상세/수정 페이지 간 이동 및 페이지네이션 상태를 관리하는 커스텀 훅
  // Todo, Product 컴포넌트 모두에서 공통으로 사용 (중복 코드 제거)

  const navigate = useNavigate() // 페이지 이동 함수
  const [refresh, setRefresh] = useState(false)
  // refresh: 목록 새로고침 트리거 state
  // setRefresh(!refresh)로 값을 토글하면 이 훅을 사용하는 컴포넌트가 재렌더링됨 → useEffect 의존성으로 활용

  const[queryParams] = useSearchParams()
  // 현재 URL의 쿼리스트링 읽기 → /todo/list?page=2&size=10 → queryParams.get('page') = "2"

  const page = getNum(queryParams.get('page'), 1) // URL에서 page 파라미터 읽기 (없으면 기본값 1)
  const size = getNum(queryParams.get('size'), 10) // URL에서 size 파라미터 읽기 (없으면 기본값 10)

  const queryDefault = createSearchParams({page, size}).toString()
  // 현재 page, size를 쿼리스트링으로 변환 (예: "page=2&size=10")
  // 상세 → 목록으로 돌아갈 때 이전 페이지 상태를 유지하기 위해 사용

  const moveToList = (pageParam) => {
    // 목록 페이지로 이동하는 함수
    let queryString = ""

    if(pageParam) {
      // 새 페이지 파라미터가 있으면 (페이지 번호 클릭 등)
      const pageNum = getNum(pageParam.page, 1)
      const sizeNum = getNum(pageParam.size, 10)

      queryString = createSearchParams({page:pageNum, size: sizeNum}).toString()
      // 새 page, size로 쿼리스트링 생성

    }else{
      queryString = queryDefault // 파라미터 없으면 현재 page, size 유지
    }
    setRefresh(!refresh) // refresh state 토글 → 목록 컴포넌트의 useEffect가 다시 실행되어 데이터 새로고침

    navigate({pathname: `../list`, search: queryString})
    // 상대 경로 "../list" → 현재 경로가 /todo/read/33 이면 /todo/list 로 이동
    // search: 쿼리스트링 첨부 → /todo/list?page=2&size=10
  }

  const moveToModify = (num) => {
    // 수정 페이지로 이동하는 함수
    // num: todo.tno 또는 product.pno
    console. log(queryDefault)

    navigate({
      pathname: `../modify/${num}`, // 상대 경로 → /todo/modify/33
      search: queryDefault}) // 현재 페이지 정보 유지 → 수정 후 목록으로 돌아갈 때 같은 페이지로
  }

  const moveToRead = (num) => {
    // 상세 조회 페이지로 이동하는 함수
    // num: todo.tno 또는 product.pno
    console.log(queryDefault)
    navigate({
      pathname: `../read/${num}`, // 상대 경로 → /todo/read/33
      search: queryDefault // 현재 페이지 정보 유지
    })
  }


  return {moveToList, moveToModify, moveToRead, refresh, page, size}
  // 훅 사용 예시:
  // const { moveToList, moveToRead, moveToModify, page, size, refresh } = useCustomMove()
  // 목록 컴포넌트: refresh를 useEffect 의존성에 넣어 목록 갱신 트리거
  // 페이지네이션: page, size로 현재 페이지 파악, moveToList({page:num, size:10})으로 이동
}

export default useCustomMove;
