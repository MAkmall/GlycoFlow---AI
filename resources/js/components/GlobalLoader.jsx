import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function GlobalLoader() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let timeout;
    
    const removeStart = router.on('start', () => {
      setIsLoading(true);
    });

    const removeFinish = router.on('finish', () => {
      timeout = setTimeout(() => {
        setIsLoading(false);
      }, 600); 
    });

    return () => {
      removeStart();
      removeFinish();
      if(timeout) clearTimeout(timeout);
    };
  }, []);

  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white/70 backdrop-blur-xl transition-all duration-500 ease-in-out ${
        isLoading ? 'opacity-100 pointer-events-auto scale-100' : 'opacity-0 pointer-events-none scale-105'
      }`}
    >
      <div className="absolute inset-0 hex-grid-light opacity-30 mix-blend-multiply pointer-events-none"></div>

      <div className="relative flex flex-col items-center justify-center bg-white/50 p-12 rounded-[3rem] shadow-[0_20px_60px_-15px_rgba(30,58,138,0.15)] border border-white">
        <div className="relative w-28 h-28 mb-6 flex items-center justify-center">
          <div className="absolute w-full h-full rounded-full border-[1.5px] border-blue-200 animate-[spin_4s_linear_infinite]">
             <div className="absolute top-0 left-1/2 w-3 h-3 bg-emerald-400 rounded-full shadow-[0_0_10px_#34d399]"></div>
          </div>
          <div className="absolute w-20 h-20 rounded-full border-y-[3px] border-dashed border-blue-300 animate-[spin_6s_linear_infinite_reverse]"></div>
          
          <div className="relative w-14 h-14 bg-white/90 rounded-full flex items-center justify-center backdrop-blur-sm border border-blue-100 shadow-[0_5px_15px_rgba(30,58,138,0.1)]">
            <svg className="absolute w-8 h-8 text-rose-500/20 animate-ping" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <svg className="absolute w-10 h-10 text-blue-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 12h4l3-8 4 16 3-8h4" />
            </svg>
          </div>
        </div>
        
        <p className="text-blue-900 font-bold font-mono text-[10px] sm:text-xs tracking-[0.2em] uppercase animate-pulse">
          Loading Data...
        </p>
      </div>

      <style>{`
        .hex-grid-light {
          background-image: url("data:image/svg+xml,%3Csvg width='60' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 16.5v33L30 66 0 49.5v-33L30 0zm0 100l30-16.5v-33L30 34 0 50.5v33L30 100z' fill='%231e3a8a' fill-opacity='0.03' fill-rule='evenodd'/%3E%3C/svg%3E");
        }
      `}</style>
    </div>
  );
}
