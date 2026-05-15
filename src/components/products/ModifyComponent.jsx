// [역할] 상품 수정 UI 컴포넌트. pno props로 기존 데이터를 로드해 수정 폼을 제공하며 기존 이미지 개별 삭제(deleteOldImages), 새 이미지 추가, Soft Delete(delFlag) 처리를 담당한다.
import {useEffect, useRef, useState} from "react"; // 부수효과, DOM 참조, 상태 관리 훅
import {getOne, putOne} from "../../api/productsApi.jsx"; // 상품 조회·수정 API 함수
import FetchingModal from "../common/FetchingModal.jsx"; // 로딩 중 표시할 모달 컴포넌트
import {API_SERVER_HOST, deleteOne} from "../../api/todoApi.jsx"; // 호스트 주소 + (deleteOne은 todoApi에서 import - 의도치 않은 import일 수 있음)
import useCustomMove from "../../hooks/useCustomMove.jsx"; // 페이지 이동 커스텀 훅
import ResultModal from "../common/ResultModal.jsx"; // 결과 모달 컴포넌트

const initState = {
  // 서버 데이터를 받기 전 초기 상태
  pno: 0,
  pname: '',
  pdesc: '',
  price: 0,
  delFlag: false, // Soft Delete 플래그 (true면 삭제된 상품)
  uploadFileNames: [] // 기존 이미지 파일명 배열
}

const host = API_SERVER_HOST // 이미지 URL 조합에 사용

