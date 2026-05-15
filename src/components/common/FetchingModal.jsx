// [역할] API 요청 중 로딩 상태 표시 모달 컴포넌트. fetching state가 true일 때 렌더링되어 "Loading...." 텍스트를 반투명 오버레이 위에 표시한다.
const FetchingModal = () => {
  // API 요청 중(fetching) 표시하는 로딩 모달 컴포넌트
  // 사용 예: isFetching 상태가 true일 때 이 컴포넌트를 렌더링
  // ResultModal과 달리 콜백/타이틀/내용 없이 단순 로딩 표시만 함

  return (
    <div className={`fixed top-0 left-0 z-[1055] flex h-full w-full place-item-center justify-center bg-black bg-opacity-20`}>
      {/* fixed: 화면 전체 고정, z-[1055]: 모든 요소 위에 표시 */}
      {/* bg-black bg-opacity-20: 반투명 검정 오버레이 (ResultModal의 bg-black/50 보다 덜 어두움) */}
      <div className={"bg-white rounded-3xl opacity-100 min-w-min h-1/4 min-w-[600px] flex justify-center items-center"}>
        {/* 흰색 로딩 박스: h-1/4(화면 높이의 1/4), 최소 너비 600px */}
        {/* flex justify-center items-center: 텍스트를 박스 가운데 정렬 */}
        <div className={"text-4xl font-extrabold text-orange-400 m-20"}>
          Loading....
          {/* 실제 프로젝트에서는 스피너 애니메이션(Spinner, CircularProgress 등)으로 교체 가능 */}
        </div>
      </div>
    </div>
  )
}

export default FetchingModal;
