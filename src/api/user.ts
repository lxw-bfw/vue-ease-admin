import { fetchHttp } from "@/utils/http/fetch";

export type UserResult = {
  success: boolean;
  code: number;
  message: string;
  data: {
    /** 头像 */
    avatar: string;
    /** 用户名 */
    username: string;
    /** 昵称 */
    nickname: string;
    /** 当前登录用户的角色 */
    roles: Array<string>;
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
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

export type RefreshTokenResult = {
  success: boolean;
  code: number;
  message: string;
  data: {
    /** `token` */
    accessToken: string;
    /** 用于调用刷新`accessToken`的接口时所需的`token` */
    refreshToken: string;
    /** `accessToken`的过期时间（格式'xxxx/xx/xx xx:xx:xx'） */
    expires: Date;
  };
};

export type UserInfo = {
  /** 头像 */
  avatar: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 邮箱 */
  email: string;
  /** 联系电话 */
  phone: string;
  /** 简介 */
  description: string;
};

export type UserInfoResult = {
  success: boolean;
  code: number;
  message: string;
  data: UserInfo;
};

/** 登录 */
export const getLogin = (data?: object) => {
  return fetchHttp.request<UserResult>("post", "/login", { params: data });
};

/** 刷新`token` */
export const refreshTokenApi = (data?: object) => {
  return fetchHttp.request<RefreshTokenResult>("post", "/refresh-token", {
    params: data
  });
};

/** 账户设置-个人信息 */
export const getMine = (data?: object) => {
  return fetchHttp.request<UserInfoResult>("get", "/mine", { params: data });
};

/** 账户设置-个人安全日志 */
export const getMineLogs = (data?: object) => {
  return fetchHttp.request<ResultTable>("get", "/mine-logs", { params: data });
};
