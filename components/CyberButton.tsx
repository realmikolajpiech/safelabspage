import React from 'react';
import { ChevronRight } from 'lucide-react';

interface CyberButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  className?: string;
  href?: string;
}

const CyberButton: React.FC<CyberButtonProps> = ({ children, onClick, variant = 'primary', className = '', href }) => {
  const baseStyles = "relative px-6 py-3 font-mono font-bold uppercase tracking-widest transition-all duration-300 group overflow-hidden border-2";
  
  const variants = {
    primary: "border-cyber-green text-cyber-green hover:bg-cyber-green hover:text-cyber-black drop-shadow-[0_0_8px_rgba(0,255,65,0.25)] hover:drop-shadow-[0_0_30px_rgba(0,255,65,0.6)]",
    secondary: "border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-cyber-black drop-shadow-[0_0_8px_rgba(0,243,255,0.25)] hover:drop-shadow-[0_0_30px_rgba(0,243,255,0.6)]",
    danger: "border-cyber-red text-cyber-red hover:bg-cyber-red hover:text-cyber-black drop-shadow-[0_0_8px_rgba(255,42,42,0.25)] hover:drop-shadow-[0_0_30px_rgba(255,42,42,0.6)]"
  };

  const content = (
    <>
      <span className="relative z-10 flex items-center gap-2">
        {children}
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </span>
       {/* Neon overlay on hover (subtle, color-matched) */}
       <div className="absolute top-0 left-0 w-full h-full opacity-0 group-hover:opacity-20 skew-x-6 transition-opacity duration-150 pointer-events-none"
         style={{background: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.04) 40%, rgba(255,255,255,0.02) 100%)'}}></div>
    </>
  );

  if (href) {
    return (
      <a href={href} onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className} inline-block`}>
        {content}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={`${baseStyles} ${variants[variant]} ${className}`}>
      {content}
    </button>
  );
};

export default CyberButton;