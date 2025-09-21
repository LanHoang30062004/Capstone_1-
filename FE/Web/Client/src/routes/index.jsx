import LayoutDefault from "~/components/LayoutDefault/LayoutDefault";
import Test1 from "~/components/WebcamVideo/Test1";
import Auth from "~/pages/Auth/Auth";
import ForgotPassword from "~/pages/ForgotPassword/ForgotPassword";
import Login from "~/pages/Auth/Login";
import Register from "~/pages/Auth/Register";
import Dictionary from "~/pages/Dictionary/Dictionary";
import Home from "~/pages/Home/Home";
import Lesson from "~/pages/Lesson/Lesson";
import LessonContent from "~/pages/Lesson/LessonContent";
import Practise from "~/pages/Practise/Practise";
import PractiseDetail from "~/pages/Practise/PractiseDetail";
import Test from "~/pages/Practise/Test";

import SignLanguage from "~/pages/SignLanguage/SignLanguage";
import SendOtp from "~/pages/ForgotPassword/SendOtp";
import FlashCard from "~/pages/Lesson/FlashCard";
import CheckOtp from "~/pages/ForgotPassword/CheckOtp";
import ResetPassword from "~/pages/ForgotPassword/ResetPassword";
import LoginGoogle from "~/pages/Auth/LoginGoogle";

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

      {
        path: "/lesson",
        element: <Lesson />,
      },

      {
        path: "/lesson/:id",
        element: <LessonContent />,
      },

      {
        path: "/practise",
        element: <Practise />,
      },

      {
        path: "/practise/:id",
        element: <PractiseDetail />,
      },

      {
        path: "/test/:id",
        element: <Test />,
      },

      {
        path: "/flashcard/:id",
        element: <FlashCard />,
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

      {
        path: "/callback",
        element: <LoginGoogle />,
      },
    ],
  },

  {
    path: "/",
    element: <ForgotPassword />,
    children: [
      {
        path: "/forgot-pass",
        element: <SendOtp />,
      },

      {
        path: "/check-pass/:email",
        element: <CheckOtp />,
      },
      {
        path: "/reset-password/:email/:code",
        element: <ResetPassword />,
      },
    ],
  },

  {
    path: "/test",
    element: <Test1 />,
  },
];

export default routes;
