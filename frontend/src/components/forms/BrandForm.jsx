import { useState, useEffect, useRef } from 'react';
import axiosInstance, { getImageUrl } from '../../api/axiosInstance';

export default function BrandForm({ isOpen, brand, onSubmit, onClose, loading, error }) {
  const [form, setForm] = useState({ name: '', logoUrl: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (brand) {
      setForm({ name: brand.name || '', logoUrl: brand.logoUrl || '', description: brand.description || '' });
    } else {
      setForm({ name: '', logoUrl: '', description: '' });
    }
    setUploadError('');
  }, [brand, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url ?? res.data;
      setForm((prev) => ({ ...prev, logoUrl: url }));
    } catch {
      setUploadError('Upload thất bại. Vui lòng thử lại.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.header}>
          <h3 style={styles.title}>{brand ? 'Sửa hãng xe' : 'Thêm hãng xe'}</h3>
          <button style={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={styles.field}>
            <label style={styles.label}>Tên hãng xe <span style={styles.required}>*</span></label>
            <input
              style={styles.input}
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Nhập tên hãng xe"
              required
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Logo hãng xe</label>
            <div style={styles.logoRow}>
              {form.logoUrl && (
                <img src={getImageUrl(form.logoUrl)} alt="logo preview" style={styles.preview}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              )}
              <button
                type="button"
                style={{ ...styles.uploadBtn, ...(uploading ? styles.uploadBtnDisabled : {}) }}
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? 'Đang upload...' : form.logoUrl ? 'Đổi ảnh' : 'Chọn ảnh'}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
            </div>
            {uploadError && <p style={styles.uploadError}>{uploadError}</p>}
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Mô tả</label>
            <textarea
              style={styles.textarea}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Nhập mô tả hãng xe"
              rows={3}
            />
          </div>

          {error && <p style={styles.error}>{error}</p>}

          <div style={styles.actions}>
            <button type="button" style={styles.cancelBtn} onClick={onClose}>Hủy</button>
            <button type="submit" style={styles.submitBtn} disabled={loading || uploading}>
              {loading ? 'Đang lưu...' : (brand ? 'Cập nhật' : 'Thêm mới')}
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
    width: '100%', maxWidth: '480px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
    maxHeight: '90vh', overflowY: 'auto',
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a3a5c', fontSize: '18px' },
  closeBtn: { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#666', padding: '4px' },
  field: { marginBottom: '16px' },
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
  logoRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  preview: { height: '56px', width: '56px', objectFit: 'contain', borderRadius: '6px', border: '1px solid #e5e7eb' },
  uploadBtn: {
    padding: '8px 16px', backgroundColor: '#f0f4f8', color: '#1a3a5c',
    border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
  },
  uploadBtnDisabled: { opacity: 0.6, cursor: 'not-allowed' },
  uploadError: { color: '#e53e3e', fontSize: '12px', marginTop: '4px' },
  error: { color: '#e53e3e', fontSize: '13px', marginBottom: '12px' },
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
