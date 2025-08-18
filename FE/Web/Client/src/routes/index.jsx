import Auth from "~/pages/Auth/Auth";
import Login from "~/pages/Auth/Login";
import Register from "~/pages/Auth/Register";
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

  {
    path: "",
    element: <Auth />,
    children: [
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/register",
        element: <Register />,
      },
    ],
  },
];

export default routes;
