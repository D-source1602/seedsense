// ✅ Make function global (IMPORTANT)
window.googleTranslateElementInit = function () {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    includedLanguages: 'hi,mr,or,bn,kn,te,as,gu',
    autoDisplay: false
  }, 'google_translate_element');
};

// ✅ Inject Google Translate Script dynamically
(function injectGoogleTranslate() {
  const script = document.createElement('script');
  script.src =
    'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
  script.async = true;
  document.head.appendChild(script);

  // Hidden GT element (required by the API)
  const gtDiv = document.createElement('div');
  gtDiv.id = 'google_translate_element';
  gtDiv.style.display = 'none';
  document.body.appendChild(gtDiv);
})();

// ✅ Language bar styles
const langBarStyles = `
  #lang-bar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(90deg, #ff6a00, #ff8c00, #ffa500);
    padding: 8px 16px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.25);
    flex-wrap: wrap;
    gap: 8px;
    font-family: 'Segoe UI', Arial, sans-serif;
  }

  #lang-bar-label {
    color: #fff;
    font-weight: 700;
    font-size: 14px;
    letter-spacing: 0.5px;
    margin-right: 6px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .lang-btn {
    background: rgba(255,255,255,0.15);
    border: 2px solid rgba(255,255,255,0.5);
    color: #fff;
    padding: 5px 13px;
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    transition: all 0.2s ease;
    white-space: nowrap;
    backdrop-filter: blur(4px);
  }

  .lang-btn:hover {
    background: rgba(255,255,255,0.35);
    border-color: #fff;
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0,0,0,0.2);
  }

  .lang-btn.active {
    background: #fff;
    color: #ff6a00;
    border-color: #fff;
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  }

  /* Push page content below the bar */
  body {
    padding-top: 50px !important;
  }

  /* Hide Google's default translate banner */
  .goog-te-banner-frame,
  .skiptranslate {
    display: none !important;
  }

  body {
    top: 0 !important;
  }
`;

// ✅ Language definitions
const languages = [
  { code: 'en', label: '🇮🇳 English',   nativeScript: null },
  { code: 'hi', label: 'हिंदी',          nativeScript: 'Hindi' },
  { code: 'mr', label: 'मराठी',          nativeScript: 'Marathi' },
  { code: 'or', label: 'ଓଡ଼ିଆ',          nativeScript: 'Odia' },
  { code: 'bn', label: 'বাংলা',          nativeScript: 'Bengali' },
  { code: 'kn', label: 'ಕನ್ನಡ',          nativeScript: 'Kannada' },
  { code: 'te', label: 'తెలుగు',         nativeScript: 'Telugu' },
  { code: 'as', label: 'অসমীয়া',        nativeScript: 'Assamese' },
  { code: 'gu', label: 'ગુજરાતી',        nativeScript: 'Gujarati' },
];

// ✅ Apply translation using Google Translate cookie
function applyTranslation(langCode) {
  // Update active button state
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === langCode);
  });

  if (langCode === 'en') {
    // Restore to English
    const gtCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('googtrans='));
    if (gtCookie) {
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      document.cookie = 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=' + location.hostname;
    }
    location.reload();
    return;
  }

  // Set Google Translate cookie
  const cookieValue = `/en/${langCode}`;
  document.cookie = `googtrans=${cookieValue}; path=/`;
  document.cookie = `googtrans=${cookieValue}; path=/; domain=${location.hostname}`;

  // Trigger via hidden select (fallback method)
  const tryViaSelect = () => {
    const gtSelect = document.querySelector('.goog-te-combo');
    if (gtSelect) {
      gtSelect.value = langCode;
      gtSelect.dispatchEvent(new Event('change'));
    } else {
      setTimeout(tryViaSelect, 300);
    }
  };
  tryViaSelect();

  location.reload();
}

// ✅ Get currently active language from cookie
function getCurrentLang() {
  const match = document.cookie
    .split('; ')
    .find(row => row.startsWith('googtrans='));
  if (!match) return 'en';
  const parts = match.split('=')[1].split('/');
  return parts[2] || 'en';
}

// ✅ Build and inject language bar on page load
window.addEventListener('DOMContentLoaded', () => {
  // Inject styles
  const styleTag = document.createElement('style');
  styleTag.textContent = langBarStyles;
  document.head.appendChild(styleTag);

  const currentLang = getCurrentLang();

  // Build bar
  const wrapper = document.createElement('div');
  wrapper.id = 'lang-bar-wrapper';

  const label = document.createElement('span');
  label.id = 'lang-bar-label';
  label.innerHTML = '🌐 भाषा / Language :';
  wrapper.appendChild(label);

  languages.forEach(({ code, label }) => {
    const btn = document.createElement('button');
    btn.className = 'lang-btn';
    btn.dataset.lang = code;
    btn.textContent = label;
    if (code === currentLang) btn.classList.add('active');
    btn.addEventListener('click', () => applyTranslation(code));
    wrapper.appendChild(btn);
  });

  // Insert at very top of body
  document.body.insertBefore(wrapper, document.body.firstChild);
});
