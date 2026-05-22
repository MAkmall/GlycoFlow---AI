import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Head } from '@inertiajs/react';

export default function DailyRoutineAdvisor() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // --- STATE UTAMA ---
  const [currentDay, setCurrentDay] = useState(1);
  const [userProblem, setUserProblem] = useState('');
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Selamat datang di halaman analisis rutin harian Hari ke-1! Halo, saya adalah Healthy Daily Assistant Anda. Silakan deskripsikan keluhan atau target kesehatan harian Anda untuk memulai.' }
  ]);
  const [stressTriageStatus, setStressTriageStatus] = useState('Optimal'); 
  const [isAiLoading, setIsAiLoading] = useState(false);

  // --- STATE INTERAKTIF FITUR (WIDGETS) ---
  const [waterGlasses, setWaterGlasses] = useState(0);
  const [sunlightMinutes, setSunlightMinutes] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathingText, setBreathingText] = useState('Ketuk untuk Mulai Rileks');
  const [dailyReflection, setDailyReflection] = useState('');

  // --- STATE HABIT TRACKER (CHECKBOX KARTU) ---
  const [completedTasks, setCompletedTasks] = useState({
    morningRoutine: false,
    mealTiming: false,
    hydration: false,
    sleepPrep: false,
    stretching: false,
    sunlightExposure: false
  });

  // --- STATE 6 MENU RUTINITAS (Sesuai Struktur Foto) ---
  const [dailyRoutine, setDailyRoutine] = useState({
    morningRoutine: { time: "06:00", text: "Bangun tepat waktu, lakukan hidrasi awal, dan hindari memeriksa ponsel selama 30 menit pertama." },
    mealTiming: { time: "07:30", text: "Sarapan seimbang dalam waktu 2 jam setelah bangun untuk menstabilkan kadar gula darah harian Anda." },
    hydration: { time: "12:00", text: "Penuhi kebutuhan cairan minimal 2-2.5 Liter untuk menjaga fokus sel otak dan metabolisme tubuh." },
    sleepPrep: { time: "21:00", text: "Lakukan digital detox 45 menit sebelum tidur, ganti dengan membaca buku atau meditasi ringan." },
    stretching: { time: "16:00", text: "Peregangan dinamis selama 5-10 menit untuk melenturkan otot yang kaku akibat terlalu lama duduk." },
    sunlightExposure: { time: "08:00", text: "Dapatkan paparan sinar matahari pagi langsung selama 15 menit untuk mengatur ulang jam sirkadian tubuh." }
  });

  // Kalkulasi progress persentase kepatuhan
  const totalCompleted = Object.values(completedTasks).filter(Boolean).length;
  const progressPercentage = Math.round((totalCompleted / 6) * 100);

  const toggleTask = (key) => {
    setCompletedTasks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // --- METRONOME PERNAPASAN ---
  const handleBreathingCircle = () => {
    if (isBreathing) {
      setIsBreathing(false);
      setBreathingText('Ketuk untuk Mulai Rileks');
      return;
    }
    setIsBreathing(true);
    setBreathingText('Tarik Napas... (4s)');
    
    let cycle = 0;
    const interval = setInterval(() => {
      cycle++;
      if (cycle % 2 === 1) {
        setBreathingText('Hembuskan Napas... (4s)');
      } else {
        setBreathingText('Tarik Napas... (4s)');
      }
    }, 4000);

    return () => clearInterval(interval);
  };

  // --- ENGINE UTAMA: FETCH AUTOMATIC ROUTINE VIA AI ---
  const fetchRoutineFromAi = async (inputMasalah, dayTarget, progressLalu = null, refleksiLalu = "") => {
    setIsAiLoading(true); // Memicu efek halaman blur dimulai

    let evaluasiPrompt = "";
    if (progressLalu !== null) {
      evaluasiPrompt = `User baru saja menyelesaikan Hari ke-${dayTarget - 1} dengan menyelesaikan ${progressLalu} dari 6 target rutinitas. Jurnal refleksi mereka: "${refleksiLalu}". Berikan ulasan kemajuan/evaluasi singkat di parameter "reply" JSON Anda.`;
    }

    const prompt = `Anda adalah seorang "Healthy Daily Assistant" digital yang ahli dalam optimalisasi gaya hidup harian, manajemen stres, dan ritme sirkadian biologis.
    Tugas Anda: Rancang jadwal harian interaktif untuk Hari ke-${dayTarget}.
    Kondisi/Keluhan Pengguna: "${inputMasalah}".
    ${evaluasiPrompt}

    Berikan variasi teks instruksi yang segar, interaktif, berbeda dari hari sebelumnya, namun tetap berfokus pada pemulihan kesehatan dan mood.
    Format output HARUS dalam JSON murni tanpa markdown (\`\`\`json) atau teks pengantar apa pun di luarnya:
    {
      "reply": "balasan asisten AI berupa pujian kemajuan atau solusi empati harian untuk menyambut Hari ke-${dayTarget}",
      "triage": "Optimal atau Indikasi Ringan atau Kritis",
      "morningRoutine": {"time": "06:00", "text": "instruksi taktis pagi hari"},
      "mealTiming": {"time": "07:30", "text": "instruksi nutrisi/jam makan hari ini"},
      "hydration": {"time": "12:00", "text": "instruksi pemenuhan cairan harian"},
      "sleepPrep": {"time": "21:00", "text": "ritual malam hari penenang sistem saraf sebelum tidur"},
      "stretching": {"time": "16:00", "text": "peregangan fisik/olahraga ringan penurun stres"},
      "sunlightExposure": {"time": "08:00", "text": "panduan penyerapan vitamin D matahari pagi"}
    }`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });
      const data = await response.json();
      const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text || '{}';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedResult = JSON.parse(cleanJson);

      // Menampilkan sapaan selamat datang di halaman analisis rutin baru sebelum teks balasan AI utama
      const welcomeGreeting = `Selamat datang di halaman analisis rutin harian Hari ke-${dayTarget}! ${parsedResult.reply}`;

      setMessages((prev) => [...prev, { role: 'assistant', text: welcomeGreeting }]);
      setStressTriageStatus(parsedResult.triage);
      
      // Reset status centang kartu untuk hari baru
      setCompletedTasks({
        morningRoutine: false, mealTiming: false, hydration: false, sleepPrep: false, stretching: false, sunlightExposure: false
      });

      // Update 6 Kartu Utama
      setDailyRoutine({
        morningRoutine: parsedResult.morningRoutine,
        mealTiming: parsedResult.mealTiming,
        hydration: parsedResult.hydration,
        sleepPrep: parsedResult.sleepPrep,
        stretching: parsedResult.stretching,
        sunlightExposure: parsedResult.sunlightExposure
      });

    } catch (error) {
      setMessages((prev) => [...prev, { role: 'assistant', text: `Selamat datang di halaman analisis rutin harian Hari ke-${dayTarget}! Koneksi asisten sirkadian terputus, memuat jadwal standar.` }]);
    } finally {
      setIsAiLoading(false); // Mematikan efek halaman blur (Selesai memuat)
    }
  };

  const handleRoutineAnalysis = (e) => {
    e.preventDefault();
    if (!userProblem.trim()) return;
    setMessages((prev) => [...prev, { role: 'user', text: userProblem }]);
    fetchRoutineFromAi(userProblem, currentDay);
    setUserProblem('');
  };

  // --- AUTOMATIC NEXT DAY ROUTINE SINKRONISASI ---
  const handleNextDay = () => {
    const nextDay = currentDay + 1;
    setCurrentDay(nextDay); // Angka hari di header berubah halus
    
    // Trigger AI otomatis untuk mengganti isi 6 kartu ke data Hari Selanjutnya
    fetchRoutineFromAi(
      `Melanjutkan adaptasi program gaya hidup bugar untuk Hari ke-${nextDay}`,
      nextDay,
      totalCompleted,
      dailyReflection
    );

    // Reset elemen interaktif mini harian
    setWaterGlasses(0);
    setSunlightMinutes(0);
    setDailyReflection('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pt-28 pb-20 relative overflow-x-hidden antialiased">
      <Head title={`Hari ke-${currentDay} - AI Lifestyle Planner`} />
      <Navbar />

      <main className="w-full px-4 sm:px-6 lg:px-12 flex flex-col gap-8 relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER CONTAINER */}
        <header className="border-b border-white/5 pb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>✨</span> AI Lifestyle Planner
            </h1>
            <p className="text-xs text-slate-400 mt-1">Sistem sinkronisasi beban emosional dengan manajemen kesehatan biologis secara real-time.</p>
          </div>
          
          {/* DAY STEPPER CONTROLLER */}
          <div className="flex items-center gap-3 bg-slate-900 border border-white/10 p-2 rounded-2xl shadow-lg relative z-20">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
              Hari ke - {currentDay}
            </span>
            <button 
              onClick={handleNextDay}
              disabled={isAiLoading}
              className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer disabled:opacity-50 shadow-md"
            >
              Lanjutkan ke Hari Selanjutnya ➔
            </button>
          </div>
        </header>

        {/* INTERACTION LAYOUT DENGAN WRAPPER EFEK BLUR LOADING */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start relative">
          
          {/* --- LAYER EFFECT INDIKATOR BLUR INTERAKTIF --- */}
          {isAiLoading && (
            <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-md rounded-3xl z-50 flex flex-col items-center justify-center gap-4 transition-all duration-500 border border-white/5 shadow-2xl py-40">
              <div className="w-12 h-12 border-4 border-emerald-500/20 border-t-emerald-400 rounded-full animate-spin"></div>
              <div className="text-center space-y-1">
                <p className="text-sm font-bold text-white font-mono tracking-wide">Menyelaraskan Ritme Sirkadian...</p>
                <p className="text-xs text-slate-400">Merumuskan data kesehatan terbaik untuk Hari ke-{currentDay}</p>
              </div>
            </div>
          )}

          {/* LEFT SIDE: LOG INTERAKTIF & CHAT KONSULTASI (Terkena Efek Blur Saat Loading) */}
          <div className={`xl:col-span-5 flex flex-col gap-6 transition-all duration-300 ${isAiLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            
            {/* HIDRASI & BERJEMUR LOG WIDGET */}
            <div className="bg-slate-900/60 border border-white/10 rounded-3xl p-5 grid grid-cols-2 gap-4 shadow-xl">
              <div className="bg-slate-950 border border-white/5 rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-2">
                <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-wider">💧 Hidrasi Harian</span>
                <div className="text-2xl font-black text-white">{waterGlasses} / 8 <span className="text-xs font-normal text-slate-500">Gelas</span></div>
                <button 
                  onClick={() => { setWaterGlasses(p => Math.min(p + 1, 8)); if(waterGlasses === 7) toggleTask('hydration'); }}
                  className="w-full py-1.5 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 font-bold text-[11px] rounded-lg border border-blue-500/20 transition-all cursor-pointer"
                >
                  + Minum 1 Gelas
                </button>
              </div>

              <div className="bg-slate-950 border border-white/5 rounded-2xl p-4 flex flex-col justify-between items-center text-center gap-2">
                <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-wider">🌻 Berjemur Pagi</span>
                <div className="text-2xl font-black text-white">{sunlightMinutes} / 15 <span className="text-xs font-normal text-slate-500">Menit</span></div>
                <button 
                  onClick={() => { setSunlightMinutes(p => Math.min(p + 5, 15)); if(sunlightMinutes === 10) toggleTask('sunlightExposure'); }}
                  className="w-full py-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold text-[11px] rounded-lg border border-yellow-500/20 transition-all cursor-pointer"
                >
                  + Tambah 5 Menit
                </button>
              </div>
            </div>

            {/* METRONOME RELAKSASI */}
            <div className="bg-slate-900/60 border border-white/5 rounded-3xl p-5 flex flex-col items-center justify-center h-40 shadow-xl relative overflow-hidden">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest absolute top-3 left-4">🧘 Pemandu Relaksasi Pernapasan</span>
              <div className="flex flex-col items-center justify-center gap-3 mt-3">
                <div 
                  onClick={handleBreathingCircle}
                  className={`w-14 h-14 rounded-full bg-gradient-to-tr from-emerald-500 to-cyan-400 cursor-pointer flex items-center justify-center transition-all duration-[4000ms] shadow-lg ${
                    isBreathing ? 'scale-125 animate-pulse opacity-90' : 'scale-100'
                  }`}
                >
                  <span className="text-slate-950 font-bold text-xs">💨</span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-300">{breathingText}</span>
              </div>
            </div>

            {/* CHAT FEEDBACK CONTEXT */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-md">
              <div className="p-4 bg-slate-900/80 border-b border-white/5">
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">💬 Konsultasi Kendala Hari ke-{currentDay}</span>
              </div>
              <div className="p-4 space-y-3 h-40 overflow-y-auto text-xs scrollbar-none">
                {messages.map((msg, index) => (
                  <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${msg.role === 'user' ? 'bg-emerald-500 text-slate-950 font-semibold rounded-br-none shadow-sm' : 'bg-slate-800 text-slate-300 rounded-bl-none border border-white/5'}`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={handleRoutineAnalysis} className="p-3 border-t border-white/5 bg-slate-950 flex gap-2">
                <input 
                  type="text" value={userProblem} onChange={(e) => setUserProblem(e.target.value)}
                  placeholder={`Perbarui kondisi stresmu di Hari ke-${currentDay}...`}
                  className="flex-1 bg-slate-900 border border-white/5 rounded-xl px-3.5 text-xs text-white outline-none focus:border-emerald-500 transition-all"
                />
                <button type="submit" disabled={isAiLoading} className="bg-emerald-500 text-slate-950 text-xs font-bold px-5 py-2 rounded-xl cursor-pointer disabled:opacity-50">
                  Rancang
                </button>
              </form>
            </div>

          </div>

          {/* RIGHT SIDE: DYNAMIC ATURAN JADWAL TIAP HARI (Terkena Efek Blur Saat Loading) */}
          <div className={`xl:col-span-7 flex flex-col gap-6 transition-all duration-300 ${isAiLoading ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-white/5 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
              
              {/* HEADER ROUTINE WIDGET */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">🌞</span>
                    <h3 className="text-lg font-bold text-white tracking-tight">1. Daily Routine (Hari {currentDay})</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 font-medium">Menu paling cocok untuk lifestyle.</p>
                </div>

                {/* TRACKER KEPATUHAN */}
                <div className="flex items-center gap-3 bg-slate-950 border border-white/5 px-4 py-2 rounded-2xl min-w-[160px] shadow-inner">
                  <div className="flex flex-col flex-1">
                    <span className="text-[9px] font-mono text-slate-400 font-bold uppercase">Kepatuhan Hari ini</span>
                    <span className="text-xs font-black text-white">{progressPercentage}% Selesai</span>
                  </div>
                  <div className="w-9 h-9 rounded-full border border-slate-800 flex items-center justify-center relative overflow-hidden bg-slate-900">
                    <div className="absolute bottom-0 inset-x-0 bg-emerald-500 transition-all duration-500" style={{ height: `${progressPercentage}%` }} />
                    <span className="text-[10px] font-bold relative z-10 text-white mix-blend-difference">{totalCompleted}/6</span>
                  </div>
                </div>
              </div>

              {/* LIST 6 KARTU ROUTINE UTAMA */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                {Object.entries(dailyRoutine).map(([key, item]) => {
                  const isChecked = completedTasks[key];
                  return (
                    <div 
                      key={key} 
                      onClick={() => toggleTask(key)}
                      className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col gap-2 cursor-pointer select-none ${
                        isChecked ? 'bg-emerald-950/10 border-emerald-500/20 opacity-60 shadow-inner' : 'bg-slate-950 border-white/5 hover:border-white/10'
                      }`}
                    >
                      <div className="flex justify-between items-center w-full">
                        <span className={`font-mono text-[9px] uppercase tracking-widest font-bold ${isChecked ? 'text-slate-500 line-through' : 'text-emerald-400'}`}>
                          ● {key.replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] font-mono text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-white/5">⏰ {item.time}</span>
                          <div className={`w-3.5 h-3.5 rounded border flex items-center justify-center text-[9px] ${isChecked ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-white/20'}`}>
                            {isChecked && '✓'}
                          </div>
                        </div>
                      </div>
                      <p className={`leading-relaxed font-medium ${isChecked ? 'text-slate-500 line-through' : 'text-slate-300'}`}>{item.text}</p>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* JURNAL REFLEKSI AKHIR HARI */}
            <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-5 flex flex-col gap-3 shadow-xl">
              <div>
                <span className="text-[10px] font-mono text-purple-400 font-bold uppercase tracking-wider block mb-0.5">📖 Evaluasi & Refleksi Hari ke-{currentDay}</span>
                <p className="text-[11px] text-slate-400">Tulis refleksi singkat mengenai harimu sebelum melaju ke esok hari agar AI dapat mengukur tingkat stres Anda dengan lebih baik.</p>
              </div>
              <textarea 
                value={dailyReflection}
                onChange={(e) => setDailyReflection(e.target.value)}
                placeholder="Tulis progres atau perasaan positifmu hari ini di sini..."
                className="w-full h-16 bg-slate-950 border border-white/5 rounded-xl p-3 text-xs text-white placeholder-slate-700 outline-none focus:border-purple-500 transition-all resize-none"
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}