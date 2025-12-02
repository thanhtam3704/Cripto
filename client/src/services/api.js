import axios from "axios";
import { useToast } from "vue-toastification";

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "http://localhost:3000") + "/api",
  timeout: 60000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const status = error.response.status;
      
      // Chỉ xử lý 401 redirect, các lỗi khác để store xử lý
      if (status === 401) {
        localStorage.removeItem("token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
      
      // Không toast ở đây nữa - để store hiển thị message cụ thể từ backend
    } else if (error.request) {
      // Chỉ toast cho network error
      const toast = useToast();
      toast.error("Lỗi kết nối mạng, kiểm tra internet của bạn");
    }
    return Promise.reject(error);
  },
);

const apiService = {
  setAuthToken: (token) => {
    if (token) api.defaults.headers.Authorization = `Bearer ${token}`;
  },
  clearAuthToken: () => {
    delete api.defaults.headers.Authorization;
  },
  get: (url, config = {}) => api.get(url, config),
  post: (url, data = {}, config = {}) => api.post(url, data, config),
  put: (url, data = {}, config = {}) => api.put(url, data, config),
  patch: (url, data = {}, config = {}) => api.patch(url, data, config),
  delete: (url, config = {}) => api.delete(url, config),
  upload: (url, formData, config = {}) =>
    api.post(url, formData, {
      ...config,
      headers: { "Content-Type": "multipart/form-data", ...config.headers },
    }),
  download: (url, config = {}) =>
    api.get(url, { ...config, responseType: "blob" }),
};

export default apiService;
