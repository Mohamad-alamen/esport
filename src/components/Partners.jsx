import { GG, PARTNERS } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';
import { useReveal, fadeStyle } from '../hooks/useReveal';

export default function Partners() {
  const { t } = useLang();
  const { isMobile } = useResponsive();
  const [ref, visible] = useReveal();

  return (
    <section ref={ref} style={{ borderTop: '1px solid rgba(0,166,62,0.1)', borderBottom: '1px solid rgba(0,166,62,0.1)', background: '#080808' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: isMobile ? '28px 16px' : '48px 80px', display: 'flex', flexDirection: isMobile ? 'column' : 'row', alignItems: 'center', gap: isMobile ? 14 : 48, ...fadeStyle(visible, 0) }}>
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.55)', whiteSpace: 'nowrap' }}>
          {t.partners.kicker}
        </span>
        {!isMobile && <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.08)' }} />}
        <div style={{ display: 'flex', flexWrap: isMobile ? 'wrap' : 'nowrap', justifyContent: 'center', flex: 1, width: isMobile ? '100%' : 'auto' }}>
          {PARTNERS.map((p, i) => (
            <div
              key={p}
              style={{
                flex: isMobile ? '0 0 33.33%' : 1, textAlign: 'center', padding: '12px',
                fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 700, fontSize: 11,
                color: 'rgba(255,255,255,0.55)', cursor: 'pointer', transition: 'color 0.2s, text-shadow 0.2s',
                borderRight: !isMobile && i < PARTNERS.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
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
