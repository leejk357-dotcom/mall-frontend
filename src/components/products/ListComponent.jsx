// [역할] 상품 목록 UI 컴포넌트. useCustomMove로 page/size를 읽어 getList() API를 호출하며 FetchingModal 로딩 표시, 썸네일 이미지(s_ 접두), 페이지네이션을 렌더링한다.
import useCustomMove from "../../hooks/useCustomMove.jsx"; // 페이지 이동 및 페이지네이션 커스텀 훅
import {useEffect, useState} from "react"; // 부수효과(API 호출)와 상태 관리 훅
import {getList} from "../../api/productsApi.jsx"; // 상품 목록 조회 API 함수
import FetchingModal from "../common/FetchingModal.jsx"; // 로딩 중 표시할 모달 컴포넌트
import {API_SERVER_HOST} from "../../api/todoApi.jsx"; // Spring 서버 호스트 주소 (이미지 URL 조합용)
import PageComponent from "../common/PageComponent.jsx"; // 페이지네이션 UI 컴포넌트
import useCustomLogin from "../../hooks/useCustomLogin.jsx"; // 로그인 관련 커스텀 훅 (예외 처리용)

const initState = {
  // 서버에서 데이터를 받기 전 초기 상태 (PageResponseDTO 구조와 동일)
  dtoList: [],
  pageNumList: [],
  pageRequestDTO: null,
  prev: false,
  next: false,
  totalCount: 0,
  prevPage: 0,
  nextPage: 0,
  totalPage: 0,
  current: 0
}

const host = API_SERVER_HOST // 이미지 URL 조합에 사용 (예: http://localhost:8082)

const ListComponent = () => {
  const {page, size, refresh, moveToList, moveToRead} = useCustomMove()
  // page, size: URL 쿼리스트링에서 읽은 현재 페이지 상태
  const {exceptionHandle} = useCustomLogin()
  // exceptionHandle: REQUIRE_LOGIN, ERROR_ACCESSDENIED 등의 에러를 처리하는 함수

  const [serverData, setServerData] = useState(initState) // 서버에서 받은 PageResponseDTO 저장
  const [fetching, setFetching] = useState(false); // 로딩 중 여부 (true: FetchingModal 표시)

  useEffect(() => {

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFetching(true) // API 호출 시작 → 로딩 모달 표시

    getList({page, size}).then(data => {
      console.log(data)
      setServerData(data) // 서버 응답으로 state 업데이트
      setFetching(false) // API 완료 → 로딩 모달 숨김
    }).catch(err => exceptionHandle(err))
    // 에러 처리: REQUIRE_LOGIN이면 로그인 페이지로 이동, ERROR_ACCESSDENIED이면 권한 없음 안내
  }, [page, size, refresh, exceptionHandle]) // 의존성: 페이지/사이즈/새로고침/에러핸들러 변경 시 재실행

  return (
    <div className={"border-2 border-blue-100 mt-10 mr-2 ml-2"}>

      {fetching ? <FetchingModal/> : <></>}
      {/* fetching이 true이면 로딩 모달 표시, false이면 숨김 */}

      <div className={"flex flex-wrap mx-auto p-6"}>

        {serverData.dtoList.map(product =>
          // dtoList의 각 ProductDTO를 카드 형태로 렌더링
          <div key={product.pno} className={"w-1/2 p-1 rounded shadow-md border-2"}
               onClick={() => moveToRead(product.pno)}>
            {/* w-1/2: 한 줄에 2개씩 배치, flex-wrap으로 자동 줄바꿈 */}
            {/* onClick: 카드 클릭 시 상품 상세 페이지로 이동 */}

            <div className={"flex flex-col h-full"}>
              <div className={"font-extrabold text-2xl p-2 w-full"}>
                {product.pno} {/* 상품 번호 */}
              </div>
              <div className={"text-1xl m-1 p-2 w-full flex flex-col"}>

                <div className={"w-full overflow-hidden"}>
                  <img alt={"product"} className={"m-auto rounded-md w-60"}
                       src={`${host}/api/products/view/s_${product.uploadFileNames[0]}`}/>
                  {/* 썸네일 이미지: Spring의 /api/products/view/{fileName} → 실제 파일 반환 */}
                  {/* s_ 접두사: 썸네일 파일 (Spring에서 원본 파일 저장 시 s_ 접두 썸네일도 함께 생성) */}
                  {/* uploadFileNames[0]: 첫 번째 이미지만 목록에서 표시 */}
                </div>

                <div className={"bottom-0 font-extrabold bg-white"}>
                  <div className={" text-center p-1"}>
                    이름: {product.pname} {/* 상품명 */}
                  </div>
                  <div className={"text-center p-1"}>
                    가격: {product.price} {/* 상품 가격 */}
                  </div>
                </div>

              </div>
            </div>
          </div>
        )}
      </div>
      <PageComponent serverData={serverData} movePage={moveToList}></PageComponent>
      {/* PageComponent: prev/pageNumList/next 버튼 렌더링 */}
    </div>
  )
}

export default ListComponent;
