import { useState, useEffect, useRef } from 'react';
import { G, GG } from '../constants';
import { useLang } from '../LanguageContext';
import { useResponsive } from '../hooks/useResponsive';

// Replace {token} placeholders in a template string.
const fill = (str, vars) => str.replace(/\{(\w+)\}/g, (_, k) => (vars[k] != null ? vars[k] : ''));

/* ─── ANIMATED BACKGROUND ─── */
function AuthBG() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let raf, t = 0;
    const TYPES = ['triangle', 'square', 'circle', 'cross'];

    function drawSymbol(x, y, size, type, alpha, rot) {
      ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = '#00A63E'; ctx.lineWidth = 2;
      ctx.shadowBlur = 28; ctx.shadowColor = '#00A63E';
      ctx.beginPath();
      if (type === 'triangle') {
        const h = size * 0.87;
        ctx.moveTo(0, -h * 0.67); ctx.lineTo(size * 0.5, h * 0.33); ctx.lineTo(-size * 0.5, h * 0.33); ctx.closePath(); ctx.stroke();
      } else if (type === 'square') {
        ctx.strokeRect(-size * 0.5, -size * 0.5, size, size);
      } else if (type === 'circle') {
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2); ctx.stroke();
      } else {
        const s = size * 0.42;
        ctx.moveTo(-s, -s); ctx.lineTo(s, s); ctx.moveTo(s, -s); ctx.lineTo(-s, s); ctx.stroke();
      }
      ctx.shadowBlur = 0; ctx.globalAlpha = 1; ctx.restore();
    }

    const mk = (n, smin, smax, vmax, amin, abase) => Array.from({ length: n }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      size: smin + Math.random() * (smax - smin),
      vx: (Math.random() - 0.5) * vmax, vy: (Math.random() - 0.5) * vmax,
      rot: Math.random() * Math.PI * 2, rotV: (Math.random() - 0.5) * 0.008,
      alpha: amin + Math.random() * abase,
      type: TYPES[Math.floor(Math.random() * TYPES.length)],
    }));

    const layers = [mk(14, 14, 26, 0.16, 0.16, 0.13), mk(8, 30, 50, 0.24, 0.22, 0.15), mk(4, 56, 90, 0.34, 0.32, 0.18)];
    const orbs = Array.from({ length: 4 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: 180 + Math.random() * 220,
      vx: (Math.random() - 0.5) * 0.16, vy: (Math.random() - 0.5) * 0.16,
      phase: Math.random() * Math.PI * 2,
    }));
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15, vy: -0.1 - Math.random() * 0.22,
      r: 0.5 + Math.random() * 1.2, alpha: 0.18 + Math.random() * 0.4,
    }));

    function draw() {
      t += 0.006;
      ctx.fillStyle = '#050505'; ctx.fillRect(0, 0, W, H);
      orbs.forEach(o => {
        o.x += o.vx; o.y += o.vy;
        if (o.x < -o.r) o.x = W + o.r; if (o.x > W + o.r) o.x = -o.r;
        if (o.y < -o.r) o.y = H + o.r; if (o.y > H + o.r) o.y = -o.r;
        const pulse = 0.06 + Math.sin(t * 0.6 + o.phase) * 0.03;
        const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
        grad.addColorStop(0, `rgba(0,166,62,${pulse})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2); ctx.fill();
      });
      layers.forEach(layer => {
        layer.forEach(s => {
          s.x += s.vx; s.y += s.vy; s.rot += s.rotV;
          if (s.x < -60) s.x = W + 60; if (s.x > W + 60) s.x = -60;
          if (s.y < -60) s.y = H + 60; if (s.y > H + 60) s.y = -60;
          const breathe = s.alpha + Math.sin(t * 0.8 + s.x * 0.01) * s.alpha * 0.3;
          drawSymbol(s.x, s.y, s.size, s.type, Math.max(0, breathe), s.rot);
        });
      });
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
        if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
        const a = p.alpha * (0.6 + Math.sin(t + p.x * 0.05) * 0.4);
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(92,241,164,${a})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    const onResize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
    window.addEventListener('resize', onResize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', onResize); };
  }, []);
  return <canvas ref={ref} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />;
}

/* ─── ERROR UI ─── */
function ErrorMsg({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginTop: 6, padding: '8px 12px',
      background: 'rgba(255,50,50,0.07)',
      border: '1px solid rgba(255,80,80,0.35)',
    }}>
      <span style={{ color: '#ff5151', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, lineHeight: 1, flexShrink: 0 }}>✕</span>
      <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: '#ff8080', }}>{msg}</span>
    </div>
  );
}

function ErrorBanner({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '14px 18px', marginBottom: 22,
      background: 'rgba(255,50,50,0.08)',
      border: '1px solid rgba(255,80,80,0.4)',
    }}>
      <HudCorners size={8} color="rgba(255,80,80,0.5)" />
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0, marginTop: 1 }}>
        <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          stroke="#ff5151" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: '#ff8080', lineHeight: 1.55 }}>{msg}</span>
    </div>
  );
}

function Lockout({ cooldown, onRetry }) {
  const { t } = useLang();
  const a = t.auth;
  const [left, setLeft] = useState(cooldown);
  useEffect(() => {
    if (left <= 0) return;
    const t = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  return (
    <div style={{ textAlign: 'center', padding: '12px 0 24px', animation: 'fadeUp 0.4s ease' }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 76, height: 76, position: 'relative',
        border: '2px solid rgba(255,80,80,0.45)',
        boxShadow: '0 0 40px rgba(255,50,50,0.18), inset 0 0 24px rgba(255,50,50,0.07)',
        marginBottom: 28,
      }}>
        <HudCorners size={12} color="rgba(255,80,80,0.5)" />
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <rect x="5" y="11" width="14" height="10" rx="1.5" stroke="#ff5151" strokeWidth="1.8" />
          <path d="M8 11V7a4 4 0 018 0v4" stroke="#ff5151" strokeWidth="1.8" strokeLinecap="round" />
          <circle cx="12" cy="16" r="1.5" fill="#ff5151" />
        </svg>
      </div>
      <div style={{
        fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 22,
        color: '#ff5151', marginBottom: 14,
        textShadow: '0 0 30px rgba(255,50,50,0.5)',
      }}>{a.lockout.title}</div>
      <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, maxWidth: 340, margin: '0 auto 28px' }}>
        {a.lockout.body}
      </p>
      {left > 0 && (
        <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 28 }}>
          {a.lockout.tryAgainIn}{' '}
          <span style={{ color: '#ff8080', fontSize: 17, fontWeight: 700, }}>{fmt(left)}</span>
        </div>
      )}
      <button onClick={onRetry} disabled={left > 0} style={{
        fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, background: left > 0 ? 'transparent' : 'rgba(255,80,80,0.12)',
        border: `1px solid ${left > 0 ? 'rgba(255,80,80,0.2)' : 'rgba(255,80,80,0.45)'}`,
        color: left > 0 ? 'rgba(255,255,255,0.25)' : '#ff8080',
        padding: '13px 36px', cursor: left > 0 ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s', position: 'relative',
      }}>
        {left > 0 ? `${a.lockout.locked} — ${fmt(left)}` : a.lockout.retry}
      </button>
    </div>
  );
}

/* ─── PRIMITIVES ─── */
function HudCorners({ size = 16, color = 'rgba(255,255,255,0.35)', glow = false }) {
  return [
    { top: 0, left: 0, bt: 1, bl: 1 },
    { top: 0, right: 0, bt: 1, br: 1 },
    { bottom: 0, left: 0, bb: 1, bl: 1 },
    { bottom: 0, right: 0, bb: 1, br: 1 },
  ].map((c, i) => (
    <div key={i} style={{
      position: 'absolute', top: c.top, right: c.right, bottom: c.bottom, left: c.left,
      width: size, height: size, zIndex: 4, pointerEvents: 'none',
      borderTop: c.bt ? `2px solid ${color}` : 'none',
      borderRight: c.br ? `2px solid ${color}` : 'none',
      borderBottom: c.bb ? `2px solid ${color}` : 'none',
      borderLeft: c.bl ? `2px solid ${color}` : 'none',
      filter: glow ? `drop-shadow(0 0 6px ${color})` : 'none',
      transition: 'all 0.3s',
    }} />
  ));
}

function GlitchH({ text, color = '#fff', size = 44, extra = {} }) {
  return (
    <div className="glitch-text" data-text={text} style={{
      fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: size, color,
      lineHeight: 0.95, letterSpacing: '-0.015em', position: 'relative', ...extra,
    }}>{text}</div>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
      <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>
        <span style={{ color: G }}>///</span> {children}
      </span>
      {hint && (
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.55)', }}>
          {hint}
        </span>
      )}
    </div>
  );
}

function Field({ type = 'text', value, onChange, placeholder, autoComplete, onFocusChange, focused, hasError }) {
  const { t } = useLang();
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';
  const realType = isPw && showPw ? 'text' : type;
  const filled = value && value.length > 0;
  return (
    <div style={{
      position: 'relative',
      background: hasError ? 'rgba(255,50,50,0.06)' : (focused ? 'rgba(0,166,62,0.1)' : '#111'),
      border: `1px solid ${hasError ? 'rgba(255,80,80,0.55)' : (focused ? G : (filled ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)'))}`,
      boxShadow: hasError ? '0 0 14px rgba(255,50,50,0.15)' : (focused ? `0 0 22px ${GG}, inset 0 0 22px rgba(0,166,62,0.06)` : 'none'),
      transition: 'all 0.25s',
      display: 'flex', alignItems: 'center',
    }}>
      <HudCorners size={10} color={focused ? G : 'rgba(255,255,255,0.25)'} />
      <span style={{
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: focused ? G : 'rgba(255,255,255,0.5)',
        transition: 'color 0.2s',
      }}>{'>'}</span>
      <input
        type={realType} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        onFocus={() => onFocusChange && onFocusChange(true)}
        onBlur={() => onFocusChange && onFocusChange(false)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          padding: '16px 18px 16px 36px',
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16, fontWeight: 500,
          color: '#fff', width: '100%',
        }}
      />
      {isPw && (
        <button type="button" onClick={() => setShowPw(s => !s)} style={{
          background: 'transparent', border: 'none',
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.5)',
          padding: '0 18px', cursor: 'pointer', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = G}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          {showPw ? t.auth.hide : t.auth.show}
        </button>
      )}
    </div>
  );
}

function FieldRow({ label, hint, error, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 22 }}>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <Field {...rest} focused={focused} onFocusChange={setFocused} hasError={!!error} />
      {error && <ErrorMsg msg={error} />}
    </div>
  );
}

