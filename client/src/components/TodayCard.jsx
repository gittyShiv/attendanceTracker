import dayjs from 'dayjs';
import { motion } from 'framer-motion';

export default function TodayCard({ item, attendance, onMark }) {
  const record = attendance; // already resolved correctly in Today.jsx
  const status = record?.status;
  const pct = item.percentage ?? 100;
  const pctColor = pct < 65 ? 'var(--danger)' : pct < 75 ? 'var(--warn)' : 'var(--success)';
  const isExtra = item.type === 'Extra';

  const buttonStyle = (bg, shadow) => ({
    background: bg,
    color: '#0b1220',
    boxShadow: status ? 'none' : shadow,
    opacity: status ? 0.6 : 1
  });

  return (
    <motion.div
      className="card glow-card"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'space-between' }}
    >
      <div>
        <div style={{ fontWeight: 700 }}>{item.subjectCode}</div>
        <div style={{ color: 'var(--muted)', fontSize: 13 }}>
          {item.startTime} – {item.endTime} · {item.location}
        </div>
      </div>

      <div style={{ textAlign: 'right', minWidth: 180 }}>
        <div style={{ color: pctColor, fontWeight: 800 }}>{Math.round(pct)}%</div>

        <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
          <motion.button
            onClick={() => onMark(record?._id, 'present')}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle('rgba(52,211,153,0.4)', '0 10px 30px rgba(52,211,153,0.25)')}
          >
            Present
          </motion.button>

          <motion.button
            onClick={() => onMark(record?._id, 'absent')}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle('rgba(248,113,113,0.4)', '0 10px 30px rgba(248,113,113,0.25)')}
          >
            Absent
          </motion.button>

          <motion.button
            onClick={() => onMark(record?._id, 'cancelled', true)}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle('rgba(148,163,184,0.35)', '0 10px 30px rgba(148,163,184,0.2)')}
          >
            Cancelled
          </motion.button>
        </div>

        {status && (
          <div style={{ marginTop: 6, fontSize: 12 }}>
            Marked {status}
          </div>
        )}
      </div>
    </motion.div>
  );
}
