
import React, { useState } from 'react';
import { Shield, Lock, Eye, AlertTriangle, Instagram, Facebook, Ghost, Menu, X, Terminal, Cpu, Globe, CheckCircle, Skull, Zap, Send, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

import MatrixBackground from './components/MatrixBackground';
import ScrambleText from './components/ScrambleText';
import CyberButton from './components/CyberButton';
import SectionHeader from './components/SectionHeader';
import TerminalWindow from './components/TerminalWindow';
import ValidationError from './components/ValidationError';
import { supabase } from './supabaseClient';

// Custom Blue Shield Logo - Replaced with PNG asset
const SafeLabsLogo = ({ className = "h-10", glow = false }: { className?: string, glow?: boolean }) => {
  const logoUrl = new URL('./assets/logo.png', import.meta.url).href;
  return (
    <img 
      src={logoUrl}
      alt="Safe Labs" 
      className={`${className} object-contain ${glow ? 'drop-shadow-[0_0_20px_rgba(0,243,255,0.6)]' : ''}`} 
    />
  );
};

const ContactTerminal = () => {
  const [formData, setFormData] = useState({
    schoolName: '',
    email: '',
    additionalInfo: ''
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
  const [validationErrors, setValidationErrors] = useState<{ schoolName?: string; email?: string }>({});

  const addToConsole = (text: string) => {
    setConsoleOutput(prev => [...prev, `> ${text}`]);
  };

  const validateForm = (): boolean => {
    const errors: { schoolName?: string; email?: string } = {};
    
    if (!formData.schoolName.trim()) {
      errors.schoolName = "Nazwa szkoły / instytucji jest wymagana.";
    }
    
    if (!formData.email.trim()) {
      errors.email = "Email lub telefon kontaktowy jest wymagany.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && !/^\d{9,}$/.test(formData.email.replace(/\s/g, ''))) {
      errors.email = "Podaj poprawny email lub numer telefonu.";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      addToConsole("ERROR: Validation failed. Check required fields.");
      return;
    }

    setStatus('loading');
    addToConsole("Initializing encrypted connection...");
    addToConsole(`Target: ${formData.schoolName}`);
    addToConsole("Encrypting payload...");

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([
          { 
            school_name: formData.schoolName, 
            contact_email: formData.email, 
            additional_info: formData.additionalInfo,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) throw error;

      setTimeout(() => {
        setStatus('success');
        addToConsole("SUCCESS: Payload delivered.");
        addToConsole("Session terminated.");
        setFormData({ schoolName: '', email: '', additionalInfo: '' });
      }, 1500);
      
    } catch (err) {
      console.error(err);
      setStatus('error');
      addToConsole("CRITICAL ERROR: Connection refused (Check API Key).");
    }
  };

  return (
    <div className="bg-[#050505] border border-gray-800 rounded-lg overflow-hidden max-w-2xl w-full mx-auto relative group">
      <div className="absolute inset-0 bg-cyber-green/5 group-hover:bg-cyber-green/10 transition-colors pointer-events-none"></div>
      
      <div className="bg-[#111] px-4 py-2 flex justify-between items-center border-b border-gray-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="font-mono text-xs text-gray-500">SECURE_COMM_CHANNEL v2.0</div>
      </div>

      <div className="p-6 md:p-8 relative z-10">
        {status === 'success' ? (
          <div className="text-center py-12 space-y-4">
            <CheckCircle className="w-16 h-16 text-cyber-green mx-auto animate-bounce" />
            <h3 className="text-2xl font-bold text-white font-mono">ZGŁOSZENIE PRZYJĘTE</h3>
            <p className="text-gray-400">Nasz operator skontaktuje się z placówką w najbliszym czasie.</p>
            <button 
              onClick={() => setStatus('idle')}
              className="mt-4 text-cyber-green hover:underline font-mono text-sm"
            >
              [ Wyślij nowe zgłoszenie ]
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-cyber-cyan font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                <Shield className="w-3 h-3" /> Nazwa Szkoły / Instytucji *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-mono">{'>'}</span>
                <input 
                  type="text" 
                  value={formData.schoolName}
                  onChange={e => {
                    setFormData({...formData, schoolName: e.target.value});
                    if (validationErrors.schoolName) {
                      setValidationErrors({...validationErrors, schoolName: undefined});
                    }
                  }}
                  className={`w-full bg-black/50 border text-white font-mono pl-8 pr-4 py-3 focus:outline-none transition-all placeholder-gray-700 ${
                    validationErrors.schoolName ? 'border-cyber-red focus:border-cyber-red focus:ring-1 focus:ring-cyber-red' : 'border-gray-700 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan'
                  }`}
                  placeholder="np. PSP nr 2 w Brzesku"
                />
              </div>
              <ValidationError message={validationErrors.schoolName || ''} isVisible={!!validationErrors.schoolName} />
            </div>

            <div className="space-y-2">
              <label className="text-cyber-cyan font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                <Globe className="w-3 h-3" /> Email / Telefon Kontaktowy *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-mono">{'>'}</span>
                <input 
                  type="text" 
                  value={formData.email}
                  onChange={e => {
                    setFormData({...formData, email: e.target.value});
                    if (validationErrors.email) {
                      setValidationErrors({...validationErrors, email: undefined});
                    }
                  }}
                  className={`w-full bg-black/50 border text-white font-mono pl-8 pr-4 py-3 focus:outline-none transition-all placeholder-gray-700 ${
                    validationErrors.email ? 'border-cyber-red focus:border-cyber-red focus:ring-1 focus:ring-cyber-red' : 'border-gray-700 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan'
                  }`}
                  placeholder="sekretariat@szkola.pl"
                />
              </div>
              <ValidationError message={validationErrors.email || ''} isVisible={!!validationErrors.email} />
            </div>

            <div className="space-y-1">
              <label className="text-cyber-green font-mono text-xs tracking-wider uppercase flex items-center gap-2">
                <Terminal className="w-3 h-3" /> Dodatkowe Informacje (Opcjonalne)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-3 text-gray-500 font-mono">{'>'}</span>
                <textarea 
                  value={formData.additionalInfo}
                  onChange={e => setFormData({...formData, additionalInfo: e.target.value})}
                  className="w-full bg-black/50 border border-gray-700 text-white font-mono pl-8 pr-4 py-3 h-24 focus:outline-none focus:border-cyber-green focus:ring-1 focus:ring-cyber-green transition-all placeholder-gray-700 resize-none"
                  placeholder="Preferowany termin, liczba klas..."
                />
              </div>
            </div>

            {consoleOutput.length > 0 && (
              <div className="bg-black/80 p-2 text-[10px] font-mono text-gray-500 h-20 overflow-y-auto border-t border-gray-800">
                {consoleOutput.map((log, i) => (
                  <div key={i}>{log}</div>
                ))}
                <div className="animate-pulse">_</div>
              </div>
            )}

            <button 
              type="submit" 
              disabled={status === 'loading'}
              className="w-full bg-cyber-green/10 border border-cyber-green text-cyber-green font-bold font-mono py-4 uppercase tracking-widest hover:bg-cyber-green hover:text-black transition-all group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  TRANSMITTING...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  WYŚLIJ ZGŁOSZENIE
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const stats = [
    { value: "4h+", label: "CZAS ONLINE", description: "Średnio dziennie w sieci", variant: "info" },
    { value: "17%", label: "NIEŚWIADOMI", description: "Nie rozpoznaje cyberprzemocy", variant: "danger" },
    { value: "77%", label: "ZAGROŻENI", description: "Obawia się stalkingu", variant: "warning" },
  ];

  return (
    <div className="min-h-screen bg-cyber-black text-gray-300 font-sans selection:bg-cyber-green selection:text-black overflow-hidden relative">
      <MatrixBackground />
      <div className="crt fixed inset-0 pointer-events-none z-50 opacity-20"></div>
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-40 bg-cyber-black/90 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer group">
            <SafeLabsLogo className="h-10 w-auto group-hover:scale-105 transition-transform duration-300" />
            <div className="flex flex-col leading-none">
              <span className="text-white font-bold tracking-widest text-lg font-mono">SAFE</span>
              <span className="text-cyber-cyan font-bold tracking-[0.2em] text-sm font-mono -mt-1">LABS</span>
            </div>
          </div>
          
          <div className="hidden md:flex gap-8 items-center font-mono text-sm tracking-wide">
            <a href="#about" className="relative hover:text-cyber-cyan transition-colors hover:drop-shadow-[0_0_18px_rgba(0,243,255,0.45)]">[ O NAS ]</a>
            <a href="#threats" className="relative hover:text-cyber-red transition-colors hover:drop-shadow-[0_0_18px_rgba(255,42,42,0.45)]">[ ZAGROŻENIA ]</a>
            <a href="#workshops" className="relative hover:text-cyber-green transition-colors hover:drop-shadow-[0_0_18px_rgba(0,255,65,0.45)]">[ WARSZTATY ]</a>
            <CyberButton variant="primary" href="#contact">DOŁĄCZ TERAZ</CyberButton>
          </div>

          <button onClick={toggleMenu} className="md:hidden text-white hover:text-cyber-cyan transition-colors">
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
            className="fixed inset-0 z-30 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden font-mono"
          >
            <a href="#about" onClick={toggleMenu} className="text-2xl text-cyber-cyan">&lt; O NAS /&gt;</a>
            <a href="#threats" onClick={toggleMenu} className="text-2xl text-cyber-red">&lt; ZAGROŻENIA /&gt;</a>
            <a href="#workshops" onClick={toggleMenu} className="text-2xl text-cyber-green">&lt; WARSZTATY /&gt;</a>
            <CyberButton onClick={toggleMenu} href="#contact">INITIALIZE</CyberButton>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-cyber-green/5 rounded-full blur-[80px] pointer-events-none"></div>

        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-cyan/30 bg-cyber-cyan/10 text-cyber-cyan font-mono text-xs rounded animate-pulse-fast">
              <span className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></span>
              STATUS: SYSTEM_UNSECURED
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-[0.9]">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">NIE DAJ SIĘ</span>
              <ScrambleText text="ZHAKOWAĆ" className="text-cyber-cyan block mt-2" triggerOnMount speed={40} />
            </h1>
            
            <p className="text-lg md:text-xl font-mono text-gray-400 max-w-lg leading-relaxed border-l-2 border-cyber-green pl-6">
              Interaktywne warsztaty <span className="text-cyber-green">Safe Labs</span>. Uczymy jak przeżyć w cyfrowej dżungli. <br/>
              <span className="text-sm opacity-70 mt-2 block">&gt; Zero nudnej teorii. Czysta praktyka.</span>
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <CyberButton href="#contact" variant="primary">ZAPISZ SIĘ</CyberButton>
              <CyberButton variant="secondary" href="#about">WIĘCEJ DANYCH</CyberButton>
            </div>
          </div>

          <div className="relative hidden lg:block perspective-1000">
             <TerminalWindow title="root@safelabs:~/security_scan" className="transform rotate-y-[-10deg] rotate-x-[5deg] hover:rotate-0 transition-transform duration-700">
               <div className="space-y-2 font-mono text-xs md:text-sm">
                 <div className="flex gap-2"><span className="text-cyber-green">➜</span> <span className="text-white">scan_target --group="Uczniowie 7-8"</span></div>
                 <div className="text-gray-400">Scanning for vulnerabilities...</div>
                 <div className="text-gray-400">Analyzing daily usage... <span className="text-cyber-cyan">[4h+ DETECTED]</span></div>
                 <div className="text-gray-400">Checking defense systems...</div>
                 <div className="text-cyber-red my-2">
                   [!] CRITICAL ERROR: Knowledge missing<br/>
                   [!] PHISHING: Susceptible<br/>
                   [!] PASSWORDS: Weak (e.g., "123456")
                 </div>
                 <div className="flex gap-2 mt-4"><span className="text-cyber-green">➜</span> <span className="text-white">deploy_defense --module="Safe Labs"</span></div>
                 <div className="text-cyber-green">Installing updates...</div>
                 <div className="w-full bg-gray-800 h-2 rounded mt-1 overflow-hidden">
                   <div className="h-full bg-cyber-green animate-[width_2s_ease-in-out_infinite]" style={{width: '60%'}}></div>
                 </div>
               </div>
             </TerminalWindow>
             
             <motion.div 
               animate={{ y: [0, -20, 0] }}
               transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-10 -top-10 w-32 h-32"
             >
                <SafeLabsLogo className="w-full h-full" glow={true} />
             </motion.div>
          </div>
        </div>
      </section>

      {/* Target Group Section */}
      <section id="about" className="py-20 bg-black/50 border-y border-white/5 relative">
        <div className="container mx-auto px-4">
          <SectionHeader title="TARGET_AUDIENCE" subtitle="Kto jest celem?" />
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <TerminalWindow title="user_profile.json" variant="default">
                <span className="text-cyber-pink">const</span> <span className="text-cyber-cyan">targetGroup</span> = {'{'}
                <div className="pl-4 text-gray-300">
                  <span className="text-cyber-green">age</span>: <span className="text-yellow-400">"12-14 lat (Klasy 7-8)"</span>,<br/>
                  <span className="text-cyber-green">status</span>: <span className="text-yellow-400">"Digital Native"</span>,<br/>
                  <span className="text-cyber-green">attributes</span>: [<br/>
                    <span className="pl-4">"Intensywne korzystanie z sieci"</span>,<br/>
                    <span className="pl-4">"Brak nadzoru rodziców"</span>,<br/>
                    <span className="pl-4">"Brak wiedzy o zagrożeniach"</span><br/>
                  ],<br/>
                  <span className="text-cyber-green">location</span>: <span className="text-yellow-400">"Szkoły & MOK Brzesko"</span>
                </div>
                {'}'};
              </TerminalWindow>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <h3 className="text-2xl font-bold text-white font-mono">
                <span className="text-cyber-green">&gt;</span> CYFROWI TUBYLCY BEZ MAPY
              </h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                To młodzież, która intensywnie korzysta z internetu. W tym wieku zaczynają samodzielnie funkcjonować w sieci bez nadzoru rodziców, ale często brakuje im wiedzy o podstawowych zagrożeniach.
              </p>
              <p className="text-gray-400">
                Ich rodzice zazwyczaj nie czują się kompetentni, by edukować dzieci o cyberbezpieczeństwie, a szkoły mają ograniczone zasoby na takie zajęcia.
              </p>
              <div className="flex gap-4 items-center text-sm font-mono text-cyber-cyan">
                <CheckCircle className="w-4 h-4" />
                <span>IDENTYFIKACJA ZAKOŃCZONA POWODZENIEM</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Threats Section */}
      <section id="threats" className="py-24 bg-gradient-to-b from-[#050505] to-[#0f0505] relative z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-transparent to-transparent pointer-events-none"></div>
        <div className="container mx-auto px-4">
          <SectionHeader title="THREAT_ANALYSIS" subtitle="Krytyczne błędy systemu" align="center" />
          
          <div className="max-w-4xl mx-auto mb-16 text-center">
             <p className="text-xl text-gray-300 mb-8 font-light">
               Dzieci i młodzież spędzają w sieci średnio <span className="text-cyber-red font-bold font-mono text-2xl">ponad 4 godziny</span> dziennie, korzystając z social mediów, gier online i komunikatorów. Mimo to, brakuje im systemów obronnych.
             </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {stats.map((stat, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`bg-[#0a0505] border p-8 relative overflow-hidden group
                  ${stat.variant === 'danger' ? 'border-cyber-red/50 hover:border-cyber-red' : stat.variant === 'warning' ? 'border-yellow-500/50 hover:border-yellow-500' : 'border-cyber-cyan/50 hover:border-cyber-cyan'}
                `}
              >
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:bg-white/10 transition-colors"></div>
                
                <div className={`text-6xl font-bold font-mono mb-4 tracking-tighter
                  ${stat.variant === 'danger' ? 'text-cyber-red' : stat.variant === 'warning' ? 'text-yellow-500' : 'text-cyber-cyan'}
                `}>
                  {stat.value}
                </div>
                <h3 className="text-xl font-bold text-white mb-2 uppercase tracking-widest">{stat.label}</h3>
                <p className="text-gray-500 font-mono text-sm border-t border-gray-800 pt-4 mt-2 group-hover:text-gray-300 transition-colors">
                  {stat.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
             <div className="bg-cyber-red/5 border border-cyber-red/20 p-6 rounded-lg">
                <div className="flex items-start gap-4 mb-4">
                  <Skull className="w-8 h-8 text-cyber-red shrink-0" />
                  <h4 className="text-xl font-bold text-white">ZAGROŻENIA</h4>
                </div>
                <ul className="space-y-2 text-gray-400 font-mono text-sm list-disc list-inside">
                  <li>Kradzież danych osobowych</li>
                  <li>Utrata dostępu do kont (gaming, social)</li>
                  <li>Wyłudzenia finansowe (skin scam)</li>
                  <li>Cyberbullying i hejt</li>
                </ul>
             </div>
             
             <div className="bg-gray-900/50 border border-gray-700 p-6 rounded-lg">
                <div className="flex items-start gap-4 mb-4">
                  <Ghost className="w-8 h-8 text-gray-400 shrink-0" />
                  <h4 className="text-xl font-bold text-white">RAPORT NASK 2025</h4>
                </div>
                <p className="text-gray-400 text-sm mb-4">
                  Według raportu NASK „Nastolatki 2025”, aż 17% młodzieży nie potrafi rozpoznać cyberprzemocy. Badania Rzecznika Praw Dziecka pokazują, że 77% dzieci obawia się stalkingu online.
                </p>
                <div className="w-full bg-gray-800 h-1">
                  <div className="h-full bg-cyber-red w-[77%] animate-pulse"></div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section id="workshops" className="py-24 relative z-10 border-t border-cyber-green/20 bg-black">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-green to-transparent opacity-50"></div>
        
        <div className="container mx-auto px-4">
           <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
               <SectionHeader title="INITIATE_PROTOCOL" subtitle="Rozwiązanie: Safe Labs" />
               <p className="text-gray-300 mb-6 text-lg">
                 Nasz projekt odpowiada na tę lukę edukacyjną. Nie uczymy teorii z podręcznika. Uczymy przetrwania.
               </p>
               
               <p className="text-gray-400 mb-8 font-mono text-sm">
                 Budujemy pokolenie cyfrowo świadomych obywateli, którzy nie tylko potrafią się bronić, ale też mogą edukować innych. Inwestycja w edukację jednego ucznia to inwestycja w bezpieczeństwo całej społeczności.
               </p>
               
               <div className="space-y-4">
                 {[
                   { icon: <Shield />, title: "Obrona Danych", desc: "Tworzenie haseł i ochrona prywatności." },
                   { icon: <Zap />, title: "Reakcja", desc: "Jak reagować na phishing i cyberprzemoc." },
                   { icon: <CheckCircle />, title: "Weryfikacja", desc: "Fake news i sprawdzanie informacji." }
                 ].map((item, idx) => (
                   <div key={idx} className="group flex gap-4 p-4 border border-white/5 bg-white/[0.02] hover:bg-cyber-green/5 hover:border-cyber-green/30 transition-all duration-300 rounded-xl">
                     <div className="text-cyber-green bg-black/50 p-3 rounded-lg h-fit border border-cyber-green/20 group-hover:scale-110 transition-transform">{item.icon}</div>
                     <div>
                       <h4 className="text-lg font-bold text-white font-sans group-hover:text-cyber-green transition-colors">{item.title}</h4>
                       <p className="text-gray-500 text-sm font-mono group-hover:text-gray-400">{item.desc}</p>
                     </div>
                   </div>
                 ))}
               </div>
             </div>

             <div className="relative">
                <TerminalWindow title="workshop_schedule.exe" variant="success" className="border-cyber-green/30 drop-shadow-[0_0_40px_rgba(0,255,65,0.08)]">
                   <div className="font-mono text-sm leading-relaxed space-y-4">
                      <div>
                        <span className="text-cyber-green">$</span> ./start_workshop --location=<span className="text-white">"MOK Brzesko"</span>
                      </div>
                      
                      <div className="pl-4 border-l border-gray-700 space-y-2">
                        <div className="text-gray-300">&gt;&gt; Ładowanie modułów...</div>
                        <div className="flex items-center gap-2 text-cyber-green">
                           [✓] Moduł: Rozpoznawanie Phishingu
                        </div>
                        <div className="flex items-center gap-2 text-cyber-green">
                           [✓] Moduł: Bezpieczne Hasła
                        </div>
                        <div className="flex items-center gap-2 text-cyber-green">
                           [✓] Moduł: Cyber-Odporność Psychiczna
                        </div>
                      </div>

                      <div className="bg-cyber-green/10 p-4 border border-cyber-green/20 rounded text-cyber-green">
                         <span className="font-bold">RESULT:</span> Uczestnicy wychodzą z realnymi umiejętnościami ochrony.
                      </div>
                      
                      <div className="text-gray-500 animate-pulse">_Waiting for input...</div>
                   </div>
                </TerminalWindow>

                {/* Cyberpunk Deco */}
                <div className="absolute -z-10 -bottom-10 -right-10 w-64 h-64 bg-cyber-green/20 blur-[100px]"></div>
                <div className="absolute top-1/2 -right-12 w-24 h-24 border-r-2 border-b-2 border-cyber-green/30 rounded-br-3xl"></div>
             </div>
           </div>
        </div>
      </section>

      {/* Footer / Contact */}
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
                  Jesteś nauczycielem, dyrektorem szkoły lub rodzicem? <br/>
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
                <a href="#" className="flex-1 h-14 border border-white/20 flex items-center justify-center rounded hover:bg-cyber-cyan hover:text-black hover:border-cyber-cyan transition-all group">
                  <Facebook size={24} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.instagram.com/_safe_labs/" className="flex-1 h-14 border border-white/20 flex items-center justify-center rounded hover:bg-cyber-pink hover:text-black hover:border-cyber-pink transition-all group">
                  <Instagram size={24} className="group-hover:scale-110 transition-transform" />
                </a>
                <a href="https://www.tiktok.com/@_safe_labs" className="flex-1 h-14 border border-white/20 flex items-center justify-center rounded hover:bg-white hover:text-black hover:border-white transition-all group font-bold">
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="2" className="w-6 h-6 group-hover:scale-110 transition-transform" stroke="currentColor">
                    <path d="M16.8217 5.1344C16.0886 4.29394 15.6479 3.19805 15.6479 2H14.7293M16.8217 5.1344C17.4898 5.90063 18.3944 6.45788 19.4245 6.67608C19.7446 6.74574 20.0786 6.78293 20.4266 6.78293V10.2191C18.645 10.2191 16.9932 9.64801 15.6477 8.68211V15.6707C15.6477 19.1627 12.8082 22 9.32386 22C7.50043 22 5.85334 21.2198 4.69806 19.98C3.64486 18.847 2.99994 17.3331 2.99994 15.6707C2.99994 12.2298 5.75592 9.42509 9.17073 9.35079M16.8217 5.1344C16.8039 5.12276 16.7861 5.11101 16.7684 5.09914M6.9855 17.3517C6.64217 16.8781 6.43802 16.2977 6.43802 15.6661C6.43802 14.0734 7.73249 12.7778 9.32394 12.7778C9.62087 12.7778 9.9085 12.8288 10.1776 12.9124V9.40192C9.89921 9.36473 9.61622 9.34149 9.32394 9.34149C9.27287 9.34149 8.86177 9.36884 8.81073 9.36884M14.7244 2H12.2097L12.2051 15.7775C12.1494 17.3192 10.8781 18.5591 9.32386 18.5591C8.35878 18.5591 7.50971 18.0808 6.98079 17.3564" strokeLinecap="round" strokeLinejoin="round"></path>
                  </svg>
                </a>
              </div>
            </div>
            
            {/* Right Column: New Form */}
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
    </div>
  );
};

export default App;
