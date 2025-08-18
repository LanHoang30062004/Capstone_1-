import { ConfigProvider } from "antd";
import "./base.scss";
import AllRoute from "~/components/AllRoute/AllRoute";

function App() {
  return (
    <>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#49BBBD",
          },

          components: {
            Segmented: {
              itemSelectedBg: "var(--bg-green-dark)",
              trackBg: "var(--bg-green-light-two)",
              itemColor: "var(--color-white)",
              itemSelectedColor: "var(--color-white)",
              itemHoverBg: "var(--bg-green-dark)",
              itemHoverColor: "var(--color-white)",
            },

            Input: {
              // hoverBorderColor: "var(--bg-green-dark)",
              // activeShadow: "var(--bg-green-light-two)",
            },
          },
        }}
      >
        <AllRoute />
      </ConfigProvider>
    </>
  );
}

export default App;
