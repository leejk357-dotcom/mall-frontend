// [역할] Todo 모듈 메인 페이지(/todo/main). 현재는 빈 페이지이며 todoRouter.jsx에서 /todo/main 경로에 매핑된다.
const todoMainPage = () => {
  // Todo 모듈의 메인 페이지 (현재는 빈 페이지 - 추후 대시보드 등으로 확장 가능)
  // todoRouter.jsx에서 /todo/main 경로에 매핑됨
  // 참고: todoRouter의 "" 경로가 Navigate replace to="list"로 설정되어 /todo → /todo/list로 이동하므로
  // 이 페이지는 /todo/main 같은 명시적 경로로만 접근 가능

  return (
    <div className={"p-4 w-full bg-white"}>
      <div className={"text-3xl font-extrabold"}>Todo Main Page Component</div>
    </div>
  );
}

export default todoMainPage;
