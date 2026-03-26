import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createJob } from '../services/api';
import Navbar from '../components/Navbar';
import {
  MdBusiness, MdWork, MdLink, MdNotes,
  MdCalendarToday, MdArrowBack, MdSave
} from 'react-icons/md';
import { BsBriefcaseFill } from 'react-icons/bs';

const STATUS_OPTIONS = ['Applied', 'Written Test', 'Interview', 'Offered', 'Rejected'];

const STATUS_COLORS = {
  'Applied':      '#3B82F6',
  'Written Test': '#F59E0B',
  'Interview':    '#8B5CF6',
  'Offered':      '#10B981',
  'Rejected':     '#EF4444',
};

const AddJob = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    status: 'Applied',
    dateApplied: new Date().toISOString().split('T')[0],
    jobLink: '',
    notes: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.company.trim() || !formData.role.trim()) {
      setError('Company name and job role are required.');
      return;
    }
    setLoading(true);
    try {
      await createJob(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Breadcrumb */}
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <MdArrowBack size={16} />
          Back to Dashboard
        </button>

        <div style={styles.layout}>

          {/* Left — Form */}
          <div style={styles.formCard}>
            <div style={styles.cardHeader}>
              <div style={styles.cardIconBox}>
                <BsBriefcaseFill size={20} color="#0A66C2" />
              </div>
              <div>
                <h2 style={styles.cardTitle}>New Job Application</h2>
                <p style={styles.cardSubtitle}>Fill in the details of your application</p>
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>⚠️ {error}</div>
            )}

            <form onSubmit={handleSubmit}>

              {/* Company + Role Row */}
              <div style={styles.row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    <MdBusiness size={14} style={styles.labelIcon} />
                    Company Name *
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    name="company"
                    placeholder="e.g. Google, Amazon, TCS"
                    value={formData.company}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    <MdWork size={14} style={styles.labelIcon} />
                    Job Role *
                  </label>
                  <input
                    style={styles.input}
                    type="text"
                    name="role"
                    placeholder="e.g. Frontend Developer"
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Status + Date Row */}
              <div style={styles.row}>
                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    Application Status
                  </label>
                  <div style={styles.statusGrid}>
                    {STATUS_OPTIONS.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setFormData({ ...formData, status: s })}
                        style={{
                          ...styles.statusOption,
                          backgroundColor: formData.status === s
                            ? `${STATUS_COLORS[s]}15`
                            : '#F8FAFC',
                          borderColor: formData.status === s
                            ? STATUS_COLORS[s]
                            : '#E2E8F0',
                          color: formData.status === s
                            ? STATUS_COLORS[s]
                            : '#64748B',
                          fontWeight: formData.status === s ? '700' : '500',
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={styles.fieldGroup}>
                  <label style={styles.label}>
                    <MdCalendarToday size={14} style={styles.labelIcon} />
                    Date Applied
                  </label>
                  <input
                    style={styles.input}
                    type="date"
                    name="dateApplied"
                    value={formData.dateApplied}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Job Link */}
              <div style={styles.fieldGroupFull}>
                <label style={styles.label}>
                  <MdLink size={14} style={styles.labelIcon} />
                  Job Posting URL
                  <span style={styles.optional}>(Optional)</span>
                </label>
                <input
                  style={styles.input}
                  type="url"
                  name="jobLink"
                  placeholder="https://careers.google.com/jobs/..."
                  value={formData.jobLink}
                  onChange={handleChange}
                />
              </div>

              {/* Notes */}
              <div style={styles.fieldGroupFull}>
                <label style={styles.label}>
                  <MdNotes size={14} style={styles.labelIcon} />
                  Notes
                  <span style={styles.optional}>(Optional)</span>
                </label>
                <textarea
                  style={styles.textarea}
                  name="notes"
                  placeholder="e.g. Applied via LinkedIn, referral from a friend, key skills required..."
                  value={formData.notes}
                  onChange={handleChange}
                  rows={4}
                />
              </div>

              {/* Action Buttons */}
              <div style={styles.btnRow}>
                <button
                  type="button"
                  style={styles.cancelBtn}
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={loading ? styles.btnDisabled : styles.btn}
                  disabled={loading}
                >
                  <MdSave size={16} />
                  {loading ? 'Saving...' : 'Save Application'}
                </button>
              </div>

            </form>
          </div>

          {/* Right — Tips Panel */}
          <div style={styles.tipsCard}>
            <h3 style={styles.tipsTitle}>💡 Pro Tips</h3>
            <div style={styles.tipsList}>
              {[
                {
                  title: 'Be specific with roles',
                  desc: 'Use the exact job title from the listing for better tracking.',
                },
                {
                  title: 'Save the job link',
                  desc: 'Always paste the job URL so you can revisit requirements.',
                },
                {
                  title: 'Add notes immediately',
                  desc: 'Note how you applied, any referrals, or key requirements.',
                },
                {
                  title: 'Update status promptly',
                  desc: 'Keep statuses current to get accurate pipeline analytics.',
                },
              ].map((tip) => (
                <div key={tip.title} style={styles.tipItem}>
                  <div style={styles.tipDot} />
                  <div>
                    <p style={styles.tipTitle}>{tip.title}</p>
                    <p style={styles.tipDesc}>{tip.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Status Guide */}
            <div style={styles.statusGuide}>
              <p style={styles.guideTitle}>Status Guide</p>
              {STATUS_OPTIONS.map((s) => (
                <div key={s} style={styles.guideItem}>
                  <div style={{
                    ...styles.guideDot,
                    backgroundColor: STATUS_COLORS[s]
                  }} />
                  <span style={styles.guideLabel}>{s}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F3F2EF' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '24px' },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none', color: '#0A66C2',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    marginBottom: '20px', padding: '0',
  },
  layout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  formCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: '16px',
    padding: '32px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: '16px',
    marginBottom: '28px', paddingBottom: '20px',
    borderBottom: '1px solid #F1F5F9',
  },
  cardIconBox: {
    width: '48px', height: '48px', backgroundColor: '#EFF6FF',
    borderRadius: '12px', display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
  },
  cardTitle: {
    fontSize: '20px', fontWeight: '800',
    color: '#1a1a2e', letterSpacing: '-0.5px',
  },
  cardSubtitle: { fontSize: '13px', color: '#64748B', marginTop: '2px' },
  errorBox: {
    backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
    color: '#DC2626', padding: '12px 16px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '20px',
  },
  row: { display: 'flex', gap: '20px', marginBottom: '20px' },
  fieldGroup: { flex: 1 },
  fieldGroupFull: { marginBottom: '20px' },
  label: {
    display: 'flex', alignItems: 'center', gap: '5px',
    fontSize: '13px', fontWeight: '600',
    color: '#374151', marginBottom: '8px',
  },
  labelIcon: { color: '#0A66C2' },
  optional: {
    fontSize: '12px', color: '#94A3B8',
    fontWeight: '400', marginLeft: '4px',
  },
  input: {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
    backgroundColor: '#F8FAFC', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  },
  textarea: {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
    backgroundColor: '#F8FAFC', boxSizing: 'border-box',
    resize: 'vertical', lineHeight: '1.5',
  },
  statusGrid: {
    display: 'flex', flexWrap: 'wrap', gap: '8px',
  },
  statusOption: {
    padding: '6px 14px', borderRadius: '20px',
    border: '1.5px solid', fontSize: '13px',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  btnRow: {
    display: 'flex', justifyContent: 'flex-end',
    gap: '12px', marginTop: '8px',
    paddingTop: '20px', borderTop: '1px solid #F1F5F9',
  },
  btn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '10px 24px', backgroundColor: '#0A66C2',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'pointer',
  },
  btnDisabled: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '10px 24px', backgroundColor: '#93C5FD',
    color: '#fff', border: 'none', borderRadius: '8px',
    fontSize: '14px', fontWeight: '700', cursor: 'not-allowed',
  },
  cancelBtn: {
    padding: '10px 24px', backgroundColor: '#fff',
    color: '#64748B', border: '1.5px solid #E2E8F0',
    borderRadius: '8px', fontSize: '14px',
    fontWeight: '600', cursor: 'pointer',
  },
  tipsCard: {
    width: '260px', flexShrink: 0, backgroundColor: '#fff',
    borderRadius: '16px', padding: '24px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
  },
  tipsTitle: {
    fontSize: '15px', fontWeight: '700',
    color: '#1a1a2e', marginBottom: '16px',
  },
  tipsList: { display: 'flex', flexDirection: 'column', gap: '14px' },
  tipItem: { display: 'flex', gap: '10px', alignItems: 'flex-start' },
  tipDot: {
    width: '6px', height: '6px', borderRadius: '50%',
    backgroundColor: '#0A66C2', marginTop: '5px', flexShrink: 0,
  },
  tipTitle: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e' },
  tipDesc: { fontSize: '12px', color: '#64748B', marginTop: '2px', lineHeight: '1.5' },
  statusGuide: {
    marginTop: '24px', paddingTop: '20px',
    borderTop: '1px solid #F1F5F9',
  },
  guideTitle: {
    fontSize: '13px', fontWeight: '700',
    color: '#1a1a2e', marginBottom: '10px',
  },
  guideItem: {
    display: 'flex', alignItems: 'center',
    gap: '8px', marginBottom: '6px',
  },
  guideDot: { width: '8px', height: '8px', borderRadius: '50%' },
  guideLabel: { fontSize: '12px', color: '#64748B', fontWeight: '500' },
};

export default AddJob;