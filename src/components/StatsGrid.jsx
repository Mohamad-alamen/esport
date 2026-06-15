import { G, GG, STATS } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Counter } from './ui';

const BAR_WIDTHS = ['78%', '62%', '88%', '72%'];

export default function StatsGrid() {
  const [ref, visible] = useReveal(0.1);

  return (
    <section ref={ref} style={{ background: '#050505', borderBottom: '1px solid rgba(0,166,62,0.12)' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', maxWidth: 1440, margin: '0 auto' }}>
        {STATS.map((s, i) => (
          <div
            key={i}
            style={{
              padding: '52px 48px',
              borderRight: i < 3 ? '1px solid rgba(0,166,62,0.1)' : 'none',
              position: 'relative',
              ...fadeStyle(visible, i * 0.1),
            }}
          >

            <div style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 'clamp(42px, 4vw, 60px)', color: '#fff', lineHeight: 1, marginBottom: 10, textShadow: `0 0 40px rgba(0,166,62,0.15)` }}>
              <Counter target={parseInt(s.v)} suffix={s.v.replace(/\d/g, '')} />
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', marginBottom: 18 }}>
              {s.l}
            </div>
            {/* Progress bar */}
            <div style={{ height: 1, background: 'rgba(0,166,62,0.08)', overflow: 'hidden' }}>
              <div style={{
                height: '100%', background: G,
                width: visible ? BAR_WIDTHS[i] : '0%',
                transition: `width 1.4s ease ${0.2 + i * 0.15}s`,
                boxShadow: `0 0 8px ${GG}`,
              }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
