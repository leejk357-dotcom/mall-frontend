// [역할] 회원 정보 수정 페이지(/member/modify). BasicLayout을 사용하며 ModifyComponent(이메일·비밀번호·닉네임 폼)를 렌더링하고 수정 완료 후 자동 로그아웃·로그인 페이지로 이동한다.
import BasicLayout from "../../layouts/BasicLayout.jsx"; // 공통 레이아웃 컴포넌트
import ModifyComponent from "../../components/member/ModifyComponent.jsx"; // 회원 정보 수정 폼 컴포넌트

const ModifyPage = () => {
  // 회원 정보 수정 페이지 (/member/modify) → 로그인한 사용자만 접근 가능
  // BasicLayout 사용 → 상단 메뉴 + 사이드바 포함

  return (
    <BasicLayout>
      <div className={"text-3xl"}>Member Modify Page</div>
      <div className={"bg-white w-full mt-4 p-2"}>
        <ModifyComponent/>
        {/* 회원 정보 수정 폼: email(읽기전용), pw, nickname 필드 + Modify 버튼 */}
        {/* 수정 완료 후: 자동 로그아웃 + 로그인 페이지로 이동 (토큰 재발급 위해) */}
      </div>
    </BasicLayout>
  )
}

export default ModifyPage;
