import Home from "~/pages/Home/Home";
import SignLanguage from "~/pages/SignLanguage/SignLanguage";

const routes = [
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/sign-lang",
    element: <SignLanguage />,
  },
];

export default routes;
