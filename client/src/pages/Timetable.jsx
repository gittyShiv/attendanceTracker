import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import NavBar from "../components/NavBar";
import api from "../api/axios";
import Modal from "../components/Modal";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { getCached, setCached } from "../utils/pageCache";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Timetable() {
  useAuthGuard();

  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selected, setSelected] = useState(null);

  // -------------------------
  // Fetch data
  // -------------------------
  const refresh = async (background = false) => {
    const cacheKey = "timetable_page";

    if (!background) {
      const cached = getCached(cacheKey);
      if (cached) {
        setSchedule(cached.schedule);
        setAttendance(cached.attendance);
        return;
      }
    }

    const [s, a] = await Promise.all([
      api.get("/schedule"),
      api.get("/attendance")
    ]);

    const payload = {
      schedule: s.data,
      attendance: a.data
    };

    setSchedule(payload.schedule);
    setAttendance(payload.attendance);
    setCached(cacheKey, payload);
  };

  useEffect(() => {
    refresh();
    refresh(true);
  }, []);

  // -------------------------
  // Week calculation (SAFE)
  // -------------------------
  const weekStart = dayjs().startOf("week").add(1, "day"); // Monday

  const grid = useMemo(() => {
    return days.map((day, idx) => {
      const classes = schedule.filter((s) => s.day === day);
      return {
        day,
        date: dayjs(weekStart).add(idx, "day"), // CLONE (no mutation)
        classes
      };
    });
  }, [schedule, weekStart]);

  // -------------------------
  // 🔑 ATTENDANCE LOOKUP MAP
  // -------------------------
  const attendanceMap = useMemo(() => {
    const map = new Map();
    attendance.forEach((a) => {
      const key = `${a.subjectCode}|${a.startTime}|${dayjs(a.date).format(
        "YYYY-MM-DD"
      )}`;
      map.set(key, a);
    });
    return map;
  }, [attendance]);

  // -------------------------
  // 🔑 EXACT MATCH (NO find())
  // -------------------------
  const attendanceFor = (cls, date) => {
    const key = `${cls.subjectCode}|${cls.startTime}|${dayjs(date).format(
      "YYYY-MM-DD"
    )}`;
    return attendanceMap.get(key);
  };

  // -------------------------
  // Update attendance
  // -------------------------
  const mark = async (attendanceId, status) => {
    if (!attendanceId) return;
    await api.patch(`/attendance/${attendanceId}`, { status });
    setSelected(null);
    await refresh(true);
  };

  // -------------------------
  // UI helpers
  // -------------------------
  const colorFor = (status) => {
    if (status === "present") return "var(--success)";
    if (status === "absent") return "var(--danger)";
    if (status === "cancelled")
      return "repeating-linear-gradient(45deg,#475569,#475569 6px,#1f2937 6px,#1f2937 12px)";
    return "#1f2937";
  };

  return (
    <div className="layout">
      <h2>Weekly Timetable</h2>

      <div
        className="grid"
        style={{ gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))" }}
      >
        {grid.map((col) => (
          <div key={col.day} className="card">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>
              {col.day}
            </div>

            {col.classes.map((cls) => {
              const rec = attendanceFor(cls, col.date);

              return (
                <div
                  key={`${cls._id}-${col.date}`}
                  onClick={() =>
                    setSelected({
                      cls,
                      attendance: rec
                    })
                  }
                  style={{
                    padding: "10px 12px",
                    borderRadius: 12,
                    background: colorFor(rec?.status),
                    marginBottom: 8,
                    cursor: rec ? "pointer" : "default"
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{cls.subjectCode}</div>
                  <div style={{ fontSize: 12 }}>
                    {cls.startTime} – {cls.endTime}
                  </div>
                  {rec?.status && (
                    <div
                      style={{
                        fontSize: 12,
                        textTransform: "capitalize"
                      }}
                    >
                      {rec.status}
                    </div>
                  )}
                </div>
              );
            })}

            {col.classes.length === 0 && (
              <div style={{ color: "var(--muted)", fontSize: 12 }}>
                No classes
              </div>
            )}
          </div>
        ))}
      </div>

      <NavBar />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Mark ${selected?.cls?.subjectCode || ""}`}
      >
        {selected?.attendance && (
          <div style={{ display: "flex", gap: 8 }}>
            <button
              onClick={() =>
                mark(selected.attendance._id, "present")
              }
              style={{
                background: "var(--success)",
                color: "#0b1220",
                flex: 1
              }}
            >
              Present
            </button>

            <button
              onClick={() =>
                mark(selected.attendance._id, "absent")
              }
              style={{
                background: "var(--danger)",
                color: "#0b1220",
                flex: 1
              }}
            >
              Absent
            </button>

            <button
              onClick={() =>
                mark(selected.attendance._id, "cancelled")
              }
              style={{
                background: "var(--muted)",
                color: "#0b1220",
                flex: 1
              }}
            >
              Cancelled
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
