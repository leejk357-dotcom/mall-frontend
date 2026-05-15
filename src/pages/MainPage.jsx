// [역할] 메인 페이지(/) 컴포넌트. BasicLayout을 사용하며 로그인 여부와 무관하게 누구나 접근 가능한 앱의 홈 화면이다.
import BasicLayout from "../Layouts/BasicLayout.jsx"; // 공통 레이아웃 컴포넌트 (상단 메뉴 + 사이드바)

const MainPage = () => {
  // 앱의 메인 페이지 (/) → root.jsx에서 "/" 경로에 매핑
  // 로그인 여부와 무관하게 누구나 접근 가능 (AboutPage와 달리 isLogin 체크 없음)
  return (
    <BasicLayout>
      {/* BasicLayout: BasicMenu(상단 내비게이션) + 메인 콘텐츠 영역 + 사이드바 */}

      <div className={"text-3xl"}>Main Page</div>

    </BasicLayout>
  );
}

export default MainPage;
