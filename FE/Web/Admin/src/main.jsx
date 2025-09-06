import { createRoot } from "react-dom/client";
import "./reset.scss";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "~/context/themeContext";
import { store } from "~/redux/store";
import { Provider } from "react-redux";
import { LoadingProvider } from "~/context/LoadingContext";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider>
        <LoadingProvider>
          <App />
        </LoadingProvider>
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);
