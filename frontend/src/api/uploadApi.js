import axiosInstance from './axiosInstance';

export const uploadApi = {
  uploadImage: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },

  uploadImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return axiosInstance.post('/upload/images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default uploadApi;
