import { useRef, ReactNode, MouseEvent } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';

type Props = {
  children: ReactNode;
  className?: string;
  /** Max rotation (deg) on each axis. Default 12. */
  maxTilt?: number;
  /** Enables a glare highlight that follows the cursor. */
  glare?: boolean;
  /** Lift Z on hover (px). */
  lift?: number;
};

/**
 * Mouse-tracking 3D tilt card.
 * Uses Framer Motion springs for buttery interpolation.
 */
export default function Tilt3DCard({
  children,
  className = '',
  maxTilt = 12,
  glare = true,
  lift = 18,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  const rx = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const z  = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const gOpacity = useSpring(useMotionValue(0), { stiffness: 200, damping: 22 });

  const transform = useTransform(
    [rx, ry, z],
    ([x, y, lz]) => `rotateX(${x}deg) rotateY(${y}deg) translateZ(${lz}px)`
  );
  const glareBg = useTransform(
    [gx, gy],
    ([x, y]) =>
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0) 45%)`
  );

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rx.set(((py - 0.5) * -2) * maxTilt);
    ry.set(((px - 0.5) *  2) * maxTilt);
    gx.set(px * 100);
    gy.set(py * 100);
  }
  function handleEnter() {
    z.set(lift);
    gOpacity.set(1);
  }
  function handleLeave() {
    rx.set(0);
    ry.set(0);
    z.set(0);
    gOpacity.set(0);
  }

  return (
    <div
      ref={ref}
      className={`perspective-1500 ${className}`}
      onMouseMove={handleMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <motion.div
        className="preserve-3d relative h-full w-full"
        style={{ transform }}
      >
        {children}
        {glare && (
          <motion.div
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: glareBg, opacity: gOpacity, mixBlendMode: 'overlay' }}
          />
        )}
      </motion.div>
    </div>
  );
}
