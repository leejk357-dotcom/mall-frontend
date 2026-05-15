// [역할] Todo 수정 UI 컴포넌트. tno props로 기존 데이터를 로드해 수정 폼을 제공하고 putOne(수정)/deleteOne(삭제) 후 결과 모달과 페이지 이동을 처리한다.
import {useEffect, useState} from 'react'; // 부수효과(API 호출)와 상태 관리 훅
import {deleteOne, getOne, putOne} from "../../api/todoApi.jsx"; // Todo 조회·수정·삭제 API 함수
import useCustomMove from "../../hooks/useCustomMove.jsx"; // 페이지 이동 커스텀 훅
import ResultModal from "../common/ResultModal.jsx"; // 결과 모달 컴포넌트

const initState = {
  // 서버 데이터를 받기 전 초기 상태
  tno: 0,
  title: '',
  writer: '',
  dueDate: 'null', // 초기값이 'null' 문자열 (실제 null과 다름 - 버그 가능성)
  complete: false
}

const ModifyComponent = ({tno}) => {
  // tno: 라우트 파라미터에서 받은 Todo 번호 (ModifyPage.jsx에서 useParams로 추출해 전달)
  const [todo, setTodo] = useState({...initState}) // 수정 중인 Todo 데이터 state
  const [result, setResult] = useState(null) // 작업 결과 ('Modified' 또는 'Deleted' 또는 null)
  const {moveToList, moveToRead} = useCustomMove() // 목록/상세 페이지 이동 함수

  useEffect(() => {
    // tno가 변경될 때마다 해당 Todo 데이터를 서버에서 조회해서 폼에 채움
    getOne(tno).then(data => setTodo(data))
  }, [tno]) // 의존성 배열: tno가 변경될 때만 실행

  const handleClickModify = () => {
    // Modify 버튼 클릭 시 수정 처리
    putOne(todo).then(data => {
      // todo 객체 전체를 전송 → Spring의 @PutMapping("/{tno}") + @RequestBody TodoDTO 매핑
      console.log("modify result: ", data)
      setResult('Modified') // 모달 표시용 결과 state 설정
    })
  }

  const handleClickDelete = () => {
    // Delete 버튼 클릭 시 삭제 처리
    deleteOne(tno).then(data => {
      console.log("deleted result: ", data)
      setResult('Deleted') // 모달 표시용 결과 state 설정
    })
  }

  const closeModal = () => {
    // 모달 닫기 후 결과에 따라 다른 페이지로 이동
    if (result === 'Deleted') {
      moveToList() // 삭제 후: 목록으로 이동 (상세 페이지가 없어졌으므로)
    }else{
      moveToRead(tno) // 수정 후: 수정된 내용 확인을 위해 상세 페이지로 이동
    }
  }

  const handleChangeTodo = (e) => {
    // 텍스트 입력 필드 변경 시 todo state 업데이트
    setTodo({...todo, [e.target.name]: e.target.value})
    // [e.target.name]: 동적 프로퍼티 키 (name="title" → todo.title 업데이트)
  }

  const handleChangeTodoComplete = (e) => {
    // COMPLETE 선택 박스 변경 시 complete 필드 업데이트
    const value = e.target.value;
    setTodo({...todo, complete: (value === 'Y')})
    // 'Y' 선택 → complete: true, 'N' 선택 → complete: false (문자열 'Y'를 boolean으로 변환)
  }

  return (
    <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>
      {result ? <ResultModal title={"처리결과"} content={result} callbackFn={closeModal}></ResultModal> : <></> }
      {/* result가 있으면('Modified' 또는 'Deleted') 모달 표시 */}

      <div className={"flex justify-center mt-10"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>TNO</div>
          <div className={"w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100"}>{todo.tno}</div>
          {/* tno는 수정 불가 → input이 아닌 div로 표시 (bg-gray-100: 편집 불가 영역 시각적 구분) */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>WRITER</div>
          <div className={"w-4/5 p-6 rounded-r border border-solid shadow-md bg-gray-100"}>{todo.writer}</div>
          {/* writer도 수정 불가 → div로 표시 */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>TITLE</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                 name={"title"} type={"text"} value={todo.title} onChange={handleChangeTodo}></input>
          {/* title은 수정 가능 → controlled input */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>DUEDATE</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                 name={"dueDate"} type={"date"} value={todo.duedate} onChange={handleChangeTodo}></input>
          {/* todo.duedate (소문자 d) → 초기 로드 시 undefined일 수 있음, todo.dueDate와 불일치 주의 */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>COMPLETE</div>
          <select
            name={"status"} className={"border-solid border-2 rounded m-1 p-2"} onChange={handleChangeTodoComplete}
            value={todo.complete ? 'Y' : 'N'}>
            {/* controlled select: value={todo.complete ? 'Y' : 'N'} → boolean을 문자열로 변환해 선택값 제어 */}
            <option value="Y">Completed</option>
            <option value="N">Not Yet</option>
          </select>
        </div>
      </div>

      <div className={"flex justify-end p-4"}>
        <button type={"button"} className={"inline-block rounded p-4 m-2 text-xl w-32 text-white bg-red-500"}
        onClick={handleClickDelete}>Delete</button>
        {/* 삭제 버튼: deleteOne(tno) 호출 → Deleted 모달 → moveToList */}
        <button type={"button"} className={"inline-block rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"}
        onClick={handleClickModify}>Modify</button>
        {/* 수정 버튼: putOne(todo) 호출 → Modified 모달 → moveToRead */}
      </div>
    </div>
  )
}

export default ModifyComponent
