import React, { useState } from 'react';
import { Shield, Globe, Terminal, CheckCircle, Send, Loader2 } from 'lucide-react';
import { supabase } from '../supabaseClient';
import ValidationError from './ValidationError';

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
      <div className="bg-[#050505] border border-gray-800 rounded-lg overflow-hidden max-w-2xl w-full mx-auto relative group" id="contact-form">
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
                    setFormData({ ...formData, schoolName: e.target.value });
                    if (validationErrors.schoolName) {
                      setValidationErrors({ ...validationErrors, schoolName: undefined });
                    }
                  }}
                  className={`w-full bg-black/50 border text-white font-mono pl-8 pr-4 py-3 focus:outline-none transition-all placeholder-gray-700 ${validationErrors.schoolName ? 'border-cyber-red focus:border-cyber-red focus:ring-1 focus:ring-cyber-red' : 'border-gray-700 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan'
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
                    setFormData({ ...formData, email: e.target.value });
                    if (validationErrors.email) {
                      setValidationErrors({ ...validationErrors, email: undefined });
                    }
                  }}
                  className={`w-full bg-black/50 border text-white font-mono pl-8 pr-4 py-3 focus:outline-none transition-all placeholder-gray-700 ${validationErrors.email ? 'border-cyber-red focus:border-cyber-red focus:ring-1 focus:ring-cyber-red' : 'border-gray-700 focus:border-cyber-cyan focus:ring-1 focus:ring-cyber-cyan'
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
                  onChange={e => setFormData({ ...formData, additionalInfo: e.target.value })}
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

export default ContactTerminal;
