import React, { useState, useEffect, useMemo } from 'react';
import Navbar from '../components/Navbar';
import { Head } from '@inertiajs/react';

export default function GlycoSmoke() {
  // =========================================
  // STATE CONTROLLERS
  // =========================================
  const [smokeDeviceInput, setSmokeDeviceInput] = useState('');
  const [inputType, setInputType] = useState('batang');
  const [dailyCount, setDailyCount] = useState(5);

  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [countdown, setCountdown] = useState({
    hours: 6,
    minutes: 0,
    seconds: 0,
  });

  const [isTimerActive, setIsTimerActive] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [detectedPrice, setDetectedPrice] = useState(0); 

  const [smokeMetrics, setSmokeMetrics] = useState({
    dailyInsulinParalysis: '-',
    lungCapacityDamage: '-',
    visceralFatRisk: '-',
  });

  // =========================================
  // GLOBAL STYLE
  // =========================================
  const cardStyle =
    'glass-panel rounded-3xl p-6 flex flex-col justify-between transition-all duration-300 hover:shadow-[0_20px_50px_rgba(244,63,94,0.05)]';

  // =========================================
  // COUNTDOWN TIMER TICK ENGINE
  // =========================================
  useEffect(() => {
    let interval = null;

    if (isTimerActive) {
      interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
            setIsTimerActive(false);
            clearInterval(interval);
            return prev;
          }

          let s = prev.seconds - 1;
          let m = prev.minutes;
          let h = prev.hours;

          if (s < 0) {
            s = 59;
            m -= 1;
          }

          if (m < 0) {
            m = 59;
            h -= 1;
          }

          return { hours: h, minutes: m, seconds: s };
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerActive]);

  // =========================================
  // HELPER FUNCTIONS & MEMOIZED CALCULATIONS
  // =========================================
  
  // Mencegah kalkulasi finansial berulang setiap detik akibat detak timer
  const finansial = useMemo(() => {
    if (detectedPrice === 0) return { bulanan: 0, tahunan: 0 };

    let bulanan = 0;
    if (inputType === 'puffs') {
      const hargaVapeDibatasi = Math.max(50000, Math.min(110000, detectedPrice));
      const biayaPerPuff = hargaVapeDibatasi / 400; 
      bulanan = Math.floor(biayaPerPuff * dailyCount * 30);
    } else {
      const hargaPerBatang = Math.floor(detectedPrice / 16); 
      bulanan = Math.floor(hargaPerBatang * dailyCount * 30);
    }

    return {
      bulanan,
      tahunan: bulanan * 12
    };
  }, [detectedPrice, inputType, dailyCount]);

  const aset = useMemo(() => {
    const danaTahunan = finansial.tahunan;
    if (danaTahunan === 0) return { nama: 'Menunggu Analisis', spek: '-' };
    if (danaTahunan <= 1500000) return { nama: 'TWS Earbuds Bluetooth', spek: 'Anker Soundcore / Redmi Buds Premium' };
    if (danaTahunan <= 4000000) return { nama: 'Sepatu Sneaker Klasik Ritel', spek: 'Adidas Samba OG / Nike Air Force 1' };
    if (danaTahunan <= 12000000) return { nama: 'Gadget Android / iOS Tablet', spek: 'Xiaomi Pad Flagship / iPad Base Gen' };
    if (danaTahunan <= 30000000) return { nama: 'Motor Matik Unit Baru', spek: 'Honda BeAT / Yamaha Fazzio Neo' };
    
    return { nama: 'Motor Sport / Tabungan Umroh', spek: 'Yamaha NMAX ABS / Paket Umroh Reguler' };
  }, [finansial.tahunan]);

  const kadarOksigen = useMemo(() => {
    const baseO2 = 99;
    const reduction = inputType === 'batang' ? dailyCount * 0.8 : dailyCount * 0.03;
    return Math.max(82, Math.round(baseO2 - reduction));
  }, [inputType, dailyCount]);

  const penuaanKulit = useMemo(() => {
    if (dailyCount === 0) return 0;
    const factor = inputType === 'batang' ? dailyCount * 0.4 : dailyCount * 0.02;
    return Math.min(12, Math.round(factor));
  }, [inputType, dailyCount]);

  const hitungTotalMenitRecovery = () => {
    if (dailyCount === 0) return 120; 
    const menitPemulihan = inputType === 'batang' ? dailyCount * 30 : dailyCount * 3;
    return Math.min(1440, menitPemulihan);
  };

  const toxLevel = useMemo(() => {
    if (!isAnalyzed) return 0;
    if (inputType === 'batang') {
      if (dailyCount <= 3) return 0;
      if (dailyCount <= 12) return 1;
      return 2;
    }
    if (dailyCount <= 50) return 0;
    if (dailyCount <= 200) return 1;
    return 2;
  }, [isAnalyzed, inputType, dailyCount]);

  const statusLabel = useMemo(() => {
    if (toxLevel === 0) {
      return {
        text: 'Sel Normal',
        color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
        lungBg: 'from-emerald-500/10 to-emerald-600/10 text-emerald-400 border-emerald-500/20 shadow-[inset_0_0_30px_rgba(16,185,129,0.2)]',
      };
    }
    if (toxLevel === 1) {
      return {
        text: 'Inflamasi',
        color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
        lungBg: 'from-amber-500/10 to-amber-600/10 text-amber-500 border-amber-500/20 shadow-[inset_0_0_30px_rgba(245,158,11,0.2)]',
      };
    }
    return {
      text: 'Kritis',
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/30',
      lungBg: 'from-rose-950/40 to-slate-900 text-rose-600 border-rose-500/30 shadow-[inset_0_0_40px_rgba(225,29,72,0.3)]',
    };
  }, [toxLevel]);

  // =========================================
  // AI ANALYSIS AUDIT EXECUTION
  // =========================================
  const executeSmokeAudit = async () => {
    if (!smokeDeviceInput.trim()) {
      alert('Isi nama rokok/vape terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setIsAnalyzed(false);

    setTimeout(() => {
      const totalMenit = hitungTotalMenitRecovery();
      const jamMundur = Math.floor(totalMenit / 60);
      const menitMundur = totalMenit % 60;

      setAiAnalysis(
        `Berdasarkan audit sirkadian, paparan ${dailyCount} ${inputType === 'batang' ? 'batang' : 'puffs'} nikotin dari "${smokeDeviceInput}" memicu blokade akut pada reseptor pemintas gula GLUT4. Tubuh Anda membutuhkan waktu karantina biologis selama minimum ${jamMundur} Jam ${menitMundur} Menit tanpa asap untuk mengembalikan sensitivitas serapan insulin selular ke ambang batas normal.`
      );

      setDetectedPrice(inputType === 'puffs' ? 85000 : 38000);

      setSmokeMetrics({
        dailyInsulinParalysis: `${jamMundur} Jam`,
        lungCapacityDamage: `${Math.min(78, Math.round(dailyCount * (inputType === 'batang' ? 2.5 : 0.15)))}%`,
        visceralFatRisk: toxLevel === 2 ? 'Kritis' : toxLevel === 1 ? 'Tinggi' : 'Normal',
      });

      setCountdown({
        hours: jamMundur,
        minutes: menitMundur,
        seconds: 0,
      });

      setIsTimerActive(true);
      setIsAnalyzed(true);
      setIsLoading(false);
    }, 2000);
  };

  const SectionTitle = ({ number, title }) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 flex items-center justify-center text-[10px] font-bold font-mono shadow-inner">
        {number}
      </div>
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
        {title}
      </h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pt-28 pb-20 relative overflow-x-hidden selection:bg-rose-500/30 selection:text-white">
      <Head title="GlycoFlow AI - GlycoSmoke" />
      <Navbar />

      <style>{`
        @keyframes auroraRose {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-aurora-rose {
          background: linear-gradient(-45deg, #0f172a, #4c0519, #0f172a, #1e1b4b);
          background-size: 400% 400%;
          animation: auroraRose 25s ease infinite;
        }
        .glass-panel {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.3);
        }
        .custom-font { font-family: "Outfit", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; }
        .cyber-grid {
          background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 30px 30px;
        }
      `}</style>

      <div className="fixed inset-0 bg-aurora-rose z-0 pointer-events-none" />
      <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40" />
      <div className="fixed top-[-20%] right-[-10%] w-200 h-200 bg-rose-600/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed bottom-[-20%] left-[-10%] w-200 h-200 bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />

      <main className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 flex flex-col gap-8">
        
        {/* PAGE HEADER */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-rose-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="relative z-10 text-center lg:text-left flex-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-500/10 text-[10px] font-mono text-rose-400 font-bold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400 animate-pulse" />
              Hormonal Stress Mapping
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white custom-font tracking-tight">
              Gerhana Insulin <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-orange-400">Pasca Nikotin</span>
            </h1>
          </div>
          <div className="relative z-10 px-5 py-2 bg-slate-900/50 border border-slate-700 rounded-2xl flex items-center gap-3">
            <div className={`w-2 h-2 rounded-full bg-rose-500 absolute ${isTimerActive ? 'animate-ping' : ''}`} />
            <div className="w-2 h-2 rounded-full bg-rose-500 relative" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">
              {isTimerActive ? 'Toxicology Active' : 'System Idle'}
            </span>
          </div>
        </section>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* KOLOM KIRI: INPUT PANEL CONTROLLER */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className={`${cardStyle} flex-1 gap-5`}>
              <div>
                <SectionTitle number="01" title="Input Toksik" />
                
                <div className="space-y-2 mt-5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nama Rokok / Vape</label>
                  <input
                    type="text"
                    value={smokeDeviceInput}
                    onChange={(e) => setSmokeDeviceInput(e.target.value)}
                    placeholder="Marlboro / Liquid Mango"
                    className="w-full bg-slate-900/60 border border-slate-700 rounded-2xl px-4 py-3.5 text-sm outline-none text-white focus:bg-slate-900 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 transition-all font-medium shadow-inner"
                  />
                </div>

                {/* SWITCH TYPE WITH FIX LOGIC */}
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setInputType('batang');
                      setDailyCount((prev) => Math.min(40, prev)); 
                    }}
                    className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                      inputType === 'batang'
                        ? 'bg-rose-500 text-slate-950 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-slate-900/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    🚬 Rokok
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInputType('puffs');
                      setDailyCount((prev) => prev === 5 ? 120 : prev); 
                    }}
                    className={`py-3 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                      inputType === 'puffs'
                        ? 'bg-rose-500 text-slate-950 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                        : 'bg-slate-900/50 text-slate-400 border-slate-700/50 hover:bg-slate-800'
                    }`}
                  >
                    ⚡ Vape
                  </button>
                </div>

                <div className="space-y-3 mt-6">
                  <div className="flex justify-between text-[11px] font-bold text-slate-400">
                    <span>Intensitas Harian</span>
                    <span className="font-mono bg-slate-800 px-2.5 py-0.5 rounded-lg text-[10px] border border-slate-700 text-white">
                      {dailyCount} {inputType === 'batang' ? 'Batang' : 'Puffs'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={inputType === 'batang' ? 40 : 500}
                    value={dailyCount}
                    onChange={(e) => setDailyCount(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none hover:accent-rose-400 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-5 border-t border-slate-800 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Fase Toksisitas:</span>
                  <div className={`px-3 py-1.5 rounded-lg border text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${isAnalyzed ? statusLabel.color : 'text-slate-400 bg-slate-800 border-slate-700'}`}>
                    {isAnalyzed ? statusLabel.text : 'Idle'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={executeSmokeAudit}
                  disabled={isLoading}
                  className="w-full py-4 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-black text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(225,29,72,0.4)] transition-all cursor-pointer disabled:opacity-50 active:scale-[0.98]"
                >
                  {isLoading ? 'Menganalisis Efek Epigenetik...' : 'JALANKAN AUDIT METABOLIK'}
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM TENGAH: LUNGS VISUALIZATION & OXYGEN (DENGAN INTEGRASI PARU DINAMIS) */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className={`${cardStyle} flex-1 justify-start`}>
              <SectionTitle number="02" title="Visualisasi Paru" />
              <div className="flex flex-col items-center justify-center my-auto py-6">
                {/* Ikon Paru-Paru Utama dengan Animasi Pulse Berdasarkan Keadaan Analisis */}
                <div className={`w-44 h-44 rounded-full bg-gradient-to-br transition-all duration-700 ease-in-out flex items-center justify-center text-7xl select-none ${isAnalyzed ? statusLabel.lungBg : 'from-slate-800 to-slate-900/50 text-slate-600 border border-slate-800 shadow-inner'} ${isTimerActive ? 'animate-pulse' : ''}`}>
                  🫁
                </div>
                <p className="text-[11px] text-slate-400 font-medium text-center mt-6 max-w-55 leading-relaxed">
                  Peta akumulasi biomarker karbon monoksida (CO) dan stres oksidatif paru harian.
                </p>
              </div>
            </div>

            <div className={`${cardStyle} h-36 flex-row items-center justify-between gap-4`}>
              <div className="space-y-2">
                <SectionTitle number="03" title="Kadar Oksigen" />
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider pt-2">Saturasi Oksigen Selular</p>
                <h2 className="text-4xl font-black text-white font-mono tracking-tighter">
                  {isAnalyzed ? `${kadarOksigen}%` : '99%'}
                </h2>
              </div>
              <div className="w-16 h-16 rounded-2xl bg-slate-900/50 border border-slate-700/50 flex items-center justify-center text-2xl shadow-inner">
                💨
              </div>
            </div>
          </div>

          {/* KOLOM KANAN: FINANCIAL & BIOLOGICAL METRICS */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className={`${cardStyle} flex-1`}>
              <SectionTitle number="04" title="Finansial & Aset" />
              
              <div className="grid grid-cols-2 gap-3 my-4">
                <div className="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 shadow-inner">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-1">Bulanan</p>
                  <h2 className="text-sm font-black text-white font-mono">
                    Rp {finansial.bulanan.toLocaleString('id-ID')}
                  </h2>
                </div>

                <div className="bg-rose-900/20 border border-rose-500/30 rounded-2xl p-4 shadow-inner">
                  <p className="text-[9px] text-rose-400 font-bold uppercase tracking-wider mb-1">Tahunan</p>
                  <h2 className="text-sm font-black text-rose-400 font-mono drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]">
                    Rp {finansial.tahunan.toLocaleString('id-ID')}
                  </h2>
                </div>
              </div>

              <div className="bg-slate-900/40 border border-slate-700/50 rounded-xl p-4 shadow-inner">
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mb-1">Konversi Tabungan Setara:</p>
                <h2 className="text-sm font-black text-white truncate">{aset.nama}</h2>
                <p className="text-[10px] text-emerald-400 font-medium truncate mt-0.5">{aset.spek}</p>
              </div>
            </div>

            <div className={`${cardStyle} flex-1`}>
              <SectionTitle number="05" title="Biological Metrics" />
              <div className="space-y-3 mt-4">
                <div className="flex justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 shadow-inner">
                  <span className="text-[11px] font-medium text-slate-300">Lumpuhnya Insulin</span>
                  <span className="font-bold text-rose-400 font-mono text-[11px]">{smokeMetrics.dailyInsulinParalysis}</span>
                </div>

                <div className="flex justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 shadow-inner">
                  <span className="text-[11px] font-medium text-slate-300">Beban Kapasitas Paru</span>
                  <span className="font-bold text-slate-100 font-mono text-[11px]">{smokeMetrics.lungCapacityDamage}</span>
                </div>

                <div className="flex justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-700/50 shadow-inner">
                  <span className="text-[11px] font-medium text-slate-300">Penuaan Epidermal</span>
                  <span className="font-bold text-indigo-400 font-mono text-[11px]">+{isAnalyzed ? penuaanKulit : 0} Tahun</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM BAR: TIMER & RESPONS AI CORE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className={`${cardStyle} lg:col-span-4 text-center justify-between h-45 lg:h-auto border-t-4 border-t-rose-500/50`}>
            <SectionTitle number="06" title="Recovery Timer" />
            <div className="my-auto text-4xl font-black font-mono tracking-widest text-rose-400 bg-slate-900/80 py-4 rounded-2xl border border-slate-700 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]">
              {String(countdown.hours).padStart(2, '0')}:
              {String(countdown.minutes).padStart(2, '0')}:
              {String(countdown.seconds).padStart(2, '0')}
            </div>
            <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">
              Waktu Re-Sensitisasi Reseptor Sel GLUT4 Otot
            </p>
          </div>

          <div className={`${cardStyle} lg:col-span-8 justify-start border-t-4 border-t-indigo-500/50`}>
            <SectionTitle number="07" title="AI Pathological Analysis Engine" />
            <div className="mt-4 text-xs text-slate-300 leading-relaxed font-medium bg-slate-900/50 p-5 rounded-2xl border border-dashed border-slate-600 shadow-inner h-28 overflow-y-auto">
              {aiAnalysis || 'Jalankan audit kalkulasi toksisitas sirkadian di panel kiri untuk memicu penalaran klinis endokrinologi berbasis kecerdasan buatan.'}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}