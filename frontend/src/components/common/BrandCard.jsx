import { getImageUrl } from '../../api/axiosInstance';

export default function BrandCard({ brand, onEdit, onDelete, onViewImages }) {
  return (
    <div style={styles.card}>
      <div style={styles.logoWrapper}>
        {brand.logoUrl ? (
          <img src={getImageUrl(brand.logoUrl)} alt={brand.name} style={styles.logo} onError={(e) => { e.target.style.display = 'none'; }} />
        ) : (
          <div style={styles.logoPlaceholder}>
            <span style={styles.logoInitial}>{brand.name?.charAt(0)?.toUpperCase() || '?'}</span>
          </div>
        )}
      </div>

      <div style={styles.info}>
        <h3 style={styles.name}>{brand.name}</h3>
        <p style={styles.carCount}>{brand.carCount ?? 0} xe</p>
        {brand.description && <p style={styles.description}>{brand.description}</p>}
      </div>

      <div style={styles.actions}>
        <button style={styles.imagesBtn} onClick={() => onViewImages(brand)}>Ảnh xe</button>
        <button style={styles.editBtn} onClick={() => onEdit(brand)}>Edit</button>
        <button style={styles.deleteBtn} onClick={() => onDelete(brand)}>Delete</button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px',
    transition: 'box-shadow 0.2s',
  },
  logoWrapper: { width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  logo: { width: '80px', height: '80px', objectFit: 'contain', borderRadius: '4px' },
  logoPlaceholder: {
    width: '80px', height: '80px', backgroundColor: '#e8f0fe', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoInitial: { fontSize: '32px', fontWeight: '700', color: '#2563eb' },
  info: { textAlign: 'center', width: '100%' },
  name: { margin: '0 0 4px', fontSize: '16px', fontWeight: '600', color: '#1a3a5c' },
  carCount: { margin: '0 0 6px', fontSize: '13px', color: '#666' },
  description: {
    margin: 0, fontSize: '12px', color: '#888', overflow: 'hidden',
    display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
  },
  actions: { display: 'flex', gap: '8px', width: '100%', justifyContent: 'center', flexWrap: 'wrap' },
  imagesBtn: {
    padding: '6px 12px', backgroundColor: '#f0f9ff', color: '#0369a1',
    border: '1px solid #bae6fd', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
  },
  editBtn: {
    padding: '6px 12px', backgroundColor: '#2563eb', color: '#fff',
    border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
  },
  deleteBtn: {
    padding: '6px 12px', backgroundColor: '#fff', color: '#e53e3e',
    border: '1px solid #e53e3e', borderRadius: '4px', cursor: 'pointer', fontSize: '13px',
  },
};
