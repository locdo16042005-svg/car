import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import BrandCard from '../../components/common/BrandCard';
import BrandForm from '../../components/forms/BrandForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';

export default function BrandManagementPage() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingBrand, setDeletingBrand] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchBrands = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await axiosInstance.get('/brands');
      setBrands(res.data);
    } catch {
      setFetchError('Không thể tải danh sách hãng xe.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBrands(); }, [fetchBrands]);

  const handleOpenAdd = () => {
    setEditingBrand(null);
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (brand) => {
    setEditingBrand(brand);
    setFormError('');
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setFormError('');
    try {
      if (editingBrand) {
        await axiosInstance.put(`/brands/${editingBrand.id}`, data);
      } else {
        await axiosInstance.post('/brands', data);
      }
      setFormOpen(false);
      fetchBrands();
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setFormError('Tên hãng xe đã tồn tại. Vui lòng chọn tên khác.');
      } else if (status === 422) {
        setFormError('Không thể thực hiện thao tác này vì hãng xe đang có xe liên kết.');
      } else {
        setFormError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDelete = (brand) => {
    setDeletingBrand(brand);
    setDeleteError('');
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingBrand) return;
    try {
      await axiosInstance.delete(`/brands/${deletingBrand.id}`);
      setConfirmOpen(false);
      setDeletingBrand(null);
      fetchBrands();
    } catch (err) {
      const status = err.response?.status;
      if (status === 422) {
        setDeleteError('Không thể xóa hãng xe đang có xe liên kết.');
      } else {
        setDeleteError(err.response?.data?.message || 'Xóa thất bại. Vui lòng thử lại.');
      }
    }
  };

  const handleViewImages = (brand) => {
    window.location.href = `/admin/brands/${brand.id}/images`;
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Quản lý hãng xe</h2>
        <button style={styles.addBtn} onClick={handleOpenAdd}>+ Thêm hãng xe</button>
      </div>

      {fetchError && <p style={styles.fetchError}>{fetchError}</p>}

      {loading ? (
        <p style={styles.loadingText}>Đang tải...</p>
      ) : brands.length === 0 ? (
        <p style={styles.emptyText}>Chưa có hãng xe nào. Hãy thêm hãng xe đầu tiên!</p>
      ) : (
        <div style={styles.grid}>
          {brands.map((brand) => (
            <BrandCard
              key={brand.id}
              brand={brand}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onViewImages={handleViewImages}
            />
          ))}
        </div>
      )}

      <BrandForm
        isOpen={formOpen}
        brand={editingBrand}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
        loading={formLoading}
        error={formError}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Xác nhận xóa"
        message={
          deleteError
            ? deleteError
            : `Bạn có chắc muốn xóa hãng xe "${deletingBrand?.name}"? Hành động này không thể hoàn tác.`
        }
        onConfirm={deleteError ? undefined : handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingBrand(null); setDeleteError(''); }}
        confirmText={deleteError ? undefined : 'Xóa'}
        cancelText={deleteError ? 'Đóng' : 'Hủy'}
        confirmColor="#e53e3e"
      />
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0, color: '#1a3a5c', fontSize: '22px', fontWeight: '700' },
  addBtn: {
    padding: '10px 20px', backgroundColor: '#2563eb', color: '#fff',
    border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px', fontWeight: '500',
  },
  fetchError: { color: '#e53e3e', marginBottom: '16px', fontSize: '14px' },
  loadingText: { color: '#666', textAlign: 'center', marginTop: '40px' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: '40px', fontSize: '15px' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '20px',
  },
};
