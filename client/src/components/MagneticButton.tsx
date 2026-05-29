import { useRef, ReactNode, MouseEvent, ButtonHTMLAttributes } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  /** How strongly the button is pulled toward the cursor (0–1). Default 0.3. */
  strength?: number;
};

/**
 * Magnetic button — gently follows the cursor when hovered.
 */
export default function MagneticButton({
  children,
  strength = 0.3,
  className = '',
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });
  const y = useSpring(useMotionValue(0), { stiffness: 220, damping: 18 });

  function handleMove(e: MouseEvent<HTMLButtonElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width  / 2;
    const cy = rect.top  + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  }
  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={className}
      whileTap={{ scale: 0.96 }}
      {...(rest as any)}
    >
      {children}
    </motion.button>
  );
}
