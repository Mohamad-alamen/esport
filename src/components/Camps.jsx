import { useState } from 'react';
import { G, GG, CAMPS } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { HudButton } from './ui';

function CampCard({ camp, index, visible, enrollLabel }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        borderRadius: 0,
        border: hov ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 28px ${GG}` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'border-color 0.35s, box-shadow 0.35s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        background: '#0a0a0a',
        ...fadeStyle(visible, index * 0.12),
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

      {/* Image area — 16/9 */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${camp.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'brightness(1)' : 'brightness(0.8)',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.6s ease',
        }} />

        {/* Scan-line sweep on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to bottom, transparent, rgba(0,166,62,0.06), transparent)',
            animation: 'scanAnim 1.5s linear infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Top row — tag + counter */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          padding: '16px 20px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
        }}>
          <span style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10,
            color: hov ? G : '#fff',
            border: `1px solid ${hov ? G : 'rgba(255,255,255,0.6)'}`,
            padding: '4px 12px', background: 'rgba(0,0,0,0.55)',
            transition: 'color 0.3s, border-color 0.3s',
          }}>
            {camp.tag}
          </span>
          <span style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9,
            color: 'rgba(255,255,255,0.6)', }}>
            {String(index + 1).padStart(2, '0')} / 03
          </span>
        </div>
      </div>

      {/* Content area — always visible */}
      <div style={{ padding: '0 24px 24px' }}>
        {/* Accent bar */}
        <div style={{
          height: 2,
          width: hov ? '100%' : '40px',
          background: hov ? G : 'rgba(255,255,255,0.6)',
          boxShadow: hov ? `0 0 10px ${G}, 0 0 20px ${GG}` : 'none',
          transition: 'width 0.45s ease, background 0.3s, box-shadow 0.3s',
          margin: '18px 0 16px',
        }} />

        {/* Title */}
        <h3 style={{
          fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 20,
          color: hov ? '#fff' : 'rgba(255,255,255,0.85)',
          lineHeight: 1.15, marginBottom: 0,
          transition: 'color 0.25s',
          }}>
          {camp.title}
        </h3>

        {/* Description — always visible */}
        <p style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14,
          color: 'rgba(255,255,255,0.7)', lineHeight: 1.65,
          marginTop: 10, marginBottom: 0,
        }}>
          {camp.sub}
        </p>

        <div style={{ marginTop: 16 }}>
          <HudButton label={enrollLabel} size="sm" />
        </div>
      </div>
    </div>
  );
}

export default function Camps() {
  const { t } = useLang();
  const { isMobile, isCompact } = useResponsive();
  const titleSize = isMobile ? 'clamp(24px, 6.8vw, 40px)' : 'clamp(36px, 4.5vw, 64px)';
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ background: '#050505', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: isMobile ? '64px 20px 32px' : '100px 80px 60px', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 20 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end' }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13, color: G, textTransform: 'uppercase', marginBottom: 16 }}>
              {t.camps.kicker}
            </div>
            <div className="glitch-text" data-text={t.camps.title1} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', marginBottom: 4 }}>{t.camps.title1}</div>
            <div className="glitch-text" data-text={t.camps.title2} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>{t.camps.title2}</div>
          </div>
          <HudButton label={t.camps.viewAll} />
        </div>
      </div>

      {/* Cards grid — padded, landscape 16/9 */}
      <div style={{ padding: isMobile ? '0 20px 64px' : '0 80px 100px', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (isCompact ? 'repeat(2,1fr)' : 'repeat(3,1fr)'), gap: 24 }}>
          {CAMPS.map((camp, i) => (
            <CampCard key={i} camp={{ ...camp, ...t.camps.items[i] }} index={i} visible={visible} enrollLabel={t.common.enroll} />
          ))}
        </div>
      </div>
    </section>
  );
}
