import { motion } from "framer-motion";

export default function TodayCard({ item, attendance, onMark }) {
  const status = attendance?.status;
  const hasStatus = Boolean(status);
  const pct = item.percentage ?? 100;
  const pctColor =
    pct < 65 ? "var(--danger)" : pct < 75 ? "var(--warn)" : "var(--success)";
  const isExtra = item.type === "Extra";

  const buttonStyle = (bg, shadow) => ({
    background: bg,
    color: "#0b1220",
    boxShadow: hasStatus ? "none" : shadow,
    opacity: hasStatus ? 0.5 : 1,
    filter: hasStatus ? "saturate(0.7)" : "none"
  });

  return (
    <motion.div
      className="card glow-card"
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "center",
        justifyContent: "space-between"
      }}
    >
      <div>
        <div style={{ fontWeight: 700, fontSize: 16 }}>
          {item.subjectCode}
        </div>

        <div style={{ color: "var(--muted)", fontSize: 13 }}>
          {item.startTime} – {item.endTime} · {item.location}
        </div>
      </div>

      <div style={{ textAlign: "right", minWidth: 180 }}>
        <div style={{ color: pctColor, fontWeight: 800, fontSize: 18 }}>
          {Math.round(pct)}%
        </div>

        <div style={{ display: "flex", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
          <motion.button
            disabled={!attendance}
            onClick={() => onMark(attendance._id, "present")}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle(
              "linear-gradient(135deg, rgba(52,211,153,0.4), rgba(16,185,129,0.35))",
              "0 10px 30px rgba(52,211,153,0.25)"
            )}
          >
            ✅ Present
          </motion.button>

          <motion.button
            disabled={!attendance}
            onClick={() => onMark(attendance._id, "absent")}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle(
              "linear-gradient(135deg, rgba(248,113,113,0.4), rgba(239,68,68,0.35))",
              "0 10px 30px rgba(248,113,113,0.25)"
            )}
          >
            ❌ Absent
          </motion.button>

          <motion.button
            disabled={!attendance}
            onClick={() => onMark(attendance._id, "cancelled", true)}
            whileTap={{ scale: 0.96 }}
            style={buttonStyle(
              "linear-gradient(135deg, rgba(148,163,184,0.35), rgba(100,116,139,0.35))",
              "0 10px 30px rgba(148,163,184,0.2)"
            )}
          >
            ⏸ Cancelled
          </motion.button>
        </div>

        {status && (
          <div
            style={{
              marginTop: 6,
              color: "var(--muted)",
              fontSize: 12,
              textTransform: "capitalize"
            }}
          >
            Marked {status}
          </div>
        )}
      </div>
    </motion.div>
  );
}
