import { fetchHttp } from "@/utils/http/fetch";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return fetchHttp.request<Result>("get", "/get-async-routes");
};
