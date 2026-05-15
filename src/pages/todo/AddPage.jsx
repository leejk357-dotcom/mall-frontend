// [역할] Todo 등록 페이지(/todo/add). IndexPage의 Outlet에 렌더링되며 실제 등록 폼·API 호출은 AddComponent에 위임한다.
import AddComponent from "../../components/todo/AddComponent.jsx"; // Todo 등록 폼 컴포넌트

const AddPage = () => {
  // Todo 등록 페이지 (/todo/add) → IndexPage의 Outlet 위치에 렌더링됨
  // 실제 등록 로직(postAdd API 호출, 결과 모달)은 AddComponent에서 담당

  return (
    <div className={"p-4 w-full bg-white"}>
      <div className={"text-3xl font-extrabold"}> Todo Add Page</div>
      <AddComponent/>
      {/* AddComponent: title/writer/dueDate 입력 → ADD 버튼 → postAdd() → 결과 모달 → /todo/list로 이동 */}
    </div>
  );
}

export default AddPage;
