import { getAccessToken } from "@/lib/utils";
import axios from "axios";

export function createAxiosInstance(baseURL: string) {
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}${baseURL}`,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  axiosInstance.interceptors.request.use((config) => {
    const authToken = getAccessToken();
    if (authToken) {
      config.headers.Authorization = authToken;
    }
    return config;
  });

  return axiosInstance;
}
