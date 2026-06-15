import { useState, useEffect, useRef } from 'react';
import { G, GG } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';
import { Scanlines, HudButton } from './ui';

function HeroBG() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf, t = 0, paused = false;

    const TYPES = ['triangle', 'square', 'circle', 'cross'];

    function drawSymbol(x, y, size, type, alpha, rotation) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#00A63E';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 28;
      ctx.shadowColor = '#00A63E';
      ctx.beginPath();
      if (type === 'triangle') {
        const h = size * 0.87;
        ctx.moveTo(0, -h * 0.67);
        ctx.lineTo(size * 0.5, h * 0.33);
        ctx.lineTo(-size * 0.5, h * 0.33);
        ctx.closePath();
        ctx.stroke();
      } else if (type === 'square') {
        ctx.strokeRect(-size * 0.5, -size * 0.5, size, size);
      } else if (type === 'circle') {
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        const s = size * 0.42;
        ctx.moveTo(-s, -s); ctx.lineTo(s, s);
        ctx.moveTo(s, -s);  ctx.lineTo(-s, s);
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    const layers = [
      Array.from({ length: 18 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: 14 + Math.random() * 16,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.006,
        alpha: 0.18 + Math.random() * 0.15,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
      })),
      Array.from({ length: 12 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: 30 + Math.random() * 26,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.008,
        alpha: 0.28 + Math.random() * 0.2,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
      })),
      Array.from({ length: 7 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: 56 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.42, vy: (Math.random() - 0.5) * 0.42,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.01,
        alpha: 0.42 + Math.random() * 0.22,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
      })),
    ];

    const orbs = Array.from({ length: 5 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 150 + Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2,
    }));

    const particles = Array.from({ length: 70 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15, vy: -0.1 - Math.random() * 0.25,
      r: 0.5 + Math.random() * 1.2,
      alpha: 0.2 + Math.random() * 0.4,
    }));

    function draw() {
      if (paused) return;
      t += 0.006;
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, W, H);

      // Aurora bands
      for (let i = 0; i < 2; i++) {
        const bandY = H * (0.35 + i * 0.3) + Math.sin(t * 0.4 + i * 2.1) * H * 0.08;
        const grad = ctx.createLinearGradient(0, bandY - 80, 0, bandY + 80);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, `rgba(0,166,62,${0.025 + Math.sin(t * 0.5 + i) * 0.01})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, bandY - 80, W, 160);
      }

      // Glow orbs
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
        const pulse = 0.07 + Math.sin(t * 0.6 + o.phase) * 0.035;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `rgba(0,166,62,${pulse})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // PS symbols — depth layers
      layers.forEach(layer => {
        layer.forEach(s => {
          s.x += s.vx; s.y += s.vy; s.rot += s.rotV;
          if (s.x < -60) s.x = W + 60; if (s.x > W + 60) s.x = -60;
          if (s.y < -60) s.y = H + 60; if (s.y > H + 60) s.y = -60;
          const breathe = s.alpha + Math.sin(t * 0.8 + s.x * 0.01) * s.alpha * 0.3;
          drawSymbol(s.x, s.y, s.size, s.type, Math.max(0, breathe), s.rot);
        });
      });

      // Drifting particles
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        const a = p.alpha * (0.6 + Math.sin(t + p.x * 0.05) * 0.4);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(92,241,164,${a})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    }

    draw();

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && paused) { paused = false; draw(); }
      else { paused = true; cancelAnimationFrame(raf); }
    }, { threshold: 0 });
    io.observe(canvas);

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 1, pointerEvents: 'none' }}
    />
  );
}

export default function Hero({ onJoin }) {
  const { t, lang } = useLang();
  const { isMobile } = useResponsive();
  const headingSize = lang === 'ar'
    ? (isMobile ? 'clamp(34px, 9vw, 60px)' : 'clamp(44px, 6.4vw, 88px)')
    : (isMobile ? 'clamp(40px, 12vw, 72px)' : 'clamp(64px, 9vw, 120px)');
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setTimeout(() => setLoaded(true), 80); }, []);

  const f = (delay = 0) => ({
    opacity: loaded ? 1 : 0,
    transform: loaded ? 'none' : 'translateY(28px)',
    transition: `opacity 1s ease ${delay}s, transform 1s ease ${delay}s`,
  });

  return (
    <section style={{
      position: 'relative', height: '100vh', minHeight: 700,
      overflow: 'hidden', background: '#050505',
    }}>
      <HeroBG />
      <Scanlines />

      {/* Centered content */}
      <div style={{
        position: 'relative', zIndex: 3, height: '100%',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', alignItems: 'center',
        textAlign: 'center', padding: isMobile ? '80px 20px 56px' : '80px 40px 48px',
      }}>
        {/* Live badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 18px', border: '1px solid rgba(0,166,62,0.35)', marginBottom: 44, ...f(0) }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: G, boxShadow: `0 0 8px ${G}`, animation: 'glowPulse 2s infinite' }} />
          <span style={{ fontFamily: 'monospace', fontSize: 10, color: G, letterSpacing: '0.18em' }}>{t.hero.badge}</span>
        </div>

        {/* Headings */}
        <div style={{ marginBottom: 4, ...f(0.1) }}>
          <div
            className="glitch-text"
            data-text={t.hero.line1}
            style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: headingSize, color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative' }}
          >
            {t.hero.line1}
          </div>
        </div>
        <div style={{ marginBottom: 44, ...f(0.18) }}>
          <div
            className="glitch-text"
            data-text={t.hero.line2}
            style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: headingSize, color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 60px ${GG}, 0 0 120px rgba(0,166,62,0.2)` }}
          >
            {t.hero.line2}
          </div>
        </div>

        {/* Tagline */}
        <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: isMobile ? 16 : 20, color: 'rgba(255,255,255,0.5)', maxWidth: 560, lineHeight: 1.7, marginBottom: 48, ...f(0.28) }}>
          {t.hero.tagline}
        </p>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 56, ...f(0.36) }}>
          <HudButton label={t.hero.getStarted} onClick={onJoin} size="lg" variant="primary" />
        </div>

      </div>

      {/* Scroll hint */}
      <div style={{ position: 'absolute', bottom: 44, left: '50%', transform: 'translateX(-50%)', zIndex: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.2em' }}>{t.hero.scroll}</span>
        <div style={{ width: 1, height: 28, background: `linear-gradient(to bottom, ${G}, transparent)`, animation: 'floatUp 2s ease-in-out infinite' }} />
      </div>

      {/* Ticker */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        height: 34, overflow: 'hidden', display: 'flex', alignItems: 'center',
        background: 'rgba(0,166,62,0.07)', borderTop: `1px solid rgba(0,166,62,0.2)`, zIndex: 5,
      }}>
        <div style={{ display: 'flex', animation: 'ticker 30s linear infinite', whiteSpace: 'nowrap', willChange: 'transform' }}>
          {[1, 2].map(k => (
            <span key={k} style={{ fontFamily: 'monospace', fontSize: 10, color: G, letterSpacing: '0.2em' }}>
              {t.hero.ticker.map(item => (
                <span key={item}>&nbsp;&nbsp;&nbsp;◆&nbsp;{item}</span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
