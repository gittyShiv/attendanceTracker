import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

const tabs = [
  { to: '/today', label: 'Today', icon: '📅' },
  { to: '/timetable', label: 'Timetable', icon: '🗓️' },
  { to: '/stats', label: 'Stats', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' }
];

export default function NavBar() {
  return (
    <div className="bottom-nav">
      {tabs.map((t) => (
        <NavLink key={t.to} to={t.to} className={({ isActive }) => `nav-btn ${isActive ? 'active' : ''}`}>
          {({ isActive }) => (
            <motion.div
              whileHover={{ y: -2, scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}
            >
              <span style={{ fontSize: 18 }}>{t.icon}</span>
              <span>{t.label}</span>
              {isActive && (
                <motion.div
                  layoutId="nav-underline"
                  style={{ width: 24, height: 3, borderRadius: 999, background: 'var(--accent)' }}
                />
              )}
            </motion.div>
          )}
        </NavLink>
      ))}
    </div>
  );
}