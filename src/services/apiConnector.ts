import axios from "axios";

export const axiosInstance = axios.create({});

export const apiConnector = (
  method: string,
  url: string,
  bodyData?: any,
  headers?: any,
  params?: any,
  withCredentials = false, 
) => {
  return axiosInstance({
    method,
    url,
    data: bodyData,
    headers: headers ?? {},
    params: params ?? {},
    withCredentials, 
  });
};
