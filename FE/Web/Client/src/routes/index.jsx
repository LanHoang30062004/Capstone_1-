import LayoutDefault from "~/components/LayoutDefault/LayoutDefault";
import Auth from "~/pages/Auth/Auth";
import Login from "~/pages/Auth/Login";
import Register from "~/pages/Auth/Register";
import Dictionary from "~/pages/Dictionary/Dictionary";
import Home from "~/pages/Home/Home";

import SignLanguage from "~/pages/SignLanguage/SignLanguage";

const routes = [
  {
    path: "",
    element: <LayoutDefault />,
    children: [
      {
        path: "/",
        element: <Home />,
      },

      {
        path: "/sign-lang",
        element: <SignLanguage />,
      },

      {
        path: "/dictionary",
        element: <Dictionary />,
      },
    ],
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
