import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Tournaments from './components/Tournaments';
import Teams from './components/Teams';
import Camps from './components/Camps';
import Coaches from './components/Coaches';
import Banner from './components/Banner';
import NewsSection from './components/NewsSection';
import Partners from './components/Partners';
import CTA from './components/CTA';
import Footer from './components/Footer';

function Cursor() {
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

export default function App() {
  return (
    <>
      <div id="cursor" />
      <div id="cursor-trail" />
      <Cursor />
      <Navbar />
      <Hero />
      <Features />
      <Banner />
      <Tournaments />
      <Teams />
      <Camps />
      <Coaches />
      <NewsSection />
      <Partners />
      <CTA />
      <Footer />
    </>
  );
}
