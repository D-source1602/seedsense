import { useRef, ReactNode, MouseEvent, CSSProperties } from 'react';

type Props = {
  children: ReactNode;
  className?: string;
  /** Adds an animated rim-light edge. */
  rim?: boolean;
  /** Disables the cursor-follow specular highlight. */
  noSpecular?: boolean;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'aside';
};

/**
 * Liquid glass surface — frosted, multi-layered glass with:
 *   - inner rim highlight (top edge)
 *   - cursor-follow specular bloom
 *   - animated diagonal sheen (CSS, see .liquid-glass)
 *   - inner soft shadow at the bottom
 *
 * Pair with `.liquid-glass` utility for the base styling.
 */
export default function LiquidGlass({
  children,
  className = '',
  rim = true,
  noSpecular = false,
  style,
  as = 'div',
}: Props) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMove(e: MouseEvent<HTMLDivElement>) {
    if (noSpecular) return;
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const x = ((e.clientX - r.left) / r.width)  * 100;
    const y = ((e.clientY - r.top)  / r.height) * 100;
    ref.current!.style.setProperty('--x', `${x}%`);
    ref.current!.style.setProperty('--y', `${y}%`);
  }

  const Tag = as as 'div';
  return (
    <Tag
      ref={ref as any}
      onMouseMove={handleMove}
      className={`liquid-glass ${className}`}
      style={style}
    >
      {!noSpecular && <span className="specular" aria-hidden />}
      {rim && <span className="rim-light" aria-hidden />}
      {children}
    </Tag>
  );
}
