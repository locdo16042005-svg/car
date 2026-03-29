import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import Footer from './Footer';

export default function UserLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fullName = useSelector((state) => state.auth.fullName);
  const cartCount = useSelector((state) => state.cart?.items?.length ?? 0);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div style={styles.wrapper}>
      <header style={styles.header}>
        <Link to="/" style={styles.logo}>
          Tân Lộc
        </Link>

        <div style={styles.right}>
          <Link to="/cart" style={styles.cartIcon} title="Giỏ hàng">
            🛒
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </Link>

          {fullName && (
            <span style={styles.userName}>👤 {fullName}</span>
          )}

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </header>

      <main style={styles.content}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
  header: {
    height: '60px',
    backgroundColor: '#1a3a5c',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 32px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    color: '#fff',
    textDecoration: 'none',
    letterSpacing: '0.5px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px',
  },
  cartIcon: {
    position: 'relative',
    fontSize: '22px',
    textDecoration: 'none',
    color: '#fff',
  },
  badge: {
    position: 'absolute',
    top: '-6px',
    right: '-8px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    borderRadius: '50%',
    width: '18px',
    height: '18px',
    fontSize: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
  },
  userName: {
    fontSize: '14px',
    color: '#fff',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: '6px 14px',
    backgroundColor: 'rgba(255,255,255,0.15)',
    color: '#fff',
    border: '1px solid rgba(255,255,255,0.3)',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
};
