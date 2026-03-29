import { useNavigate } from 'react-router-dom';
import { getImageUrl } from '../../api/axiosInstance';

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

function formatPrice(price) {
  if (price == null) return '—';
  return price.toLocaleString('vi-VN') + ' đ';
}

export default function CarCard({ car, onAddToCart, addingId }) {
  const navigate = useNavigate();
  const isUnavailable = car.status === 'SOLD' || car.status === 'RESERVED';
  const isAdding = addingId === car.id;

  return (
    <div style={styles.card} onClick={() => navigate(`/cars/${car.id}`)}>
      <div style={styles.imageWrapper}>
        {car.imageUrls && car.imageUrls.length > 0 ? (
          <img src={getImageUrl(car.imageUrls[0])} alt={car.name} style={styles.image} />
        ) : (
          <div style={styles.imagePlaceholder}>
            <span style={styles.placeholderText}>Không có ảnh</span>
          </div>
        )}
        <span style={{
          ...styles.statusBadge,
          color: STATUS_COLORS[car.status] || '#555',
          backgroundColor: (STATUS_COLORS[car.status] || '#555') + '22',
        }}>
          {STATUS_LABELS[car.status] || car.status}
        </span>
      </div>

      <div style={styles.body}>
        <h3 style={styles.name}>{car.name}</h3>
        <p style={styles.brand}>{car.brandName}</p>
        <div style={styles.meta}>
          <span style={styles.year}>{car.year}</span>
          <span style={styles.price}>{formatPrice(car.price)}</span>
        </div>
      </div>

      <button
        style={{
          ...styles.addBtn,
          ...(isUnavailable || isAdding ? styles.addBtnDisabled : {}),
        }}
        disabled={isUnavailable || isAdding}
        onClick={(e) => {
          e.stopPropagation();
          if (!isUnavailable && !isAdding) onAddToCart(car);
        }}
      >
        {isAdding ? 'Đang thêm...' : 'Thêm vào giỏ hàng'}
      </button>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    cursor: 'pointer',
    transition: 'box-shadow 0.2s, transform 0.15s',
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: '180px',
    backgroundColor: '#f0f4f8',
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: { color: '#aaa', fontSize: '13px' },
  statusBadge: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    padding: '3px 10px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '600',
  },
  body: { padding: '14px 16px', flex: 1 },
  name: { margin: '0 0 4px', fontSize: '15px', fontWeight: '700', color: '#1a3a5c', lineHeight: 1.3 },
  brand: { margin: '0 0 10px', fontSize: '13px', color: '#666' },
  meta: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  year: { fontSize: '13px', color: '#888' },
  price: { fontSize: '15px', fontWeight: '700', color: '#2563eb' },
  addBtn: {
    margin: '0 16px 16px',
    padding: '9px 0',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    width: 'calc(100% - 32px)',
    transition: 'background-color 0.2s',
  },
  addBtnDisabled: {
    backgroundColor: '#cbd5e1',
    cursor: 'not-allowed',
    color: '#94a3b8',
  },
};
