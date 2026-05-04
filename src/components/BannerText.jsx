import { Scanlines } from './ui';

export default function BannerText() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden', height: 260, borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(/hero-gaming.jpg)', backgroundSize: 'cover', backgroundPosition: 'center 30%', filter: 'brightness(0.12) saturate(0.4)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(10,10,10,0.6)' }} />
      {/* Neon top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(0,166,62,0.5), transparent)' }} />
      <Scanlines />
      <div style={{
        position: 'relative', zIndex: 2,
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '0 56px', textAlign: 'center',
      }}>
        <p style={{
          fontFamily: 'Orbitron', fontWeight: 900,
          fontSize: 'clamp(18px, 2.2vw, 32px)',
          color: '#fff', lineHeight: 1.45,
          maxWidth: 920, letterSpacing: '0.02em',
        }}>
          WITH SKILLED PLAYERS, SHARP TACTICS, AND STRONG SPIRIT,{' '}
          <span style={{ color: '#00A63E', textShadow: '0 0 30px rgba(0,166,62,0.5)' }}>WE LEAD ESPORTS.</span>
        </p>
      </div>
    </section>
  );
}