function PrimaryBtn({ label, onClick, disabled, loading }) {
  const { t, lang } = useLang();
  const [hov, setHov] = useState(false);
  const cut = 18;
  const clip = `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick} disabled={disabled || loading}
      style={{
        clipPath: clip, width: '100%',
        background: disabled ? 'rgba(0,166,62,0.3)' : (hov ? '#00c44a' : G),
        color: '#fff', border: 'none',
        padding: '17px 24px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 700, fontSize: 13,
        textTransform: 'uppercase',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        boxShadow: hov && !disabled ? `0 0 36px ${GG}` : `0 0 18px rgba(0,166,62,0.25)`,
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
      }}>
      {loading ? (
        <>
          <span style={{
            width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite',
          }} />
          <span>{t.auth.authenticating}</span>
        </>
      ) : (
        <><span>{label}</span><span style={{ fontSize: 16 }}>{lang === 'ar' ? '←' : '→'}</span></>
      )}
    </button>
  );
}

function GoogleBtn({ onClick }) {
  const { t } = useLang();
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        background: hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
        padding: '15px 24px',
        fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 600, fontSize: 12,
        color: hov ? '#fff' : 'rgba(255,255,255,0.85)',
        textTransform: 'uppercase', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        transition: 'all 0.2s', position: 'relative',
      }}>
      <HudCorners size={10} color={hov ? G : 'rgba(255,255,255,0.18)'} />
      <svg width="18" height="18" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
      <span>{t.auth.google}</span>
    </button>
  );
}

function Divider({ label = 'OR' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '26px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12))' }} />
      <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.4)', }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />
    </div>
  );
}

/* ─── PASSWORD STRENGTH ─── */
function strength(pw) {
  if (!pw) return { score: 0, key: null, color: 'rgba(255,255,255,0.3)' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { key: 'weak', color: '#ff5151' },
    { key: 'weak', color: '#ff5151' },
    { key: 'ok', color: '#ffae3a' },
    { key: 'strong', color: G },
    { key: 'elite', color: G },
  ];
  return { score: s, ...map[s] };
}

function StrengthBar({ pw }) {
  const { t } = useLang();
  const { score, key, color } = strength(pw);
  const label = key ? t.auth.pwStrength[key] : '—';
  return (
    <div style={{ marginTop: -14, marginBottom: 22 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[0, 1, 2, 3].map(i => (
          <div key={i} style={{
            flex: 1, height: 3,
            background: i < score ? color : 'rgba(255,255,255,0.08)',
            boxShadow: i < score ? `0 0 6px ${color}` : 'none',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.4)', }}>{t.auth.pwStrengthLabel}</span>
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9, color, fontWeight: 700 }}>{label}</span>
      </div>
    </div>
  );
}

function ScreenHeader({ slug, line1, line2, sub }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: G, textTransform: 'uppercase', marginBottom: 14 }}>
        /// {slug}
      </div>
      <GlitchH text={line1} extra={{ marginBottom: 4 }} />
      <GlitchH text={line2} color={G} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 18 }} />
      <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 380 }}>{sub}</p>
    </div>
  );
}

/* ─── SIGN IN ─── */
const MAX_SIGNIN_ATTEMPTS = 5;
const SIGNIN_LOCKOUT_SECS = 120;

function SignIn({ go }) {
  const { t } = useLang();
  const a = t.auth.signin;
  const [identifier, setIdentifier] = useState('');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);

  const submit = e => {
    e && e.preventDefault();
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (pw === 'demo1234') { go('__success__'); return; }
      const next = attempts + 1;
      setAttempts(next);
      if (next >= MAX_SIGNIN_ATTEMPTS) {
        setLocked(true);
      } else {
        const rem = MAX_SIGNIN_ATTEMPTS - next;
        setError(fill(a.errTemplate, { n: rem, word: rem === 1 ? t.auth.attempt : t.auth.attempts }));
      }
    }, 1000);
  };

  if (locked) return (
    <>
      <ScreenHeader slug={a.slug} line1={a.line1} line2={a.line2} sub="" />
      <Lockout cooldown={SIGNIN_LOCKOUT_SECS} onRetry={() => { setLocked(false); setAttempts(0); setError(''); setPw(''); }} />
    </>
  );

  return (
    <form onSubmit={submit}>
      <ScreenHeader
        slug={a.slug}
        line1={a.line1}
        line2={a.line2}
        sub={a.sub}
      />

      <FieldRow label={a.idLabel} type="text" autoComplete="username"
        value={identifier} onChange={e => { setIdentifier(e.target.value); setError(''); }}
        placeholder={a.idPlaceholder} />

      <FieldRow label={a.pwLabel} type="password" autoComplete="current-password"
        hint={<a onClick={e => { e.preventDefault(); go('forgot'); }}
          style={{ color: G, textDecoration: 'none', cursor: 'pointer' }}>{a.forgot}</a>}
        value={pw} onChange={e => { setPw(e.target.value); setError(''); }}
        placeholder={a.pwPlaceholder} />

      <ErrorBanner msg={error} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 26, cursor: 'pointer' }}
        onClick={() => setRemember(r => !r)}>
        <div style={{
          width: 16, height: 16, border: `1.5px solid ${remember ? G : 'rgba(255,255,255,0.3)'}`,
          background: remember ? G : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: remember ? `0 0 8px ${GG}` : 'none', transition: 'all 0.2s', flexShrink: 0,
        }}>
          {remember && <span style={{ color: '#fff', fontSize: 11, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.65)', }}>
          {a.remember}
        </span>
      </div>

      <PrimaryBtn label={a.submit} loading={loading} disabled={!identifier || !pw} />

      <div style={{ textAlign: 'center', marginTop: 26, fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
        {a.newTo}{' '}
        <a onClick={e => { e.preventDefault(); go('create'); }} style={{
          color: G, textDecoration: 'none', cursor: 'pointer', fontWeight: 700,
          textTransform: 'uppercase', fontSize: 13,
        }}>{a.createLink}</a>
      </div>
    </form>
  );
}

/* ─── FORGOT PASSWORD ─── */
function Forgot({ go }) {
  const { t } = useLang();
  const { isMobile } = useResponsive();
  const a = t.auth.forgot;
  const [step, setStep] = useState(0);
  const [phone, setPhone] = useState('');
  const [pw, setPw] = useState('');
  const [pw2, setPw2] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneFocus, setPhoneFocus] = useState(false);
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resendIn, setResendIn] = useState(0);
  const otpRefs = useRef([]);
  const code = digits.join('');

  useEffect(() => {
    if (step !== 1) return;
    setResendIn(60);
    const t = setInterval(() => setResendIn(r => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, [step]);

  const phoneValid = phone.replace(/\D/g, '').length >= 9;
  const otpValid = code.length === 6;
  const hasLen = pw.length >= 8, hasLetter = /[A-Za-z]/.test(pw), hasNum = /\d/.test(pw);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const pwValid = hasLen && hasLetter && hasNum && pw === pw2 && pw2.length > 0;

  const sendOtp = () => { if (!phoneValid) return; setLoading(true); setTimeout(() => { setLoading(false); setStep(1); }, 1000); };
  const verify  = () => { if (!otpValid) return; setLoading(true); setTimeout(() => { setLoading(false); setStep(2); }, 900); };
  const reset   = () => { if (!pwValid) return; setLoading(true); setTimeout(() => { setLoading(false); setStep(3); }, 1100); };

  const onDigit = (i, v) => {
    const c = v.replace(/\D/g, '').slice(-1);
    const nd = [...digits]; nd[i] = c; setDigits(nd);
    if (c && i < 5) otpRefs.current[i + 1] && otpRefs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) otpRefs.current[i - 1] && otpRefs.current[i - 1].focus();
  };

  const ProgressDots = () => (
    <div style={{ display: 'flex', gap: 6, marginBottom: 26 }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{ flex: 1, height: 3, background: i < step ? 'rgba(0,166,62,0.5)' : (i === step ? G : 'rgba(255,255,255,0.08)'), boxShadow: i === step ? `0 0 8px ${G}` : 'none', transition: 'all 0.4s' }} />
      ))}
    </div>
  );

  if (step === 3) {
    return (
      <div>
        <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: G, marginBottom: 14 }}>/// {a.successSlug}</div>
        <GlitchH text={a.successLine1} extra={{ marginBottom: 4 }} />
        <GlitchH text={a.successLine2} color={G} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 28 }} />
        <div style={{ position: 'relative', border: `1px solid ${G}`, background: 'rgba(0,166,62,0.05)', padding: '24px 28px', marginBottom: 28 }}>
          <HudCorners size={14} color={G} glow />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 38, height: 38, flexShrink: 0, border: `1.5px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 12px ${GG}` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke={G} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: G, marginBottom: 6 }}>{a.resetComplete}</div>
              <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16, color: '#fff', lineHeight: 1.5, fontWeight: 600 }}>{a.successMsg}</div>
              <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginTop: 8 }}>{a.successSub}</div>
            </div>
          </div>
        </div>
        <PrimaryBtn label={a.backToSignin} onClick={() => go('signin')} />
      </div>
    );
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: G, marginBottom: 14 }}>/// {a.slug}</div>
      <GlitchH text={a.line1} extra={{ marginBottom: 4 }} />
      <GlitchH text={a.line2} color={G} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 18 }} />
      <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 400, marginBottom: 28 }}>
        {step === 0 && a.sub0}
        {step === 1 && fill(a.sub1Template, { phone: phone || '7XX XXX XXXX' })}
        {step === 2 && a.sub2}
      </p>

      <ProgressDots />

      {step === 0 && (
        <div>
          <FieldLabel hint={a.autoDetected}>{a.phoneLabel}</FieldLabel>
          <div style={{ display: 'flex', position: 'relative', background: phoneFocus ? 'rgba(0,166,62,0.1)' : '#111', border: `1px solid ${phoneFocus ? G : 'rgba(255,255,255,0.25)'}`, boxShadow: phoneFocus ? `0 0 22px ${GG}` : 'none', transition: 'all 0.2s', marginBottom: 4 }}>
            <HudCorners size={10} color={phoneFocus ? G : 'rgba(255,255,255,0.3)'} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: '1px solid rgba(255,255,255,0.2)', flexShrink: 0 }}>
              <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, fontWeight: 700, color: '#fff', }}>IQ</span>
              <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13, color: G, }}>+964</span>
            </div>
            <input type="tel" value={phone} placeholder={a.phonePlaceholder} autoComplete="tel"
              onFocus={() => setPhoneFocus(true)} onBlur={() => setPhoneFocus(false)}
              onChange={e => setPhone(e.target.value.replace(/[^\d ]/g, ''))}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '16px 18px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16, fontWeight: 500, color: '#fff', }} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '14px 0 28px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2z" stroke={G} strokeWidth="1.6" /></svg>
            <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.6)' }}>{a.whatsappNote}<span style={{ color: G, fontWeight: 700 }}>{a.whatsapp}</span>.</span>
          </div>
          <PrimaryBtn label={a.sendCode} loading={loading} disabled={!phoneValid} onClick={sendOtp} />
        </div>
      )}

      {step === 1 && (
        <div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
            {digits.map((d, i) => {
              const filled = d !== '';
              return (
                <input key={i} ref={el => otpRefs.current[i] = el} value={d} inputMode="numeric" maxLength={1}
                  onChange={e => onDigit(i, e.target.value)} onKeyDown={e => onKey(i, e)}
                  style={{ width: isMobile ? 44 : 52, height: isMobile ? 56 : 64, textAlign: 'center', background: filled ? 'rgba(0,166,62,0.12)' : '#111', border: `1px solid ${filled ? G : 'rgba(255,255,255,0.28)'}`, boxShadow: filled ? `0 0 16px ${GG}` : 'none', color: '#fff', fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: isMobile ? 20 : 24, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 22px ${GG}`; }}
                  onBlur={e => { if (!e.target.value) { e.target.style.borderColor = 'rgba(255,255,255,0.28)'; e.target.style.boxShadow = 'none'; } }} />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0 28px' }}>
            <button type="button" onClick={() => setStep(0)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>{a.changeNumber}</button>
            <button type="button" onClick={() => resendIn === 0 && setResendIn(60)} disabled={resendIn > 0}
              style={{ background: 'transparent', border: 'none', cursor: resendIn > 0 ? 'not-allowed' : 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: resendIn > 0 ? 'rgba(255,255,255,0.3)' : G }}>
              {resendIn > 0 ? fill(a.resendInTemplate, { secs: resendIn }) : a.resend}
            </button>
          </div>
          <PrimaryBtn label={a.verifyCode} loading={loading} disabled={!otpValid} onClick={verify} />
        </div>
      )}

      {step === 2 && (
        <div>
          <FieldRow label={a.newPw} type="password" autoComplete="new-password" placeholder={a.newPwPlaceholder}
            value={pw} onChange={e => setPw(e.target.value)} />
          <StrengthBar pw={pw} />
          <FieldRow label={a.confirmPw} type="password" autoComplete="new-password" placeholder={a.confirmPwPlaceholder}
            hint={mismatch ? <span style={{ color: '#ff5151' }}>{t.auth.noMatch}</span> : (pw2 && !mismatch ? <span style={{ color: G }}>{t.auth.match}</span> : null)}
            value={pw2} onChange={e => setPw2(e.target.value)} />
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: -6, marginBottom: 26 }}>
            {[[t.auth.reqs.len, hasLen], [t.auth.reqs.letter, hasLetter], [t.auth.reqs.num, hasNum]].map(([txt, ok]) => (
              <span key={txt} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: ok ? G : 'rgba(255,255,255,0.4)' }}>
                <span style={{ width: 12, height: 12, border: `1px solid ${ok ? G : 'rgba(255,255,255,0.25)'}`, background: ok ? G : 'transparent', color: '#fff', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ok ? '✓' : ''}</span>
                {txt}
              </span>
            ))}
          </div>
          <PrimaryBtn label={a.resetPw} loading={loading} disabled={!pwValid} onClick={reset} />
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 26, fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
        {a.remembered}{' '}
        <a onClick={e => { e.preventDefault(); go('signin'); }} style={{ color: G, textDecoration: 'none', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', fontSize: 13 }}>{a.backLink}</a>
      </div>
    </form>
  );
}

