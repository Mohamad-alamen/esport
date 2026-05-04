import { G, GG, FOOTER_LINKS } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

const SOCIALS = ['Instagram', 'Twitch', 'YouTube', 'Discord', 'X (Twitter)'];

export default function Footer() {
  const [ref, visible] = useReveal(0.05);

  return (
    <footer ref={ref} style={{ background: '#050505', borderTop: `1px solid rgba(0,166,62,0.15)`, position: 'relative', overflow: 'hidden' }}>
      <Scanlines />

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 900, height: 400, background: 'radial-gradient(ellipse at top, rgba(0,166,62,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 80px', position: 'relative', zIndex: 2 }}>

        {/* ── Main Columns: Brand + 3 Nav ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr',
          gap: 56, padding: '60px 0 52px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Brand column */}
          <div style={fadeStyle(visible, 0.18)}>
            <img
              src="/H_Text_Logo_Green_EE_8k_Trans (1).png"
              alt="Earthlink Esports"
              style={{ height: 48, width: 'auto', display: 'block', marginBottom: 22, filter: `drop-shadow(0 0 8px ${GG})` }}
            />
            <p style={{ fontFamily: 'Rajdhani', fontSize: 14, color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, maxWidth: 260, marginBottom: 30 }}>
              The region's premier esports platform — professional training, competitive tournaments, and a thriving gaming community.
            </p>
            {/* Social tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SOCIALS.map(s => (
                <a key={s} href="#" style={{
                  fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.62)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  padding: '5px 13px', textDecoration: 'none',
                  transition: 'color 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = G; e.currentTarget.style.borderColor = G; e.currentTarget.style.boxShadow = `0 0 10px ${GG}`; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.36)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {s.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Nav link columns */}
          {FOOTER_LINKS.map((col, ci) => (
            <div key={col.t} style={fadeStyle(visible, 0.24 + ci * 0.08)}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                /// .{col.t.toLowerCase()}
              </div>
              <div style={{ height: 1, background: `linear-gradient(90deg, ${G}55, transparent)`, marginBottom: 22 }} />
              {col.l.map(link => (
                <div key={link} style={{ marginBottom: 13 }}>
                  <a href="#" style={{
                    fontFamily: 'Rajdhani', fontSize: 14, fontWeight: 600,
                    color: 'rgba(255,255,255,0.65)',
                    textDecoration: 'none', letterSpacing: '0.03em',
                    transition: 'color 0.2s',
                  }}
                    onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                    onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                  >
                    → {link}
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ── Bottom Bar ── */}
        <div style={{
          padding: '20px 0',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12,
        }}>
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em' }}>
            © 2026 EARTHLINK ESPORTS — ALL RIGHTS RESERVED
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em' }}>
              PRIVACY_POLICY
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em' }}>
              TERMS_OF_USE
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em' }}>
              IRAQ · MIDDLE EAST · GLOBAL
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
