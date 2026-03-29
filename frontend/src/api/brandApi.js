import axiosInstance from './axiosInstance';

export const brandApi = {
  getBrands: () =>
    axiosInstance.get('/brands'),

  getBrandById: (id) =>
    axiosInstance.get(`/brands/${id}`),

  createBrand: (data) =>
    axiosInstance.post('/brands', data),

  updateBrand: (id, data) =>
    axiosInstance.put(`/brands/${id}`, data),

  deleteBrand: (id) =>
    axiosInstance.delete(`/brands/${id}`),

  getBrandImages: (id) =>
    axiosInstance.get(`/brands/${id}/images`),
};

export default brandApi;