/* ─── REGISTER WIZARD ─── */
const AVATARS = ['Striker', 'Phoenix', 'Viper', 'Nova', 'Raven', 'Titan', 'Ghost', 'Blaze'].map(
  s => ({ id: s, url: `https://api.dicebear.com/7.x/bottts/svg?seed=${s}&backgroundColor=0a0a0a` })
);

function WizBtn({ label, onClick, disabled, loading, loadingLabel = 'PROCESSING...', arrow = '→' }) {
  const { lang } = useLang();
  const dispArrow = lang === 'ar' ? (arrow === '→' ? '←' : arrow === '←' ? '→' : arrow) : arrow;
  const [hov, setHov] = useState(false);
  const cut = 16;
  const clip = `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;
  return (
    <button type="button" onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      onClick={onClick} disabled={disabled || loading}
      style={{
        clipPath: clip, flex: 1,
        background: disabled ? 'rgba(0,166,62,0.25)' : (hov ? '#00c44a' : G),
        color: '#fff', border: 'none', padding: '16px 24px',
        fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 700, fontSize: 13,
        textTransform: 'uppercase',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        boxShadow: hov && !disabled ? `0 0 32px ${GG}` : `0 0 16px rgba(0,166,62,0.22)`,
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
      {loading ? (
        <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><span>{loadingLabel}</span></>
      ) : (
        <><span>{label}</span>{dispArrow && <span style={{ fontSize: 15 }}>{dispArrow}</span>}</>
      )}
    </button>
  );
}

function GhostBtn({ label, onClick, arrow = '←' }) {
  const { lang } = useLang();
  const dispArrow = lang === 'ar' ? (arrow === '→' ? '←' : arrow === '←' ? '→' : arrow) : arrow;
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'transparent',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.14)'}`,
        color: hov ? '#fff' : 'rgba(255,255,255,0.6)',
        padding: '16px 22px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontWeight: 700, fontSize: 12,
        textTransform: 'uppercase', cursor: 'pointer',
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
      }}>
      {dispArrow && <span style={{ fontSize: 15 }}>{dispArrow}</span>}<span>{label}</span>
    </button>
  );
}

