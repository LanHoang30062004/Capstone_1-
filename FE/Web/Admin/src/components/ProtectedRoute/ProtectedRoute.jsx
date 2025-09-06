import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = localStorage.getItem("userInfo");

  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
