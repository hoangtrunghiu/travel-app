import axiosClient from './axiosClient';

const categoryTourApi = {
   getAll: () => axiosClient.get('/category-tour'),
   getById: (id) => axiosClient.get(`/category-tour/${id}`),
   create: (data) => axiosClient.post('/category-tour', data),
   update: (id, data) => axiosClient.put(`/category-tour/${id}`, data),
   delete: (id) => axiosClient.delete(`/category-tour/${id}`),
};

export default categoryTourApi;
