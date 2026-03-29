export default function ConfirmDialog({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Xác nhận', cancelText = 'Hủy', confirmColor = '#e53e3e' }) {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h3 style={styles.title}>{title}</h3>
        <p style={styles.message}>{message}</p>
        <div style={styles.actions}>
          <button style={styles.cancelBtn} onClick={onCancel}>{cancelText}</button>
          <button style={{ ...styles.confirmBtn, backgroundColor: confirmColor }} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
  },
  dialog: {
    backgroundColor: '#fff', borderRadius: '8px', padding: '28px 32px',
    width: '100%', maxWidth: '420px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
  },
  title: { margin: '0 0 12px', color: '#1a3a5c', fontSize: '18px' },
  message: { margin: '0 0 24px', color: '#555', fontSize: '14px', lineHeight: '1.5' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  cancelBtn: {
    padding: '8px 20px', border: '1px solid #d9d9d9', borderRadius: '4px',
    backgroundColor: '#fff', cursor: 'pointer', fontSize: '14px', color: '#333',
  },
  confirmBtn: {
    padding: '8px 20px', border: 'none', borderRadius: '4px',
    color: '#fff', cursor: 'pointer', fontSize: '14px',
  },
};
