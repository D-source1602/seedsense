import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

const LANGUAGES = [
  { code: 'en', label: '🇮🇳 English' },
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

/**
 * Multilingual top bar (English + 8 Indian languages) using Google Translate.
 * The bar pushes the page down 50px (handled by global CSS spacer).
 */
export default function LanguageBar() {
  const [active, setActive] = useState(getCurrentLang());

  useEffect(() => {
    // ensure GT script is loaded once
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
    s.src =
      'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.head.appendChild(s);

    // hidden GT mount node
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
      className="fixed inset-x-0 top-0 z-[99999] flex flex-wrap items-center justify-center gap-2 bg-gradient-to-r from-saffron-500 via-saffron-400 to-wheat-300 px-4 py-2 shadow-md"
      style={{ minHeight: '42px' }}
    >
      <span className="flex items-center gap-1.5 text-sm font-bold text-white">
        <Globe size={14} /> भाषा / Language:
      </span>
      {LANGUAGES.map((l) => {
        const isActive = active === l.code;
        return (
          <button
            key={l.code}
            onClick={() => {
              setActive(l.code);
              applyTranslation(l.code);
            }}
            className={`whitespace-nowrap rounded-full border-2 px-3 py-1 text-[12px] font-semibold transition-all ${
              isActive
                ? 'border-white bg-white text-saffron-600 shadow-sm'
                : 'border-white/50 bg-white/15 text-white backdrop-blur hover:border-white hover:bg-white/30'
            }`}
          >
            {l.label}
          </button>
        );
      })}
    </motion.div>
  );
}
