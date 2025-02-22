import React from 'react';
import { useNavigate } from 'react-router-dom';

function SuperAdminDashboard() {
  const navigate = useNavigate(); // ✅ ใช้ useNavigate() แทน Navigate()

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Super Admin Dashboard</h1>
      <button style={styles.button} onClick={() => navigate('/admin/register')}>
        ➕ สมัคร Admin ใหม่
      </button>
    </div>
  );
}

// ✅ สไตล์แบบ Inline CSS
const styles = {
  container: {
    textAlign: 'center',
    marginTop: '50px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    backgroundColor: '#007bff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  buttonHover: {
    backgroundColor: '#0056b3',
  },
};

export default SuperAdminDashboard;
