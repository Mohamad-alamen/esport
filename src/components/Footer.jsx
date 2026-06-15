import { G, GG } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines } from './ui';

// Replace the URLs below with Earthlink Esports' real profile links.
const SOCIALS = [
  { label: 'Instagram',   url: 'https://instagram.com/' },
  { label: 'Twitch',      url: 'https://twitch.tv/' },
  { label: 'YouTube',     url: 'https://youtube.com/' },
  { label: 'Discord',     url: 'https://discord.gg/' },
  { label: 'X (Twitter)', url: 'https://x.com/' },
];

export default function Footer() {
  const { t } = useLang();
  const { isMobile } = useResponsive();
  const [ref, visible] = useReveal(0.05);

  return (
    <footer ref={ref} style={{ background: '#050505', borderTop: `1px solid rgba(0,166,62,0.15)`, position: 'relative', overflow: 'hidden' }}>
      <Scanlines />

      {/* Radial glow */}
      <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: 900, height: 400, background: 'radial-gradient(ellipse at top, rgba(0,166,62,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '0 20px' : '0 80px', position: 'relative', zIndex: 2 }}>

        {/* ── Main Columns: Brand + 3 Nav ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : '1.8fr 1fr 1fr 1fr',
          gap: isMobile ? 32 : 56, padding: isMobile ? '40px 0 36px' : '60px 0 52px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>
          {/* Brand column */}
          <div style={{ ...fadeStyle(visible, 0.18), gridColumn: isMobile ? '1 / -1' : 'auto' }}>
            <img
              src="/H_Text_Logo_Green_EE_8k_Trans (1).png"
              alt="Earthlink Esports"
              style={{ height: 48, width: 'auto', display: 'block', marginBottom: 22, filter: `drop-shadow(0 0 8px ${GG})` }}
            />
            <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.62)', lineHeight: 1.8, maxWidth: 260, marginBottom: 30 }}>
              {t.footer.desc}
            </p>
            {/* Social tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SOCIALS.map(s => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" style={{
                  fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.1em',
                  color: 'rgba(255,255,255,0.62)',
                  border: '1px solid rgba(255,255,255,0.09)',
                  padding: '5px 13px', textDecoration: 'none',
                  transition: 'color 0.2s, border-color 0.2s, box-shadow 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.color = G; e.currentTarget.style.borderColor = G; e.currentTarget.style.boxShadow = `0 0 10px ${GG}`; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.36)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.09)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {s.label.toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Nav link columns */}
          {t.footer.cols.map((col, ci) => (
            <div key={col.t} style={fadeStyle(visible, 0.24 + ci * 0.08)}>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: G, letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
                /// .{col.t.toLowerCase()}
              </div>
              <div style={{ height: 1, background: `linear-gradient(90deg, ${G}55, transparent)`, marginBottom: 22 }} />
              {col.l.map(link => (
                <div key={link} style={{ marginBottom: 13 }}>
                  <a href="#" style={{
                    fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14, fontWeight: 600,
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
            {t.footer.copyright}
          </span>
          <div style={{ display: 'flex', gap: 24 }}>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em' }}>
              {t.footer.privacy}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em' }}>
              {t.footer.terms}
            </span>
            <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em' }}>
              {t.footer.region}
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
