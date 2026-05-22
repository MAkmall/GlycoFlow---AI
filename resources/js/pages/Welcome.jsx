import React, { useEffect, useState } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Welcome() {
  const [isFading, setIsFading] = useState(false);
  const [bootText, setBootText] = useState('');
  const [progress, setProgress] = useState(0);

  const sequence = [
    "[SYS] Medical Scanning Interface Active...",
    "[*] Connecting to SatuSehat Database... OK",
    "[*] Calibrating biosensors & EKG... OK",
    "[*] Analyzing patient blood glucose matrix...",
    "[!] Vitals Stable. Metabolic Core Online.",
    "READY TO DIAGNOSE."
  ];

  useEffect(() => {
    let currentLine = 0;
    const interval = setInterval(() => {
      setBootText(prev => prev + sequence[currentLine] + '\n');
      currentLine++;
      if (currentLine >= sequence.length) clearInterval(interval);
    }, 450);

    const progressInterval = setInterval(() => {
      setProgress(p => {
        const next = p + Math.floor(Math.random() * 12) + 4;
        return next > 100 ? 100 : next;
      });
    }, 200);

    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 3500);
    
    const redirectTimer = setTimeout(() => {
      router.visit('/dashboard');
    }, 4300);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(redirectTimer);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-white flex flex-col items-center justify-center relative overflow-hidden transition-all duration-[1000ms] ease-out ${isFading ? 'opacity-0 scale-110 blur-xl' : 'opacity-100 scale-100 blur-0'}`}>
      <Head title="Clinical Boot - Nuvica Health" />
      
      {/* Latar Belakang Biru Bersih (Klinis Light) */}
      <div className="absolute inset-0 bg-medical-aurora-light opacity-80 z-0"></div>
      <div className="absolute inset-0 hex-grid-light opacity-20 z-0 mix-blend-multiply"></div>
      
      {/* Partikel Simulasi Sel Darah Merah & Putih */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
         <div className="particle w-5 h-5 bg-rose-400/40 rounded-full blur-[1px] absolute top-[20%] left-[15%] animate-[float_8s_infinite]"></div>
         <div className="particle w-8 h-8 bg-blue-500/30 rounded-full blur-[2px] absolute top-[60%] left-[80%] animate-[float_12s_infinite_reverse]"></div>
         <div className="particle w-3 h-3 bg-slate-400/20 rounded-full blur-[1px] absolute top-[80%] left-[30%] animate-[float_10s_infinite]"></div>
         <div className="particle w-12 h-12 bg-emerald-400/20 rounded-full blur-[3px] absolute top-[30%] left-[70%] animate-[float_15s_infinite]"></div>
      </div>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/60 rounded-full blur-[100px] z-0 pointer-events-none animate-pulse-slow"></div>

      <div className="relative z-10 flex flex-col items-center w-full max-w-xl px-6">
        
        {/* Scanner Radar Jantung / EKG (Tema Light) */}
        <div className="relative w-44 h-44 mb-10 flex items-center justify-center">
          <div className="absolute w-full h-full rounded-full border-[1.5px] border-blue-200 animate-[spin_6s_linear_infinite]">
             <div className="absolute top-0 left-1/2 w-4 h-4 bg-emerald-400 rounded-full blur-[2px] shadow-[0_0_15px_#34d399]"></div>
          </div>
          <div className="absolute w-32 h-32 rounded-full border-y-[3px] border-dashed border-blue-300 animate-[spin_8s_linear_infinite_reverse]"></div>
          
          <div className="relative w-20 h-20 bg-white/80 rounded-full flex items-center justify-center backdrop-blur-xl border border-blue-100 shadow-[0_10px_30px_rgba(30,58,138,0.15)]">
            <svg className="absolute w-10 h-10 text-rose-500/20 animate-ping" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg className="w-10 h-10 text-rose-500 drop-shadow-[0_4px_8px_rgba(244,63,94,0.3)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg className="absolute w-12 h-12 text-blue-900 drop-shadow-[0_2px_4px_rgba(30,58,138,0.2)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12h4l3-8 4 16 3-8h4" />
            </svg>
          </div>
        </div>
        
        <h1 className="text-5xl md:text-6xl font-black text-blue-950 custom-font tracking-tight mb-2 text-center drop-shadow-sm">
          QUICK SMART <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">MEDIC</span>
        </h1>
        
        <div className="flex items-center gap-3 mb-16 px-6 py-2 rounded-full bg-white/60 border border-blue-100 backdrop-blur-md shadow-sm">
          <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
          <p className="text-blue-900 font-bold text-[10px] md:text-xs tracking-[0.2em] uppercase">
            World-class Healthcare AI
          </p>
        </div>
        
        <div className="w-full relative px-4">
          <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-2.5 uppercase tracking-[0.1em]">
            <span className="flex items-center gap-2">
              <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse"></span>
              Scanning Bio-Markers
            </span>
            <span className="text-blue-700">{progress}%</span>
          </div>
          <div className="w-full h-2.5 bg-blue-100 rounded-full overflow-hidden shadow-inner border border-blue-200/50">
            <div 
              className="h-full bg-gradient-to-r from-blue-600 to-emerald-400 relative transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/60"></div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-8 text-[11px] font-bold font-mono text-slate-500 leading-relaxed whitespace-pre-line hidden sm:block">
        {bootText}
        <span className="animate-pulse">█</span>
      </div>

      <style>{`
        @keyframes aurora-med-light {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-medical-aurora-light {
          background: linear-gradient(-45deg, #f0f9ff, #e0f2fe, #f8fafc, #dbeafe);
          background-size: 400% 400%;
          animation: aurora-med-light 15s ease infinite;
        }
        .hex-grid-light {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 16.5v33L30 66 0 49.5v-33L30 0zm0 100l30-16.5v-33L30 34 0 50.5v33L30 100z' fill='%231e3a8a' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
        @keyframes float {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(-20px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .custom-font { font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .animate-pulse-slow { animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
}
