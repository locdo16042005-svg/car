import { useState, useEffect, useCallback, useRef } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ConfirmDialog from '../../components/common/ConfirmDialog';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function formatPrice(price) {
  if (price == null) return '—';
  return price.toLocaleString('vi-VN') + ' đ';
}

const ORDER_STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const ORDER_STATUS_COLORS = {
  PENDING: '#d97706',
  CONFIRMED: '#2563eb',
  COMPLETED: '#16a34a',
  CANCELLED: '#dc2626',
};

export default function CustomerPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [search, setSearch] = useState('');

  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState('');

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [deleteError, setDeleteError] = useState('');

  const [actionError, setActionError] = useState('');

  const debounceRef = useRef(null);

  const fetchCustomers = useCallback(async (q = '') => {
    setLoading(true);
    setFetchError('');
    try {
      const res = await axiosInstance.get('/customers', { params: q ? { search: q } : {} });
      setCustomers(res.data);
    } catch {
      setFetchError('Không thể tải danh sách khách hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearch(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCustomers(val);
    }, 500);
  };

  const handleOpenDetail = async (customer) => {
    setDetailOpen(true);
    setSelectedCustomer(null);
    setDetailError('');
    setDetailLoading(true);
    try {
      const res = await axiosInstance.get(`/customers/${customer.id}`);
      setSelectedCustomer(res.data);
    } catch {
      setDetailError('Không thể tải thông tin chi tiết khách hàng.');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDetail = () => {
    setDetailOpen(false);
    setSelectedCustomer(null);
    setDetailError('');
  };

  const handleToggleActive = async (customer) => {
    setActionError('');
    try {
      await axiosInstance.patch(`/customers/${customer.id}/toggle-active`);
      fetchCustomers(search);
      if (detailOpen && selectedCustomer?.id === customer.id) {
        const res = await axiosInstance.get(`/customers/${customer.id}`);
        setSelectedCustomer(res.data);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể thay đổi trạng thái khách hàng.';
      setActionError(msg);
    }
  };

  const handleOpenDelete = (customer) => {
    setDeletingCustomer(customer);
    setDeleteError('');
    setConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!deletingCustomer) return;
    try {
      await axiosInstance.delete(`/customers/${deletingCustomer.id}`);
      setConfirmOpen(false);
      setDeletingCustomer(null);
      fetchCustomers(search);
    } catch (err) {
      const status = err.response?.status;
      if (status === 422) {
        setDeleteError(err.response?.data?.message || 'Không thể xóa khách hàng đang có đơn hàng đang xử lý.');
      } else {
        setDeleteError(err.response?.data?.message || 'Xóa thất bại. Vui lòng thử lại.');
      }
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Quản lý khách hàng</h2>
      </div>

      <div style={styles.searchBar}>
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={search}
          onChange={handleSearchChange}
          style={styles.searchInput}
        />
      </div>

      {fetchError && <p style={styles.errorText}>{fetchError}</p>}
      {actionError && <p style={styles.errorText}>{actionError}</p>}

      {loading ? (
        <p style={styles.loadingText}>Đang tải...</p>
      ) : customers.length === 0 ? (
        <p style={styles.emptyText}>Không tìm thấy khách hàng nào.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Họ tên</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Số điện thoại</th>
                <th style={styles.th}>Ngày đăng ký</th>
                <th style={styles.th}>Số đơn hàng</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr
                  key={c.id}
                  style={styles.tr}
                  onClick={() => handleOpenDetail(c)}
                >
                  <td style={styles.td}>{c.fullName || c.username}</td>
                  <td style={styles.td}>{c.email}</td>
                  <td style={styles.td}>{c.phone || '—'}</td>
                  <td style={styles.td}>{formatDate(c.createdAt)}</td>
                  <td style={styles.td}>{c.orderCount ?? 0}</td>
                  <td style={styles.td}>
                    <span style={{
                      ...styles.statusBadge,
                      color: c.isActive ? '#16a34a' : '#dc2626',
                      backgroundColor: c.isActive ? '#dcfce7' : '#fee2e2',
                    }}>
                      {c.isActive ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </td>
                  <td style={styles.td} onClick={(e) => e.stopPropagation()}>
                    <button style={styles.detailBtn} onClick={() => handleOpenDetail(c)}>Chi tiết</button>
                    <button
                      style={c.isActive ? styles.disableBtn : styles.enableBtn}
                      onClick={() => handleToggleActive(c)}
                    >
                      {c.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                    </button>
                    <button style={styles.deleteBtn} onClick={() => handleOpenDelete(c)}>Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Detail Modal */}
      {detailOpen && (
        <div style={styles.overlay} onClick={handleCloseDetail}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3 style={styles.modalTitle}>Chi tiết khách hàng</h3>
              <button style={styles.closeBtn} onClick={handleCloseDetail}>✕</button>
            </div>

            {detailLoading && <p style={styles.loadingText}>Đang tải...</p>}
            {detailError && <p style={styles.errorText}>{detailError}</p>}

            {selectedCustomer && !detailLoading && (
              <>
                <div style={styles.infoGrid}>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Họ tên</span>
                    <span style={styles.infoValue}>{selectedCustomer.fullName || selectedCustomer.username}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Email</span>
                    <span style={styles.infoValue}>{selectedCustomer.email}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Số điện thoại</span>
                    <span style={styles.infoValue}>{selectedCustomer.phone || '—'}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Ngày đăng ký</span>
                    <span style={styles.infoValue}>{formatDate(selectedCustomer.createdAt)}</span>
                  </div>
                  <div style={styles.infoItem}>
                    <span style={styles.infoLabel}>Trạng thái</span>
                    <span style={{
                      ...styles.statusBadge,
                      color: selectedCustomer.isActive ? '#16a34a' : '#dc2626',
                      backgroundColor: selectedCustomer.isActive ? '#dcfce7' : '#fee2e2',
                    }}>
                      {selectedCustomer.isActive ? 'Hoạt động' : 'Vô hiệu'}
                    </span>
                  </div>
                </div>

                <h4 style={styles.orderHistoryTitle}>Lịch sử đơn hàng</h4>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div style={styles.orderTableWrapper}>
                    <table style={styles.table}>
                      <thead>
                        <tr style={styles.thead}>
                          <th style={styles.th}>Mã đơn</th>
                          <th style={styles.th}>Tổng tiền</th>
                          <th style={styles.th}>Trạng thái</th>
                          <th style={styles.th}>Ngày đặt</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedCustomer.orders.map((order) => (
                          <tr key={order.id} style={styles.tr}>
                            <td style={styles.td}>{order.orderCode}</td>
                            <td style={styles.td}>{formatPrice(order.totalPrice)}</td>
                            <td style={styles.td}>
                              <span style={{
                                ...styles.statusBadge,
                                color: ORDER_STATUS_COLORS[order.status] || '#555',
                                backgroundColor: (ORDER_STATUS_COLORS[order.status] || '#555') + '18',
                              }}>
                                {ORDER_STATUS_LABELS[order.status] || order.status}
                              </span>
                            </td>
                            <td style={styles.td}>{formatDate(order.createdAt)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p style={styles.emptyText}>Khách hàng chưa có đơn hàng nào.</p>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={confirmOpen}
        title="Xác nhận xóa khách hàng"
        message={
          deleteError
            ? deleteError
            : `Bạn có chắc muốn xóa khách hàng "${deletingCustomer?.fullName || deletingCustomer?.username}"? Hành động này không thể hoàn tác.`
        }
        onConfirm={deleteError ? undefined : handleConfirmDelete}
        onCancel={() => { setConfirmOpen(false); setDeletingCustomer(null); setDeleteError(''); }}
        confirmText={deleteError ? undefined : 'Xóa'}
        cancelText={deleteError ? 'Đóng' : 'Hủy'}
        confirmColor="#e53e3e"
      />
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a3a5c', fontSize: '22px', fontWeight: '700' },
  searchBar: { marginBottom: '20px' },
  searchInput: {
    width: '100%', maxWidth: '400px', padding: '10px 14px',
    border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box',
  },
  errorText: { color: '#e53e3e', marginBottom: '12px', fontSize: '14px' },
  loadingText: { color: '#666', textAlign: 'center', marginTop: '40px' },
  emptyText: { color: '#888', textAlign: 'center', marginTop: '20px', fontSize: '15px' },
  tableWrapper: { overflowX: 'auto', borderRadius: '8px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' },
  table: { width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff', fontSize: '14px' },
  thead: { backgroundColor: '#f0f4f8' },
  th: {
    padding: '12px 16px', textAlign: 'left', fontWeight: '600',
    color: '#374151', borderBottom: '1px solid #e5e7eb', whiteSpace: 'nowrap',
  },
  tr: { borderBottom: '1px solid #f3f4f6', cursor: 'pointer' },
  td: { padding: '12px 16px', color: '#374151', verticalAlign: 'middle' },
  statusBadge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
    fontSize: '12px', fontWeight: '600',
  },
  detailBtn: {
    padding: '5px 12px', marginRight: '6px', border: '1px solid #2563eb',
    borderRadius: '4px', backgroundColor: '#fff', color: '#2563eb',
    cursor: 'pointer', fontSize: '12px',
  },
  disableBtn: {
    padding: '5px 12px', marginRight: '6px', border: '1px solid #d97706',
    borderRadius: '4px', backgroundColor: '#fff', color: '#d97706',
    cursor: 'pointer', fontSize: '12px',
  },
  enableBtn: {
    padding: '5px 12px', marginRight: '6px', border: '1px solid #16a34a',
    borderRadius: '4px', backgroundColor: '#fff', color: '#16a34a',
    cursor: 'pointer', fontSize: '12px',
  },
  deleteBtn: {
    padding: '5px 12px', border: '1px solid #e53e3e',
    borderRadius: '4px', backgroundColor: '#fff', color: '#e53e3e',
    cursor: 'pointer', fontSize: '12px',
  },
  // Modal
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  modal: {
    backgroundColor: '#fff', borderRadius: '10px', padding: '28px 32px',
    width: '100%', maxWidth: '700px', maxHeight: '85vh', overflowY: 'auto',
    boxShadow: '0 4px 24px rgba(0,0,0,0.18)',
  },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  modalTitle: { margin: 0, color: '#1a3a5c', fontSize: '18px', fontWeight: '700' },
  closeBtn: {
    background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer',
    color: '#6b7280', lineHeight: 1,
  },
  infoGrid: {
    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: '24px',
  },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '12px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: '14px', color: '#1f2937' },
  orderHistoryTitle: { margin: '0 0 12px', color: '#1a3a5c', fontSize: '16px', fontWeight: '600' },
  orderTableWrapper: { overflowX: 'auto', borderRadius: '6px', border: '1px solid #e5e7eb' },
};
