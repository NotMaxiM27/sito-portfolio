import '../../styles/crt.css';

export default function CrtOverlay() {
  return (
    // z-50 lo tiene sopra tutto. pointer-events-none è CRUCIALE!
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      
      {/* 1. Sfondo con Scanline e Sfarfallio (Flicker) */}
      <div className="crt-scanlines absolute inset-0 opacity-40 mix-blend-overlay"></div>
      
      {/* 2. Vignettatura (Bordi scuri tipici dei vecchi schermi) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]"></div>
      
      {/* 3. Aberrazione Cromatica finta sul vetro (opzionale) */}
      <div className="crt-rgb-split absolute inset-0 opacity-20 mix-blend-screen"></div>

    </div>
  );
}