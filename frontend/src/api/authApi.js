import axiosInstance from './axiosInstance';

export const authApi = {
  login: (username, password) =>
    axiosInstance.post('/auth/login', { username, password }),

  register: (data) =>
    axiosInstance.post('/auth/register', data),

  logout: () =>
    axiosInstance.post('/auth/logout'),
};

export default authApi;
