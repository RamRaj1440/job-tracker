import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MdEmail, MdArrowBack, MdWork } from 'react-icons/md';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/forgot-password`,
        { email }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* Left Panel */}
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <div style={styles.logoArea}>
            <MdWork size={36} color="#fff" />
            <span style={styles.logoText}>JobTracker</span>
          </div>
          <h1 style={styles.heroTitle}>
            Forgot your password?
          </h1>
          <p style={styles.heroSub}>
            No worries! Enter your registered email and
            we'll send you a secure reset link instantly.
          </p>
          <div style={styles.steps}>
            {[
              ['1', 'Enter your email address'],
              ['2', 'Check your inbox for reset link'],
              ['3', 'Click the link and set new password'],
              ['4', 'Login with your new password'],
            ].map(([num, text]) => (
              <div key={num} style={styles.step}>
                <div style={styles.stepNum}>{num}</div>
                <span style={styles.stepText}>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>

          <Link to="/login" style={styles.backBtn}>
            <MdArrowBack size={16} />
            Back to Login
          </Link>

          {!success ? (
            <>
              <h2 style={styles.formTitle}>Reset Password</h2>
              <p style={styles.formSub}>
                Enter your email and we'll send you a reset link
              </p>

              {error && (
                <div style={styles.errorBox}>⚠️ {error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Email address</label>
                  <div style={styles.inputWrapper}>
                    <MdEmail size={18} color="#666" style={styles.inputIcon} />
                    <input
                      style={styles.input}
                      type="email"
                      placeholder="you@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={loading ? styles.btnDisabled : styles.btn}
                  disabled={loading}
                >
                  {loading ? 'Sending reset link...' : 'Send Reset Link'}
                </button>
              </form>

              <p style={styles.footer}>
                Remembered your password?{' '}
                <Link to="/login" style={styles.link}>Sign in</Link>
              </p>
            </>
          ) : (
            // Success State
            <div style={styles.successBox}>
              <div style={styles.successIcon}>📧</div>
              <h3 style={styles.successTitle}>Check your inbox!</h3>
              <p style={styles.successText}>
                We sent a password reset link to:
              </p>
              <p style={styles.successEmail}>{email}</p>
              <p style={styles.successNote}>
                The link expires in <strong>15 minutes.</strong>
                {' '}If you don't see it, check your spam folder.
              </p>
              <Link to="/login" style={styles.btn}>
                Back to Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { display: 'flex', minHeight: '100vh' },
  leftPanel: {
    flex: 1, backgroundColor: '#0A66C2',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '60px 48px',
  },
  leftContent: { maxWidth: '420px' },
  logoArea: {
    display: 'flex', alignItems: 'center',
    gap: '10px', marginBottom: '48px',
  },
  logoText: { fontSize: '22px', fontWeight: '800', color: '#fff' },
  heroTitle: {
    fontSize: '36px', fontWeight: '800', color: '#fff',
    lineHeight: '1.2', marginBottom: '16px', letterSpacing: '-0.5px',
  },
  heroSub: {
    fontSize: '16px', color: 'rgba(255,255,255,0.8)',
    lineHeight: '1.6', marginBottom: '40px',
  },
  steps: { display: 'flex', flexDirection: 'column', gap: '16px' },
  step: { display: 'flex', alignItems: 'center', gap: '14px' },
  stepNum: {
    width: '28px', height: '28px', borderRadius: '50%',
    backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '13px', fontWeight: '700', flexShrink: 0,
  },
  stepText: { fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  rightPanel: {
    width: '480px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px 32px',
    backgroundColor: '#fff',
  },
  formCard: { width: '100%', maxWidth: '380px' },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    color: '#0A66C2', fontSize: '14px', fontWeight: '600',
    marginBottom: '28px', textDecoration: 'none',
  },
  formTitle: {
    fontSize: '26px', fontWeight: '800', color: '#1a1a2e',
    marginBottom: '6px', letterSpacing: '-0.5px',
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
  inputWrapper: { position: 'relative', display: 'flex', alignItems: 'center' },
  inputIcon: { position: 'absolute', left: '12px', pointerEvents: 'none' },
  input: {
    width: '100%', padding: '11px 40px',
    border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
    backgroundColor: '#F8FAFC', boxSizing: 'border-box',
  },
  btn: {
    display: 'block', width: '100%', padding: '12px',
    backgroundColor: '#0A66C2', color: '#fff',
    border: 'none', borderRadius: '8px', fontSize: '15px',
    fontWeight: '700', cursor: 'pointer', marginTop: '8px',
    textAlign: 'center', textDecoration: 'none',
  },
  btnDisabled: {
    width: '100%', padding: '12px', backgroundColor: '#93C5FD',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '15px', fontWeight: '700', cursor: 'not-allowed', marginTop: '8px',
  },
  footer: { textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#666' },
  link: { color: '#0A66C2', textDecoration: 'none', fontWeight: '600' },
  successBox: { textAlign: 'center', padding: '20px 0' },
  successIcon: { fontSize: '56px', marginBottom: '16px' },
  successTitle: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' },
  successText: { fontSize: '14px', color: '#666', marginBottom: '6px' },
  successEmail: { fontSize: '15px', fontWeight: '700', color: '#0A66C2', marginBottom: '16px' },
  successNote: { fontSize: '13px', color: '#888', marginBottom: '24px', lineHeight: '1.6' },
};

export default ForgotPassword;