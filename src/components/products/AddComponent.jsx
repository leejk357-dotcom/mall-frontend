// [역할] 상품 등록 UI 컴포넌트. pname·pdesc·price 입력과 파일 input(useRef)으로 FormData를 구성해 multipart/form-data로 postAdd() API를 호출하고 결과 모달 후 목록으로 이동한다.
import {useRef, useState} from "react"; // useRef: 파일 input DOM 직접 접근, useState: 폼 상태·로딩·결과 관리
import {postAdd} from "../../api/productsApi.jsx"; // 상품 등록 API 함수 (multipart/form-data POST)
import FetchingModal from "../common/FetchingModal.jsx"; // 로딩 중 표시할 모달 컴포넌트
import ResultModal from "../common/ResultModal.jsx"; // 작업 결과 표시 모달 컴포넌트
import useCustomMove from "../../hooks/useCustomMove.jsx"; // 페이지 이동 커스텀 훅

const initState = {
  // 서버로 전송하기 전 초기 상태 (폼 초기값)
  pname: '',
  pdesc: '',
  price: 0,
  files: []
}

const AddComponent = () => {
  // 상품 등록 폼 컴포넌트

  const [product, setProduct] = useState({...initState}); // 폼 입력 상태 - pname, pdesc, price 관리
  const uploadRef = useRef(); // 파일 input DOM 참조 - uploadRef.current.files로 파일 목록 접근

  const[fetching, setFetching] = useState(false) // 로딩 중 여부 (true: FetchingModal 표시)
  const[result, setResult] = useState(null); // 등록 결과 저장 (pno 또는 null - null이면 모달 숨김)

  const {moveToList} = useCustomMove() // 등록 완료 후 목록 페이지로 이동하는 함수

  const handleChangeProduct = (e) => {
    // 텍스트 입력 필드 변경 시 product state 업데이트 (controlled component)
    setProduct({...product, [e.target.name]: e.target.value})
    // [e.target.name]: 동적 프로퍼티 키 → name="pname"이면 product.pname만 업데이트
  }

  /*'ADD' 버튼을 클릭했을 때 첨부파일에 선택된 정보를 읽어내서 첨부파일의 정보를 파악하고 이를 Ajax 전송에 사용하는 FormData객체로 구성해야함.*/
  /*
  ** 일반 JSON 전송 - 파일 전송 불가
  axios.post("/api/products/", {
    pname: "상품명",
    files: [파일]  // ❌ 파일을 JSON으로 못 보냄
  })

  ** FormData - 파일 전송 가능
  const formData = new FormData()
  formData.append("pname", "상품명")
  formData.append("files", 파일)  // ✅ 파일 전송 가능*/
  const handleClickAdd = () => {
    const files = uploadRef.current.files
    /*files는 HTML input 태그의 내장 프로퍼티
    브라우저가 파일 input에 기본으로 제공하는 속성*/

    const formData = new FormData();
    /*
    ** 추가
    formData.append("키", 값)

    ** 같은 키로 여러 개 추가 가능
    formData.append("files", 파일1)
    formData.append("files", 파일2)  // 배열처럼 쌓임*/

    // ProductDTO의 필드 값 = 키 값
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }
    formData.append("pname", product.pname);
    formData.append("pdesc", product.pdesc);
    formData.append("price", product.price);

    setFetching(true) // API 호출 시작 → 로딩 모달 표시

    console.log(formData); // 개발용 디버그 출력
    postAdd(formData).then(data => {
      // Spring /api/products/ POST 완료 → 등록된 pno 반환
      setFetching(false); // 로딩 모달 숨김
      setResult(data.result) // 등록된 pno 저장 → ResultModal 표시
    })
  }

  const closeModal = () => {
    // 결과 모달 닫기 후 목록 첫 페이지로 이동
    setResult(null); // result 초기화 → 모달 숨김
    moveToList({page:1}); // 등록 후 목록 첫 페이지로 이동
  }

  return (
    <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>

      {fetching ? <FetchingModal/> : <></>}
      {result ?
      <ResultModal title={'product Add Result'} content={`${result}번 등록 완료`} callbackFn={closeModal} /> : <></> }
      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Product Name</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                 name={"pname"} type={'text'} value={product.pname} onChange={handleChangeProduct}></input>
          {/*React의 핵심 원칙이 "화면은 항상 상태를 반영해야 한다" 입니다.
        상태(product.pname) ←→ 화면(input)
        value가 없으면 이 둘이 따로 놀게 되고, React가 input을 제어할 수 없게 됩니다.*/}
          {/*HTML에서 value는 초기값 설정용입니다. 사용자가 수정해도 브라우저가 알아서 처리하고 HTML의 value는 그대로입니다.
        React에서 value는 항상 현재 상태값입니다. 상태가 바뀔 때마다 input도 같이 바뀝니다.
        상태로 input을 제어해야 하는 상황"이면 value + onChange 세트가 필수*/}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Desc</div>
          <textarea className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"}
                    name={"pdesc"} rows={4} value={product.pdesc} onChange={handleChangeProduct}>{product.pdesc}</textarea>
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Price</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                 name={"price"} type={'number'} value={product.price} onChange={handleChangeProduct}></input>
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Files</div>
          <input ref={uploadRef} className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                 type={'file'} multiple={true}></input>
          {/*useRef -> 렌더링과 무관하게 값을 유지하거나 DOM에 직접 접근할 때 사용하는 Hook*/}

          {/*const inputRef = useRef()
          <input ref={inputRef}/>
          // DOM 요소에 직접 접근
          inputRef.current          // input 요소 자체
          inputRef.current.value    // input 값
          inputRef.current.focus()  // 포커스 주기
          inputRef.current.files    // 파일 input의 파일 목록*/}

          {/*// useState - 값 바뀌면 리렌더링
          const [count, setCount] = useState(0)
          setCount(1)  // 리렌더링 발생 → 화면 업데이트

          // useRef - 값 바뀌어도 리렌더링 없음
          const countRef = useRef(0)
          countRef.current = 1  // 리렌더링 없음 → 화면 그대로*/}
        </div>
      </div>

      <div className={"flex justify-end"}>
        <div className={"relative mb-4 flex p-4 flex-wrap items-stretch"}>
          <button type={"button"} className={"rounded p-4 w-36 bg-blue-500 text-xl text-white"}
                  onClick={handleClickAdd}>ADD</button>
        </div>
      </div>
    </div>
  );
}

export default AddComponent;