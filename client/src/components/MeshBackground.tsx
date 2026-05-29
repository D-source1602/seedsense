import { useMemo } from 'react';
import { motion } from 'framer-motion';

/**
 * Animated mesh-gradient background for the dark theme.
 *
 *  - 4 large blurred orbs that drift, scale, and morph
 *  - Subtle film-grain overlay
 *  - Optional twinkling stars (top-right corner depth)
 *  - Optional rising particles (light embers / pollen)
 */
type Props = {
  showStars?: boolean;
  showEmbers?: boolean;
  className?: string;
};

const ORBS = [
  { color: '34, 160, 74',  size: 520, x: '5%',  y: '12%',  delay: 0    },
  { color: '132, 204, 22', size: 440, x: '78%', y: '8%',   delay: 6    },
  { color: '249, 115, 22', size: 380, x: '50%', y: '88%',  delay: 12   },
  { color: '252, 217, 69', size: 360, x: '88%', y: '70%',  delay: 4    },
];

export default function MeshBackground({
  showStars = true,
  showEmbers = true,
  className = '',
}: Props) {
  const stars = useMemo(
    () =>
      Array.from({ length: 50 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 4,
        duration: 2.5 + Math.random() * 4,
      })),
    []
  );

  const embers = useMemo(
    () =>
      Array.from({ length: 16 }).map((_, i) => ({
        id: i,
        x: Math.random() * 100,
        size: 2 + Math.random() * 3,
        delay: Math.random() * 12,
        duration: 14 + Math.random() * 10,
        hue: Math.random() > 0.5 ? '163, 230, 53' : '252, 217, 69',
      })),
    []
  );

  return (
    <div
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Dark base */}
      <div className="absolute inset-0 bg-forest-night" />

      {/* Drifting orbs */}
      {ORBS.map((o, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: o.size,
            height: o.size,
            left: o.x,
            top: o.y,
            transform: 'translate(-50%, -50%)',
            background: `radial-gradient(circle, rgba(${o.color}, 0.55) 0%, rgba(${o.color}, 0) 65%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, 60, -40, 0],
            y: [0, -50, 40, 0],
            scale: [1, 1.15, 0.92, 1],
          }}
          transition={{
            duration: 20 + i * 2,
            delay: o.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Twinkling stars (back layer) */}
      {showStars &&
        stars.map((s) => (
          <motion.span
            key={`star-${s.id}`}
            className="absolute rounded-full bg-lime-400"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              width: s.size,
              height: s.size,
              boxShadow: '0 0 6px rgba(163, 230, 53, 0.8)',
            }}
            animate={{ opacity: [0.15, 1, 0.15], scale: [1, 1.5, 1] }}
            transition={{
              duration: s.duration,
              delay: s.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Rising embers / pollen */}
      {showEmbers &&
        embers.map((e) => (
          <motion.span
            key={`ember-${e.id}`}
            className="absolute rounded-full"
            style={{
              left: `${e.x}%`,
              bottom: '-10px',
              width: e.size,
              height: e.size,
              background: `rgba(${e.hue}, 0.85)`,
              boxShadow: `0 0 ${e.size * 4}px rgba(${e.hue}, 0.6)`,
            }}
            animate={{
              y: [0, -window.innerHeight * 1.1],
              x: [0, 40, -30, 20, 0],
              opacity: [0, 0.9, 0.9, 0],
            }}
            transition={{
              duration: e.duration,
              delay: e.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}

      {/* Film grain overlay */}
      <div className="noise" />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 50%, rgba(2, 10, 5, 0.65) 100%)',
        }}
      />
    </div>
  );
}
