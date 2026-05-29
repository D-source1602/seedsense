import { motion } from 'framer-motion';

type Props = {
  size?: number;
  withText?: boolean;
  variant?: 'light' | 'dark';
};

/**
 * Animated SeedSense logo — a sprouting leaf inside a circular ring.
 * Used in headers and the hero panel.
 */
export default function Logo({ size = 32, withText = true, variant = 'dark' }: Props) {
  const textColor = variant === 'light' ? 'text-white' : 'text-leaf-800';

  return (
    <div className="flex items-center gap-2 select-none">
      <motion.div
        initial={{ rotate: -10, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        whileHover={{ rotate: 6, scale: 1.05 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className="relative grid place-items-center rounded-xl bg-gradient-to-br from-leaf-400 to-leaf-700 shadow-leaf"
        style={{ width: size + 12, height: size + 12 }}
      >
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none">
          <path
            d="M12 22V10M12 10C8 10 5 7 5 3c4 0 7 3 7 7zM12 10c4 0 7-3 7-7-4 0-7 3-7 7z"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        {/* gold pulse ring */}
        <motion.span
          className="absolute inset-0 rounded-xl border-2 border-wheat-300/0"
          animate={{ borderColor: ['rgba(252,201,69,0)', 'rgba(252,201,69,0.7)', 'rgba(252,201,69,0)'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {withText && (
        <span className={`font-display text-xl font-bold tracking-tight ${textColor}`}>
          Seed<span className="text-wheat-500">Sense</span>
        </span>
      )}
    </div>
  );
}
