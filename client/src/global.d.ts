/* Centralised global declarations — avoid double declarations across files. */

export {};

declare global {
  interface Window {
    /** Google Identity Services + Translate (loose typing — both libs share it). */
    google?: any;
    /** Botpress webchat (legacy global). */
    botpress?: {
      init: (cfg: Record<string, unknown>) => void;
    };
    /** GSI callback resolver wired up by Login.tsx. */
    handleCredentialResponse?: (response: { credential: string }) => void;
    /** Required by Google Translate's element.js. */
    googleTranslateElementInit?: () => void;
  }
}
