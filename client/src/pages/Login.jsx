import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

export default function Login() {
  const navigate = useNavigate();
  const { user, loading } = useContext(AuthContext);

  useEffect(() => {
    if (!loading && user) navigate('/today');
  }, [loading, user, navigate]);

  const login = () => {
    window.location.href = import.meta.env.VITE_GOOGLE_AUTH_URL;
  };

  return (
    <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', padding: 24 }}>
      <motion.div
        className="card glow-card"
        style={{ width: 'min(440px, 92vw)', textAlign: 'center', padding: 28 }}
        initial={{ y: 20, opacity: 0, scale: 0.97 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
      >
        <h1 style={{ display: 'inline-flex', alignItems: 'center', gap: 12, justifyContent: 'center' }}>
          <img
            src="/icons/attendance.png"   // adjust path if different
            alt="Attendance"
            width={55}
            height={55}
            style={{ display: 'block' }}
          />
          <span>Student Attendance Tracker</span>
        </h1>
        <p style={{ color: 'var(--muted)', marginBottom: 24 }}>
          Stay above 75%.
        </p>
        <motion.button
          onClick={login}
          whileHover={{ scale: 1.02, boxShadow: '0 18px 40px rgba(34,211,238,0.35)' }}
          whileTap={{ scale: 0.98 }}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-2))',
            color: '#0b1220',
            fontWeight: 800,
            padding: '14px 16px',
            boxShadow: '0 12px 30px rgba(34,211,238,0.25)'
          }}
        >
          Sign in with Google
        </motion.button>
      </motion.div>
    </div>
  );
}