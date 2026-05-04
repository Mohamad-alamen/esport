import { useState } from 'react';
import { G, GG, TEAMS } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

function TeamCard({ team, index, visible }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: '#0a0a0a',
        border: hov ? `1px solid ${team.rankColor}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 28px ${team.rankColor}40` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        ...fadeStyle(visible, 0.1 + index * 0.1),
      }}
    >
      {/* Neon top bar */}
      <div style={{
        height: 2,
        background: `linear-gradient(90deg, ${team.rankColor}, transparent)`,
        boxShadow: hov ? `0 0 10px ${team.rankColor}` : 'none',
        transition: 'box-shadow 0.3s',
      }} />

      {/* Image */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${team.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'grayscale(0%) brightness(0.55)' : 'grayscale(70%) brightness(0.3)',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'filter 0.55s ease, transform 0.65s ease',
        }} />

        {/* Bottom gradient */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.95) 0%, transparent 60%)' }} />

        {/* Scan on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: `linear-gradient(to bottom, transparent, ${team.rankColor}08, transparent)`,
            animation: 'scanAnim 1.5s linear infinite', pointerEvents: 'none',
          }} />
        )}

        {/* HUD corners on hover */}
        {hov && (
          <>
            <div style={{ position: 'absolute', top: 0, left: 0, width: 20, height: 20, borderTop: `2px solid ${team.rankColor}`, borderLeft: `2px solid ${team.rankColor}` }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: 20, height: 20, borderBottom: `2px solid ${team.rankColor}`, borderRight: `2px solid ${team.rankColor}` }} />
          </>
        )}

        {/* Recruiting badge */}
        <div style={{ position: 'absolute', top: 12, left: 14 }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 9, letterSpacing: '0.12em',
            color: G, border: `1px solid ${G}`,
            padding: '3px 10px', background: 'rgba(0,0,0,0.7)',
          }}>
            RECRUITING
          </span>
        </div>

        {/* Rank badge */}
        <div style={{
          position: 'absolute', top: 12, right: 14,
          fontFamily: 'Orbitron', fontWeight: 900, fontSize: 14,
          color: '#000', background: team.rankColor,
          width: 36, height: 36,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 14px ${team.rankColor}80`,
        }}>
          #{team.rank}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '18px 20px 22px' }}>
        {/* Name + tag */}
        <h3 style={{
          fontFamily: 'Orbitron', fontWeight: 900, fontSize: 16,
          color: hov ? '#fff' : 'rgba(255,255,255,0.88)',
          letterSpacing: '0.02em', marginBottom: 5,
          transition: 'color 0.25s',
        }}>
          {team.name}
        </h3>
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: `${G}`, letterSpacing: '0.14em', marginBottom: 16 }}>
          [{team.tag}]
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: hov ? `linear-gradient(90deg, ${team.rankColor}, transparent)` : 'rgba(255,255,255,0.06)',
          marginBottom: 16, transition: 'background 0.35s',
        }} />

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 20, color: '#fff', marginBottom: 4 }}>{team.wins}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>WINS</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 20, color: 'rgba(255,255,255,0.6)', marginBottom: 4 }}>{team.losses}</div>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>LOSSES</div>
          </div>
          <div>
            <div style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 20, color: G, textShadow: `0 0 12px ${GG}`, marginBottom: 4 }}>{team.winRate}%</div>
            <div style={{ fontFamily: 'monospace', fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.1em' }}>WIN RATE</div>
          </div>
        </div>

        {/* Region + Points */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em' }}>
            ◈ {team.region}
          </span>
          <span style={{ fontFamily: 'Orbitron', fontWeight: 700, fontSize: 13, color: team.rankColor, letterSpacing: '0.04em' }}>
            {team.points.toLocaleString()} <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>PTS</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Teams() {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ padding: '120px 80px', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 56, ...fadeStyle(visible, 0) }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              /// .leaderboard.rankings
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline' }}>
              <div className="glitch-text" data-text="BEST" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}>BEST</div>
              <div className="glitch-text" data-text="TEAMS_" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(36px, 4.5vw, 64px)', color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>TEAMS_</div>
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

        {/* 4-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
          {TEAMS.map((team, i) => (
            <TeamCard key={team.tag} team={team} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
