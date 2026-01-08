import { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import api from "../api/axios";
import TodayCard from "../components/TodayCard";
import Modal from "../components/Modal";
import { useAuthGuard } from "../hooks/useAuthGuard";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { getCached, setCached } from "../utils/pageCache";

export default function Today() {
  useAuthGuard();

  const [today, setToday] = useState({
    day: "",
    date: null,
    schedule: [],
    extras: [],
    all: []
  });

  const [attendance, setAttendance] = useState([]);
  const [subjectStats, setSubjectStats] = useState([]);
  const [noteModal, setNoteModal] = useState({
    open: false,
    attendance: null
  });

  const fetchAll = async (background = false) => {
    const cacheKey = "today_page";

    if (!background) {
      const cached = getCached(cacheKey);
      if (cached) {
        setToday(cached.today);
        setAttendance(cached.attendance);
        setSubjectStats(cached.subjectStats);
        return;
      }
    }

    const [t, att, stats] = await Promise.all([
      api.get("/schedule/today"),
      api.get("/attendance"),
      api.get("/analytics/subject")
    ]);

    const merged = [...(t.data.schedule || []), ...(t.data.extras || [])];

    const payload = {
      today: { ...t.data, all: merged },
      attendance: att.data,
      subjectStats: stats.data
    };

    setToday(payload.today);
    setAttendance(payload.attendance);
    setSubjectStats(payload.subjectStats);
    setCached(cacheKey, payload);
  };

  useEffect(() => {
    fetchAll();
    fetchAll(true);
  }, []);

  /**
   * 🔑 Find exact attendance record for TODAY + subject + startTime
   */
  const attendanceFor = (cls) =>
    attendance.find(
      (a) =>
        a.subjectCode === cls.subjectCode &&
        a.startTime === cls.startTime &&
        dayjs(a.date).isSame(dayjs(), "day")
    );

  /**
   * 🔑 CREATE or UPDATE attendance safely
   */
  const mark = async (attendanceId, status, askNote = false, item) => {
    // First-time mark → CREATE
    if (!attendanceId) {
      await api.post("/attendance", {
        subjectCode: item.subjectCode,
        status,
        startTime: item.startTime
      });
      return fetchAll(true);
    }

    // Update with note
    if (askNote) {
      const rec = attendance.find((a) => a._id === attendanceId);
      setNoteModal({ open: true, attendance: rec });
      return;
    }

    // Normal update
    await api.patch(`/attendance/${attendanceId}`, { status });
    await fetchAll(true);
  };

  const submitNote = async (note) => {
    await api.patch(`/attendance/${noteModal.attendance._id}`, {
      status: "cancelled",
      note
    });
    setNoteModal({ open: false, attendance: null });
    await fetchAll(true);
  };

  const scheduleWithPct = (today.all || []).map((c) => {
    const s = subjectStats.find((p) => p.subjectCode === c.subjectCode);
    return {
      ...c,
      percentage: s?.percentage ?? 100,
      attendance: attendanceFor(c)
    };
  });

  return (
    <div className="layout">
      <motion.h2 initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
        Today · {today.day}
      </motion.h2>

      <div className="grid">
        {scheduleWithPct.map((item, idx) => (
          <motion.div
            key={`${item.subjectCode}-${item.startTime}-${idx}`}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: idx * 0.05 }}
          >
            <TodayCard
              item={item}
              attendance={item.attendance}
              onMark={mark}
            />
          </motion.div>
        ))}
      </div>

      <NavBar />

      <Modal
        open={noteModal.open}
        onClose={() => setNoteModal({ open: false, attendance: null })}
        title="Add note for cancelled class"
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            submitNote(e.target.note.value);
          }}
        >
          <textarea
            name="note"
            rows={3}
            style={{ width: "100%" }}
            placeholder="Reason (optional)"
          />
          <div style={{ marginTop: 12, textAlign: "right" }}>
            <button type="submit">Save</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
