import { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';

const RESULT_OPTIONS = [
  { value: 'PASSED', label: 'Đạt' },
  { value: 'FAILED', label: 'Không đạt' },
];

export default function InspectionForm({ inspection, onSuccess, onClose }) {
  const isEdit = !!inspection;

  const [cars, setCars] = useState([]);
  const [carId, setCarId] = useState(inspection?.carId ?? '');
  const [inspectionDate, setInspectionDate] = useState(inspection?.inspectionDate ?? '');
  const [result, setResult] = useState(inspection?.result ?? 'PASSED');
  const [notes, setNotes] = useState(inspection?.notes ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    axiosInstance.get('/cars').then((res) => setCars(res.data)).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!carId) { setError('Vui lòng chọn xe.'); return; }
    if (!inspectionDate) { setError('Vui lòng chọn ngày kiểm định.'); return; }

    setSubmitting(true);
    setError('');
    try {
      const body = { carId: Number(carId), inspectionDate, result, notes };
      if (isEdit) {
        await axiosInstance.put(`/inspections/${inspection.id}`, body);
      } else {
        await axiosInstance.post('/inspections', body);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h3 style={styles.modalTitle}>{isEdit ? 'Sửa phiếu kiểm định' : 'Tạo phiếu kiểm định mới'}</h3>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Xe <span style={styles.required}>*</span></label>
            <select
              value={carId}
              onChange={(e) => setCarId(e.target.value)}
              style={styles.input}
              required
            >
              <option value="">-- Chọn xe --</option>
              {cars.map((car) => (
                <option key={car.id} value={car.id}>{car.name}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Ngày kiểm định <span style={styles.required}>*</span></label>
            <input
              type="date"
              value={inspectionDate}
              onChange={(e) => setInspectionDate(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Kết quả <span style={styles.required}>*</span></label>
            <select
              value={result}
              onChange={(e) => setResult(e.target.value)}
              style={styles.input}
            >
              {RESULT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Ghi chú</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={styles.textarea}
              rows={3}
              placeholder="Nhập ghi chú (nếu có)..."
            />
          </div>

          {error && <p style={styles.errorText}>{error}</p>}

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.cancelBtn} disabled={submitting}>
              Hủy
            </button>
            <button type="submit" style={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo phiếu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '10px', width: '100%', maxWidth: '480px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '16px 20px', borderBottom: '1px solid #e5e7eb', backgroundColor: '#f8fafc',
  },
  modalTitle: { margin: 0, fontSize: '17px', fontWeight: '700', color: '#1a3a5c' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
    color: '#6b7280', lineHeight: 1,
  },
  form: { padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' },
  field: { display: 'flex', flexDirection: 'column', gap: '5px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#374151' },
  required: { color: '#e53e3e' },
  input: {
    padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#374151', outline: 'none', backgroundColor: '#fff',
  },
  textarea: {
    padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#374151', outline: 'none', resize: 'vertical', fontFamily: 'inherit',
  },
  errorText: { color: '#e53e3e', fontSize: '13px', margin: 0 },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '4px' },
  cancelBtn: {
    padding: '9px 20px', backgroundColor: '#fff', color: '#6b7280',
    border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', cursor: 'pointer',
  },
  submitBtn: {
    padding: '9px 24px', backgroundColor: '#1a3a5c', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '600',
  },
};
