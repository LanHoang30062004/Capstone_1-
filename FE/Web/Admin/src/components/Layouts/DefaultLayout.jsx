import { Layout } from "antd";
import { Content } from "antd/es/layout/layout";
import { useContext } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "~/components/Sidebar/Sidebar";
import { ThemeContext } from "~/context/themeContext";

const DefaultLayout = () => {
  const { myTheme } = useContext(ThemeContext);

  return (
    <>
      <Layout
        style={{
          minHeight: "100vh",
        }}
      >
        <Sidebar />
        <Content style={myTheme === "light" ? { background: "#F9FBFD" } : null}>
          <Outlet />
        </Content>
      </Layout>
    </>
  );
};

export default DefaultLayout;
