import { useState, useEffect, useRef } from 'react';
import { G, GG } from '../constants';

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
      fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: size, color,
      lineHeight: 0.95, letterSpacing: '-0.015em', position: 'relative', ...extra,
    }}>{text}</div>
  );
}

function FieldLabel({ children, hint }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
      <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
        <span style={{ color: G }}>///</span> {children}
      </span>
      {hint && (
        <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
          {hint}
        </span>
      )}
    </div>
  );
}

function Field({ type = 'text', value, onChange, placeholder, autoComplete, onFocusChange, focused }) {
  const [showPw, setShowPw] = useState(false);
  const isPw = type === 'password';
  const realType = isPw && showPw ? 'text' : type;
  const filled = value && value.length > 0;
  return (
    <div style={{
      position: 'relative',
      background: focused ? 'rgba(0,166,62,0.04)' : 'rgba(0,0,0,0.5)',
      border: `1px solid ${focused ? G : (filled ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)')}`,
      boxShadow: focused ? `0 0 22px ${GG}, inset 0 0 22px rgba(0,166,62,0.05)` : 'none',
      transition: 'all 0.25s',
      display: 'flex', alignItems: 'center',
    }}>
      <HudCorners size={10} color={focused ? G : 'rgba(255,255,255,0.25)'} />
      <span style={{
        position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
        fontFamily: 'monospace', fontSize: 10, color: focused ? G : 'rgba(255,255,255,0.3)',
        letterSpacing: '0.2em', transition: 'color 0.2s',
      }}>{'>'}</span>
      <input
        type={realType} value={value} onChange={onChange} placeholder={placeholder} autoComplete={autoComplete}
        onFocus={() => onFocusChange && onFocusChange(true)}
        onBlur={() => onFocusChange && onFocusChange(false)}
        style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          padding: '16px 18px 16px 36px',
          fontFamily: 'Rajdhani, sans-serif', fontSize: 16, fontWeight: 500,
          color: '#fff', letterSpacing: '0.02em', width: '100%',
        }}
      />
      {isPw && (
        <button type="button" onClick={() => setShowPw(s => !s)} style={{
          background: 'transparent', border: 'none',
          fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)',
          letterSpacing: '0.15em', padding: '0 18px', cursor: 'pointer', transition: 'color 0.2s',
        }}
          onMouseEnter={e => e.currentTarget.style.color = G}
          onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
          {showPw ? 'HIDE' : 'SHOW'}
        </button>
      )}
    </div>
  );
}

function FieldRow({ label, hint, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: 22 }}>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <Field {...rest} focused={focused} onFocusChange={setFocused} />
    </div>
  );
}

function PrimaryBtn({ label, onClick, disabled, loading }) {
  const [hov, setHov] = useState(false);
  const cut = 18;
  const clip = `polygon(0 0, calc(100% - ${cut}px) 0, 100% ${cut}px, 100% 100%, ${cut}px 100%, 0 calc(100% - ${cut}px))`;
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onClick} disabled={disabled || loading}
      style={{
        clipPath: clip, width: '100%',
        background: disabled ? 'rgba(0,166,62,0.3)' : (hov ? '#00c44a' : G),
        color: '#fff', border: 'none',
        padding: '17px 24px', fontFamily: 'monospace', fontWeight: 700, fontSize: 13,
        letterSpacing: '0.18em', textTransform: 'uppercase',
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
          <span>AUTHENTICATING...</span>
        </>
      ) : (
        <><span>{label}</span><span style={{ fontSize: 16 }}>→</span></>
      )}
    </button>
  );
}

function GoogleBtn({ onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: '100%',
        background: hov ? 'rgba(255,255,255,0.04)' : 'transparent',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.15)'}`,
        padding: '15px 24px',
        fontFamily: 'monospace', fontWeight: 600, fontSize: 12,
        letterSpacing: '0.15em', color: hov ? '#fff' : 'rgba(255,255,255,0.85)',
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
      <span>CONTINUE WITH GOOGLE</span>
    </button>
  );
}

function Divider({ label = 'OR' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '26px 0' }}>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12))' }} />
      <span style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.3em' }}>{label}</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.12), transparent)' }} />
    </div>
  );
}

/* ─── PASSWORD STRENGTH ─── */
function strength(pw) {
  if (!pw) return { score: 0, label: '—', color: 'rgba(255,255,255,0.3)' };
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) s++;
  if (/\d/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  const map = [
    { label: 'WEAK', color: '#ff5151' },
    { label: 'WEAK', color: '#ff5151' },
    { label: 'OK', color: '#ffae3a' },
    { label: 'STRONG', color: G },
    { label: 'ELITE', color: G },
  ];
  return { score: s, ...map[s] };
}

