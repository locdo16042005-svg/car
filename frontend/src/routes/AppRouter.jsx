import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

// Layouts
import AdminLayout from '../components/layout/AdminLayout';
import UserLayout from '../components/layout/UserLayout';
import PrivateRoute from './PrivateRoute';

// Auth pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Admin pages
import DashboardPage from '../pages/admin/DashboardPage';
import BrandManagementPage from '../pages/admin/BrandManagementPage';
import NewCarPage from '../pages/admin/NewCarPage';
import UsedCarPage from '../pages/admin/UsedCarPage';
import CustomerPage from '../pages/admin/CustomerPage';
import OrderPage from '../pages/admin/OrderPage';
import InspectionPage from '../pages/admin/InspectionPage';
import ReportPage from '../pages/admin/ReportPage';

// User pages
import CarListPage from '../pages/user/CarListPage';
import CarDetailPage from '../pages/user/CarDetailPage';
import CartPage from '../pages/user/CartPage';

export default function AppRouter() {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin routes */}
      <Route element={<PrivateRoute requiredRole="ADMIN" />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/brands" element={<BrandManagementPage />} />
          <Route path="/admin/cars/new" element={<NewCarPage />} />
          <Route path="/admin/cars/used" element={<UsedCarPage />} />
          <Route path="/admin/customers" element={<CustomerPage />} />
          <Route path="/admin/orders" element={<OrderPage />} />
          <Route path="/admin/inspections" element={<InspectionPage />} />
          <Route path="/admin/reports" element={<ReportPage />} />
        </Route>
      </Route>

      {/* User routes */}
      <Route element={<PrivateRoute requiredRole="USER" />}>
        <Route element={<UserLayout />}>
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Route>
      </Route>

      {/* Car list — accessible by both USER and ADMIN */}
      <Route element={<PrivateRoute />}>
        <Route element={<UserLayout />}>
          <Route path="/" element={<CarListPage />} />
        </Route>
      </Route>

      {/* Default redirect */}
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? (role === 'ADMIN' ? '/admin/dashboard' : '/') : '/login'} replace />}
      />
    </Routes>
  );
}
