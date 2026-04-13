import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Terminal, Lock, BookDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MatrixBackground from './components/MatrixBackground';
import CyberButton from './components/CyberButton';
import SectionHeader from './components/SectionHeader';
import ContactTerminal from './components/ContactTerminal';
import { SafeLabsLogo, ZstibLogo ,MokLogo, BibliotekaLogo, UtwLogo} from './components/Logos';

import MainPage from './pages/MainPage';
import PasswordCheckPage from './pages/PasswordCheckPage';
import EbookPage from './pages/EbookPage';
import NotFoundPage from './pages/NotFoundPage';

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, hash: string) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(hash);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname !== '/') {
      navigate('/');
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-40 bg-cyber-black/90 backdrop-blur-md border-b border-white/5">
        <div className="w-full px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4 sm:gap-6">
            <a href="/" onClick={handleLogoClick} className="flex items-center gap-3 cursor-pointer group select-none no-drag">
              <SafeLabsLogo className="h-10 w-auto group-hover:scale-105 transition-transform duration-300 pointer-events-none" />
              <div className="flex flex-col leading-none pointer-events-none">
                <span className="text-white font-bold tracking-widest text-lg font-mono">SAFE</span>
                <span className="text-cyber-cyan font-bold tracking-[0.2em] text-sm font-mono -mt-1">LABS</span>
              </div>
            </a>

            <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest hidden xl:block transition-colors">Partnerzy:</span>
              <a href="https://zstib.edu.pl/" target="_blank" rel="noopener noreferrer" className="group/sponsor transition-all">
                <ZstibLogo className="h-12 w-auto transition-all duration-300" />
              </a>
              <a href="https://mok-brzesko.pl/" target="_blank" rel="noopener noreferrer" className="group/sponsor transition-all">
                <MokLogo className="h-10 w-auto transition-all duration-300" />              
              </a>
              <a href="https://mok-brzesko.pl/" target="_blank" rel="noopener noreferrer" className="group/sponsor transition-all">
                <BibliotekaLogo className="h-10 w-auto transition-all duration-300 px-2" />              
              </a>
              <a href="https://mok-brzesko.pl/utw/" target="_blank" rel="noopener noreferrer" className="group/sponsor transition-all">
                <UtwLogo className="h-12 w-auto transition-all duration-300" />
              </a>
            </div>
          </div>

          <div className="hidden xl:flex gap-8 items-center font-mono text-sm tracking-wide">
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="relative hover:text-cyber-cyan transition-colors hover:drop-shadow-[0_0_18px_rgba(0,243,255,0.45)]">[ O NAS ]</a>
            <a href="#threats" onClick={(e) => handleNavClick(e, 'threats')} className="relative hover:text-cyber-red transition-colors hover:drop-shadow-[0_0_18px_rgba(255,42,42,0.45)]">[ ZAGROŻENIA ]</a>
            <a href="#workshops" onClick={(e) => handleNavClick(e, 'workshops')} className="relative hover:text-cyber-green transition-colors hover:drop-shadow-[0_0_18px_rgba(0,255,65,0.45)]">[ WARSZTATY ]</a>
            <a 
              href="/sprawdz-haslo" 
              onClick={(e) => { e.preventDefault(); navigate('/sprawdz-haslo'); }} 
              className={`relative transition-colors hover:drop-shadow-[0_0_18px_rgba(255,0,255,0.45)] ${location.pathname === '/sprawdz-haslo' ? 'text-cyber-pink' : 'hover:text-cyber-pink'}`}
            >
              <span className="flex items-center gap-2"><Lock className="w-3 h-3" /> [ SPRAWDŹ HASŁO ]</span>
            </a>
            <a
              href="/ebook"
              onClick={(e) => { e.preventDefault(); navigate('/ebook'); }}
              className={`relative transition-colors hover:drop-shadow-[0_0_18px_rgba(0,243,255,0.45)] ${location.pathname === '/ebook' ? 'text-cyber-cyan' : 'hover:text-cyber-cyan'}`}
            >
              <span className="flex items-center gap-2"><BookDown className="w-3 h-3" /> [ E-BOOK ]</span>
            </a>
            <CyberButton variant="primary" href="#contact" onClick={(e) => handleNavClick(e, 'contact')}>DOŁĄCZ TERAZ</CyberButton>
          </div>

          <button onClick={toggleMenu} className="xl:hidden text-white hover:text-cyber-cyan transition-colors">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 xl:hidden font-mono"
          >
            <a href="#about" onClick={(e) => handleNavClick(e, 'about')} className="text-2xl text-cyber-cyan">&lt; O NAS /&gt;</a>
            <a href="#threats" onClick={(e) => handleNavClick(e, 'threats')} className="text-2xl text-cyber-red">&lt; ZAGROŻENIA /&gt;</a>
            <a href="#workshops" onClick={(e) => handleNavClick(e, 'workshops')} className="text-2xl text-cyber-green">&lt; WARSZTATY /&gt;</a>
            <a href="/sprawdz-haslo" onClick={() => { navigate('/sprawdz-haslo'); toggleMenu(); }} className="text-2xl text-cyber-pink">&lt; SPRAWDŹ HASŁO /&gt;</a>
            <a href="/ebook" onClick={() => { navigate('/ebook'); toggleMenu(); }} className="text-2xl text-cyber-cyan">&lt; E-BOOK /&gt;</a>
            <CyberButton onClick={(e) => handleNavClick(e, 'contact')} href="#contact">ZAPISZ SIĘ</CyberButton>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const Footer = () => {
  const [emailCopied, setEmailCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard.writeText('kontakt@safelabs.pl');
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 2000);
  };

  return (
    <footer id="contact" className="bg-[#020202] pt-20 pb-10 border-t border-white/10 relative z-10">
      <div className="container mx-auto px-4">
        <SectionHeader title="CONTACT_PROTOCOL" subtitle="Skontaktuj się z nami" align="center" />

        <div className="grid lg:grid-cols-2 gap-12 mb-16 items-start">
          {/* Left Column: Contact Info */}
          <div className="space-y-8">
            <div className="bg-[#0a0505] border border-gray-800 p-8 rounded-lg">
              <div className="mb-6 flex items-center gap-2">
                <SafeLabsLogo className="h-8 w-auto" />
                <span className="text-white font-bold font-mono text-xl tracking-wider">SAFE LABS</span>
              </div>
              <p className="text-gray-400 mb-8 leading-relaxed">
                Jesteś nauczycielem, dyrektorem szkoły lub rodzicem? <br />
                Skontaktuj się z nami, aby zorganizować warsztaty w Twojej placówce.
                Działamy głównie w MOK Brzesko, ale jesteśmy otwarci na współpracę.
              </p>

              <h3 className="text-xl font-bold text-white mb-6 font-mono flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyber-green" /> LOKALIZACJA_OPERACJI
              </h3>
              <ul className="text-gray-400 space-y-4 font-mono">
                <li className="flex items-center gap-3 group cursor-default">
                  <span className="w-2 h-2 bg-cyber-green rounded-full group-hover:animate-ping"></span>
                  Miejski Ośrodek Kultury w Brzesku
                </li>
                <li className="flex items-center gap-3 group cursor-default">
                  <span className="w-2 h-2 bg-gray-600 rounded-full group-hover:bg-white transition-colors"></span>
                  Lokalne Szkoły Podstawowe
                </li>
              </ul>
            </div>

            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61584809435647" target="_blank" className="flex-1 h-14 border border-white/20 flex items-center justify-center rounded hover:bg-cyber-cyan hover:text-black hover:border-cyber-cyan transition-all group">
                <Facebook size={24} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://www.instagram.com/_safe_labs/" target="_blank" className="flex-1 h-14 border border-white/20 flex items-center justify-center rounded hover:bg-cyber-pink hover:text-black hover:border-cyber-pink transition-all group">
                <Instagram size={24} className="group-hover:scale-110 transition-transform" />
              </a>
              <a href="https://www.tiktok.com/@_safe_labs" target="_blank" className="flex-1 h-14 border border-white/20 flex items-center justify-center rounded hover:bg-white hover:text-black hover:border-white transition-all group font-bold">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.6" className="w-7 h-7 group-hover:scale-110 transition-transform" stroke="currentColor">
                  <path d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </a>
            </div>

            <button onClick={copyEmail} className="-mt-10 inline-block text-sm font-mono text-gray-500 hover:text-gray-300 transition-colors cursor-pointer lg:text-left text-center w-full lg:w-auto">
              {emailCopied ? '✓ Skopiowane!' : 'kontakt@safelabs.pl'}
            </button>
          </div>

          {/* Right Column: Contact Form */}
          <div className="w-full">
            <ContactTerminal />
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-600 font-mono">
          <p>&copy; 2025 SAFE LABS PROJECT. SYSTEM SECURE.</p>
          <p className="mt-2 md:mt-0 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyber-green rounded-full animate-pulse"></span>
            SERVER STATUS: ONLINE
          </p>
        </div>
      </div>
    </footer>
  );
};

