import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import axiosInstance from '../../api/axiosInstance';

const MONTH_LABELS = ['T1','T2','T3','T4','T5','T6','T7','T8','T9','T10','T11','T12'];

function formatCurrency(value) {
  if (value == null) return '0 đ';
  return value.toLocaleString('vi-VN') + ' đ';
}

export default function ReportPage() {
  const currentYear = new Date().getFullYear();
  const [revenueData, setRevenueData] = useState([]);
  const [chartLoading, setChartLoading] = useState(true);
  const [chartError, setChartError] = useState('');

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');

  useEffect(() => {
    const fetchRevenue = async () => {
      setChartLoading(true);
      setChartError('');
      try {
        const res = await axiosInstance.get('/reports/revenue', { params: { year: currentYear } });
        const chartData = (res.data || []).map((item) => ({
          name: MONTH_LABELS[item.month - 1],
          revenue: item.revenue,
        }));
        setRevenueData(chartData);
      } catch {
        setChartError('Không thể tải dữ liệu doanh thu.');
      } finally {
        setChartLoading(false);
      }
    };
    fetchRevenue();
  }, [currentYear]);

  const handleExportExcel = async () => {
    setExportError('');
    setExporting(true);
    try {
      const params = {};
      if (startDate) params.startDate = startDate;
      if (endDate) params.endDate = endDate;

      const res = await axiosInstance.get('/reports/export', {
        params,
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      const filename = `bao-cao-${startDate || 'all'}_${endDate || 'all'}.xlsx`;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      setExportError('Xuất file thất bại. Vui lòng thử lại.');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Báo cáo</h2>

      {/* Filter & Export */}
      <div style={styles.filterSection}>
        <h3 style={styles.sectionTitle}>Xuất báo cáo</h3>
        <div style={styles.filterRow}>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Từ ngày</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <label style={styles.label}>Đến ngày</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={styles.dateInput}
            />
          </div>
          <div style={styles.filterGroup}>
            <label style={{ ...styles.label, visibility: 'hidden' }}>_</label>
            <button
              onClick={handleExportExcel}
              disabled={exporting}
              style={{ ...styles.exportBtn, opacity: exporting ? 0.7 : 1 }}
            >
              {exporting ? 'Đang xuất...' : '⬇ Xuất Excel'}
            </button>
          </div>
        </div>
        {exportError && <p style={styles.errorText}>{exportError}</p>}
      </div>

      {/* Revenue Chart */}
      <div style={styles.chartSection}>
        <h3 style={styles.sectionTitle}>Doanh thu theo tháng — {currentYear}</h3>
        {chartLoading ? (
          <p style={styles.loadingText}>Đang tải biểu đồ...</p>
        ) : chartError ? (
          <p style={styles.errorText}>{chartError}</p>
        ) : (
          <div style={{ width: '100%', height: 320 }}>
            <ResponsiveContainer>
              <BarChart data={revenueData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(v) => (v / 1_000_000).toFixed(0) + 'M'} />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Bar dataKey="revenue" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  title: { margin: '0 0 24px', color: '#1a3a5c', fontSize: '22px', fontWeight: '700' },
  loadingText: { textAlign: 'center', color: '#666', padding: '20px 0' },
  errorText: { color: '#e53e3e', fontSize: '14px', marginTop: '8px' },

  filterSection: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '20px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  chartSection: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '20px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  sectionTitle: { margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1a3a5c' },

  filterRow: { display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' },
  filterGroup: { display: 'flex', flexDirection: 'column', gap: '4px' },
  label: { fontSize: '12px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' },
  dateInput: {
    padding: '8px 12px', border: '1px solid #d1d5db', borderRadius: '6px',
    fontSize: '14px', color: '#374151', outline: 'none',
  },
  exportBtn: {
    padding: '8px 20px', backgroundColor: '#10b981', color: '#fff',
    border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer',
    fontWeight: '600',
  },
};