function StrengthBar({ pw }) {
  const { score, label, color } = strength(pw);
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
        <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>PASSWORD_STRENGTH</span>
        <span style={{ fontFamily: 'monospace', fontSize: 9, color, letterSpacing: '0.15em', fontWeight: 700 }}>{label}</span>
      </div>
    </div>
  );
}

function ScreenHeader({ slug, line1, line2, sub }) {
  return (
    <div style={{ marginBottom: 36 }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
        /// {slug}
      </div>
      <GlitchH text={line1} extra={{ marginBottom: 4 }} />
      <GlitchH text={line2} color={G} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 18 }} />
      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 380 }}>{sub}</p>
    </div>
  );
}

/* ─── SIGN IN ─── */
function SignIn({ go }) {
  const [identifier, setIdentifier] = useState('');
  const [pw, setPw] = useState('');
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const submit = e => {
    e && e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1200);
  };

  return (
    <form onSubmit={submit}>
      <ScreenHeader
        slug=".auth.login_terminal"
        line1="WELCOME"
        line2="BACK, PLAYER_"
        sub="Sign in with your nickname or phone number to access your roster, tournament queues, and coaching modules."
      />

      <FieldRow label="Nickname or Phone" type="text" autoComplete="username"
        value={identifier} onChange={e => setIdentifier(e.target.value)} placeholder="ShadowStrike  /  +964 7XX XXX XXXX" />

      <FieldRow label="Password" type="password" autoComplete="current-password"
        hint={<a onClick={e => { e.preventDefault(); go('forgot'); }}
          style={{ color: G, textDecoration: 'none', cursor: 'pointer' }}>FORGOT?</a>}
        value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••••••" />

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
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.02em' }}>
          Keep me signed in on this device
        </span>
      </div>

      <PrimaryBtn label="SIGN IN" loading={loading} disabled={!identifier || !pw} />

      <div style={{ textAlign: 'center', marginTop: 26, fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
        New to Earthlink?{' '}
        <a onClick={e => { e.preventDefault(); go('create'); }} style={{
          color: G, textDecoration: 'none', cursor: 'pointer', fontWeight: 700,
          letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 13,
        }}>Create an account →</a>
      </div>
    </form>
  );
}

/* ─── FORGOT PASSWORD ─── */
function Forgot({ go }) {
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
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.22em', marginBottom: 14 }}>/// .recovery.password_reset</div>
        <GlitchH text="PASSWORD" extra={{ marginBottom: 4 }} />
        <GlitchH text="RESTORED_" color={G} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 28 }} />
        <div style={{ position: 'relative', border: `1px solid ${G}`, background: 'rgba(0,166,62,0.05)', padding: '24px 28px', marginBottom: 28 }}>
          <HudCorners size={14} color={G} glow />
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
            <div style={{ width: 38, height: 38, flexShrink: 0, border: `1.5px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 12px ${GG}` }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4 10-11" stroke={G} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
            <div>
              <div style={{ fontFamily: 'monospace', fontSize: 10, color: G, letterSpacing: '0.2em', marginBottom: 6 }}>[ RESET_COMPLETE ]</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, color: '#fff', lineHeight: 1.5, fontWeight: 600 }}>Your password has been updated.</div>
              <div style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginTop: 8 }}>Sign in with your new password to get back in the arena.</div>
            </div>
          </div>
        </div>
        <PrimaryBtn label="BACK TO SIGN IN" onClick={() => go('signin')} />
      </div>
    );
  }

  return (
    <form onSubmit={e => e.preventDefault()}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.22em', marginBottom: 14 }}>/// .auth.recovery_protocol</div>
      <GlitchH text="RESET" extra={{ marginBottom: 4 }} />
      <GlitchH text="PASSWORD_" color={G} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 18 }} />
      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, maxWidth: 400, marginBottom: 28 }}>
        {step === 0 && "Enter your registered phone number — we'll send a 6-digit verification code via WhatsApp."}
        {step === 1 && `Enter the code sent to IQ +964 ${phone || '7XX XXX XXXX'}. It expires in 5 minutes.`}
        {step === 2 && 'Verified. Choose a new password for your account.'}
      </p>

      <ProgressDots />

      {step === 0 && (
        <div>
          <FieldLabel hint="AUTO-DETECTED">Phone Number</FieldLabel>
          <div style={{ display: 'flex', position: 'relative', background: phoneFocus ? 'rgba(0,166,62,0.04)' : 'rgba(0,0,0,0.5)', border: `1px solid ${phoneFocus ? G : 'rgba(255,255,255,0.1)'}`, boxShadow: phoneFocus ? `0 0 22px ${GG}` : 'none', transition: 'all 0.2s', marginBottom: 4 }}>
            <HudCorners size={10} color={phoneFocus ? G : 'rgba(255,255,255,0.25)'} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
              <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>IQ</span>
              <span style={{ fontFamily: 'monospace', fontSize: 13, color: G, letterSpacing: '0.06em' }}>+964</span>
            </div>
            <input type="tel" value={phone} placeholder="7XX XXX XXXX" autoComplete="tel"
              onFocus={() => setPhoneFocus(true)} onBlur={() => setPhoneFocus(false)}
              onChange={e => setPhone(e.target.value.replace(/[^\d ]/g, ''))}
              style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '16px 18px', fontFamily: 'Rajdhani, sans-serif', fontSize: 16, fontWeight: 500, color: '#fff', letterSpacing: '0.06em' }} />
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', margin: '14px 0 28px' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}><path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2z" stroke={G} strokeWidth="1.6" /></svg>
            <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.6)' }}>Code delivered via <span style={{ color: G, fontWeight: 700 }}>WhatsApp</span>.</span>
          </div>
          <PrimaryBtn label="SEND CODE" loading={loading} disabled={!phoneValid} onClick={sendOtp} />
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
                  style={{ width: 52, height: 64, textAlign: 'center', background: filled ? 'rgba(0,166,62,0.08)' : 'rgba(0,0,0,0.5)', border: `1px solid ${filled ? G : 'rgba(255,255,255,0.12)'}`, boxShadow: filled ? `0 0 16px ${GG}` : 'none', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 24, outline: 'none', transition: 'all 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 22px ${GG}`; }}
                  onBlur={e => { if (!e.target.value) { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; } }} />
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '18px 0 28px' }}>
            <button type="button" onClick={() => setStep(0)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,255,255,0.5)' }}>← CHANGE_NUMBER</button>
            <button type="button" onClick={() => resendIn === 0 && setResendIn(60)} disabled={resendIn > 0}
              style={{ background: 'transparent', border: 'none', cursor: resendIn > 0 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: resendIn > 0 ? 'rgba(255,255,255,0.3)' : G }}>
              {resendIn > 0 ? `RESEND IN ${resendIn}s` : '↻ RESEND_CODE'}
            </button>
          </div>
          <PrimaryBtn label="VERIFY CODE" loading={loading} disabled={!otpValid} onClick={verify} />
        </div>
      )}

      {step === 2 && (
        <div>
          <FieldRow label="New Password" type="password" autoComplete="new-password" placeholder="Create a new password"
            value={pw} onChange={e => setPw(e.target.value)} />
          <StrengthBar pw={pw} />
          <FieldRow label="Confirm Password" type="password" autoComplete="new-password" placeholder="Re-enter your new password"
            hint={mismatch ? <span style={{ color: '#ff5151' }}>NO MATCH</span> : (pw2 && !mismatch ? <span style={{ color: G }}>✓ MATCH</span> : null)}
            value={pw2} onChange={e => setPw2(e.target.value)} />
          <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: -6, marginBottom: 26 }}>
            {[['8+ CHARACTERS', hasLen], ['1 LETTER', hasLetter], ['1 NUMBER', hasNum]].map(([t, ok]) => (
              <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.08em', color: ok ? G : 'rgba(255,255,255,0.4)' }}>
                <span style={{ width: 12, height: 12, border: `1px solid ${ok ? G : 'rgba(255,255,255,0.25)'}`, background: ok ? G : 'transparent', color: '#fff', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ok ? '✓' : ''}</span>
                {t}
              </span>
            ))}
          </div>
          <PrimaryBtn label="RESET PASSWORD" loading={loading} disabled={!pwValid} onClick={reset} />
        </div>
      )}

      <div style={{ textAlign: 'center', marginTop: 26, fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
        Remembered it?{' '}
        <a onClick={e => { e.preventDefault(); go('signin'); }} style={{ color: G, textDecoration: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 13 }}>← Back to sign in</a>
      </div>
    </form>
  );
}

