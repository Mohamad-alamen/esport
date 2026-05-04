import { useState } from 'react';
import { G, GG, PLATFORM_MODULES } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

export default function Features() {
  const [ref, visible] = useReveal();
  const [activeIdx, setActiveIdx] = useState(null);

  return (
    <section ref={ref} style={{ padding: '120px 80px', background: '#080808', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />
      {/* bg glow */}
      <div style={{ position: 'absolute', top: '40%', right: 0, width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.05) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, marginBottom: 48, alignItems: 'end' }}>
          <div style={fadeStyle(visible, 0, 'left')}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 20 }}>
              /// .platform.modules
            </div>
            <div className="glitch-text" data-text="LEARN." style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(40px, 4.5vw, 60px)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', marginBottom: 4 }}>LEARN.</div>
            <div className="glitch-text" data-text="PLAY."  style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(40px, 4.5vw, 60px)', color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', marginBottom: 4, textShadow: `0 0 40px ${GG}` }}>PLAY.</div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(40px, 4.5vw, 60px)', color: 'rgba(255,255,255,0.6)', lineHeight: 0.92, letterSpacing: '-0.02em' }}>EARN.</div>
          </div>
          <div style={{ ...fadeStyle(visible, 0.15, 'right'), paddingBottom: 8 }}>
            <p style={{ fontFamily: 'Rajdhani', fontSize: 20, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7, marginBottom: 24 }}>
              Professional training programs designed for the next generation of competitive gamers across the Middle East and beyond.
            </p>
          </div>
        </div>

        {/* Modules grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 1, background: 'rgba(0,166,62,0.08)' }}>
          {PLATFORM_MODULES.map((mod, i) => (
            <div
              key={i}
              style={{
                background: activeIdx === i ? 'rgba(0,166,62,0.06)' : '#080808',
                padding: '36px', cursor: 'pointer', position: 'relative',
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

              <div style={{ fontSize: 28, marginBottom: 14 }}>{mod.icon}</div>
              <h3 style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 16, color: activeIdx === i ? G : '#fff', marginBottom: 10, letterSpacing: '0.04em', transition: 'color 0.2s' }}>
                {mod.t.toUpperCase()}
              </h3>
              <p style={{ fontFamily: 'Rajdhani', fontSize: 15, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{mod.d}</p>
              <div style={{ marginTop: 20, fontFamily: 'monospace', fontSize: 11, color: activeIdx === i ? G : 'rgba(0,166,62,0.6)', transition: 'color 0.2s', letterSpacing: '0.08em' }}>
                → ACCESS_MODULE
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
