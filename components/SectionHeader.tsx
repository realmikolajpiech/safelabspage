import React from 'react';
import { Terminal } from 'lucide-react';

interface SectionHeaderProps {
  title: string;
  subtitle: string;
  align?: 'left' | 'center';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle, align = 'left' }) => {
  return (
    <div className={`mb-12 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      <div className={`flex items-center gap-2 mb-2 text-cyber-cyan font-mono text-sm tracking-wider ${align === 'center' ? 'justify-center' : ''}`}>
        <Terminal className="w-4 h-4" />
        <span>EXECUTING_PROTOCOL: {title}</span>
      </div>
      <h2 className="text-4xl md:text-5xl font-bold font-sans text-white uppercase relative inline-block">
        {subtitle}
        <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-cyber-green via-cyber-cyan to-transparent"></span>
      </h2>
    </div>
  );
};

export default SectionHeader;