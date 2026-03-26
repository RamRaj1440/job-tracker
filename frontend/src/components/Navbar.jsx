import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MdWork, MdLogout, MdAdd,MdAutoAwesome } from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>

        {/* Logo */}
        <div style={styles.logo} onClick={() => navigate('/dashboard')}>
          <div style={styles.logoIcon}>
            <MdWork size={20} color="#fff" />
          </div>
          <span style={styles.logoText}>JobTracker</span>
        </div>

        {/* Right Side */}
        <div style={styles.right}>
          <button style={styles.addBtn} onClick={() => navigate('/add-job')}>
            <MdAdd size={18} />
            Add Application
          </button>
          {/* AI Tools Button */}
<button style={styles.aiBtn} onClick={() => navigate('/ai-tools')}>
  <MdAutoAwesome size={16} />
  AI Tools
</button>

          <div style={styles.divider} />

          {/* Avatar + Name */}
          <div style={styles.userArea}>
            <div style={styles.avatar}>{getInitials(user?.name)}</div>
            <span style={styles.userName}>{user?.name}</span>
          </div>

          <button style={styles.logoutBtn} onClick={handleLogout} title="Logout">
            <MdLogout size={18} />
          </button>
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    backgroundColor: '#fff',
    borderBottom: '1px solid #E2E8F0',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    cursor: 'pointer',
  },
  logoIcon: {
    width: '36px',
    height: '36px',
    backgroundColor: '#0A66C2',
    borderRadius: '8px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: '18px',
    fontWeight: '800',
    color: '#1a1a2e',
    letterSpacing: '-0.5px',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  addBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 18px',
    backgroundColor: '#0A66C2',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  aiBtn: {
  display: 'flex', alignItems: 'center', gap: '6px',
  padding: '8px 16px',
  backgroundColor: '#FFFBEB',
  color: '#92400E',
  border: '1px solid #FDE68A',
  borderRadius: '8px',
  fontSize: '14px', fontWeight: '600', cursor: 'pointer',
},
  divider: {
    width: '1px',
    height: '28px',
    backgroundColor: '#E2E8F0',
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  avatar: {
    width: '36px',
    height: '36px',
    backgroundColor: '#0A66C2',
    color: '#fff',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '700',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    backgroundColor: '#FEF2F2',
    color: '#DC2626',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
};

export default Navbar;