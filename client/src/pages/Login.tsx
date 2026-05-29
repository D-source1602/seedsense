import { useEffect, useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sprout } from 'lucide-react';

import Background from '../components/Background';
import Logo from '../components/Logo';

/* same client_id as the legacy index.html */
const GOOGLE_CLIENT_ID =
  '601281173121-33oecc3bbulc9uhr83dn7itlmv0jilh1.apps.googleusercontent.com';

const HERO_TAGS = ['🌾 AI-Powered', '🌍 36 States & UTs', '⚡ Climate-Aware', '💹 Live Mandi Prices'];

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  /* ── Google Sign-In bootstrap ─────────────────────────────── */
  useEffect(() => {
    // Inject GSI script once
    const existing = document.getElementById('gsi-client');
    if (!existing) {
      const s = document.createElement('script');
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.id = 'gsi-client';
      document.head.appendChild(s);
    }

    const handleGoogle = (response: { credential: string }) => {
      console.log('Encoded JWT ID token:', response.credential);
      // Persist a flag for "logged in" if needed (parity with legacy alert+redirect)
      sessionStorage.setItem('seedsense:auth', 'google');
      navigate('/dashboard');
    };
    window.handleCredentialResponse = handleGoogle;

    // Render Google button when GSI loads
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
        theme: 'outline',
        size: 'large',
        text: 'signin_with',
        shape: 'rectangular',
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
    // simulate signup
    sessionStorage.setItem('seedsense:auth', 'email');
    if (remember) sessionStorage.setItem('seedsense:remember', '1');
    setTimeout(() => navigate('/dashboard'), 600);
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <Background showHorizon showSun />

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="grid w-full grid-cols-1 overflow-hidden rounded-3xl shadow-soft md:grid-cols-2"
        >
          {/* ───── Hero (left panel) ─────────────────────────── */}
          <div className="relative overflow-hidden bg-gradient-to-br from-leaf-700 via-leaf-800 to-leaf-900 p-8 text-white md:p-12">
            <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-wheat-300/20 blur-3xl" />
            <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/30 to-transparent" />

            {/* swaying wheat icons */}
            <div className="pointer-events-none absolute inset-0">
              {[10, 28, 52, 74, 88].map((x, i) => (
                <motion.div
                  key={i}
                  className="absolute bottom-6"
                  style={{ left: `${x}%` }}
                  animate={{ rotate: [-4, 4, -4] }}
                  transition={{
                    duration: 4 + i * 0.6,
                    repeat: Infinity,
                    ease: 'easeInOut',
                    delay: i * 0.2,
                  }}
                >
                  <WheatStalk />
                </motion.div>
              ))}
            </div>

            <div className="relative z-10">
              <Logo variant="light" />

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="mt-12 font-display text-4xl font-bold leading-tight md:text-5xl"
              >
                Grow Smarter.
                <br />
                <span className="text-wheat-300">Harvest More.</span>
                <br />
                Profit.
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.7 }}
                className="mt-4 max-w-md text-lg text-leaf-100/90"
              >
                Unlock your land's potential with AI-driven crop recommendations,
                climate risk insights, and real-time mandi prices.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.7 }}
                className="mt-8 flex flex-wrap gap-2"
              >
                {HERO_TAGS.map((t) => (
                  <span key={t} className="pill text-leaf-50">
                    {t}
                  </span>
                ))}
              </motion.div>
            </div>
          </div>

          {/* ───── Form (right panel) ─────────────────────────── */}
          <div className="relative bg-white/85 p-8 backdrop-blur-xl md:p-12">
            <div className="mx-auto w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-leaf-50 px-3 py-1 text-xs font-semibold text-leaf-700">
                  <Sprout size={12} /> Welcome back, farmer
                </div>
                <h2 className="font-display text-3xl font-bold text-leaf-900">
                  Welcome to SeedSense
                </h2>
                <p className="mt-1 text-sm text-leaf-700/70">
                  AI-powered crop recommendations
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-4">
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-700/60"
                  />
                  <input
                    type="email"
                    required
                    className="input-field pl-11"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-leaf-700/60"
                  />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="input-field pl-11 pr-11"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-leaf-700/60 hover:text-leaf-800"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-leaf-800/80">
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => setRemember(e.target.checked)}
                      className="h-4 w-4 rounded border-leaf-300 text-leaf-600 focus:ring-leaf-400"
                    />
                    Remember for 30 days
                  </label>
                  <a
                    href="#forgot"
                    className="font-semibold text-leaf-700 hover:text-leaf-900"
                  >
                    Forgot password?
                  </a>
                </div>

                <motion.button
                  type="submit"
                  disabled={submitting}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary group w-full"
                >
                  <span>{submitting ? 'Sprouting…' : 'Sign Up'}</span>
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-wheat-300 text-leaf-900 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight size={16} />
                  </span>
                </motion.button>
              </form>

              <p className="mt-5 text-center text-sm text-leaf-700/70">
                Already have an account?{' '}
                <a href="#login" className="font-semibold text-leaf-700 hover:text-leaf-900">
                  Login
                </a>
              </p>

              <div className="seed-divider">or</div>

              <div className="flex justify-center" id="google-btn-target" />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ── decorative wheat stalk ─────────────────────────────────── */
function WheatStalk() {
  return (
    <svg width="22" height="80" viewBox="0 0 22 80" fill="none">
      <path d="M11 80 V20" stroke="#fbc945" strokeWidth="1.5" strokeLinecap="round" />
      {[60, 50, 40, 30, 22].map((y, i) => (
        <g key={i}>
          <ellipse
            cx={i % 2 ? 6 : 16}
            cy={y}
            rx="4"
            ry="2.4"
            fill="#fbc945"
            opacity="0.95"
          />
        </g>
      ))}
      <ellipse cx="11" cy="14" rx="3.2" ry="5" fill="#fbc945" />
    </svg>
  );
}
