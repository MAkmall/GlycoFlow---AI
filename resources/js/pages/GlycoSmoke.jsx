import React, { useState, useEffect, useMemo, useRef } from 'react';
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

  // MINI-GAME STATE (Breather / Cardio-Lung Test)
  const [breatherState, setBreatherState] = useState('idle'); // idle, inhale, success, fail
  const [breatherProgress, setBreatherProgress] = useState(0);
  const breatherTimerRef = useRef(null);

  // =========================================
  // SYSTEM STYLE ADJUSTMENTS (Matches Dashboard)
  // =========================================
  const cardStyle =
    'bg-white rounded-3xl p-6 border border-slate-100 flex flex-col justify-between transition-all duration-300 shadow-sm hover:shadow-md';

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
  // LOGIKA MINI-GAME: BREATHER TEST
  // =========================================
  const startBreatherTest = () => {
    setBreatherState('inhale');
    setBreatherProgress(0);
    
    const breathDifficultyFactor = inputType === 'batang' ? dailyCount * 12 : dailyCount * 1.5;
    const intervalSpeed = Math.max(40, 120 - breathDifficultyFactor);

    breatherTimerRef.current = setInterval(() => {
      setBreatherProgress((prev) => {
        if (prev >= 100) {
          clearInterval(breatherTimerRef.current);
          setBreatherState('success');
          return 100;
        }
        return prev + 2;
      });
    }, intervalSpeed);
  };

  const stopBreatherTest = () => {
    clearInterval(breatherTimerRef.current);
    if (breatherState === 'inhale') {
      if (breatherProgress < 75) {
        setBreatherState('fail');
      } else {
        setBreatherState('success');
      }
    }
  };

  useEffect(() => {
    return () => clearInterval(breatherTimerRef.current);
  }, []);

  // =========================================
  // HELPER FUNCTIONS & MEMOIZED CALCULATIONS
  // =========================================
  const finansial = useMemo(() => {
    if (detectedPrice === 0) return { bulanan: 0, tahunan: 0 };

    let bulanan = 0;
    if (inputType === 'puffs') {
      const hargaVapeDibatasi = Math.max(50000, Math.min(180000, detectedPrice));
      const biayaPerPuff = hargaVapeDibatasi / 600; 
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
    const menitPemulihan = inputType === 'batang' ? dailyCount * 35 : dailyCount * 4;
    return Math.min(1440, menitPemulihan);
  };

  const toxLevel = useMemo(() => {
    if (!isAnalyzed) return 0;
    if (inputType === 'batang') {
      if (dailyCount <= 4) return 0;
      if (dailyCount <= 12) return 1;
      return 2;
    }
    if (dailyCount <= 60) return 0;
    if (dailyCount <= 220) return 1;
    return 2;
  }, [isAnalyzed, inputType, dailyCount]);

  const statusLabel = useMemo(() => {
    if (toxLevel === 0) {
      return {
        text: 'Sel Normal',
        color: 'text-emerald-600 bg-emerald-50 border-emerald-100',
        lungBg: 'bg-emerald-50 border-emerald-100 text-emerald-500 shadow-inner',
      };
    }
    if (toxLevel === 1) {
      return {
        text: 'Inflamasi',
        color: 'text-amber-600 bg-amber-50 border-amber-100',
        lungBg: 'bg-amber-50 border-amber-100 text-amber-500 shadow-inner',
      };
    }
    return {
      text: 'Kritis',
      color: 'text-rose-600 bg-rose-50 border-rose-100',
      lungBg: 'bg-rose-50 border-rose-100 text-rose-500 shadow-inner',
    };
  }, [toxLevel]);

  // =========================================
  // INTEGRASI API GEMINI (DENGAN KEY POOL)
  // =========================================
  const executeSmokeAudit = async () => {
    if (!smokeDeviceInput.trim()) {
      alert('Isi nama rokok/vape terlebih dahulu');
      return;
    }

    setIsLoading(true);
    setIsAnalyzed(false);

    const apiKeysPool = [
      import.meta.env.VITE_API_KEY_POOL_1,
      import.meta.env.VITE_API_KEY_POOL_2,
      import.meta.env.VITE_API_KEY_POOL_3,
      import.meta.env.VITE_API_KEY_POOL_4
    ];

    // Ambil kunci acak dari kolam API key
    const selectedKey = apiKeysPool[Math.floor(Math.random() * apiKeysPool.length)];
    const totalMenit = hitungTotalMenitRecovery();
    const jamMundur = Math.floor(totalMenit / 60);
    const menitMundur = totalMenit % 60;

    // Menentukan estimasi harga default sebelum disesuaikan oleh struktur AI
    const basePriceEstimate = inputType === 'puffs' ? 95000 : 42000;

    // Konstruksi prompt klinis / patologis ketat untuk model AI
    const promptText = `Anda adalah sistem pakar endokrinologi dan patologi metabolik sirkadian tingkat lanjut. 
    Lakukan analisis mendalam mengenai dampak penggunaan zat hisap berikut:
    - Nama Produk Perangkat: "${smokeDeviceInput}"
    - Tipe Konsumsi: ${inputType}
    - Jumlah Intensitas Harian: ${dailyCount} ${inputType === 'batang' ? 'Batang' : 'Puffs'}

    Berikan output dalam format JSON mentah tanpa format markdown (jangan gunakan blok \`\`\`json). Struktur JSON wajib seperti ini:
    {
      "clinicalAnalysis": "Tulis penjelasan patologis ilmiah yang padat (maksimal 3 kalimat) mengenai bagaimana zat ini menghambat sensitivitas serapan insulin pada reseptor GLUT4 jaringan otot dan memicu hipoksia selular.",
      "estimatedPricePerPackOrPod": 42000
    }
    Pastikan "estimatedPricePerPackOrPod" berupa angka integer murni yang realistis untuk pasar Indonesia.`;

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${selectedKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: promptText }] }]
          })
        }
      );

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
      
      // Bersihkan karakter blok kode jika model AI tidak sengaja menyertakannya
      const cleanJsonString = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsedResult = JSON.parse(cleanJsonString);

      setAiAnalysis(parsedResult?.clinicalAnalysis || `Paparan kronis dari "${smokeDeviceInput}" memicu cekaman stres oksidatif sistemik.`);
      setDetectedPrice(Number(parsedResult?.estimatedPricePerPackOrPod) || basePriceEstimate);

    } catch (error) {
      console.error("Gemini API Error, memicu fallback data lokal...", error);
      // Fallback deterministik jika API limit/error
      setAiAnalysis(`Inhalasi berkelanjutan dari perangkat "${smokeDeviceInput}" memicu blokade fungsional akut pada reseptor pemintas gula selular GLUT4. Tubuh memerlukan fase detoksifikasi sirkadian bebas asap.`);
      setDetectedPrice(basePriceEstimate);
    } finally {
      // Mengisi metrik biologi fungsional pendukung halaman
      setSmokeMetrics({
        dailyInsulinParalysis: `${jamMundur} Jam`,
        lungCapacityDamage: `${Math.min(88, Math.round(dailyCount * (inputType === 'batang' ? 3.0 : 0.2)))}%`,
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
    }
  };

  const SectionTitle = ({ number, title }) => (
    <div className="flex items-center gap-2 mb-4">
      <div className="px-2 py-0.5 rounded-md bg-blue-50 border border-blue-100 text-blue-600 text-[10px] font-bold font-mono">
        {number}
      </div>
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
        {title}
      </h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-20 selection:bg-blue-500/10 selection:text-blue-600">
      <Head title="GlycoFlow AI - GlycoSmoke Audit" />
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-6 relative z-10">
        
        {/* PAGE HEADER */}
        <section className="bg-white rounded-3xl p-6 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-100 bg-blue-50 text-[10px] font-medium text-blue-600 uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Hormonal Stress Mapping
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Gerhana Insulin <span className="text-blue-600">Pasca Nikotin</span>
            </h1>
          </div>
          <div className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full bg-blue-500 ${isTimerActive ? 'animate-ping' : ''}`} />
            <span className="text-[10px] font-mono font-bold tracking-wider text-slate-500 uppercase">
              {isTimerActive ? 'Toxicology Active' : 'System Idle'}
            </span>
          </div>
        </section>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* KOLOM 1: INPUT CONTROLLER PANEL */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className={`${cardStyle} flex-1`}>
              <div>
                <SectionTitle number="01" title="Input Parameter Toksik" />
                
                <div className="space-y-2 mt-4">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Nama Rokok / Vape / Pods</label>
                  <input
                    type="text"
                    value={smokeDeviceInput}
                    onChange={(e) => setSmokeDeviceInput(e.target.value)}
                    placeholder="Contoh: Marlboro / Liquid Mango / Relx"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs outline-none text-slate-800 focus:bg-white focus:border-blue-500 transition-all font-medium"
                  />
                </div>

                {/* SWITCH SELECTION */}
                <div className="grid grid-cols-2 gap-2 mt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setInputType('batang');
                      setDailyCount((prev) => Math.min(40, prev)); 
                    }}
                    className={`py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                      inputType === 'batang'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    🚬 Rokok / Batang
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setInputType('puffs');
                      setDailyCount((prev) => prev === 5 ? 120 : prev); 
                    }}
                    className={`py-2.5 rounded-xl font-bold text-[10px] uppercase tracking-wider border transition-all cursor-pointer ${
                      inputType === 'puffs'
                        ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                        : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ⚡ Vape / Puffs
                  </button>
                </div>

                {/* INTENSITY SLIDER */}
                <div className="space-y-2 mt-5">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500">
                    <span>Intensitas Konsumsi Harian</span>
                    <span className="font-mono bg-slate-100 px-2 py-0.5 rounded-md text-[10px] border border-slate-200 text-slate-700">
                      {dailyCount} {inputType === 'batang' ? 'Batang' : 'Puffs'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max={inputType === 'batang' ? 40 : 500}
                    value={dailyCount}
                    onChange={(e) => setDailyCount(Number(e.target.value))}
                    className="w-full accent-blue-600 cursor-pointer h-1 bg-slate-200 rounded-lg appearance-none transition-all"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100 mt-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Status Toksisitas:</span>
                  <div className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isAnalyzed ? statusLabel.color : 'text-slate-400 bg-slate-50 border-slate-200'}`}>
                    {isAnalyzed ? statusLabel.text : 'Idle'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={executeSmokeAudit}
                  disabled={isLoading}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs tracking-wider uppercase transition-all shadow-sm cursor-pointer disabled:opacity-50 active:scale-[0.99]"
                >
                  {isLoading ? 'Menganalisis Keterkaitan Epigenetik...' : 'Jalankan Audit Metabolik'}
                </button>
              </div>
            </div>
          </div>

          {/* KOLOM 2: LUNG VISUALIZATION & INTERACTIVE RETENTION TEST */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className={`${cardStyle} flex-1 justify-start`}>
              <SectionTitle number="02" title="Visualisasi Paru & Diagnostik" />
              
              {/* MINI REFLEX GAME CARD */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3 text-center mb-4">
                <span className="text-[9px] font-mono text-blue-600 block font-bold mb-1">🎮 MINI GAME: CARDIO-LUNG BREATHER</span>
                
                {breatherState === 'idle' && (
                  <div>
                    <p className="text-[10px] text-slate-500 mb-2">Uji ambang toleransi retensi sirkulasi oksigen paru Anda.</p>
                    <button onClick={startBreatherTest} className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-[9px] transition-all cursor-pointer">Mulai Tes Tahan Napas</button>
                  </div>
                )}

                {breatherState === 'inhale' && (
                  <div className="space-y-2">
                    <p className="text-[9px] text-amber-600 font-bold animate-pulse">KLIK & TAHAN TOMBOL DI BAWAH HINGGA BAR 100%!</p>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden border border-slate-300">
                      <div style={{ width: `${breatherProgress}%` }} className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-75" />
                    </div>
                    <button onMouseDown={startBreatherTest} onMouseUp={stopBreatherTest} onTouchStart={startBreatherTest} onTouchEnd={stopBreatherTest} className="w-full py-1.5 bg-blue-600 text-white font-bold rounded-lg text-[10px] select-none active:scale-95 cursor-pointer">TAHAN DISINI</button>
                  </div>
                )}

                {breatherState === 'success' && (
                  <div className="text-emerald-700 text-[10px] font-medium">
                    🎉 <strong>Berhasil!</strong> Kapasitas elastisitas kompensasi seluler paru Anda terdeteksi stabil.
                    <button onClick={() => setBreatherState('idle')} className="block mx-auto mt-1 text-[9px] underline text-slate-400">Reset</button>
                  </div>
                )}

                {breatherState === 'fail' && (
                  <div className="text-rose-700 text-[10px] font-medium">
                    ⚠️ <strong>Refleks Terhenti!</strong> Terjadi hambatan mekanis ekspansi paru akibat paparan fungsional.
                    <button onClick={() => setBreatherState('idle')} className="block mx-auto mt-1 text-[9px] underline text-slate-400">Ulangi</button>
                  </div>
                )}
              </div>

              {/* Lung Graphic Container */}
              <div className="flex flex-col items-center justify-center my-auto py-4">
                <div className={`w-32 h-32 rounded-full border transition-all duration-700 ease-in-out flex items-center justify-center text-5xl select-none ${isAnalyzed ? statusLabel.lungBg : 'bg-slate-50 border-slate-200 text-slate-400 shadow-inner'} ${isTimerActive ? 'animate-pulse' : ''}`}>
                  🫁
                </div>
              </div>
            </div>

            <div className={`${cardStyle} h-32 flex-row items-center justify-between gap-4`}>
              <div className="space-y-1">
                <SectionTitle number="03" title="Kadar Oksigen" />
                <p className="text-slate-400 text-[9px] font-bold uppercase tracking-wider">Saturasi Oksigen Selular</p>
                <h2 className="text-3xl font-black text-slate-800 font-mono tracking-tighter">
                  {isAnalyzed ? `${kadarOksigen}%` : '99%'}
                </h2>
              </div>
              <div className="w-14 h-14 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shadow-inner">
                💨
              </div>
            </div>
          </div>

          {/* KOLOM 3: FINANCIAL & BIOLOGICAL METRICS */}
          <div className="space-y-6 flex flex-col justify-between">
            <div className={`${cardStyle} flex-1`}>
              <SectionTitle number="04" title="Finansial & Alternatif Aset" />
              
              <div className="grid grid-cols-2 gap-3 my-3">
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-inner">
                  <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Biaya Bulanan</p>
                  <h2 className="text-xs font-bold text-slate-800 font-mono">
                    Rp {finansial.bulanan.toLocaleString('id-ID')}
                  </h2>
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 shadow-inner">
                  <p className="text-[9px] text-blue-500 font-bold uppercase tracking-wider mb-0.5">Akumulasi Tahunan</p>
                  <h2 className="text-xs font-bold text-blue-600 font-mono">
                    Rp {finansial.tahunan.toLocaleString('id-ID')}
                  </h2>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-inner">
                <p className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider mb-0.5">💡 Setara Pengalihan Investasi:</p>
                <h2 className="text-xs font-bold text-slate-800 truncate">{aset.nama}</h2>
                <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{aset.spek}</p>
              </div>
            </div>

            <div className={`${cardStyle} flex-1`}>
              <SectionTitle number="05" title="Biological Metrics" />
              <div className="space-y-2 mt-2">
                <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-inner">
                  <span className="text-slate-500">Blokade Reseptor Insulin</span>
                  <span className="font-bold text-rose-600 font-mono">{smokeMetrics.dailyInsulinParalysis}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-inner">
                  <span className="text-slate-500">Beban Kapasitas Paru</span>
                  <span className="font-bold text-slate-700 font-mono">{smokeMetrics.lungCapacityDamage}</span>
                </div>

                <div className="flex justify-between p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs shadow-inner">
                  <span className="text-slate-500">Penuaan Kerutan Kulit</span>
                  <span className="font-bold text-indigo-600 font-mono">+{isAnalyzed ? penuaanKulit : 0} Tahun</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM SECTION: RESPONS TIMER RECOVERY & AI TEXT ENGINE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className={`${cardStyle} lg:col-span-4 text-center justify-between border-t-2 border-t-blue-500`}>
            <SectionTitle number="06" title="Recovery Timer Clock" />
            <div className="my-3 text-3xl font-bold font-mono tracking-wider text-blue-600 bg-slate-50 py-3 rounded-xl border border-slate-200 shadow-inner">
              {String(countdown.hours).padStart(2, '0')}:
              {String(countdown.minutes).padStart(2, '0')}:
              {String(countdown.seconds).padStart(2, '0')}
            </div>
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
              Durasi Sensitisasi Ulang Reseptor Jalur GLUT4
            </p>
          </div>

          <div className={`${cardStyle} lg:col-span-8 justify-start border-t-2 border-t-indigo-500`}>
            <SectionTitle number="07" title="AI Pathological Analysis Engine" />
            <div className="mt-2 text-xs text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-xl border border-dashed border-slate-300 shadow-inner h-24 overflow-y-auto">
              {aiAnalysis || 'Jalankan audit kalkulasi toksisitas sirkadian di panel kiri untuk memicu penalaran klinis endokrinologi berbasis kecerdasan buatan.'}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}