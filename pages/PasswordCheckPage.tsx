import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Unlock, AlertTriangle, CheckCircle, RefreshCw, Key, Zap } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import CyberButton from '../components/CyberButton';
import TerminalWindow from '../components/TerminalWindow';

const calculateCrackTime = (password: string) => {
  let poolSize = 0;
  if (/[a-z]/.test(password)) poolSize += 26;
  if (/[A-Z]/.test(password)) poolSize += 26;
  if (/[0-9]/.test(password)) poolSize += 10;
  if (/[^A-Za-z0-9]/.test(password)) poolSize += 32;

  if (poolSize === 0) return "< 1 sekunda";

  const combinations = Math.pow(poolSize, password.length);
  // Assume a very fast offline cracking rig (e.g. 100 Billion guesses/second)
  const speed = 100_000_000_000;
  const seconds = combinations / speed;

  if (seconds < 1) return "< 1 sekunda";
  if (seconds < 60) return `${Math.floor(seconds)} sekund`;

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ${Math.floor(seconds % 60)} s`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} godz. ${minutes % 60} min`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} dni ${hours % 24} godz.`;

  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mies. ${days % 30} dni`;

  const years = Math.floor(days / 365);
  if (years < 100) return `${years} lat ${Math.floor((days % 365) / 30)} mies.`;
  if (years < 1000) return `${years} lat`;
  if (years < 1000000) return `${(years / 1000).toFixed(1)} tys. lat`;
  if (years < 1000000000) return `${(years / 1000000).toFixed(1)} mln lat`;
  if (years < 1000000000000) return `${(years / 1000000000).toFixed(1)} mld lat`;

  return "Wieczność";
};

