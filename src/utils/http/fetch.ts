import type {
  RequestMethods,
  FetchHttpRequestUserConfig,
  ExtraUserConfig,
  FetchHttpRequestOptions
} from "./types.d";
import NProgress from "../progress";
import { message } from "@/utils/message";
import { getToken, formatToken } from "@/utils/auth";
import { useUserStoreHook } from "@/store/modules/user";
import qs from "qs";

// fetch options默认配置
const defaultConfig: RequestInit = {
  credentials: "include",
  headers: {
    Accept: "application/json, text/plain, */*",
    "Content-Type": "application/json"
  }
};

// 请求白名单
const whiteList = ["/refresh-token", "/login"];

class FetchHttp {
  private static requests: Array<(token: string) => void> = [];
  private static isRefreshing = false;
  private static baseUrl = import.meta.env.VITE_API_BASE_URL;

  constructor() {
    // this.httpInterceptorsRequest(config:FetchHttpRequestUserConfig);
    // this.httpInterceptorsResponse();
  }

  private static handleError(
    err: object,
    messageInfo: string = "网络请求异常，请稍后再试试"
  ) {
    console.error(err);
    message(messageInfo, { type: "error", grouping: true });
  }

  /**
   * @description:重构，封装带超时处理的fetch方法
   * @param url
   * @param options
   * @param timeout
   */
  private static fetchWithTimeout(
    url: string,
    options: RequestInit,
    timeout: number = 10000
  ) {
    return Promise.race([
      fetch(url, options),
      new Promise((_, reject) =>
        setTimeout(
          () => reject({ message: "抱歉，请求超时了，请稍后再试试~" }),
          timeout
        )
      )
    ]);
  }

  private static retryOriginalRequest(config: FetchHttpRequestOptions) {
    return new Promise(resolve => {
      FetchHttp.requests.push((token: string) => {
        config.options.headers["Authorization"] = formatToken(token);
        resolve(config);
      });
    });
  }

  /**
   * 模拟的请求前拦截，拦截处理 + 放行，不放心，永远不会除触发接口调用
   * 调用接口的时候，传递：url + options 给fetch调用之前，会先基于await进去这个拦截器
   * 这个拦截器目前的作用如下
   *  - 传入调用方法的 options给它，它会基于默认配置和其他规则，最终组装真正有效的传递给fetch的options对象
   *  - 成功通行标志：resolve(options)
   *  - 无感刷新逻辑实现
   *  - 请求信息，进入到拦截器后，调用一个接口判断是否过期，此时需要暂时阻塞在这里，也就是调用接口过程，可能陆续有其他接口进来，但是都会阻塞于此，这个无所谓，不会影响到重复刷新token
   *
   *  - 如果过期了，其中一个接口率先返回过期标签，此时根据FetchHttp.isRefreshing标志来组织多个接口重新刷新token
   *  - 获取到有效的access token之后，重新设置header等，组装有效的options，然后resolve出去放行
   *  - FetchHttp.isRefreshing为true期间，暂存其他进入的接口信息，等到token重新刷新成功后再依次放行，进行调用
   */
  private async httpInterceptorsRequest(
    config: FetchHttpRequestUserConfig,
    extraOptions?: ExtraUserConfig
  ): Promise<FetchHttpRequestOptions> {
    const fetchOpt: FetchHttpRequestOptions = {
      url: "",
      options: extraOptions ? { ...extraOptions } : {}
    };
    fetchOpt.url = config.url;
    fetchOpt.options.method = config.method;
    if (config.params) {
      fetchOpt.url =
        config.method === "get"
          ? `${config.url}?${qs.stringify(config.params)}`
          : config.url;
      if (config.method !== "get") {
        fetchOpt.options.body = config.params
          ? config.params instanceof FormData
            ? config.params
            : JSON.stringify(config.params)
          : null;
      }
    }

    fetchOpt.options.credentials = config.credentials
      ? config.credentials
      : defaultConfig.credentials;
    fetchOpt.options.headers = config.headers
      ? { ...defaultConfig.headers, ...config.headers }
      : defaultConfig.headers;
    fetchOpt.options.signal = config.signal;
    // 开启进度条动画
    NProgress.start();

    if (!whiteList.some(url => config.url.endsWith(url))) {
      // 从缓存中读取长短token等相关信息
      const data = getToken();
      if (data) {
        // 验证access token是否过期 todo
        const now = new Date().getTime();
        const expired = parseInt(data.expires) - now <= 0;
        if (expired) {
          // 避免多个接口并行多次刷新token
          if (!FetchHttp.isRefreshing) {
            FetchHttp.isRefreshing = true;
            // token过期刷新
            try {
              const res = await useUserStoreHook().handRefreshToken({
                refreshToken: data.refreshToken
              });
              const token = res.data.accessToken;
              fetchOpt.options.headers["Authorization"] = formatToken(token);
              FetchHttp.requests.forEach(cb => cb(token));
              FetchHttp.requests = [];
            } finally {
              FetchHttp.isRefreshing = false;
            }
          }
          // 内部暂存配置信息，此时下面方法不会立马进行resolve，也就是当前所有走到这边的接口请求都会在这里进行等待状态
          // 等到token刷新，也就是上面FetchHttp.requests.forEach(cb => cb(token));，传入正确的token，resove返回，此时这里的
          // 等待状态才会结束,简单说就是 await 后面跟着一个返回Promise对象的方法的时候，如果它这个方法内部没有进行任何的resolve和reject
          // 那么理论上走到await这里之后就会一直阻塞于此
          // 也就是可以借此来实现所谓的调用的接口暂存，挂起，等到某个时机，通过回调函数的形式触发立马的resolve

          await FetchHttp.retryOriginalRequest(fetchOpt);
          return Promise.resolve(fetchOpt);
        } else {
          fetchOpt.options.headers["Authorization"] = formatToken(
            data.accessToken
          );
          return Promise.resolve(fetchOpt);
        }
      } else {
        // todo 读取不到token，也可能是清空了缓存，登录失效
        // 进行提示登录失效
        // 进行注销操作后重定向到登录页面
        console.warn("读取不到任何token--------------");
        return Promise.resolve(null);
      }
    } else {
      return Promise.resolve(fetchOpt);
    }
  }

