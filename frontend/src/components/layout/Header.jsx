import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/authSlice';
import SearchBar from '../common/SearchBar';

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fullName = useSelector((state) => state.auth.fullName);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header style={styles.header}>
      <div style={styles.left}>
        <span style={styles.logo}>Tân Lộc</span>
      </div>

      <div style={styles.center}>
        <SearchBar />
      </div>

      <div style={styles.right}>
        <span style={styles.userName}>👤 {fullName || 'Admin'}</span>
        <button style={styles.logoutBtn} onClick={handleLogout}>
          Đăng xuất
        </button>
      </div>
    </header>
  );
}

const styles = {
  header: {
    height: '60px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #e8e8e8',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  left: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    fontSize: '20px',
    fontWeight: '700',
    color: '#1a3a5c',
    letterSpacing: '0.5px',
  },
  center: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    padding: '0 24px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userName: {
    fontSize: '14px',
    color: '#333',
    fontWeight: '500',
  },
  logoutBtn: {
    padding: '6px 14px',
    backgroundColor: '#e53e3e',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '13px',
    cursor: 'pointer',
  },
};
