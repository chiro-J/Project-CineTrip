import { Outlet } from "react-router-dom";
import Header from "./Header"; // GNB 컴포넌트 경로
import SideNavigationBar from "./SideNavigationBar";
import Footer from "./Footer"; // Footer 컴포넌트 경로

const Layout = () => {
  return (
    <>
      <SideNavigationBar />
      <Header />
      <main>
        <Outlet /> {/* 자식 라우트(페이지 컴포넌트)가 이 위치에 렌더링 */}
      </main>
      <Footer />
    </>
  );
};

export default Layout;