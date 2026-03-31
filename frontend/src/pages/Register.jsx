import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { MdEmail, MdLock, MdPerson, MdWork } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await registerUser(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page} className='auth-page'>

      {/* Left Panel */}
      <div style={styles.leftPanel} className='left-panel'> 
        <div style={styles.leftContent}>
          <div style={styles.logoArea}>
            <MdWork size={36} color="#fff" />
            <span style={styles.logoText}>JobTracker</span>
          </div>
          <h1 style={styles.heroTitle}>
            Your job search, organized.
          </h1>
          <p style={styles.heroSub}>
            Stop losing track of applications. Start managing your career like a professional.
          </p>
          <div style={styles.featureList}>
            {[
              '✓ Track every application in one place',
              '✓ Never miss a follow-up again',
              '✓ Visualize your hiring pipeline',
              '✓ Free forever — no credit card needed',
            ].map((f) => (
              <p key={f} style={styles.featureItem}>{f}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel} className='right-panel'>
        <div style={styles.formCard}>
          <h2 style={styles.formTitle}>Create your account</h2>
          <p style={styles.formSub}>Start tracking your job search for free</p>

          {error && (
            <div style={styles.errorBox}>
              <span>⚠️ {error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Full Name</label>
              <div style={styles.inputWrapper}>
                <MdPerson size={18} color="#666" style={styles.inputIcon} />
                <input
                  style={styles.input}
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Email address</label>
              <div style={styles.inputWrapper}>
                <MdEmail size={18} color="#666" style={styles.inputIcon} />
                <input
                  style={styles.input}
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>Password</label>
              <div style={styles.inputWrapper}>
                <MdLock size={18} color="#666" style={styles.inputIcon} />
                <input
                  style={styles.input}
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword
                    ? <AiOutlineEyeInvisible size={18} color="#666" />
                    : <AiOutlineEye size={18} color="#666" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              style={loading ? styles.btnDisabled : styles.btn}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create Free Account'}
            </button>
          </form>

          <div style={styles.divider}><span>Already have an account?</span></div>

          <Link to="/login" style={styles.loginLink}>
            Sign in instead
          </Link>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  leftPanel: {
    flex: 1,
    backgroundColor: '#0A66C2',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 48px',
  },
  leftContent: { maxWidth: '420px' },
  logoArea: {
    display: 'flex', alignItems: 'center',
    gap: '10px', marginBottom: '48px',
  },
  logoText: {
    fontSize: '22px', fontWeight: '800',
    color: '#fff', letterSpacing: '-0.5px',
  },
  heroTitle: {
    fontSize: '36px', fontWeight: '800',
    color: '#fff', lineHeight: '1.2',
    marginBottom: '16px', letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: '16px', color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.6', marginBottom: '40px',
  },
  featureList: { display: 'flex', flexDirection: 'column', gap: '12px' },
  featureItem: {
    fontSize: '15px', color: 'rgba(255,255,255,0.9)',
    fontWeight: '500', lineHeight: '1.5',
  },
  rightPanel: {
    width: '480px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 32px',
    backgroundColor: '#fff',
  },
  formCard: { width: '100%', maxWidth: '380px' },
  formTitle: {
    fontSize: '26px', fontWeight: '800',
    color: '#1a1a2e', marginBottom: '6px', letterSpacing: '-0.5px',
  },
  formSub: { fontSize: '14px', color: '#666', marginBottom: '28px' },
  errorBox: {
    backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
    color: '#DC2626', padding: '12px 16px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
  },
  fieldGroup: { marginBottom: '18px' },
  label: {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#333', marginBottom: '6px',
  },
  inputWrapper: {
    position: 'relative', display: 'flex', alignItems: 'center',
  },
  inputIcon: { position: 'absolute', left: '12px', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '11px 40px',
    border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
    backgroundColor: '#F8FAFC', boxSizing: 'border-box',
  },
  eyeBtn: {
    position: 'absolute', right: '12px',
    background: 'none', border: 'none',
    cursor: 'pointer', padding: '0',
    display: 'flex', alignItems: 'center',
  },
  btn: {
    width: '100%', padding: '12px',
    backgroundColor: '#0A66C2', color: '#fff',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', marginTop: '8px',
  },
  btnDisabled: {
    width: '100%', padding: '12px',
    backgroundColor: '#93C5FD', color: '#fff',
    border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700',
    cursor: 'not-allowed', marginTop: '8px',
  },
  divider: {
    textAlign: 'center', margin: '24px 0',
    fontSize: '13px', color: '#999',
  },
  loginLink: {
    display: 'block', width: '100%', padding: '12px',
    backgroundColor: '#fff', color: '#0A66C2',
    border: '1.5px solid #0A66C2', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700',
    cursor: 'pointer', textAlign: 'center',
  },
};

export default Register;