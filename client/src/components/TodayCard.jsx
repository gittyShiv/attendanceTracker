import { motion } from "framer-motion";

export default function TodayCard({ item, attendance, onMark }) {
  const status = attendance?.status;
  const pct = item.percentage ?? 100;
  const pctColor = pct < 65 ? "var(--danger)" : pct < 75 ? "var(--warn)" : "var(--success)";

  const buttonStyle = (bg) => ({
    background: bg,
    color: "#0b1220",
    opacity: status ? 0.6 : 1
  });

  return (
    <motion.div
      className="card glow-card"
      whileHover={{ y: -4, scale: 1.01 }}
      style={{ display: "flex", justifyContent: "space-between", gap: 12 }}
    >
      <div>
        <div style={{ fontWeight: 700 }}>{item.subjectCode}</div>
        <div style={{ fontSize: 12, color: "var(--muted)" }}>
          {item.startTime} – {item.endTime}
        </div>
      </div>

      <div style={{ textAlign: "right" }}>
        <div style={{ color: pctColor, fontWeight: 800 }}>
          {Math.round(pct)}%
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
          <motion.button
            onClick={() => onMark(attendance?._id, "present", false, item)}
            style={buttonStyle("rgba(52,211,153,0.4)")}
          >
            Present
          </motion.button>

          <motion.button
            onClick={() => onMark(attendance?._id, "absent", false, item)}
            style={buttonStyle("rgba(248,113,113,0.4)")}
          >
            Absent
          </motion.button>

          <motion.button
            onClick={() => onMark(attendance?._id, "cancelled", true, item)}
            style={buttonStyle("rgba(148,163,184,0.35)")}
          >
            Cancelled
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