const PartnersSection = () => {
  return (
    <section id="partners" className="bg-[#020202] py-16 border-t border-white/10 relative z-10">
      <div className="container mx-auto px-4">
        <SectionHeader title="PARTNERS_PROTOCOL" subtitle="Nasi partnerzy" align="center" />

        <div className="mt-10 bg-[#050a0a] p-8 rounded-lg">
          <div className="mx-auto flex w-full max-w-5xl flex-nowrap items-center justify-center gap-14 overflow-x-auto py-2">
            <a href="https://zstib.edu.pl/" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-90 hover:opacity-100 transition-opacity">
              <ZstibLogo className="h-24 w-auto drop-shadow-[0_0_22px_rgba(0,243,255,0.12)]" />
            </a>
            <a href="https://mok-brzesko.pl/" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-90 hover:opacity-100 transition-opacity">
              <MokLogo className="h-20 w-auto drop-shadow-[0_0_22px_rgba(255,42,42,0.10)]" />
            </a>
            <a href="https://mok-brzesko.pl/" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-90 hover:opacity-100 transition-opacity">
              <BibliotekaLogo className="h-20 w-auto max-w-[380px] px-4 drop-shadow-[0_0_22px_rgba(0,255,65,0.10)]" />
            </a>
            <a href="https://mok-brzesko.pl/utw/" target="_blank" rel="noopener noreferrer" className="shrink-0 opacity-90 hover:opacity-100 transition-opacity">
              <UtwLogo className="h-24 w-auto drop-shadow-[0_0_22px_rgba(255,255,0,0.10)]" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-cyber-black text-gray-300 font-sans selection:bg-cyber-green selection:text-black overflow-hidden relative">
        <MatrixBackground />
        <div className="crt fixed inset-0 pointer-events-none z-50 opacity-20"></div>

        <Navigation />

        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/sprawdz-haslo" element={<PasswordCheckPage />} />
          <Route path="/ebook" element={<EbookPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <PartnersSection />
        <Footer />
      </div>
    </Router>
  );
};

export default App;