const ModifyComponent = ({pno}) => {
  // pno: 라우트 파라미터에서 받은 상품 번호

  const [product, setProduct] = useState(initState) // 수정 중인 상품 데이터 state
  const [fetching, setFetching] = useState(false) // 로딩 중 여부
  const uploadRef = useRef(); // 파일 input DOM 요소에 직접 접근하기 위한 ref
  const [result, setResult] = useState(null); // 작업 결과 ('Modified' 또는 'Deleted' 또는 null)
  const {moveToList, moveToRead} = useCustomMove() // 목록/상세 페이지 이동 함수

  useEffect(() => {
    // pno가 변경될 때마다 해당 상품 데이터를 서버에서 조회해서 폼에 채움
    setFetching(true)

    getOne(pno).then(data => {
      setProduct(data) // 서버 응답으로 상품 state 초기화
      setFetching(false)
    })
  }, [pno]) // 의존성 배열: pno가 변경될 때만 실행

  const handleChangeProduct = (e) => {
    // 텍스트 입력 필드 변경 시 product state 업데이트 (controlled component)
    setProduct({...product, [e.target.name]: e.target.value})
    // [e.target.name]: 동적 프로퍼티 키 (name="pname" → product.pname 업데이트)
  }

  const deleteOldImages = (imageName) => {
    // 기존 이미지 삭제 버튼 클릭 시 uploadFileNames에서 해당 이미지 제거
    const resultFileNames = product.uploadFileNames.filter(fileName => fileName !== imageName);
    // filter: imageName과 다른 파일명만 남김 (해당 이미지 제거)
    setProduct({...product, uploadFileNames: resultFileNames})
    // state 업데이트 → 화면에서 해당 이미지 사라짐 (서버에서 실제 파일 삭제는 putOne 호출 시 처리)
  }

  const handleClickModify = () => {
    // Modify 버튼 클릭 시 상품 수정 처리
    const files = uploadRef.current.files // 새로 선택한 파일들
    const formData = new FormData() // multipart/form-data 객체 생성 (파일 + 텍스트 필드 함께 전송)

    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]) // 새로 추가할 이미지 파일들
    }

    formData.append("pname", product.name) // 상품명 (product.pname이어야 하는데 product.name - 버그 가능성)
    formData.append("pdesc", product.desc) // 상품 설명 (product.pdesc이어야 하는데 product.desc - 버그 가능성)
    formData.append("price", product.price) // 상품 가격
    formData.append("delFlag", product.delFlag) // Soft Delete 플래그

    for(let i = 0; i < product.uploadFileNames.length; i++) {
      formData.append("uploadFileNames", product.uploadFileNames[i])
      // 유지할 기존 이미지 파일명 전송 → Spring에서 이 목록에 없는 파일은 서버에서 삭제
      // deleteOldImages로 제거한 이미지는 여기 포함되지 않으므로 Spring이 파일 삭제
    }

    setFetching(true) // API 호출 시작 → 로딩 모달 표시

    putOne(pno, formData).then(data => {
      setResult('Modified') // 수정 완료 → 모달 표시
      setFetching(false)
    })
  }

  const handleClickDelete = () => {
    // DELETE 버튼 클릭 시 상품 삭제 처리 (실제로는 Soft Delete → delFlag=true)
    setFetching(true) // API 호출 시작 → 로딩 모달 표시
    deleteOne(pno).then(data => {
      // 주의: deleteOne이 todoApi.jsx에서 import됨 → Todo 삭제 API가 실행됨 (버그 가능성)
      // 실제로는 productsApi.jsx의 deleteOne을 사용해야 함
      setResult('Deleted')
      setFetching(false)
    })
  }

  const closeModal = () => {
    // 모달 닫기 후 결과에 따라 다른 페이지로 이동
    if (result === 'Modified') {
      moveToRead(pno) // 수정 후: 수정된 내용 확인을 위해 상세 페이지로 이동
    }else if (result === 'Deleted') {
      moveToList({page:1}) // 삭제 후: 목록 첫 페이지로 이동
    }
    setResult(null) // result 초기화 → 모달 숨김
  }


  return (
    <div className={"border-2 border-sky-200 mt-10 m-2 p-4"}>

      {fetching ? <FetchingModal/> : <></>}
      {result ? <ResultModal title={`${result}`} content={'정상적으로 처리되었습니다.'} callbackFn={closeModal}/> : <></> }
      {/* fetching: 로딩 모달 / result: 결과 모달 (동시에 표시되지 않도록 순서 제어) */}

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Product Name</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                 name={"pname"} type={"text"} value={product.pname} onChange={handleChangeProduct}></input>
          {/* controlled input: pname은 수정 가능 */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Desc</div>
          <textarea className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md resize-y"}
                    name={"pdesc"} rows={4} onChange={handleChangeProduct} value={product.pdesc}></textarea>
          {/* resize-y: 사용자가 세로로만 크기 조절 가능 */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Price</div>
          <input className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                 name={"price"} type={"number"} value={product.price} onChange={handleChangeProduct}></input>
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>DELETE</div>
          <select name={"delFlag"} value={product.delFlag} onChange={handleChangeProduct}
                  className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}>
            {/* delFlag: Soft Delete 플래그 → "삭제" 선택 시 true로 설정 → Spring에서 실제 Row 삭제 대신 delFlag=true 처리 */}
            <option value={false}>사용</option>
            <option value={true}>삭제</option>
          </select>
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Files</div>
          <input ref={uploadRef} className={"w-4/5 p-6 rounded-r border border-solid border-neutral-300 shadow-md"}
                 type={"file"} multiple={true} onChange={handleChangeProduct}></input>
          {/* ref={uploadRef}: 파일 input에 직접 접근 → handleClickModify에서 uploadRef.current.files로 파일 목록 읽기 */}
          {/* multiple={true}: 여러 파일 동시 선택 가능 */}
        </div>
      </div>

      <div className={"flex justify-center"}>
        <div className={"relative mb-4 flex w-full flex-wrap items-stretch"}>
          <div className={"w-1/5 p-6 text-right font-bold"}>Images</div>
          <div className={"w-4/5 justify-center flex flex-wrap items-start"}>
            {product.uploadFileNames.map((imgFile, i) =>
              <div className={"flex justify-center flex-col w-1/3 m-1 align-baseline"} key={i}>
                <button className={"bg-blue-500 text-3xl text-white"} onClick={() => deleteOldImages(imgFile)}>DELETE</button>
                {/* 이미지 삭제 버튼: 클릭 시 uploadFileNames에서 제거 → state 업데이트 → 화면에서 사라짐 */}
                <img alt={"img"} src={`${host}/api/products/view/s_${imgFile}`}/>
                {/* s_ 접두사: 썸네일 이미지 표시 */}
              </div> )}
          </div>
        </div>
      </div>
      <div className={"flex justify-end p-4"}>
        <button type={"button"} className={"rounded p-4 m-2 text-xl w-32 text-white bg-red-500"} onClick={handleClickDelete}>DELETE</button>
        {/* 상품 삭제 버튼 → Deleted 모달 → moveToList({page:1}) */}
        <button type={"button"} className={"inline-block rounded p-4 m-2 text-xl w-32 text-white bg-orange-500"} onClick={handleClickModify}>Modify</button>
        {/* 상품 수정 버튼 → Modified 모달 → moveToRead(pno) */}
        <button type={"button"} className={"rounded p-4 m-2 text-xl w-32 text-white bg-blue-500"} onClick={moveToList}>List</button>
        {/* 목록으로 이동 */}
      </div>
    </div>
  )
}

export default ModifyComponent
