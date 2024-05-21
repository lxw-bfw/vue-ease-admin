export type resultType = {
  accessToken?: string;
};

export type RequestMethods =
  | "get"
  | "post"
  | "put"
  | "delete"
  | "patch"
  | "option"
  | "head";

/**
 * FetchHttpRequestUserConfig配置最终会传入拦截器进行二次处理，放行给fetch使用
 * singal说明：
 * 支持调用接口的地方动态创建中断对象，并传递singal，实现手动中断请求
 *    let fetchAbortController: null | AbortController = null
      fetchAbortController = new AbortController()
      fetchAbortController.signal
 */
export type FetchHttpRequestUserConfig = {
  url?: string;
  method?: RequestMethods;
  params?: object;
  headers?: object;
  credentials?: RequestCredentials;
  signal?: AbortSignal;
  timeOut?: number;
};

export type ExtraUserConfig = Omit<
  RequestInit,
  "method" | "body" | "headers" | "credentials" | "signal"
>;

export type FetchHttpRequestOptions = {
  url?: string;
  options?: RequestInit;
};

export default class FetchHttp {
  request<T>(
    method: RequestMethods,
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfit?: ExtraUserConfig
  ): Promise<T>;
  post<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T>;
  get<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T>;
  put<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T>;
  patch<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T>;
  remove<T>(
    url: string,
    config?: FetchHttpRequestUserConfig,
    extraConfig?: ExtraUserConfig
  ): Promise<T>;
}
