import { fetchHttp } from "@/utils/http/fetch";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data?: Array<any>;
};

type ResultTable = {
  success: boolean;
  code: number;
  message: string;
  data?: {
    /** 列表数据 */
    list: Array<any>;
    /** 总条目数 */
    total?: number;
    /** 每页显示条目个数 */
    pageSize?: number;
    /** 当前页数 */
    currentPage?: number;
  };
};

/** 获取系统管理-用户管理列表 */
export const getUserList = (data?: object) => {
  return fetchHttp.request<ResultTable>("post", "/user", { params: data });
};

/** 系统管理-用户管理-获取所有角色列表 */
export const getAllRoleList = () => {
  return fetchHttp.request<Result>("get", "/list-all-role");
};

/** 系统管理-用户管理-根据userId，获取对应角色id列表（userId：用户id） */
export const getRoleIds = (data?: object) => {
  return fetchHttp.request<Result>("post", "/list-role-ids", { params: data });
};

/** 获取系统管理-角色管理列表 */
export const getRoleList = (data?: object) => {
  return fetchHttp.request<ResultTable>("post", "/role", { params: data });
};

/** 获取系统管理-菜单管理列表 */
export const getMenuList = (data?: object) => {
  return fetchHttp.request<Result>("post", "/menu", { params: data });
};

/** 获取系统管理-部门管理列表 */
export const getDeptList = (data?: object) => {
  return fetchHttp.request<Result>("post", "/dept", { params: data });
};

/** 获取系统监控-在线用户列表 */
export const getOnlineLogsList = (data?: object) => {
  return fetchHttp.request<ResultTable>("post", "/online-logs", {
    params: data
  });
};

/** 获取系统监控-登录日志列表 */
export const getLoginLogsList = (data?: object) => {
  return fetchHttp.request<ResultTable>("post", "/login-logs", {
    params: data
  });
};

/** 获取系统监控-操作日志列表 */
export const getOperationLogsList = (data?: object) => {
  return fetchHttp.request<ResultTable>("post", "/operation-logs", {
    params: data
  });
};

/** 获取系统监控-系统日志列表 */
export const getSystemLogsList = (data?: object) => {
  return fetchHttp.request<ResultTable>("post", "/system-logs", {
    params: data
  });
};

/** 获取系统监控-系统日志-根据 id 查日志详情 */
export const getSystemLogsDetail = (data?: object) => {
  return fetchHttp.request<Result>("post", "/system-logs-detail", {
    params: data
  });
};

/** 获取角色管理-权限-菜单权限 */
export const getRoleMenu = (data?: object) => {
  return fetchHttp.request<Result>("post", "/role-menu", { params: data });
};

/** 获取角色管理-权限-菜单权限-根据角色 id 查对应菜单 */
export const getRoleMenuIds = (data?: object) => {
  return fetchHttp.request<Result>("post", "/role-menu-ids", { params: data });
};
