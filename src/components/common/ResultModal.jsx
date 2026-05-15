// [역할] API 작업 완료 결과 모달 컴포넌트. 제목·내용·콜백 함수를 props로 받아 반투명 오버레이 위에 결과를 표시하며 닫기 버튼 또는 배경 클릭으로 콜백을 실행한다.
const ResultModal = ( {title, content, callbackFn}) => {
  // API 작업 결과를 표시하는 모달 컴포넌트
  // title: 모달 제목 (예: "등록 완료")
  // content: 모달 내용 (예: "새로운 todo가 등록되었습니다.")
  // callbackFn: 모달 닫기 또는 특정 동작 실행 함수 (없으면 아무것도 안 함)

  return (
    <div
      className={`fixed top-0 left-0 z-[1055] flex h-full w-full justify-center bg-black/50`}
      // fixed: 화면 전체를 덮는 고정 위치 (스크롤 위치와 무관)
      // z-[1055]: 다른 요소 위에 표시 (Tailwind의 임의값 사용)
      // bg-black/50: 반투명 검정 오버레이 (배경을 어둡게 처리)
      onClick={() => {
        // 오버레이(배경) 클릭 시 모달 닫기
        if(callbackFn) {
          callbackFn();
        }
      }}>
      <div
        className={"absolute bg-white shadow dark:bg-gray-700 opacity-100 w-1/4 rounded mt-10 mb-10 px-6 min-w-[600px]"}>
        {/* 실제 모달 박스: absolute 위치, 최소 너비 600px */}
        <div className={"justify-center bg-warning-400 mt-6 mb-6 text-2xl border-b-4 border-gray-500"}>{title}</div>
        {/* 제목 영역: 아래 경계선으로 구분 */}
        <div className={"text-4xl border-orange-400 border-b-4 pt-4 pb-4"}>{content}</div>
        {/* 내용 영역: 큰 글씨, 주황색 아래 경계선 */}
        <div className={"justify-end flex"}>
          {/* 닫기 버튼 오른쪽 정렬 */}
          <button className={"rounded bg-blue-500 mt-4 mb-4 px-6 pt-4 pb-4 text-lg text-white"}
                  onClick={(e) => {
                    e.stopPropagation()
                    // stopPropagation: 버튼 클릭 이벤트가 부모 div(오버레이)까지 전파되는 것을 막음
                    // 없으면 버튼 클릭 → 버튼 onClick + 오버레이 onClick 두 번 실행됨
                    if(callbackFn) {
                      callbackFn();
                    }
                  }}>Close Modal</button>
        </div>
      </div>
    </div>
  );
}

export default ResultModal;
