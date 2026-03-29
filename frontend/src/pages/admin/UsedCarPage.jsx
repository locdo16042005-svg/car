import { useState, useEffect, useCallback } from 'react';
import axiosInstance, { getImageUrl } from '../../api/axiosInstance';
import CarForm from '../../components/forms/CarForm';
import ConfirmDialog from '../../components/common/ConfirmDialog';

const CAR_TYPE = 'USED';

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

export default function UsedCarPage() {
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editingCar, setEditingCar] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingCar, setDeletingCar] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const fetchCars = useCallback(async () => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await axiosInstance.get('/cars', { params: { type: CAR_TYPE } });
      setCars(Array.isArray(res.data) ? res.data : []);
    } catch {
      setFetchError('Không thể tải danh sách xe cũ.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBrands = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/brands');
      setBrands(res.data);
    } catch {
      // brands load failure is non-critical
    }
  }, []);

  useEffect(() => {
    fetchCars();
    fetchBrands();
  }, [fetchCars, fetchBrands]);

  const handleOpenAdd = () => {
    setEditingCar(null);
    setFormError('');
    setFormOpen(true);
  };

  const handleOpenEdit = (car) => {
    setEditingCar(car);
    setFormError('');
    setFormOpen(true);
  };

  const handleFormSubmit = async (data) => {
    setFormLoading(true);
    setFormError('');
    try {
      if (editingCar) {
        await axiosInstance.put(`/cars/${editingCar.id}`, data);
      } else {
        await axiosInstance.post('/cars', data);
      }
      setFormOpen(false);
      fetchCars();
    } catch (err) {
      const status = err.response?.status;
      if (status === 409) {
        setFormError('Số khung xe đã tồn tại. Vui lòng kiểm tra lại.');
      } else if (status === 422) {
        setFormError('Không thể thực hiện thao tác này vì xe đang có trong đơn hàng.');
      } else {
        setFormError(err.response?.data?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setFormLoading(false);
    }
  };

  const handleOpenDelete = (car) => {
    setDeletingCar(car);
    setDeleteError('');
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCar) return;
    try {
      await axiosInstance.delete(`/cars/${deletingCar.id}`);
      setConfirmOpen(false);
      setDeletingCar(null);
      fetchCars();
    } catch (err) {
      const status = err.response?.status;
      if (status === 422) {
        setDeleteError('Không thể xóa xe đang có trong đơn hàng đang xử lý.');
      } else {
        setDeleteError(err.response?.data?.message || 'Xóa thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Quản lý xe cũ</h2>
        <button style={styles.addBtn} onClick={handleOpenAdd}>+ Thêm xe cũ</button>
      </div>

      {fetchError && <p style={styles.fetchError}>{fetchError}</p>}

      {loading ? (
        <p style={styles.loadingText}>Đang tải...</p>
      ) : cars.length === 0 ? (
        <p style={styles.emptyText}>Chưa có xe cũ nào. Hãy thêm xe đầu tiên!</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Ảnh</th>
                <th style={styles.th}>Tên xe</th>
                <th style={styles.th}>Hãng xe</th>
                <th style={styles.th}>Giá</th>
                <th style={styles.th}>Năm</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {cars.map((car) => (
                <tr key={car.id} style={styles.tr}>
                  <td style={styles.td}>
                    {car.imageUrls && car.imageUrls.length > 0 ? (
                      <img src={getImageUrl(car.imageUrls[0])} alt={car.name} style={styles.thumbnail} />
                    ) : (
                      <div style={styles.noImage}>—</div>
                    )}
                  </td>
                  <td style={styles.td}>{car.name}</td>
                  <td style={styles.td}>{car.brandName}</td>
                  <td style={styles.td}>{formatPrice(car.price)}</td>
                  <td style={styles.td}>{car.year}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      color: STATUS_COLORS[car.status] || '#555',
                      backgroundColor: (STATUS_COLORS[car.status] || '#555') + '18',
                    }}>
                      {STATUS_LABELS[car.status] || car.status}
                    </span>
                  </td>
                  <td style={styles.td}>
                    <button style={styles.editBtn} onClick={() => handleOpenEdit(car)}>Sửa</button>
                    <button style={styles.deleteBtn} onClick={() => handleOpenDelete(car)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CarForm
        isOpen={formOpen}
        car={editingCar}
        carType={CAR_TYPE}
        brands={brands}
        onSubmit={handleFormSubmit}
        onClose={() => setFormOpen(false)}
        loading={formLoading}
        error={formError}
      />

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Xác nhận xóa xe"
        message={
          deleteError
            ? deleteError
            : `Bạn có chắc muốn xóa xe "${deletingCar?.name}"? Hành động này không thể hoàn tác.`
        }
        onConfirm={deleteError ? undefined : handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingCar(null); setDeleteError(''); }}
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
  tableWrapper: { overflowX: 'auto', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontSize: '14px' },
  thead: { backgroundColor: '#f0f4f8' },
  th: {
    padding: '12px 16px', textAlign: 'left', fontWeight: '600',
    color: '#374151', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px 16px', color: '#374151', verticalAlign: 'middle' },
  thumbnail: { width: '64px', height: '48px', objectFit: 'cover', borderRadius: '4px', display: 'block' },
  noImage: { width: '64px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '18px' },
  statusBadge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
    fontSize: '12px', fontWeight: '600',
  },
  editBtn: {
    padding: '6px 14px', marginRight: '8px', border: '1px solid #2563eb',
    borderRadius: '4px', backgroundColor: '#fff', color: '#2563eb',
    cursor: 'pointer', fontSize: '13px',
  },
  deleteBtn: {
    padding: '6px 14px', border: '1px solid #e53e3e',
    borderRadius: '4px', backgroundColor: '#fff', color: '#e53e3e',
    cursor: 'pointer', fontSize: '13px',
  },
};
