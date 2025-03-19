import axios from 'axios';

const axiosClient = axios.create({
   //    baseURL: process.env.REACT_APP_TRAVEL_APP_BASE_URL || 'http://localhost:5000/api',
   baseURL: 'https://localhost:5001/api',
   headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
   },
});

// Hàm lấy token từ localStorage
const getToken = () => localStorage.getItem('jwt');

axiosClient.interceptors.request.use(
   (config) => {
      const token = getToken();
      if (token) {
         config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
   },
   (error) => Promise.reject(error),
);

// axiosClient.interceptors.response.use(
//    (response) => response,
//    async (error) => {
//       if (error.response?.status === 401) {
//          const currentPath = window.location.pathname;

//          // Kiểm tra nếu đang ở trang admin
//          if (currentPath.startsWith('/admin')) {
//             window.location.href = '/admin/login';
//          } else {
//             window.location.href = '/login';
//          }
//       }

//       console.error(`Error! Status Code: ${error.response?.status}`);
//       return Promise.reject(error);
//    },
// );

export default axiosClient;
