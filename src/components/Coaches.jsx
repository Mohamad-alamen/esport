import { useState } from 'react';
import { G, GG, COACHES } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

function CoachCard({ coach, index, visible }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: '#0a0a0a',
        border: hov ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 28px rgba(0,166,62,0.35)` : 'none',
        cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        ...fadeStyle(visible, index * 0.1),
      }}
    >
      {/* HUD corners — always visible */}
      {[
        { top: 0, left: 0, borderTop: true, borderLeft: true },
        { top: 0, right: 0, borderTop: true, borderRight: true },
        { bottom: 0, left: 0, borderBottom: true, borderLeft: true },
        { bottom: 0, right: 0, borderBottom: true, borderRight: true },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: c.top, right: c.right, bottom: c.bottom, left: c.left,
          width: 20, height: 20, zIndex: 10, pointerEvents: 'none',
          borderTop:    c.borderTop    ? `2px solid ${hov ? G : 'rgba(255,255,255,0.35)'}` : 'none',
          borderRight:  c.borderRight  ? `2px solid ${hov ? G : 'rgba(255,255,255,0.35)'}` : 'none',
          borderBottom: c.borderBottom ? `2px solid ${hov ? G : 'rgba(255,255,255,0.35)'}` : 'none',
          borderLeft:   c.borderLeft   ? `2px solid ${hov ? G : 'rgba(255,255,255,0.35)'}` : 'none',
          transition: 'border-color 0.3s',
        }} />
      ))}

      {/* Padded image */}
      <div style={{ padding: '12px 12px 0' }}>
        <div style={{ position: 'relative', aspectRatio: '1/1', overflow: 'hidden' }}>
          <img
            src={coach.img}
            alt={coach.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: 'center top',
              filter: hov ? 'brightness(1)' : 'brightness(0.8)',
              transform: hov ? 'scale(1.05)' : 'scale(1)',
              transition: 'filter 0.5s ease, transform 0.65s cubic-bezier(0.16,1,0.3,1)',
              display: 'block',
            }}
          />
          {/* Bottom fade into info */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '20%',
            background: 'linear-gradient(to top, rgba(10,10,10,0.6), transparent)',
            pointerEvents: 'none',
          }} />
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '18px 20px 22px' }}>
        <div style={{
          fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 16,
          color: G,
          letterSpacing: '0.01em', marginBottom: 6,
          textTransform: 'uppercase',
          textShadow: hov ? `0 0 16px rgba(0,166,62,0.9), 0 0 40px rgba(0,166,62,0.4)` : `0 0 8px rgba(0,166,62,0.3)`,
          transition: 'text-shadow 0.35s ease',
        }}>
          {coach.name}
        </div>
        <div style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14,
          color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.04em',
        }}>
          {coach.role} / {coach.spec}
        </div>
      </div>
    </div>
  );
}

export default function Coaches() {
  const { t } = useLang();
  const { isMobile, isCompact } = useResponsive();
  const titleSize = isMobile ? 'clamp(26px, 7.5vw, 40px)' : 'clamp(36px, 4.5vw, 64px)';
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ padding: isMobile ? '64px 20px' : '120px 80px', background: '#080808', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Header */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 16 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: isMobile ? 36 : 56, ...fadeStyle(visible, 0) }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              {t.coaches.kicker}
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <div className="glitch-text" data-text={t.coaches.title1} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}>{t.coaches.title1}</div>
              <div className="glitch-text" data-text={t.coaches.title2} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>{t.coaches.title2}</div>
            </div>
          </div>
          <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.65)', maxWidth: isMobile ? '100%' : 360, lineHeight: 1.6, textAlign: isMobile ? 'start' : 'end' }}>
            {t.coaches.desc}
          </p>
        </div>

        {/* Card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isCompact ? 'repeat(3, 1fr)' : 'repeat(4, 1fr)'), gap: isMobile ? 12 : 16 }}>
          {COACHES.map((coach, i) => (
            <CoachCard key={i} coach={{ ...coach, ...t.coaches.items[i] }} index={i} visible={visible} />
          ))}
        </div>

      </div>
    </section>
  );
}
