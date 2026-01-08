import { useEffect, useMemo, useState } from "react";
import dayjs from "dayjs";
import isoWeek from "dayjs/plugin/isoWeek";
import NavBar from "../components/NavBar";
import api from "../api/axios";
import Modal from "../components/Modal";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { getCached, setCached } from "../utils/pageCache";

dayjs.extend(isoWeek);

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function Timetable() {
  useAuthGuard();

  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selected, setSelected] = useState(null);

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

    const payload = { schedule: s.data, attendance: a.data };
    setSchedule(payload.schedule);
    setAttendance(payload.attendance);
    setCached(cacheKey, payload);
  };

  useEffect(() => {
    refresh();
    refresh(true);
  }, []);

  // ✅ FIXED: ISO week (Monday anchored)
  const weekStart = dayjs().startOf("isoWeek");

  const grid = useMemo(() => {
    return days.map((day, idx) => {
      const classes = schedule.filter((s) => s.day === day);
      return {
        day,
        date: weekStart.add(idx, "day"),
        classes
      };
    });
  }, [schedule, weekStart]);

  const attendanceFor = (cls, date) =>
    attendance.find(
      (a) =>
        a.subjectCode === cls.subjectCode &&
        a.startTime === cls.startTime &&
        dayjs(a.date).isSame(date, "day")
    );

  const mark = async (attendanceId, status) => {
    await api.patch(`/attendance/${attendanceId}`, { status });
    setSelected(null);
    await refresh(true);
  };

  return (
    <div className="layout">
      <h2>Weekly Timetable</h2>

      <div className="grid">
        {grid.map((col) => (
          <div key={col.day} className="card">
            <div style={{ fontWeight: 700 }}>{col.day}</div>

            {col.classes.map((cls) => {
              const rec = attendanceFor(cls, col.date);

              return (
                <div
                  key={`${cls._id}-${col.date}`}
                  onClick={() =>
                    setSelected({ attendance: rec, cls })
                  }
                >
                  {cls.subjectCode}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <NavBar />

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={`Mark ${selected?.cls.subjectCode}`}
      >
        {selected?.attendance && (
          <>
            <button onClick={() => mark(selected.attendance._id, "present")}>
              Present
            </button>
            <button onClick={() => mark(selected.attendance._id, "absent")}>
              Absent
            </button>
            <button onClick={() => mark(selected.attendance._id, "cancelled")}>
              Cancelled
            </button>
          </>
        )}
      </Modal>
    </div>
  );
}
