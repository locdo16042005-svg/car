import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function formatPrice(price) {
  if (price == null) return '—';
  return price.toLocaleString('vi-VN') + ' đ';
}

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'COMPLETED', 'CANCELLED'];

const STATUS_LABELS = {
  PENDING: 'Chờ xử lý',
  CONFIRMED: 'Đã xác nhận',
  PROCESSING: 'Đang xử lý',
  COMPLETED: 'Hoàn thành',
  CANCELLED: 'Đã hủy',
};

const STATUS_COLORS = {
  PENDING:    { color: '#92400e', bg: '#fef3c7' },
  CONFIRMED:  { color: '#1e40af', bg: '#dbeafe' },
  PROCESSING: { color: '#6b21a8', bg: '#f3e8ff' },
  COMPLETED:  { color: '#166534', bg: '#dcfce7' },
  CANCELLED:  { color: '#991b1b', bg: '#fee2e2' },
};

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Filters
  const [filterStatus, setFilterStatus] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Per-row status update errors
  const [rowErrors, setRowErrors] = useState({});
  // Per-row updating state
  const [updatingRows, setUpdatingRows] = useState({});

  const fetchOrders = useCallback(async (status, start, end) => {
    setLoading(true);
    setFetchError('');
    try {
      const params = {};
      if (status) params.status = status;
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      const res = await axiosInstance.get('/orders', { params });
      setOrders(res.data);
    } catch {
      setFetchError('Không thể tải danh sách đơn hàng.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(filterStatus, startDate, endDate);
  }, [fetchOrders, filterStatus, startDate, endDate]);

  const handleStatusChange = async (orderId, newStatus) => {
    setRowErrors((prev) => ({ ...prev, [orderId]: '' }));
    setUpdatingRows((prev) => ({ ...prev, [orderId]: true }));
    try {
      await axiosInstance.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      const status = err.response?.status;
      if (status === 422) {
        setRowErrors((prev) => ({
          ...prev,
          [orderId]: err.response?.data?.message || 'Không thể hủy đơn hàng đã hoàn thành.',
        }));
      } else {
        setRowErrors((prev) => ({
          ...prev,
          [orderId]: err.response?.data?.message || 'Cập nhật trạng thái thất bại.',
        }));
      }
    } finally {
      setUpdatingRows((prev) => ({ ...prev, [orderId]: false }));
    }
  };

  const handleApplyFilter = () => {
    fetchOrders(filterStatus, startDate, endDate);
  };

  const handleResetFilter = () => {
    setFilterStatus('');
    setStartDate('');
    setEndDate('');
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Quản lý đơn hàng</h2>
      </div>

      {/* Filter bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Trạng thái</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={styles.select}
          >
            <option value="">Tất cả</option>
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{STATUS_LABELS[s]}</option>
            ))}
          </select>
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Từ ngày</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>

        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Đến ngày</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            style={styles.dateInput}
          />
        </div>

        <div style={styles.filterActions}>
          <button onClick={handleApplyFilter} style={styles.applyBtn}>Lọc</button>
          <button onClick={handleResetFilter} style={styles.resetBtn}>Đặt lại</button>
        </div>
      </div>

      {fetchError && <p style={styles.errorText}>{fetchError}</p>}

      {loading ? (
        <p style={styles.loadingText}>Đang tải...</p>
      ) : orders.length === 0 ? (
        <p style={styles.emptyText}>Không có đơn hàng nào.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Mã đơn hàng</th>
                <th style={styles.th}>Khách hàng</th>
                <th style={styles.th}>Tổng tiền (VND)</th>
                <th style={styles.th}>Ngày đặt</th>
                <th style={styles.th}>Trạng thái</th>
                <th style={styles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const colors = STATUS_COLORS[order.status] || { color: '#555', bg: '#f3f4f6' };
                return (
                  <tr key={order.id} style={styles.tr}>
                    <td style={styles.td}>{order.orderCode}</td>
                    <td style={styles.td}>{order.userFullName || '—'}</td>
                    <td style={styles.td}>{formatPrice(order.totalPrice)}</td>
                    <td style={styles.td}>{formatDate(order.createdAt)}</td>
                    <td style={styles.td}>
                      <span style={{
                        ...styles.statusBadge,
                        color: colors.color,
                        backgroundColor: colors.bg,
                      }}>
                        {STATUS_LABELS[order.status] || order.status}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.actionCell}>
                        <select
                          value={order.status}
                          disabled={updatingRows[order.id]}
                          onChange={(e) => handleStatusChange(order.id, e.target.value)}
                          style={styles.statusSelect}
                        >
                          {ORDER_STATUSES.map((s) => (
                            <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                          ))}
                        </select>
                        {updatingRows[order.id] && (
                          <span style={styles.updatingText}>Đang cập nhật...</span>
                        )}
                        {rowErrors[order.id] && (
                          <span style={styles.rowError}>{rowErrors[order.id]}</span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a3a5c', fontSize: '22px', fontWeight: '700' },

  filterBar: {
    display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end',
    backgroundColor: '#fff', padding: '16px 20px', borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '20px',
  },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  filterLabel: { fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' },
  select: {
    padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#374151', backgroundColor: '#fff', cursor: 'pointer',
    outline: 'none', minWidth: '160px',
  },
  dateInput: {
    padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#374151', outline: 'none',
  },
  filterActions: { display: 'flex', gap: '8px', alignItems: 'flex-end' },
  applyBtn: {
    padding: '8px 20px', backgroundColor: '#1a3a5c', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '600',
  },
  resetBtn: {
    padding: '8px 16px', backgroundColor: '#fff', color: '#6b7280',
    border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', cursor: 'pointer',
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
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '12px 16px', color: '#374151', verticalAlign: 'middle' },
  statusBadge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
    fontSize: '12px', fontWeight: '600',
  },

  actionCell: { display: 'flex', flexDirection: 'column', gap: '4px' },
  statusSelect: {
    padding: '6px 10px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '13px', color: '#374151', backgroundColor: '#fff', cursor: 'pointer',
    outline: 'none', minWidth: '150px',
  },
  updatingText: { fontSize: '12px', color: '#6b7280', fontStyle: 'italic' },
  rowError: { fontSize: '12px', color: '#e53e3e', maxWidth: '200px' },
};
