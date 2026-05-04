import { GG, PARTNERS } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';

export default function Partners() {
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ borderTop: '1px solid rgba(0,166,62,0.1)', borderBottom: '1px solid rgba(0,166,62,0.1)', background: '#080808' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 80px', display: 'flex', alignItems: 'center', gap: 48, ...fadeStyle(visible, 0) }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.2em', whiteSpace: 'nowrap' }}>
          /// .PARTNERS
        </span>
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />
        <div style={{ display: 'flex', flex: 1 }}>
          {PARTNERS.map((p, i) => (
            <div
              key={p}
              style={{
                flex: 1, textAlign: 'center', padding: '12px',
                fontFamily: 'Orbitron', fontWeight: 700, fontSize: 11,
                color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em',
                cursor: 'pointer', transition: 'color 0.2s, text-shadow 0.2s',
                borderRight: i < PARTNERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
                ...fadeStyle(visible, i * 0.06),
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#fff'; e.currentTarget.style.textShadow = `0 0 12px ${GG}`; }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)'; e.currentTarget.style.textShadow = 'none'; }}
            >
              {p}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
