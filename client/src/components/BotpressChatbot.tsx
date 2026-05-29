import { useEffect } from 'react';

const BOTPRESS_CONFIG = {
  botId: 'fd4bdc02-2327-4cd5-8030-e68296f8fdca',
  clientId: '5d30e133-1186-4cc4-96bc-7b07c1484a35',
  configuration: {
    version: 'v2',
    composerPlaceholder: 'Type a message...',
    botName: 'SeedSense Customer Support',
    botAvatar:
      'https://files.bpcontent.cloud/2025/09/19/20/20250919200651-G527MP7W.jpeg',
    botDescription:
      "I can help you with questions about SeedSense's features, plans and how to get the most from your SeedSense experience.",
    fabImage:
      'https://files.bpcontent.cloud/2026/03/21/08/20260321084925-B4DDCUUP.png',
    website: { title: 'Website', link: 'https://gemini.google.com/' },
    color: '#436f1f',
    variant: 'solid',
    headerVariant: 'solid',
    themeMode: 'light',
    fontFamily: 'inter',
    radius: 2,
    feedbackEnabled: true,
    footer: '[⚡ by Botpress](https://botpress.com/?from=webchat)',
    allowFileUpload: true,
    soundEnabled: true,
    proactiveMessageEnabled: false,
    conversationHistory: false,
  },
};

/**
 * Loads the Botpress webchat exactly like the original index.html.
 * Position is offset (right: 90px) so it doesn't overlap with our calculator FAB.
 */
export default function BotpressChatbot() {
  useEffect(() => {
    // Inject the inject.js loader once
    if (!document.getElementById('botpress-inject')) {
      const s = document.createElement('script');
      s.id = 'botpress-inject';
      s.src = 'https://cdn.botpress.cloud/webchat/v2/inject.js';
      s.async = true;
      s.onload = () => {
        try {
          window.botpress?.init(BOTPRESS_CONFIG);
        } catch (e) {
          console.error('Botpress init failed', e);
        }
      };
      document.head.appendChild(s);
    } else if (window.botpress) {
      window.botpress.init(BOTPRESS_CONFIG);
    }

    // Inject custom positioning — keep it off-screen-edge so it doesn't
    // overlap with the Calculator FAB on bottom-right.
    if (!document.getElementById('bp-pos-style')) {
      const style = document.createElement('style');
      style.id = 'bp-pos-style';
      style.textContent = `
        .bpFab     { right: 90px !important; left: auto !important; bottom: 20px !important; }
        .bpWebchat { right: 90px !important; left: auto !important; bottom: 80px !important; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return null;
}
