import { G, GG, LABELS, ABOUT_IMGS } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';

export default function About() {
  const [ref, visible] = useReveal(0.1);

  return (
    <section ref={ref} style={{ background: '#0a0a0a', padding: '120px 0', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 56px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 96, alignItems: 'start' }}>

          {/* Left — text */}
          <div style={fadeStyle(visible, 0, 'left')}>
            <div style={{ fontFamily: 'Rajdhani', fontSize: 12, fontWeight: 600, letterSpacing: '0.18em', textTransform: 'uppercase', color: G, textShadow: `0 0 8px ${GG}`, marginBottom: 32 }}>
              {LABELS.about}
            </div>
            <h2 style={{
              fontFamily: 'Orbitron', fontWeight: 900,
              fontSize: 'clamp(28px, 3vw, 44px)',
              color: '#fff', lineHeight: 1.1, marginBottom: 32, letterSpacing: '-0.01em',
            }}>
              WE'RE MORE THAN A GAMING CLUB —{' '}
              <span style={{ color: G, textShadow: `0 0 30px ${GG}` }}>WE'RE A COMMUNITY</span>{' '}
              OF PLAYERS WHO PLAY, COMPETE, AND GROW TOGETHER.
            </h2>

            <div style={{ height: 1, background: 'rgba(255,255,255,0.07)', marginBottom: 32 }} />

            <p style={{ fontFamily: 'Rajdhani', fontSize: 17, color: 'rgba(255,255,255,0.58)', lineHeight: 1.75, marginBottom: 32 }}>
              Founded in Iraq, Earthlink Esports has grown into the region's premier competitive gaming platform — offering pro coaching, weekly tournaments, and a community where every player can thrive.
            </p>

            <a href="#" style={{
              fontFamily: 'Rajdhani', fontSize: 13, fontWeight: 700,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.5)', textDecoration: 'none',
              transition: 'color 0.2s, text-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = G; e.currentTarget.style.textShadow = `0 0 10px ${GG}`; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; e.currentTarget.style.textShadow = 'none'; }}
            >
              About Us →
            </a>
          </div>

          {/* Right — image grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'auto auto', gap: 8, ...fadeStyle(visible, 0.15, 'right') }}>
            <div className="img-zoom" style={{ gridRow: '1 / 3', overflow: 'hidden' }}>
              <img src={ABOUT_IMGS[0]} alt="" style={{ width: '100%', height: 320, objectFit: 'cover', display: 'block', filter: 'brightness(0.72)' }} />
            </div>
            <div className="img-zoom" style={{ overflow: 'hidden' }}>
              <img src={ABOUT_IMGS[1]} alt="" style={{ width: '100%', height: 156, objectFit: 'cover', display: 'block', filter: 'brightness(0.72)' }} />
            </div>
            <div className="img-zoom" style={{ overflow: 'hidden' }}>
              <img src={ABOUT_IMGS[2]} alt="" style={{ width: '100%', height: 156, objectFit: 'cover', display: 'block', filter: 'brightness(0.72)' }} />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
