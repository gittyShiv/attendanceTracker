import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Toast({ open, message, onClose, tone = 'info', duration = 2800 }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [open, duration, onClose]);

  const colors = {
    info: { bg: 'rgba(34, 211, 238, 0.18)', border: '#22d3ee', text: '#e2e8f0' },
    success: { bg: 'rgba(34, 255, 153, 0.2)', border: '#22ff99', text: '#e2fbea' },
    warn: { bg: 'rgba(251, 146, 60, 0.2)', border: '#fb923c', text: '#ffe8d2' },
    danger: { bg: 'rgba(248, 113, 113, 0.2)', border: '#f87171', text: '#ffe5e5' }
  }[tone] || {};

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          style={{
            position: 'fixed',
            top: 18,
            right: 18,
            zIndex: 9999,
            minWidth: 260,
            padding: '12px 16px',
            borderRadius: 12,
            border: `1px solid ${colors.border}`,
            background: colors.bg,
            color: colors.text,
            boxShadow: '0 12px 40px rgba(0,0,0,0.45), 0 0 24px rgba(34,211,238,0.25)',
            backdropFilter: 'blur(12px)',
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}
          onClick={onClose}
        >
          <div style={{ fontWeight: 700, letterSpacing: '0.01em' }}>Notice</div>
          <div style={{ flex: 1, fontWeight: 500 }}>{message}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}