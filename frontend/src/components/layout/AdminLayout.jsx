import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';

export default function AdminLayout() {
  return (
    <div style={styles.wrapper}>
      <Sidebar />
      <div style={styles.main}>
        <Header />
        <main style={styles.content}>
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}

const styles = {
  wrapper: {
    display: 'flex',
    minHeight: '100vh',
  },
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    padding: '24px',
    backgroundColor: '#f5f7fa',
    overflowY: 'auto',
  },
};
