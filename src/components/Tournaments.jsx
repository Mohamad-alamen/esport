import { useState } from 'react';
import { G, GG, UPCOMING_TOURNAMENTS } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

function TournamentCard({ item, index, visible }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#0a0a0a',
        border: hov ? `1px solid ${item.color}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 32px ${item.color}35` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        ...fadeStyle(visible, 0.1 + index * 0.1),
      }}
    >
      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${item.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'grayscale(0%) brightness(0.55)' : 'grayscale(50%) brightness(0.35)',
          transform: hov ? 'scale(1.06)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.6s ease',
        }} />

        {/* Neon top bar */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, ${item.color}, transparent)`, boxShadow: hov ? `0 0 12px ${item.color}` : 'none', transition: 'box-shadow 0.3s' }} />

        {/* Scan on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: `linear-gradient(to bottom, transparent, ${item.color}08, transparent)`,
            animation: 'scanAnim 1.5s linear infinite', pointerEvents: 'none',
          }} />
        )}

        {/* HUD corners */}
        {hov && (
          <>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 22, height: 22, borderTop: `2px solid ${item.color}`, borderLeft: `2px solid ${item.color}` }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 22, height: 22, borderBottom: `2px solid ${item.color}`, borderRight: `2px solid ${item.color}` }} />
          </>
        )}

        {/* Tag + game badge */}
        <div style={{ position: 'absolute', top: 14, left: 16, display: 'flex', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.14em', color: item.color, border: `1px solid ${item.color}`, padding: '3px 10px', background: 'rgba(0,0,0,0.7)' }}>
            {item.tag}
          </span>
        </div>
        <div style={{ position: 'absolute', top: 14, right: 16 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.1em', color: 'rgba(255,255,255,0.6)', background: 'rgba(0,0,0,0.7)', padding: '3px 10px' }}>
            {item.game}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '22px 24px 26px' }}>
        {/* Accent bar */}
        <div style={{
          height: 2, width: hov ? '100%' : '40px',
          background: item.color, boxShadow: `0 0 8px ${item.color}`,
          transition: 'width 0.45s ease', marginBottom: 16,
        }} />

        {/* Title */}
        <h3 style={{
          fontFamily: 'Orbitron', fontWeight: 900, fontSize: 16,
          color: hov ? '#fff' : 'rgba(255,255,255,0.9)',
          lineHeight: 1.3, marginBottom: 10,
          transition: 'color 0.25s',
          textTransform: 'uppercase', letterSpacing: '0.03em',
        }}>
          {item.name}
        </h3>

        {/* Description */}
        <p style={{ fontFamily: 'Rajdhani', fontSize: 14, color: 'rgba(255,255,255,0.62)', lineHeight: 1.6, marginBottom: 16 }}>
          {item.desc}
        </p>

        {/* Organizer + duration */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
            {item.organizer}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'rgba(255,255,255,0.25)' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em' }}>
            {item.duration}
          </span>
        </div>

        {/* Price + button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            fontFamily: 'Orbitron', fontWeight: 900, fontSize: 18,
            color: item.color, textShadow: `0 0 20px ${item.color}60`,
          }}>
            {item.price}
          </div>
          <button style={{
            fontFamily: 'monospace', fontWeight: 700, fontSize: 11,
            letterSpacing: '0.12em', padding: '10px 22px',
            background: hov ? item.color : 'transparent',
            color: hov ? '#000' : item.color,
            border: `1px solid ${item.color}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>
            ENROLL_NOW →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Tournaments() {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ padding: '120px 80px', background: '#080808', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />
      <div style={{ position: 'absolute', top: '30%', right: 0, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, ...fadeStyle(visible, 0) }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              /// .upcoming.events
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <div className="glitch-text" data-text="UPCOMING" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}>UPCOMING</div>
              <div className="glitch-text" data-text="TOURNAMENTS_" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>TOURNAMENTS_</div>
            </div>
          </div>
          <button style={{
            fontFamily: 'monospace', fontWeight: 700, fontSize: 12,
            letterSpacing: '0.1em', background: 'transparent',
            border: `1px solid ${G}`, color: G, padding: '12px 28px',
            cursor: 'pointer', transition: 'background 0.2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,166,62,0.08)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            VIEW_ALL
          </button>
        </div>

        {/* 3-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {UPCOMING_TOURNAMENTS.map((item, i) => (
            <TournamentCard key={i} item={item} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
