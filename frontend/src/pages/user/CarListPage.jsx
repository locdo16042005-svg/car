import { useState, useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import axiosInstance from '../../api/axiosInstance';
import { addToCart } from '../../store/cartSlice';
import CarCard from '../../components/common/CarCard';

const CAR_TYPE_OPTIONS = [
  { value: '', label: 'Tất cả' },
  { value: 'NEW', label: 'Xe mới' },
  { value: 'USED', label: 'Xe cũ' },
];

export default function CarListPage() {
  const dispatch = useDispatch();

  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Filter state
  const [brandId, setBrandId] = useState('');
  const [carType, setCarType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  // Applied filters (only update on "Lọc" click)
  const [appliedFilters, setAppliedFilters] = useState({ brandId: '', carType: '', minPrice: '', maxPrice: '' });

  // Cart feedback
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', message }

  const fetchBrands = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/brands');
      setBrands(res.data);
    } catch {
      // non-critical
    }
  }, []);

  const fetchCars = useCallback(async (filters) => {
    setLoading(true);
    setFetchError('');
    try {
      const params = {};
      if (filters.carType) params.type = filters.carType;
      if (filters.brandId) params.brandId = filters.brandId;
      if (filters.minPrice) params.minPrice = filters.minPrice;
      if (filters.maxPrice) params.maxPrice = filters.maxPrice;
      const res = await axiosInstance.get('/cars', { params });
      // After interceptor unwrap: res.data is the array directly
      setCars(Array.isArray(res.data) ? res.data : []);
    } catch {
      setFetchError('Không thể tải danh sách xe. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchCars(appliedFilters);
  }, [fetchBrands, fetchCars, appliedFilters]);

  const handleFilter = () => {
    setAppliedFilters({ brandId, carType, minPrice, maxPrice });
  };

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = async (car) => {
    setAddingId(car.id);
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
      setAddingId(null);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Danh sách xe</h2>

      {/* Filter bar */}
      <div style={styles.filterBar}>
        <select
          style={styles.select}
          value={brandId}
          onChange={(e) => setBrandId(e.target.value)}
        >
          <option value="">Tất cả hãng xe</option>
          {brands.map((b) => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </select>

        <select
          style={styles.select}
          value={carType}
          onChange={(e) => setCarType(e.target.value)}
        >
          {CAR_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>

        <input
          style={styles.input}
          type="number"
          placeholder="Giá từ (đ)"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          min={0}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Giá đến (đ)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          min={0}
        />

        <button style={styles.filterBtn} onClick={handleFilter}>Lọc</button>
      </div>

      {/* Toast notification */}
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

      {fetchError && <p style={styles.errorText}>{fetchError}</p>}

      {loading ? (
        <p style={styles.centerText}>Đang tải...</p>
      ) : cars.length === 0 ? (
        <p style={styles.centerText}>Không tìm thấy xe nào phù hợp.</p>
      ) : (
        <div style={styles.grid}>
          {cars.map((car) => (
            <CarCard
              key={car.id}
              car={car}
              onAddToCart={handleAddToCart}
              addingId={addingId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  title: { margin: '0 0 20px', color: '#1a3a5c', fontSize: '22px', fontWeight: '700' },
  filterBar: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: '16px',
    borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
    marginBottom: '24px',
  },
  select: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    backgroundColor: '#fff',
    cursor: 'pointer',
    minWidth: '140px',
  },
  input: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    color: '#374151',
    width: '130px',
  },
  filterBtn: {
    padding: '8px 20px',
    backgroundColor: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
  toast: {
    padding: '12px 16px',
    borderRadius: '6px',
    border: '1px solid',
    marginBottom: '16px',
    fontSize: '14px',
    fontWeight: '500',
  },
  errorText: { color: '#dc2626', marginBottom: '16px', fontSize: '14px' },
  centerText: { textAlign: 'center', color: '#888', marginTop: '48px', fontSize: '15px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
    gap: '20px',
  },
};
