import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  MdWork, MdLogout, MdAdd,
  MdAutoAwesome, MdBarChart,
  MdMenu, MdClose
} from 'react-icons/md';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const navTo = (path) => {
    navigate(path);
    setMenuOpen(false);
  };

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>

          {/* Logo */}
          <div style={styles.logo} onClick={() => navTo('/dashboard')}>
            <div style={styles.logoIcon}>
              <MdWork size={18} color="#fff" />
            </div>
            <span style={styles.logoText}>JobTracker</span>
          </div>

          {/* Desktop Right Side */}
          <div style={styles.desktopRight} className="nav-links-desktop">
            <button style={styles.analyticsBtn} onClick={() => navTo('/analytics')}>
              <MdBarChart size={16} />
              Analytics
            </button>
            <button style={styles.aiBtn} onClick={() => navTo('/ai-tools')}>
              <MdAutoAwesome size={16} />
              AI Tools
            </button>
            <button style={styles.addBtn} onClick={() => navTo('/add-job')}>
              <MdAdd size={18} />
              Add Application
            </button>
            <div style={styles.divider} />
            <div style={styles.userArea}>
              <div style={styles.avatar}>{getInitials(user?.name)}</div>
              <span style={styles.userName}>{user?.name}</span>
            </div>
            <button style={styles.logoutBtn} onClick={handleLogout} title="Logout">
              <MdLogout size={18} />
            </button>
          </div>

          {/* Mobile Right Side */}
          <div style={styles.mobileRight} className="nav-mobile-right">
            <div style={styles.avatar}>{getInitials(user?.name)}</div>
            <button
              style={styles.hamburger}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen
                ? <MdClose size={24} color="#333" />
                : <MdMenu size={24} color="#333" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div style={styles.mobileMenu}>
          <div style={styles.mobileMenuUser}>
            <div style={styles.mobileAvatar}>{getInitials(user?.name)}</div>
            <div>
              <p style={styles.mobileUserName}>{user?.name}</p>
              <p style={styles.mobileUserRole}>Job Seeker</p>
            </div>
          </div>
          <div style={styles.mobileMenuDivider} />
          {[
            { icon: <MdBarChart size={18} />, label: 'Analytics', path: '/analytics' },
            { icon: <MdAutoAwesome size={18} />, label: 'AI Tools', path: '/ai-tools' },
            { icon: <MdAdd size={18} />, label: 'Add Application', path: '/add-job' },
          ].map(item => (
            <button
              key={item.label}
              style={styles.mobileMenuItem}
              onClick={() => navTo(item.path)}
            >
              <span style={styles.mobileMenuIcon}>{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div style={styles.mobileMenuDivider} />
          <button style={styles.mobileLogout} onClick={handleLogout}>
            <MdLogout size={18} />
            Logout
          </button>
        </div>
      )}
    </>
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
    padding: '0 20px',
    height: '64px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    display: 'flex', alignItems: 'center',
    gap: '10px', cursor: 'pointer',
  },
  logoIcon: {
    width: '34px', height: '34px',
    backgroundColor: '#0A66C2', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  logoText: {
    fontSize: '18px', fontWeight: '800',
    color: '#1a1a2e', letterSpacing: '-0.5px',
  },

  // Desktop
  desktopRight: {
    display: 'flex', alignItems: 'center', gap: '12px',
  },
  analyticsBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', backgroundColor: '#F0FDF4',
    color: '#059669', border: '1px solid #A7F3D0',
    borderRadius: '8px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer',
  },
  aiBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 14px', backgroundColor: '#FFFBEB',
    color: '#92400E', border: '1px solid #FDE68A',
    borderRadius: '8px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer',
  },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '8px 16px', backgroundColor: '#0A66C2',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
  divider: {
    width: '1px', height: '28px',
    backgroundColor: '#E2E8F0',
  },
  userArea: {
    display: 'flex', alignItems: 'center', gap: '8px',
  },
  avatar: {
    width: '34px', height: '34px',
    backgroundColor: '#0A66C2', color: '#fff',
    borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '12px', fontWeight: '700', flexShrink: 0,
  },
  userName: {
    fontSize: '13px', fontWeight: '600', color: '#333',
  },
  logoutBtn: {
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', width: '34px', height: '34px',
    backgroundColor: '#FEF2F2', color: '#DC2626',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
  },

  // Mobile
  mobileRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    
  },
  hamburger: {
    background: 'none', border: 'none',
    cursor: 'pointer', padding: '4px',
    display: 'flex', alignItems: 'center',
  },

  // Mobile Menu
  mobileMenu: {
    position: 'fixed', top: '64px',
    left: 0, right: 0,
    backgroundColor: '#fff',
    borderBottom: '1px solid #E2E8F0',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    zIndex: 99, padding: '16px',
  },
  mobileMenuUser: {
    display: 'flex', alignItems: 'center',
    gap: '12px', padding: '8px 0 16px',
  },
  mobileAvatar: {
    width: '44px', height: '44px',
    backgroundColor: '#0A66C2', color: '#fff',
    borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    fontSize: '16px', fontWeight: '700',
  },
  mobileUserName: {
    fontSize: '15px', fontWeight: '700', color: '#1a1a2e',
  },
  mobileUserRole: {
    fontSize: '12px', color: '#94A3B8', marginTop: '2px',
  },
  mobileMenuDivider: {
    height: '1px', backgroundColor: '#F1F5F9', margin: '8px 0',
  },
  mobileMenuItem: {
    display: 'flex', alignItems: 'center', gap: '12px',
    width: '100%', padding: '12px 8px',
    background: 'none', border: 'none',
    fontSize: '15px', fontWeight: '600',
    color: '#333', cursor: 'pointer',
    borderRadius: '8px', textAlign: 'left',
  },
  mobileMenuIcon: { color: '#0A66C2' },
  mobileLogout: {
    display: 'flex', alignItems: 'center', gap: '12px',
    width: '100%', padding: '12px 8px',
    background: 'none', border: 'none',
    fontSize: '15px', fontWeight: '600',
    color: '#DC2626', cursor: 'pointer',
    borderRadius: '8px', textAlign: 'left',
  },
};


export default Navbar;