import { useState } from 'react';
import { G, GG } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

export default function Banner() {
  const [ref, visible] = useReveal();
  const [hovCreate, setHovCreate] = useState(false);
  const [hovBrowse, setHovBrowse] = useState(false);

  return (
    <section ref={ref} style={{ position: 'relative', background: '#080808', overflow: 'hidden' }}>
      <Scanlines />

      {/* Neon top border */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${G}, transparent)`, boxShadow: `0 0 18px ${G}` }} />

      {/* Radial glow */}
      <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, rgba(0,166,62,0.07) 0%, transparent 65%)`, pointerEvents: 'none' }} />

      {/* HUD corner brackets */}
      <div style={{ position: 'absolute', top: 2, left: 0, width: 40, height: 40, borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}`, zIndex: 3 }} />
      <div style={{ position: 'absolute', top: 2, right: 0, width: 40, height: 40, borderTop: `2px solid ${G}`, borderRight: `2px solid ${G}`, zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: 2, left: 0, width: 40, height: 40, borderBottom: `2px solid ${G}`, borderLeft: `2px solid ${G}`, zIndex: 3 }} />
      <div style={{ position: 'absolute', bottom: 2, right: 0, width: 40, height: 40, borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}`, zIndex: 3 }} />

      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '72px 80px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        gap: 48, position: 'relative', zIndex: 2,
      }}>

        {/* Left — text */}
        <div style={fadeStyle(visible, 0)}>

          <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap', marginBottom: 20 }}>
            <div
              className="glitch-text"
              data-text="BUILD YOUR"
              style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 56px)', color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em', position: 'relative' }}
            >
              BUILD YOUR
            </div>
            <div
              className="glitch-text"
              data-text="LEGACY_"
              style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(32px, 4vw, 56px)', color: G, lineHeight: 0.95, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}
            >
              LEGACY_
            </div>
          </div>
          <p style={{ fontFamily: 'Rajdhani', fontSize: 16, color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, maxWidth: 480 }}>
            Form a squad, register for tournaments, and compete across multiple titles — all in one platform built for champions.
          </p>
        </div>

        {/* Right — actions */}
        <div style={{ display: 'flex', gap: 16, flexShrink: 0, ...fadeStyle(visible, 0.15) }}>
          {/* CREATE_TEAM */}
          <button
            onMouseEnter={() => setHovCreate(true)}
            onMouseLeave={() => setHovCreate(false)}
            style={{
              fontFamily: 'monospace', fontWeight: 700, fontSize: 13,
              letterSpacing: '0.14em', padding: '18px 40px',
              background: hovCreate ? '#00c44a' : G,
              color: '#000', border: 'none', cursor: 'pointer',
              boxShadow: hovCreate ? '0 0 40px rgba(0,166,62,0.65)' : `0 0 24px ${GG}`,
              transition: 'background 0.2s, box-shadow 0.2s',
              position: 'relative',
            }}
          >
            {/* inner top accent */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.25)' }} />
            CREATE_TEAM
          </button>

          {/* BROWSE_GAMES */}
          <button
            onMouseEnter={() => setHovBrowse(true)}
            onMouseLeave={() => setHovBrowse(false)}
            style={{
              fontFamily: 'monospace', fontWeight: 700, fontSize: 13,
              letterSpacing: '0.14em', padding: '18px 40px',
              background: hovBrowse ? 'rgba(0,166,62,0.1)' : 'transparent',
              color: G, border: `1px solid ${G}`,
              cursor: 'pointer',
              boxShadow: hovBrowse ? `0 0 28px ${GG}` : 'none',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
          >
            BROWSE_GAMES
          </button>
        </div>
      </div>

      {/* Neon bottom border */}
      <div style={{ height: 2, background: `linear-gradient(90deg, transparent, ${G}, transparent)`, boxShadow: `0 0 18px ${G}` }} />
    </section>
  );
}