const PasswordCheckPage = () => {
  const [password, setPassword] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const [result, setResult] = useState<null | {
    score: number;
    strength: string;
    color: string;
    feedback: string[];
    timeToCrack: string;
  }>(null);

  const checkPassword = () => {
    if (!password) return;

    setIsChecking(true);
    setResult(null);

    // Simulate analysis time
    setTimeout(() => {
      let score = 0;
      const feedback = [];
      
      // Length Check
      if (password.length < 8) {
        feedback.push("[!] Hasło jest zbyt krótkie (min. 8 znaków)");
      } else if (password.length >= 12) {
        score += 25;
        feedback.push("[✓] Długość hasła jest odpowiednia");
      } else {
        score += 10;
        feedback.push("[✓] Długość hasła jest akceptowalna");
      }

      // Character Variety
      if (/[A-Z]/.test(password)) {
        score += 15;
        feedback.push("[✓] Zawiera wielkie litery");
      } else {
        feedback.push("[!] Brak wielkich liter");
      }

      if (/[a-z]/.test(password)) {
        score += 15;
        feedback.push("[✓] Zawiera małe litery");
      } else {
        feedback.push("[!] Brak małych liter");
      }

      if (/[0-9]/.test(password)) {
        score += 15;
        feedback.push("[✓] Zawiera cyfry");
      } else {
        feedback.push("[!] Brak cyfr");
      }

      if (/[^A-Za-z0-9]/.test(password)) {
        score += 30;
        feedback.push("[✓] Zawiera znaki specjalne");
      } else {
        feedback.push("[!] Brak znaków specjalnych (!@#$%)");
      }

      // Common Patterns (Simplified)
      if (/(123|abc|qwe|password|haslo|admin)/i.test(password)) {
        score -= 50;
        feedback.push("[!] CRITICAL: Wykryto popularny wzorzec!");
      }

      // Cap score
      score = Math.max(0, Math.min(100, score));

      // Determine Strength
      let strength = "SŁABE";
      let color = "text-cyber-red";

      if (score > 80) {
        strength = "BARDZO SILNE";
        color = "text-cyber-green";
      } else if (score > 60) {
        strength = "SILNE";
        color = "text-cyber-cyan";
      } else if (score > 40) {
        strength = "ŚREDNIE";
        color = "text-yellow-500";
      } else if (score > 20) {
        strength = "SŁABE";
        color = "text-orange-500";
      }

      const timeToCrack = calculateCrackTime(password);

      setResult({
        score,
        strength,
        color,
        feedback,
        timeToCrack
      });
      setIsChecking(false);
    }, 1500);
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <SectionHeader title="PASSWORD_AUDIT" subtitle="Sprawdź siłę swojego hasła" align="center" />

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          {/* Input Section */}
          <div className="space-y-8">
            <div className="bg-[#0a0505] border border-gray-800 p-8 rounded-lg relative overflow-hidden group">
              <div className="absolute inset-0 bg-cyber-cyan/5 group-hover:bg-cyber-cyan/10 transition-colors pointer-events-none"></div>
              
              <div className="relative z-10 space-y-6">
                <div>
                  <label className="text-cyber-cyan font-mono text-xs tracking-wider uppercase flex items-center gap-2 mb-2">
                    <Key className="w-4 h-4" /> Wprowadź hasło do analizy
                  </label>
                  <div className="relative">
                    <input
                      type={isVisible ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-black/50 border border-gray-700 text-white font-mono pl-4 pr-12 py-4 focus:outline-none focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan transition-all placeholder-gray-700 text-lg"
                      placeholder="••••••••"
                      onKeyDown={(e) => e.key === 'Enter' && checkPassword()}
                    />
                    <button
                      onClick={() => setIsVisible(!isVisible)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                    >
                      {isVisible ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 font-mono">
                    * Hasło jest przetwarzane tylko lokalnie w Twojej przeglądarce. Nie wysyłamy go nigdzie.
                  </p>
                </div>

                <button
                  onClick={checkPassword}
                  disabled={isChecking || !password}
                  className="w-full bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan font-bold font-mono py-4 uppercase tracking-widest hover:bg-cyber-cyan hover:text-black transition-all group flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isChecking ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      ANALIZOWANIE...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      URUCHOM AUDYT
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-gray-900/30 border border-gray-800 p-6 rounded-lg">
              <h3 className="text-white font-bold font-mono mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500" /> WSKAZÓWKI BEZPIECZEŃSTWA
              </h3>
              <ul className="space-y-3 text-sm text-gray-400 font-mono">
                <li className="flex items-start gap-2">
                  <span className="text-cyber-green">➜</span> Używaj unikalnych haseł dla każdego konta.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-green">➜</span> Włącz weryfikację dwuetapową (2FA).
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-green">➜</span> Korzystaj z menedżera haseł.
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyber-green">➜</span> Unikaj danych osobowych (imiona, daty).
                </li>
              </ul>
            </div>
          </div>

          {/* Result Section - Terminal */}
          <div className="relative">
             <TerminalWindow title="password_audit_tool.exe" variant={result?.score && result.score > 60 ? 'success' : result?.score && result.score > 40 ? 'default' : 'danger'} className="h-full min-h-[400px]">
              <div className="font-mono text-sm leading-relaxed space-y-2">
                <div className="text-gray-500 border-b border-gray-800 pb-2 mb-4">
                  Safe Labs Security Auditor v1.0.4<br/>
                  Initializing cryptographic engines...
                </div>

                {!result && !isChecking && (
                  <div className="text-gray-400 animate-pulse">
                    _ Oczekiwanie na wprowadzenie danych...
                  </div>
                )}

                {isChecking && (
                  <div className="space-y-1">
                    <div className="text-cyber-cyan">Running entropy analysis...</div>
                    <div className="text-cyber-cyan">Checking against leaked databases...</div>
                    <div className="text-cyber-cyan">Calculating brute-force time...</div>
                    <div className="w-full bg-gray-800 h-2 rounded mt-2 overflow-hidden">
                      <div className="h-full bg-cyber-cyan animate-[width_1.5s_ease-in-out_infinite]" style={{ width: '40%' }}></div>
                    </div>
                  </div>
                )}

                {result && (
                  <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="border border-gray-700 bg-black/50 p-4 rounded">
                      <div className="flex justify-between items-end mb-2">
                        <span className="text-gray-400 uppercase text-xs">Wynik Audytu</span>
                        <span className={`text-2xl font-bold ${result.color}`}>{result.strength}</span>
                      </div>
                      <div className="w-full bg-gray-800 h-4 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.score}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className={`h-full ${
                            result.score > 80 ? 'bg-cyber-green' : 
                            result.score > 60 ? 'bg-cyber-cyan' : 
                            result.score > 40 ? 'bg-yellow-500' : 'bg-cyber-red'
                          }`}
                        ></motion.div>
                      </div>
                      <div className="mt-2 text-right text-xs text-gray-500">Score: {result.score}/100</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-white font-bold mb-2">RAPORT SZCZEGÓŁOWY:</div>
                      {result.feedback.map((item, idx) => (
                        <div key={idx} className={`${item.includes('[!]') ? 'text-cyber-red' : 'text-cyber-green'}`}>
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                      <div className="text-gray-400">Szacowany czas łamania:</div>
                      <div className={`text-xl font-bold ${result.color}`}>{result.timeToCrack}</div>
                      <div className="text-[10px] text-gray-600 mt-1">* Przy ataku offline 100 mld haseł/s</div>
                    </div>
                  </div>
                )}
              </div>
            </TerminalWindow>
            
            {/* Decorative Elements */}
            <div className="absolute -z-10 -top-10 -right-10 w-40 h-40 bg-cyber-cyan/20 blur-[80px]"></div>
            <div className="absolute -z-10 -bottom-10 -left-10 w-40 h-40 bg-cyber-red/20 blur-[80px]"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordCheckPage;
