import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error.config?.url ?? "";

    const isAuthEndpoint = ["/auth/login", "/auth/register", "/auth/me"].some(
      (endpoint) => requestUrl.includes(endpoint),
    );

    if (
      typeof window !== "undefined" &&
      error.response?.status === 401 &&
      !isAuthEndpoint
    ) {
      localStorage.removeItem("accessToken");

      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    return Promise.reject(error);
  },
);

export default api;