function NavRow({ children }) {
  return <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>{children}</div>;
}

function MiniLabel({ children, hint }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
      <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase' }}>
        <span style={{ color: G }}>///</span> {children}
      </span>
      {hint && <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9, color: 'rgba(255,255,255,0.55)', }}>{hint}</span>}
    </div>
  );
}

function Select({ value, onChange, options, placeholder }) {
  const [focus, setFocus] = useState(false);
  return (
    <div style={{ position: 'relative', flex: 1 }}>
      <select value={value} onChange={onChange} onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          appearance: 'none', WebkitAppearance: 'none', width: '100%',
          background: focus ? 'rgba(0,166,62,0.1)' : '#111',
          border: `1px solid ${focus ? G : (value ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.25)')}`,
          boxShadow: focus ? `0 0 18px ${GG}` : 'none',
          color: value ? '#fff' : 'rgba(255,255,255,0.55)',
          fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 15, fontWeight: 500,
          padding: '15px 36px 15px 16px', outline: 'none', cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o.v} value={o.v} style={{ background: '#0a0a0a' }}>{o.l}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focus ? G : 'rgba(255,255,255,0.4)', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11 }}>▼</span>
    </div>
  );
}

function StepHead({ n, slug, line1, line2, sub }) {
  const { t } = useLang();
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: G, }}>/// {slug}</span>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)', }}>{t.auth.reg.stepLabel} {String(n).padStart(2, '0')} / 06</span>
      </div>
      <GlitchH text={line1} size={38} extra={{ marginBottom: 2 }} />
      <GlitchH text={line2} color={G} size={38} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 14 }} />
      <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, maxWidth: 440 }}>{sub}</p>
    </div>
  );
}

