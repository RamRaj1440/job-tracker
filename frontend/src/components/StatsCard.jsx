const StatsCard = ({ title, count, color, icon }) => {
  return (
    <div style={styles.card}>
      <div style={styles.top}>
        <div style={{ ...styles.iconBox, backgroundColor: `${color}15`, color }}>
          {icon}
        </div>
        <span style={{ ...styles.count, color }}>{count}</span>
      </div>
      <p style={styles.title}>{title}</p>
      <div style={{ ...styles.bar, backgroundColor: `${color}20` }}>
        <div style={{ ...styles.barFill, backgroundColor: color, width: count > 0 ? '60%' : '0%' }} />
      </div>
    </div>
  );
};

const styles = {
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '20px',
    flex: 1,
    minWidth: '160px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
    border: '1px solid #F1F5F9',
    transition: 'box-shadow 0.2s',
  },
  top: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  iconBox: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  count: {
    fontSize: '32px',
    fontWeight: '800',
    letterSpacing: '-1px',
  },
  title: {
    fontSize: '13px',
    color: '#64748B',
    fontWeight: '500',
    marginBottom: '12px',
  },
  bar: {
    height: '4px',
    borderRadius: '99px',
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: '99px',
    transition: 'width 0.8s ease',
  },
};

export default StatsCard;