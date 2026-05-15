// [역할] 페이지네이션 UI 컴포넌트. Spring PageResponseDTO의 pageNumList·prev·next를 받아 이전/번호/다음 버튼을 렌더링하고 클릭 시 movePage(useCustomMove의 moveToList)를 호출한다.
const PageComponent = ({serverData, movePage}) => {
  // 페이지네이션 UI 컴포넌트
  // serverData: Spring PageResponseDTO { pageNumList, prev, next, prevPage, nextPage, current }
  // movePage: 페이지 번호 클릭 시 실행할 함수 (useCustomMove의 moveToList)

  return (
    <div className={"m-6 flex justify-center"}>
      {/* flex justify-center: 페이지 버튼들을 가운데 정렬 */}

      {serverData.prev ?
        // prev: 이전 페이지 그룹이 있으면 "Prev" 버튼 표시 (없으면 빈 Fragment)
        // 예: 1~10페이지 그룹에 있으면 prev=false, 11~20페이지 그룹이면 prev=true (이전 그룹 존재)
        <div className={"m-2 p-2 w-16 text-center font-bold text-blue-400"}
             onClick={() => movePage({page: serverData.prevPage})}>
          {/* prevPage: 이전 그룹의 마지막 페이지 번호 → 클릭 시 이전 그룹으로 이동 */}
          Prev </div> : <></>}

      {serverData.pageNumList.map(pageNum =>
        // pageNumList: 현재 그룹의 페이지 번호 배열 (예: [1,2,3,4,5,6,7,8,9,10])
        <div
          key={pageNum} // React 리스트 렌더링 시 고유 key 필요 (pageNum이 고유하므로 사용)
          className={`m-2 p-2 w-12 text-center rounded shadow-md text-white
          ${serverData.current === pageNum ? 'bg-gray-500': 'bg-blue-400'}`}
          // 현재 페이지(current)는 회색(bg-gray-500), 나머지는 파란색(bg-blue-400)으로 강조
          onClick={() => movePage({page: pageNum})}>
          {/* 페이지 번호 클릭 시 해당 페이지로 이동 */}
          {pageNum}
        </div>
      )}

      {serverData.next ?
      // next: 다음 페이지 그룹이 있으면 "Next" 버튼 표시
      <div
        className={"m-2 p-2 w-16 text-center font-bold text-blue-400"} onClick={() => movePage({page:serverData.nextPage})}>
        {/* nextPage: 다음 그룹의 첫 번째 페이지 번호 */}
      Next
      </div>: <></>}

    </div>
  );
}

export default PageComponent;
