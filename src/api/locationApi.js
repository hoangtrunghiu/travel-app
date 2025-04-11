import axiosClient from './axiosClient';

const locationApi = {
   getAllDestinations: () => axiosClient.get('/destination'),
   getByIdDestinations: (id) => axiosClient.get(`/destination/${id}`),
   createDestinations: (data) => axiosClient.post('/destination', data),
   updateDestinations: (id, data) => axiosClient.put(`/destination/${id}`, data),
   deleteDestinations: (id) => axiosClient.delete(`/destination/${id}`),

   getAllDeparturePoints: () => axiosClient.get('/departure-point'),
   getByIdDeparturePoints: (id) => axiosClient.get(`/departure-point/${id}`),
   createDeparturePoints: (data) => axiosClient.post('/departure-point', data),
   updateDeparturePoints: (id, data) => axiosClient.put(`/departure-point/${id}`, data),
   deleteDeparturePoints: (id) => axiosClient.delete(`/departure-point/${id}`),
};

export default locationApi;
