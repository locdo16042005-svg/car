import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

const initialForm = {
  fullName: '',
  email: '',
  phone: '',
  username: '',
  password: '',
  confirmPassword: '',
};

function validate(form) {
  const errors = {};

  if (!form.fullName.trim()) errors.fullName = 'Họ tên không được để trống';
  if (!form.username.trim()) errors.username = 'Tên đăng nhập không được để trống';

  if (!form.email.trim()) {
    errors.email = 'Email không được để trống';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Email không hợp lệ';
  }

  if (!form.phone.trim()) {
    errors.phone = 'Số điện thoại không được để trống';
  } else if (!/^0\d{9}$/.test(form.phone)) {
    errors.phone = 'Số điện thoại phải có 10 chữ số và bắt đầu bằng 0';
  }

  if (!form.password) {
    errors.password = 'Mật khẩu không được để trống';
  } else if (form.password.length < 8) {
    errors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
  } else if (!/[A-Z]/.test(form.password)) {
    errors.password = 'Mật khẩu phải có ít nhất 1 chữ hoa';
  } else if (!/\d/.test(form.password)) {
    errors.password = 'Mật khẩu phải có ít nhất 1 chữ số';
  }

  if (!form.confirmPassword) {
    errors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
  } else if (form.password !== form.confirmPassword) {
    errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
  }

  return errors;
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState(initialForm);
  const [fieldErrors, setFieldErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setFieldErrors({ ...fieldErrors, [e.target.name]: '' });
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/auth/register', {
        fullName: form.fullName,
        email: form.email,
        phone: form.phone,
        username: form.username,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });
      setSuccess('Đăng ký thành công! Đang chuyển hướng...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setServerError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: 'fullName', label: 'Họ và tên', type: 'text', placeholder: 'Nhập họ và tên' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'Nhập email' },
    { name: 'phone', label: 'Số điện thoại', type: 'tel', placeholder: 'Nhập số điện thoại (10 chữ số)' },
    { name: 'username', label: 'Tên đăng nhập', type: 'text', placeholder: 'Nhập tên đăng nhập' },
    { name: 'password', label: 'Mật khẩu', type: 'password', placeholder: 'Tối thiểu 8 ký tự, có chữ hoa và số' },
    { name: 'confirmPassword', label: 'Xác nhận mật khẩu', type: 'password', placeholder: 'Nhập lại mật khẩu' },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Đăng Ký Tài Khoản</h2>

        {success && <p style={styles.success}>{success}</p>}

        <form onSubmit={handleSubmit}>
          {fields.map(({ name, label, type, placeholder }) => (
            <div key={name} style={styles.field}>
              <label style={styles.label}>{label}</label>
              <input
                style={{
                  ...styles.input,
                  borderColor: fieldErrors[name] ? '#e53e3e' : '#d9d9d9',
                }}
                type={type}
                name={name}
                value={form[name]}
                onChange={handleChange}
                placeholder={placeholder}
              />
              {fieldErrors[name] && (
                <span style={styles.fieldError}>{fieldErrors[name]}</span>
              )}
            </div>
          ))}

          {serverError && <p style={styles.error}>{serverError}</p>}

          <button style={styles.button} type="submit" disabled={loading}>
            {loading ? 'Đang đăng ký...' : 'Đăng Ký'}
          </button>
        </form>

        <p style={styles.footer}>
          Đã có tài khoản?{' '}
          <Link to="/login" style={styles.link}>
            Đăng nhập
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
    padding: '24px 0',
  },
  card: {
    backgroundColor: '#fff',
    padding: '40px',
    borderRadius: '8px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '440px',
  },
  title: {
    textAlign: 'center',
    marginBottom: '24px',
    color: '#1a3a5c',
    fontSize: '24px',
  },
  field: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    marginBottom: '5px',
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
  fieldError: {
    display: 'block',
    color: '#e53e3e',
    fontSize: '12px',
    marginTop: '4px',
  },
  error: {
    color: '#e53e3e',
    fontSize: '13px',
    marginBottom: '12px',
    textAlign: 'center',
  },
  success: {
    color: '#38a169',
    fontSize: '14px',
    marginBottom: '16px',
    textAlign: 'center',
    padding: '10px',
    backgroundColor: '#f0fff4',
    borderRadius: '4px',
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
