import { Navigate, Outlet } from "react-router-dom";
import { roles } from "~/configs/rbacConfig";
import usePermission from "~/hooks/usePermission";

const RBACRoute = ({ requiredPermission, redirectTo = "/access-denied" }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const userRole = userInfo?.role || roles.EMPLOYEE;

  const { hasPermission } = usePermission(userRole);

  if (!hasPermission(requiredPermission)) {
    return <Navigate to={redirectTo} replace={true} />;
  }

  return <Outlet />;
};

export default RBACRoute;
