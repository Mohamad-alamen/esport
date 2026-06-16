import { G, GG } from '../constants';
import { useResponsive } from '../hooks/useResponsive';
import { Scanlines } from '../components/ui';

// Generic legal document page (Terms, Privacy, …).
// `data` is the matching i18n section: { back, kicker, title1, title2, updated, intro, sections, agree }
export default function LegalPage({ data, onHome, copyright }) {
  const { isMobile } = useResponsive();
  const titleSize = isMobile ? 'clamp(34px, 9vw, 54px)' : 'clamp(48px, 6vw, 84px)';

  return (
    <div style={{ minHeight: '100vh', background: '#070707', position: 'relative', overflow: 'hidden' }}>
      <Scanlines />
      {/* Ambient glow */}
      <div style={{ position: 'fixed', top: '-10%', left: '50%', transform: 'translateX(-50%)', width: 1000, height: 600, background: 'radial-gradient(ellipse at top, rgba(0,166,62,0.07) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Header */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: isMobile ? '16px 20px' : '20px 56px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(7,7,7,0.85)', backdropFilter: 'blur(8px)',
      }}>
        <img
          src="/H_Text_Logo_Green_EE_8k_Trans (1).png"
          alt="Earthlink Esports"
          onClick={onHome}
          style={{ height: isMobile ? 30 : 38, width: 'auto', display: 'block', cursor: 'pointer', filter: `drop-shadow(0 0 8px ${GG})` }}
        />
        <button onClick={onHome} style={{
          background: 'transparent', border: '1px solid rgba(255,255,255,0.18)', cursor: 'pointer',
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, fontWeight: 600,
          color: 'rgba(255,255,255,0.7)', padding: '9px 18px', transition: 'all 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.color = G; e.currentTarget.style.borderColor = G; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'; }}>
          {data.back}
        </button>
      </header>

      {/* Content */}
      <main style={{ position: 'relative', zIndex: 2, maxWidth: 860, margin: '0 auto', padding: isMobile ? '48px 20px 80px' : '88px 40px 120px' }}>
        {/* Title block */}
        <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13, color: G, textTransform: 'uppercase', marginBottom: 18 }}>
          {data.kicker}
        </div>
        <h1 style={{ margin: 0, marginBottom: 8 }}>
          <span className="glitch-text" data-text={data.title1} style={{ display: 'block', fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: '#fff', lineHeight: 0.95, letterSpacing: '-0.02em', position: 'relative' }}>{data.title1}</span>
          <span className="glitch-text" data-text={data.title2} style={{ display: 'block', fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: titleSize, color: G, lineHeight: 0.95, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 40px ${GG}` }}>{data.title2}</span>
        </h1>
        <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 14, marginBottom: 28 }}>
          {data.updated}
        </div>

        <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: isMobile ? 15 : 17, color: 'rgba(255,255,255,0.6)', lineHeight: 1.9, marginBottom: 8 }}>
          {data.intro}
        </p>

        <div style={{ height: 1, background: `linear-gradient(90deg, ${G}55, transparent)`, margin: '40px 0' }} />

        {/* Sections */}
        {data.sections.map(([heading, body]) => (
          <section key={heading} style={{ marginBottom: 36 }}>
            <h2 style={{
              fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 700,
              fontSize: isMobile ? 17 : 20, color: G, marginBottom: 12,
            }}>
              {heading}
            </h2>
            <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: isMobile ? 14 : 16, color: 'rgba(255,255,255,0.62)', lineHeight: 1.95, margin: 0 }}>
              {body}
            </p>
          </section>
        ))}

        {/* Agreement note */}
        <div style={{
          marginTop: 48, padding: isMobile ? '20px' : '28px 32px',
          background: 'rgba(0,166,62,0.06)', border: '1px solid rgba(0,166,62,0.25)',
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: isMobile ? 14 : 15,
          color: 'rgba(255,255,255,0.75)', lineHeight: 1.8,
        }}>
          {data.agree}
        </div>

        <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 40, textAlign: 'center' }}>
          {copyright}
        </div>
      </main>
    </div>
  );
}
