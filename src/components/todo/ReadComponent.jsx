// [역할] Todo 상세 조회 UI 컴포넌트. tno props로 getOne() API를 호출해 데이터를 표시하며 목록/수정 페이지 이동 버튼을 제공한다.
// 특정한 번호(tno)의 값에 의해서 todoAPI.jsx의 getOne을 호출하도록 구성

// 리액트의 경우 컴포넌트에서 비동기 방식으로 호출했다면, 호출결과를 처리한 후에 상태를 변경해서 처리 ->
// 컴포넌트의 상태가 변경되었기 때문에 컴포넌트가 다시 렌더링 -> 다시 렌더링되면서 비동시 호출 후 다시 렌더링 =>
// useEffect를 사용해서 번호가 변경되었을 때만 Axios를 이용하는 getOne을 호출하도록 구성

import {useEffect, useState} from 'react' // 부수효과(API 호출)와 상태 관리 훅
import {getOne} from "../../api/todoApi.jsx"; // 특정 Todo 조회 API 함수
import useCustomMove from "../../hooks/useCustomMove.jsx"; // 페이지 이동 커스텀 훅

const initState = {
  // 서버 데이터를 받기 전 초기 상태 (TodoDTO 구조와 동일)
  tno: 0,
  title: '',
  writer: '',
  dueDate: null,
  complete: false
}

const ReadComponenet = ({tno}) => {
  // tno: 라우트 파라미터에서 받은 Todo 번호 (ReadPage.jsx에서 useParams로 추출해 전달)
  const [todo, setTodo] = useState(initState) // 서버에서 받은 TodoDTO를 저장하는 state
  const {moveToList, moveToModify} = useCustomMove() // 목록/수정 페이지 이동 함수

  useEffect(() => {
    // tno가 변경될 때마다 해당 Todo 데이터를 서버에서 조회
    // tno는 URL 파라미터이므로 다른 Todo를 클릭하면 URL이 바뀌고 → tno 변경 → 재조회
    getOne(tno).then(data => {
      console.log(data)
      setTodo(data) // 서버 응답(TodoDTO)으로 state 업데이트 → 컴포넌트 재렌더링
    })
  }, [tno]) // 의존성 배열: tno가 변경될 때만 실행

  return (
    <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>
      {makeDiv('Tno', todo.tno)}
      {makeDiv('Writer', todo.writer)}
      {makeDiv('Title', todo.title)}
      {makeDiv('Due Date', todo.dueDate)}
      {makeDiv('Complete', todo.complete ? 'Completed' : 'Not Yet')}
      {/* todo.complete가 true이면 'Completed', false이면 'Not Yet' 표시 */}

      <div className={"flex justify-end p-4"}>
        <button type = "button" className={"rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"} onClick={() => moveToList()}>List</button>
        {/* 목록 페이지로 이동 (현재 page, size 유지) */}
        <button type = "button" className={"rounded p-4 m-2 text-xl w-32 text-white bg-red-500"} onClick={() => moveToModify(tno)}>Modify</button>
        {/* 수정 페이지로 이동 (/todo/modify/tno) */}
      </div>

    </div>
  )

}

const makeDiv = (title, value) =>
  // 라벨-값 쌍을 표시하는 재사용 가능한 UI 헬퍼 함수
  // title: 필드명 레이블, value: 표시할 값
  <div className={"flex justify-center"}>
    <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
      <div className={"w-1/5 p-6 text-right font-bold"}>{title}</div>
      <div className={"w-4/5 p-6 rounded-r border border-solid shadow-md"}>{value}</div>
    </div>
  </div>

export default ReadComponenet
