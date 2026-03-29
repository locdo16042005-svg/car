import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const menuItems = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
  {
    label: 'Quản lý xe',
    icon: '🚗',
    children: [
      { label: 'Xe mới', path: '/admin/cars/new' },
      { label: 'Xe cũ', path: '/admin/cars/used' },
    ],
  },
  { label: 'Kiểm định', path: '/admin/inspections', icon: '🔍' },
  { label: 'Khách hàng', path: '/admin/customers', icon: '👥' },
  { label: 'Đơn hàng', path: '/admin/orders', icon: '📦' },
  { label: 'Báo cáo', path: '/admin/reports', icon: '📈' },
  { label: 'Hãng xe', path: '/admin/brands', icon: '🏷️' },
];

export default function Sidebar() {
  const [carExpanded, setCarExpanded] = useState(false);

  return (
    <aside style={styles.sidebar}>
      <div style={styles.logo}>
        <span style={styles.logoText}>Tân Lộc</span>
        <span style={styles.logoSub}>Admin</span>
      </div>

      <nav>
        {menuItems.map((item) => {
          if (item.children) {
            return (
              <div key={item.label}>
                <div
                  style={styles.menuItem}
                  onClick={() => setCarExpanded((prev) => !prev)}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={styles.icon}>{item.icon}</span>
                  <span style={styles.label}>{item.label}</span>
                  <span style={styles.arrow}>{carExpanded ? '▾' : '▸'}</span>
                </div>
                {carExpanded && (
                  <div style={styles.subMenu}>
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        style={({ isActive }) => ({
                          ...styles.subItem,
                          ...(isActive ? styles.activeItem : {}),
                        })}
                      >
                        {child.label}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                ...styles.menuItem,
                ...(isActive ? styles.activeItem : {}),
              })}
            >
              <span style={styles.icon}>{item.icon}</span>
              <span style={styles.label}>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}

const styles = {
  sidebar: {
    width: '240px',
    minHeight: '100vh',
    backgroundColor: '#1a3a5c',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  logo: {
    padding: '24px 20px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  logoText: {
    color: '#fff',
    fontSize: '22px',
    fontWeight: '700',
    letterSpacing: '1px',
  },
  logoSub: {
    color: '#a8c4e0',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginTop: '2px',
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    color: '#a8c4e0',
    textDecoration: 'none',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'background-color 0.15s',
    userSelect: 'none',
  },
  activeItem: {
    color: '#fff',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderLeft: '3px solid #fff',
  },
  icon: {
    marginRight: '10px',
    fontSize: '16px',
    width: '20px',
    textAlign: 'center',
  },
  label: {
    flex: 1,
  },
  arrow: {
    fontSize: '12px',
    color: '#a8c4e0',
  },
  subMenu: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  subItem: {
    display: 'block',
    padding: '10px 20px 10px 50px',
    color: '#a8c4e0',
    textDecoration: 'none',
    fontSize: '13px',
    transition: 'background-color 0.15s',
  },
};
