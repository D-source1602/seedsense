import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिंदी' },
  { code: 'mr', label: 'मराठी' },
  { code: 'or', label: 'ଓଡ଼ିଆ' },
  { code: 'bn', label: 'বাংলা' },
  { code: 'kn', label: 'ಕನ್ನಡ' },
  { code: 'te', label: 'తెలుగు' },
  { code: 'as', label: 'অসমীয়া' },
  { code: 'gu', label: 'ગુજરાતી' },
];

function getCurrentLang(): string {
  if (typeof document === 'undefined') return 'en';
  const m = document.cookie.split('; ').find((r) => r.startsWith('googtrans='));
  if (!m) return 'en';
  return m.split('=')[1]?.split('/')[2] ?? 'en';
}

function applyTranslation(code: string) {
  if (code === 'en') {
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${location.hostname};`;
    location.reload();
    return;
  }
  document.cookie = `googtrans=/en/${code}; path=/`;
  document.cookie = `googtrans=/en/${code}; path=/; domain=${location.hostname}`;
  location.reload();
}

export default function LanguageBar() {
  const [active, setActive] = useState(getCurrentLang());

  useEffect(() => {
    if (document.getElementById('gtl-script')) return;

    window.googleTranslateElementInit = () => {
      // eslint-disable-next-line new-cap
      new (window.google as any).translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'hi,mr,or,bn,kn,te,as,gu',
          autoDisplay: false,
        },
        'gtl-element'
      );
    };

    const s = document.createElement('script');
    s.id = 'gtl-script';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);

    if (!document.getElementById('gtl-element')) {
      const el = document.createElement('div');
      el.id = 'gtl-element';
      el.style.display = 'none';
      document.body.appendChild(el);
    }
  }, []);

  return (
    <motion.div
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-[99999] flex flex-wrap items-center justify-center gap-2 border-b border-lime-400/20 px-4 py-2 backdrop-blur-xl"
      style={{
        minHeight: '42px',
        background:
          'linear-gradient(90deg, rgba(13, 29, 18, 0.95) 0%, rgba(20, 50, 30, 0.95) 50%, rgba(13, 29, 18, 0.95) 100%)',
      }}
    >
      <span className="flex items-center gap-1.5 text-sm font-bold text-lime-400">
        <Globe size={14} /> Language:
      </span>
      {LANGUAGES.map((l) => {
        const isActive = active === l.code;
        return (
          <motion.button
            key={l.code}
            onClick={() => {
              setActive(l.code);
              applyTranslation(l.code);
            }}
            whileHover={{ scale: 1.06, y: -1 }}
            whileTap={{ scale: 0.96 }}
            className={`whitespace-nowrap rounded-full border px-3 py-1 text-[12px] font-semibold transition-all ${
              isActive
                ? 'border-lime-400 bg-gradient-to-r from-lime-400 to-leaf-500 text-leaf-950 shadow-glow'
                : 'border-leaf-500/30 bg-moss-900/60 text-leaf-100/80 backdrop-blur hover:border-lime-400/60 hover:text-lime-400'
            }`}
          >
            {l.label}
          </motion.button>
        );
      })}
    </motion.div>
  );
}
