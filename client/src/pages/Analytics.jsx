import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../api/axios';
import ProgressRing from '../components/ProgressRing';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { getCached, setCached } from '../utils/pageCache';


export default function Analytics() {
  useAuthGuard();
  const [subjects, setSubjects] = useState([]);

  const fetchAnalytics = async (background = false) => {
  const cacheKey = 'analytics_page';

  if (!background) {
    const cached = getCached(cacheKey);
    if (cached) {
      setSubjects(cached);
      return;
    }
  }

  const res = await api.get('/analytics/subject');
  setSubjects(res.data);
  setCached(cacheKey, res.data);
};

useEffect(() => {
  fetchAnalytics();       // instant if cached
  fetchAnalytics(true);   // silent refresh
}, []);


  const color = (p) => (p < 65 ? '#ff5f5f' : p < 75 ? '#ffb347' : '#22ff99');
  const statusText = (p, classesNeeded) =>
    p < 75 ? `Attend next ${Math.max(1, classesNeeded)} class${classesNeeded > 1 ? 'es' : ''} continuously!` : 'Safe';

  return (
    <div className="layout">
      <h2>Subject Analytics</h2>
      <div className="analytics-grid">
        {subjects.map((s) => (
          <div key={s.subjectCode} className="card analytics-card" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{s.subjectCode}</div>
            </div>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <ProgressRing progress={s.percentage} color={color(s.percentage)} size={140} stroke={12} />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, marginBottom: 4 }}>{s.subjectName || s.subjectCode}</div>
                <div style={{ color: 'var(--muted)', fontSize: 13 }}>
                  Attended {s.attended} / {s.held} · Cancelled {s.cancelled}
                </div>
                <div style={{ marginTop: 6, color: color(s.percentage), fontWeight: 800 }}>
                  {statusText(s.percentage, s.classesNeeded)}
                </div>
                <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
                  Current streak: <span style={{ color: '#22ff99' }}>{s.streak}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {subjects.length === 0 && <div className="card analytics-card">No data yet</div>}
      </div>
      <NavBar />
    </div>
  );
}