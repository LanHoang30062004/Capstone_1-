import { ConfigProvider, theme } from "antd";
import AllRoute from "./components/AllRoute/AllRoute";
import "./base.scss";
import { ThemeContext } from "~/context/themeContext";
import { useContext } from "react";
import "@ant-design/v5-patch-for-react-19";
import { ToastContainer } from "react-toastify";

function App() {
  const { myTheme } = useContext(ThemeContext);

  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#49BBBD",
            fontSize: 16,
            fontFamily: "Lexend, sans-serif",
          },
          components: {
            Button: {
              colorPrimary: "#49BBBD",
              algorithm: true,
            },
            Tag: {
              colorSuccess: "#3FC28A",
              colorSuccessBg: "rgba(63, 194, 138, 0.10)",
            },
            Segmented: {
              itemSelectedBg: "#49BBBD",
              itemSelectedColor: "#fff",
            },
          },
          algorithm:
            myTheme === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
        }}
      >
        <AllRoute />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          closeOnClick={false}
          pauseOnHover
          theme="light"
          style={{ fontSize: "1.6rem" }}
        />
      </ConfigProvider>
    </>
  );
}

export default App;