function RegProgressDots({ step }) {
  return (
    <div style={{ display: 'flex', gap: 5, marginBottom: 28 }}>
      {[0, 1, 2, 3, 4, 5].map(i => (
        <div key={i} style={{ flex: 1, height: 3, background: i < step ? 'rgba(0,166,62,0.5)' : (i === step ? G : 'rgba(255,255,255,0.08)'), boxShadow: i === step ? `0 0 8px ${G}` : 'none', transition: 'all 0.4s' }} />
      ))}
    </div>
  );
}

const TAKEN_NICKNAMES = ['shadowstrike', 'xghost', 'viper99', 'neon'];

function StepInfo({ data, set, next }) {
  const { t } = useLang();
  const a = t.auth.reg.info;
  const days = Array.from({ length: 31 }, (_, i) => ({ v: String(i + 1), l: String(i + 1).padStart(2, '0') }));
  const months = a.months.map((m, i) => ({ v: String(i + 1), l: m }));
  const years = Array.from({ length: 44 }, (_, i) => ({ v: String(2013 - i), l: String(2013 - i) }));
  const [nicknameError, setNicknameError] = useState('');
  const [loading, setLoading] = useState(false);
  const valid = data.fullName.trim() && data.nickname.trim() && data.dobD && data.dobM && data.dobY && data.gender;

  const tryNext = () => {
    const taken = TAKEN_NICKNAMES.includes(data.nickname.trim().toLowerCase());
    if (taken) {
      setNicknameError(fill(a.nickTakenTemplate, { nick: data.nickname }));
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); next(); }, 800);
  };

  return (
    <div>
      <StepHead n={1} slug={a.slug} line1={a.line1} line2={a.line2}
        sub={a.sub} />
      <FieldRow label={a.fullName} placeholder={a.fullNamePlaceholder}
        value={data.fullName} onChange={e => set({ fullName: e.target.value })} />
      <FieldRow label={a.nickname} placeholder={a.nicknamePlaceholder}
        value={data.nickname} onChange={e => { set({ nickname: e.target.value }); setNicknameError(''); }}
        error={nicknameError} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(0,166,62,0.05)', border: '1px solid rgba(0,166,62,0.2)', padding: '12px 16px', marginTop: -8, marginBottom: 24 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect x="5" y="11" width="14" height="9" rx="1.5" stroke={G} strokeWidth="1.8" />
          <path d="M8 11V8a4 4 0 018 0v3" stroke={G} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.45 }}>{a.privateNote}</span>
      </div>
      <MiniLabel>{a.dob}</MiniLabel>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <Select value={data.dobD} onChange={e => set({ dobD: e.target.value })} options={days} placeholder={a.day} />
        <Select value={data.dobM} onChange={e => set({ dobM: e.target.value })} options={months} placeholder={a.month} />
        <Select value={data.dobY} onChange={e => set({ dobY: e.target.value })} options={years} placeholder={a.year} />
      </div>
      <MiniLabel>{a.gender}</MiniLabel>
      <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
        {[{ v: 'Male', l: a.male }, { v: 'Female', l: a.female }].map(g => {
          const on = data.gender === g.v;
          return (
            <button key={g.v} type="button" onClick={() => set({ gender: g.v })}
              style={{ flex: 1, position: 'relative', background: on ? 'rgba(0,166,62,0.1)' : 'rgba(0,0,0,0.5)', border: `1px solid ${on ? G : 'rgba(255,255,255,0.1)'}`, boxShadow: on ? `0 0 18px ${GG}` : 'none', color: on ? '#fff' : 'rgba(255,255,255,0.6)', padding: '15px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, fontWeight: 700, textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
              {on && <HudCorners size={9} color={G} />}
              {g.l}
            </button>
          );
        })}
      </div>
      <NavRow><WizBtn label={a.continue} disabled={!valid} loading={loading} loadingLabel={a.checking} onClick={tryNext} /></NavRow>
    </div>
  );
}

