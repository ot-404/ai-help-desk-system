import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : "/api",
});

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register");
    if (err.response?.status === 401 && !isAuthCall) {
      const hadToken = !!localStorage.getItem("token");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (hadToken && window.location.pathname.startsWith("/app")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(err);
  }
);

export function apiError(err, fallback = "Something went wrong.") {
  return err?.response?.data?.error || fallback;
}

export default api;
