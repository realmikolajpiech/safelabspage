import React from 'react';

// Custom Blue Shield Logo - Replaced with PNG asset
export const SafeLabsLogo = ({ className = "h-10", glow = false }: { className?: string, glow?: boolean }) => {
  const logoUrl = new URL('../assets/logo.png', import.meta.url).href;
  return (
    <img
      src={logoUrl}
      alt="Safe Labs"
      className={`${className} object-contain ${glow ? 'drop-shadow-[0_0_20px_rgba(0,243,255,0.6)]' : ''}`}
    />
  );
};

export const ZstibLogo = ({ className = "h-10" }: { className?: string }) => {
  const logoUrl = new URL('../assets/zstib.svg', import.meta.url).href;
  return (
    <img
      src={logoUrl}
      alt="ZSTiB Brzesko"
      className={`${className} object-contain`}
    />
  );
};

export const MokLogo = ({ className = "h-10" }: { className?: string }) => {
  const logoUrl = new URL('../assets/mok-logo.png', import.meta.url).href;
  return (
    <img
      src={logoUrl}
      alt="MOK"
      className={`${className} object-contain`}
    />
  );
};

export const BibliotekaLogo = ({ className = "h-10" }: { className?: string }) => {
  const logoUrl = new URL('../assets/biblioteka.png', import.meta.url).href;
  return (
    <img
      src={logoUrl}
      alt="Biblioteka Brzesko"
      className={`${className} object-contain`}
    />
  );
};