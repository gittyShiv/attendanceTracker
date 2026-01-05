import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';
import api from '../api/axios';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { getCached, setCached } from '../utils/pageCache';


export default function Summary() {
  useAuthGuard();
  const [summary, setSummary] = useState(null);

const fetchSummary = async (background = false) => {
  const cacheKey = 'summary_page';

  if (!background) {
    const cached = getCached(cacheKey);
    if (cached) {
      setSummary(cached);
      return;
    }
  }

  const res = await api.get('/analytics/summary');
  setSummary(res.data);
  setCached(cacheKey, res.data);
};

useEffect(() => {
  fetchSummary();        // instant if cached
  fetchSummary(true);    // silent refresh
}, []);


  if (!summary) return <div className="layout">Loading...</div>;

  return (
    <div className="layout">
      <h2>Semester Summary</h2>
      <div className="card" style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 28, fontWeight: 800 }}>{summary.overall.toFixed(1)}%</div>
        <div style={{ color: 'var(--muted)' }}>Overall attendance</div>
        <div style={{ marginTop: 8, color: 'var(--muted)' }}>Worst day: {summary.worstDay || 'N/A'}</div>
      </div>
      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>At Risk (&lt;75%)</div>
          {summary.atRisk.map((s) => (
            <div key={s.subjectCode}>{s.subjectCode} · {s.percentage.toFixed(1)}%</div>
          ))}
          {summary.atRisk.length === 0 && <div style={{ color: 'var(--muted)' }}>None 🎉</div>}
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Safe</div>
          {summary.safe.map((s) => (
            <div key={s.subjectCode}>{s.subjectCode} · {s.percentage.toFixed(1)}%</div>
          ))}
          {summary.safe.length === 0 && <div style={{ color: 'var(--muted)' }}>No data</div>}
        </div>
      </div>
      <NavBar />
    </div>
  );
}