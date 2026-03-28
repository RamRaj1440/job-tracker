import { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { MdLock, MdWork } from 'react-icons/md';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import axios from 'axios';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axios.put(
        `${import.meta.env.VITE_API_URL}/auth/reset-password/${token}`,
        { password }
      );
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Reset failed. Please try again.');
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
          <h1 style={styles.heroTitle}>Create a strong new password</h1>
          <p style={styles.heroSub}>
            Your new password must be at least 6 characters.
            Choose something memorable but hard to guess.
          </p>
          <div style={styles.tips}>
            <p style={styles.tipsTitle}>💡 Password Tips:</p>
            {[
              'Use at least 8 characters',
              'Mix letters, numbers and symbols',
              'Avoid using your name or email',
              'Never reuse old passwords',
            ].map(tip => (
              <p key={tip} style={styles.tip}>✓ {tip}</p>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div style={styles.rightPanel}>
        <div style={styles.formCard}>

          {!success ? (
            <>
              <h2 style={styles.formTitle}>Set New Password</h2>
              <p style={styles.formSub}>
                Enter your new password below
              </p>

              {error && (
                <div style={styles.errorBox}>⚠️ {error}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>New Password</label>
                  <div style={styles.inputWrapper}>
                    <MdLock size={18} color="#666" style={styles.inputIcon} />
                    <input
                      style={styles.input}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Min 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
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

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>Confirm New Password</label>
                  <div style={styles.inputWrapper}>
                    <MdLock size={18} color="#666" style={styles.inputIcon} />
                    <input
                      style={styles.input}
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Re-enter new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Match Indicator */}
                {confirmPassword && (
                  <p style={{
                    fontSize: '13px', marginBottom: '12px',
                    color: password === confirmPassword ? '#10B981' : '#EF4444',
                    fontWeight: '600',
                  }}>
                    {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                  </p>
                )}

                <button
                  type="submit"
                  style={loading ? styles.btnDisabled : styles.btn}
                  disabled={loading}
                >
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          ) : (
            // Success State
            <div style={styles.successBox}>
              <div style={styles.successIcon}>🎉</div>
              <h3 style={styles.successTitle}>Password Reset!</h3>
              <p style={styles.successText}>
                Your password has been successfully updated.
              </p>
              <p style={styles.successNote}>
                Redirecting you to login in 3 seconds...
              </p>
              <Link to="/login" style={styles.btn}>
                Go to Login Now
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
  tips: { display: 'flex', flexDirection: 'column', gap: '10px' },
  tipsTitle: { fontSize: '15px', fontWeight: '700', color: '#fff', marginBottom: '4px' },
  tip: { fontSize: '14px', color: 'rgba(255,255,255,0.85)', fontWeight: '500' },
  rightPanel: {
    width: '480px', display: 'flex', alignItems: 'center',
    justifyContent: 'center', padding: '40px 32px',
    backgroundColor: '#fff',
  },
  formCard: { width: '100%', maxWidth: '380px' },
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
  eyeBtn: {
    position: 'absolute', right: '12px',
    background: 'none', border: 'none',
    cursor: 'pointer', padding: '0',
    display: 'flex', alignItems: 'center',
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
    fontSize: '15px', fontWeight: '700',
    cursor: 'not-allowed', marginTop: '8px',
  },
  successBox: { textAlign: 'center', padding: '20px 0' },
  successIcon: { fontSize: '56px', marginBottom: '16px' },
  successTitle: { fontSize: '22px', fontWeight: '800', color: '#1a1a2e', marginBottom: '8px' },
  successText: { fontSize: '14px', color: '#666', marginBottom: '8px' },
  successNote: { fontSize: '13px', color: '#888', marginBottom: '24px' },
};

export default ResetPassword;