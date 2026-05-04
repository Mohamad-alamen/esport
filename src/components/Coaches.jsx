import { useState } from 'react';
import { G, GG, COACHES } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

const ACCENT_COLORS = ['#00A63E', '#5CF1A4', '#FFD700', '#00B4D8'];

function CoachCard({ coach, index, visible }) {
  const [hov, setHov] = useState(false);
  const accent = ACCENT_COLORS[index % ACCENT_COLORS.length];

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: '#0a0a0a',
        border: hov ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 32px ${accent}28, inset 0 0 40px ${accent}06` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        ...fadeStyle(visible, index * 0.1),
      }}
    >
      {/* Neon top accent bar */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, ${accent}, transparent)`,
        boxShadow: hov ? `0 0 12px ${accent}` : 'none',
        transition: 'box-shadow 0.3s',
      }} />

      {/* Scan-line sweep on hover */}
      {hov && (
        <div style={{
          position: 'absolute', left: 0, right: 0, height: '30%',
          background: `linear-gradient(to bottom, transparent, ${accent}08, transparent)`,
          animation: 'scanAnim 2s linear infinite',
          pointerEvents: 'none', zIndex: 1,
        }} />
      )}

      <div style={{ position: 'relative', zIndex: 2, padding: '32px 28px 28px' }}>
        {/* Avatar box with photo */}
        <div style={{
          width: 80, height: 80,
          border: hov ? `1px solid ${accent}` : '1px solid rgba(255,255,255,0.1)',
          marginBottom: 28,
          boxShadow: hov ? `0 0 20px ${accent}40` : 'none',
          transition: 'border-color 0.3s, box-shadow 0.3s',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* HUD corner brackets */}
          <div style={{ position: 'absolute', top: -1, left: -1, width: 12, height: 12, borderTop: `2px solid ${accent}`, borderLeft: `2px solid ${accent}`, zIndex: 2 }} />
          <div style={{ position: 'absolute', bottom: -1, right: -1, width: 12, height: 12, borderBottom: `2px solid ${accent}`, borderRight: `2px solid ${accent}`, zIndex: 2 }} />
          <img
            src={coach.img}
            alt={coach.name}
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              filter: hov ? 'grayscale(0%) brightness(1)' : 'grayscale(30%) brightness(0.85)',
              transition: 'filter 0.4s, transform 0.4s',
              transform: hov ? 'scale(1.08)' : 'scale(1)',
              display: 'block',
            }}
          />
          {/* Subtle accent tint overlay on hover */}
          <div style={{
            position: 'absolute', inset: 0,
            background: hov ? `${accent}18` : 'transparent',
            transition: 'background 0.3s',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Name */}
        <h3 style={{
          fontFamily: 'Orbitron', fontWeight: 900, fontSize: 17,
          color: hov ? '#fff' : 'rgba(255,255,255,0.88)',
          lineHeight: 1.2, marginBottom: 8, letterSpacing: '0.01em',
          transition: 'color 0.25s',
        }}>
          {coach.name}
        </h3>

        {/* Role */}
        <div style={{
          fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.14em',
          color: hov ? accent : 'rgba(255,255,255,0.65)',
          textTransform: 'uppercase', marginBottom: 24,
          transition: 'color 0.25s',
        }}>
          {coach.role}
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: hov
            ? `linear-gradient(90deg, ${accent}, transparent)`
            : 'rgba(255,255,255,0.07)',
          marginBottom: 20, transition: 'background 0.35s',
        }} />

        {/* Stats */}
        <div style={{ display: 'flex', gap: 0 }}>
          {[['EXP', coach.exp], ['SPECIALTY', coach.spec]].map(([label, val]) => (
            <div key={label} style={{ flex: 1 }}>
              <div style={{
                fontFamily: 'Orbitron', fontWeight: 700, fontSize: 15,
                color: '#fff',
                textShadow: hov ? `0 0 12px ${accent}80` : 'none',
                transition: 'text-shadow 0.3s',
                marginBottom: 4,
              }}>
                {val}
              </div>
              <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.1em' }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA — fades in on hover */}
        <div style={{
          marginTop: 20,
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateY(0)' : 'translateY(6px)',
          transition: `opacity 0.3s ease ${hov ? '0.08s' : '0s'}, transform 0.3s ease ${hov ? '0.08s' : '0s'}`,
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: accent, letterSpacing: '0.1em' }}>
            → VIEW_PROFILE
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Coaches() {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ padding: '120px 80px', background: '#080808', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 64, ...fadeStyle(visible, 0) }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              /// .coaching.roster
            </div>
            <div style={{ display: 'flex', gap: 12, alignItems: 'baseline' }}>
              <div className="glitch-text" data-text="PRO" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}>PRO</div>
              <div className="glitch-text" data-text="COACHES_" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>COACHES_</div>
            </div>
          </div>
          <p style={{ fontFamily: 'Rajdhani', fontSize: 17, color: 'rgba(255,255,255,0.65)', maxWidth: 360, lineHeight: 1.6, textAlign: 'right' }}>
            Learn from professional players with years of competitive experience across multiple titles
          </p>
        </div>

        {/* 4-column card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          {COACHES.map((coach, i) => (
            <CoachCard key={i} coach={coach} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
