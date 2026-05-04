import { useState } from 'react';
import { G, GG, UPCOMING_TOURNAMENTS } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines, HudButton } from './ui';

function TournamentCard({ item, index, visible }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: '#0a0a0a',
        border: hov ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 32px ${GG}` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        ...fadeStyle(visible, 0.1 + index * 0.1),
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

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${item.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'brightness(1)' : 'brightness(0.8)',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.6s ease',
        }} />

        {/* Scan on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: `linear-gradient(to bottom, transparent, ${item.color}08, transparent)`,
            animation: 'scanAnim 1.5s linear infinite', pointerEvents: 'none',
          }} />
        )}

        {/* Tag + game badge */}
        <div style={{ position: 'absolute', top: 14, left: 16, display: 'flex', gap: 8 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.14em', color: hov ? G : '#fff', border: `1px solid ${hov ? G : 'rgba(255,255,255,0.6)'}`, padding: '3px 10px', background: 'rgba(0,0,0,0.7)', transition: 'color 0.3s, border-color 0.3s' }}>
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
          background: hov ? G : 'rgba(255,255,255,0.6)',
          boxShadow: hov ? `0 0 8px ${G}` : 'none',
          transition: 'width 0.45s ease, background 0.3s, box-shadow 0.3s', marginBottom: 16,
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
            color: hov ? G : '#fff',
            textShadow: hov ? `0 0 20px ${GG}` : 'none',
            transition: 'color 0.3s, text-shadow 0.3s',
          }}>
            {item.price}
          </div>
          <HudButton label="ENROLL_NOW" size="sm" />
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
          <HudButton label="VIEW_ALL" />
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
