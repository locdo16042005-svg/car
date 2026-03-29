import axiosInstance from './axiosInstance';

export const orderApi = {
  getOrders: (params) =>
    axiosInstance.get('/orders', { params }),

  getOrderById: (id) =>
    axiosInstance.get(`/orders/${id}`),

  createOrder: () =>
    axiosInstance.post('/orders'),

  updateOrderStatus: (id, status) =>
    axiosInstance.patch(`/orders/${id}/status`, { status }),
};

export default orderApi;
