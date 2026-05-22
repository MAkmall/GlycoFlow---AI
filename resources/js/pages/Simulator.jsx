import React, { useState, useEffect, useRef } from 'react';
import { Head } from '@inertiajs/react';
import Navbar from '../components/Navbar';
import "../../css/background.css";

export default function Simulator() {
  // --- 🧪 STATE UTAMA LOGIKA SIMULATOR NUTRISI ---
  const [eatHour, setEatHour] = useState(12);
  const [foodImage, setFoodImage] = useState(null);
  const [foodPreview, setFoodPreview] = useState(null);
  
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [predictedSpike, setPredictedSpike] = useState(0);
  
  const [itemType, setItemType] = useState('MAKANAN');
  const [sugarGrade, setSugarGrade] = useState('-');
  const [sugarGram, setSugarGram] = useState(0);
  const [alcoholPercent, setAlcoholPercent] = useState(0);

  const [metrics, setMetrics] = useState({
    name: '-', cal: '0', protein: '0', carbs: '0', fat: '0', 
    marketingTrap: '-', cellDamage: '0', walkSteps: '0', kitchenAntidote: '-'
  });

  // --- 🔢 STATE UNTUK DISPLAY ANGKA BERANIMASI ---
  const [displayCal, setDisplayCal] = useState(0);
  const [displayProtein, setDisplayProtein] = useState(0);
  const [displayCarbs, setDisplayCarbs] = useState(0);
  const [displayFat, setDisplayFat] = useState(0);
  const [displaySugarGram, setDisplaySugarGram] = useState(0);
  const [displayAlcohol, setDisplayAlcohol] = useState(0);
  const [displayDamage, setDisplayDamage] = useState(0);
  const [displaySpike, setDisplaySpike] = useState(0);
  const [displaySteps, setDisplaySteps] = useState(0);

  // --- 💬 STATE CHATBOT AI CONSULTANT ---
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Halo! Saya adalah GlycoFlow Clinical Agent. Ada yang ingin Anda konsultasikan mengenai hasil pemindaian atau manajemen lonjakan glikemik Anda hari ini?' }
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading, isChatOpen]);

  // --- 🪄 EFFECT FUNGSIONAL: ANIMASI ANGKA BERGULIR ---
  useEffect(() => {
    const duration = 1200; 
    const frameRate = 1000 / 60; 
    const totalFrames = Math.round(duration / frameRate);

    let frame = 0;
    
    const targetCal = parseInt(metrics.cal) || 0;
    const targetProtein = parseInt(metrics.protein) || 0;
    const targetCarbs = parseInt(metrics.carbs) || 0;
    const targetFat = parseInt(metrics.fat) || 0;
    const targetSugar = sugarGram || 0;
    const targetAlcohol = alcoholPercent || 0;
    const targetDamage = parseInt(metrics.cellDamage) || 0;
    const targetSpike = predictedSpike || 0;
    const targetSteps = parseInt(metrics.walkSteps) || 0;

    if (isLoading || !foodImage) {
      setDisplayCal(0);
      setDisplayProtein(0);
      setDisplayCarbs(0);
      setDisplayFat(0);
      setDisplaySugarGram(0);
      setDisplayAlcohol(0);
      setDisplayDamage(0);
      setDisplaySpike(0);
      setDisplaySteps(0);
      return;
    }

    const counterInterval = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;

      setDisplayCal(Math.floor(targetCal * progress));
      setDisplayProtein(Math.floor(targetProtein * progress));
      setDisplayCarbs(Math.floor(targetCarbs * progress));
      setDisplayFat(Math.floor(targetFat * progress));
      setDisplaySugarGram(Math.floor(targetSugar * progress));
      setDisplayAlcohol(Math.floor(targetAlcohol * progress));
      setDisplayDamage(Math.floor(targetDamage * progress));
      setDisplaySpike(Math.floor(targetSpike * progress));
      setDisplaySteps(Math.floor(targetSteps * progress));

      if (frame >= totalFrames) {
        setDisplayCal(targetCal);
        setDisplayProtein(targetProtein);
        setDisplayCarbs(targetCarbs);
        setDisplayFat(targetFat);
        setDisplaySugarGram(targetSugar);
        setDisplayAlcohol(targetAlcohol);
        setDisplayDamage(targetDamage);
        setDisplaySpike(targetSpike);
        setDisplaySteps(targetSteps);
        clearInterval(counterInterval);
      }
    }, frameRate);

    return () => clearInterval(counterInterval);
  }, [metrics, sugarGram, alcoholPercent, predictedSpike, isLoading, foodImage]);

  // --- 🛠️ HANDLER HAPUS GAMBAR ---
  const handleRemoveImage = (e) => {
    e.preventDefault();
    e.stopPropagation(); 
    setFoodImage(null);
    setFoodPreview(null);
    setSugarGram(0);
    setSugarGrade('-');
    setAlcoholPercent(0); 
    setPredictedSpike(0);
    setAiAnalysis('');
    setMetrics({
      name: '-', cal: '0', protein: '0', carbs: '0', fat: '0', 
      marketingTrap: '-', cellDamage: '0', walkSteps: '0', kitchenAntidote: '-'
    });
  };

  // --- 🛠️ PARSER DATA BIOMARKER VISUAL ---
  const fileToGenerativePart = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve({ inlineData: { data: reader.result.split(',')[1], mimeType: file.type } });
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const parseRealAIPayload = (aiText) => {
    const cleanText = aiText.replace(/\*\*/g, '');
    const cleanNarrative = cleanText.split('[')[0].replace(/[\n*]/g, '').trim();
    setAiAnalysis(cleanNarrative || "Analisis molekul visual berhasil dipetakan.");

    const parsedGram = cleanText.match(/\[SUGAR_GRAM:\s*(\d+)\]/)?.[1] || '0';
    const parsedGrade = cleanText.match(/\[SUGAR_GRADE:\s*([A-D])\]/)?.[1] || 'A';
    const parsedAlcohol = cleanText.match(/\[ALCOHOL:\s*(\d+)\]/)?.[1] || '0'; 

    setSugarGram(parseInt(parsedGram));
    setSugarGrade(parsedGrade.toUpperCase().trim());
    setAlcoholPercent(parseInt(parsedAlcohol));

    setMetrics({
      name: (cleanText.match(/\[NAME:\s*(.*?)\]/)?.[1] || 'Hidangan Tidak Teridentifikasi').trim(),
      cal: (cleanText.match(/\[CALORIES:\s*(\d+)\]/)?.[1] || '0'),
      protein: (cleanText.match(/\[PROTEIN:\s*(\d+)\]/)?.[1] || '0'),
      carbs: (cleanText.match(/\[CARBS:\s*(\d+)\]/)?.[1] || '0'),
      fat: (cleanText.match(/\[FAT:\s*(\d+)\]/)?.[1] || '0'),
      marketingTrap: (cleanText.match(/\[TRAP:\s*(.*?)\]/)?.[1] || 'Gagal memetakan risiko metabolik objek.').trim(),
      cellDamage: (cleanText.match(/\[DAMAGE:\s*(\d+)\]/)?.[1] || '0'),
      walkSteps: (cleanText.match(/\[STEPS:\s*(\d+)\]/)?.[1] || '0'),
      kitchenAntidote: (cleanText.match(/\[ANTIDOTE:\s*(.*?)\]/)?.[1] || 'Petunjuk netralisasi glukosa gagal dimuat.').trim()
    });
    
    setPredictedSpike(parseInt(cleanText.match(/\[SPIKE:\s*(\d+)\]/)?.[1] || '0'));
  };

  // --- 🔬 HELPER FETCH UNTUK MULTI-KEY ---
  const sendRequestWithKey = async (apiKey, imagePart, prompt) => {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        contents: [{ 
          parts: [
            { text: prompt }, 
            imagePart
          ] 
        }] 
      })
    });
    return response;
  };

  // --- 🔬 ENGINE PEMINDAI MULTIMODAL CITRA UTAMA ---
  const executeCompositeScan = async () => {
    if (!foodImage) {
      alert("Silakan tentukan citra objek lewat kamera atau galeri terlebih dahulu.");
      return;
    }

    setIsLoading(true);
    setAiAnalysis('Menghubungkan ke server visual spektrometer Gemini...');
    
    setSugarGram(0);
    setSugarGrade('-');
    setAlcoholPercent(0);
    setPredictedSpike(0);
    setMetrics({ name: 'Memindai...', cal: '0', protein: '0', carbs: '0', fat: '0', marketingTrap: 'Mengekstrak...', cellDamage: '0', walkSteps: '0', kitchenAntidote: 'Menghitung...' });

    const keysPool = [
      { name: "Kunci Utama", key: import.meta.env.VITE_GEMINI_API_KEY },
      { name: "Cadangan 1", key: import.meta.env.VITE_GEMINI_API_KEY_BACKUP },
      { name: "Cadangan 2", key: import.meta.env.VITE_GEMINI_KEY_BACKUP2 },
      { name: "Cadangan 3", key: import.meta.env.VITE_GEMINI_KEY_BACKUP3 }
    ];

    const prompt = `Anda adalah Asisten Medis Nutrisi Klinis spesialis Rekayasa Metabolik dari Nuvica Health. 
    Tugas utama Anda adalah melakukan inspeksi visual mendalam pada foto hidangan yang dilampirkan ini. Objek ini diidentifikasi oleh pengguna dalam kategori "${itemType}" dan dikonsumsi pada Pukul ${eatHour}:00.

    LANGKAH ANALISIS WAJIB:
    1. Identifikasi secara spesifik nama makanan/minuman yang benar-benar terlihat di foto.
    2. Estimasi porsi, kalori, protein, karbohidrat, lemak, dan kandungan gula murni (gram).
    3. Jika kategori yang dipilih adalah MINUMAN, lakukan analisa apakah minuman tersebut mengandung alkohol. Estimasi persentase ABV (Alcohol by Volume) antara 0 sampai 100. Jika tidak mengandung alkohol atau berupa MAKANAN, berikan nilai 0.
    4. Tentukan Sugar Grade (A/B/C/D).
    5. Berikan ringkasan diagnosis klinis maksimal 1-2 kalimat saja di awal respons.

    ATURAN FORMAT OUTPUT:
    - Jangan gunakan format markdown tebal (seperti **) pada bagian token data mentah di dalam kurung siku.
    - Letakkan token data mentah di baris paling baru (paling bawah) setelah narasi diagnosis selesai.

    Format instruksi data mentah wajib disertakan di akhir jawaban dengan format persis seperti ini untuk dibaca sistem:
    [TYPE:${itemType}] [NAME:nama objek hasil deteksi foto asli] [CALORIES:angka] [PROTEIN:angka] [CARBS:angka] [FAT:angka] [SUGAR_GRAM:angka] [SUGAR_GRADE:huruf A/B/C/D] [ALCOHOL:angka persentase tanpa persen contoh 5 atau 12]] [TRAP:potensi risiko glikemik hidangan ini] [DAMAGE:angka 1-100] [STEPS:angka langkah] [ANTIDOTE:resep alami penetral glukosa] [SPIKE:angka mg/dL]`;

    try {
      const imagePart = await fileToGenerativePart(foodImage);
      let response = null;
      let data = null;
      let success = false;

      for (let i = 0; i < keysPool.length; i++) {
        const currentConfig = keysPool[i];
        if (!currentConfig.key) continue;

        try {
          response = await sendRequestWithKey(currentConfig.key, imagePart, prompt);
          data = await response.json();

          if (response.ok && !data.error) {
            success = true;
            break; 
          }
        } catch (innerError) {
          console.error(`💥 Gangguan Jaringan pada ${currentConfig.name}:`, innerError);
        }
      }

      if (!success) {
        setAiAnalysis("⚠️ Server Google Gemini sedang overload massal atau kuota habis. Silakan coba beberapa saat lagi.");
        return;
      }

      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
      if (!aiText) {
        setAiAnalysis("[Error System]: Server terhubung namun mengembalikan struktur teks kosong.");
        return;
      }

      parseRealAIPayload(aiText);
    } catch (error) {
      console.error("Critical Scanning Network Failure:", error);
      setAiAnalysis("[Network Error]: Gagal mengirimkan berkas gambar ke server Gemini.");
    } finally {
      setIsLoading(false);
    }
  };

  // --- 💬 CHATBOT HUB METHOD ---
  const handleSendChat = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    const updatedMessages = [...chatMessages, { sender: 'user', text: query }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    const keysPool = [
      import.meta.env.VITE_GEMINI_API_KEY,
      import.meta.env.VITE_GEMINI_API_KEY_BACKUP,
      import.meta.env.VITE_GEMINI_KEY_BACKUP2,
      import.meta.env.VITE_GEMINI_KEY_BACKUP3
    ];

    let aiReply = "";
    let success = false;

    const chatPayload = {
      contents: [{
        parts: [{ text: "Anda adalah Asisten Klinis cerdas untuk aplikasi kesehatan GlycoFlow AI. Jawablah dengan ringkas: " + query }]
      }]
    };

    for (let i = 0; i < keysPool.length; i++) {
      const activeKey = keysPool[i];
      if (!activeKey) continue;

      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/generateContent?key=${activeKey}`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(chatPayload)
        });
        const data = await response.json();

        if (response.ok && !data.error && data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiReply = data.candidates[0].content.parts[0].text;
          success = true;
          break;
        }
      } catch (err) {
        console.error("Chat network block:", err);
      }
    }

    if (!success) {
      aiReply = "Seluruh jalur konsultasi AI sedang padat kueri saat ini.";
    }

    setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    setIsChatLoading(false);
  };

  // --- 🎨 INTERFACE STYLE GENERATOR ---
  const getGradeColor = (grade) => {
    if (isLoading) return 'bg-slate-200 text-slate-400 animate-pulse';
    switch(grade) {
      case 'A': return 'bg-emerald-500/20 text-emerald-600 border border-emerald-500/30';
      case 'B': return 'bg-blue-500/20 text-blue-600 border border-blue-500/30';
      case 'C': return 'bg-amber-500/20 text-amber-600 border border-amber-500/30';
      case 'D': return 'bg-rose-500/20 text-rose-600 border border-rose-500/30 animate-pulse';
      default: return 'bg-slate-100 text-slate-500 border border-slate-200';
    }
  };

  const sugarHeight = foodImage ? Math.min(44, Math.max(5, (displaySugarGram * 1.0))) : 0;
  const sugarWidthRadius = foodImage ? Math.min(46, Math.max(15, (20 + displaySugarGram * 0.5))) : 0;

  const dynamicCellDamage = foodImage ? parseInt(metrics.cellDamage) : 0;
  const isDangerous = dynamicCellDamage > 50;

  const SectionTitle = ({ number, title }) => (
    <div className="flex items-center gap-3">
      <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center text-[10px] font-black font-mono shadow-inner group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
        {number}
      </div>
      <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono group-hover:text-slate-600 transition-colors duration-300">
        {title}
      </h3>
    </div>
  );

  return (
    /* PERUBAHAN UTAMA: Menambahkan class 'moving-gradient-bg' untuk efek tepi luar bergerak */
    <div className="min-h-screen text-slate-800 p-4 md:p-8 pt-32 custom-font antialiased relative overflow-x-hidden moving-gradient-bg">
      <Head title="Clinical Analyzer - GlycoFlow AI" />
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=400;600;700;800&display=swap');
        .custom-font { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        /* 🌌 LOGIKA ANIMASI TEPI GRADASI BERGERAK (SOFT BLUE) */
        .moving-gradient-bg {
          background-color: #F8FAFC; /* Base warna tengah tetap cerah bersih */
          position: relative;
          z-index: 1;
        }
        
        /* Pseudo-element penampung pendaran di area tepi */
        .moving-gradient-bg::before {
          content: '';
          position: fixed;
          top: -20%;
          left: -20%;
          width: 140%;
          height: 140%;
          /* Gradasi gabungan biru soft, cyan, dan indigo transparan */
          background: conic-gradient(
            from 0deg,
            rgba(59, 130, 246, 0.04) 0%,
            rgba(6, 182, 212, 0.05) 25%,
            rgba(99, 102, 241, 0.03) 50%,
            rgba(147, 197, 253, 0.05) 75%,
            rgba(59, 130, 246, 0.04) 100%
          );
          z-index: -1;
          pointer-events: none;
          filter: blur(80px); /* Melembutkan gradasi agar menyatu natural */
          animation: slowSpin 25s linear infinite; /* Putaran super lambat agar nyaman di mata */
        }

        @keyframes slowSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        /* 💎 CARD GLASSMORPHISM ENHANCED */
        .glass-card {
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(24px);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 10px 30px -10px rgba(148, 163, 184, 0.06);
          transition: all 0.4s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .glass-card:hover {
          transform: translateY(-6px);
          background: rgba(255, 255, 255, 0.96);
          border-color: rgba(59, 130, 246, 0.3);
          box-shadow: 0 20px 40px -15px rgba(59, 130, 246, 0.12);
        }
        
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 99px; }
        
        @keyframes uploadReveal {
          from { opacity: 0; transform: scale(0.97); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-upload-reveal {
          animation: uploadReveal 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}</style>

      <div className="max-w-7xl mx-auto flex flex-col gap-6 mt-4 relative z-10">
        
        {/* ================= HEADER KONTROL REAL TIME ================= */}
        <header className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5 mb-2">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase border border-blue-200/50">
              ⚡ LIVE MULTIMODAL SPECTROMETER (SMART FAILOVER POOL)
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-green-600">Glycemic spike</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className={`px-4 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-2 shadow-sm transform hover:scale-105 transition-transform duration-300`}>
              <span className={`w-2 h-2 rounded-full ${isLoading ? 'bg-amber-500 animate-pulse' : foodImage ? 'bg-emerald-400' : 'bg-slate-400'}`} />
              {isLoading ? "ANALYZING IMAGES..." : foodImage ? `${itemType} MOUNTED` : "AWAITING CAMERA IMAGE"}
            </div>
          </div>
        </header>

        {/* ================= BENTO GRID LAYOUT UTAMA ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* --- PANEL KIRI: FRAME INPUT --- */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* BOX 1: WORKSPACE CAPTURE */}
            <div className="glass-card rounded-[2rem] p-6 flex flex-col justify-between flex-1 min-h-[410px] group">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <SectionTitle number="01" title="Capture Core Workspace" />
                </div>

                <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl mb-3">
                  <button 
                    type="button" 
                    disabled={isLoading} 
                    onClick={() => { setItemType('MAKANAN'); setAlcoholPercent(0); }} 
                    className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center duration-300 ${itemType === 'MAKANAN' ? 'bg-white text-slate-900 shadow-md transform scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    🍔 Padat (Food)
                  </button>
                  <button 
                    type="button" 
                    disabled={isLoading} 
                    onClick={() => setItemType('MINUMAN')} 
                    className={`py-2 text-[10px] font-bold uppercase tracking-wider rounded-lg transition-all cursor-pointer text-center duration-300 ${itemType === 'MINUMAN' ? 'bg-white text-slate-900 shadow-md transform scale-[1.02]' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    🥤 Cair (Drink)
                  </button>
                </div>

                {/* 🍷 MENU KONDISIONAL: PERSENAN ALKOHOL */}
                {itemType === 'MINUMAN' && (
                  <div className="mb-3 px-3 py-2 bg-purple-500/5 border border-purple-500/10 rounded-xl flex justify-between items-center animate-upload-reveal hover:border-purple-500/30 transition-colors">
                    <span className="text-[9px] font-mono font-bold text-purple-700 uppercase tracking-wider flex items-center gap-1.5">
                      🍷 Alcohol Content (ABV):
                    </span>
                    <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-md transition-all duration-300 ${displayAlcohol > 0 ? 'bg-purple-600 text-white shadow-sm' : 'bg-slate-200 text-slate-500'}`}>
                      {isLoading ? 'Scanning...' : `${displayAlcohol}%`}
                    </span>
                  </div>
                )}

                {/* CONTAINER PREVIEW GAMBAR UTAMA */}
                <div className="w-full h-44 border-2 border-dashed border-slate-200 hover:border-blue-400/70 rounded-2xl relative overflow-hidden bg-white/40 flex flex-col items-center justify-center transition-all duration-300 p-2 group/upload mb-4 shadow-inner">
                  {isLoading ? (
                    <div className="text-center p-4 space-y-2 animate-pulse">
                      <div className="w-12 h-12 bg-blue-50 border border-blue-100 text-blue-500 rounded-xl flex items-center justify-center text-lg mx-auto shadow-sm animate-spin">⏳</div>
                      <p className="text-[11px] font-bold text-blue-600">Memindai Kandungan Visual...</p>
                    </div>
                  ) : foodPreview ? (
                    <div className="w-full h-full flex items-center justify-center relative animate-upload-reveal">
                      <img src={foodPreview} alt="Preview" className="w-full h-full object-contain rounded-xl" />
                      
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover/upload:opacity-100 transition-opacity flex items-center justify-center rounded-xl pointer-events-none duration-300">
                        <span className="bg-white text-[10px] font-bold text-slate-700 px-3 py-1.5 rounded-lg border shadow-md transform scale-90 group-hover/upload:scale-100 transition-transform duration-300">Ganti Gambar</span>
                      </div>

                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        title="Hapus gambar"
                        className="absolute top-3 right-3 z-30 w-8 h-8 bg-rose-500 hover:bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg transition-all transform hover:scale-110 active:scale-95 cursor-pointer duration-200"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-16v4M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div className="text-center p-4 space-y-2 pointer-events-none select-none">
                      <div className="w-10 h-10 bg-blue-50 border border-blue-100 text-blue-500 rounded-xl flex items-center justify-center text-lg mx-auto shadow-sm group-hover/upload:scale-110 group-hover/upload:bg-blue-500 group-hover/upload:text-white transition-all duration-300">📸</div>
                      <p className="text-[11px] font-bold text-slate-400 group-hover/upload:text-blue-600 transition-colors duration-300">Pilih / Ambil Foto Hidangan Asli</p>
                    </div>
                  )}
                  
                  <input 
                    type="file" 
                    disabled={isLoading} 
                    accept="image/*" 
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) { 
                        setFoodImage(file); 
                        setFoodPreview(URL.createObjectURL(file)); 
                      }
                    }} 
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-20" 
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={executeCompositeScan}
                  disabled={isLoading || !foodImage}
                  className={`w-full py-3 mb-4 rounded-xl text-xs font-mono font-black tracking-wider uppercase transition-all shadow-md active:scale-[0.98] text-center duration-300 ${
                    isLoading
                      ? 'bg-amber-500 text-white cursor-not-allowed'
                      : foodImage
                      ? 'bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-blue-600 hover:to-indigo-600 text-white cursor-pointer shadow-blue-500/10 hover:shadow-blue-500/20'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  }`}
                >
                  {isLoading ? '⏳ MENGEKSTRAKSI HISTOGRAM...' : '🔬 INTEGRASIKAN KANDUNGAN GAMBAR'}
                </button>

                <div className="space-y-2 pt-3 border-t border-slate-200/60">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-mono font-bold text-slate-400 uppercase tracking-wider">Jam Makan</label>
                    <span className="text-[10px] font-black font-mono text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/40 shadow-sm"> Pukul {eatHour}:00 </span>
                  </div>
                  <input type="range" disabled={isLoading} min="0" max="23" value={eatHour} onChange={(e) => setEatHour(Number(e.target.value))} className="w-full accent-blue-600 bg-slate-200 h-1 rounded-lg appearance-none cursor-pointer hover:bg-slate-300 transition-colors" />
                </div>
              </div>
            </div>

            {/* BOX 2: SUGAR PILE DENSITY */}
            <div className="glass-card rounded-[2rem] p-6 flex flex-col justify-between h-[210px] group">
              <div className="flex justify-between items-center border-b pb-3 border-slate-200/60">
                <SectionTitle number="02" title="Sugar Pile Density" />
                <div className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold tracking-widest transition-all duration-300 shadow-sm ${getGradeColor(foodImage ? sugarGrade : '-')}`}>
                  {isLoading ? 'CALIBRATING' : `GRADE ${foodImage ? sugarGrade : '-'}`}
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 items-center flex-1 pt-2">
                <div className="col-span-5 bg-slate-50 h-24 rounded-2xl border border-slate-200/80 flex items-end justify-center p-1 relative overflow-hidden shadow-inner group-hover:border-slate-300 transition-colors duration-300">
                  <div className="absolute top-1 left-2 text-[6px] font-mono font-bold text-slate-400 uppercase">3D Matrix</div>
                  <svg className="w-full h-full relative z-10 overflow-visible" viewBox="0 0 100 50" preserveAspectRatio="none">
                    <defs>
                      <radialGradient id="sugar3DCoreLight" cx="50%" cy="30%" r="60%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="85%" stopColor="#e2e8f0" />
                        <stop offset="100%" stopColor="#cbd5e1" />
                      </radialGradient>
                      <radialGradient id="floorShadowLight" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="rgba(30,58,138,0.15)" />
                        <stop offset="100%" stopColor="rgba(0,0,0,0)" />
                      </radialGradient>
                    </defs>
                    {foodImage && !isLoading && displaySugarGram > 0 && (
                      <>
                        <ellipse cx="50" cy="46" rx={sugarWidthRadius + 4} ry="3" fill="url(#floorShadowLight)" className="transition-all duration-1000" />
                        <path d={`M ${50 - sugarWidthRadius} 46 Q 50 ${46 - sugarHeight} 50 ${46 - sugarHeight} Q 50 ${46 - sugarHeight} ${50 + sugarWidthRadius} 46 Z`} fill="url(#sugar3DCoreLight)" className="transition-all duration-1000 drop-shadow-sm" />
                      </>
                    )}
                  </svg>
                </div>

                <div className="col-span-7 space-y-1">
                  <div className="text-xl font-extrabold text-slate-900 font-mono tracking-tight group-hover:text-blue-600 transition-colors duration-300">
                    {isLoading ? '---' : foodImage ? displaySugarGram : 0} <span className="text-xs font-normal text-slate-400 font-sans">g Gula</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-normal font-medium">
                    {!foodImage ? "Gunakan citra nyata untuk mendeteksi kandungan tumpukan gula." : "Beban glukosa dihitung real-time langsung dari porsi makro objek gambar."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* --- PANEL KANAN: PANEL TELEMETRI ASLI --- */}
          <div className="lg:col-span-8 flex flex-col justify-between gap-6">
            <div className="glass-card rounded-[2rem] p-6 flex flex-col gap-4 flex-1 group">
              <div className="border-b border-slate-200/60 pb-3 flex justify-between items-center">
                <SectionTitle number="03" title="Medical Assessment Intelligence" />
              </div>

              {/* Hasil Nama Makanan & Cell Damage */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-4 md:col-span-8 flex flex-col justify-center shadow-sm hover:border-blue-200 transition-all duration-300">
                  <span className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">HASIL IDENTIFIKASI CITRA FOTO (REAL):</span>
                  <span className="text-sm font-black text-slate-900 capitalize tracking-wide">{isLoading ? 'Menganalisis Susunan Piksel...' : foodImage ? metrics.name : '-'}</span>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 p-4 md:col-span-4 text-center flex flex-col justify-center shadow-sm hover:border-blue-200 transition-all duration-300">
                  <span className="text-[8px] font-mono text-slate-400 font-bold uppercase tracking-wider mb-1">CELL DAMAGE INDEX</span>
                  <span className={`text-xl font-mono font-black ${isLoading ? 'text-slate-300' : foodImage && isDangerous ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isLoading ? '---' : foodImage ? `${displayDamage}%` : '0%'}
                  </span>
                </div>
              </div>

              {/* Deskripsi Dampak Risiko Glikemik */}
              <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-2xl text-xs font-medium border-l-4 border-l-amber-500 flex flex-col gap-0.5 hover:bg-amber-500/10 transition-colors duration-300 shadow-sm">
                <span className="text-[9px] font-mono text-amber-700 font-bold block uppercase tracking-widest">⚠️ Karakteristik & Bahaya Glikemik:</span>
                <p className="text-slate-700">{isLoading ? 'Menakar indeks disfungsi organ perifer...' : foodImage ? metrics.marketingTrap : `Silakan masukkan foto hidangan.`}</p>
              </div>

              {/* Nutrisi Makro */}
              <div className="grid grid-cols-4 gap-3 bg-white border border-slate-100 p-4 rounded-2xl shadow-sm hover:border-slate-200 transition-colors duration-300">
                <div className="text-center p-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="text-[8px] font-mono text-slate-400 block font-bold mb-1">KALORI</span>
                  <span className="text-sm font-black font-mono text-slate-800">{isLoading ? '...' : foodImage ? displayCal : '0'}</span>
                </div>
                <div className="text-center p-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-black font-mono text-indigo-600">{isLoading ? '...' : foodImage ? displayProtein : '0'}g</span>
                  <span className="text-[8px] font-mono text-slate-400 block font-bold mb-1">PROTEIN</span>
                </div>
                <div className="text-center p-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-black font-mono text-amber-600">{isLoading ? '...' : foodImage ? displayCarbs : '0'}g</span>
                  <span className="text-[8px] font-mono text-slate-400 block font-bold mb-1">{itemType === 'MINUMAN' ? 'GLUKOSA' : 'KARBOHIDRAT'}</span>
                </div>
                <div className="text-center p-1 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className="text-sm font-black font-mono text-rose-500">{isLoading ? '...' : foodImage ? displayFat : '0'}g</span>
                  <span className="text-[8px] font-mono text-slate-400 block font-bold mb-1">LEMAK</span>
                </div>
              </div>

              {/* Grafik Kurva */}
              <div className="p-4 bg-white border border-slate-100 rounded-2xl flex flex-col gap-2 shadow-sm hover:border-slate-200 transition-colors duration-300">
                <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-wider">Kurva Proyeksi Lonjakan Glukosa Tubuh:</span>
                <div className="w-full h-14 bg-slate-50 border border-slate-100 rounded-xl overflow-hidden relative shadow-inner">
                  <svg className="w-full h-full" viewBox="0 0 200 60" preserveAspectRatio="none">
                    {foodImage && !isLoading && displaySpike > 0 && (
                      <path 
                        d={displaySpike < 100 ? "M0,45 Q50,40 100,42 T200,45" : displaySpike < 145 ? "M0,45 Q40,22 90,26 T200,40" : "M0,45 Q25,2 65,4 T200,32"} 
                        fill="none" 
                        stroke={displaySpike >= 145 ? "#f43f5e" : itemType === 'MINUMAN' ? "#f59e0b" : "#10b981"} 
                        strokeWidth="3" 
                        className="transition-all duration-1000" 
                      />
                    )}
                  </svg>
                </div>
              </div>

              {/* Lonjakan Glukosa & Langkah Solusi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm hover:border-slate-200 transition-all duration-300">
                  <div>
                    <span className="text-[8px] font-mono text-slate-400 font-bold block mb-0.5">PREDIKSI LONJAKAN GLUKOSA:</span>
                    <span className={`text-xl font-mono font-black ${isLoading ? 'text-slate-300' : foodImage && displaySpike >= 145 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {isLoading ? '---' : foodImage ? `+${displaySpike}` : '0'} <small className="text-[10px] text-slate-400 font-normal font-sans">mg/dL</small>
                    </span>
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center justify-between shadow-sm hover:bg-emerald-500/10 transition-all duration-300">
                  <span className="text-[9px] font-mono text-emerald-800 font-bold uppercase">COMPENSATORY NEAT:</span>
                  <div className="text-right">
                    <span className="text-xl font-mono font-black text-emerald-600 block leading-none">
                      {isLoading ? '---' : foodImage ? displaySteps.toLocaleString('id-ID') : 0}
                    </span>
                    <span className="text-[8px] text-emerald-500 font-bold font-mono tracking-wide uppercase">Langkah</span>
                  </div>
                </div>
              </div>

              {/* LOG ANALISIS DIAGNOSIS MEDIS UTAMA */}
              <div className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl flex items-center shadow-md relative overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-indigo-300"></div>
                <p className="text-xs leading-relaxed font-bold">
                  {isLoading ? "🩺 Menjalankan algoritma deteksi pola kalori murni..." : foodImage ? `🩺 ${aiAnalysis}` : "🩺 Menunggu suplai citra foto dari kamera workspace..."}
                </p>
              </div>

              {/* Rekomendasi Solusi Dapur */}
              <div className={`p-4 rounded-2xl text-xs font-medium border-l-4 shadow-sm transition-all duration-300 ${isLoading ? 'bg-slate-50 border-slate-100 text-slate-400' : foodImage && isDangerous ? 'bg-rose-50 border-rose-100 text-rose-700 border-l-rose-500' : 'bg-emerald-50 border-emerald-100 text-emerald-700 border-l-emerald-500'}`}>
                <span className="text-[8px] font-mono text-slate-400 block font-bold mb-0.5 tracking-wider">🧪 KITCHEN ANTIDOTE HACK:</span>
                <p className="font-semibold">{isLoading ? 'Mencari resep penawar glukosa alami...' : foodImage ? metrics.kitchenAntidote : "-"}</p>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ================= FLOATING CHATBOT UI ================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        
        {isChatOpen && (
          <div className="w-[360px] md:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300 animate-upload-reveal">
            
            <div className="bg-[#1A1F36] px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm shadow-md">🤖</div>
                <div>
                  <h3 className="text-sm font-bold">GlycoFlow Agent</h3>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span> Gemini 2.5 Flash Active
                  </p>
                </div>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-white/60 hover:text-white font-bold text-sm bg-white/10 w-7 h-7 rounded-full flex items-center justify-center transition-colors">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 chat-scrollbar bg-slate-50">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}>
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none shadow-md transform scale-[1.01]' : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'}`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isChatLoading && (
                <div className="self-start bg-white border border-slate-100 shadow-sm px-4 py-2.5 rounded-2xl rounded-tl-none text-xs text-slate-400 flex items-center gap-1.5">
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Diskusikan hasil dengan AI..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700"
              />
              <button type="submit" disabled={isChatLoading || !chatInput.trim()} className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all duration-300">Kirim</button>
            </form>

          </div>
        )}

        <button onClick={() => setIsChatOpen(!isChatOpen)} className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 hover:shadow-blue-500/20 active:scale-95 transition-all duration-300 text-2xl">💬</button>

      </div>
    </div>
  );
}