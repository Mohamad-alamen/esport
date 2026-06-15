import { useState, useEffect, useRef } from 'react';
import { G, GG, GD } from '../constants';
import { useLang } from '../LanguageContext';

export function Scanlines() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.06) 2px, rgba(0,0,0,0.06) 4px)',
      zIndex: 1,
    }} />
  );
}

export function GlitchH({ children, size = 80, color = '#fff', style = {} }) {
  return (
    <div
      className="glitch-text"
      data-text={children}
      style={{
        fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900,
        fontSize: size, color,
        lineHeight: 0.92, letterSpacing: '-0.02em',
        position: 'relative', ...style,
      }}
    >
      {children}
    </div>
  );
}

export function SLabel({ text, sub }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <span style={{
        display: 'inline-block',
        fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13, fontWeight: 700,
        color: G, background: 'rgba(0,166,62,0.1)',
        border: '1px solid rgba(0,166,62,0.2)',
        padding: '5px 14px', borderRadius: 9999,
        textTransform: 'uppercase',
      }}>
        {text}
      </span>
      {sub && (
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.45)', marginLeft: 12 }}>
          {sub}
        </span>
      )}
    </div>
  );
}

export function HudButton({ label, href, onClick, size = 'md', variant = 'outline', style: ext = {} }) {
  const { lang } = useLang();
  const [hov, setHov] = useState(false);

  const pad = { sm: '9px 18px',  md: '12px 24px', lg: '15px 32px' }[size];
  const fs  = { sm: 10,          md: 11,           lg: 13          }[size];
  const cut = { sm: 10,          md: 13,           lg: 18          }[size];
  const iw  = { sm: 10,          md: 12,           lg: 14          }[size];

  const ChevronIcon = ({ color }) => (
    <svg width={iw} height={iw} viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, transform: lang === 'ar' ? 'scaleX(-1)' : 'none' }}>
      <polyline points="3,1 9,6 3,11" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );

  // Chamfer on top-RIGHT + bottom-LEFT corners
  const clip = `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;

  // Primary: solid green fill, flat
  if (variant === 'primary') {
    const el = (
      <div
        onMouseEnter={() => setHov(true)}
        onMouseLeave={() => setHov(false)}
        onClick={onClick}
        style={{
          clipPath: clip, display: 'inline-flex', alignItems: 'center',
          background: hov ? '#00c44a' : G,
          cursor: 'pointer',
          boxShadow: hov ? `0 0 32px rgba(0,166,62,0.65)` : `0 0 18px rgba(0,166,62,0.35)`,
          transition: 'background 0.2s, box-shadow 0.2s',
          gap: 10, padding: pad,
          ...ext,
        }}
      >
        <span style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 700, fontSize: fs,
          textTransform: 'uppercase',
          color: '#fff', whiteSpace: 'nowrap',
        }}>{label}</span>
        <ChevronIcon color="#fff" />
      </div>
    );
    if (href) return <a href={href} style={{ textDecoration: 'none', display: 'inline-block' }}>{el}</a>;
    return el;
  }

  // Outline variant: flat, no internal separator
  const borderCol = hov ? G : 'rgba(255,255,255,0.55)';
  const textCol   = hov ? '#fff' : 'rgba(255,255,255,0.85)';
  const fillCol   = hov ? 'rgba(0,166,62,0.1)' : '#080808';

  const inner = (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={onClick}
      style={{
        clipPath: clip, background: borderCol,
        padding: '1px', display: 'inline-flex',
        cursor: 'pointer',
        boxShadow: hov ? `0 0 22px rgba(0,166,62,0.45)` : 'none',
        transition: 'background 0.25s, box-shadow 0.25s',
        ...ext,
      }}
    >
      <div style={{
        clipPath: clip, background: fillCol,
        display: 'flex', alignItems: 'center',
        gap: 10, padding: pad,
        transition: 'background 0.25s',
      }}>
        <span style={{
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 700, fontSize: fs,
          textTransform: 'uppercase',
          color: textCol, whiteSpace: 'nowrap',
          transition: 'color 0.25s',
        }}>{label}</span>
        <ChevronIcon color={textCol} />
      </div>
    </div>
  );

  if (href) return <a href={href} style={{ textDecoration: 'none', display: 'inline-block' }}>{inner}</a>;
  return inner;
}

export function Btn({ children, outline, style = {}, onClick }) {
  const [hov, setHov] = useState(false);
  const base = {
    fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 700, fontSize: 14,
    padding: '13px 32px', borderRadius: 8,
    border: 'none', cursor: 'pointer', transition: 'all 0.2s',
    textTransform: 'uppercase',
  };
  if (outline) {
    return (
      <button onClick={onClick}
        onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
        style={{ ...base, background: hov ? 'rgba(0,166,62,0.08)' : 'transparent', border: `1px solid ${G}`, color: G, ...style }}
      >
        {children}
      </button>
    );
  }
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ ...base, background: hov ? '#00c44a' : G, color: '#fff', boxShadow: `0 0 24px ${GG}`, ...style }}
    >
      {children}
    </button>
  );
}

export function Counter({ target, suffix = '' }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const num = parseInt(target);
    const steps = 50;
    const dur = 1600;
    let cur = 0;
    const interval = setInterval(() => {
      cur = Math.min(cur + num / steps, num);
      setN(Math.round(cur));
      if (cur >= num) clearInterval(interval);
    }, dur / steps);
    return () => clearInterval(interval);
  }, [visible, target]);

  return <span ref={ref}>{n}{suffix}</span>;
}
