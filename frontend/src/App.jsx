import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from './store/authSlice';
import AppRouter from './routes/AppRouter';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Clear stale auth data if role is missing or invalid
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && (!role || (role !== 'ADMIN' && role !== 'USER'))) {
      dispatch(logout());
    }
  }, [dispatch]);

  return (
    <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppRouter />
    </BrowserRouter>
  );
}

export default App;