/* ─── REGISTER WIZARD ─── */
const AVATARS = ['Striker', 'Phoenix', 'Viper', 'Nova', 'Raven', 'Titan', 'Ghost', 'Blaze'].map(
  s => ({ id: s, url: `https://api.dicebear.com/7.x/bottts/svg?seed=${s}&backgroundColor=0a0a0a` })
);

function WizBtn({ label, onClick, disabled, loading, loadingLabel = 'PROCESSING...', arrow = '→' }) {
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
        fontFamily: 'monospace', fontWeight: 700, fontSize: 13,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        boxShadow: hov && !disabled ? `0 0 32px ${GG}` : `0 0 16px rgba(0,166,62,0.22)`,
        transition: 'all 0.2s',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
      }}>
      {loading ? (
        <><span style={{ width: 12, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /><span>{loadingLabel}</span></>
      ) : (
        <><span>{label}</span>{arrow && <span style={{ fontSize: 15 }}>{arrow}</span>}</>
      )}
    </button>
  );
}

function GhostBtn({ label, onClick, arrow = '←' }) {
  const [hov, setHov] = useState(false);
  return (
    <button type="button" onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: 'transparent',
        border: `1px solid ${hov ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.14)'}`,
        color: hov ? '#fff' : 'rgba(255,255,255,0.6)',
        padding: '16px 22px', fontFamily: 'monospace', fontWeight: 700, fontSize: 12,
        letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer',
        transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap',
      }}>
      {arrow && <span style={{ fontSize: 15 }}>{arrow}</span>}<span>{label}</span>
    </button>
  );
}

