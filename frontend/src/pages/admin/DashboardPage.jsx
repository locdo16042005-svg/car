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

function StatCard({ title, value, color }) {
  return (
    <div style={{ ...styles.card, borderTop: `4px solid ${color}` }}>
      <p style={styles.cardTitle}>{title}</p>
      <p style={{ ...styles.cardValue, color }}>{value}</p>
    </div>
  );
}

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [topCars, setTopCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError('');
      try {
        const [dashRes, revenueRes, topCarsRes] = await Promise.all([
          axiosInstance.get('/reports/dashboard'),
          axiosInstance.get('/reports/revenue', { params: { year: currentYear } }),
          axiosInstance.get('/reports/top-cars', { params: { limit: 5 } }),
        ]);
        setStats(dashRes.data);
        const chartData = (revenueRes.data || []).map((item) => ({
          name: MONTH_LABELS[item.month - 1],
          revenue: item.revenue,
        }));
        setRevenueData(chartData);
        setTopCars(topCarsRes.data || []);
      } catch {
        setError('Không thể tải dữ liệu dashboard.');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [currentYear]);

  if (loading) return <p style={styles.loadingText}>Đang tải...</p>;
  if (error) return <p style={styles.errorText}>{error}</p>;

  return (
    <div style={styles.page}>
      <h2 style={styles.title}>Dashboard</h2>

      {/* Stat Cards */}
      <div style={styles.cardGrid}>
        <StatCard title="Tổng số xe" value={stats?.totalCars ?? 0} color="#1a3a5c" />
        <StatCard title="Tổng đơn hàng" value={stats?.totalOrders ?? 0} color="#0ea5e9" />
        <StatCard title="Doanh thu tháng này" value={formatCurrency(stats?.currentMonthRevenue)} color="#10b981" />
        <StatCard title="Khách hàng mới" value={stats?.newCustomersThisMonth ?? 0} color="#f59e0b" />
      </div>

      {/* Revenue Chart */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Doanh thu theo tháng — {currentYear}</h3>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={revenueData} margin={{ top: 10, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={(v) => (v / 1_000_000).toFixed(0) + 'M'} />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="revenue" fill="#1a3a5c" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top 5 Cars */}
      <div style={styles.section}>
        <h3 style={styles.sectionTitle}>Top 5 xe bán chạy</h3>
        <div style={styles.tableWrapper}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Tên xe</th>
                <th style={styles.th}>Số đơn hàng</th>
              </tr>
            </thead>
            <tbody>
              {topCars.map((car, idx) => (
                <tr key={car.carId} style={styles.tr}>
                  <td style={styles.td}>{idx + 1}</td>
                  <td style={styles.td}>{car.carName}</td>
                  <td style={styles.td}>{car.orderCount}</td>
                </tr>
              ))}
              {topCars.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ ...styles.td, textAlign: 'center', color: '#9ca3af' }}>
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { padding: '24px', backgroundColor: '#f5f7fa', minHeight: '100vh' },
  title: { margin: '0 0 24px', color: '#1a3a5c', fontSize: '22px', fontWeight: '700' },
  loadingText: { padding: '40px', textAlign: 'center', color: '#666' },
  errorText: { padding: '40px', textAlign: 'center', color: '#e53e3e' },

  cardGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px', marginBottom: '28px',
  },
  card: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '20px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
  },
  cardTitle: { margin: '0 0 8px', fontSize: '13px', color: '#6b7280', fontWeight: '600', textTransform: 'uppercase' },
  cardValue: { margin: 0, fontSize: '26px', fontWeight: '700' },

  section: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '20px 24px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '24px',
  },
  sectionTitle: { margin: '0 0 16px', fontSize: '16px', fontWeight: '600', color: '#1a3a5c' },

  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse', fontSize: '14px' },
  thead: { backgroundColor: '#f0f4f8' },
  th: { padding: '10px 16px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' },
  tr: { borderBottom: '1px solid #f3f4f6' },
  td: { padding: '10px 16px', color: '#374151' },
};
