import axiosClient from './axiosClient';

const categoryApi = {
   getAll: () => axiosClient.get('/post'),
   getAll2: (params) => axiosClient.get(`/post?${params}`),
   getById: (id) => axiosClient.get(`/post/${id}`),
   getByCategoryId: (categoryId) => axiosClient.get(`/post/category/${categoryId}`), //Lấy bài viết theo danh mục (bao gồm cả danh mục con)
   create: (data) => axiosClient.post('/post', data),
   update: (id, data) => axiosClient.put(`/post/${id}`, data),
   delete: (id) => axiosClient.delete(`/post/${id}`),
};

export default categoryApi;