function NavRow({ children }) {
  return <div style={{ display: 'flex', gap: 12, marginTop: 32 }}>{children}</div>;
}

function MiniLabel({ children, hint }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 8 }}>
      <span style={{ fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase' }}>
        <span style={{ color: G }}>///</span> {children}
      </span>
      {hint && <span style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em' }}>{hint}</span>}
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
          background: focus ? 'rgba(0,166,62,0.04)' : 'rgba(0,0,0,0.5)',
          border: `1px solid ${focus ? G : (value ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.1)')}`,
          boxShadow: focus ? `0 0 18px ${GG}` : 'none',
          color: value ? '#fff' : 'rgba(255,255,255,0.35)',
          fontFamily: 'Rajdhani, sans-serif', fontSize: 15, fontWeight: 500,
          padding: '15px 36px 15px 16px', outline: 'none', cursor: 'pointer',
          transition: 'all 0.2s',
        }}>
        <option value="" disabled>{placeholder}</option>
        {options.map(o => <option key={o.v} value={o.v} style={{ background: '#0a0a0a' }}>{o.l}</option>)}
      </select>
      <span style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: focus ? G : 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 11 }}>▼</span>
    </div>
  );
}

function StepHead({ n, slug, line1, line2, sub }) {
  return (
    <div style={{ marginBottom: 30 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.22em' }}>/// {slug}</span>
        <span style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em' }}>STEP_{String(n).padStart(2, '0')} / 06</span>
      </div>
      <GlitchH text={line1} size={38} extra={{ marginBottom: 2 }} />
      <GlitchH text={line2} color={G} size={38} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 14 }} />
      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.55, maxWidth: 440 }}>{sub}</p>
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

