import { useState, useEffect, useRef } from 'react';

export function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, visible];
}

export function useParallax(speed = 0.15) {
  const ref = useRef(null);
  const [y, setY] = useState(0);

  useEffect(() => {
    const update = () => {
      if (!ref.current) return;
      const rect = ref.current.getBoundingClientRect();
      setY((rect.top + rect.height / 2 - window.innerHeight / 2) * speed);
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, [speed]);

  return [ref, y];
}

export function fadeStyle(visible, delay = 0, dir = 'up') {
  const transforms = {
    up:    'translateY(56px)',
    left:  'translateX(-60px)',
    right: 'translateX(60px)',
    scale: 'scale(0.88)',
    down:  'translateY(-32px)',
  };
  return {
    opacity: visible ? 1 : 0,
    transform: visible ? 'none' : (transforms[dir] || transforms.up),
    transition: `opacity 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s, transform 0.95s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  };
}
