import { useState, useEffect } from 'react';
import ImageUpload from '../common/ImageUpload';

const CAR_STATUS_LABELS = {
  AVAILABLE: 'Còn hàng',
  SOLD: 'Đã bán',
  RESERVED: 'Đã đặt cọc',
};

export default function CarForm({ isOpen, car, carType, brands, onSubmit, onClose, loading, error }) {
  const [form, setForm] = useState({
    name: '',
    brandId: '',
    price: '',
    year: '',
    color: '',
    chassisNumber: '',
    description: '',
    status: 'AVAILABLE',
    imageUrls: [],
  });

  useEffect(() => {
    if (car) {
      setForm({
        name: car.name || '',
        brandId: car.brandId ? String(car.brandId) : '',
        price: car.price ? String(car.price) : '',
        year: car.year ? String(car.year) : '',
        color: car.color || '',
        chassisNumber: car.chassisNumber || '',
        description: car.description || '',
        status: car.status || 'AVAILABLE',
        imageUrls: car.imageUrls || [],
      });
    } else {
      setForm({
        name: '',
        brandId: brands.length > 0 ? String(brands[0].id) : '',
        price: '',
        year: '',
        color: '',
        chassisNumber: '',
        description: '',
        status: 'AVAILABLE',
        imageUrls: [],
      });
    }
  }, [car, isOpen, brands]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUploadComplete = (urls) => {
    setForm((prev) => ({ ...prev, imageUrls: urls }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      name: form.name,
      brandId: Number(form.brandId),
      carType,
      price: Number(form.price),
      year: Number(form.year),
      color: form.color || undefined,
      chassisNumber: form.chassisNumber,
      description: form.description || undefined,
      status: form.status,
      imageUrls: form.imageUrls,
    });
  };

  const currentYear = new Date().getFullYear();

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            {car ? 'Sửa thông tin xe' : `Thêm xe ${carType === 'NEW' ? 'mới' : 'cũ'}`}
          </h3>
          <button style={styles.closeBtn} onClick={onClose} type="button">✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Tên xe <span style={styles.required}>*</span></label>
            <input
              style={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên xe"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Hãng xe <span style={styles.required}>*</span></label>
            <select
              style={styles.input}
              name="brandId"
              value={form.brandId}
              onChange={handleChange}
              required
            >
              <option value="">-- Chọn hãng xe --</option>
              {brands.map((b) => (
                <option key={b.id} value={String(b.id)}>{b.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Giá (VNĐ) <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                placeholder="500000000"
                min="0"
                required
              />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Năm sản xuất <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="number"
                name="year"
                value={form.year}
                onChange={handleChange}
                placeholder={String(currentYear)}
                min="1900"
                max={currentYear + 1}
                required
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Màu sắc</label>
              <input
                style={styles.input}
                type="text"
                name="color"
                value={form.color}
                onChange={handleChange}
                placeholder="Trắng, Đen, Đỏ..."
              />
            </div>
            <div style={{ ...styles.field, flex: 1 }}>
              <label style={styles.label}>Số khung <span style={styles.required}>*</span></label>
              <input
                style={styles.input}
                type="text"
                name="chassisNumber"
                value={form.chassisNumber}
                onChange={handleChange}
                placeholder="VIN/Số khung xe"
                required
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Trạng thái</label>
            <select style={styles.input} name="status" value={form.status} onChange={handleChange}>
              {Object.entries(CAR_STATUS_LABELS).map(([val, label]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mô tả</label>
            <textarea
              style={styles.textarea}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả xe"
              rows={3}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Hình ảnh</label>
            <ImageUpload
              key={isOpen ? (car?.id ?? 'new') : 'closed'}
              existingUrls={form.imageUrls}
              onUploadComplete={handleImageUploadComplete}
              maxFiles={10}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Hủy</button>
            <button type="submit" style={styles.submitBtn} disabled={loading}>
              {loading ? 'Đang lưu...' : (car ? 'Cập nhật' : 'Thêm mới')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '28px 32px',
    width: '100%', maxWidth: '600px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    maxHeight: '90vh', overflowY: 'auto',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a3a5c', fontSize: '18px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666', padding: '4px' },
  field: { marginBottom: '16px' },
  row: { display: 'flex', gap: '16px' },
  label: { display: 'block', marginBottom: '6px', fontWeight: '500', color: '#333', fontSize: '14px' },
  required: { color: '#e53e3e' },
  input: {
    width: '100%', padding: '9px 12px', border: '1px solid #d9d9d9',
    borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none',
  },
  textarea: {
    width: '100%', padding: '9px 12px', border: '1px solid #d9d9d9',
    borderRadius: '4px', fontSize: '14px', boxSizing: 'border-box', outline: 'none', resize: 'vertical',
  },
  error: { color: '#e53e3e', fontSize: '13px', marginBottom: '12px', padding: '8px 12px', background: '#fdecea', borderRadius: '4px' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '8px' },
  cancelBtn: {
    padding: '9px 20px', border: '1px solid #d9d9d9', borderRadius: '4px',
    backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', color: '#333',
  },
  submitBtn: {
    padding: '9px 20px', border: 'none', borderRadius: '4px',
    backgroundColor: '#2563eb', color: '#fff', cursor: 'pointer', fontSize: '14px',
  },
};
