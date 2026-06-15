import { useState } from 'react';
import { G, GG } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

const FEATURE_ICONS = [
  // Trophy — Tournaments
  <svg key="0" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fi0a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7fffc4"/><stop offset="100%" stopColor="#004d1f"/></linearGradient>
      <linearGradient id="fi0b" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#003d18"/><stop offset="100%" stopColor="#005c25"/></linearGradient>
    </defs>
    <ellipse cx="24" cy="46" rx="10" ry="2.5" fill="rgba(0,166,62,0.25)"/>
    <rect x="14" y="40" width="20" height="4" rx="2" fill="url(#fi0b)"/>
    <rect x="20" y="33" width="8" height="8" fill="#005225"/>
    <path d="M11 5h26v15a13 13 0 01-26 0V5z" fill="url(#fi0a)"/>
    <path d="M11 9H7a4 4 0 000 8h4" stroke="#00e064" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M37 9h4a4 4 0 010 8h-4" stroke="#00e064" strokeWidth="2.5" strokeLinecap="round" fill="none"/>
    <path d="M15 8 Q14 14 16 17" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    <path d="M24 10l1.5 4h4l-3.3 2.4 1.3 4-3.5-2.5-3.5 2.5 1.3-4L18.5 14h4z" fill="rgba(255,255,255,0.55)"/>
  </svg>,

  // Gamepad — Coaching
  <svg key="1" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fi1" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#5cf1a4"/><stop offset="100%" stopColor="#003d18"/></linearGradient>
    </defs>
    <ellipse cx="24" cy="46" rx="11" ry="2" fill="rgba(0,166,62,0.2)"/>
    <path d="M6 22C6 15 10 12 24 12C38 12 42 15 42 22L38 38H10L6 22z" fill="url(#fi1)"/>
    <rect x="21" y="18" width="2.5" height="9" rx="1.2" fill="rgba(255,255,255,0.9)"/>
    <rect x="17.5" y="21.5" width="9" height="2.5" rx="1.2" fill="rgba(255,255,255,0.9)"/>
    <circle cx="33" cy="20" r="2.2" fill="rgba(255,255,255,0.55)"/>
    <circle cx="37" cy="25" r="2.2" fill="rgba(255,255,255,0.55)"/>
    <circle cx="29" cy="25" r="2.2" fill="rgba(255,255,255,0.55)"/>
    <path d="M11 22 Q10 18 12 16" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>,

  // Nodes — Community
  <svg key="2" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fi2" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5cf1a4"/><stop offset="100%" stopColor="#003d18"/></linearGradient>
    </defs>
    <ellipse cx="24" cy="46" rx="10" ry="2" fill="rgba(0,166,62,0.2)"/>
    <line x1="24" y1="14" x2="10" y2="34" stroke="#00A63E" strokeWidth="1.5" opacity="0.6"/>
    <line x1="24" y1="14" x2="38" y2="34" stroke="#00A63E" strokeWidth="1.5" opacity="0.6"/>
    <line x1="10" y1="34" x2="38" y2="34" stroke="#00A63E" strokeWidth="1.5" opacity="0.6"/>
    <circle cx="24" cy="11" r="6" fill="url(#fi2)"/>
    <circle cx="9" cy="36" r="5" fill="url(#fi2)" opacity="0.85"/>
    <circle cx="39" cy="36" r="5" fill="url(#fi2)" opacity="0.85"/>
    <circle cx="24" cy="11" r="2.5" fill="rgba(255,255,255,0.6)"/>
    <circle cx="9" cy="36" r="2" fill="rgba(255,255,255,0.5)"/>
    <circle cx="39" cy="36" r="2" fill="rgba(255,255,255,0.5)"/>
  </svg>,

  // Bar Chart — Analytics
  <svg key="3" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fi3a" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5cf1a4"/><stop offset="100%" stopColor="#00521f"/></linearGradient>
      <linearGradient id="fi3b" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#3dd68a"/><stop offset="100%" stopColor="#003d18"/></linearGradient>
      <linearGradient id="fi3c" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#7fffc4"/><stop offset="100%" stopColor="#005a24"/></linearGradient>
    </defs>
    <ellipse cx="24" cy="46" rx="11" ry="2" fill="rgba(0,166,62,0.2)"/>
    <rect x="6" y="28" width="9" height="14" rx="1.5" fill="url(#fi3a)"/>
    <rect x="19" y="18" width="9" height="24" rx="1.5" fill="url(#fi3c)"/>
    <rect x="32" y="10" width="9" height="32" rx="1.5" fill="url(#fi3b)"/>
    <polyline points="10,27 24,17 36,9" stroke="rgba(255,255,255,0.45)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    <circle cx="36" cy="9" r="2.5" fill="rgba(255,255,255,0.7)"/>
  </svg>,

  // Gem — Rewards
  <svg key="4" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fi4a" x1="0" y1="0" x2="0.5" y2="1"><stop offset="0%" stopColor="#7fffc4"/><stop offset="100%" stopColor="#004d1f"/></linearGradient>
      <linearGradient id="fi4b" x1="1" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#5cf1a4"/><stop offset="100%" stopColor="#003018"/></linearGradient>
    </defs>
    <ellipse cx="24" cy="46" rx="9" ry="2" fill="rgba(0,166,62,0.22)"/>
    <polygon points="24,4 36,14 30,42 18,42 12,14" fill="url(#fi4a)"/>
    <polygon points="24,4 36,14 24,20" fill="rgba(255,255,255,0.18)"/>
    <polygon points="12,14 24,20 18,42" fill="url(#fi4b)"/>
    <polygon points="36,14 30,42 24,20" fill="rgba(0,80,30,0.4)"/>
    <polygon points="12,14 36,14 24,20" fill="rgba(255,255,255,0.12)"/>
    <path d="M20 8 Q18 12 20 14" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
  </svg>,

  // Target — Training
  <svg key="5" width="48" height="48" viewBox="0 0 48 48" fill="none">
    <defs>
      <linearGradient id="fi5" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#5cf1a4"/><stop offset="100%" stopColor="#003d18"/></linearGradient>
    </defs>
    <ellipse cx="24" cy="46" rx="10" ry="2" fill="rgba(0,166,62,0.2)"/>
    <circle cx="24" cy="22" r="18" fill="none" stroke="#005225" strokeWidth="2"/>
    <circle cx="24" cy="22" r="13" fill="none" stroke="#00733a" strokeWidth="2"/>
    <circle cx="24" cy="22" r="8" fill="none" stroke="#00A63E" strokeWidth="2"/>
    <circle cx="24" cy="22" r="4" fill="url(#fi5)"/>
    <circle cx="24" cy="22" r="1.8" fill="rgba(255,255,255,0.8)"/>
    <line x1="24" y1="4" x2="24" y2="12" stroke="#00A63E" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="24" y1="32" x2="24" y2="40" stroke="#00A63E" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="6" y1="22" x2="14" y2="22" stroke="#00A63E" strokeWidth="1.5" strokeLinecap="round"/>
    <line x1="34" y1="22" x2="42" y2="22" stroke="#00A63E" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>,
];

