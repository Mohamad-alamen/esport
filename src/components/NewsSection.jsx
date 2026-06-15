import { useState } from 'react';
import { G, GG, NEWS } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines, HudButton } from './ui';

function FeatureCard({ item, visible, readMore }) {
  const [hov, setHov] = useState(false);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        border: hov ? `1px solid ${G}` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hov ? `0 0 40px ${GG}` : 'none',
        transition: 'border-color 0.35s, box-shadow 0.35s',
        ...fadeStyle(visible, 0.1),
      }}
    >
      {/* Full-card HUD corners on hover */}
      {hov && (
        <>
          <div style={{ position: 'absolute', top: 0, left: 0, width: 28, height: 28, borderTop: `2px solid ${G}`, borderLeft: `2px solid ${G}`, zIndex: 10, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, right: 0, width: 28, height: 28, borderTop: `2px solid ${G}`, borderRight: `2px solid ${G}`, zIndex: 10, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, left: 0, width: 28, height: 28, borderBottom: `2px solid ${G}`, borderLeft: `2px solid ${G}`, zIndex: 10, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: 0, right: 0, width: 28, height: 28, borderBottom: `2px solid ${G}`, borderRight: `2px solid ${G}`, zIndex: 10, pointerEvents: 'none' }} />
        </>
      )}

      {/* Image */}
      <div style={{ position: 'relative', height: 440, overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${item.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'brightness(0.85)' : 'brightness(0.65)',
          transform: hov ? 'scale(1.04)' : 'scale(1)',
          transition: 'filter 0.55s ease, transform 0.65s ease',
        }} />

        {/* Gradient overlay — only bottom fade for text legibility */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.3) 50%, transparent 100%)' }} />

        {/* Scan-line on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to bottom, transparent, rgba(0,166,62,0.05), transparent)',
            animation: 'scanAnim 2s linear infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Tag badge — top left */}
        <div style={{ position: 'absolute', top: 24, left: 28 }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 10,
            color: hov ? G : '#fff',
            letterSpacing: '0.15em',
            border: `1px solid ${hov ? G : 'rgba(255,255,255,0.6)'}`,
            padding: '5px 14px', background: 'rgba(0,0,0,0.65)',
            transition: 'color 0.3s, border-color 0.3s',
          }}>
            {item.tag}
          </span>
        </div>

        {/* Counter — top right */}
        <div style={{ position: 'absolute', top: 24, right: 28 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em' }}>
            01 / {String(NEWS.length).padStart(2, '0')}
          </span>
        </div>

        {/* Content overlay at bottom */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '36px 40px' }}>
          <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginBottom: 14 }}>
            {item.date}
          </div>
          <h3 style={{
            fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 'clamp(22px, 2.8vw, 36px)',
            color: '#fff', lineHeight: 1.15, marginBottom: 14, maxWidth: 680,
          }}>
            {item.title}
          </h3>
          <p style={{
            fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16,
            color: 'rgba(255,255,255,0.7)', lineHeight: 1.65,
            maxWidth: 580, marginBottom: 24,
          }}>
            {item.desc}
          </p>
          <span style={{
            fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.1em',
            opacity: hov ? 1 : 0.5,
            transition: 'opacity 0.3s',
          }}>
            {readMore} →
          </span>
        </div>
      </div>
    </div>
  );
}

function NewsCard({ item, index, visible, readMore }) {
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
        ...fadeStyle(visible, 0.2 + index * 0.1),
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

      {/* Image (16/9) */}
      <div style={{ position: 'relative', aspectRatio: '16/9', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${item.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center',
          filter: hov ? 'brightness(1)' : 'brightness(0.8)',
          transform: hov ? 'scale(1.05)' : 'scale(1)',
          transition: 'filter 0.5s ease, transform 0.6s ease',
        }} />

        {/* Scan-line sweep on hover */}
        {hov && (
          <div style={{
            position: 'absolute', left: 0, right: 0, height: '40%',
            background: 'linear-gradient(to bottom, transparent, rgba(0,166,62,0.06), transparent)',
            animation: 'scanAnim 1.5s linear infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Counter badge */}
        <div style={{ position: 'absolute', top: 12, right: 14 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em' }}>
            {String(index + 2).padStart(2, '0')} / {String(NEWS.length).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '20px 24px 26px' }}>
        {/* Tag + date row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <span style={{
            fontFamily: 'monospace', fontSize: 9,
            color: hov ? G : '#fff',
            letterSpacing: '0.14em',
            border: `1px solid ${hov ? G : 'rgba(255,255,255,0.45)'}`,
            padding: '3px 10px', flexShrink: 0,
            transition: 'color 0.3s, border-color 0.3s',
          }}>
            {item.tag}
          </span>
          <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.08em' }}>
            {item.date}
          </span>
        </div>

        {/* Divider */}
        <div style={{
          height: 1,
          background: hov ? `linear-gradient(90deg, ${G}, transparent)` : 'rgba(255,255,255,0.06)',
          marginBottom: 14, transition: 'background 0.35s',
        }} />

        {/* Title */}
        <h3 style={{
          fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 700, fontSize: 14,
          color: hov ? '#fff' : 'rgba(255,255,255,0.82)',
          lineHeight: 1.4, marginBottom: 10,
          transition: 'color 0.25s',
        }}>
          {item.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13,
          color: 'rgba(255,255,255,0.65)', lineHeight: 1.65,
          marginBottom: 18,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {item.desc}
        </p>

        {/* READ_MORE */}
        <span style={{
          fontFamily: 'monospace', fontSize: 10, color: G, letterSpacing: '0.1em',
          display: 'inline-block',
          opacity: hov ? 1 : 0,
          transform: hov ? 'translateX(0)' : 'translateX(-8px)',
          transition: `opacity 0.3s ease ${hov ? '0.05s' : '0s'}, transform 0.3s ease ${hov ? '0.05s' : '0s'}`,
        }}>
          {readMore} →
        </span>
      </div>
    </div>
  );
}

export default function NewsSection() {
  const { t } = useLang();
  const { isMobile, isCompact } = useResponsive();
  const titleSize = isMobile ? 'clamp(26px, 7.5vw, 40px)' : 'clamp(36px, 4.5vw, 64px)';
  const [ref, visible] = useReveal();
  const news = NEWS.map((item, i) => ({ ...item, ...t.news.items[i] }));
  const [feature, ...rest] = news;

  return (
    <section ref={ref} style={{ padding: isMobile ? '64px 20px' : '120px 80px', background: '#050505', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%,-50%)', width: 800, height: 800, borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,166,62,0.03) 0%, transparent 65%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 20 : 0, justifyContent: 'space-between', alignItems: isMobile ? 'flex-start' : 'flex-end', marginBottom: isMobile ? 32 : 48, ...fadeStyle(visible, 0) }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 16 }}>
              {t.news.kicker}
            </div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'baseline', flexWrap: 'wrap' }}>
              <div className="glitch-text" data-text={t.news.title1} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}>{t.news.title1}</div>
              <div className="glitch-text" data-text={t.news.title2} style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>{t.news.title2}</div>
            </div>
          </div>
          <HudButton label={t.news.more} />
        </div>

        {/* Featured article — full width */}
        <FeatureCard item={feature} visible={visible} readMore={t.news.readMore} />

        {/* 3-column card grid */}
        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : (isCompact ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)'), gap: 20, marginTop: 20 }}>
          {rest.map((item, i) => (
            <NewsCard key={i} item={item} index={i} visible={visible} readMore={t.news.readMore} />
          ))}
        </div>
      </div>
    </section>
  );
}
