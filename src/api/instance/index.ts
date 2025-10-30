import type { AxiosInstance } from "axios";
import axios from "axios";
import { requestHandler, responseHandler } from "../../configs/api.config";
import { ASK_MY_DATA_API_BASE_URL } from "@/constants/api.constant";
import useUserStore from "@/stores/user.store";

const askMyDataApi: AxiosInstance = axios.create({
  baseURL: ASK_MY_DATA_API_BASE_URL,
});

// ** Attaches a Authorization header to all requests
askMyDataApi.interceptors.request.use((req) => {
  //currently there is no token
  const token = useUserStore.getState().stUser.accessToken;
  if (!token) return req;
  req.headers.Authorization = 'Bearer ' + token;
  return req;
}, requestHandler);

askMyDataApi.interceptors.response.use((res) => res, responseHandler);

export { askMyDataApi };