function StepAvatar({ data, set, next, back }) {
  const { t } = useLang();
  const a = t.auth.reg.avatar;
  return (
    <div>
      <StepHead n={2} slug={a.slug} line1={a.line1} line2={a.line2}
        sub={a.sub} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {AVATARS.map((a, i) => {
          const on = data.avatar === i;
          return (
            <button key={a.id} type="button" onClick={() => set({ avatar: i })}
              style={{ position: 'relative', aspectRatio: '1/1', background: on ? 'rgba(0,166,62,0.12)' : '#0a0a0a', border: `1px solid ${on ? G : 'rgba(255,255,255,0.08)'}`, boxShadow: on ? `0 0 22px ${GG}` : 'none', cursor: 'pointer', padding: 8, transition: 'all 0.2s', transform: on ? 'translateY(-3px)' : 'none' }}>
              {on && <HudCorners size={11} color={G} />}
              <img src={a.url} alt={a.id} style={{ width: '100%', height: '100%', objectFit: 'contain', filter: on ? 'none' : 'grayscale(0.4) opacity(0.8)', transition: 'filter 0.2s' }} />
              {on && <span style={{ position: 'absolute', bottom: 4, right: 4, width: 18, height: 18, background: G, color: '#fff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 8px ${GG}` }}>✓</span>}
            </button>
          );
        })}
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 16, textAlign: 'center' }}>
        {data.avatar != null ? fill(a.selectedTemplate, { n: String(data.avatar + 1).padStart(2, '0') }) : a.noSelection}
      </div>
      <NavRow>
        <GhostBtn label={a.back} onClick={back} />
        <GhostBtn label={a.skip} arrow={null} onClick={() => { set({ avatar: data.avatar == null ? 0 : data.avatar }); next(); }} />
        <WizBtn label={a.continue} onClick={next} />
      </NavRow>
    </div>
  );
}

const REGISTERED_PHONES = ['7001234567', '7701234567'];

function StepPhone({ data, set, next, back }) {
  const { t } = useLang();
  const a = t.auth.reg.phone;
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const valid = data.phone.replace(/\D/g, '').length >= 9;

  const send = () => {
    if (!valid) return;
    setPhoneError('');
    const normalized = data.phone.replace(/\D/g, '');
    if (REGISTERED_PHONES.includes(normalized)) {
      setPhoneError(a.alreadyReg);
      return;
    }
    setLoading(true);
    setTimeout(() => { setLoading(false); next(); }, 1100);
  };

  return (
    <div>
      <StepHead n={3} slug={a.slug} line1={a.line1} line2={a.line2}
        sub={a.sub} />
      <MiniLabel>{a.phoneLabel}</MiniLabel>
      <div style={{ display: 'flex', position: 'relative', background: phoneError ? 'rgba(255,50,50,0.06)' : (focus ? 'rgba(0,166,62,0.1)' : '#111'), border: `1px solid ${phoneError ? 'rgba(255,80,80,0.55)' : (focus ? G : 'rgba(255,255,255,0.25)')}`, boxShadow: phoneError ? '0 0 14px rgba(255,50,50,0.15)' : (focus ? `0 0 22px ${GG}` : 'none'), transition: 'all 0.2s' }}>
        <HudCorners size={10} color={phoneError ? 'rgba(255,80,80,0.5)' : (focus ? G : 'rgba(255,255,255,0.3)')} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: `1px solid ${phoneError ? 'rgba(255,80,80,0.3)' : 'rgba(255,255,255,0.2)'}`, flexShrink: 0 }}>
          <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 12, fontWeight: 700, color: '#fff', }}>IQ</span>
          <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13, color: phoneError ? '#ff8080' : G, }}>+964</span>
        </div>
        <input type="tel" value={data.phone} placeholder="7XX XXX XXXX" autoComplete="tel"
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onChange={e => { set({ phone: e.target.value.replace(/[^\d ]/g, '') }); setPhoneError(''); }}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '16px 18px', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16, fontWeight: 500, color: '#fff', }} />
      </div>
      {phoneError && <ErrorMsg msg={phoneError} />}
      {!phoneError && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 16 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
            <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2z" stroke={G} strokeWidth="1.6" />
            <path d="M8.5 8.5c0 4 3 7 6.5 7" stroke={G} strokeWidth="1.6" strokeLinecap="round" />
          </svg>
          <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
            {a.note}<span style={{ color: G, fontWeight: 700 }}>{a.whatsapp}</span>.
          </span>
        </div>
      )}
      <NavRow>
        <GhostBtn label={a.back} onClick={back} />
        <WizBtn label={a.sendCode} disabled={!valid} loading={loading} loadingLabel={a.sending} onClick={send} />
      </NavRow>
    </div>
  );
}

const MAX_OTP_ATTEMPTS = 3;
const OTP_LOCKOUT_SECS = 300;
const CORRECT_OTP = '123456';

