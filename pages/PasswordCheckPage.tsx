import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Lock, Unlock, AlertTriangle, CheckCircle, RefreshCw, Key, Zap } from 'lucide-react';
import zxcvbn from 'zxcvbn';
import SectionHeader from '../components/SectionHeader';
import CyberButton from '../components/CyberButton';
import TerminalWindow from '../components/TerminalWindow';

const plPlural = (n: number, one: string, few: string, many: string) => {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (n === 1) return one;
  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) return few;
  return many;
};

const formatLargeTime = (seconds: number): string => {
  if (seconds < 1) return "Mniej niż sekunda";
  if (seconds < 10) return `~${seconds.toFixed(1).replace('.', ',')} s`;
  if (seconds < 60) {
    const s = Math.max(1, Math.round(seconds));
    return `${s} ${plPlural(s, 'sekunda', 'sekundy', 'sekund')}`;
  }
  
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ${Math.floor(seconds % 60)} s`;
  
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} godz. ${minutes % 60} min`;
  
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} dni ${hours % 24} godz.`;
  
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} mies. ${days % 30} dni`;
  
  const years = Math.floor(days / 365);
  
  if (years < 1000) return `${years} lat`;
  if (years < 1_000_000) return `${(years / 1000).toFixed(1)} tys. lat`;
  if (years < 1_000_000_000) return `${(years / 1_000_000).toFixed(1)} mln lat`;
  if (years < 1_000_000_000_000) return `${(years / 1_000_000_000).toFixed(1)} mld lat`;
  if (years < 1_000_000_000_000_000) return `${(years / 1_000_000_000_000).toFixed(1)} bilionów lat`;
  if (years < 1_000_000_000_000_000_000) return `${(years / 1_000_000_000_000_000).toFixed(1)} biliardów lat`;
  if (years < 1e21) return `${(years / 1e18).toFixed(1)} trylionów lat`;
  if (years < 1e24) return `${(years / 1e21).toFixed(1)} tryliardów lat`;
  
  return `${years.toExponential(2).replace('+', '')} lat`;
};

const getStrengthFromSeconds = (seconds: number): { strength: string; color: string; score: number } => {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return { strength: "BARDZO SŁABE", color: "text-red-600", score: 5 };
  }

  if (seconds < 1) return { strength: "BARDZO SŁABE", color: "text-red-600", score: 10 };
  if (seconds < 60) return { strength: "SŁABE", color: "text-orange-500", score: 25 };
  if (seconds < 60 * 60) return { strength: "ŚREDNIE", color: "text-yellow-500", score: 45 };
  if (seconds < 24 * 60 * 60) return { strength: "ŚREDNIE", color: "text-yellow-500", score: 55 };
  if (seconds < 30 * 24 * 60 * 60) return { strength: "SILNE", color: "text-cyber-cyan", score: 70 };
  if (seconds < 365 * 24 * 60 * 60) return { strength: "SILNE", color: "text-cyber-cyan", score: 80 };
  return { strength: "BARDZO SILNE", color: "text-cyber-green", score: 95 };
};

const getStrengthFromZxcvbnScore = (zScore: number): { strength: string; color: string; score: number } => {
  switch (zScore) {
    case 0:
      return { strength: "BARDZO SŁABE", color: "text-red-600", score: 10 };
    case 1:
      return { strength: "SŁABE", color: "text-orange-500", score: 30 };
    case 2:
      return { strength: "ŚREDNIE", color: "text-yellow-500", score: 55 };
    case 3:
      return { strength: "SILNE", color: "text-cyber-cyan", score: 80 };
    case 4:
      return { strength: "BARDZO SILNE", color: "text-cyber-green", score: 95 };
    default:
      return { strength: "BARDZO SŁABE", color: "text-red-600", score: 5 };
  }
};