function StepInfo({ data, set, next }) {
  const days = Array.from({ length: 31 }, (_, i) => ({ v: String(i + 1), l: String(i + 1).padStart(2, '0') }));
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'].map((m, i) => ({ v: String(i + 1), l: m }));
  const years = Array.from({ length: 44 }, (_, i) => ({ v: String(2013 - i), l: String(2013 - i) }));
  const valid = data.fullName.trim() && data.nickname.trim() && data.dobD && data.dobM && data.dobY && data.gender;

  return (
    <div>
      <StepHead n={1} slug=".register.player_info" line1="WHO ARE" line2="YOU, PLAYER?_"
        sub="Set up your identity. Your nickname is what the community sees — your legal details stay private." />
      <FieldRow label="Full Name" hint="ADMIN-ONLY" placeholder="e.g. Ahmed Al-Rashid"
        value={data.fullName} onChange={e => set({ fullName: e.target.value })} />
      <FieldRow label="Nickname" hint="PUBLIC · UNIQUE" placeholder="e.g. ShadowStrike"
        value={data.nickname} onChange={e => set({ nickname: e.target.value })} />
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', background: 'rgba(0,166,62,0.05)', border: '1px solid rgba(0,166,62,0.2)', padding: '12px 16px', marginTop: -8, marginBottom: 24 }}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <rect x="5" y="11" width="14" height="9" rx="1.5" stroke={G} strokeWidth="1.8" />
          <path d="M8 11V8a4 4 0 018 0v3" stroke={G} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.7)', lineHeight: 1.45 }}>Your real name is private and only visible to admins.</span>
      </div>
      <MiniLabel hint="DD / MM / YYYY">Date of Birth</MiniLabel>
      <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
        <Select value={data.dobD} onChange={e => set({ dobD: e.target.value })} options={days} placeholder="DAY" />
        <Select value={data.dobM} onChange={e => set({ dobM: e.target.value })} options={months} placeholder="MONTH" />
        <Select value={data.dobY} onChange={e => set({ dobY: e.target.value })} options={years} placeholder="YEAR" />
      </div>
      <MiniLabel>Gender</MiniLabel>
      <div style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
        {['Male', 'Female'].map(g => {
          const on = data.gender === g;
          return (
            <button key={g} type="button" onClick={() => set({ gender: g })}
              style={{ flex: 1, position: 'relative', background: on ? 'rgba(0,166,62,0.1)' : 'rgba(0,0,0,0.5)', border: `1px solid ${on ? G : 'rgba(255,255,255,0.1)'}`, boxShadow: on ? `0 0 18px ${GG}` : 'none', color: on ? '#fff' : 'rgba(255,255,255,0.6)', padding: '15px', fontFamily: 'monospace', fontSize: 12, fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
              {on && <HudCorners size={9} color={G} />}
              {g}
            </button>
          );
        })}
      </div>
      <NavRow><WizBtn label="Continue" disabled={!valid} onClick={next} /></NavRow>
    </div>
  );
}

function StepAvatar({ data, set, next, back }) {
  return (
    <div>
      <StepHead n={2} slug=".register.avatar_select" line1="PICK YOUR" line2="BATTLE FACE_"
        sub="Choose an avatar that represents you in lobbies and leaderboards. You can change it later." />
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
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', marginTop: 16, textAlign: 'center' }}>
        {data.avatar != null ? `SELECTED · AVATAR_${String(data.avatar + 1).padStart(2, '0')}` : 'NO_SELECTION · A DEFAULT WILL BE ASSIGNED'}
      </div>
      <NavRow>
        <GhostBtn label="Back" onClick={back} />
        <GhostBtn label="Skip" arrow={null} onClick={() => { set({ avatar: data.avatar == null ? 0 : data.avatar }); next(); }} />
        <WizBtn label="Continue" onClick={next} />
      </NavRow>
    </div>
  );
}

function StepPhone({ data, set, next, back }) {
  const [loading, setLoading] = useState(false);
  const [focus, setFocus] = useState(false);
  const valid = data.phone.replace(/\D/g, '').length >= 9;

  const send = () => {
    if (!valid) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); next(); }, 1100);
  };

  return (
    <div>
      <StepHead n={3} slug=".register.phone_link" line1="LINK YOUR" line2="NUMBER_"
        sub="We'll send a one-time verification code to confirm it's really you. Standard rates may apply." />
      <MiniLabel hint="AUTO-DETECTED">Phone Number</MiniLabel>
      <div style={{ display: 'flex', position: 'relative', background: focus ? 'rgba(0,166,62,0.04)' : 'rgba(0,0,0,0.5)', border: `1px solid ${focus ? G : 'rgba(255,255,255,0.1)'}`, boxShadow: focus ? `0 0 22px ${GG}` : 'none', transition: 'all 0.2s' }}>
        <HudCorners size={10} color={focus ? G : 'rgba(255,255,255,0.25)'} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 16px', borderRight: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 700, color: '#fff', letterSpacing: '0.08em' }}>IQ</span>
          <span style={{ fontFamily: 'monospace', fontSize: 13, color: G, letterSpacing: '0.06em' }}>+964</span>
        </div>
        <input type="tel" value={data.phone} placeholder="7XX XXX XXXX" autoComplete="tel"
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          onChange={e => set({ phone: e.target.value.replace(/[^\d ]/g, '') })}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '16px 18px', fontFamily: 'Rajdhani, sans-serif', fontSize: 16, fontWeight: 500, color: '#fff', letterSpacing: '0.06em' }} />
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 16 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
          <path d="M12 2a10 10 0 00-8.6 15l-1.3 4.8 4.9-1.3A10 10 0 1012 2z" stroke={G} strokeWidth="1.6" />
          <path d="M8.5 8.5c0 4 3 7 6.5 7" stroke={G} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 13.5, color: 'rgba(255,255,255,0.6)', lineHeight: 1.4 }}>
          A 6-digit code will be sent via <span style={{ color: G, fontWeight: 700 }}>WhatsApp</span>.
        </span>
      </div>
      <NavRow>
        <GhostBtn label="Back" onClick={back} />
        <WizBtn label="Send Code" disabled={!valid} loading={loading} loadingLabel="SENDING..." onClick={send} />
      </NavRow>
    </div>
  );
}