function StepOTP({ data, set, next, back }) {
  const { t } = useLang();
  const { isMobile } = useResponsive();
  const a = t.auth.reg.otp;
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [resendIn, setResendIn] = useState(60);
  const [loading, setLoading] = useState(false);
  const [otpError, setOtpError] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shakeKey, setShakeKey] = useState(0);
  const refs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => setResendIn(r => (r > 0 ? r - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);

  const code = digits.join('');
  const valid = code.length === 6;

  const onDigit = (i, v) => {
    const c = v.replace(/\D/g, '').slice(-1);
    const nd = [...digits]; nd[i] = c; setDigits(nd);
    setOtpError('');
    if (c && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus();
  };
  const verify = () => {
    if (!valid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      if (code === CORRECT_OTP) { next(); return; }
      const next_attempts = attempts + 1;
      setAttempts(next_attempts);
      setDigits(['', '', '', '', '', '']);
      refs.current[0] && refs.current[0].focus();
      setShakeKey(k => k + 1);
      if (next_attempts >= MAX_OTP_ATTEMPTS) {
        setLocked(true);
      } else {
        const rem = MAX_OTP_ATTEMPTS - next_attempts;
        setOtpError(fill(a.invalidTemplate, { n: rem, word: rem === 1 ? t.auth.attempt : t.auth.attempts }));
      }
    }, 900);
  };

  if (locked) return (
    <>
      <StepHead n={4} slug={a.slug} line1={a.line1} line2={a.line2} sub="" />
      <Lockout cooldown={OTP_LOCKOUT_SECS} onRetry={() => { setLocked(false); setAttempts(0); setOtpError(''); setDigits(['', '', '', '', '', '']); }} />
    </>
  );

  return (
    <div>
      <StepHead n={4} slug={a.slug} line1={a.line1} line2={a.line2}
        sub={fill(a.subTemplate, { phone: data.phone || '7XX XXX XXXX' })} />
      <div key={shakeKey} style={{ display: 'flex', gap: 10, justifyContent: 'space-between', animation: shakeKey > 0 ? 'shake 0.5s ease' : 'none' }}>
        {digits.map((d, i) => {
          const filled = d !== '';
          const errStyle = otpError ? { background: 'rgba(255,50,50,0.1)', border: '1px solid rgba(255,80,80,0.55)', boxShadow: '0 0 12px rgba(255,50,50,0.2)', color: '#fff' } : {};
          return (
            <input key={i} ref={el => refs.current[i] = el} value={d} inputMode="numeric" maxLength={1}
              onChange={e => onDigit(i, e.target.value)} onKeyDown={e => onKey(i, e)}
              style={{ width: isMobile ? 44 : 52, height: isMobile ? 56 : 64, textAlign: 'center', background: filled ? 'rgba(0,166,62,0.12)' : '#111', border: `1px solid ${filled ? G : 'rgba(255,255,255,0.28)'}`, boxShadow: filled ? `0 0 16px ${GG}` : 'none', color: '#fff', fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: isMobile ? 20 : 24, outline: 'none', transition: 'all 0.2s', ...errStyle }}
              onFocus={e => { if (!otpError) { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 22px ${GG}`; } }}
              onBlur={e => { if (!e.target.value && !otpError) { e.target.style.borderColor = 'rgba(255,255,255,0.28)'; e.target.style.boxShadow = 'none'; } }} />
          );
        })}
      </div>
      {otpError && <ErrorMsg msg={otpError} />}
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginTop: 18 }}>
        <button type="button" onClick={() => { if (resendIn === 0) { setResendIn(60); setAttempts(0); setOtpError(''); } }} disabled={resendIn > 0}
          style={{ background: 'transparent', border: 'none', cursor: resendIn > 0 ? 'not-allowed' : 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: resendIn > 0 ? 'rgba(255,255,255,0.3)' : G }}>
          {resendIn > 0 ? fill(a.resendInTemplate, { secs: resendIn }) : a.resend}
        </button>
      </div>
      <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 14 }}>{a.autoRead}</div>
      <NavRow>
        <GhostBtn label={a.back} onClick={back} />
        <WizBtn label={a.verify} disabled={!valid} loading={loading} loadingLabel={a.verifying} onClick={verify} />
      </NavRow>
    </div>
  );
}

function StepPassword({ data, set, next, back }) {
  const { t } = useLang();
  const a = t.auth.reg.password;
  const pw = data.pw, pw2 = data.pw2;
  const hasLen = pw.length >= 8, hasLetter = /[A-Za-z]/.test(pw), hasNum = /\d/.test(pw);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const valid = hasLen && hasLetter && hasNum && pw === pw2 && pw2.length > 0;

  const Req = ({ ok, children }) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: ok ? G : 'rgba(255,255,255,0.4)' }}>
      <span style={{ width: 12, height: 12, border: `1px solid ${ok ? G : 'rgba(255,255,255,0.25)'}`, background: ok ? G : 'transparent', color: '#fff', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ok ? '✓' : ''}</span>
      {children}
    </span>
  );

  return (
    <div>
      <StepHead n={5} slug={a.slug} line1={a.line1} line2={a.line2}
        sub={a.sub} />
      <FieldRow label={a.pw} type="password" autoComplete="new-password" placeholder={a.pwPlaceholder}
        value={pw} onChange={e => set({ pw: e.target.value })} />
      <StrengthBar pw={pw} />
      <FieldRow label={a.confirm} type="password" autoComplete="new-password" placeholder={a.confirmPlaceholder}
        hint={mismatch ? <span style={{ color: '#ff5151' }}>{t.auth.noMatch}</span> : (pw2 && !mismatch ? <span style={{ color: G }}>{t.auth.match}</span> : null)}
        value={pw2} onChange={e => set({ pw2: e.target.value })} />
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: -6 }}>
        <Req ok={hasLen}>{t.auth.reqs.len}</Req>
        <Req ok={hasLetter}>{t.auth.reqs.letter}</Req>
        <Req ok={hasNum}>{t.auth.reqs.num}</Req>
      </div>
      <NavRow>
        <GhostBtn label={a.back} onClick={back} />
        <WizBtn label={a.continue} disabled={!valid} onClick={next} />
      </NavRow>
    </div>
  );
}

function DocModal({ kind, onClose }) {
  const { t } = useLang();
  const doc = t.auth.doc;
  const title = kind === 'terms' ? doc.termsTitle : doc.privacyTitle;
  const body = kind === 'terms' ? doc.terms : doc.privacy;
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, animation: 'fadeUp 0.25s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 560, maxHeight: '80vh', overflowY: 'auto', background: '#080808', border: `1px solid ${G}`, boxShadow: `0 0 50px ${GG}`, padding: '36px 40px' }}>
        <HudCorners size={16} color={G} glow />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: G, marginBottom: 8 }}>/// {doc.legal}</div>
            <div style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 22, color: '#fff' }}>{title}</div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', width: 32, height: 32, cursor: 'pointer', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14 }}>✕</button>
        </div>
        {body.map(([h, p]) => (
          <div key={h} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: G, marginBottom: 8 }}>{h}</div>
            <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>{p}</p>
          </div>
        ))}
        <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.3)', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          {doc.version}
        </div>
      </div>
    </div>
  );
}

function StepTerms({ data, set, finish, back, loading }) {
  const { t } = useLang();
  const a = t.auth.reg.terms;
  const [showDoc, setShowDoc] = useState(null);
  return (
    <div>
      <StepHead n={6} slug={a.slug} line1={a.line1} line2={a.line2}
        sub={a.sub} />
      <div onClick={() => set({ agree: !data.agree })}
        style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', padding: '14px 16px', background: data.agree ? 'rgba(0,166,62,0.06)' : 'transparent', border: `1px solid ${data.agree ? 'rgba(0,166,62,0.3)' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.2s' }}>
        <div style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, border: `1.5px solid ${data.agree ? G : 'rgba(255,255,255,0.3)'}`, background: data.agree ? G : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: data.agree ? `0 0 8px ${GG}` : 'none', transition: 'all 0.2s' }}>
          {data.agree && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>
        <span style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
          {a.agreePre}
          <span onClick={e => { e.stopPropagation(); setShowDoc('terms'); }} style={{ color: G, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2 }}>{a.termsLink}</span>
          {a.and}
          <span onClick={e => { e.stopPropagation(); setShowDoc('privacy'); }} style={{ color: G, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2 }}>{a.privacyLink}</span>
          {a.agreePost}
        </span>
      </div>
      <NavRow>
        <GhostBtn label={a.back} onClick={back} />
        <WizBtn label={a.create} disabled={!data.agree} loading={loading} loadingLabel={a.creating} arrow="→" onClick={finish} />
      </NavRow>
      {showDoc && <DocModal kind={showDoc} onClose={() => setShowDoc(null)} />}
    </div>
  );
}

function RegSuccess({ data, onHome }) {
  const { t } = useLang();
  const a = t.auth.reg.success;
  const av = data.avatar != null ? AVATARS[data.avatar] : AVATARS[0];
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 11, color: G, marginBottom: 18 }}>/// {a.slug}</div>
      <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 28px', border: `1px solid ${G}`, padding: 8, boxShadow: `0 0 30px ${GG}` }}>
        <HudCorners size={14} color={G} glow />
        <img src={av.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <GlitchH text={a.line1} size={40} extra={{ marginBottom: 2 }} />
      <GlitchH text={(data.nickname || a.defaultNick).toUpperCase() + '_'} color={G} size={40} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 24 }} />
      <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: 400, margin: '0 auto 28px' }}>
        {a.msg}
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <WizBtn label={a.enter} onClick={onHome} arrow="→" />
      </div>
    </div>
  );
}

function RegisterWizard({ go, step, setStep, onHome }) {
  const { t } = useLang();
  const [data, setData] = useState({
    fullName: '', nickname: '', dobD: '', dobM: '', dobY: '', gender: '',
    avatar: null, phone: '', pw: '', pw2: '', agree: false,
  });
  const [done, setDone] = useState(false);
  const [finishing, setFinishing] = useState(false);
  const set = patch => setData(d => ({ ...d, ...patch }));
  const next = () => setStep(s => Math.min(s + 1, 5));
  const back = () => setStep(s => Math.max(s - 1, 0));

  const finish = () => {
    if (!data.agree) return;
    setFinishing(true);
    setTimeout(() => { setFinishing(false); setDone(true); }, 1400);
  };

  if (done) return <RegSuccess data={data} onHome={onHome} />;

  return (
    <div>
      <RegProgressDots step={step} />
      <div key={step} style={{ animation: 'fadeUp 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        {step === 0 && <StepInfo data={data} set={set} next={next} />}
        {step === 1 && <StepAvatar data={data} set={set} next={next} back={back} />}
        {step === 2 && <StepPhone data={data} set={set} next={next} back={back} />}
        {step === 3 && <StepOTP data={data} set={set} next={next} back={back} />}
        {step === 4 && <StepPassword data={data} set={set} next={next} back={back} />}
        {step === 5 && <StepTerms data={data} set={set} finish={finish} back={back} loading={finishing} />}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24, fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
        {t.auth.reg.rosterQ}{' '}
        <a onClick={e => { e.preventDefault(); go('signin'); }} style={{ color: G, textDecoration: 'none', cursor: 'pointer', fontWeight: 700, textTransform: 'uppercase', fontSize: 13 }}>{t.auth.reg.signinLink}</a>
      </div>
    </div>
  );
}

/* ─── SIDE PANEL ─── */
function SidePanel({ view }) {
  const { t } = useLang();
  const headlines = t.auth.side.headlines;
  const taglines = t.auth.side.taglines;
  const [h1, h2] = headlines[view];

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: '#050505', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.45) contrast(1.1) saturate(0.85)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,166,62,0.18) 0%, transparent 40%, rgba(5,5,5,0.95) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)' }} />

      {[{ top: 24, left: 24 }, { top: 24, right: 24 }, { bottom: 24, left: 24 }, { bottom: 24, right: 24 }].map((p, i) => (
        <div key={i} style={{ position: 'absolute', ...p, color: 'rgba(255,255,255,0.4)', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 18, lineHeight: 1, zIndex: 4 }}>+</div>
      ))}

      <div style={{ position: 'relative', zIndex: 2, padding: 56, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
          <div style={{ width: 40, height: 40, background: G, clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)', boxShadow: `0 0 16px ${GG}` }} />
          <div>
            <div style={{ fontFamily: "CALVIN, 'Lama Sans', sans-serif", fontWeight: 900, fontSize: 18, color: '#fff', lineHeight: 1 }}>
              EARTHLINK<span style={{ color: G }}>.ESPORTS</span>
            </div>
            <div style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 9, color: G, marginTop: 4 }}>{t.auth.brandTag}</div>
          </div>
        </div>

        <div style={{ marginTop: 80, marginBottom: 'auto' }}>
          <div key={view}>
            <GlitchH text={h1} size={72} extra={{ marginBottom: 4 }} />
            <GlitchH text={h2} color={G} size={72} extra={{ textShadow: `0 0 50px ${GG}` }} />
          </div>
          <p style={{ fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginTop: 24, maxWidth: 420, fontWeight: 500 }}>
            {taglines[view]}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── AUTH PAGE ROOT ─── */
export default function AuthPage({ initialView = 'signin', onHome }) {
  const { t } = useLang();
  const { isMobile } = useResponsive();
  const [view, setView] = useState(initialView);
  const [regStep, setRegStep] = useState(0);

  const goView = v => { if (v === '__success__') { onHome(); return; } if (v === 'create') setRegStep(0); setView(v); };

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <AuthBG />
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.05fr 1fr' }}>
        {!isMobile && <SidePanel view={view} />}

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#0a0a0a' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: isMobile ? '18px 20px' : '24px 56px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={onHome} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.5)',
              textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = G}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              {t.auth.backHome}
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: isMobile ? '32px 20px' : '40px 56px' }}>
            <div key={view} style={{ width: '100%', maxWidth: view === 'create' ? 540 : 460, animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
              {view === 'signin' && <SignIn go={goView} />}
              {view === 'forgot' && <Forgot go={goView} />}
              {view === 'create' && <RegisterWizard go={goView} step={regStep} setStep={setRegStep} onHome={onHome} />}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', padding: isMobile ? '16px 20px' : '20px 56px', borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: "'IBM Plex Sans Arabic', sans-serif", fontSize: 10, color: 'rgba(255,255,255,0.35)', }}>
            <span>{t.auth.footerCopyright}</span>
            <span>{t.auth.footerLinks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
