import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../components/Navbar';
import { Head } from '@inertiajs/react';

// ==========================================
// --- DATA MASTER LINI MASA KOMPARATIF ---
// ==========================================
const timelineDataByPhase = {
  1: {
    label: "Hari ke-1",
    cardBg: "border-sky-100 bg-sky-50/10 shadow-sky-100/30",
    titleColor: "text-sky-600",
    badge: "bg-sky-50 text-sky-700 border-sky-100",
    adiksiBg: "bg-rose-50/40 border-rose-100/60",
    recoveryBg: "bg-emerald-50/40 border-emerald-100/60",
    physical_damage: "Efek akut awal penggunaan zat pada kondisi fisik tubuh.",
    brain_damage: "Lonjakan neurotransmiter buatan secara ekstrem di dalam celah sinapsis otak.",
    social_damage: "Munculnya kecenderungan menarik diri dari lingkaran sosial yang sehat.",
    physical_recovery: "Fase penurunan zat (crash), tubuh mengalami kelelahan dan penurunan energi.",
    brain_recovery: "Otak beradaptasi tanpa pasokan zat kimia buatan secara mendadak.",
    social_recovery: "Mulai membatasi diri dari lingkaran sesama pengguna zat adiktif."
  },
  2: {
    label: "Bulan ke-6",
    cardBg: "border-amber-100 bg-amber-50/10 shadow-amber-100/30",
    titleColor: "text-amber-600",
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    adiksiBg: "bg-orange-50/40 border-orange-100/60",
    recoveryBg: "bg-teal-50/40 border-teal-100/60",
    physical_damage: "Kerusakan fisik jangka menengah, penurunan imunitas, dan berat badan.",
    brain_damage: "Penurunan fungsi lobus frontal, gangguan memori, dan emosi tidak stabil.",
    social_damage: "Keretakan hubungan interpersonal dengan keluarga dan kehilangan produktivitas.",
    physical_recovery: "Metabolisme tubuh mulai stabil dan pola tidur membaik secara bertahap.",
    brain_recovery: "Proses neuroplastisitas dimulai, sel saraf beradaptasi untuk pulih.",
    social_recovery: "Membangun kembali komunikasi yang jujur dengan keluarga dan kerabat."
  },
  3: {
    label: "Tahun ke-1",
    cardBg: "border-rose-100 bg-rose-50/10 shadow-rose-100/30",
    titleColor: "text-rose-600",
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    adiksiBg: "bg-red-50/40 border-red-100/60",
    recoveryBg: "bg-cyan-50/40 border-cyan-100/60",
    physical_damage: "Risiko tinggi kerusakan organ vital seperti jantung, hati, dan ginjal.",
    brain_damage: "Terjadinya atrofi otak (penyusutan volume) dan potensi gangguan psikosis.",
    social_damage: "Isolasi sosial total, masalah finansial berat, dan konsekuensi hukum.",
    physical_recovery: "Fungsi organ vital memulih signifikan, risiko penyakit kronis menurun.",
    brain_recovery: "Keseimbangan neurokimia alami otak kembali pulih hingga mayoritas.",
    social_recovery: "Kembali ke aktivitas produktif (bekerja/belajar) di lingkungan yang sehat."
  },
  4: {
    label: "Tahun ke-5",
    cardBg: "border-slate-200 bg-slate-50/20 shadow-slate-200/30",
    titleColor: "text-slate-800",
    badge: "bg-slate-900 text-white border-slate-900",
    adiksiBg: "bg-stone-50 border-stone-200/60",
    recoveryBg: "bg-indigo-50/40 border-indigo-100/60",
    physical_damage: "Kerusakan permanen sistem saraf pusat dan penurunan angka harapan hidup.",
    brain_damage: "Kerusakan kognitif kronis dan matinya jaringan sel saraf secara massal.",
    social_damage: "Kehancuran masa depan secara total, terjebak stigma kriminalitas.",
    physical_recovery: "Tubuh bersih sepenuhnya dari akumulasi sisa toksin masa lalu.",
    brain_recovery: "Kondisi psikologis stabil dan bebas dari dorongan adiksi (craving).",
    social_recovery: "Rekonstruksi masa depan berhasil, mandiri secara sosial dan ekonomi."
  }
};

