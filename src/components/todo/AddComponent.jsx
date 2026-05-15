// [역할] Todo 등록 UI 컴포넌트. title·writer·dueDate 입력 폼과 ADD 버튼으로 postAdd() API를 호출하고 결과 모달 후 /todo/list로 이동한다.
import {useState} from "react"; // 상태 관리 훅
import {postAdd} from "../../api/todoApi.jsx"; // Todo 등록 API 함수
import ResultModal from "../common/ResultModal.jsx"; // 결과 모달 컴포넌트
import useCustomMove from "../../hooks/useCustomMove.jsx"; // 페이지 이동 커스텀 훅

const initState = {
  // 입력 폼의 초기 상태
  title: '', // Todo 제목
  writer: '', // 작성자
  dueDate: '' // 마감일 (date 타입 input → "YYYY-MM-DD" 형식)
}

const AddComponent = () => {
  const [todo, setTodo] = useState({...initState});
  // 스프레드 연산자로 initState 복사 → initState 객체 자체를 state로 넣으면 같은 참조 공유 문제 발생
  const [result, setResult] = useState(null);
  // result: 등록 성공 후 받은 tno (숫자) 또는 null (모달 표시 여부 제어)
  const {moveToList} = useCustomMove() // 목록 페이지로 이동하는 함수

  const handleChangeTodo = (e) => {
    // 입력 필드 변경 시 todo state 업데이트 (controlled component)
    setTodo({...todo, [e.target.name]: e.target.value})
    // [e.target.name]: 동적 프로퍼티 키 → name="title" 이면 { ...todo, title: e.target.value }
    // 스프레드로 나머지 필드는 유지하고 변경된 필드만 갱신
  }

  const handleClickAdd = () => {
    // ADD 버튼 클릭 시 todo 등록 처리
    //console.log(t`odo)
    postAdd(todo).then(result => {
      setResult(result.TNO);
    // Spring의 Controller에서 postMapping으로 받아서 저장할 때 'TNO'로 저장한 것을 가져오는 것.
    /*Spring: { "TNO": 109 } 반환
        ↓
    axios가 받아서 res.data = { TNO: 109 }
        ↓
    postAdd()가 res.data 반환
        ↓
    result = { TNO: 109 }
        ↓
    result.TNO = 109
        ↓
    setResult(109)
        ↓
    "New 109 Added" 모달 표시*/
      setTodo({...initState}) // 입력 폼 초기화
    }).catch(e => {
      console.log(e)
    })
  }

  const closeModal = () => {
    // 모달 닫기 + 목록 페이지로 이동
    setResult(null); // result를 null로 → 모달 숨김
    moveToList() // /todo/list로 이동
  }

  return (
    <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>
      {result ? <ResultModal title={"Add Result"} content={`New ${result} Added`} callbackFn={closeModal}/>: <></> }
      {/* result가 있으면(null이 아니면) 모달 표시, 없으면 빈 Fragment */}
      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>TITLE</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"}
                 name="title" type={"text"} value={todo.title} onChange={handleChangeTodo}></input>
          {/* controlled input: value={todo.title}로 React가 입력 값을 제어 */}
          {/* name="title": handleChangeTodo에서 e.target.name으로 읽어 해당 필드 업데이트 */}
        </div>
      </div>
      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>WRITER</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"}
                 name="writer" type={"text"} value={todo.writer} onChange={handleChangeTodo}></input>
        </div>
      </div>
      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>DUEDATE</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-500 shadow-md"}
                 name = "dueDate" type = {"date"} value = {todo.dueDate} onChange={handleChangeTodo}></input>
          {/* type="date": 브라우저 기본 날짜 선택 UI, 값은 "YYYY-MM-DD" 형식으로 반환 */}
          {/* Spring의 LocalDateFormatter가 "YYYY-MM-DD" 문자열 → LocalDate 변환 */}
        </div>
      </div>
      <div className={"flex justify-end"}>
        <div className={"relative mb-4 flex p-4 flex-wrap items-stretch"}>
          <button type="button" className={"rounded p-4 w-36 bg-blue-500 text-xl text-white"}
                  onClick={handleClickAdd}>ADD
          </button>
        </div>
      </div>
    </div>
  )

}

export default AddComponent;
