import axios from "axios";

const axiosClient = axios.create({
  baseURL: process.env.TRAVEL_APP_BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Hàm lấy token từ localStorage
const getToken = () => localStorage.getItem("jwt");

axiosClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;

      // Kiểm tra nếu đang ở trang admin
      if (currentPath.startsWith("/admin")) {
        window.location.href = "/admin/login";
      } else {
        window.location.href = "/login";
      }
    }

    console.error(`Error! Status Code: ${error.response?.status}`);
    return Promise.reject(error);
  }
);

export default axiosClient;
