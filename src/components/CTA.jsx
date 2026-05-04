import { useEffect, useRef } from 'react';
import { G, GG } from '../constants';
import { useReveal, fadeStyle } from '../hooks/useReveal';
import { Scanlines, HudButton } from './ui';

function CTABg() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const section = canvas.parentElement;
    let W = (canvas.width = section.clientWidth || window.innerWidth);
    let paused = false;
    let H = (canvas.height = section.clientHeight || 600);
    let raf, t = 0;

    // PS button symbol types
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
        const s = size * 0.5;
        ctx.strokeRect(-s, -s, size, size);
      } else if (type === 'circle') {
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (type === 'cross') {
        const s = size * 0.42;
        ctx.moveTo(-s, -s); ctx.lineTo(s, s);
        ctx.moveTo(s, -s);  ctx.lineTo(-s, s);
        ctx.stroke();
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.restore();
    }

    // Three depth layers of symbols
    const layers = [
      // far — small, visible, slow
      Array.from({ length: 16 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: 14 + Math.random() * 16,
        vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.006,
        alpha: 0.18 + Math.random() * 0.15,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
      })),
      // mid — medium, clear
      Array.from({ length: 10 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: 30 + Math.random() * 26,
        vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.008,
        alpha: 0.28 + Math.random() * 0.2,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
      })),
      // near — large, bright, more movement
      Array.from({ length: 6 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        size: 56 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.42, vy: (Math.random() - 0.5) * 0.42,
        rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.01,
        alpha: 0.42 + Math.random() * 0.22,
        type: TYPES[Math.floor(Math.random() * TYPES.length)],
      })),
    ];

    // Soft ambient glow orbs that drift slowly
    const orbs = Array.from({ length: 4 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 120 + Math.random() * 180,
      vx: (Math.random() - 0.5) * 0.18, vy: (Math.random() - 0.5) * 0.18,
      phase: Math.random() * Math.PI * 2,
    }));

    // Tiny drifting particles
    const particles = Array.from({ length: 60 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15, vy: -0.1 - Math.random() * 0.25,
      r: 0.5 + Math.random() * 1.2,
      alpha: 0.2 + Math.random() * 0.4,
    }));

    function draw() {
      if (paused) return;
      t += 0.006;

      // Full clear each frame for clean look
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, W, H);

      // Ambient aurora-like horizontal bands
      for (let i = 0; i < 2; i++) {
        const bandY = H * (0.35 + i * 0.3) + Math.sin(t * 0.4 + i * 2.1) * H * 0.08;
        const grad = ctx.createLinearGradient(0, bandY - 80, 0, bandY + 80);
        grad.addColorStop(0, 'transparent');
        grad.addColorStop(0.5, `rgba(0,166,62,${0.025 + Math.sin(t * 0.5 + i) * 0.01})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.fillRect(0, bandY - 80, W, 160);
      }

      // Soft glow orbs
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

      // Depth layers — far to near
      layers.forEach(layer => {
        layer.forEach(s => {
          s.x += s.vx; s.y += s.vy;
          s.rot += s.rotV;
          if (s.x < -60) s.x = W + 60; if (s.x > W + 60) s.x = -60;
          if (s.y < -60) s.y = H + 60; if (s.y > H + 60) s.y = -60;
          // gentle breathing alpha
          const breathe = s.alpha + Math.sin(t * 0.8 + s.x * 0.01) * s.alpha * 0.3;
          drawSymbol(s.x, s.y, s.size, s.type, Math.max(0, breathe), s.rot);
        });
      });

      // Tiny drifting particles
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
      W = canvas.width = section.clientWidth || window.innerWidth;
      H = canvas.height = section.clientHeight || 600;
    };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); io.disconnect(); window.removeEventListener('resize', onResize); };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 1, zIndex: 0 }}
    />
  );
}

export default function CTA() {
  const [ref, visible] = useReveal(0.15);

  return (
    <section ref={ref} style={{ position: 'relative', padding: '160px 80px', background: '#050505', overflow: 'hidden' }}>
      {/* Animated canvas background */}
      <CTABg />
      <Scanlines />
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, rgba(0,166,62,0.06) 0%, rgba(5,5,5,0.55) 100%)' }} />
      {/* Top / bottom accent lines */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${G}, transparent)`, boxShadow: `0 0 16px ${GG}` }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${G}, transparent)` }} />

      <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2, ...fadeStyle(visible, 0, 'scale') }}>

        <div className="glitch-text" data-text="READY TO" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(48px, 7vw, 100px)', color: '#fff', lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', marginBottom: 8 }}>READY TO</div>
        <div className="glitch-text" data-text="LEVEL UP?" style={{ fontFamily: 'Orbitron', fontWeight: 900, fontSize: 'clamp(48px, 7vw, 100px)', color: G, lineHeight: 0.92, letterSpacing: '-0.02em', position: 'relative', textShadow: `0 0 60px ${GG}, 0 0 120px rgba(0,166,62,0.2)`, marginBottom: 48 }}>LEVEL UP?</div>

        <p style={{ fontFamily: 'Rajdhani', fontSize: 21, color: 'rgba(255,255,255,0.4)', lineHeight: 1.65, maxWidth: 600, margin: '0 auto 48px' }}>
          Join Earthlink Esports — train with pros, compete in tournaments, earn your place among champions.
        </p>

        <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
          <HudButton label="REGISTER_NOW" href="#" size="lg" variant="primary" />
          <HudButton label="LEARN_MORE" href="#" size="lg" />
        </div>
      </div>
    </section>
  );
}
