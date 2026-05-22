import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Head } from '@inertiajs/react';

export default function AiCoach() {
  // ==========================================
  // STATE MANAGEMENT CONTROLLERS (COACHING SYSTEM)
  // ==========================================
  const [sleepHour, setSleepHour] = useState(22); 
  const [spikeWarningState, setSpikeWarningState] = useState('AMAN'); 
  const [insulinSensitivity, setInsulinSensitivity] = useState(88); 

  // ==========================================
  // STATE MANAGEMENT CHATBOT (AI BIO-COACH)
  // ==========================================
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Salam sehat! Saya AI Coach metabolik Anda. Profil sirkadian Anda menunjukkan jendela tidur optimal Anda dimulai pukul 22:00 malam untuk mereset resistensi insulin selular. Ada pola makan hari ini atau jadwal tidur yang ingin Anda konsultasikan?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Auto scroll terminal chat coach ke baris terbaru
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiTyping]);

  // Efek Reaktif slider jam tidur
  useEffect(() => {
    if (sleepHour >= 21 && sleepHour <= 23) {
      setInsulinSensitivity(92);
      setSpikeWarningState('AMAN');
    } else if (sleepHour === 0 || sleepHour === 24 || sleepHour === 1) {
      setInsulinSensitivity(54);
      setSpikeWarningState('WARNING');
    } else if (sleepHour >= 2 && sleepHour <= 5) {
      setInsulinSensitivity(35);
      setSpikeWarningState('CRITICAL');
    } else {
      setInsulinSensitivity(75);
      setSpikeWarningState('AMAN');
    }
  }, [sleepHour]);

  // ==========================================
  // 🚀 PERBAIKAN CORE: HIGH-SECURITY RESPONSIVE HANDLING API CALL
  // ==========================================
  const handleCoachChatSubmit = async (e) => {
    if (e) e.preventDefault();
    const userQuery = chatInput.trim();
    if (!userQuery) return;

    // Masukkan ketikan user ke layar reaktif
    setMessages((prev) => [...prev, { role: 'user', text: userQuery }]);
    setChatInput('');
    setIsAiTyping(true);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const systemPrompt = `Anda adalah AI Coach Klinis Senior dari GlycoFlow, spesialis kronobiologi, pola tidur sirkadian, dan manajemen lonjakan gula darah (sugar spike).
    Berikan rekomendasi makan lokal murah, jadwal tidur ideal, analisis pola tubuh, dan konsultasi ringan metabolik.
    Jaga respons Anda sangat ramah, taktis, solutif, dan maksimal hanya 2 kalimat pendek saja. Langsung ke tindakan kuratif.
    Wajib sertakan token berikut di akhir jawaban: [INSULIN: 85]`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: `${systemPrompt}\n\nPertanyaan pasien: ${userQuery}` }] }] })
      });

      const data = await response.json();
      
      // 🛡️ Deep-Object Safe Digging Engine
      let aiText = "";
      if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
        aiText = data.candidates[0].content.parts[0].text || "";
      }

      // Jika server google mengembalikan kuota habis (Error 429) atau objek kosong, aktifkan fallback instant
      if (!aiText || data.error) {
        throw new Error("Quota Exceeded / Empty Object Connection.");
      }

      // Bersihkan bungkusan token [...] dan tanda asteris bintang ganda agar UI rapi bersih
      const cleanAiText = aiText.replace(/\[.*?\]/g, '').replace(/[*#_`]/g, '').trim();
      setMessages((prev) => [...prev, { role: 'assistant', text: cleanAiText }]);

      const insulinMatch = aiText.match(/\[INSULIN:\s*(\d+)\]/i);
      if (insulinMatch && insulinMatch[1]) {
        setInsulinSensitivity(Math.min(100, Math.max(20, parseInt(insulinMatch[1]))));
      }

    } catch (error) {
      console.warn("AI Coach Interceptor Triggered: Mode Simulasi Mandiri Aktif.", error);
      // Fallback pesan jika API gagal / limit
      setMessages((prev) => [...prev, { role: 'assistant', text: "Koneksi bio-telemetri sedang diatur ulang. Tetap pertahankan ritme sirkadian Anda malam ini." }]);
    } finally {
      setIsAiTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 antialiased pt-28 pb-20 relative overflow-x-hidden selection:bg-purple-500/30 selection:text-white">
      <Head title="GlycoFlow AI - Personal AI Coach" />
      <Navbar />

      <style>{`
        @keyframes auroraPurple {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-aurora-purple {
          background: linear-gradient(-45deg, #0f172a, #2e1065, #0f172a, #1e1b4b);
          background-size: 400% 400%;
          animation: auroraPurple 25s ease infinite;
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

      {/* AMBIENT BACKGROUND */}
      <div className="fixed inset-0 bg-aurora-purple z-0 pointer-events-none" />
      <div className="fixed inset-0 cyber-grid z-0 pointer-events-none opacity-40" />

      {/* Glowing Orbs */}
      <div className="fixed top-[-20%] left-[-10%] w-200 h-200 bg-purple-600/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />
      <div className="fixed bottom-[-20%] right-[-10%] w-200 h-200 bg-fuchsia-600/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />

      <main className="relative z-10 w-full px-4 sm:px-6 lg:px-10 xl:px-12 2xl:px-16 flex flex-col gap-8">
        
        {/* DASHBOARD BAR HEADER */}
        <section className="glass-panel rounded-3xl p-6 md:p-8 flex flex-col lg:flex-row justify-between items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <div className="relative z-10 text-center lg:text-left flex-1">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-purple-500/30 bg-purple-500/10 text-[10px] font-mono text-purple-400 font-bold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
              Automated Metabolic Guidance
            </span>
            <h1 className="text-3xl md:text-4xl font-black text-white custom-font tracking-tight">
              Personal <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-fuchsia-400">AI Bio-Coach</span> Terminal
            </h1>
          </div>
          
          <div className="relative z-10 px-5 py-2 bg-slate-900/50 border border-slate-700 rounded-2xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-purple-500 animate-ping absolute" />
            <div className="w-2 h-2 rounded-full bg-purple-500 relative" />
            <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase">Mentorship Active</span>
          </div>
        </section>

        {/* FULL WIDTH SPLIT LAYOUT */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-stretch">
          
          {/* ==========================================
              LEFT COL: VITALS & SLEEP TRACKER
             ========================================== */}
          <div className="xl:col-span-4 flex flex-col gap-8">
            
            {/* SLEEP SCHEDULE CARD */}
            <div className="glass-panel rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
              </div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 text-purple-400 flex items-center justify-center font-bold font-mono">01</div>
                  <div>
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Circadian Sync</h3>
                    <h4 className="text-xl font-black text-white custom-font">Jadwal Tidur</h4>
                  </div>
                </div>

                <div className="bg-slate-900/40 border border-slate-700/50 rounded-2xl p-5 mb-5 backdrop-blur-md">
                  <div className="flex justify-between items-end mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Target Malam Ini:</span>
                    <span className="text-xl font-black font-mono text-purple-400">
                      {sleepHour}:00 {sleepHour >= 21 && sleepHour <= 23 ? '🌙' : '⚠️'}
                    </span>
                  </div>
                  <input 
                    type="range" min="0" max="23" 
                    value={sleepHour} 
                    onChange={(e) => setSleepHour(parseInt(e.target.value))} 
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400 transition-all"
                  />
                  <div className="flex justify-between mt-2 text-[9px] font-mono text-slate-500">
                    <span>00:00</span>
                    <span>12:00</span>
                    <span>23:00</span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-purple-900/20 border border-purple-500/20 p-4 rounded-2xl shadow-inner">
                  <span className="text-xs font-bold text-purple-200">Proyeksi Sensitivitas Insulin:</span>
                  <span className="text-xl font-black text-purple-400 font-mono">{insulinSensitivity}%</span>
                </div>
              </div>
            </div>

            {/* EARLY WARNING SYSTEM CARD */}
            <div className={`glass-panel rounded-3xl p-6 relative transition-all duration-500 border-t-4 ${
              spikeWarningState === 'CRITICAL' ? 'border-t-rose-500 bg-rose-900/10' : spikeWarningState === 'WARNING' ? 'border-t-amber-500 bg-amber-900/10' : 'border-t-emerald-500 bg-emerald-900/10'
            }`}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-600 text-white flex items-center justify-center font-bold font-mono">02</div>
                <div>
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 font-mono">Peringatan Dini</h3>
                  <h4 className="text-xl font-black text-white custom-font">Sugar Spike Warning</h4>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/50 rounded-2xl p-5 mb-4 flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono font-bold uppercase text-slate-400 block mb-1">Status Glikemik:</span>
                  <h3 className={`text-xl font-black font-mono tracking-tight ${
                    spikeWarningState === 'CRITICAL' ? 'text-rose-400 animate-pulse' : spikeWarningState === 'WARNING' ? 'text-amber-400' : 'text-emerald-400'
                  }`}>
                    {spikeWarningState === 'CRITICAL' ? '🚨 KRITIS' : spikeWarningState === 'WARNING' ? '⚠️ BERISIKO' : '✅ AMAN'}
                  </h3>
                </div>
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] ${
                  spikeWarningState === 'CRITICAL' ? 'bg-rose-500/20 text-rose-500' : spikeWarningState === 'WARNING' ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/20 text-emerald-500'
                }`}>
                  {spikeWarningState === 'CRITICAL' ? '❌' : spikeWarningState === 'WARNING' ? '⚡' : '🛡️'}
                </div>
              </div>

              <p className="text-xs font-medium leading-relaxed text-slate-300 p-3 bg-white/5 rounded-xl border border-white/5">
                {spikeWarningState === 'CRITICAL' ? "Peringatan Coach: Jadwal tidur terlalu larut menurunkan toleransi glukosa tubuh hingga 40% esok hari. Hindari makanan berat!" :
                 spikeWarningState === 'WARNING' ? "Analisis Pola Tubuh: Begadang memicu pelepasan hormon kortisol berlebih yang memblokir fungsi kerja insulin." :
                 "Rekomendasi Coach: Ritme sirkadian tubuh terjaga sempurna. Ambil opsi tidur awal malam ini untuk membakar lemak viseral."}
              </p>
            </div>
            
          </div>

          {/* ==========================================
              RIGHT COL: CHATBOT TERMINAL
             ========================================== */}
          <div className="xl:col-span-8 flex flex-col h-full">
            <div className="glass-panel rounded-3xl flex flex-col h-175 border border-slate-700/50 relative overflow-hidden">
              
              {/* Terminal Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-purple-600 to-fuchsia-600 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(147,51,234,0.3)]">
                    🤖
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white custom-font">AI Coach Core</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest font-bold">Online & Listening</span>
                    </div>
                  </div>
                </div>
                <div className="hidden sm:flex px-3 py-1.5 bg-white/5 rounded-lg border border-white/10 text-[9px] font-mono text-slate-400 tracking-wider">
                  MODEL: GEMINI 1.5 FLASH ENGINE
                </div>
              </div>

              {/* Chat Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-600 scrollbar-track-transparent">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] p-4 rounded-2xl text-sm font-medium leading-relaxed shadow-lg ${
                      msg.role === 'user' 
                        ? 'bg-purple-600/80 text-white border border-purple-500/50 rounded-br-sm' 
                        : 'bg-slate-800/80 text-slate-200 border border-slate-600/50 rounded-bl-sm'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                {isAiTyping && (
                  <div className="flex justify-start">
                    <div className="p-4 bg-slate-800/80 border border-slate-600/50 rounded-2xl rounded-bl-sm flex gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }}/>
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '150ms' }}/>
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '300ms' }}/>
                    </div>
                  </div>
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-5 bg-slate-900/80 border-t border-white/5">
                <form onSubmit={handleCoachChatSubmit} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
                  </div>
                  <input 
                    type="text" 
                    value={chatInput} 
                    onChange={(e) => setChatInput(e.target.value)} 
                    disabled={isAiTyping}
                    placeholder="Tanyakan jadwal tidur, efek begadang, atau makanan pengganti..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-2xl pl-12 pr-16 py-4 text-sm font-medium outline-none text-white focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition-all shadow-inner"
                  />
                  <button 
                    type="submit" 
                    disabled={isAiTyping} 
                    className="absolute right-2 top-2 bottom-2 w-12 bg-purple-600 hover:bg-purple-500 text-white rounded-xl flex items-center justify-center transition-all disabled:opacity-50 shadow-[0_0_15px_rgba(147,51,234,0.3)]"
                  >
                    <svg className="w-5 h-5 translate-x-px" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path></svg>
                  </button>
                </form>
              </div>
              
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}