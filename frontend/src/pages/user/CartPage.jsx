import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { setCart, removeFromCart, clearCart } from '../../store/cartSlice';

function formatPrice(price) {
  if (price == null) return '—';
  return price.toLocaleString('vi-VN') + ' đ';
}

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.items);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const [ordering, setOrdering] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get('/cart');
        const items = Array.isArray(res.data) ? res.data : [];
        dispatch(setCart(items));
      } catch {
        // silently fall back to Redux store
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [dispatch]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleRemove = async (carId) => {
    setRemovingId(carId);
    try {
      await axiosInstance.delete(`/cart/items/${carId}`);
      dispatch(removeFromCart(carId));
    } catch {
      showToast('error', 'Không thể xóa xe khỏi giỏ hàng. Vui lòng thử lại.');
    } finally {
      setRemovingId(null);
    }
  };

  const handleOrder = async () => {
    setOrdering(true);
    try {
      await axiosInstance.post('/orders');
      dispatch(clearCart());
      showToast('success', 'Đặt mua thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể đặt mua. Vui lòng thử lại.';
      showToast('error', msg);
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={() => navigate(-1)}>← Quay lại</button>
        <h2 style={styles.title}>Giỏ hàng của bạn</h2>
      </div>

      {toast && (
        <div style={{
          ...styles.toast,
          backgroundColor: toast.type === 'success' ? '#dcfce7' : '#fee2e2',
          color: toast.type === 'success' ? '#16a34a' : '#dc2626',
          borderColor: toast.type === 'success' ? '#86efac' : '#fca5a5',
        }}>
          {toast.message}
        </div>
      )}

      {loading ? (
        <p style={styles.centerText}>Đang tải giỏ hàng...</p>
      ) : cartItems.length === 0 ? (
        <div style={styles.emptyWrapper}>
          <p style={styles.emptyText}>Giỏ hàng trống</p>
          <button style={styles.browseBtn} onClick={() => navigate('/cars')}>
            Xem danh sách xe
          </button>
        </div>
      ) : (
        <>
          <div style={styles.tableWrapper}>
            <table style={styles.table}>
              <thead>
                <tr style={styles.thead}>
                  <th style={styles.th}>Xe</th>
                  <th style={styles.th}>Hãng</th>
                  <th style={{ ...styles.th, textAlign: 'right' }}>Giá</th>
                  <th style={{ ...styles.th, textAlign: 'center' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.carId} style={styles.tr}>
                    <td style={styles.td}>
                      <div style={styles.carCell}>
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.carName} style={styles.carImage} />
                        ) : (
                          <div style={styles.imagePlaceholder} />
                        )}
                        <span
                          style={styles.carName}
                          onClick={() => navigate(`/cars/${item.carId}`)}
                        >
                          {item.carName}
                        </span>
                      </div>
                    </td>
                    <td style={styles.td}>{item.brandName}</td>
                    <td style={{ ...styles.td, textAlign: 'right', fontWeight: '700', color: '#2563eb' }}>
                      {formatPrice(item.price)}
                    </td>
                    <td style={{ ...styles.td, textAlign: 'center' }}>
                      <button
                        style={{
                          ...styles.removeBtn,
                          ...(removingId === item.carId ? styles.removeBtnDisabled : {}),
                        }}
                        disabled={removingId === item.carId}
                        onClick={() => handleRemove(item.carId)}
                      >
                        {removingId === item.carId ? '...' : 'Xóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={styles.footer}>
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Tổng giá trị:</span>
              <span style={styles.totalPrice}>{formatPrice(totalPrice)}</span>
            </div>
            <button
              style={{
                ...styles.orderBtn,
                ...(ordering ? styles.orderBtnDisabled : {}),
              }}
              disabled={ordering}
              onClick={handleOrder}
            >
              {ordering ? 'Đang xử lý...' : 'Xác nhận đặt mua'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  header: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: 0,
  },
  title: { margin: 0, color: '#1a3a5c', fontSize: '22px', fontWeight: '700' },
  toast: {
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  centerText: { textAlign: 'center', color: '#888', marginTop: '48px', fontSize: '15px' },
  emptyWrapper: { textAlign: 'center', marginTop: '80px' },
  emptyText: { fontSize: '18px', color: '#6b7280', marginBottom: '16px' },
  browseBtn: {
    padding: '10px 24px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  tableWrapper: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    overflow: 'hidden',
    marginBottom: '20px',
  },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { backgroundColor: '#f8fafc' },
  th: {
    padding: '14px 16px',
    textAlign: 'left',
    fontSize: '13px',
    fontWeight: '600',
    color: '#6b7280',
    borderBottom: '1px solid #e5e7eb',
  },
  tr: { borderBottom: '1px solid #f1f5f9', transition: 'background-color 0.15s' },
  td: { padding: '14px 16px', fontSize: '14px', color: '#374151', verticalAlign: 'middle' },
  carCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  carImage: { width: '64px', height: '48px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 },
  imagePlaceholder: {
    width: '64px',
    height: '48px',
    borderRadius: '6px',
    backgroundColor: '#e5e7eb',
    flexShrink: 0,
  },
  carName: {
    fontWeight: '600',
    color: '#1a3a5c',
    cursor: 'pointer',
    textDecoration: 'underline',
    textDecorationColor: 'transparent',
  },
  removeBtn: {
    padding: '6px 14px',
    backgroundColor: '#fee2e2',
    color: '#dc2626',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
  },
  removeBtnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  footer: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    padding: '20px 24px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '16px',
  },
  totalRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  totalLabel: { fontSize: '16px', fontWeight: '600', color: '#374151' },
  totalPrice: { fontSize: '22px', fontWeight: '700', color: '#2563eb' },
  orderBtn: {
    padding: '12px 32px',
    backgroundColor: '#16a34a',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
  },
  orderBtnDisabled: {
    backgroundColor: '#cbd5e1',
    cursor: 'not-allowed',
    color: '#94a3b8',
  },
};
