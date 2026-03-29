import axiosInstance from './axiosInstance';

export const carApi = {
  getCars: (params) =>
    axiosInstance.get('/cars', { params }),

  getCarById: (id) =>
    axiosInstance.get(`/cars/${id}`),

  createCar: (data) =>
    axiosInstance.post('/cars', data),

  updateCar: (id, data) =>
    axiosInstance.put(`/cars/${id}`, data),

  deleteCar: (id) =>
    axiosInstance.delete(`/cars/${id}`),
};

export default carApi;
