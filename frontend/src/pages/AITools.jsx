import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import {
  generateCoverLetter,
  generateInterviewPrep,
  generateFollowupEmail,
  generateResumeTips
} from '../services/api';
import {
  MdArrowBack, MdAutoAwesome, MdContentCopy,
  MdCheck, MdWork, MdEmail, MdLightbulb, MdQuestionAnswer
} from 'react-icons/md';

const TOOLS = [
  {
    id: 'cover-letter',
    title: 'Cover Letter Generator',
    subtitle: 'AI-written cover letter tailored to the job',
    icon: <MdWork size={22} />,
    color: '#0A66C2',
    bg: '#EFF6FF',
    border: '#BFDBFE',
  },
  {
    id: 'interview-prep',
    title: 'Interview Prep',
    subtitle: 'Role-specific questions with answer tips',
    icon: <MdQuestionAnswer size={22} />,
    color: '#8B5CF6',
    bg: '#F5F3FF',
    border: '#DDD6FE',
  },
  {
    id: 'followup-email',
    title: 'Follow-up Email Writer',
    subtitle: 'Professional follow-up based on your status',
    icon: <MdEmail size={22} />,
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    id: 'resume-tips',
    title: 'Resume Tips',
    subtitle: 'ATS keywords and skills to highlight',
    icon: <MdLightbulb size={22} />,
    color: '#F59E0B',
    bg: '#FFFBEB',
    border: '#FDE68A',
  },
];

const STATUS_OPTIONS = ['Applied', 'Written Test', 'Interview', 'Offered', 'Rejected'];