  private async httpInterceptorsResponse(response: Response): Promise<any> {
    NProgress.done();
    if (!response.ok) {
      // todo 其他非500系列的错误码统一处理
      if (response.status === 401) {
        FetchHttp.handleError(response, "暂无权限调用次接口");
      } else {
        FetchHttp.handleError(response, `接口调用异常——${response.status}`);
      }
      // .....
      return Promise.resolve(null);
    }
    let responDataType;
    const contentType = response.headers.get("content-type");
    const contentDisposition = response.headers.get("content-disposition");
    const result =
      contentType &&
      (contentType?.indexOf("application/json") !== -1 ||
        contentType?.indexOf("text/plain") !== -1)
        ? response.json()
        : contentDisposition?.indexOf("attachment") !== -1
          ? response.blob()
          : response;
    responDataType =
      contentType &&
      (contentType?.indexOf("application/json") !== -1 ||
        contentType?.indexOf("text/plain") !== -1)
        ? "json"
        : contentDisposition?.indexOf("attachment") !== -1
          ? "stream"
          : "other";
    const data = await result;
    if (responDataType === "json") {
      // 基于前后端约定的状态码，统一处理
      if (data && data.code !== 0) {
        FetchHttp.handleError(data, "状态码非0");
      }
    }

    return Promise.resolve(data);
  }

  public async request<T>(
    method: RequestMethods,
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T> {
    if (config && Object.keys(config).length === 0) {
      throw new Error("config must be a non-empty object");
    }
    if (extraConfig && Object.keys(extraConfig).length === 0) {
      throw new Error("extraConfig must be a non-empty object");
    }

    const userConfig: FetchHttpRequestUserConfig = config
      ? {
          method,
          url,
          ...config
        }
      : {
          method,
          url
        };

    try {
      const fetOpt = await this.httpInterceptorsRequest(
        userConfig,
        extraConfig
      );

      if (fetOpt) {
        const response = await FetchHttp.fetchWithTimeout(
          `${FetchHttp.baseUrl}${fetOpt.url}`,
          fetOpt.options,
          config ? config.timeOut : undefined
        );
        return this.httpInterceptorsResponse(response as Response);
      }
      return Promise.resolve(null);
    } catch (error) {
      // 统一处理超时 or 服务器错误等，无需暴露给业务层处理
      NProgress.done();
      FetchHttp.handleError(error, error.message);

      return Promise.resolve(null);
    }
  }

  public post<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T> {
    return this.request<T>("post", url, config, extraConfig);
  }

  public get<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T> {
    return this.request<T>("get", url, config, extraConfig);
  }
  public put<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T> {
    return this.request<T>("put", url, config, extraConfig);
  }
  public patch<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T> {
    return this.request<T>("patch", url, config, extraConfig);
  }
  public remove<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T> {
    return this.request<T>("delete", url, config, extraConfig);
  }
}

export const fetchHttp = new FetchHttp();
