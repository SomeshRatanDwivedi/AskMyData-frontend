import type { AxiosInstance } from "axios";
import axios from "axios";
import { requestHandler, responseHandler } from "../../configs/api.config";
import { CONNECT_API_BASE_URL } from "../../constants/api.constants";

const connectApi: AxiosInstance = axios.create({
  baseURL: CONNECT_API_BASE_URL,
});

// ** Attaches a Authorization header to all requests
connectApi.interceptors.request.use((req) => {
  //currently there is no token
  const token = localStorage.getItem("accessToken");
  if (token) {
    req.headers.Authorization = 'Bearer ' + token;
  };
  return req;
}, requestHandler);

connectApi.interceptors.response.use((res) => res, responseHandler);

export { connectApi };