function StepOTP({ data, set, next, back }) {
  const [digits, setDigits] = useState(['', '', '', '', '', '']);
  const [expiry, setExpiry] = useState(300);
  const [resendIn, setResendIn] = useState(60);
  const [loading, setLoading] = useState(false);
  const refs = useRef([]);

  useEffect(() => {
    const t = setInterval(() => {
      setExpiry(e => (e > 0 ? e - 1 : 0));
      setResendIn(r => (r > 0 ? r - 1 : 0));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const code = digits.join('');
  const valid = code.length === 6;

  const onDigit = (i, v) => {
    const c = v.replace(/\D/g, '').slice(-1);
    const nd = [...digits]; nd[i] = c; setDigits(nd);
    if (c && i < 5) refs.current[i + 1] && refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key === 'Backspace' && !digits[i] && i > 0) refs.current[i - 1] && refs.current[i - 1].focus();
  };
  const verify = () => {
    if (!valid) return;
    setLoading(true);
    setTimeout(() => { setLoading(false); next(); }, 1000);
  };

  return (
    <div>
      <StepHead n={4} slug=".register.otp_verify" line1="ENTER THE" line2="6-DIGIT CODE_"
        sub={`Sent via WhatsApp to IQ +964 ${data.phone || '7XX XXX XXXX'}. The code expires in 5 minutes.`} />
      <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
        {digits.map((d, i) => {
          const filled = d !== '';
          return (
            <input key={i} ref={el => refs.current[i] = el} value={d} inputMode="numeric" maxLength={1}
              onChange={e => onDigit(i, e.target.value)} onKeyDown={e => onKey(i, e)}
              style={{ width: 52, height: 64, textAlign: 'center', background: filled ? 'rgba(0,166,62,0.08)' : 'rgba(0,0,0,0.5)', border: `1px solid ${filled ? G : 'rgba(255,255,255,0.12)'}`, boxShadow: filled ? `0 0 16px ${GG}` : 'none', color: '#fff', fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 24, outline: 'none', transition: 'all 0.2s' }}
              onFocus={e => { e.target.style.borderColor = G; e.target.style.boxShadow = `0 0 22px ${GG}`; }}
              onBlur={e => { if (!e.target.value) { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; e.target.style.boxShadow = 'none'; } }} />
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 }}>
        <span style={{ fontFamily: 'monospace', fontSize: 11, color: expiry > 0 ? 'rgba(255,255,255,0.5)' : '#ff5151', letterSpacing: '0.12em' }}>
          {expiry > 0 ? `EXPIRES_IN ${fmt(expiry)}` : 'CODE_EXPIRED'}
        </span>
        <button type="button" onClick={() => resendIn === 0 && setResendIn(60)} disabled={resendIn > 0}
          style={{ background: 'transparent', border: 'none', cursor: resendIn > 0 ? 'not-allowed' : 'pointer', fontFamily: 'monospace', fontSize: 11, letterSpacing: '0.12em', color: resendIn > 0 ? 'rgba(255,255,255,0.3)' : G }}>
          {resendIn > 0 ? `RESEND IN ${resendIn}s` : '↻ RESEND_CODE'}
        </button>
      </div>
      <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em', marginTop: 14 }}>◆ ON MOBILE, THE CODE IS READ AUTOMATICALLY.</div>
      <NavRow>
        <GhostBtn label="Back" onClick={back} />
        <WizBtn label="Verify" disabled={!valid} loading={loading} loadingLabel="VERIFYING..." onClick={verify} />
      </NavRow>
    </div>
  );
}

function StepPassword({ data, set, next, back }) {
  const pw = data.pw, pw2 = data.pw2;
  const hasLen = pw.length >= 8, hasLetter = /[A-Za-z]/.test(pw), hasNum = /\d/.test(pw);
  const mismatch = pw2.length > 0 && pw !== pw2;
  const valid = hasLen && hasLetter && hasNum && pw === pw2 && pw2.length > 0;

  const Req = ({ ok, children }) => (
    <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'monospace', fontSize: 10, letterSpacing: '0.08em', color: ok ? G : 'rgba(255,255,255,0.4)' }}>
      <span style={{ width: 12, height: 12, border: `1px solid ${ok ? G : 'rgba(255,255,255,0.25)'}`, background: ok ? G : 'transparent', color: '#fff', fontSize: 8, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{ok ? '✓' : ''}</span>
      {children}
    </span>
  );

  return (
    <div>
      <StepHead n={5} slug=".register.set_password" line1="SECURE THE" line2="ACCOUNT_"
        sub="Create a password you'll use to sign in. Minimum 8 characters, including a letter and a number." />
      <FieldRow label="Password" type="password" autoComplete="new-password" placeholder="Create a strong password"
        value={pw} onChange={e => set({ pw: e.target.value })} />
      <StrengthBar pw={pw} />
      <FieldRow label="Confirm Password" type="password" autoComplete="new-password" placeholder="Re-enter your password"
        hint={mismatch ? <span style={{ color: '#ff5151' }}>NO MATCH</span> : (pw2 && !mismatch ? <span style={{ color: G }}>✓ MATCH</span> : null)}
        value={pw2} onChange={e => set({ pw2: e.target.value })} />
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: -6 }}>
        <Req ok={hasLen}>8+ CHARACTERS</Req>
        <Req ok={hasLetter}>1 LETTER</Req>
        <Req ok={hasNum}>1 NUMBER</Req>
      </div>
      <NavRow>
        <GhostBtn label="Back" onClick={back} />
        <WizBtn label="Continue" disabled={!valid} onClick={next} />
      </NavRow>
    </div>
  );
}

function DocModal({ kind, onClose }) {
  const title = kind === 'terms' ? 'TERMS & CONDITIONS' : 'PRIVACY POLICY';
  const body = kind === 'terms'
    ? [
        ['01 · ELIGIBILITY', 'You must be at least 13 years old to register. Accounts found to be underage or fraudulent will be suspended without notice.'],
        ['02 · FAIR PLAY', 'Cheating, smurfing, account-sharing, and match-fixing are strictly prohibited and result in permanent bans and prize forfeiture.'],
        ['03 · CONDUCT', 'Harassment, hate speech, and toxic behaviour in chats, lobbies, or broadcasts will not be tolerated.'],
        ['04 · PRIZES', 'Prize payouts are issued in IQD via verified bank transfer within 30 days of an event, subject to identity confirmation.'],
      ]
    : [
        ['01 · WHAT WE COLLECT', 'We store your nickname, hashed password, phone number, date of birth, and gender to operate your account.'],
        ['02 · WHAT OTHERS SEE', 'Only your nickname and avatar are public. Your real name, phone, date of birth and gender are never shown to other players.'],
        ['03 · ADMIN ACCESS', 'Authorised admins may view your full details strictly for verification, payouts, and dispute resolution.'],
        ['04 · YOUR RIGHTS', 'You may request export or deletion of your data at any time by contacting privacy@earthlink.gg.'],
      ];
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 32, animation: 'fadeUp 0.25s ease' }}>
      <div onClick={e => e.stopPropagation()} style={{ position: 'relative', width: '100%', maxWidth: 560, maxHeight: '80vh', overflowY: 'auto', background: '#080808', border: `1px solid ${G}`, boxShadow: `0 0 50px ${GG}`, padding: '36px 40px' }}>
        <HudCorners size={16} color={G} glow />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <div style={{ fontFamily: 'monospace', fontSize: 10, color: G, letterSpacing: '0.2em', marginBottom: 8 }}>/// .legal.document</div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 22, color: '#fff' }}>{title}</div>
          </div>
          <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.6)', width: 32, height: 32, cursor: 'pointer', fontFamily: 'monospace', fontSize: 14 }}>✕</button>
        </div>
        {body.map(([h, p]) => (
          <div key={h} style={{ marginBottom: 20 }}>
            <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.14em', marginBottom: 8 }}>{h}</div>
            <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 15, color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>{p}</p>
          </div>
        ))}
        <div style={{ fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.3)', letterSpacing: '0.12em', marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          v.2026.06 — EARTHLINK.ESPORTS
        </div>
      </div>
    </div>
  );
}

