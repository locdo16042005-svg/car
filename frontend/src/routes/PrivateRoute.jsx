import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * PrivateRoute — can be used two ways:
 * 1. As a layout route guard (no children prop): renders <Outlet /> when authorized
 * 2. As a wrapper (with children prop): renders children when authorized
 */
export default function PrivateRoute({ children, requiredRole }) {
  const { isAuthenticated, role } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && role !== requiredRole) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <h1 style={styles.code}>403</h1>
          <h2 style={styles.title}>Không có quyền truy cập</h2>
          <p style={styles.desc}>Bạn không có quyền truy cập vào trang này.</p>
          <a href="/" style={styles.link}>Quay về trang chủ</a>
        </div>
      </div>
    );
  }

  return children ?? <Outlet />;
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f7fa',
  },
  card: {
    textAlign: 'center',
    padding: '48px',
    backgroundColor: '#fff',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
  },
  code: {
    fontSize: '72px',
    fontWeight: '700',
    color: '#e53e3e',
    margin: '0 0 8px',
  },
  title: {
    fontSize: '22px',
    color: '#1a3a5c',
    margin: '0 0 12px',
  },
  desc: {
    color: '#666',
    fontSize: '14px',
    marginBottom: '24px',
  },
  link: {
    color: '#1a3a5c',
    fontWeight: '600',
    textDecoration: 'none',
    fontSize: '14px',
  },
};
