import { useState } from 'react';
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
import AuthPage from './pages/AuthPage';
import LegalPage from './pages/LegalPage';
import Cursor from './components/Cursor';
import { useLang } from './LanguageContext';

export default function App() {
  const { t } = useLang();
  const [page, setPage] = useState('home'); // 'home' | 'signin' | 'register' | 'terms' | 'privacy'

  if (page === 'terms' || page === 'privacy') {
    return (
      <>
        <Cursor />
        <LegalPage
          data={page === 'terms' ? t.termsPage : t.privacyPage}
          copyright={t.footer.copyright}
          onHome={() => setPage('home')}
        />
      </>
    );
  }

  if (page === 'signin') {
    return (
      <>
        <Cursor />
        <AuthPage initialView="signin" onHome={() => setPage('home')} />
      </>
    );
  }
  if (page === 'register') {
    return (
      <>
        <Cursor />
        <AuthPage initialView="create" onHome={() => setPage('home')} />
      </>
    );
  }

  return (
    <>
      <Cursor />
      <Navbar onSignIn={() => setPage('signin')} onJoin={() => setPage('register')} />
      <Hero onJoin={() => setPage('register')} />
      <Features />
      <Banner />
      <Tournaments />
      <Teams />
      <Camps />
      <Coaches />
      <NewsSection />
      <Partners />
      <CTA onJoin={() => setPage('register')} />
      <Footer onTerms={() => setPage('terms')} onPrivacy={() => setPage('privacy')} />
    </>
  );
}
