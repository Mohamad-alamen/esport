import { useState } from 'react';
import { G, GG, GAMES } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

function GameCard({ game, index, visible }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: '#0a0a0a',
        border: hov ? `1px solid ${game.color}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 28px ${game.color}40` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        ...fadeStyle(visible, 0.1 + index * 0.08),
      }}
    >
      {/* Neon top bar */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, ${game.color}, transparent)`,
        boxShadow: hov ? `0 0 10px ${game.color}` : 'none',
        transition: 'box-shadow 0.3s',
      }} />

      {/* Image (16/9) */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${game.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'grayscale(0%) brightness(0.6)' : 'grayscale(60%) brightness(0.35)',
          transform: hov ? 'scale(1.06)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.6s ease',
        }} />

        {/* Scan-line on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: `linear-gradient(to bottom, transparent, ${game.color}08, transparent)`,
            animation: 'scanAnim 1.5s linear infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* HUD corners on hover */}
        {hov && (
          <>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: `2px solid ${game.color}`, borderLeft: `2px solid ${game.color}` }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: `2px solid ${game.color}`, borderRight: `2px solid ${game.color}` }} />
          </>
        )}

        {/* Tag badge */}
        <div style={{ position: 'absolute', top: 12, left: 14 }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.14em',
            color: game.color, border: `1px solid ${game.color}`,
            padding: '3px 10px', background: 'rgba(0,0,0,0.65)',
          }}>
            {game.tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 20px' }}>
        {/* Accent bar */}
        <div style={{
          height: 2, width: hov ? '100%' : '36px',
          background: game.color,
          boxShadow: `0 0 8px ${game.color}`,
          transition: 'width 0.4s ease',
          marginBottom: 14,
        }} />

        {/* Game name */}
        <h3 style={{
          fontFamily: 'Orbitron', fontWeight: 900, fontSize: 15,
          color: hov ? '#fff' : 'rgba(255,255,255,0.88)',
          letterSpacing: '0.03em', marginBottom: 14,
          transition: 'color 0.25s',
        }}>
          {game.name}
        </h3>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20 }}>
          <div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 18, color: game.color, marginBottom: 2 }}>
              {game.tournaments}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
              TOURNAMENTS
            </div>
          </div>
          <div style={{ width: 1, background: 'rgba(255,255,255,0.07)' }} />
          <div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 18, color: game.color, marginBottom: 2 }}>
              {game.teams}
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
              TEAMS
            </div>
          </div>
        </div>

        {/* CTA */}
        <div style={{
          marginTop: 16,
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.3s, transform 0.3s',
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: game.color, letterSpacing: '0.1em' }}>
            → EXPLORE_GAME
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Games() {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ padding: '120px 80px', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, ...fadeStyle(visible, 0) }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              /// .active.titles
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <div className="glitch-text" data-text="DISCOVER" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}>DISCOVER</div>
              <div className="glitch-text" data-text="GAMES_" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>GAMES_</div>
            </div>
            <p style={{ fontFamily: 'Rajdhani', fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 14 }}>
              Discover games and their active tournaments
            </p>
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

        {/* 3×2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {GAMES.map((game, i) => (
            <GameCard key={game.name} game={game} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