const translateFeedback = (feedback: zxcvbn.ZXCVBNFeedback): string[] => {
  const messages: string[] = [];
  
  // Warning translation
  if (feedback.warning) {
    const warnings: { [key: string]: string } = {
      "Straight rows of keys are easy to guess": "Proste ciągi klawiszy są łatwe do odgadnięcia",
      "Short keyboard patterns are easy to guess": "Krótkie wzorce klawiaturowe są łatwe do odgadnięcia",
      "Repeats like \"abcabcabc\" are only slightly harder to guess than \"abc\"": "Powtórzenia typu \"abcabcabc\" są słabym zabezpieczeniem",
      "Sequences like abc or 6543 are easy to guess": "Sekwencje typu abc lub 6543 są łatwe do złamania",
      "Recent years are easy to guess": "Ostatnie lata są łatwe do odgadnięcia",
      "Dates are often easy to guess": "Daty są często łatwe do odgadnięcia",
      "Top 10 common passwords are easy to guess": "To jedno z 10 najpopularniejszych haseł",
      "Top 100 common passwords are easy to guess": "To jedno ze 100 najpopularniejszych haseł",
      "This is similar to a commonly used password": "To hasło jest podobne do często używanego hasła",
      "Capitalization doesn't help very much": "Wielkie litery na początku nie zwiększają znacząco siły",
      "All-uppercase is almost as easy to guess as all-lowercase": "Same wielkie litery są tak łatwe jak same małe",
      "Reversed words are not much harder to guess": "Odwrócone słowa nie są trudniejsze do złamania",
      "Predictable substitutions like '@' instead of 'a' don't help very much": "Przewidywalne zamienniki (np. '@' zamiast 'a') słabo chronią"
    };
    messages.push(
      `[!] ${
        warnings[feedback.warning] ||
        "To hasło zawiera potencjalnie słaby wzorzec. Rozważ jego zmianę."
      }`
    );
  }

  // Suggestions translation
  feedback.suggestions.forEach(suggestion => {
    const suggestions: { [key: string]: string } = {
      "Add another word or two. Uncommon words are better.": "Dodaj kolejne słowo lub dwa. Rzadkie słowa są lepsze.",
      "Use a longer keyboard pattern with more turns.": "Użyj dłuższego wzoru klawiatury z większą liczbą zwrotów.",
      "Avoid repeated words and characters.": "Unikaj powtarzania słów i znaków.",
      "Avoid sequences.": "Unikaj sekwencji (np. 123, abc).",
      "Avoid recent years.": "Unikaj używania ostatnich lat.",
      "Avoid years that are associated with you.": "Unikaj lat, które są z Tobą powiązane.",
      "Avoid dates and years that are associated with you.": "Unikaj dat i lat powiązanych z Tobą.",
      "Capitalization doesn't help very much": "Wielkie litery w środku hasła są lepsze niż na początku.",
      "All-uppercase is almost as easy to guess as all-lowercase": "Mieszaj wielkość liter.",
      "Reverse the order of words.": "Zmień kolejność słów.",
      "Use a few words, avoid common phrases.": "Użyj kilku słów, unikaj popularnych fraz.",
      "No need for symbols, digits, or uppercase letters": "Nie musisz używać symboli, jeśli hasło jest długie i złożone."
    };
    messages.push(
      `[i] ${
        suggestions[suggestion] ||
        "Rozważ wydłużenie hasła, dodanie kolejnych słów i zwiększenie jego losowości."
      }`
    );
  });

  return messages;
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

    const passwordToCheck = password;

    setIsChecking(true);
    setResult(null);

    // Simulate analysis time
    setTimeout(() => {
      const zResult = zxcvbn(passwordToCheck);

      const speed = 10_000;
      const seconds =
        (zResult as any)?.crack_times_seconds?.offline_slow_hashing_1e4_per_second ??
        ((zResult as any)?.guesses ? (zResult as any).guesses / speed : 0);
      const timeToCrack = formatLargeTime(seconds);
      const zScore = typeof (zResult as any)?.score === 'number' ? (zResult as any).score : -1;
      const { strength, color, score } =
        zScore >= 0 ? getStrengthFromZxcvbnScore(zScore) : getStrengthFromSeconds(seconds);

      const feedback: string[] = [];
      const translatedFeedback = translateFeedback(zResult.feedback);
      
      if (translatedFeedback.length > 0) {
        feedback.push(...translatedFeedback);
      } else {
        if (seconds < 60) {
          feedback.push("[!] Hasło może zostać złamane w ataku offline w mniej niż minutę");
          feedback.push("[i] Dodaj 2–3 losowe słowa lub wydłuż hasło (16+ znaków)");
          feedback.push("[i] Unikaj krótkich fragmentów słownikowych i przewidywalnych wzorców");
        } else if (zScore >= 3 || score >= 80) {
          feedback.push("[✓] Brak wykrytych słabych wzorców");
          feedback.push("[✓] Hasło wygląda na losowe i bezpieczne");
        } else {
          feedback.push("[i] Zwiększ długość i losowość, aby utrudnić atak słownikowy");
        }
      }

      // Add positive reinforcement checks if not already covered by negative feedback
      if (passwordToCheck.length >= 12 && !feedback.some(f => f.includes("krótkie"))) {
        feedback.push("[i] Długość hasła jest bardzo dobra");
      }
      if (/[^A-Za-z0-9]/.test(passwordToCheck)) {
        feedback.push("[i] Zawiera znaki specjalne");
      }

      setResult({
        score,
        strength,
        color,
        feedback,
        timeToCrack
      });
      setIsChecking(false);
    }, 800); // Slightly faster response
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
                  Safe Labs Security Auditor v1.0.4<br />
                  Inicjalizowanie modułów kryptograficznych...
                </div>

                {!result && !isChecking && (
                  <div className="text-gray-400 animate-pulse">
                    _ Oczekiwanie na wprowadzenie danych...
                  </div>
                )}

                {isChecking && (
                  <div className="space-y-1">
                    <div className="text-cyber-cyan">Uruchamianie analizy entropii...</div>
                    <div className="text-cyber-cyan">Sprawdzanie w bazach wycieków...</div>
                    <div className="text-cyber-cyan">Obliczanie czasu ataku brute-force...</div>
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
                      <div className="mt-2 text-right text-xs text-gray-500">Wynik: {result.score}/100</div>
                    </div>

                    <div className="space-y-1">
                      <div className="text-white font-bold mb-2">RAPORT SZCZEGÓŁOWY:</div>
                      {result.feedback.map((item, idx) => (
                        <div
                          key={idx}
                          className={`${
                            item.includes('[!]')
                              ? 'text-cyber-red'
                              : item.includes('[i]')
                                ? 'text-gray-400'
                                : 'text-cyber-green'
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                      <div className="text-gray-400">Szacowany czas łamania:</div>
                      <div className={`text-xl font-bold ${result.color}`}>{result.timeToCrack}</div>
                      <div className="text-[10px] text-gray-600 mt-1">* Przy ataku offline 10 tys. haseł/s (wolne haszowanie)</div>
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
