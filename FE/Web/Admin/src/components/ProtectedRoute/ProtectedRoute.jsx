import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = localStorage.getItem("accessToken");

  if (!user) return <Navigate to="/login" />;

  return <Outlet />;
};

export default ProtectedRoute;
