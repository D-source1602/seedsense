import { motion } from 'framer-motion';

type Props = {
  size?: number;
  withText?: boolean;
  variant?: 'light' | 'dark';
};

/**
 * Animated SeedSense logo — a sprouting leaf inside a glowing 3D-feeling badge.
 */
export default function Logo({ size = 32, withText = true, variant = 'light' }: Props) {
  const textColor = variant === 'light' ? 'text-leaf-50' : 'text-leaf-900';

  return (
    <div className="flex items-center gap-2 select-none">
      <motion.div
        initial={{ rotate: -10, scale: 0.9 }}
        animate={{ rotate: 0, scale: 1 }}
        whileHover={{ rotate: 6, scale: 1.08 }}
        transition={{ type: 'spring', stiffness: 220, damping: 14 }}
        className="relative grid place-items-center rounded-xl shadow-glow"
        style={{
          width: size + 14,
          height: size + 14,
          background:
            'linear-gradient(135deg, #6cdc88 0%, #22a04a 55%, #0a2e19 100%)',
        }}
      >
        {/* glossy reflection */}
        <span
          className="pointer-events-none absolute inset-0 rounded-xl"
          style={{
            background:
              'linear-gradient(160deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0) 35%)',
          }}
        />
        <svg viewBox="0 0 24 24" width={size} height={size} fill="none" className="relative z-10">
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
          className="absolute inset-0 rounded-xl"
          animate={{
            boxShadow: [
              '0 0 0 0 rgba(252,201,69,0)',
              '0 0 0 6px rgba(252,201,69,0.35)',
              '0 0 0 12px rgba(252,201,69,0)',
            ],
          }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {withText && (
        <span className={`font-display text-xl font-bold tracking-tight ${textColor}`}>
          Seed
          <span className="bg-gradient-to-r from-wheat-300 to-saffron-400 bg-clip-text text-transparent">
            Sense
          </span>
        </span>
      )}
    </div>
  );
}