function StepTerms({ data, set, finish, back, loading }) {
  const [showDoc, setShowDoc] = useState(null);
  return (
    <div>
      <StepHead n={6} slug=".register.final_handshake" line1="ONE LAST" line2="STEP_"
        sub="Review and accept our terms to activate your account. You're almost on the roster." />
      <div onClick={() => set({ agree: !data.agree })}
        style={{ display: 'flex', gap: 12, alignItems: 'flex-start', cursor: 'pointer', padding: '14px 16px', background: data.agree ? 'rgba(0,166,62,0.06)' : 'transparent', border: `1px solid ${data.agree ? 'rgba(0,166,62,0.3)' : 'rgba(255,255,255,0.1)'}`, transition: 'all 0.2s' }}>
        <div style={{ width: 18, height: 18, flexShrink: 0, marginTop: 1, border: `1.5px solid ${data.agree ? G : 'rgba(255,255,255,0.3)'}`, background: data.agree ? G : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: data.agree ? `0 0 8px ${GG}` : 'none', transition: 'all 0.2s' }}>
          {data.agree && <span style={{ color: '#fff', fontSize: 12, fontWeight: 900, lineHeight: 1 }}>✓</span>}
        </div>
        <span style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5 }}>
          I agree to the{' '}
          <span onClick={e => { e.stopPropagation(); setShowDoc('terms'); }} style={{ color: G, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2 }}>Terms &amp; Conditions</span>{' '}
          and{' '}
          <span onClick={e => { e.stopPropagation(); setShowDoc('privacy'); }} style={{ color: G, fontWeight: 700, textDecoration: 'underline', textUnderlineOffset: 2 }}>Privacy Policy</span>{' '}
          of this platform.
        </span>
      </div>
      <NavRow>
        <GhostBtn label="Back" onClick={back} />
        <WizBtn label="Create Account" disabled={!data.agree} loading={loading} loadingLabel="CREATING..." arrow="→" onClick={finish} />
      </NavRow>
      {showDoc && <DocModal kind={showDoc} onClose={() => setShowDoc(null)} />}
    </div>
  );
}

function RegSuccess({ data, onHome }) {
  const av = data.avatar != null ? AVATARS[data.avatar] : AVATARS[0];
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontFamily: 'monospace', fontSize: 11, color: G, letterSpacing: '0.22em', marginBottom: 18 }}>/// .register.complete</div>
      <div style={{ position: 'relative', width: 96, height: 96, margin: '0 auto 28px', border: `1px solid ${G}`, padding: 8, boxShadow: `0 0 30px ${GG}` }}>
        <HudCorners size={14} color={G} glow />
        <img src={av.url} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
      </div>
      <GlitchH text="WELCOME," size={40} extra={{ marginBottom: 2 }} />
      <GlitchH text={(data.nickname || 'PLAYER').toUpperCase() + '_'} color={G} size={40} extra={{ textShadow: `0 0 30px ${GG}`, marginBottom: 24 }} />
      <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 16, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, maxWidth: 400, margin: '0 auto 28px' }}>
        Your account is live. You're in the arena.
      </p>
      <div style={{ display: 'flex', gap: 12 }}>
        <WizBtn label="Enter Platform" onClick={onHome} arrow="→" />
      </div>
    </div>
  );
}

