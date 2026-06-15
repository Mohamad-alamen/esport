import { useState } from 'react';
import { G, GG, GAMES } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines, HudButton } from './ui';

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
        boxShadow: hov ? `0 0 28px ${game.color}35` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        ...fadeStyle(visible, 0.08 + index * 0.07),
      }}
    >
      {/* Full-card corner brackets */}
      {[
        { top: 0, left: 0, borderTop: true, borderLeft: true },
        { top: 0, right: 0, borderTop: true, borderRight: true },
        { bottom: 0, left: 0, borderBottom: true, borderLeft: true },
        { bottom: 0, right: 0, borderBottom: true, borderRight: true },
      ].map((c, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: c.top, right: c.right, bottom: c.bottom, left: c.left,
          width: 16, height: 16, zIndex: 10, pointerEvents: 'none',
          borderTop:    c.borderTop    ? `2px solid ${hov ? game.color : 'rgba(255,255,255,0.3)'}` : 'none',
          borderRight:  c.borderRight  ? `2px solid ${hov ? game.color : 'rgba(255,255,255,0.3)'}` : 'none',
          borderBottom: c.borderBottom ? `2px solid ${hov ? game.color : 'rgba(255,255,255,0.3)'}` : 'none',
          borderLeft:   c.borderLeft   ? `2px solid ${hov ? game.color : 'rgba(255,255,255,0.3)'}` : 'none',
          transition: 'border-color 0.3s',
        }} />
      ))}

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${game.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'brightness(1)' : 'brightness(0.8)',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.6s ease',
        }} />

        {/* Light bottom fade */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.45) 0%, transparent 50%)', pointerEvents: 'none' }} />

        {/* Scan on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: `linear-gradient(to bottom, transparent, ${game.color}08, transparent)`,
            animation: 'scanAnim 1.5s linear infinite', pointerEvents: 'none',
          }} />
        )}

        {/* Tag badge */}
        <div style={{ position: 'absolute', top: 12, left: 14 }}>
          <span style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9, color: game.color, border: `1px solid ${game.color}`,
            padding: '3px 10px', background: 'rgba(0,0,0,0.65)',
          }}>
            {game.tag}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px 20px' }}>
        {/* Accent bar */}
        <div style={{
          height: 2, width: hov ? '100%' : '32px',
          background: game.color,
          boxShadow: hov ? `0 0 10px ${game.color}` : 'none',
          transition: 'width 0.4s ease, box-shadow 0.3s',
          marginBottom: 12,
        }} />

        {/* Game name */}
        <h3 style={{
          fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 15,
          color: hov ? '#fff' : 'rgba(255,255,255,0.88)',
          marginBottom: 14,
          transition: 'color 0.25s',
        }}>
          {game.name}
        </h3>

        {/* Divider */}
        <div style={{
          height: 1,
          background: hov ? `linear-gradient(90deg, ${game.color}60, transparent)` : 'rgba(255,255,255,0.06)',
          marginBottom: 14, transition: 'background 0.35s',
        }} />

        {/* Footer row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 16 }}>
            <div>
              <div style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{game.tournaments}</div>
              <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.4)', }}>TOURNAMENTS</div>
            </div>
            <div style={{ width: 1, background: 'rgba(255,255,255,0.07)', alignSelf: 'stretch' }} />
            <div>
              <div style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 2 }}>{game.teams}</div>
              <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.4)', }}>TEAMS</div>
            </div>
          </div>
          <span style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: game.color, opacity: hov ? 1 : 0, transform: hov ? 'translateX(0)' : 'translateX(6px)',
            transition: 'opacity 0.3s, transform 0.3s',
          }}>
            EXPLORE →
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

      <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, ...fadeStyle(visible, 0) }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13, color: G, textTransform: 'uppercase', marginBottom: 16 }}>
              /// .active.titles
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <div className="glitch-text" data-text="DISCOVER" style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}>DISCOVER</div>
              <div className="glitch-text" data-text="GAMES_" style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>GAMES_</div>
            </div>
            <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.6)', marginTop: 14 }}>
              Discover games and their active tournaments
            </p>
          </div>
          <HudButton label="VIEW ALL" />
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
