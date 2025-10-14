import { rolePermissions } from "~/configs/rbacConfig";



const usePermission = (userRole) => {
  const hasPermission = (permission) => {
    const allowedPermissions = rolePermissions[userRole] || [];

    return allowedPermissions.includes(permission);
  };

  return { hasPermission };
};

export default usePermission;
