import dayjs from 'dayjs';
import { motion } from 'framer-motion';

export default function TodayCard({ item, attendance, onMark }) {
  const record = attendance?.find(
    (r) => r.subjectCode === item.subjectCode && dayjs(r.date).isSame(dayjs(), 'day')
  );
  const status = record?.status;
  const hasStatus = Boolean(status);
  const pct = item.percentage ?? 100;
  const pctColor = pct < 65 ? 'var(--danger)' : pct < 75 ? 'var(--warn)' : 'var(--success)';
  const isExtra = item.type === 'Extra';

  const buttonStyle = (bg, shadow) => ({
    background: bg,
    color: '#0b1220',
    boxShadow: hasStatus ? 'none' : shadow,
    opacity: hasStatus ? 0.5 : 1,
    filter: hasStatus ? 'saturate(0.7)' : 'none'
  });

  return (
    <motion.div
      className="card glow-card"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>{item.subjectCode}</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
          {item.startTime} – {item.endTime} · {item.location}
        </div>
        <div style={{ marginTop: 6, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <span className="badge" style={{ background: 'rgba(34,211,238,0.12)', color: 'var(--accent)' }}>
            {item.subjectName}
          </span>
          <span className="badge" style={{ background: 'rgba(148,163,184,0.15)', color: 'var(--muted)' }}>
            {item.type}
          </span>
          {isExtra && (
            <span className="badge" style={{ background: 'rgba(251,146,60,0.16)', color: 'var(--warn)' }}>
              Extra
            </span>
          )}
          {status && (
            <span
              className="badge"
              style={{
                background:
                  status === 'present'
                    ? 'rgba(52,211,153,0.2)'
                    : status === 'absent'
                    ? 'rgba(248,113,113,0.2)'
                    : 'rgba(148,163,184,0.2)',
                color:
                  status === 'present'
                    ? 'var(--success)'
                    : status === 'absent'
                    ? 'var(--danger)'
                    : 'var(--muted)'
              }}
            >
              {status}
            </span>
          )}
        </div>
      </div>
      <div style={{ textAlign: 'right', minWidth: 180 }}>
        <div style={{ color: pctColor, fontWeight: 800, fontSize: 18 }}>{Math.round(pct)}%</div>
        <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
          <motion.button
            onClick={() => onMark(item.subjectCode, 'present')}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle(
              'linear-gradient(135deg, rgba(52,211,153,0.4), rgba(16,185,129,0.35))',
              '0 10px 30px rgba(52,211,153,0.25)'
            )}
          >
            ✅ Present
          </motion.button>
          <motion.button
            onClick={() => onMark(item.subjectCode, 'absent')}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle(
              'linear-gradient(135deg, rgba(248,113,113,0.4), rgba(239,68,68,0.35))',
              '0 10px 30px rgba(248,113,113,0.25)'
            )}
          >
            ❌ Absent
          </motion.button>
          <motion.button
            onClick={() => onMark(item.subjectCode, 'cancelled', true)}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle(
              'linear-gradient(135deg, rgba(148,163,184,0.35), rgba(100,116,139,0.35))',
              '0 10px 30px rgba(148,163,184,0.2)'
            )}
          >
            ⏸ Cancelled
          </motion.button>
        </div>
        {status && (
          <div style={{ marginTop: 6, color: 'var(--muted)', fontSize: 12, textTransform: 'capitalize' }}>
            Marked {status} (tap to change)
          </div>
        )}
      </div>
    </motion.div>
  );
}