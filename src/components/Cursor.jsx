import { useEffect } from 'react';

function CursorTracker() {
  useEffect(() => {
    const cursor = document.getElementById('cursor');
    const trail = document.getElementById('cursor-trail');
    if (!cursor || !trail) return;

    let mx = 0, my = 0, tx = 0, ty = 0;

    const onMove = e => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + 'px';
      cursor.style.top = my + 'px';
    };

    function loop() {
      tx += (mx - tx) * 0.12;
      ty += (my - ty) * 0.12;
      trail.style.left = tx + 'px';
      trail.style.top = ty + 'px';
      requestAnimationFrame(loop);
    }

    document.addEventListener('mousemove', onMove);
    loop();
    document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%,-50%) scale(0.6)');
    document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%,-50%) scale(1)');

    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  return null;
}

export default function Cursor() {
  return (
    <>
      <div id="cursor" />
      <div id="cursor-trail" />
      <CursorTracker />
    </>
  );
}
