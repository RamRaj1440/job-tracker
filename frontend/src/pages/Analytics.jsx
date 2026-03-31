import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { getAnalytics } from '../services/api';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import {
  MdArrowBack, MdTrendingUp, MdTrendingDown,
  MdOutlineSpeed, MdWorkOutline
} from 'react-icons/md';
import {
  BsBriefcaseFill, BsGraphUp,
  BsCheckCircle, BsXCircle
} from 'react-icons/bs';

const STATUS_COLORS = {
  Applied:       '#3B82F6',
  'Written Test':'#F59E0B',
  Interview:     '#8B5CF6',
  Offered:       '#10B981',
  Rejected:      '#EF4444',
};

const Analytics = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await getAnalytics();
        setData(res.data);
      } catch (err) {
        setError('Failed to load analytics. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.loadingState}>
          <div style={styles.spinner} />
          <p style={styles.loadingText}>Loading your analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.page}>
        <Navbar />
        <div style={styles.loadingState}>
          <p style={{ color: '#EF4444' }}>{error}</p>
        </div>
      </div>
    );
  }

  const statusData = Object.entries(data.statusBreakdown).map(
    ([status, count]) => ({ status, count })
  );

  const weekChange = data.thisWeek - data.lastWeek;
  const weekChangePositive = weekChange >= 0;

  // Custom Tooltip for Line Chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={styles.tooltip}>
          <p style={styles.tooltipLabel}>{label}</p>
          <p style={styles.tooltipValue}>
            {payload[0].value} application{payload[0].value !== 1 ? 's' : ''}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={styles.page}>
      <Navbar />
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <MdArrowBack size={16} />
            Back to Dashboard
          </button>
          <div>
            <h1 style={styles.pageTitle}>Analytics</h1>
            <p style={styles.pageSubtitle}>
              Insights into your job search performance
            </p>
          </div>
        </div>

        {/* Top KPI Cards */}
        <div style={styles.kpiGrid} className="kpi-grid">
          {[
            {
              icon: <BsBriefcaseFill size={20} />,
              color: '#0A66C2',
              bg: '#EFF6FF',
              label: 'Total Applied',
              value: data.total,
              sub: `${data.active} still active`,
            },
            {
              icon: <MdOutlineSpeed size={20} />,
              color: '#8B5CF6',
              bg: '#F5F3FF',
              label: 'Response Rate',
              value: `${data.responseRate}%`,
              sub: 'Companies that responded',
            },
            {
              icon: <BsCheckCircle size={20} />,
              color: '#10B981',
              bg: '#ECFDF5',
              label: 'Offer Rate',
              value: `${data.offerRate}%`,
              sub: 'Applications → Offers',
            },
            {
              icon: <BsGraphUp size={20} />,
              color: weekChangePositive ? '#10B981' : '#EF4444',
              bg: weekChangePositive ? '#ECFDF5' : '#FEF2F2',
              label: 'This Week',
              value: data.thisWeek,
              sub: weekChangePositive
                ? `↑ ${weekChange} more than last week`
                : `↓ ${Math.abs(weekChange)} less than last week`,
              subColor: weekChangePositive ? '#10B981' : '#EF4444',
            },
          ].map(kpi => (
            <div key={kpi.label} style={styles.kpiCard} className="kpi-card">
              <div style={styles.kpiTop}>
                <div style={{
                  ...styles.kpiIcon,
                  backgroundColor: kpi.bg,
                  color: kpi.color,
                }}>
                  {kpi.icon}
                </div>
                <span style={{ ...styles.kpiValue, color: kpi.color }}>
                  {kpi.value}
                </span>
              </div>
              <p style={styles.kpiLabel}>{kpi.label}</p>
              <p style={{
                ...styles.kpiSub,
                color: kpi.subColor || '#94A3B8',
              }}>
                {kpi.sub}
              </p>
            </div>
          ))}
        </div>

        {/* Charts Row */}
        <div style={styles.chartsRow} className='charts-row'>

          {/* Line Chart — 30 Day Trend */}
          <div style={styles.chartCard} className="chart-card">
            <div style={styles.chartHeader}>
              <div>
                <h3 style={styles.chartTitle}>Application Trend</h3>
                <p style={styles.chartSubtitle}>Applications per day — last 30 days</p>
              </div>
            </div>
            {data.total === 0 ? (
              <div style={styles.emptyChart}>
                <p style={styles.emptyChartText}>
                  No applications yet — start applying!
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={data.last30Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    tickLine={false}
                    interval={4}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="applications"
                    stroke="#0A66C2"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: '#0A66C2' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Bar Chart — Status Breakdown */}
          <div style={styles.chartCard}>
            <div style={styles.chartHeader}>
              <div>
                <h3 style={styles.chartTitle}>Status Breakdown</h3>
                <p style={styles.chartSubtitle}>Applications by current status</p>
              </div>
            </div>
            {data.total === 0 ? (
              <div style={styles.emptyChart}>
                <p style={styles.emptyChartText}>
                  No data yet — add your first application!
                </p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={statusData} barSize={36}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis
                    dataKey="status"
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: '#94A3B8' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    formatter={(value, name) => [value, 'Applications']}
                    contentStyle={{
                      borderRadius: '8px',
                      border: '1px solid #E2E8F0',
                      fontSize: '13px',
                    }}
                  />
                  <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                    {statusData.map(entry => (
                      <Cell
                        key={entry.status}
                        fill={STATUS_COLORS[entry.status] || '#0A66C2'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Bottom Row */}
        <div style={styles.bottomRow}>

          {/* Top Companies */}
          <div style={styles.bottomCard}>
            <h3 style={styles.chartTitle}>Top Companies</h3>
            <p style={styles.chartSubtitle}>Most applied to companies</p>
            <div style={styles.companiesList}>
              {data.topCompanies.length === 0 ? (
                <p style={styles.emptyChartText}>No data yet</p>
              ) : (
                data.topCompanies.map((item, index) => (
                  <div key={item.company} style={styles.companyRow}>
                    <div style={styles.companyLeft}>
                      <span style={styles.companyRank}>#{index + 1}</span>
                      <div style={styles.companyIcon}>
                        <MdWorkOutline size={14} color="#0A66C2" />
                      </div>
                      <span style={styles.companyName}>{item.company}</span>
                    </div>
                    <div style={styles.companyRight}>
                      <div style={styles.companyBar}>
                        <div style={{
                          ...styles.companyBarFill,
                          width: `${(item.count / data.topCompanies[0].count) * 100}%`,
                        }} />
                      </div>
                      <span style={styles.companyCount}>
                        {item.count} app{item.count !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Weekly Goal Tracker */}
          <div style={styles.bottomCard}>
            <h3 style={styles.chartTitle}>Weekly Goal</h3>
            <p style={styles.chartSubtitle}>Target: 5 applications per week</p>
            <div style={styles.goalSection}>
              <div style={styles.goalCircle}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50"
                    fill="none" stroke="#F1F5F9" strokeWidth="10" />
                  <circle cx="60" cy="60" r="50"
                    fill="none"
                    stroke={data.thisWeek >= 5 ? '#10B981' : '#0A66C2'}
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.min((data.thisWeek / 5) * 314, 314)} 314`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dasharray 1s ease' }}
                  />
                </svg>
                <div style={styles.goalInner}>
                  <span style={{
                    ...styles.goalNum,
                    color: data.thisWeek >= 5 ? '#10B981' : '#0A66C2',
                  }}>
                    {data.thisWeek}
                  </span>
                  <span style={styles.goalDen}>/5</span>
                </div>
              </div>
              <div style={styles.goalInfo}>
                {data.thisWeek >= 5 ? (
                  <>
                    <div style={styles.goalAchieved}>🎉 Goal Achieved!</div>
                    <p style={styles.goalDesc}>
                      You've hit your weekly target. Keep the momentum going!
                    </p>
                  </>
                ) : (
                  <>
                    <div style={styles.goalRemaining}>
                      {5 - data.thisWeek} more to go
                    </div>
                    <p style={styles.goalDesc}>
                      Apply to {5 - data.thisWeek} more job
                      {5 - data.thisWeek !== 1 ? 's' : ''} to hit
                      your weekly goal of 5 applications.
                    </p>
                  </>
                )}
                <div style={styles.goalStats}>
                  <div style={styles.goalStat}>
                    <span style={styles.goalStatNum}>{data.thisWeek}</span>
                    <span style={styles.goalStatLabel}>This week</span>
                  </div>
                  <div style={styles.goalStat}>
                    <span style={styles.goalStatNum}>{data.lastWeek}</span>
                    <span style={styles.goalStatLabel}>Last week</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Performance Summary */}
        <div style={styles.summaryCard}>
          <h3 style={styles.chartTitle}>Performance Summary</h3>
          <p style={styles.chartSubtitle}>How your job search is performing</p>
          <div style={styles.summaryGrid}>
            {[
              {
                label: 'Applications Sent',
                value: data.total,
                icon: '📤',
                desc: 'Total jobs applied to',
              },
              {
                label: 'Active Pipeline',
                value: data.active,
                icon: '🔄',
                desc: 'Applications still in progress',
              },
              {
                label: 'Response Rate',
                value: `${data.responseRate}%`,
                icon: '📬',
                desc: data.responseRate >= 30
                  ? 'Above average — great!'
                  : 'Keep applying to improve',
              },
              {
                label: 'Offer Rate',
                value: `${data.offerRate}%`,
                icon: '🎉',
                desc: data.offerRate > 0
                  ? 'Offers received!'
                  : 'Keep going — offers take time',
              },
              {
                label: 'This Week',
                value: data.thisWeek,
                icon: '📅',
                desc: data.thisWeek >= 5
                  ? 'Weekly goal achieved!'
                  : `${5 - data.thisWeek} more to reach goal`,
              },
              {
                label: 'Top Company',
                value: data.topCompanies[0]?.company || '—',
                icon: '🏢',
                desc: data.topCompanies[0]
                  ? `Applied ${data.topCompanies[0].count} time(s)`
                  : 'No applications yet',
              },
            ].map(item => (
              <div key={item.label} style={styles.summaryItem}>
                <span style={styles.summaryEmoji}>{item.icon}</span>
                <div>
                  <p style={styles.summaryValue}>{item.value}</p>
                  <p style={styles.summaryLabel}>{item.label}</p>
                  <p style={styles.summaryDesc}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F3F2EF' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  loadingState: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: '60vh', gap: '16px',
  },
  spinner: {
    width: '40px', height: '40px',
    border: '3px solid #E2E8F0',
    borderTop: '3px solid #0A66C2',
    borderRadius: '50%',
    animation: 'spin 0.8s linear infinite',
  },
  loadingText: { fontSize: '14px', color: '#64748B' },
  header: { marginBottom: '28px' },
  backBtn: {
    display: 'inline-flex', alignItems: 'center', gap: '6px',
    background: 'none', border: 'none', color: '#0A66C2',
    fontSize: '14px', fontWeight: '600', cursor: 'pointer',
    marginBottom: '12px', padding: '0',
  },
  pageTitle: {
    fontSize: '24px', fontWeight: '800',
    color: '#1a1a2e', letterSpacing: '-0.5px',
  },
  pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '2px' },

  // KPI CARDS
  kpiGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px', marginBottom: '24px',
  },
  kpiCard: {
    backgroundColor: '#fff', borderRadius: '14px',
    padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
  },
  kpiTop: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '10px',
  },
  kpiIcon: {
    width: '40px', height: '40px', borderRadius: '10px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  kpiValue: { fontSize: '28px', fontWeight: '800', letterSpacing: '-1px' },
  kpiLabel: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginBottom: '4px' },
  kpiSub: { fontSize: '12px' },

  // CHARTS
  chartsRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  chartCard: {
    backgroundColor: '#fff', borderRadius: '16px',
    padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
  },
  chartHeader: { marginBottom: '20px' },
  chartTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e' },
  chartSubtitle: { fontSize: '12px', color: '#94A3B8', marginTop: '2px' },
  emptyChart: {
    height: '220px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
  },
  emptyChartText: { fontSize: '14px', color: '#CBD5E1', fontStyle: 'italic' },
  tooltip: {
    backgroundColor: '#fff', border: '1px solid #E2E8F0',
    borderRadius: '8px', padding: '10px 14px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  },
  tooltipLabel: { fontSize: '12px', color: '#94A3B8', marginBottom: '4px' },
  tooltipValue: { fontSize: '14px', fontWeight: '700', color: '#0A66C2' },

  // BOTTOM ROW
  bottomRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  bottomCard: {
    backgroundColor: '#fff', borderRadius: '16px',
    padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
  },

  // TOP COMPANIES
  companiesList: { display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' },
  companyRow: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' },
  companyLeft: { display: 'flex', alignItems: 'center', gap: '10px', minWidth: '140px' },
  companyRank: { fontSize: '12px', fontWeight: '700', color: '#94A3B8', width: '20px' },
  companyIcon: {
    width: '28px', height: '28px', backgroundColor: '#EFF6FF',
    borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center',
  },
  companyName: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e' },
  companyRight: { display: 'flex', alignItems: 'center', gap: '10px', flex: 1 },
  companyBar: { flex: 1, height: '6px', backgroundColor: '#F1F5F9', borderRadius: '99px', overflow: 'hidden' },
  companyBarFill: { height: '100%', backgroundColor: '#0A66C2', borderRadius: '99px', transition: 'width 1s ease' },
  companyCount: { fontSize: '12px', color: '#64748B', fontWeight: '500', whiteSpace: 'nowrap' },

  // GOAL TRACKER
  goalSection: { display: 'flex', alignItems: 'center', gap: '24px', marginTop: '16px' },
  goalCircle: { position: 'relative', flexShrink: 0 },
  goalInner: {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    textAlign: 'center',
  },
  goalNum: { fontSize: '28px', fontWeight: '800', letterSpacing: '-1px' },
  goalDen: { fontSize: '14px', color: '#94A3B8', fontWeight: '500' },
  goalInfo: { flex: 1 },
  goalAchieved: { fontSize: '15px', fontWeight: '700', color: '#10B981', marginBottom: '8px' },
  goalRemaining: { fontSize: '15px', fontWeight: '700', color: '#0A66C2', marginBottom: '8px' },
  goalDesc: { fontSize: '13px', color: '#64748B', lineHeight: '1.5', marginBottom: '16px' },
  goalStats: { display: 'flex', gap: '20px' },
  goalStat: { display: 'flex', flexDirection: 'column', gap: '2px' },
  goalStatNum: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px' },
  goalStatLabel: { fontSize: '11px', color: '#94A3B8', fontWeight: '500' },

  // SUMMARY
  summaryCard: {
    backgroundColor: '#fff', borderRadius: '16px',
    padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
  },
  summaryGrid: {
    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '20px', marginTop: '20px',
  },
  summaryItem: {
    display: 'flex', gap: '14px', alignItems: 'flex-start',
    padding: '16px', backgroundColor: '#F8FAFC',
    borderRadius: '12px', border: '1px solid #F1F5F9',
  },
  summaryEmoji: { fontSize: '24px', flexShrink: 0 },
  summaryValue: { fontSize: '20px', fontWeight: '800', color: '#1a1a2e', letterSpacing: '-0.5px' },
  summaryLabel: { fontSize: '13px', fontWeight: '600', color: '#1a1a2e', marginTop: '2px' },
  summaryDesc: { fontSize: '12px', color: '#94A3B8', marginTop: '2px', lineHeight: '1.4' },
};

export default Analytics;