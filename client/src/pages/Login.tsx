import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles,
  Sprout,
  Zap,
} from 'lucide-react';

import Logo from '../components/Logo';
import MeshBackground from '../components/MeshBackground';
import Tilt3DCard from '../components/Tilt3DCard';
import MagneticButton from '../components/MagneticButton';

/* same client_id as the legacy index.html */
const GOOGLE_CLIENT_ID =
  '601281173121-33oecc3bbulc9uhr83dn7itlmv0jilh1.apps.googleusercontent.com';

const HERO_TAGS = [
  { icon: <Sparkles size={11} />, label: 'AI-Powered' },
  { icon: '🌍', label: '36 States & UTs' },
  { icon: <Zap size={11} />,    label: 'Climate-Aware' },
  { icon: '💹', label: 'Live Mandi Prices' },
];

const TITLE_LINES = [
  { text: 'Grow Smarter.', accent: false },
  { text: 'Harvest More.',  accent: true  },
  { text: 'Profit.',        accent: false },
];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ── Mouse parallax for the hero panel ─────────────────── */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const heroX = useTransform(sx, (v) => `${v * 14}px`);
  const heroY = useTransform(sy, (v) => `${v * 14}px`);
  const farX  = useTransform(sx, (v) => `${v * 6}px`);
  const farY  = useTransform(sy, (v) => `${v * 6}px`);

  function handleHeroMove(e: React.MouseEvent<HTMLDivElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width  - 0.5);
    my.set((e.clientY - r.top)  / r.height - 0.5);
  }

  /* ── Google Sign-In bootstrap ─────────────────────────── */
  useEffect(() => {
    if (!document.getElementById('gsi-client')) {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.id = 'gsi-client';
      document.head.appendChild(s);
    }

    const handleGoogle = (response: { credential: string }) => {
      console.log('Encoded JWT ID token:', response.credential);
      sessionStorage.setItem('seedsense:auth', 'google');
      navigate('/dashboard');
    };
    window.handleCredentialResponse = handleGoogle;

    const tryRender = () => {
      const container = document.getElementById('google-btn-target');
      const gsi = window.google?.accounts?.id;
      if (!container || !gsi) return false;
      container.innerHTML = '';
      gsi.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogle,
        ux_mode: 'popup',
      });
      gsi.renderButton(container, {
        type: 'standard',
        theme: 'filled_black',
        size: 'large',
        text: 'signin_with',
        shape: 'pill',
        width: 320,
      });
      return true;
    };
    if (!tryRender()) {
      const t = setInterval(() => tryRender() && clearInterval(t), 250);
      return () => clearInterval(t);
    }
  }, [navigate]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    sessionStorage.setItem('seedsense:auth', 'email');
    if (remember) sessionStorage.setItem('seedsense:remember', '1');
    setTimeout(() => navigate('/dashboard'), 600);
  }

  return (
    <div
      className="relative min-h-screen overflow-hidden"
      onMouseMove={handleHeroMove}
    >
      <MeshBackground />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="border-glow grid w-full grid-cols-1 overflow-hidden rounded-3xl shadow-3d-lift md:grid-cols-2"
        >
          {/* ───── HERO (LEFT) ───── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-moss-900 via-leaf-900 to-moss-950 p-8 text-white md:p-12 perspective-1500">
            {/* parallax glows */}
            <motion.div
              style={{ x: heroX, y: heroY }}
              className="pointer-events-none absolute -right-12 -top-12 h-72 w-72 rounded-full bg-lime-400/25 blur-3xl"
            />
            <motion.div
              style={{ x: farX, y: farY }}
              className="pointer-events-none absolute -bottom-20 -left-10 h-80 w-80 rounded-full bg-saffron-500/20 blur-3xl"
            />

            {/* Animated grid floor */}
            <div
              className="pointer-events-none absolute bottom-0 left-1/2 h-1/2 w-[200%] -translate-x-1/2"
              style={{
                background:
                  'linear-gradient(rgba(132, 204, 22, 0.18) 1px, transparent 1px), linear-gradient(90deg, rgba(132, 204, 22, 0.18) 1px, transparent 1px)',
                backgroundSize: '50px 50px',
                transform: 'perspective(800px) rotateX(60deg) translateY(40px) translateX(-50%)',
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 80%)',
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0) 80%)',
              }}
            />

            {/* swaying wheat row */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44">
              {[6, 16, 28, 40, 54, 68, 80, 92].map((x, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-2"
                  style={{ left: `${x}%` }}
                  animate={{ rotate: [-5, 5, -5] }}
                  transition={{
                    duration: 4 + i * 0.4,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                >
                  <WheatStalk scale={0.85 + (i % 3) * 0.15} />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <Logo variant="light" />

              {/* Title — letter-by-letter reveal */}
              <h1 className="mt-12 font-display text-4xl font-bold leading-[1.05] md:text-6xl">
                {TITLE_LINES.map((line, li) => (
                  <span key={li} className="block overflow-hidden">
                    <motion.span
                      className="inline-block"
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      transition={{
                        duration: 0.9,
                        delay: 0.25 + li * 0.18,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {line.accent ? (
                        <span className="bg-gradient-to-r from-wheat-300 via-saffron-400 to-wheat-300 bg-[length:200%_100%] bg-clip-text text-transparent animate-gradientPan">
                          {line.text}
                        </span>
                      ) : (
                        line.text
                      )}
                    </motion.span>
                  </span>
                ))}
              </h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 0.7 }}
                className="mt-5 max-w-md text-lg text-leaf-100/85"
              >
                Unlock your land's potential with AI-driven crop recommendations,
                live climate risk insights and real-time mandi prices.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="mt-8 flex flex-wrap gap-2"
              >
                {HERO_TAGS.map((t, i) => (
                  <motion.span
                    key={t.label}
                    whileHover={{ scale: 1.08, y: -2 }}
                    className="pill backdrop-blur-md"
                    style={{ transitionDelay: `${i * 50}ms` }}
                  >
                    {t.icon} {t.label}
                  </motion.span>
                ))}
              </motion.div>

              {/* Stat ribbon */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.7 }}
                className="mt-10 grid grid-cols-3 gap-3"
              >
                <Stat label="Farmers" value="1.2M+" />
                <Stat label="Crops Tracked" value="50+" />
                <Stat label="Accuracy" value="94%" />
              </motion.div>
            </div>
          </div>

          {/* ───── FORM (RIGHT) ───── */}
          <div className="relative bg-moss-950/85 p-8 backdrop-blur-2xl md:p-12">
            {/* subtle inner glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-bl from-lime-400/5 via-transparent to-transparent" />
            <Tilt3DCard maxTilt={3} glare={false} lift={0} className="relative mx-auto w-full max-w-md">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-xs font-semibold text-lime-400">
                    <Sprout size={12} /> Welcome back, farmer
                  </div>
                  <h2 className="font-display text-3xl font-bold text-leaf-50">
                    Step into the
                    <br />
                    <span className="bg-gradient-to-r from-lime-400 to-leaf-300 bg-clip-text text-transparent">
                      Smart Field.
                    </span>
                  </h2>
                  <p className="mt-2 text-sm text-leaf-100/60">
                    AI-powered crop recommendations · made for India 🇮🇳
                  </p>
                </motion.div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                  <FloatingField
                    icon={<Mail size={18} />}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder="Email"
                    required
                  />

                  <FloatingField
                    icon={<Lock size={18} />}
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={setPassword}
                    placeholder="Password"
                    required
                    rightIcon={
                      <button
                        type="button"
                        onClick={() => setShowPassword((v) => !v)}
                        className="rounded p-1 text-leaf-100/50 hover:text-lime-400 transition"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    }
                  />

                  <div className="flex items-center justify-between text-sm">
                    <label className="flex cursor-pointer items-center gap-2 text-leaf-100/70">
                      <input
                        type="checkbox"
                        checked={remember}
                        onChange={(e) => setRemember(e.target.checked)}
                        className="h-4 w-4 rounded border-leaf-500/30 bg-moss-950 text-lime-400 focus:ring-lime-400/40"
                      />
                      Remember for 30 days
                    </label>
                    <a
                      href="#forgot"
                      className="font-semibold text-lime-400 hover:text-lime-500"
                    >
                      Forgot password?
                    </a>
                  </div>

                  <MagneticButton
                    type="submit"
                    disabled={submitting}
                    className="btn-primary w-full"
                  >
                    <span>{submitting ? 'Sprouting…' : 'Sign Up'}</span>
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-leaf-950 text-wheat-300">
                      <ArrowRight size={16} />
                    </span>
                  </MagneticButton>
                </form>

                <p className="mt-5 text-center text-sm text-leaf-100/60">
                  Already have an account?{' '}
                  <a href="#login" className="font-semibold text-lime-400 hover:text-lime-500">
                    Login
                  </a>
                </p>

                <div className="seed-divider">or continue with</div>

                <div className="flex justify-center" id="google-btn-target" />
              </div>
            </Tilt3DCard>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── helpers ───────────────────────────────────────────── */

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-leaf-500/15 bg-moss-950/40 px-3 py-2 backdrop-blur">
      <div className="font-display text-xl font-bold text-lime-400">{value}</div>
      <div className="text-[11px] uppercase tracking-wider text-leaf-100/50">
        {label}
      </div>
    </div>
  );
}

function FloatingField(props: {
  icon: React.ReactNode;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  required?: boolean;
  rightIcon?: React.ReactNode;
}) {
  return (
    <div className="group relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-100/50 transition group-focus-within:text-lime-400">
        {props.icon}
      </span>
      <input
        type={props.type}
        required={props.required}
        className="input-field pl-11 pr-11"
        placeholder={props.placeholder}
        value={props.value}
        onChange={(e) => props.onChange(e.target.value)}
      />
      {props.rightIcon && (
        <span className="absolute right-3 top-1/2 -translate-y-1/2">
          {props.rightIcon}
        </span>
      )}
    </div>
  );
}

function WheatStalk({ scale = 1 }: { scale?: number }) {
  return (
    <svg
      width="22"
      height="80"
      viewBox="0 0 22 80"
      fill="none"
      style={{
        transform: `scale(${scale})`,
        filter: 'drop-shadow(0 0 8px rgba(252, 217, 69, 0.45))',
      }}
    >
      <path d="M11 80 V20" stroke="#fbc945" strokeWidth="1.5" strokeLinecap="round" />
      {[60, 50, 40, 30, 22].map((y, i) => (
        <ellipse
          key={i}
          cx={i % 2 ? 6 : 16}
          cy={y}
          rx="4"
          ry="2.4"
          fill="#fbc945"
          opacity="0.95"
        />
      ))}
      <ellipse cx="11" cy="14" rx="3.2" ry="5" fill="#fbc945" />
    </svg>
  );
}
