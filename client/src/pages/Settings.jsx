import { useContext, useState } from 'react';
import dayjs from 'dayjs';
import NavBar from '../components/NavBar';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { useAuthGuard } from '../hooks/useAuthGuard';
import { useToast } from '../hooks/useToast';
import Toast from '../components/Toast';

export default function Settings() {
  useAuthGuard();
  const { user, logout } = useContext(AuthContext);
  const [festLoading, setFestLoading] = useState(false);
  const [extraLoading, setExtraLoading] = useState(false);
  const [extraForm, setExtraForm] = useState({
    subjectCode: '',
    date: dayjs().format('YYYY-MM-DD')
  });

  const { toast, showToast, closeToast } = useToast();

  const festMode = async () => {
    try {
      setFestLoading(true);
      await api.post('/attendance/fest-mode', {});
      showToast('Holiday mode applied for today (all classes cancelled).', 'success');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to apply Holiday mode', 'danger');
    } finally {
      setFestLoading(false);
    }
  };

  const exportCsv = async () => {
    try {
      const res = await api.get('/attendance/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance.csv';
      a.click();
      showToast('Exported CSV successfully.', 'success');
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to export CSV', 'danger');
    }
  };

  const addExtra = async (e) => {
    e.preventDefault();
    setExtraLoading(true);
    try {
      await api.post('/schedule/extra', {
        subjectCode: extraForm.subjectCode,
        subjectName: extraForm.subjectCode, // reuse code as name
        date: extraForm.date,
        startTime: '15:00', // default
        endTime: '16:00',   // default
        location: 'TBD',
        type: 'Extra'
      });
      showToast(`Extra class added for ${extraForm.date}`, 'info');
      setExtraForm((f) => ({ ...f, subjectCode: '' }));
    } catch (err) {
      showToast(err?.response?.data?.message || 'Failed to add extra class', 'danger');
    } finally {
      setExtraLoading(false);
    }
  };

  return (
    <div className="layout">
      <h2>Settings</h2>

      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <img src={user?.avatar} alt="" width={48} height={48} style={{ borderRadius: '50%' }} />
        <div>
          <div style={{ fontWeight: 700 }}>{user?.name}</div>
          <div style={{ color: 'var(--muted)', fontSize: 13 }}>{user?.email}</div>
        </div>
      </div>

      <div className="grid" style={{ marginTop: 12 }}>
        <button
          onClick={festMode}
          style={{ background: 'var(--accent)', color: '#0b1220', padding: 14 }}
          disabled={festLoading}
        >
          {festLoading ? 'Applying...' : 'Holiday (Cancel all today)'}
        </button>

        <button
          onClick={exportCsv}
          style={{ background: 'var(--card)', color: 'var(--text)', border: '1px solid #1f2937', padding: 14 }}
        >
          Export CSV
        </button>

        <button
          onClick={logout}
          style={{ background: 'var(--danger)', color: '#0b1220', padding: 14 }}
        >
          Logout
        </button>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <h3>Add Extra Class</h3>
        <form
          onSubmit={addExtra}
          className="grid"
          style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px,1fr))', gap: 10 }}
        >
          <input
            required
            placeholder="Subject Code"
            value={extraForm.subjectCode}
            onChange={(e) => setExtraForm({ ...extraForm, subjectCode: e.target.value })}
          />
          <input
            type="date"
            required
            value={extraForm.date}
            onChange={(e) => setExtraForm({ ...extraForm, date: e.target.value })}
          />
          <button
            type="submit"
            style={{ background: 'var(--accent)', color: '#0b1220', fontWeight: 700 }}
            disabled={extraLoading}
          >
            {extraLoading ? 'Adding…' : 'Add Extra'}
          </button>
        </form>
      </div>

      <Toast open={toast.open} message={toast.message} tone={toast.tone} onClose={closeToast} />
      <NavBar />
    </div>
  );
}