import { motion } from 'framer-motion';

export default function ProgressRing({ size = 120, stroke = 10, progress = 0, color }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, progress));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size}>
      <defs>
        <filter id="glowRing">
          <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor={color} floodOpacity="0.7" />
        </filter>
      </defs>

      {/* Static track */}
      <circle
        stroke="rgba(255,255,255,0.08)"
        fill="transparent"
        strokeWidth={stroke}
        r={radius}
        cx={size / 2}
        cy={size / 2}
      />

      {/* Rotated progress arc only */}
      <motion.g
        initial={{ rotate: -90, transformOrigin: '50% 50%' }}
        animate={{ rotate: -90, transformOrigin: '50% 50%' }}
      >
        <motion.circle
          stroke={color}
          fill="transparent"
          strokeWidth={stroke}
          r={radius}
          cx={size / 2}
          cy={size / 2}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ filter: 'url(#glowRing)' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </motion.g>

      {/* Upright text */}
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        fill="#e2e8f0"
        fontSize="20"
        fontWeight="800"
      >
        {Math.round(clamped)}%
      </text>
    </svg>
  );
}