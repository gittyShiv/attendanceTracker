import { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import NavBar from '../components/NavBar';
import api from '../api/axios';
import Modal from '../components/Modal';
import { useAuthGuard } from '../hooks/useAuthGuard';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export default function Timetable() {
  useAuthGuard();
  const [schedule, setSchedule] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [selected, setSelected] = useState(null);

  const refresh = async () => {
    const [s, a] = await Promise.all([api.get('/schedule'), api.get('/attendance')]);
    setSchedule(s.data);
    setAttendance(a.data);
  };

  useEffect(() => {
    refresh();
  }, []);

  const statusFor = (subjectCode, date) => {
    const rec = attendance.find((r) => dayjs(r.date).isSame(date, 'day') && r.subjectCode === subjectCode);
    return rec?.status;
  };

  const weekStart = dayjs().startOf('week').add(1, 'day'); // Monday

  const grid = useMemo(() => {
    return days.map((day, idx) => {
      const classes = schedule.filter((s) => s.day === day);
      return { day, date: weekStart.add(idx, 'day'), classes };
    });
  }, [schedule, weekStart]);

  const mark = async (subjectCode, date, status) => {
    await api.post('/attendance', { subjectCode, status, date });
    setSelected(null);
    await refresh();
  };

  const colorFor = (status) => {
    if (status === 'present') return 'var(--success)';
    if (status === 'absent') return 'var(--danger)';
    if (status === 'cancelled') return 'repeating-linear-gradient(45deg, #475569, #475569 6px, #1f2937 6px, #1f2937 12px)';
    return '#1f2937';
  };

  return (
    <div className="layout">
      <h2>Weekly Timetable</h2>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
        {grid.map((col) => (
          <div key={col.day} className="card">
            <div style={{ fontWeight: 700, marginBottom: 8 }}>{col.day}</div>
            {col.classes.map((cls) => {
              const status = statusFor(cls.subjectCode, col.date);
              return (
                <div
                  key={cls._id + col.date}
                  onClick={() => setSelected({ ...cls, date: col.date })}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 12,
                    background: colorFor(status),
                    marginBottom: 8,
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{cls.subjectCode}</div>
                  <div style={{ fontSize: 12 }}>{cls.startTime} – {cls.endTime}</div>
                  {status && <div style={{ fontSize: 12, textTransform: 'capitalize' }}>{status}</div>}
                </div>
              );
            })}
            {col.classes.length === 0 && <div style={{ color: 'var(--muted)', fontSize: 12 }}>No classes</div>}
          </div>
        ))}
      </div>
      <NavBar />
      <Modal open={!!selected} onClose={() => setSelected(null)} title={`Mark ${selected?.subjectCode || ''}`}>
        {selected && (
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => mark(selected.subjectCode, selected.date, 'present')} style={{ background: 'var(--success)', color: '#0b1220', flex: 1 }}>
              Present
            </button>
            <button onClick={() => mark(selected.subjectCode, selected.date, 'absent')} style={{ background: 'var(--danger)', color: '#0b1220', flex: 1 }}>
              Absent
            </button>
            <button onClick={() => mark(selected.subjectCode, selected.date, 'cancelled')} style={{ background: 'var(--muted)', color: '#0b1220', flex: 1 }}>
              Cancelled
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}