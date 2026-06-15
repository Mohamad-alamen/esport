import { useState } from 'react';
import { G, GG, TEAMS } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines, HudButton } from './ui';

function TeamCard({ team, index, visible }) {
  const { t } = useLang();
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        background: '#0a0a0a',
        border: hov ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 28px ${GG}` : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        transform: hov ? 'translateY(-5px)' : 'translateY(0)',
        transition: 'border-color 0.3s, box-shadow 0.3s, transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        ...fadeStyle(visible, 0.1 + index * 0.1),
      }}
    >
      {/* Card corner brackets */}
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
          backgroundImage: `url(${team.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'brightness(1)' : 'brightness(0.8)',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'filter 0.55s ease, transform 0.65s ease',
        }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,10,0.5) 0%, transparent 50%)' }} />
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: `linear-gradient(to bottom, transparent, rgba(0,166,62,0.05), transparent)`,
            animation: 'scanAnim 1.5s linear infinite', pointerEvents: 'none',
          }} />
        )}
      </div>

      {/* Content */}
      <div style={{ padding: '16px 20px 20px' }}>

        {/* Name */}
        <div style={{ marginBottom: 12 }}>
          <h3 style={{
            fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 14,
            color: hov ? '#fff' : 'rgba(255,255,255,0.88)',
            lineHeight: 1.2,
            transition: 'color 0.25s',
          }}>
            {team.name}
          </h3>
        </div>

        {/* Accent divider */}
        <div style={{
          height: 1,
          background: hov ? `linear-gradient(90deg, ${G}, transparent)` : 'rgba(255,255,255,0.07)',
          marginBottom: 14, transition: 'background 0.35s',
        }} />

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', marginBottom: 14 }}>
          {[
            { val: team.wins,         label: t.teams.stats.wins,    color: '#fff' },
            { val: team.losses,       label: t.teams.stats.losses,  color: 'rgba(255,255,255,0.5)' },
            { val: `${team.winRate}%`, label: t.teams.stats.winRate, color: G, shadow: true },
          ].map(({ val, label, color, shadow }) => (
            <div key={label}>
              <div style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 700, fontSize: 18, color, marginBottom: 3, textShadow: shadow ? `0 0 12px ${GG}` : 'none' }}>{val}</div>
              <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 8, color: 'rgba(255,255,255,0.4)', }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Region + Points */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.4)', }}>◈ {team.region}</span>
          <span style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 700, fontSize: 12, color: hov ? G : 'rgba(255,255,255,0.7)', transition: 'color 0.3s' }}>
            {team.points.toLocaleString()} <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.35)', fontWeight: 400 }}>{t.teams.pts}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

export default function Teams() {
  const { t } = useLang();
  const { isMobile, isCompact } = useResponsive();
  const titleSize = isMobile ? 'clamp(26px, 7.5vw, 40px)' : 'clamp(36px, 4.5vw, 64px)';
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ padding: isMobile ? '64px 20px' : '120px 80px', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.04) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 20 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: isMobile ? 36 : 56, ...fadeStyle(visible, 0) }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13, color: G, textTransform: 'uppercase', marginBottom: 16 }}>
              {t.teams.kicker}
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <div className="glitch-text" data-text={t.teams.title1} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}>{t.teams.title1}</div>
              <div className="glitch-text" data-text={t.teams.title2} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>{t.teams.title2}</div>
            </div>
          </div>
          <HudButton label={t.common.viewAll} />
        </div>

        {/* 4-column grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : (isCompact ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)'), gap: isMobile ? 12 : 20 }}>
          {TEAMS.map((team, i) => (
            <TeamCard key={team.tag} team={{ ...team, ...t.teams.items[i] }} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
