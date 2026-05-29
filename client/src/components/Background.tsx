import { motion } from 'framer-motion';
import { useMemo } from 'react';

/**
 * Animated crop-themed page background.
 *
 *  - radial gradient field
 *  - soft horizon (rolling hills + furrows)
 *  - drifting sun glow (top-right)
 *  - 14 floating SVG leaves with randomized drift / sway
 *  - ambient parallax dots ("seeds")
 */
type Props = {
  /** Render an extra horizon strip at the bottom */
  showHorizon?: boolean;
  /** Enable the giant golden sun glow in the corner */
  showSun?: boolean;
  className?: string;
};

const LEAF_COUNT = 14;

export default function Background({
  showHorizon = true,
  showSun = true,
  className = '',
}: Props) {
  const leaves = useMemo(
    () =>
      Array.from({ length: LEAF_COUNT }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 14 + Math.random() * 16,
        size: 14 + Math.random() * 22,
        rotate: Math.random() * 360,
        sway: 25 + Math.random() * 60,
        hue: Math.random() > 0.5 ? '#7abe57' : '#458829',
      })),
    []
  );

  const seeds = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 4,
        duration: 6 + Math.random() * 6,
      })),
    []
  );

  return (
    <div
      className={`bg-field absolute inset-0 overflow-hidden pointer-events-none ${
        showHorizon ? 'horizon' : ''
      } ${className}`}
      aria-hidden
    >
      {showSun && <div className="sun-glow" />}

      {/* Floating seeds (ambient particles) */}
      {seeds.map((s) => (
        <motion.span
          key={`seed-${s.id}`}
          className="absolute rounded-full bg-leaf-700/30"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
          }}
          animate={{
            opacity: [0.15, 0.5, 0.15],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Floating leaves */}
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{ left: `${leaf.x}%`, top: '-40px' }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, leaf.sway, -leaf.sway, 0],
            rotate: [leaf.rotate, leaf.rotate + 360],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <Leaf size={leaf.size} color={leaf.hue} />
        </motion.div>
      ))}
    </div>
  );
}

/* simple leaf SVG */
function Leaf({ size, color }: { size: number; color: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))', opacity: 0.85 }}
    >
      <path
        d="M3 21c0-9 6-17 18-18-1 12-9 18-18 18z"
        fill={color}
      />
      <path d="M3 21C9 15 14 9 21 3" stroke="#27451c" strokeWidth="0.8" strokeLinecap="round" opacity="0.4" />
    </svg>
  );
}
