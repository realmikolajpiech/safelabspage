import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, WifiOff, ArrowLeft } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import CyberButton from '../components/CyberButton';
import TerminalWindow from '../components/TerminalWindow';

const NotFoundPage = () => {
  const navigate = useNavigate();
  const [count, setCount] = useState(0);

  // Simulate a countdown or some activity
  useEffect(() => {
    const interval = setInterval(() => {
      setCount(c => (c + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pt-32 pb-20 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      {/* Glitch Effect Background Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyber-red/10 blur-[100px] animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-cyber-cyan/10 blur-[100px] animate-pulse delay-700"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="mb-8 relative inline-block">
             <h1 className="text-[120px] md:text-[180px] font-bold font-mono leading-none text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-800 select-none opacity-20 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 blur-sm">
              404
            </h1>
            <SectionHeader 
              title="SYSTEM_ERROR" 
              subtitle="CRITICAL FAILURE: PAGE NOT FOUND" 
              align="center" 
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center mt-12 text-left">
            <div className="space-y-6">
              <div className="border-l-2 border-cyber-red pl-6 space-y-4">
                <h2 className="text-3xl md:text-4xl font-bold text-white font-sans flex items-center gap-3">
                  <AlertTriangle className="text-cyber-red w-8 h-8 animate-pulse" />
                  CONNECTION LOST
                </h2>
                <p className="text-gray-400 font-mono text-lg leading-relaxed">
                  Wygląda na to, że zbłądziłeś w sieci. Zasób, którego szukasz, został przeniesiony, usunięty lub nigdy nie istniał.
                </p>
                <div className="flex items-center gap-2 text-cyber-red font-mono text-sm bg-cyber-red/10 p-2 rounded w-fit">
                  <WifiOff className="w-4 h-4" />
                  <span>SIGNAL_STRENGTH: 0%</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <CyberButton 
                  onClick={() => navigate('/')} 
                  variant="primary"
                  className="w-full sm:w-auto justify-center"
                >
                  <Home className="w-4 h-4 mr-2" />
                  POWRÓT DO BAZY
                </CyberButton>
                <CyberButton 
                  onClick={() => navigate(-1)} 
                  variant="secondary"
                  className="w-full sm:w-auto justify-center"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  COFNIJ OPERACJĘ
                </CyberButton>
              </div>
            </div>

            <div className="relative">
              <TerminalWindow title="trace_route.exe" variant="danger" className="h-full min-h-[300px]">
                <div className="font-mono text-sm space-y-2">
                  <div className="text-gray-500 border-b border-gray-800 pb-2 mb-4">
                    Diagnostics Tool v2.4.1<br/>
                    Target: UNKNOWN_SECTOR
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex gap-2">
                      <span className="text-cyber-red">root@safelabs:~$</span>
                      <span className="text-white">ping target_url</span>
                    </div>
                    <div className="text-gray-400">Pinging target...</div>
                    <div className="text-cyber-red">Request timed out.</div>
                    <div className="text-cyber-red">Request timed out.</div>
                    <div className="text-cyber-red">Request timed out.</div>
                    <div className="text-cyber-red">[!] DESTINATION HOST UNREACHABLE</div>
                  </div>

                  <div className="py-4 border-t border-dashed border-gray-800 mt-4 space-y-1">
                    <div className="flex justify-between text-gray-500">
                      <span>Packet Loss:</span>
                      <span className="text-cyber-red">100%</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Latency:</span>
                      <span className="text-cyber-red">∞ ms</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Jitter:</span>
                      <span className="text-cyber-red">CRITICAL</span>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="text-gray-400 mb-1">Attempting recovery...</div>
                    <div className="w-full bg-gray-800 h-2 rounded overflow-hidden">
                      <div 
                        className="h-full bg-cyber-red transition-all duration-100 ease-linear" 
                        style={{ width: `${count}%` }}
                      ></div>
                    </div>
                    <div className="text-right text-xs text-cyber-red mt-1">FAILED</div>
                  </div>
                  
                  <div className="text-cyber-red animate-pulse mt-4">
                    _ System halted.
                  </div>
                </div>
              </TerminalWindow>
              
              {/* Decorative glitch elements behind terminal */}
              <div className="absolute -z-10 top-10 -right-4 w-full h-full border border-cyber-red/20 rounded-lg transform rotate-3"></div>
              <div className="absolute -z-10 -bottom-4 -left-4 w-full h-full border border-cyber-red/20 rounded-lg transform -rotate-2"></div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
