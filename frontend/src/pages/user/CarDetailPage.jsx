import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axiosInstance, { getImageUrl } from '../../api/axiosInstance';
import { addToCart } from '../../store/cartSlice';

const STATUS_LABELS = {
  AVAILABLE: 'Còn hàng',
  SOLD: 'Đã bán',
  RESERVED: 'Đã đặt cọc',
};

const STATUS_COLORS = {
  AVAILABLE: '#16a34a',
  SOLD: '#dc2626',
  RESERVED: '#d97706',
};

const CAR_TYPE_LABELS = {
  NEW: 'Xe mới',
  USED: 'Xe cũ',
};

function formatPrice(price) {
  if (price == null) return '—';
  return price.toLocaleString('vi-VN') + ' đ';
}

export default function CarDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axiosInstance.get(`/cars/${id}`);
        setCar(res.data);
        if (res.data.imageUrls && res.data.imageUrls.length > 0) {
          setMainImage(res.data.imageUrls[0]);
        }
      } catch {
        setError('Không thể tải thông tin xe. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async () => {
    setAdding(true);
    try {
      const res = await axiosInstance.post('/cart/items', { carId: car.id });
      dispatch(addToCart(res.data));
      showToast('success', `Đã thêm "${car.name}" vào giỏ hàng.`);
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        showToast('error', 'Xe này đã có trong giỏ hàng của bạn.');
      } else {
        showToast('error', 'Không thể thêm vào giỏ hàng. Vui lòng thử lại.');
      }
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div style={styles.center}>Đang tải...</div>;
  if (error) return <div style={styles.center}><p style={styles.errorText}>{error}</p></div>;
  if (!car) return null;

  const isUnavailable = car.status === 'SOLD' || car.status === 'RESERVED';
  const statusColor = STATUS_COLORS[car.status] || '#555';

  return (
    <div style={styles.page}>
      {/* Back button */}
      <button style={styles.backBtn} onClick={() => navigate(-1)}>
        ← Quay lại
      </button>

      {/* Toast */}
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

      <div style={styles.container}>
        {/* Gallery */}
        <div style={styles.gallerySection}>
          <div style={styles.mainImageWrapper}>
            {mainImage ? (
              <img src={getImageUrl(mainImage)} alt={car.name} style={styles.mainImage} />
            ) : (
              <div style={styles.imagePlaceholder}>
                <span style={{ color: '#aaa', fontSize: '14px' }}>Không có ảnh</span>
              </div>
            )}
            <span style={{
              ...styles.statusBadge,
              color: statusColor,
              backgroundColor: statusColor + '22',
            }}>
              {STATUS_LABELS[car.status] || car.status}
            </span>
          </div>

          {car.imageUrls && car.imageUrls.length > 1 && (
            <div style={styles.thumbnailRow}>
              {car.imageUrls.map((url, idx) => (
                <img
                  key={idx}
                  src={getImageUrl(url)}
                  alt={`${car.name} ${idx + 1}`}
                  style={{
                    ...styles.thumbnail,
                    ...(mainImage === url ? styles.thumbnailActive : {}),
                  }}
                  onClick={() => setMainImage(url)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div style={styles.infoSection}>
          <h1 style={styles.carName}>{car.name}</h1>
          <p style={styles.brandName}>{car.brandName}</p>

          <div style={styles.priceRow}>
            <span style={styles.price}>{formatPrice(car.price)}</span>
          </div>

          <div style={styles.infoGrid}>
            <InfoRow label="Hãng xe" value={car.brandName} />
            <InfoRow label="Loại xe" value={CAR_TYPE_LABELS[car.carType] || car.carType} />
            <InfoRow label="Năm sản xuất" value={car.year} />
            <InfoRow label="Màu sắc" value={car.color} />
            <InfoRow label="Số khung" value={car.chassisNumber} />
            <InfoRow
              label="Kiểm định"
              value={car.inspectionPassed ? '✓ Đã kiểm định' : '✗ Chưa kiểm định'}
              valueStyle={{ color: car.inspectionPassed ? '#16a34a' : '#dc2626', fontWeight: '600' }}
            />
          </div>

          {car.description && (
            <div style={styles.descSection}>
              <p style={styles.descLabel}>Mô tả</p>
              <p style={styles.descText}>{car.description}</p>
            </div>
          )}

          <button
            style={{
              ...styles.addBtn,
              ...(isUnavailable || adding ? styles.addBtnDisabled : {}),
            }}
            disabled={isUnavailable || adding}
            onClick={handleAddToCart}
          >
            {adding ? 'Đang thêm...' : isUnavailable ? 'Không thể đặt mua' : 'Thêm vào giỏ hàng'}
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueStyle }) {
  return (
    <div style={styles.infoRow}>
      <span style={styles.infoLabel}>{label}</span>
      <span style={{ ...styles.infoValue, ...valueStyle }}>{value ?? '—'}</span>
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  center: { display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' },
  errorText: { color: '#dc2626', fontSize: '15px' },
  backBtn: {
    background: 'none',
    border: 'none',
    color: '#2563eb',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    padding: '0 0 16px 0',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
  },
  toast: {
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  container: {
    display: 'flex',
    gap: '32px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
    padding: '28px',
    flexWrap: 'wrap',
  },
  gallerySection: { flex: '1 1 340px', minWidth: '280px' },
  mainImageWrapper: {
    position: 'relative',
    width: '100%',
    height: '300px',
    borderRadius: '8px',
    overflow: 'hidden',
    backgroundColor: '#f0f4f8',
  },
  mainImage: { width: '100%', height: '100%', objectFit: 'cover', display: 'block' },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
  },
  thumbnailRow: {
    display: 'flex',
    gap: '8px',
    marginTop: '12px',
    flexWrap: 'wrap',
  },
  thumbnail: {
    width: '72px',
    height: '54px',
    objectFit: 'cover',
    borderRadius: '6px',
    cursor: 'pointer',
    border: '2px solid transparent',
    transition: 'border-color 0.15s',
  },
  thumbnailActive: { borderColor: '#2563eb' },
  infoSection: { flex: '1 1 320px', minWidth: '280px' },
  carName: { margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: '#1a3a5c' },
  brandName: { margin: '0 0 16px', fontSize: '15px', color: '#666' },
  priceRow: { marginBottom: '20px' },
  price: { fontSize: '26px', fontWeight: '700', color: '#2563eb' },
  infoGrid: {
    borderTop: '1px solid #e5e7eb',
    borderBottom: '1px solid #e5e7eb',
    padding: '16px 0',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  infoRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  infoLabel: { fontSize: '14px', color: '#6b7280' },
  infoValue: { fontSize: '14px', fontWeight: '600', color: '#1f2937' },
  descSection: { marginBottom: '24px' },
  descLabel: { fontSize: '14px', fontWeight: '600', color: '#374151', margin: '0 0 6px' },
  descText: { fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: 0 },
  addBtn: {
    width: '100%',
    padding: '14px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '15px',
    fontWeight: '700',
    transition: 'background-color 0.2s',
  },
  addBtnDisabled: {
    backgroundColor: '#cbd5e1',
    cursor: 'not-allowed',
    color: '#94a3b8',
  },
};
