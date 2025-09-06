// Định nghĩa các role trong hệ thống
export const roles = {
  ADMIN: "Admin",
  HR_MANAGER: "HR",
  PAYROLL_MANAGER: "Payroll",
  EMPLOYEE: "Employee",
}

// Định nghĩa các quyền trong hệ thống
export const permissions = {
  VIEW_DASHBOARD: "view_dashboard",

  VIEW_EMPLOYEE: "view_employees",
  CREATE_EMPLOYEE: "create_employee",
  EDIT_EMPLOYEE: "edit_employee",
  DELETE_EMPLOYEE: "delete_employee",

  VIEW_PAYROLL: "view_payroll",
  CREATE_PAYROLL: "create_payroll",
  EDIT_PAYROLL: "edit_payroll",
  DELETE_PAYROLL: "delete_payroll",

  VIEW_DEPARTMENT: "view_department",
  CREATE_DEPARTMENT: "create_department",
  EDIT_DEPARTMENT: "edit_department",
  DELETE_DEPARTMENT: "delete_department",

  VIEW_POSITION: "view_position",
  CREATE_POSITION: "create_position",
  EDIT_POSITION: "edit_position",
  DELETE_POSITION: "delete_position",

  VIEW_ATTENDANCE: "view_attendance",
  CREATE_ATTENDANCE: "create_attendance",
  EDIT_ATTENDANCE: "edit_attendance",
  DELETE_ATTENDANCE: "delete_attendance",

  VIEW_DIVIDEND: "view_dividend",
  CREATE_DIVIDEND: "create_dividend",
  EDIT_DIVIDEND: "edit_dividend",
  DELETE_DIVIDEND: "delete_dividend",

  VIEW_ACCOUNT: "view_account",
  CREATE_ACCOUNT: "create_account",
  DELETE_ACCOUNT: "delete_account",
}

export const rolePermissions = {
  [roles.HR_MANAGER]: [
    permissions.VIEW_EMPLOYEE,
    permissions.CREATE_EMPLOYEE,
    permissions.EDIT_EMPLOYEE,
    permissions.DELETE_EMPLOYEE,

    permissions.VIEW_DEPARTMENT,
    permissions.CREATE_DEPARTMENT,
    permissions.EDIT_DEPARTMENT,
    permissions.DELETE_DEPARTMENT,

    permissions.VIEW_POSITION,
    permissions.CREATE_POSITION,
    permissions.EDIT_POSITION,
    permissions.DELETE_POSITION,
  ],

  [roles.PAYROLL_MANAGER]: [
    permissions.VIEW_PAYROLL,
    permissions.CREATE_PAYROLL,
    permissions.EDIT_PAYROLL,
    permissions.DELETE_PAYROLL,

    permissions.VIEW_DIVIDEND,
    permissions.CREATE_DIVIDEND,
    permissions.EDIT_DIVIDEND,
    permissions.DELETE_DIVIDEND,

    permissions.VIEW_ATTENDANCE,
    permissions.CREATE_ATTENDANCE,
    permissions.EDIT_ATTENDANCE,
    permissions.DELETE_ATTENDANCE,
  ],

  [roles.ADMIN]: Object.values(permissions),
}
