import { useState, useEffect } from 'react';
import { G, GG } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';

export default function Navbar({ onSignIn, onJoin }) {
  const { t, lang, toggle } = useLang();
  const { isMobile } = useResponsive();
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const langBtn = (
    <button onClick={toggle} aria-label="Switch language" style={{
      display: 'flex', alignItems: 'center', gap: 6,
      background: 'transparent', cursor: 'pointer',
      border: '1px solid rgba(0,166,62,0.4)',
      padding: '7px 12px',
      fontFamily: 'monospace', fontWeight: 700, fontSize: 12, letterSpacing: '0.08em',
      color: G, transition: 'background 0.2s, box-shadow 0.2s, color 0.2s',
    }}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,166,62,0.12)'; e.currentTarget.style.boxShadow = `0 0 16px ${GG}`; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.boxShadow = 'none'; }}
    >
      <span style={{ fontSize: 11 }}>◈</span>
      {t.langShort}
    </button>
  );

  const navHeight = isMobile ? 60 : 72;

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      minHeight: navHeight,
      display: 'flex', alignItems: 'stretch',
      background: scrolled || open ? 'rgba(5,5,5,0.98)' : 'rgba(5,5,5,0.7)',
      backdropFilter: 'blur(20px)',
      borderBottom: scrolled || open ? '1px solid rgba(0,166,62,0.2)' : '1px solid transparent',
      transition: 'background 0.4s, border-color 0.4s',
      flexWrap: 'wrap',
    }}>
      {/* Logo — brand image */}
      <a href="#" style={{
        display: 'flex', alignItems: 'center',
        padding: isMobile ? '0 16px' : '0 32px', flexShrink: 0,
        height: navHeight,
        borderInlineEnd: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
        textDecoration: 'none', marginInlineEnd: 'auto',
      }}>
        <img
          src="/H_Text_Logo_Green_EE_8k_Trans (1).png"
          alt="Earthlink Esports"
          style={{ height: isMobile ? 36 : 48, width: 'auto', display: 'block', filter: `drop-shadow(0 0 6px ${GG})` }}
        />
      </a>

      {isMobile ? (
        <>
          {/* Mobile controls: lang + hamburger */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', height: navHeight }}>
            {langBtn}
            <button onClick={() => setOpen(o => !o)} aria-label="Menu" style={{
              display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 5,
              width: 38, height: 38, background: 'transparent',
              border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer', padding: 0,
            }}>
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  display: 'block', width: 18, height: 2, margin: '0 auto', background: open ? G : '#fff',
                  transition: 'transform 0.3s, opacity 0.3s',
                  transform: open && i === 0 ? 'translateY(7px) rotate(45deg)' : open && i === 2 ? 'translateY(-7px) rotate(-45deg)' : 'none',
                  opacity: open && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>

          {/* Mobile dropdown panel */}
          {open && (
            <div style={{
              flexBasis: '100%', borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex', flexDirection: 'column',
              background: 'rgba(5,5,5,0.98)',
              animation: 'fadeUp 0.25s ease',
            }}>
              {t.nav.links.map((link, i) => (
                <a key={i} href="#" onClick={e => { e.preventDefault(); setActive(i); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '16px 20px', textDecoration: 'none',
                    fontFamily: lang === 'ar' ? 'inherit' : 'monospace', fontSize: 15, letterSpacing: lang === 'ar' ? '0' : '0.1em',
                    color: active === i ? G : 'rgba(255,255,255,0.7)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}>
                  {active === i && <span style={{ color: G, fontSize: 10 }}>///</span>}
                  {link}
                </a>
              ))}
              <div style={{ display: 'flex', gap: 12, padding: '18px 20px' }}>
                <button onClick={() => { setOpen(false); onSignIn(); }} style={{
                  flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                  fontFamily: lang === 'ar' ? 'inherit' : 'monospace', fontSize: 14, padding: '13px',
                  color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                }}>{t.nav.signIn}</button>
                <button onClick={() => { setOpen(false); onJoin(); }} style={{
                  flex: 1, background: G, border: 'none',
                  fontFamily: lang === 'ar' ? 'inherit' : 'monospace', fontWeight: 700, fontSize: 14, padding: '13px',
                  color: '#fff', cursor: 'pointer', boxShadow: `0 0 24px ${GG}`,
                }}>{t.nav.join}</button>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          {/* Desktop nav links */}
          <div style={{ display: 'flex', alignItems: 'stretch', lineHeight: '1.4' }}>
            {t.nav.links.map((link, i) => (
              <a
                key={i}
                href="#"
                onClick={e => { e.preventDefault(); setActive(i); }}
                style={{
                  display: 'flex', alignItems: 'center',
                  padding: '0 24px',
                  fontFamily: lang === 'ar' ? 'inherit' : 'monospace', fontSize: 14, letterSpacing: lang === 'ar' ? '0' : '0.1em',
                  textDecoration: 'none',
                  color: active === i ? G : 'rgba(255,255,255,0.45)',
                  borderInlineEnd: '1px solid rgba(255,255,255,0.05)',
                  borderBottom: active === i ? `2px solid ${G}` : '2px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { if (active !== i) e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                onMouseLeave={e => { if (active !== i) e.currentTarget.style.color = 'rgba(255,255,255,0.45)'; }}
              >
                {active === i && (
                  <span style={{ color: G, marginInlineEnd: 6, fontSize: 10 }}>///</span>
                )}
                {link}
              </a>
            ))}
          </div>

          {/* Desktop right — lang + SIGN_IN + JOIN_NOW */}
          <div style={{
            display: 'flex', alignItems: 'center',
            padding: '0 32px', gap: 16,
            borderInlineStart: '1px solid rgba(255,255,255,0.07)',
          }}>
            {langBtn}
            <button onClick={onSignIn} style={{
              background: 'transparent', border: 'none',
              fontFamily: lang === 'ar' ? 'inherit' : 'monospace', fontSize: 14, letterSpacing: lang === 'ar' ? '0' : '0.1em',
              color: 'rgba(255,255,255,0.4)', cursor: 'pointer',
              transition: 'color 0.2s', whiteSpace: 'nowrap',
            }}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
            >
              {t.nav.signIn}
            </button>
            <button onClick={onJoin} style={{
              fontFamily: lang === 'ar' ? 'inherit' : 'monospace', fontWeight: 700, fontSize: 14,
              letterSpacing: lang === 'ar' ? '0' : '0.1em',
              background: G, color: '#fff',
              padding: '10px 24px', border: 'none', cursor: 'pointer',
              boxShadow: `0 0 24px ${GG}`, whiteSpace: 'nowrap',
              transition: 'background 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.background = '#00c44a'; e.currentTarget.style.boxShadow = '0 0 36px rgba(0,166,62,0.6)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = G; e.currentTarget.style.boxShadow = `0 0 24px ${GG}`; }}
            >
              {t.nav.join}
            </button>
          </div>
        </>
      )}
    </nav>
  );
}
