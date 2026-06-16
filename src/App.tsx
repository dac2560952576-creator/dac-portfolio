import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import AboutSection from './components/AboutSection';
import ProjectsSection from './components/ProjectsSection';
import FooterSection from './components/FooterSection';
import ProjectsDetail from './components/ProjectsDetail';
import HotpotDetail from './components/HotpotDetail';
import CadillacDetail from './components/CadillacDetail';
import GameUIDetail from './components/GameUIDetail';
import ContactPage from './components/ContactPage';
import FloatingNav from './components/FloatingNav';
import NoiseCanvas from './components/NoiseCanvas';

type Page = 'main' | 'projects' | 'hotpot' | 'cadillac' | 'gameui' | 'contact';

const PAGE_TITLES: Record<Page, string> = {
  main: 'DAC -- 3D Creator',
  projects: 'Works -- DAC',
  hotpot: 'Hotpot App -- DAC',
  cadillac: 'Cadillac Web -- DAC',
  gameui: 'Game UI -- DAC',
  contact: 'Contact -- DAC',
};

export default function App() {
  // Restore page from URL on load
  const getInitialPage = (): Page => {
    const path = window.location.pathname.replace(/^\//, '');
    if (path === 'projects') return 'projects';
    if (path === 'hotpot') return 'hotpot';
    if (path === 'cadillac') return 'cadillac';
    if (path === 'gameui') return 'gameui';
    if (path === 'contact') return 'contact';
    return 'main';
  };
  const [page, setPage] = useState<Page>(getInitialPage);

  // ── History-aware navigation ───────────────────────────────────
  const navigate = useCallback((p: Page) => {
    window.history.pushState({ page: p }, '', `/${p === 'main' ? '' : p}`);
    document.title = PAGE_TITLES[p];
    setPage(p);
    window.scrollTo(0, 0);
  }, []);

  // ── Handle browser back / forward ──────────────────────────────
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const state = e.state as { page?: Page } | null;
      if (state?.page) {
        setPage(state.page);
        window.scrollTo(0, 0);
      } else {
        setPage('main');
        window.scrollTo(0, 0);
      }
    };
    // Push initial state & scroll to top on load
    window.scrollTo(0, 0);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const Orbs = (
    <div className="pointer-events-none fixed inset-0 z-0">
      <div className="absolute rounded-full" style={{ width: 'min(600px, 80vw)', height: 'min(600px, 80vw)', background: 'radial-gradient(circle, rgba(182,0,168,0.08) 0%, transparent 70%)', filter: 'blur(140px)', top: '-10%', right: '-5%' }} />
      <div className="absolute rounded-full" style={{ width: 'min(500px, 70vw)', height: 'min(500px, 70vw)', background: 'radial-gradient(circle, rgba(74,108,247,0.06) 0%, transparent 70%)', filter: 'blur(130px)', bottom: '20%', left: '-8%' }} />
      <div className="absolute rounded-full" style={{ width: 'min(450px, 60vw)', height: 'min(450px, 60vw)', background: 'radial-gradient(circle, rgba(190,76,0,0.05) 0%, transparent 70%)', filter: 'blur(120px)', top: '50%', left: '40%' }} />
    </div>
  );

  return (
    <main className="main-wrapper relative">
      <NoiseCanvas />
      {Orbs}

      <FloatingNav onNavigate={(target) => {
        if (target === 'home') { navigate('main'); return; }
        if (target === 'about') { navigate('main'); setTimeout(() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' }), 100); return; }
        navigate(target as Page);
      }} />

      {page === 'main' && (
        <>
          <HeroSection onNavigateProjects={() => navigate('projects')} onNavigateContact={() => navigate('contact')} />
          <MarqueeSection />
          <AboutSection />
          <ProjectsSection onNavigateHotpot={() => navigate('hotpot')} onNavigateCadillac={() => navigate('cadillac')} onNavigateGameUI={() => navigate('gameui')} />
          <FooterSection />
        </>
      )}
      {page === 'projects' && (
        <ProjectsDetail
          onBack={() => navigate('main')}
          onGoHome={() => navigate('main')}
          onNavigateHotpot={() => navigate('hotpot')}
          onNavigateCadillac={() => navigate('cadillac')}
          onNavigateGameUI={() => navigate('gameui')}
          onNavigateContact={() => navigate('contact')}
        />
      )}
      {page === 'hotpot' && (
        <HotpotDetail onBack={() => navigate('projects')} onGoHome={() => navigate('main')} onNavigateContact={() => navigate('contact')} />
      )}
      {page === 'cadillac' && (
        <CadillacDetail onBack={() => navigate('projects')} onGoHome={() => navigate('main')} onNavigateContact={() => navigate('contact')} />
      )}
      {page === 'gameui' && (
        <GameUIDetail onBack={() => navigate('projects')} onGoHome={() => navigate('main')} onNavigateContact={() => navigate('contact')} />
      )}
      {page === 'contact' && (
        <ContactPage onBack={() => navigate('main')} onGoHome={() => navigate('main')} onNavigateProjects={() => navigate('projects')} />
      )}
    </main>
  );
}