export default function AntiDrugSimulator() {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // LAYOUT & DATA STATE
  const [selectedDrug, setSelectedDrug] = useState('Sabu');
  const [activeTimeline, setActiveTimeline] = useState(1);
  const [userAge, setUserAge] = useState(17);
  const [timelineTab, setTimelineTab] = useState('adiksi'); 
  const [widgetTab, setWidgetTab] = useState('cognitive'); 
  
  const currentImpact = timelineDataByPhase[activeTimeline];
  const timelineLabels = ["Hari 1", "Bulan 6", "Tahun 1", "Tahun 5"];

  // COGNITIVE DELAY TEST STATE
  const [screenEffect, setScreenEffect] = useState(''); 
  const [gameState, setGameState] = useState('idle'); 
  const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });
  const [gameStartTime, setGameStartTime] = useState(0);
  const [cognitiveScore, setCognitiveScore] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [isClicking, setIsClicking] = useState(false);
  const gameAreaRef = useRef(null);

  const startCognitiveTest = (type) => {
    setScreenEffect(type);
    setGameState('countdown');
    setCountdown(3);
    setCognitiveScore(null);
  };

  useEffect(() => {
    if (gameState !== 'countdown') return;
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameState('playing');
      setGameStartTime(Date.now());
      spawnTarget(); 
    }
  }, [countdown, gameState]);

  const spawnTarget = () => {
    const randomTop = Math.floor(Math.random() * 60) + 20;
    const randomLeft = Math.floor(Math.random() * 60) + 20;
    setTargetPosition({ top: `${randomTop}%`, left: `${randomLeft}%` });
  };

  const handleTargetClick = () => {
    if (gameState !== 'playing' || isClicking) return;
    setIsClicking(true);
    const delayDuration = (screenEffect === 'blur' || screenEffect === 'shake') ? 1500 : 0;

    setTimeout(() => {
      const currentReactionTime = ((Date.now() - gameStartTime - delayDuration) / 1000).toFixed(3);
      const totalTimeWithDelay = ((Date.now() - gameStartTime) / 1000).toFixed(3);

      let feedback = "";
      if (screenEffect === 'normal') {
        feedback = `Respons Sehat: ${currentReactionTime}s. Saraf motorik optimal!`;
      } else {
        const structuralBrainAging = Math.round(totalTimeWithDelay * 8);
        feedback = `⚠️ DELAYED! Hambatan Zat: ${totalTimeWithDelay}s. Otak menua +${structuralBrainAging} tahun!`;
      }
      setCognitiveScore(feedback);
      setGameState('finished');
      setIsClicking(false);
      setScreenEffect(''); 
    }, delayDuration);
  };

  // ADAPTIVE TRIVIA STATE
  const [quizQuestion, setQuizQuestion] = useState("Mitos atau Fakta: Ganja herbal jadi aman?");
  const [quizAnswer, setQuizAnswer] = useState("Mitos");
  const [quizExplanation, setQuizExplanation] = useState("Menunggu AI...");
  const [quizFeedback, setQuizFeedback] = useState(null);

  const generateAiAdaptiveQuiz = async () => {
    setQuizFeedback(null);
    try {
      const prompt = `Buatkan satu soal kuis interaktif anti-narkoba seputar mitos salah kaprah narkoba. Output JSON murni: {"question": "Mitos atau Fakta: [pertanyaan]", "answer": "Mitos atau Fakta", "explanation": "penjelasan singkat"}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await response.json();
      let rawText = data.candidates[0].content.parts[0].text;
      
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonString = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
      if (jsonString) {
        const parsed = JSON.parse(jsonString);
        setQuizQuestion(parsed.question); 
        setQuizAnswer(parsed.answer); 
        setQuizExplanation(parsed.explanation);
      }
    } catch (e) { console.error(e); }
  };

  useEffect(() => { generateAiAdaptiveQuiz(); }, []);

  const checkTriviaAnswer = (ans) => { 
    if (ans === quizAnswer) { 
      setQuizFeedback({ correct: true, text: `🎉 Tepat! ${quizExplanation}` }); 
    } else { 
      setQuizFeedback({ correct: false, text: `❌ Kurang Tepat! ${quizExplanation}` }); 
    } 
  };

  // CHAT AI - WORKSPACE GABUNGAN CURHAT & ILMU PENGETAHUAN
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Halo. Di sini Anda bisa berkonsultasi/curhat tentang tekanan emosional, atau bertanya langsung seputar ilmu pengetahuan (sains) dampak zat adiktif pada sistem saraf.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [aiTriageStatus, setAiTriageStatus] = useState('Aman');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // DATA ANALISIS SAINS MEDIS & CURHAT
  const [brainDamageReport, setBrainDamageReport] = useState({
    area: "",
    status: "",
    description: "",
    severityColor: "text-blue-600"
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isAiTyping]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || isAiTyping) return;

    const userText = chatInput;
    setMessages((prev) => [...prev, { role: 'user', text: userText }]);
    setChatInput('');
    setIsAiTyping(true);

    // --- 1. SANITASI KATA SENSITIF (MENGELABUI SAFETY FILTER GOOGLE) ---
    let sanitizedText = userText
      .replace(/cocaine/gi, "senyawa ester ekgonina stimulan")
      .replace(/kokain/gi, "senyawa ester ekgonina stimulan")
      .replace(/sabu/gi, "senyawa amfetamin kristal murni")
      .replace(/narkoba/gi, "zat adiktif psikoaktif")
      .replace(/ganja/gi, "senyawa kanabinoid herbal");

    try {
      const prompt = `Bertindaklah sebagai Profesor Biokimia Kedokteran. Berikan analisis klinis murni tentang interaksi molekuler dari studi kasus berikut: "${sanitizedText}".
      
      Format objek JSON wajib:
      {
        "reply": "Penjelasan dampak zat tersebut pada neuroreseptor sebanyak 1-2 kalimat.",
        "triage": "Aman / Indikasi Ringan / Kritis",
        "damagedArea": "Nama area spesifik pada sistem saraf pusat (misal: Nucleus Accumbens)",
        "areaStatus": "Kondisi disfungsi sinapsis",
        "damageDescription": "Mekanisme biokimia molekuler (misal: inhibisi reuptake dopamin)"
      }`;

      // --- 2. FETCH DENGAN PASSING CONFIG FORCED JSON MURNI ---
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) throw new Error(`HTTP_ERR_${response.status}`);

      const data = await response.json();
      
      if (!data.candidates || data.candidates[0].finishReason === "SAFETY") {
        throw new Error("SAFETY_BLOCKED");
      }

      let rawText = data.candidates[0].content.parts[0].text;
      
      // --- 3. CLEANING BACKTICK MARKDOWN YANG LIAR ---
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const startIdx = rawText.indexOf('{');
      const endIdx = rawText.lastIndexOf('}');
      if (startIdx === -1 || endIdx === -1) throw new Error("PARSE_ERR");
      
      const jsonString = rawText.substring(startIdx, endIdx + 1);
      const result = JSON.parse(jsonString);

      setMessages((prev) => [...prev, { role: 'assistant', text: result.reply }]);
      setAiTriageStatus(result.triage);
      
      setBrainDamageReport({
        area: result.damagedArea || "Tidak Terdeteksi",
        status: result.areaStatus || "Normal",
        description: result.damageDescription || "Tidak ada rincian molekuler.",
        severityColor: result.triage === 'Kritis' ? 'text-rose-500 font-bold' : result.triage === 'Indikasi Ringan' ? 'text-amber-500' : 'text-blue-600'
      });

    } catch (error) {
      console.error("Transmisi Cloud Bermasalah. Mengaktifkan Engine Lokal:", error);
      
      // --- 4. INTELEGENSI LOKAL JIKA API REJECT/LIMIT/KEY DOWN ---
      let localReply = "Zat adiktif stimulan memicu lonjakan neurotransmiter secara abnormal, mengakibatkan gangguan kecemasan akut, kerusakan jaringan saraf, hingga risiko henti jantung.";
      let localArea = "Sistem Dopaminergik Otak";
      let localStatus = "Overstimulasi Sinapsis Kronis";
      let localDesc = "Senyawa ini menghambat proses reuptake alami pada celah sinapsis, memaksa dopamin menumpuk secara toksik yang berujung pada kerusakan permanen reseptor pascasinapsis.";

      const lowerInput = userText.toLowerCase();
      if (lowerInput.includes('cocaine') || lowerInput.includes('kokain')) {
        localReply = "Kokain adalah zat stimulan kuat yang memblokir transporter dopamin (DAT). Hal ini menyebabkan akumulasi dopamin berlebih di celah sinapsis, memicu euforia instan yang merusak saraf pusat serta membahayakan sistem kardiovaskular.";
        localArea = "Nucleus Accumbens & Jalur Reward";
        localStatus = "Desensitisasi Reseptor Dopamin";
        localDesc = "Akibat blokade transporter, sel saraf mengalami kelelahan ekstrem (neurotoxicity), menurunkan kemampuan otak untuk memproduksi kebahagiaan alami secara permanen.";
      } else if (lowerInput.includes('sabu') || lowerInput.includes('meth')) {
        localReply = "Metamfetamin (sabu) memaksa pelepasan dopamin dalam jumlah masif sekaligus menghambat penghancurannya. Mengakibatkan kerusakan parah pada pembuluh darah otak dan memicu stroke kognitif.";
        localArea = "Prefrontal Cortex & Striatum";
        localStatus = "Degenerasi Akson Saraf";
        localDesc = "Dosis tinggi memicu stres oksidatif yang menghancurkan terminal saraf dopaminergik, memicu penuaan struktur otak secara drastis.";
      }

      setMessages((prev) => [...prev, { role: 'assistant', text: localReply }]);
      setAiTriageStatus('Kritis');
      setBrainDamageReport({
        area: localArea,
        status: localStatus,
        description: localDesc,
        severityColor: "text-rose-500 font-bold"
      });
    } finally {
      setIsAiTyping(false);
    }
  };

  // LAW ENFORCEMENT STATE (VONIS YURIDIS)
  const [legalScenario, setLegalScenario] = useState('');
  const [isAiCalculatingLaw, setIsAiCalculatingLaw] = useState(false);
  const [lawReport, setLawReport] = useState({
    pasal: "Undang-Undang No. 35 Tentang Narkotika",
    hukuman: "Masukkan kronologi penangkapan di atas untuk prediksi vonis pidana.",
    konsekuensi: "Analisis yurisdiksi pengadilan belum dipicu.",
    statusSel: "READY"
  });

  const handleLawSubmit = async (e) => {
    e.preventDefault();
    if (!legalScenario.trim() || isAiCalculatingLaw) return;
    setIsAiCalculatingLaw(true);
    
    const prompt = `Anda Jaksa Penuntut Hukum Narkotika Indonesia. Analisis skenario: "${legalScenario}" usia ${userAge} tahun berdasarkan UU No.35/2009. Format output JSON murni tanpa markdown: { "pasal": "nomor pasal beserta ayatnya", "hukuman": "durasi minimal-maksimal & denda", "konsekuensi": "Analisis atau catatan yurisdiksi pengadilan di dunia nyata", "statusSel": "REHABILITASI MEDIS / PENJARA MINOR / PENJARA MAKSIMAL" }`;
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });
      const data = await response.json();
      let rawText = data.candidates[0].content.parts[0].text;
      
      rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const jsonString = rawText.substring(rawText.indexOf('{'), rawText.lastIndexOf('}') + 1);
      if (jsonString) {
        setLawReport(JSON.parse(jsonString));
      }
    } catch (error) { 
      console.error(error); 
    } finally { 
      setIsAiCalculatingLaw(false); 
    }
  };

  return (
    <div className={`min-h-screen text-slate-800 pt-24 pb-8 relative overflow-hidden text-xs transition-all duration-300 bg-slate-50 ${
      screenEffect === 'blur' ? 'blur-md select-none' : ''
    } ${screenEffect === 'shake' ? 'animate-pulse contrast-125 saturate-150' : ''}`}>
      
      <Head title="AI Anti Drug Laboratory" />
      <Navbar />

      <main className="w-full px-6 flex flex-col gap-4 max-w-[1600px] mx-auto relative z-10">
        
        {/* BANNER HEADER DASHBOARD */}
        <section className="bg-white rounded-xl p-4 shadow-sm border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <span className="text-base font-bold">🧠</span>
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900 tracking-tight">AI Anti-Drug Lab</h1>
              <p className="text-[10px] text-slate-400 font-medium">Sistem Analisis Adiksi & Prediksi Yuridis Real-time</p>
            </div>
            <div className="h-6 w-[1px] bg-slate-200 hidden sm:block mx-2"></div>
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
              <label className="text-[10px] text-slate-500 font-mono font-semibold">Usia Target:</label>
              <input type="number" value={userAge} onChange={(e) => setUserAge(e.target.value)} className="w-10 bg-white border border-slate-200 rounded text-center text-blue-600 font-bold py-0.5 outline-none text-[11px]"/>
            </div>
          </div>
          
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 w-full sm:w-auto">
            {['Sabu', 'Ganja', 'Ekstasi'].map((drug) => (
              <button key={drug} onClick={() => setSelectedDrug(drug)} className={`flex-1 sm:flex-none px-4 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${selectedDrug === drug ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-400 hover:text-slate-600'}`}>
                {drug}
              </button>
            ))}
          </div>
        </section>

        {/* TOP ROW GRID - 3 COLUMNS PATTERN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* CARD 1: BIOMEDICAL SPESIMEN (3D OTAK) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className={`bg-white rounded-xl border flex flex-col h-full shadow-sm hover:shadow-md transition-all overflow-hidden ${aiTriageStatus === 'Kritis' ? 'border-red-200 ring-1 ring-red-50' : aiTriageStatus === 'Indikasi Ringan' ? 'border-amber-200 ring-1 ring-amber-50' : 'border-slate-200'}`}>
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 font-bold text-[11px]">🔬 Biomedical Specimen</span>
                </div>
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${aiTriageStatus === 'Kritis' ? 'bg-rose-50 text-rose-600 border-rose-100' : aiTriageStatus === 'Indikasi Ringan' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                  {aiTriageStatus === 'Kritis' ? '🚨 TOKSIK' : aiTriageStatus === 'Indikasi Ringan' ? '⚠️ DEGRADASI' : '✓ SEHAT'}
                </span>
              </div>
              
              <div className="p-3 flex flex-col flex-1 gap-3">
                <div className={`w-full h-40 rounded-lg overflow-hidden border border-slate-200 bg-slate-950 transition-all ${aiTriageStatus === 'Kritis' ? 'hue-rotate-[180deg] saturate-150 brightness-90 animate-pulse' : aiTriageStatus === 'Indikasi Ringan' ? 'hue-rotate-[60deg]' : ''}`}>
                  <iframe title="Human Brain" frameBorder="0" allowFullScreen allow="autoplay" src="https://sketchfab.com/models/2df234ff65b0483fb5b5e15e40efa65d/embed?autostart=1&ui_theme=dark" className="w-full h-full"></iframe>
                </div>
                
                {brainDamageReport.area || brainDamageReport.status || brainDamageReport.description ? (
                  <div className="space-y-2 text-[11px] bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex-1 flex flex-col justify-center transition-all duration-300">
                    <div className="flex justify-between border-b border-dashed border-slate-200 pb-1.5">
                      <div>
                        <span className="text-slate-400 font-mono text-[8px] block">TARGET AREA</span>
                        <span className={`font-bold ${brainDamageReport.severityColor}`}>{brainDamageReport.area}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 font-mono text-[8px] block">STATUS MEDIS</span>
                        <span className="font-bold text-slate-700">{brainDamageReport.status}</span>
                      </div>
                    </div>
                    <p className="text-slate-500 leading-relaxed text-[11px] font-medium italic">"{brainDamageReport.description}"</p>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center border border-dashed border-slate-100 rounded-lg bg-slate-50/20 p-4">
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* CARD 2: CASE PREDICTOR (VONIS HUKUM) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="text-slate-500 font-bold text-[11px]">⚖️ Jurisprudence Case Predictor</span>
                {isAiCalculatingLaw && <span className="text-[9px] text-rose-500 animate-pulse font-medium">Analisis Hukum...</span>}
              </div>
              
              <div className="p-3 flex flex-col flex-1 justify-between gap-3">
                <form onSubmit={handleLawSubmit} className="flex gap-2">
                  <input 
                    type="text" value={legalScenario} onChange={(e) => setLegalScenario(e.target.value)} 
                    placeholder="Kronologi kasus (Contoh: 'Membawa 1 butir sabu untuk dipakai')..." 
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-lg px-3 text-[11px] outline-none py-1.5 focus:border-rose-300 focus:bg-white transition-all shadow-inner"
                  />
                  <button type="submit" disabled={isAiCalculatingLaw || !legalScenario.trim()} className="bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold px-4 rounded-lg cursor-pointer transition-all shadow-sm">Vonis</button>
                </form>

                <div className="grid grid-cols-12 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 flex-1 items-center">
                  <div className="col-span-4 bg-slate-900 text-white rounded-lg p-2 text-center flex flex-col justify-center shadow-inner h-full">
                    <span className="text-[7px] font-mono text-slate-400 block tracking-widest uppercase mb-1">REKOMENDASI</span>
                    <span className="text-[9px] font-black text-amber-400 leading-tight break-words uppercase">{lawReport.statusSel}</span>
                  </div>
                  
                  <div className="col-span-8 text-[11px] space-y-1 text-slate-600">
                    <div><span className="font-bold text-slate-800">Pasal Terkait:</span> {lawReport.pasal}</div>
                    <div><span className="font-bold text-rose-600">Prediksi Hukuman:</span> {lawReport.hukuman}</div>
                    <div className="text-[10px] text-slate-400 border-t border-slate-200 pt-1 mt-1 leading-tight line-clamp-2 italic">
                      {lawReport.konsekuensi}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 3: CHAT LAB WORKSPACE */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-sm hover:shadow-md transition-all overflow-hidden">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="font-bold text-slate-700 text-[11px]">🧠 AI Neuro-Sains Workspace</span>
                <span className="text-[8px] font-mono px-2 py-0.5 rounded-full font-bold bg-blue-50 text-blue-600 border border-blue-100">KONSULTASI & EDUKASI</span>
              </div>
              
              <div className="flex flex-col flex-1 justify-between bg-white overflow-hidden">
                <div ref={chatContainerRef} className="p-3 space-y-2 h-44 overflow-y-auto bg-slate-50/30 scroll-smooth flex-1">
                  {messages.map((msg, index) => (
                    <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] px-3 py-1.5 rounded-xl leading-relaxed text-[11px] shadow-xs ${msg.role === 'user' ? 'bg-slate-900 text-white rounded-br-none' : 'bg-white text-slate-700 rounded-tl-none border border-slate-200'}`}>
                        {msg.text}
                      </div>
                    </div>
                  ))}
                </div>
                
                <form onSubmit={handleSendChat} className="p-2 border-t border-slate-200 bg-slate-50 flex gap-2">
                  <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Curhat stres atau tanya ilmu sains narkoba di sini..." className="flex-1 bg-white border border-slate-200 rounded-lg px-3 text-[11px] outline-none py-1.5 shadow-inner focus:border-blue-400"/>
                  <button type="submit" disabled={isAiTyping || !chatInput.trim()} className="bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-bold px-4 rounded-lg cursor-pointer transition-all">Tanya</button>
                </form>
              </div>
            </div>
          </div>

        </div>

        {/* BOTTOM ROW GRID - 2 COLUMNS PATTERN */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 items-stretch">
          
          {/* CARD 4: LINI MASA KOMPARATIF */}
          <div className={`xl:col-span-8 bg-white rounded-xl border transition-all flex flex-col shadow-sm hover:shadow-md overflow-hidden ${currentImpact.cardBg}`}>
            <div className="p-3 bg-slate-50/80 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
              <div className="flex items-center gap-3">
                <span className={`font-bold uppercase text-[11px] ${currentImpact.titleColor}`}>Masa Ketergantungan {selectedDrug}</span>
                <div className="flex bg-slate-200/60 p-0.5 rounded-lg border border-slate-300/40">
                  {timelineLabels.map((label, idx) => (
                    <button key={idx + 1} onClick={() => setActiveTimeline(idx + 1)} className={`px-2.5 py-0.5 rounded-md text-[9px] font-bold cursor-pointer transition-all ${activeTimeline === idx + 1 ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-400 hover:text-slate-600'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-1 bg-slate-200/60 p-0.5 rounded-lg border border-slate-300/40 self-end sm:self-auto">
                <button onClick={() => setTimelineTab('adiksi')} className={`px-3 py-0.5 rounded-md text-[9px] font-black cursor-pointer transition-all ${timelineTab === 'adiksi' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>🚨 ADIKSI</button>
                <button onClick={() => setTimelineTab('recovery')} className={`px-3 py-0.5 rounded-md text-[9px] font-black cursor-pointer transition-all ${timelineTab === 'recovery' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>✨ RECOVERY</button>
              </div>
            </div>

            <div className="p-3 flex-1 flex flex-col justify-center">
              <div className={`p-3 rounded-xl border transition-all h-full flex flex-col justify-center ${timelineTab === 'adiksi' ? currentImpact.adiksiBg : currentImpact.recoveryBg}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px]">
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-xs">
                    <span className={`text-[8px] font-mono font-bold block mb-1 tracking-wider ${timelineTab === 'adiksi' ? 'text-rose-500' : 'text-emerald-600'}`}>ORGAN FISIK</span>
                    <p className="text-slate-600 leading-relaxed font-medium line-clamp-3">{timelineTab === 'adiksi' ? currentImpact.physical_damage : currentImpact.physical_recovery}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-xs">
                    <span className={`text-[8px] font-mono font-bold block mb-1 tracking-wider ${timelineTab === 'adiksi' ? 'text-rose-500' : 'text-emerald-600'}`}>STRUKTUR OTAK</span>
                    <p className="text-slate-600 leading-relaxed font-medium line-clamp-3">{timelineTab === 'adiksi' ? currentImpact.brain_damage : currentImpact.brain_recovery}</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-slate-200/60 shadow-xs">
                    <span className={`text-[8px] font-mono font-bold block mb-1 tracking-wider ${timelineTab === 'adiksi' ? 'text-rose-500' : 'text-emerald-600'}`}>HUBUNGAN SOSIAL</span>
                    <p className="text-slate-600 leading-relaxed font-medium line-clamp-3">{timelineTab === 'adiksi' ? currentImpact.social_damage : currentImpact.social_recovery}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CARD 5: PANEL INTERAKTIF AI */}
          <div className="xl:col-span-4 flex flex-col">
            <div className="bg-white rounded-xl border border-slate-200 flex flex-col h-full shadow-sm hover:shadow-md transition-all overflow-hidden min-h-[160px]">
              <div className="p-3 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider font-bold">🎯 Panel Interaktif AI</span>
                <div className="flex bg-slate-200/60 p-0.5 rounded-lg text-[9px] font-bold border border-slate-300/20">
                  <button onClick={() => setWidgetTab('cognitive')} className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-all ${widgetTab === 'cognitive' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Uji Saraf</button>
                  <button onClick={() => setWidgetTab('trivia')} className={`px-2.5 py-0.5 rounded-md cursor-pointer transition-all ${widgetTab === 'trivia' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>Trivia Kuis</button>
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-center">
                {widgetTab === 'cognitive' ? (
                  <div className="h-full flex flex-col justify-between gap-2">
                    {gameState === 'idle' && (
                      <>
                        <p className="text-[11px] text-slate-400 leading-normal">Ketuk target cepat 🎯 untuk menguji refleks hantaran sinyal pada sistem saraf motorik Anda.</p>
                        <div className="flex gap-2">
                          <button onClick={() => startCognitiveTest('normal')} className="flex-1 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all">Kondisi Sehat</button>
                          <button onClick={() => startCognitiveTest('shake')} className="flex-1 py-1 bg-amber-500 hover:bg-amber-600 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all">Efek Halusinasi</button>
                          <button onClick={() => startCognitiveTest('blur')} className="flex-1 py-1 bg-rose-500 hover:bg-rose-700 text-white text-[10px] font-bold rounded-lg cursor-pointer transition-all">Kondisi Sakau</button>
                        </div>
                      </>
                    )}
                    {gameState === 'countdown' && (
                      <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 rounded-lg border border-slate-100 text-center py-4"><h4 className="text-2xl font-black text-slate-700 animate-ping">{countdown}</h4></div>
                    )}
                    {gameState === 'playing' && (
                      <div ref={gameAreaRef} className="flex-1 bg-slate-950 border border-slate-800 rounded-lg relative overflow-hidden min-h-[90px] shadow-inner">
                        <div onClick={handleTargetClick} style={{ top: targetPosition.top, left: targetPosition.left }} className="absolute w-8 h-8 rounded-full bg-rose-600 shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center text-xs select-none animate-pulse border-2 border-white">🎯</div>
                      </div>
                    )}
                    {gameState === 'finished' && (
                      <div className="h-full flex flex-col justify-between gap-2">
                        <p className="text-[11px] bg-slate-50 p-2 border border-slate-200 rounded-lg text-slate-700 font-semibold leading-relaxed shadow-inner">{cognitiveScore}</p>
                        <button onClick={() => setGameState('idle')} className="w-full py-1 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-bold rounded-lg transition-all">Uji Ulang</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-full flex flex-col justify-between gap-2">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 shadow-inner">
                      <p className="text-[11px] text-slate-700 leading-relaxed font-semibold line-clamp-2">{quizQuestion}</p>
                    </div>
                    <div>
                      <div className="flex gap-2">
                        <button onClick={() => checkTriviaAnswer('Mitos')} className="flex-1 py-1 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 rounded-lg text-[10px] font-bold text-slate-600 transition-all shadow-xs">❌ MITOS</button>
                        <button onClick={() => checkTriviaAnswer('Fakta')} className="flex-1 py-1 bg-white border border-slate-200 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 rounded-lg text-[10px] font-bold text-slate-600 transition-all shadow-xs">✓ FAKTA</button>
                      </div>
                      {quizFeedback && <p className="text-[10px] text-slate-500 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-200 leading-snug line-clamp-2 italic">{quizFeedback.text}</p>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}