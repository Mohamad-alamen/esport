import { useReveal, fadeStyle } from '../hooks/useReveal';

// Drop your video file into /public and update this path
const VIDEO_SRC = 'https://cdn.prod.website-files.com/67dd801246bec500f0832874%2F67e22628165a6b1c009650c5_7914827-hd_1920_1080_30fps-transcode.mp4';
const FALLBACK_IMG = 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80';

const STATS = [
  { v: '500+', l: 'PLAYERS',    d: 'SETTING NEW STANDARDS IN\nESPORTS EXCELLENCE' },
  { v: '242',  l: 'MATCHES',    d: 'ENDLESS ACTION,\nUNFORGETTABLE MATCHES' },
  { v: '1M+',  l: 'SUPPORTERS', d: 'UNITING GAMERS WITH PRIDE\nAND PASSION' },
  { v: '190',  l: 'WINS',       d: 'A TRUE SHOWCASE OF SKILL\nAND DEDICATION' },
];

const CROSS_POS = [
  { top: 16, left: 16 },
  { top: 16, right: 16 },
  { bottom: 16, left: 16 },
  { bottom: 16, right: 16 },
];

export default function Banner() {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ background: '#050505', padding: '60px 80px' }}>

      {/* Constrained video card */}
      <div style={{
        position: 'relative', overflow: 'hidden', height: 560,
        maxWidth: 1280, margin: '0 auto',
        border: '1px solid rgba(255,255,255,0.08)',
      }}>

        {/* Video background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={FALLBACK_IMG}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            filter: 'brightness(1)',
          }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>

        {/* Corner crosshairs */}
        {CROSS_POS.map((pos, i) => (
          <div key={i} style={{
            position: 'absolute', ...pos, zIndex: 4,
            color: 'rgba(255,255,255,0.3)',
            fontFamily: 'monospace', fontSize: 20, lineHeight: 1,
            userSelect: 'none',
          }}>+</div>
        ))}

        {/* Stats bar */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'rgba(5,5,5,0.82)',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          zIndex: 3,
          ...fadeStyle(visible, 0.1),
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{
                padding: '28px 40px 32px',
                borderRight: i < 3 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{
                  fontFamily: 'monospace', fontSize: 10,
                  color: 'rgba(255,255,255,0.5)', letterSpacing: '0.18em',
                  marginBottom: 10,
                }}>
                  [ {stat.l} ]
                </div>
                <div style={{
                  fontFamily: 'Orbitron', fontWeight: 900, fontSize: 52,
                  color: '#fff', lineHeight: 1, marginBottom: 14,
                  letterSpacing: '-0.02em',
                }}>
                  {stat.v}
                </div>
                <div style={{
                  fontFamily: 'monospace', fontSize: 9,
                  color: 'rgba(255,255,255,0.48)', letterSpacing: '0.1em',
                  lineHeight: 1.8, textTransform: 'uppercase',
                  whiteSpace: 'pre-line',
                }}>
                  {stat.d}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </section>
  );
}
