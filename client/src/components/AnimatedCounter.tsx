import { useEffect, useState } from 'react';

type Props = {
  value: number;
  duration?: number;
  formatter?: (n: number) => string;
};

/**
 * Eases a number from previous → next when `value` changes.
 */
export default function AnimatedCounter({
  value,
  duration = 900,
  formatter = (n) => Math.round(n).toLocaleString('en-IN'),
}: Props) {
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    const start = display;
    const delta = value - start;
    if (delta === 0) return;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min((t - t0) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(start + delta * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, duration]);

  return <>{formatter(display)}</>;
}
