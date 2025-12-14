import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const user = localStorage.getItem("adminAccessToken");
  const role = localStorage.getItem("role");

  if (!user) return <Navigate to="/login" />;

  if (role.toUpperCase() !== "ADMIN") return <Navigate to="access-denied" />;
  return <Outlet />;
};

export default ProtectedRoute;
