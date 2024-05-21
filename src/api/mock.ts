import { fetchHttp } from "@/utils/http/fetch";

type Result = {
  success: boolean;
  code: number;
  message: string;
  data: Array<any>;
};

/** 文件上传 */
export const formUpload = data => {
  return fetchHttp.request<Result>(
    "post",
    "https://run.mocky.io/v3/3aa761d7-b0b3-4a03-96b3-6168d4f7467b",
    {
      params: data,
      headers: {
        "Content-Type": "multipart/form-data"
      }
    }
  );
};
