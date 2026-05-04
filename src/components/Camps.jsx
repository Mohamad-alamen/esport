import { useState } from 'react';
import { G, GG, CAMPS } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';

function CampCard({ camp, index, visible }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        borderRadius: 0,
        border: hov ? `1px solid ${camp.color}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 28px ${camp.color}30` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'border-color 0.35s, box-shadow 0.35s',
        background: '#0a0a0a',
        ...fadeStyle(visible, index * 0.12),
      }}
    >
      {/* Image area — 16/9 */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${camp.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'grayscale(0%) brightness(0.55)' : 'grayscale(40%) brightness(0.35)',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.6s ease',
        }} />

        {/* Scan-line sweep on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.25), transparent)',
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
            fontFamily: 'monospace', fontSize: 10, color: camp.color,
            letterSpacing: '0.15em', border: `1px solid ${camp.color}`,
            padding: '4px 12px', background: 'rgba(0,0,0,0.55)',
          }}>
            {camp.tag}
          </span>
          <span style={{
            fontFamily: 'monospace', fontSize: 9,
            color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em',
          }}>
            {String(index + 1).padStart(2, '0')} / 03
          </span>
        </div>

        {/* Corner HUD brackets on hover */}
        {hov && (
          <>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderTop: `2px solid ${camp.color}`, borderLeft: `2px solid ${camp.color}` }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderBottom: `2px solid ${camp.color}`, borderRight: `2px solid ${camp.color}` }} />
          </>
        )}
      </div>

      {/* Content area — always visible */}
      <div style={{ padding: '0 24px 24px' }}>
        {/* Color accent bar */}
        <div style={{
          height: 2,
          width: hov ? '100%' : '40px',
          background: camp.color,
          boxShadow: `0 0 10px ${camp.color}, 0 0 20px ${camp.color}60`,
          transition: 'width 0.45s ease',
          margin: '18px 0 16px',
          animation: hov ? 'none' : 'glowPulse 3s ease-in-out infinite',
        }} />

        {/* Title */}
        <h3 style={{
          fontFamily: 'Orbitron', fontWeight: 900, fontSize: 20,
          color: hov ? '#fff' : 'rgba(255,255,255,0.85)',
          lineHeight: 1.15, marginBottom: 0,
          transition: 'color 0.25s',
          letterSpacing: '0.02em',
        }}>
          {camp.title}
        </h3>

        {/* Description — always visible */}
        <p style={{
          fontFamily: 'Rajdhani', fontSize: 14,
          color: 'rgba(255,255,255,0.7)', lineHeight: 1.65,
          marginTop: 10, marginBottom: 0,
        }}>
          {camp.sub}
        </p>

        {/* Enroll button — always visible */}
        <div style={{ marginTop: 16 }}>
          <button
            style={{
              background: 'transparent', border: `1px solid ${camp.color}`,
              color: camp.color, padding: '9px 22px',
              fontFamily: 'monospace', fontWeight: 700, fontSize: 11,
              letterSpacing: '0.12em', cursor: 'pointer', transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = camp.color; e.currentTarget.style.color = '#000'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = camp.color; }}
          >
            ENROLL_NOW →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Camps() {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ background: '#050505', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '100px 80px 60px', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(40px)', transition: 'opacity 0.9s ease, transform 0.9s ease' }}>
        <div style={{ maxWidth: 1440, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              /// .holiday.programs
            </div>
            <div className="glitch-text" data-text="ACTION-PACKED" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', marginBottom: 4 }}>ACTION-PACKED</div>
            <div className="glitch-text" data-text="HOLIDAY CAMPS_" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>HOLIDAY CAMPS_</div>
          </div>
          <button style={{
            fontFamily: 'monospace', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.1em', textTransform: 'uppercase',
            background: 'transparent', border: `1px solid ${G}`, color: G,
            padding: '12px 28px', cursor: 'pointer', marginBottom: 8,
            transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,166,62,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            VIEW_ALL_CAMPS
          </button>
        </div>
      </div>

      {/* Cards grid — padded, landscape 16/9 */}
      <div style={{ padding: '0 80px 100px', maxWidth: 1440, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
          {CAMPS.map((camp, i) => (
            <CampCard key={i} camp={camp} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
