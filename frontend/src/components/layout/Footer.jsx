export default function Footer() {
  return (
    <footer style={styles.footer}>
      <p style={styles.text}>© 2014 Tân Lộc. All rights reserved.</p>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#1a3a5c',
    color: '#fff',
    textAlign: 'center',
    padding: '12px 24px',
    fontSize: '13px',
  },
  text: {
    margin: 0,
  },
};
