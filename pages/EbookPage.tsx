import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Download, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import TerminalWindow from '../components/TerminalWindow';
import { supabase } from '../supabaseClient';
import ebookPdf from '../assets/SafeLabs_Ebook_Cyberbezpieczenstwo.pdf';

const LOCAL_STORAGE_KEY = 'safe_labs_ebook_download_count';
const EBOOK_SLUG = 'cyberbezpieczenstwo';

const formatCount = (value: number) => new Intl.NumberFormat('pl-PL').format(Math.max(0, value));

const EbookPage = () => {
  const [downloadCount, setDownloadCount] = useState<number>(0);
  const [countSource, setCountSource] = useState<'remote' | 'local'>('local');
  const [isLoadingCount, setIsLoadingCount] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [hasDownloaded, setHasDownloaded] = useState(false);

  useEffect(() => {
    const loadCount = async () => {
      const localCount = Number(localStorage.getItem(LOCAL_STORAGE_KEY) || '0');
      const safeLocalCount = Number.isFinite(localCount) && localCount > 0 ? localCount : 0;

      try {
        const { data, error } = await supabase
          .from('ebook_downloads')
          .select('download_count')
          .eq('slug', EBOOK_SLUG)
          .single();

        if (error) throw error;

        const remoteCount = Number(data?.download_count || 0);
        const safeRemoteCount = Number.isFinite(remoteCount) && remoteCount > 0 ? remoteCount : 0;
        const mergedCount = Math.max(safeRemoteCount, safeLocalCount);

        setDownloadCount(mergedCount);
        setCountSource('remote');
        localStorage.setItem(LOCAL_STORAGE_KEY, String(mergedCount));
      } catch {
        setDownloadCount(safeLocalCount);
        setCountSource('local');
      } finally {
        setIsLoadingCount(false);
      }
    };

    loadCount();
  }, []);

  const statCards = useMemo(
    () => [
      {
        label: 'WERSJA',
        value: '2026',
        icon: <BookOpen className="h-5 w-5 text-cyber-cyan" />,
      },
      {
        label: 'POBRAŃ',
        value: isLoadingCount ? '...' : formatCount(downloadCount),
        icon: <TrendingUp className="h-5 w-5 text-cyber-green" />,
      },
      {
        label: 'FORMAT',
        value: 'PDF',
        icon: <ShieldCheck className="h-5 w-5 text-cyber-pink" />,
      },
    ],
    [downloadCount, isLoadingCount]
  );

  const handleDownload = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isDownloading || hasDownloaded) {
      e.preventDefault();
      return;
    }
    setIsDownloading(true);
    setHasDownloaded(true);

    const nextCount = downloadCount + 1;
    setDownloadCount(nextCount);
    localStorage.setItem(LOCAL_STORAGE_KEY, String(nextCount));

    try {
      await supabase.from('ebook_downloads').upsert(
        {
          slug: EBOOK_SLUG,
          title: 'Safe Labs - Cyberbezpieczenstwo',
          download_count: nextCount,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'slug' }
      );
      setCountSource('remote');
    } catch {
      setCountSource('local');
    } finally {
      setTimeout(() => setIsDownloading(false), 500);
    }
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="container mx-auto px-4">
        <SectionHeader title="EBOOK_ACCESS" subtitle="Pobierz darmowy e-book Safe Labs" align="center" />

        <div className="max-w-5xl mx-auto grid lg:grid-cols-2 gap-10 items-stretch">
          <div className="bg-[#070707] border border-gray-800 rounded-xl p-8 relative overflow-hidden">
            <div className="absolute -top-16 -right-16 w-48 h-48 bg-cyber-cyan/10 blur-[90px] pointer-events-none"></div>
            <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-cyber-green/10 blur-[90px] pointer-events-none"></div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 border border-cyber-green/30 bg-cyber-green/10 text-cyber-green font-mono text-xs rounded">
                <span className="w-2 h-2 bg-cyber-green rounded-full animate-pulse"></span>
                STATUS: FILE_READY
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                <span className="text-cyber-cyan">CYBERBEZPIECZEŃSTWO</span>
                <br />
                praktyczny przewodnik
              </h2>

              <p className="text-gray-400 leading-relaxed">
                Konkretne zasady, scenariusze rozmów i checklisty bezpiecznych nawyków online.
                Materiał stworzony tak, aby można go od razu wdrożyć i zastosować w praktyce.
              </p>

              <div className="grid sm:grid-cols-3 gap-3">
                {statCards.map((card) => (
                  <div key={card.label} className="bg-black/60 border border-white/10 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-xs font-mono text-gray-500 tracking-wider">
                      {card.icon}
                      {card.label}
                    </div>
                    <div className="mt-3 text-xl font-bold text-white">{card.value}</div>
                  </div>
                ))}
              </div>

              <a
                href={ebookPdf}
                download="SafeLabs_Ebook_Cyberbezpieczenstwo.pdf"
                onClick={handleDownload}
                aria-disabled={hasDownloaded}
                className={`w-full inline-flex items-center justify-center gap-3 font-bold font-mono py-4 uppercase tracking-widest transition-all ${
                  hasDownloaded
                    ? 'bg-cyber-green/15 border border-cyber-green text-cyber-green cursor-not-allowed'
                    : 'bg-cyber-cyan/10 border border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black'
                }`}
              >
                {hasDownloaded ? (
                  <CheckCircle2 className="h-5 w-5" />
                ) : (
                  <Download className={`h-5 w-5 ${isDownloading ? 'animate-bounce' : ''}`} />
                )}
                {hasDownloaded ? 'POBRANO POMYSLNIE' : isDownloading ? 'POBIERANIE...' : 'POBIERZ E-BOOK'}
              </a>
            </div>
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TerminalWindow title="ebook_delivery_protocol.exe" variant="success" className="h-full min-h-[420px]">
              <div className="font-mono text-sm leading-relaxed space-y-3">
                <div className="text-gray-500 border-b border-gray-800 pb-2 mb-3">
                  Safe Labs Content Node v2.7
                </div>
                <div className="text-cyber-green">[✓] Pakiet edukacyjny gotowy do dystrybucji</div>
                <div className="text-cyber-cyan">[i] Format: PDF / jezyk: PL / dostep: darmowy</div>
                <div className="text-gray-300">[i] Co znajdziesz w srodku:</div>
                <ul className="pl-4 space-y-1 text-gray-400 list-disc list-inside">
                  <li>najczestsze zagrozenia i jak je wykrywac,</li>
                  <li>jak rozmawiac z dziecmi o prywatnosci i hejcie,</li>
                  <li>procedura reagowania na phishing i kradziez konta,</li>
                  <li>krotkie checklisty do wdrozenia od razu.</li>
                </ul>
                <div className="pt-3 border-t border-gray-800 text-cyber-green">
                  {isLoadingCount ? '[...] synchronizacja licznika pobran' : `[✓] pobrania: ${formatCount(downloadCount)}`}
                </div>
                <div className="text-gray-500 animate-pulse">_Waiting for user action...</div>
              </div>
            </TerminalWindow>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default EbookPage;
