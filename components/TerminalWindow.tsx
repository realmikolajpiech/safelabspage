import React from 'react';

interface TerminalWindowProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'danger' | 'success';
}

const TerminalWindow: React.FC<TerminalWindowProps> = ({ 
  title = "bash", 
  children, 
  className = "",
  variant = 'default'
}) => {
  const borderColor = variant === 'danger' ? 'border-cyber-red/30' : variant === 'success' ? 'border-cyber-green/30' : 'border-gray-700';
  const headerBg = variant === 'danger' ? 'bg-cyber-red/10' : variant === 'success' ? 'bg-cyber-green/10' : 'bg-[#1a1f1d]';

  return (
    <div className={`bg-[#0d1210]/90 backdrop-blur-sm border ${borderColor} rounded-lg overflow-hidden shadow-2xl font-mono text-sm group ${className}`}>
      {/* Terminal Header */}
      <div className={`${headerBg} px-4 py-2 flex items-center justify-between border-b ${borderColor}`}>
        <div className="flex items-center gap-2">
           <div className="flex gap-1.5">
             <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
             <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
             <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
           </div>
           <div className="ml-4 text-gray-500 text-xs opacity-70 flex items-center gap-2">
             <span className="w-2 h-2 bg-current rounded-full animate-pulse"></span>
             {title}
           </div>
        </div>
      </div>
      
      {/* Terminal Body */}
      <div className="p-6 text-gray-300 relative">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03] bg-[linear-gradient(0deg,transparent_24%,#ffffff_25%,#ffffff_26%,transparent_27%,transparent_74%,#ffffff_75%,#ffffff_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,#ffffff_25%,#ffffff_26%,transparent_27%,transparent_74%,#ffffff_75%,#ffffff_76%,transparent_77%,transparent)] bg-[length:30px_30px]"></div>
        {children}
      </div>
    </div>
  );
};

export default TerminalWindow;