function RegisterWizard({ go, step, setStep, onHome }) {
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
      <div style={{ textAlign: 'center', marginTop: 24, fontFamily: 'Rajdhani, sans-serif', fontSize: 14, color: 'rgba(255,255,255,0.5)' }}>
        Already on the roster?{' '}
        <a onClick={e => { e.preventDefault(); go('signin'); }} style={{ color: G, textDecoration: 'none', cursor: 'pointer', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', fontSize: 13 }}>Sign in →</a>
      </div>
    </div>
  );
}

/* ─── SIDE PANEL ─── */
function SidePanel({ view }) {
  const headlines = {
    signin: ['ENTER THE', 'ARENA_'],
    forgot: ['SECURE', 'PROTOCOL_'],
    create: ['BEGIN YOUR', 'JOURNEY_'],
  };
  const taglines = {
    signin: 'Authenticate to resume your competitive run.',
    forgot: 'Encrypted recovery — your data stays yours.',
    create: 'Two minutes from rookie to roster member.',
  };
  const [h1, h2] = headlines[view];

  return (
    <div style={{ position: 'relative', height: '100%', overflow: 'hidden', background: '#050505', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1400&q=80)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(0.45) contrast(1.1) saturate(0.85)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,166,62,0.18) 0%, transparent 40%, rgba(5,5,5,0.95) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.18) 2px, rgba(0,0,0,0.18) 4px)' }} />

      {[{ top: 24, left: 24 }, { top: 24, right: 24 }, { bottom: 24, left: 24 }, { bottom: 24, right: 24 }].map((p, i) => (
        <div key={i} style={{ position: 'absolute', ...p, color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 18, lineHeight: 1, zIndex: 4 }}>+</div>
      ))}

      <div style={{ position: 'relative', zIndex: 2, padding: 56, display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 'auto' }}>
          <div style={{ width: 40, height: 40, background: G, clipPath: 'polygon(0 0, 100% 0, 100% 70%, 70% 100%, 0 100%)', boxShadow: `0 0 16px ${GG}` }} />
          <div>
            <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '0.04em', lineHeight: 1 }}>
              EARTHLINK<span style={{ color: G }}>.ESPORTS</span>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: G, letterSpacing: '0.25em', marginTop: 4 }}>SEASON_2026 / ONLINE</div>
          </div>
        </div>

        <div style={{ marginTop: 80, marginBottom: 'auto' }}>
          <div key={view}>
            <GlitchH text={h1} size={72} extra={{ marginBottom: 4 }} />
            <GlitchH text={h2} color={G} size={72} extra={{ textShadow: `0 0 50px ${GG}` }} />
          </div>
          <p style={{ fontFamily: 'Rajdhani, sans-serif', fontSize: 18, color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, marginTop: 24, maxWidth: 420, fontWeight: 500 }}>
            {taglines[view]}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── AUTH PAGE ROOT ─── */
export default function AuthPage({ initialView = 'signin', onHome }) {
  const [view, setView] = useState(initialView);
  const [regStep, setRegStep] = useState(0);

  const goView = v => { if (v === 'create') setRegStep(0); setView(v); };

  return (
    <div style={{ minHeight: '100vh', background: '#050505' }}>
      <AuthBG />
      <div style={{ position: 'relative', zIndex: 2, minHeight: '100vh', display: 'grid', gridTemplateColumns: '1.05fr 1fr' }}>
        <SidePanel view={view} />

        <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: 'rgba(5,5,5,0.92)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '24px 56px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <button onClick={onHome} style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.5)',
              letterSpacing: '0.18em', textDecoration: 'none', transition: 'color 0.2s',
            }}
              onMouseEnter={e => e.currentTarget.style.color = G}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.5)'}>
              ← BACK_TO_HOME
            </button>
          </div>

          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 56px' }}>
            <div key={view} style={{ width: '100%', maxWidth: view === 'create' ? 540 : 460, animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1)' }}>
              {view === 'signin' && <SignIn go={goView} />}
              {view === 'forgot' && <Forgot go={goView} />}
              {view === 'create' && <RegisterWizard go={goView} step={regStep} setStep={setRegStep} onHome={onHome} />}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px 56px', borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: 'monospace', fontSize: 10, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em' }}>
            <span>© 2026 EARTHLINK.ESPORTS</span>
            <span>PRIVACY · TERMS · HELP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
