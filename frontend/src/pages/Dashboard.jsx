import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import StatsCard from '../components/StatsCard';
import { getJobs, getDashboardStats, deleteJob, updateJob } from '../services/api';
import {
  MdSearch, MdFilterList, MdEdit, MdDelete,
  MdOpenInNew, MdWork, MdTrendingUp,
  MdCheckCircle, MdCancel, MdInbox
} from 'react-icons/md';
import { BsBriefcaseFill } from 'react-icons/bs';
import { FaUserTie } from 'react-icons/fa';

const STATUS_CONFIG = {
  'Applied':      { color: '#3B82F6', bg: '#EFF6FF', label: 'Applied' },
  'Written Test': { color: '#F59E0B', bg: '#FFFBEB', label: 'Written Test' },
  'Interview':    { color: '#8B5CF6', bg: '#F5F3FF', label: 'Interview' },
  'Offered':      { color: '#10B981', bg: '#ECFDF5', label: 'Offered' },
  'Rejected':     { color: '#EF4444', bg: '#FEF2F2', label: 'Rejected' },
};

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [stats, setStats] = useState({ total: 0, interviews: 0, offers: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const params = {};
      if (statusFilter !== 'All') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;
      const [jobsRes, statsRes] = await Promise.all([
        getJobs(params),
        getDashboardStats()
      ]);
      setJobs(jobsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, [statusFilter, searchTerm]);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this application?')) return;
    try {
      await deleteJob(id);
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      await updateJob(id, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <div style={styles.container}>

        {/* Page Header */}
        <div style={styles.pageHeader}>
          <div>
            <h1 style={styles.pageTitle}>My Applications</h1>
            <p style={styles.pageSubtitle}>Track and manage your job search pipeline</p>
          </div>
        </div>

        {/* Stats Row */}
        <div style={styles.statsRow}>
          <StatsCard
            title="Total Applied"
            count={stats.total}
            color="#0A66C2"
            icon={<BsBriefcaseFill size={18} />}
          />
          <StatsCard
            title="Interviews"
            count={stats.interviews}
            color="#8B5CF6"
            icon={<FaUserTie size={18} />}
          />
          <StatsCard
            title="Offers"
            count={stats.offers}
            color="#10B981"
            icon={<MdCheckCircle size={20} />}
          />
          <StatsCard
            title="Rejected"
            count={stats.rejected}
            color="#EF4444"
            icon={<MdCancel size={20} />}
          />
        </div>

        {/* Table Card */}
        <div style={styles.tableCard}>

          {/* Toolbar */}
          <div style={styles.toolbar}>
            <div style={styles.searchWrapper}>
              <MdSearch size={18} color="#94A3B8" style={styles.searchIcon} />
              <input
                style={styles.searchInput}
                type="text"
                placeholder="Search company or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={styles.filterWrapper}>
              <MdFilterList size={18} color="#64748B" />
              <select
                style={styles.filterSelect}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="All">All Status</option>
                <option value="Applied">Applied</option>
                <option value="Written Test">Written Test</option>
                <option value="Interview">Interview</option>
                <option value="Offered">Offered</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Loading your applications...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div style={styles.emptyState}>
              <MdInbox size={48} color="#CBD5E1" />
              <p style={styles.emptyTitle}>No applications found</p>
              <p style={styles.emptyText}>
                {statusFilter !== 'All' || searchTerm
                  ? 'Try changing your filters'
                  : 'Click "Add Application" in the navbar to get started'}
              </p>
            </div>
          ) : (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Company & Role</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Date Applied</th>
                    <th style={styles.th}>Notes</th>
                    <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {jobs.map((job, index) => (
                    <tr
                      key={job._id}
                      style={{
                        ...styles.tr,
                        backgroundColor: index % 2 === 0 ? '#fff' : '#FAFBFC'
                      }}
                    >
                      {/* Company + Role */}
                      <td style={styles.td}>
                        <div style={styles.companyCell}>
                          <div style={styles.companyIcon}>
                            <MdWork size={16} color="#0A66C2" />
                          </div>
                          <div>
                            <div style={styles.companyName}>
                              {job.company}
                              {job.jobLink && (
                                
                                  <a href={job.jobLink}
                                  target="_blank"
                                  rel="noreferrer"
                                  style={styles.linkIcon}
                                >
                                  <MdOpenInNew size={13} />
                                </a>
                              )}
                            </div>
                            <div style={styles.roleName}>{job.role}</div>
                          </div>
                        </div>
                      </td>

                      {/* Status Dropdown */}
                      <td style={styles.td}>
                        <select
                          value={job.status}
                          onChange={(e) => handleStatusChange(job._id, e.target.value)}
                          style={{
                            ...styles.statusBadge,
                            color: STATUS_CONFIG[job.status]?.color || '#333',
                            backgroundColor: STATUS_CONFIG[job.status]?.bg || '#f1f5f9',
                            borderColor: STATUS_CONFIG[job.status]?.color || '#ccc',
                          }}
                        >
                          {Object.keys(STATUS_CONFIG).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>

                      {/* Date */}
                      <td style={styles.td}>
                        <span style={styles.dateText}>
                          {new Date(job.dateApplied).toLocaleDateString('en-IN', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </span>
                      </td>

                      {/* Notes */}
                      <td style={styles.td}>
                        <span style={styles.notesText}>
                          {job.notes ? (job.notes.length > 35 ? job.notes.slice(0, 35) + '...' : job.notes) : '—'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ ...styles.td, textAlign: 'right' }}>
                        <div style={styles.actionBtns}>
                          <button
                            style={styles.editBtn}
                            onClick={() => navigate(`/edit-job/${job._id}`)}
                            title="Edit"
                          >
                            <MdEdit size={15} />
                            Edit
                          </button>
                          <button
                            style={styles.deleteBtn}
                            onClick={() => handleDelete(job._id)}
                            title="Delete"
                          >
                            <MdDelete size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer */}
          {jobs.length > 0 && (
            <div style={styles.tableFooter}>
              <span style={styles.footerText}>
                Showing {jobs.length} application{jobs.length !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: { minHeight: '100vh', backgroundColor: '#F3F2EF' },
  container: { maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' },
  pageHeader: {
    display: 'flex', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: '24px',
  },
  pageTitle: {
    fontSize: '24px', fontWeight: '800',
    color: '#1a1a2e', letterSpacing: '-0.5px',
  },
  pageSubtitle: { fontSize: '14px', color: '#64748B', marginTop: '2px' },
  statsRow: {
    display: 'flex', gap: '16px',
    marginBottom: '24px', flexWrap: 'wrap',
  },
  tableCard: {
    backgroundColor: '#fff',
    borderRadius: '16px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
    overflow: 'hidden',
  },
  toolbar: {
    display: 'flex', gap: '12px',
    padding: '16px 20px',
    borderBottom: '1px solid #F1F5F9',
    flexWrap: 'wrap',
  },
  searchWrapper: {
    flex: 1, position: 'relative',
    display: 'flex', alignItems: 'center',
    minWidth: '200px',
  },
  searchIcon: { position: 'absolute', left: '12px', pointerEvents: 'none' },
  searchInput: {
    width: '100%', padding: '9px 12px 9px 38px',
    border: '1.5px solid #E2E8F0', borderRadius: '8px',
    fontSize: '14px', outline: 'none',
    backgroundColor: '#F8FAFC', boxSizing: 'border-box',
  },
  filterWrapper: {
    display: 'flex', alignItems: 'center',
    gap: '8px', padding: '9px 14px',
    border: '1.5px solid #E2E8F0', borderRadius: '8px',
    backgroundColor: '#F8FAFC',
  },
  filterSelect: {
    border: 'none', outline: 'none',
    fontSize: '14px', backgroundColor: 'transparent',
    color: '#333', fontWeight: '500', cursor: 'pointer',
  },
  tableWrapper: { overflowX: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: {
    padding: '12px 20px', textAlign: 'left',
    fontSize: '12px', fontWeight: '600',
    color: '#64748B', textTransform: 'uppercase',
    letterSpacing: '0.5px',
    borderBottom: '1px solid #F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  tr: { transition: 'background-color 0.15s' },
  td: {
    padding: '14px 20px', fontSize: '14px',
    color: '#333', borderBottom: '1px solid #F8FAFC',
    verticalAlign: 'middle',
  },
  companyCell: { display: 'flex', alignItems: 'center', gap: '12px' },
  companyIcon: {
    width: '36px', height: '36px',
    backgroundColor: '#EFF6FF', borderRadius: '8px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  companyName: {
    fontSize: '14px', fontWeight: '700',
    color: '#1a1a2e', display: 'flex',
    alignItems: 'center', gap: '6px',
  },
  roleName: { fontSize: '12px', color: '#64748B', marginTop: '2px' },
  linkIcon: {
    color: '#0A66C2', display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    padding: '4px 10px', borderRadius: '6px',
    fontSize: '12px', fontWeight: '700',
    border: '1.5px solid', cursor: 'pointer',
    outline: 'none',
  },
  dateText: { fontSize: '13px', color: '#64748B', fontWeight: '500' },
  notesText: { fontSize: '13px', color: '#94A3B8', fontStyle: 'italic' },
  actionBtns: {
    display: 'flex', gap: '8px',
    justifyContent: 'flex-end', alignItems: 'center',
  },
  editBtn: {
    display: 'flex', alignItems: 'center', gap: '4px',
    padding: '6px 14px',
    backgroundColor: '#EFF6FF', color: '#0A66C2',
    border: '1px solid #BFDBFE', borderRadius: '6px',
    fontSize: '13px', fontWeight: '600', cursor: 'pointer',
  },
  deleteBtn: {
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '32px', height: '32px',
    backgroundColor: '#FEF2F2', color: '#EF4444',
    border: '1px solid #FECACA', borderRadius: '6px',
    cursor: 'pointer',
  },
  emptyState: {
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    padding: '64px 24px', gap: '12px',
  },
  emptyTitle: { fontSize: '16px', fontWeight: '700', color: '#333' },
  emptyText: { fontSize: '14px', color: '#94A3B8', textAlign: 'center' },
  tableFooter: {
    padding: '12px 20px',
    borderTop: '1px solid #F1F5F9',
    backgroundColor: '#F8FAFC',
  },
  footerText: { fontSize: '13px', color: '#94A3B8' },
};

export default Dashboard;