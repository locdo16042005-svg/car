import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../../api/axiosInstance';
import InspectionForm from '../../components/forms/InspectionForm';

function formatDate(dateStr) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

const RESULT_BADGE = {
  PASSED: { label: 'Đạt', color: '#166534', bg: '#dcfce7' },
  FAILED: { label: 'Không đạt', color: '#991b1b', bg: '#fee2e2' },
};

export default function InspectionPage() {
  const [inspections, setInspections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingInspection, setEditingInspection] = useState(null);

  const fetchInspections = useCallback(async (kw, start, end) => {
    setLoading(true);
    setFetchError('');
    try {
      const params = {};
      if (kw) params.keyword = kw;
      if (start) params.startDate = start;
      if (end) params.endDate = end;
      const res = await axiosInstance.get('/inspections', { params });
      setInspections(res.data);
    } catch {
      setFetchError('Không thể tải danh sách phiếu kiểm định.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInspections(keyword, startDate, endDate);
  }, [fetchInspections]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleApplyFilter = () => fetchInspections(keyword, startDate, endDate);

  const handleResetFilter = () => {
    setKeyword('');
    setStartDate('');
    setEndDate('');
    fetchInspections('', '', '');
  };

  const handleOpenCreate = () => {
    setEditingInspection(null);
    setShowForm(true);
  };

  const handleOpenEdit = (inspection) => {
    setEditingInspection(inspection);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchInspections(keyword, startDate, endDate);
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h2 style={styles.title}>Quản lý phiếu kiểm định</h2>
        <button onClick={handleOpenCreate} style={styles.createBtn}>+ Tạo phiếu mới</button>
      </div>

      {/* Filter bar */}
      <div style={styles.filterBar}>
        <div style={styles.filterGroup}>
          <label style={styles.filterLabel}>Tìm kiếm</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleApplyFilter()}
            placeholder="Tên xe..."
            style={styles.searchInput}
          />
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
      ) : inspections.length === 0 ? (
        <p style={styles.emptyText}>Không có phiếu kiểm định nào.</p>
      ) : (
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Mã phiếu</th>
                <th style={styles.th}>Tên xe</th>
                <th style={styles.th}>Ngày kiểm định</th>
                <th style={styles.th}>Kết quả</th>
                <th style={styles.th}>Ghi chú</th>
                <th style={styles.th}>Người tạo</th>
                <th style={styles.th}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {inspections.map((item) => {
                const badge = RESULT_BADGE[item.result] || { label: item.result, color: '#555', bg: '#f3f4f6' };
                return (
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>#{item.id}</td>
                    <td style={styles.td}>{item.carName || '—'}</td>
                    <td style={styles.td}>{formatDate(item.inspectionDate)}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, color: badge.color, backgroundColor: badge.bg }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ ...styles.td, maxWidth: '200px', whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                      {item.notes || '—'}
                    </td>
                    <td style={styles.td}>{item.createdByName || '—'}</td>
                    <td style={styles.td}>
                      <button onClick={() => handleOpenEdit(item)} style={styles.editBtn}>Sửa</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <InspectionForm
          inspection={editingInspection}
          onSuccess={handleFormSuccess}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  title: { margin: 0, color: '#1a3a5c', fontSize: '22px', fontWeight: '700' },
  createBtn: {
    padding: '9px 20px', backgroundColor: '#1a3a5c', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer', fontWeight: '600',
  },

  filterBar: {
    display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end',
    backgroundColor: '#fff', padding: '16px 20px', borderRadius: '8px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '20px',
  },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  filterLabel: { fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' },
  searchInput: {
    padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#374151', outline: 'none', minWidth: '200px',
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
  badge: {
    display: 'inline-block', padding: '3px 10px', borderRadius: '12px',
    fontSize: '12px', fontWeight: '600',
  },
  editBtn: {
    padding: '6px 14px', backgroundColor: '#e0f2fe', color: '#0369a1',
    border: '1px solid #bae6fd', borderRadius: '6px', fontSize: '13px',
    cursor: 'pointer', fontWeight: '600',
  },
};