const AITools = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTool, setActiveTool] = useState('cover-letter');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  // Form fields
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [status, setStatus] = useState('Applied');

  const currentTool = TOOLS.find(t => t.id === activeTool);

  const handleGenerate = async () => {
    setError('');
    setResult('');

    if (!company.trim() || !role.trim()) {
      setError('Company and Role are required.');
      return;
    }

    if ((activeTool === 'cover-letter' ||
         activeTool === 'interview-prep' ||
         activeTool === 'resume-tips') && !jobDescription.trim()) {
      setError('Job description is required for this tool.');
      return;
    }

    setLoading(true);
    try {
      let response;
      const payload = {
        company,
        role,
        jobDescription,
        status,
        dateApplied: new Date().toLocaleDateString(),
        userName: user?.name || 'Applicant'
      };

      if (activeTool === 'cover-letter') {
        response = await generateCoverLetter(payload);
      } else if (activeTool === 'interview-prep') {
        response = await generateInterviewPrep(payload);
      } else if (activeTool === 'followup-email') {
        response = await generateFollowupEmail(payload);
      } else if (activeTool === 'resume-tips') {
        response = await generateResumeTips(payload);
      }

      setResult(response.data.result);
    } catch (err) {
      setError(err.response?.data?.message || 'AI generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToolSwitch = (toolId) => {
    setActiveTool(toolId);
    setResult('');
    setError('');
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* Back Button + Header */}
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
          <MdArrowBack size={16} />
          Back to Dashboard
        </button>

        <div style={styles.pageHeader}>
          <div style={styles.headerLeft}>
            <div style={styles.aibadge}>
              <MdAutoAwesome size={14} color="#F59E0B" />
              <span>AI Powered</span>
            </div>
            <h1 style={styles.pageTitle}>AI Career Tools</h1>
            <p style={styles.pageSubtitle}>
              Let AI handle the writing — you focus on landing the job
            </p>
          </div>
        </div>

        {/* Tool Selector Cards */}
        <div style={styles.toolGrid} className="ai-tool-grid">
          {TOOLS.map((tool) => (
            <button
              key={tool.id}
              style={{
                ...styles.toolCard,
                borderColor: activeTool === tool.id ? tool.color : '#E2E8F0',
                backgroundColor: activeTool === tool.id ? tool.bg : '#fff',
                boxShadow: activeTool === tool.id
                  ? `0 0 0 2px ${tool.color}30`
                  : '0 1px 3px rgba(0,0,0,0.06)',
              }}
              onClick={() => handleToolSwitch(tool.id)}
            >
              <div style={{
                ...styles.toolIcon,
                backgroundColor: activeTool === tool.id ? tool.bg : '#F8FAFC',
                color: tool.color,
                border: `1px solid ${activeTool === tool.id ? tool.border : '#E2E8F0'}`,
              }}>
                {tool.icon}
              </div>
              <div style={styles.toolInfo}>
                <p style={{
                  ...styles.toolName,
                  color: activeTool === tool.id ? tool.color : '#1a1a2e',
                }}>
                  {tool.title}
                </p>
                <p style={styles.toolDesc}>{tool.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div style={styles.mainLayout} className='ai-main-layout'>

          {/* Left — Input Form */}
          <div style={styles.inputCard} className='ai-input-card'>
            <div style={styles.inputHeader}>
              <div style={{
                ...styles.inputIconBox,
                backgroundColor: currentTool.bg,
                color: currentTool.color,
              }}>
                {currentTool.icon}
              </div>
              <div>
                <h2 style={styles.inputTitle}>{currentTool.title}</h2>
                <p style={styles.inputSubtitle}>{currentTool.subtitle}</p>
              </div>
            </div>

            {error && (
              <div style={styles.errorBox}>⚠️ {error}</div>
            )}

            {/* Company */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Company Name *</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Google, Amazon, TCS"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>

            {/* Role */}
            <div style={styles.fieldGroup}>
              <label style={styles.label}>Job Role *</label>
              <input
                style={styles.input}
                type="text"
                placeholder="e.g. Frontend Developer, Data Analyst"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />
            </div>

            {/* Status — only for follow-up email */}
            {activeTool === 'followup-email' && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>Current Application Status *</label>
                <div style={styles.statusGrid}>
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setStatus(s)}
                      style={{
                        ...styles.statusBtn,
                        backgroundColor: status === s ? '#0A66C215' : '#F8FAFC',
                        borderColor: status === s ? '#0A66C2' : '#E2E8F0',
                        color: status === s ? '#0A66C2' : '#64748B',
                        fontWeight: status === s ? '700' : '500',
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Job Description — not needed for follow-up */}
            {activeTool !== 'followup-email' && (
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Job Description *
                  <span style={styles.labelHint}> (paste from job posting)</span>
                </label>
                <textarea
                  style={styles.textarea}
                  placeholder="Paste the job description here for best AI results..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows={5}
                />
              </div>
            )}

            {/* Generate Button */}
            <button
              style={{
                ...styles.generateBtn,
                backgroundColor: loading ? '#93C5FD' : currentTool.color,
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
              onClick={handleGenerate}
              disabled={loading}
            >
              <MdAutoAwesome size={18} />
              {loading ? 'AI is generating...' : `Generate ${currentTool.title}`}
            </button>

          </div>

          {/* Right — Output */}
          <div style={styles.outputCard}>
            <div style={styles.outputHeader}>
              <h3 style={styles.outputTitle}>AI Output</h3>
              {result && (
                <button style={styles.copyBtn} onClick={handleCopy}>
                  {copied
                    ? <><MdCheck size={15} /> Copied!</>
                    : <><MdContentCopy size={15} /> Copy</>}
                </button>
              )}
            </div>

            {/* Empty State */}
            {!result && !loading && (
              <div style={styles.emptyOutput}>
                <MdAutoAwesome size={40} color="#CBD5E1" />
                <p style={styles.emptyTitle}>Ready to generate</p>
                <p style={styles.emptyDesc}>
                  Fill in the details on the left and click Generate
                </p>
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div style={styles.emptyOutput}>
                <div style={styles.loadingDots}>
                  <span style={{ ...styles.dot, animationDelay: '0s' }} />
                  <span style={{ ...styles.dot, animationDelay: '0.2s' }} />
                  <span style={{ ...styles.dot, animationDelay: '0.4s' }} />
                </div>
                <p style={styles.emptyTitle}>AI is thinking...</p>
                <p style={styles.emptyDesc}>This usually takes 5-10 seconds</p>
              </div>
            )}

            {/* Result */}
            {result && !loading && (
              <div style={styles.resultBox}>
                <pre style={styles.resultText}>{result}</pre>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Dot animation */}
      <style>{`
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0); opacity: 0.3; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
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
  pageHeader: { marginBottom: '24px' },
  headerLeft: {},
  aibage: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    backgroundColor: '#FFFBEB', border: '1px solid #FDE68A',
    borderRadius: '20px', padding: '4px 12px',
    fontSize: '12px', fontWeight: '600', color: '#92400E',
    marginBottom: '10px',
  },
  aibage: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    backgroundColor: '#FFFBEB', border: '1px solid #FDE68A',
    borderRadius: '20px', padding: '4px 12px',
    fontSize: '12px', fontWeight: '600', color: '#92400E',
    marginBottom: '10px',
  },
  pageTitle: {
    fontSize: '24px', fontWeight: '800',
    color: '#1a1a2e', letterSpacing: '-0.5px',
  },
  pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '4px' },
  toolGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px', marginBottom: '24px',
  },
  toolCard: {
    display: 'flex', alignItems: 'center', gap: '12px',
    padding: '16px', borderRadius: '12px',
    border: '2px solid', cursor: 'pointer',
    textAlign: 'left', transition: 'all 0.15s',
  },
  toolIcon: {
    width: '44px', height: '44px', borderRadius: '10px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  toolInfo: {},
  toolName: { fontSize: '13px', fontWeight: '700', marginBottom: '2px' },
  toolDesc: { fontSize: '11px', color: '#94A3B8', lineHeight: '1.4' },
  mainLayout: { display: 'flex', gap: '24px', alignItems: 'flex-start' },
  inputCard: {
    width: '420px', flexShrink: 0, backgroundColor: '#fff',
    borderRadius: '16px', padding: '28px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
  },
  inputHeader: {
    display: 'flex', alignItems: 'center', gap: '14px',
    marginBottom: '24px', paddingBottom: '20px',
    borderBottom: '1px solid #F1F5F9',
  },
  inputIconBox: {
    width: '44px', height: '44px', borderRadius: '12px',
    display: 'flex', alignItems: 'center',
    justifyContent: 'center', flexShrink: 0,
  },
  inputTitle: {
    fontSize: '17px', fontWeight: '800',
    color: '#1a1a2e', letterSpacing: '-0.3px',
  },
  inputSubtitle: { fontSize: '12px', color: '#64748B', marginTop: '2px' },
  errorBox: {
    backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
    color: '#DC2626', padding: '10px 14px',
    borderRadius: '8px', fontSize: '13px', marginBottom: '16px',
  },
  fieldGroup: { marginBottom: '16px' },
  label: {
    display: 'block', fontSize: '13px',
    fontWeight: '600', color: '#374151', marginBottom: '6px',
  },
  labelHint: { fontSize: '12px', color: '#94A3B8', fontWeight: '400' },
  input: {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
    backgroundColor: '#F8FAFC', boxSizing: 'border-box',
  },
  textarea: {
    width: '100%', padding: '10px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '14px', outline: 'none', backgroundColor: '#F8FAFC',
    boxSizing: 'border-box', resize: 'vertical', lineHeight: '1.5',
  },
  statusGrid: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  statusBtn: {
    padding: '6px 12px', borderRadius: '20px',
    border: '1.5px solid', fontSize: '12px',
    cursor: 'pointer', transition: 'all 0.15s',
  },
  generateBtn: {
    width: '100%', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    gap: '8px', padding: '12px',
    color: '#fff', border: 'none', borderRadius: '10px',
    fontSize: '15px', fontWeight: '700',
    marginTop: '8px', transition: 'background-color 0.2s',
  },
  outputCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: '16px',
    padding: '28px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9', minHeight: '500px',
    display: 'flex', flexDirection: 'column',
  },
  outputHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '20px',
    paddingBottom: '16px', borderBottom: '1px solid #F1F5F9',
  },
  outputTitle: {
    fontSize: '16px', fontWeight: '700', color: '#1a1a2e',
  },
  copyBtn: {
    display: 'flex', alignItems: 'center', gap: '6px',
    padding: '7px 16px', backgroundColor: '#F0FDF4',
    color: '#16A34A', border: '1px solid #BBF7D0',
    borderRadius: '8px', fontSize: '13px',
    fontWeight: '600', cursor: 'pointer',
  },
  emptyOutput: {
    flex: 1, display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: '10px', padding: '40px',
  },
  emptyTitle: { fontSize: '16px', fontWeight: '700', color: '#94A3B8' },
  emptyDesc: {
    fontSize: '13px', color: '#CBD5E1',
    textAlign: 'center', lineHeight: '1.5',
  },
  loadingDots: { display: 'flex', gap: '6px', marginBottom: '8px' },
  dot: {
    width: '10px', height: '10px',
    backgroundColor: '#0A66C2', borderRadius: '50%',
    display: 'inline-block',
    animation: 'bounce 1.4s infinite ease-in-out',
  },
  resultBox: {
    flex: 1, backgroundColor: '#F8FAFC',
    borderRadius: '10px', padding: '20px',
    border: '1px solid #E2E8F0', overflowY: 'auto',
  },
  resultText: {
    fontSize: '14px', lineHeight: '1.8',
    color: '#334155', whiteSpace: 'pre-wrap',
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    margin: 0,
  },
};

// Fix the aibage typo — same style twice
styles.aibage = styles.aibage;

export default AITools;