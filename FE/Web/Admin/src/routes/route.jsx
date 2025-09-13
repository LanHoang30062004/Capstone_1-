import DefaultLayout from "~/components/Layouts/DefaultLayout";
import AddEmployee from "~/pages/Employee/AddEmployee";
import EditEmployee from "~/pages/Employee/EditEmployee";
import Employee from "~/pages/Employee/Employee";
import ListEmployee from "~/pages/Employee/ListEmployee";
import Login from "~/pages/Auth/Login";
import Auth from "~/pages/Auth/Auth";
import ProtectedRoute from "~/components/ProtectedRoute/ProtectedRoute";
import Account from "~/pages/Account/Account";
import AccessDenied from "~/pages/AccessDenied/AccessDenied";
import NotFound from "~/pages/NotFound/NotFound";
import RBACRoute from "~/components/RBACRoute/RBACRoute";
import { permissions } from "~/configs/rbacConfig";
import ForgotPassword from "~/pages/Auth/ForgotPassword";
import SendOtp from "~/pages/Auth/SendOtp";
import ResetPassword from "~/pages/Auth/ResetPassword";
import InfoAccount from "~/pages/InfoAccount/InfoAccount";
import Topic from "~/pages/Topic/Topic";
import Word from "~/pages/Word/Word";
import FlashCard from "~/pages/FlashCard/FlashCard";
import FlashCardDetail from "~/pages/FlashCard/FlashCardDetail";

const route = [
  {
    path: "",
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <DefaultLayout />,
        children: [
          {
            path: "/employee",
            element: <Employee />,
            children: [
              {
                path: "",
                element: <ListEmployee />,
              },

              // {
              //   path: "",
              //   element: (
              //     <RBACRoute
              //       requiredPermission={permissions.CREATE_EMPLOYEE}
              //     />
              //   ),
              //   children: [
              //     {
              //       path: "add",
              //       element: <AddEmployee />,
              //     },
              //   ],
              // },

              {
                path: "edit/:id",
                element: <EditEmployee />,
              },
            ],
          },

          {
            path: "",
            element: (
              <RBACRoute requiredPermission={permissions.VIEW_ACCOUNT} />
            ),
            children: [
              {
                path: "/account",
                element: <Account />,
              },
            ],
          },

          {
            path: "/topic",
            element: <Topic />,
          },

          {
            path: "/word",
            element: <Word />,
          },

          {
            path: "/flash-card",
            element: <FlashCard />,
          },

          {
            path: "/flash-card/:id",
            element: <FlashCardDetail />,
          },

          {
            path: "/user/info",
            element: <InfoAccount />,
          },
        ],
      },
    ],
  },

  {
    path: "/access-denied",
    element: <AccessDenied />,
  },

  {
    path: "*",
    element: <NotFound />,
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
        path: "/forgot-password",
        element: <ForgotPassword />,
      },

      {
        path: "/send-otp/:email",
        element: <SendOtp />,
      },

      {
        path: "/reset-password/:email/:otpCode",
        element: <ResetPassword />,
      },
    ],
  },
];

export default route;
