import React from 'react';
import { Link, usePage } from '@inertiajs/react';

export default function Navbar() {
  const { url } = usePage();

  // Urutan Menu Baru: Dashboard, Glycemic Spike, Glyco Smoke, MindHub, Skin Center
  const menuItems = [
    { 
      id: '/dashboard', 
      label: 'Dashboard', 
      text: 'text-blue-600',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.003 9.003 0 1020.945 13H11V3.055z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
        </svg>
      )
    },
    { 
      id: '/simulator', 
      label: 'Glycemic Spike', 
      text: 'text-emerald-600',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    },
    { 
      id: '/glyco-smoke', 
      label: 'Glyco Smoke', 
      text: 'text-rose-600',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.966 7.966 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      )
    },
    { 
      id: '/mindhub', 
      label: 'MindHub', 
      text: 'text-indigo-600',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    { 
      id: '/skin-center',
      label: 'Skin Center', 
      text: 'text-orange-500',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
  ];

  return (
    <>
      <style>{`
        @keyframes microBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .nav-item-link:hover .nav-icon {
          animation: microBounce 0.6s cubic-bezier(0.25, 1, 0.5, 1) infinite;
        }
        .nav-text-style {
          font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
          letter-spacing: -0.015em;
        }
        .glass-nav-light {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.8);
        }
      `}</style>

      <nav className="fixed top-0 left-0 right-0 w-full glass-nav-light px-6 py-3.5 flex flex-row items-center justify-between z-50 shadow-[0_4px_30px_rgba(30,58,138,0.05)]">
        
        {/* LOGO SECTION */}
        <div className="flex items-center gap-3 select-none">
          <div className="w-9 h-9 bg-gradient-to-tr from-blue-600 to-emerald-400 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-[0_4px_10px_rgba(37,99,235,0.3)]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
               <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-sm text-blue-950 tracking-tight leading-none nav-text-style">GlycoFlow - AI</h1>
          </div>
        </div>

        {/* NAVIGATION LINKS CONTAINER */}
        <div className="flex flex-row items-center gap-1 sm:gap-1.5">
          {menuItems.map((item) => {
            const isActive = url === item.id;
            return (
              <Link
                key={item.id}
                href={item.id}
                className={`group nav-item-link relative px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-blue-50 text-blue-900 font-bold border border-blue-100' 
                    : 'text-slate-500 hover:text-blue-900 hover:bg-slate-50'
                }`}
              >
                <div className={`nav-icon transition-colors duration-300 ${isActive ? item.text : 'text-slate-400 group-hover:text-blue-500'}`}>
                  {item.icon}
                </div>
                <span className="text-xs font-semibold nav-text-style transition-colors">
                  {item.label}
                </span>
                {/* Efek Garis Bawah */}
                <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[3px] bg-gradient-to-r from-blue-500 to-emerald-400 rounded-t-full transition-all duration-300 ease-out ${
                  isActive ? 'w-3/5 opacity-100' : 'w-0 opacity-0 group-hover:w-2/5 group-hover:opacity-100'
                }`}></div>
              </Link>
            );
          })}
        </div>

        {/* STATUS NODE RIGHT */}
        <div className="hidden md:flex items-center gap-2.5 bg-white border border-blue-100 px-4 py-2 rounded-full shadow-sm">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.6)]"></div>
          <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Sync Active</span>
        </div>

      </nav>
    </>
  );
}