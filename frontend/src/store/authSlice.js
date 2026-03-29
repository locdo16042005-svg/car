import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: localStorage.getItem('token') || null,
  role: localStorage.getItem('role') || null,
  fullName: localStorage.getItem('fullName') || null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess(state, action) {
      const { token, role, fullName } = action.payload;
      state.token = token;
      state.role = role;
      state.fullName = fullName;
      state.isAuthenticated = true;
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('fullName', fullName);
    },
    logout(state) {
      state.token = null;
      state.role = null;
      state.fullName = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('fullName');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