export default function Features() {
  const { t } = useLang();
  const { isMobile, isCompact } = useResponsive();
  const titleSize = isMobile ? 'clamp(30px, 8vw, 46px)' : 'clamp(40px, 4.5vw, 60px)';
  const [ref, visible] = useReveal();
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <section ref={ref} style={{ padding: isMobile ? '64px 20px' : '120px 80px', background: '#080808', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />
      {/* bg glow */}
      <div style={{ position: 'absolute', top: '40%', right: 0, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? 24 : 80, marginBottom: 48, alignItems: 'end' }}>
          <div style={fadeStyle(visible, 0, 'left')}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>
              {t.features.kicker}
            </div>
            <div className="glitch-text" data-text={t.features.title[0]} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', marginBottom: 4 }}>{t.features.title[0]}</div>
            <div className="glitch-text" data-text={t.features.title[1]}  style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', marginBottom: 4, textShadow: `0 0 40px ${GG}` }}>{t.features.title[1]}</div>
            <div style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: 'rgba(255,255,255,0.6)', lineHeight: 0.92, letterSpacing: '-0.02em' }}>{t.features.title[2]}</div>
          </div>
          <div style={{ ...fadeStyle(visible, 0.15, 'right'), paddingBottom: 8 }}>
            <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 20, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 24 }}>
              {t.features.desc}
            </p>
          </div>
        </div>

        {/* Modules grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (isCompact ? 'repeat(2,1fr)' : 'repeat(3,1fr)'), gap: 1, background: 'rgba(0,166,62,0.08)' }}>
          {t.features.modules.map((mod, i) => (
            <div
              key={i}
              style={{
                background: activeIdx === i ? 'rgba(0,166,62,0.06)' : '#080808',
                padding: isMobile ? '22px 4px' : '36px', cursor: 'pointer', position: 'relative',
                transition: 'background 0.25s',
                ...fadeStyle(visible, 0.05 + i * 0.08),
              }}
              onMouseEnter={() => setActiveIdx(i)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              {activeIdx === i && (
                <>
                  <div style={{ position: 'absolute', top: 0, left: 0, width: 16, height: 16, borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}` }} />
                  <div style={{ position: 'absolute', bottom: 0, right: 0, width: 16, height: 16, borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}` }} />
                </>
              )}

              <div style={{ marginBottom: 14 }}>{FEATURE_ICONS[i]}</div>
              <h3 style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 700, fontSize: 16, color: activeIdx === i ? G : '#fff', marginBottom: 10, letterSpacing: '0.04em', transition: 'color 0.2s' }}>
                {mod.t.toUpperCase()}
              </h3>
              <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{mod.d}</p>
              <div style={{ marginTop: 20, fontFamily: 'monospace', fontSize: 11, color: activeIdx === i ? G : 'rgba(0,166,62,0.6)', transition: 'color 0.2s', letterSpacing: '0.08em' }}>
                → {t.common.accessModule}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
