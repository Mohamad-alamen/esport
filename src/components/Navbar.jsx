import { useState, useEffect } from 'react';
import { G, GG, NAV } from '../constants';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState('HOME');

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      height: 72,
      display: 'flex', alignItems: 'stretch',
      background: scrolled ? 'rgba(5,5,5,0.98)' : 'rgba(5,5,5,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled ? '1px solid rgba(0,166,62,0.2)' : '1px solid transparent',
      transition: 'all 0.4s',
    }}>
      {/* Logo — brand image */}
      <a href="#" style={{
        display: 'flex', alignItems: 'center',
        padding: '0 32px', flexShrink: 0,
        borderRight: '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none',
      }}>
        <img
          src="/H_Text_Logo_Green_EE_8k_Trans (1).png"
          alt="Earthlink Esports"
          style={{ height: 48, width: 'auto', display: 'block', filter: `drop-shadow(0 0 6px ${GG})` }}
        />
      </a>

      {/* Nav links */}
      <div style={{ display: 'flex', flex: 1, alignItems: 'stretch', lineHeight: '1.4' }}>
        {NAV.map(link => (
          <a
            key={link}
            href="#"
            onClick={e => { e.preventDefault(); setActive(link); }}
            style={{
              display: 'flex', alignItems: 'center',
              padding: '0 24px',
              fontFamily: 'monospace', fontSize: 14, letterSpacing: '0.1em',
              textDecoration: 'none',
              color: active === link ? G : 'rgba(255,255,255,0.45)',
              borderRight: '1px solid rgba(255,255,255,0.05)',
              borderBottom: active === link ? `2px solid ${G}` : '2px solid transparent',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { if (active !== link) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
            onMouseLeave={e => { if (active !== link) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
          >
            {active === link && (
              <span style={{ color: G, marginRight: 6, fontSize: 10 }}>///</span>
            )}
            {link}
          </a>
        ))}
      </div>

      {/* Right — SIGN_IN + JOIN_NOW */}
      <div style={{
        display: 'flex', alignItems: 'center',
        padding: '0 32px', gap: 16,
        borderLeft: '1px solid rgba(255,255,255,0.07)',
      }}>
        <a href="#" style={{
          fontFamily: 'monospace', fontSize: 14, letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.4)', textDecoration: 'none',
          transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = '#fff'}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
        >
          SIGN_IN
        </a>
        <button style={{
          fontFamily: 'monospace', fontWeight: 700, fontSize: 14,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          background: G, color: '#fff',
          padding: '10px 24px', border: 'none', cursor: 'pointer',
          boxShadow: `0 0 24px ${GG}`,
          transition: 'background 0.2s, box-shadow 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.background = '#00c44a'; e.currentTarget.style.boxShadow = '0 0 36px rgba(0,166,62,0.6)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = G; e.currentTarget.style.boxShadow = `0 0 24px ${GG}`; }}
        >
          JOIN_NOW
        </button>
      </div>
    </nav>
  );
}
