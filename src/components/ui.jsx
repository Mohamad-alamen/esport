import { useState, useEffect, useRef } from 'react';
import { G, GG, GD } from '../constants';

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
        fontFamily: 'Orbitron', fontWeight: 900,
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
        fontFamily: 'Rajdhani', fontSize: 13, fontWeight: 700,
        color: G, background: 'rgba(0,166,62,0.1)',
        border: '1px solid rgba(0,166,62,0.2)',
        padding: '5px 14px', borderRadius: 9999,
        letterSpacing: '0.08em', textTransform: 'uppercase',
      }}>
        {text}
      </span>
      {sub && (
        <span style={{ fontFamily: 'Rajdhani', fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', marginLeft: 12 }}>
          {sub}
        </span>
      )}
    </div>
  );
}

export function Btn({ children, outline, style = {}, onClick }) {
  const [hov, setHov] = useState(false);
  const base = {
    fontFamily: 'Rajdhani', fontWeight: 700, fontSize: 14,
    letterSpacing: '0.06em', padding: '13px 32px', borderRadius: 8,
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
