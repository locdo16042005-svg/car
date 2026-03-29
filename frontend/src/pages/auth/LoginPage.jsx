import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { loginSuccess } from '../../store/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await axiosInstance.post('/auth/login', form);
      const { token, role, fullName } = res.data;
      dispatch(loginSuccess({ token, role, fullName }));

      if (role === 'ADMIN') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
    } catch {
      setError('Tên đăng nhập hoặc mật khẩu không đúng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng Nhập</h2>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Tên đăng nhập</label>
            <input
              style={styles.input}
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mật khẩu</label>
            <input
              style={styles.input}
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Nhập mật khẩu"
              required
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Đang đăng nhập...' : 'Đăng Nhập'}
          </button>
        </form>

        <p style={styles.footer}>
          Chưa có tài khoản?{' '}
          <Link to="/register" style={styles.link}>
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f2f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '400px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    color: '#1a3a5c',
    fontSize: '24px',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    marginBottom: '6px',
    fontWeight: '500',
    color: '#333',
    fontSize: '14px',
  },
  input: {
    width: '100%',
    padding: '10px 12px',
    border: '1px solid #d9d9d9',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box',
    outline: 'none',
  },
  error: {
    color: '#e53e3e',
    fontSize: '13px',
    marginBottom: '12px',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#1a3a5c',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    fontSize: '15px',
    cursor: 'pointer',
    marginTop: '4px',
  },
  footer: {
    textAlign: 'center',
    marginTop: '16px',
    fontSize: '14px',
    color: '#555',
  },
  link: {
    color: '#1a3a5c',
    textDecoration: 'none',
    fontWeight: '600',
  },
};
