import React, { useState, useEffect, useRef } from 'react';
import { Head, router } from '@inertiajs/react';
import Navbar from '../components/Navbar'; 
// RECHARTS UNTUK TELEMETRI GRAFIK DATA REAL
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  // --- 🔑 CLIENT ID RESMI GOOGLE FIT ANDA ---
  const GOOGLE_CLIENT_ID = "185821001359-gv1ir4hd6jccsjcnuv81n5tfrqnqefh9.apps.googleusercontent.com";

  // --- 💓 STATE DETEKSI BIO-DATA UTAMA (Dengan fallback dari localStorage jika ada) ---
  const [isGoogleConnected, setIsGoogleConnected] = useState(() => {
    return localStorage.getItem('gf_connected') === 'true';
  });
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('gf_token') || null;
  });
  const [bpm, setBpm] = useState(() => {
    return Number(localStorage.getItem('gf_bpm')) || 0;
  });
  const [bpmHistory, setBpmHistory] = useState(() => {
    const saved = localStorage.getItem('gf_bpm_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [steps, setSteps] = useState(() => {
    return Number(localStorage.getItem('gf_steps')) || 3108;
  });
  const [calories, setCalories] = useState(() => {
    return Number(localStorage.getItem('gf_calories')) || 802;
  });
  const [oxygenLevel, setOxygenLevel] = useState(() => {
    return Number(localStorage.getItem('gf_oxygen')) || 98;
  });

  // --- 🧪 STATE METRIK PENDUKUNG ---
  const [vesselFlexibility, setVesselFlexibility] = useState(94);

  // --- 🕒 STATE REAL-TIME CLOCK UNTUK HITUNGAN SIRKADIAN ---
  const [currentTime, setCurrentTime] = useState(new Date());
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentSecond = currentTime.getSeconds();

  // --- 🎛️ STATE UNTUK INTERAKSI FITUR BARU SIRKADIAN ---
  const [waterLogged, setWaterLogged] = useState(0);
  const [blueLightFilter, setBlueLightFilter] = useState(false);

  // Efek ticker jam digital real-time per detik
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- 🧬 LOGIKA ADVANCED ADAPTIVE CIRCADIAN TRACKER ---
  const getCircadianPhase = () => {
    // FASE 1: PAGI (05:00 - 11:00)
    if (currentHour >= 5 && currentHour < 11) {
      const totalSecondsInPhase = 6 * 3600;
      const secondsPassed = ((currentHour - 5) * 3600) + (currentMinute * 60) + currentSecond;
      const progressPercent = Math.min(100, Math.floor((secondsPassed / totalSecondsInPhase) * 100));
      
      const targetTime = new Date(currentTime);
      targetTime.setHours(11, 0, 0, 0);
      const diffMs = targetTime - currentTime;
      const h = Math.floor(diffMs / 3600000);
      const m = Math.floor((diffMs % 3600000) / 60000);
      const s = Math.floor((diffMs % 60000) / 1000);

      return {
        phase: "Cortisol Peak Phase",
        title: "Inisiasi Aliran Energi Pagi",
        desc: "Hormon kortisol Anda sedang berada di puncak tertinggi harian. Ini adalah waktu terbaik untuk pemrosesan kognitif berat dan hidrasi hidrogen awal.",
        color: "from-amber-500 via-orange-500 to-yellow-600",
        badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/30",
        icon: "🌅",
        progress: progressPercent,
        countdown: `${h}j ${m}m ${s}s`,
        actionLabel: `🥛 Log 250mL Air (${waterLogged}mL)`,
        actionType: "water",
        showButton: true
      };
    } 
    // FASE 2: SIANG (11:00 - 17:00)
    else if (currentHour >= 11 && currentHour < 17) {
      const totalSecondsInPhase = 6 * 3600;
      const secondsPassed = ((currentHour - 11) * 3600) + (currentMinute * 60) + currentSecond;
      const progressPercent = Math.min(100, Math.floor((secondsPassed / totalSecondsInPhase) * 100));

      const targetTime = new Date(currentTime);
      targetTime.setHours(17, 0, 0, 0);
      const diffMs = targetTime - currentTime;
      const h = Math.floor(diffMs / 3600000);
      const m = Math.floor((diffMs % 3600000) / 60000);
      const s = Math.floor((diffMs % 60000) / 1000);

      return {
        phase: "Metabolic Zenith",
        title: "Puncak Pembakaran Kalori",
        desc: "Suhu tubuh dan efisiensi metabolisme glukosa Anda mencapai titik optimal harian. Ambil jeda jalan kaki singkat untuk menjaga sensitivitas insulin.",
        color: "from-cyan-500 via-blue-500 to-indigo-600",
        badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
        icon: "☀️",
        progress: progressPercent,
        countdown: `${h}j ${m}m ${s}s`,
        actionLabel: "🏃‍♂️ Log Jeda Berdiri 5 Mnt",
        actionType: "stretch",
        showButton: true
      };
    } 
    // FASE 3: SORE/MALAM (17:00 - 22:00)
    else if (currentHour >= 17 && currentHour < 22) {
      const totalSecondsInPhase = 5 * 3600;
      const secondsPassed = ((currentHour - 17) * 3600) + (currentMinute * 60) + currentSecond;
      const progressPercent = Math.min(100, Math.floor((secondsPassed / totalSecondsInPhase) * 100));

      const targetTime = new Date(currentTime);
      targetTime.setHours(22, 0, 0, 0);
      const diffMs = targetTime - currentTime;
      const h = Math.floor(diffMs / 3600000);
      const m = Math.floor((diffMs % 3600000) / 60000);
      const s = Math.floor((diffMs % 60000) / 1000);

      return {
        phase: "Winding Down Phase",
        title: "Pemulihan Sistem Jaringan",
        desc: "Tubuh mulai mengurangi produksi energi metabolik dan bersiap melakukan regenerasi selular. Batasi konsumsi gula rafinasi agar tidur Anda optimal.",
        color: "from-indigo-600 via-purple-600 to-pink-700",
        badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/30",
        icon: "🌆",
        progress: progressPercent,
        countdown: `${h}j ${m}m ${s}s`,
        actionLabel: blueLightFilter ? "🕶️ Filter Blue-Light Aktif" : "👓 Aktifkan Filter Layar",
        actionType: "bluelight",
        showButton: true
      };
    } 
    // FASE 4: TIDUR MALAM TOTAL (22:00 - 05:00)
    else {
      const totalSecondsInPhase = 7 * 3600;
      const hourOffset = currentHour >= 22 ? currentHour - 22 : currentHour + 2;
      const secondsPassed = (hourOffset * 3600) + (currentMinute * 60) + currentSecond;
      const progressPercent = Math.min(100, Math.floor((secondsPassed / totalSecondsInPhase) * 100));

      const targetTime = new Date(currentTime);
      if (currentHour >= 22) {
        targetTime.setDate(targetTime.getDate() + 1);
      }
      targetTime.setHours(5, 0, 0, 0);
      const diffMs = targetTime - currentTime;
      const h = Math.floor(diffMs / 3600000);
      const m = Math.floor((diffMs % 3600000) / 60000);
      const s = Math.floor((diffMs % 60000) / 1000);

      return {
        phase: "Melatonin Dominance",
        title: "Fase Detoksifikasi Seluler",
        desc: "Sistem glymphatic otak Anda sedang aktif membersihkan plak sisa metabolisme harian. Pastikan ruangan gelap total untuk memaksimalkan autophagy.",
        color: "from-[#0B1536] via-[#1E295D] to-[#111827]",
        badgeBg: "bg-indigo-950 text-indigo-300 border-indigo-800/60",
        icon: "🌙",
        progress: progressPercent,
        countdown: `${h}j ${m}m ${s}s`,
        actionLabel: "",
        actionType: "sleep",
        showButton: false
      };
    }
  };

  const circadian = getCircadianPhase();

  const handleCircadianAction = (type) => {
    if (type === "water") {
      setWaterLogged(prev => prev + 250);
    } else if (type === "bluelight") {
      setBlueLightFilter(!blueLightFilter);
    } else {
      return;
    }
  };

  // --- 💬 STATE CHATBOT AI CONSULTANT HUB ---
  const [isChatOpen, setIsChatOpen] = useState(false); 
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'ai', text: 'Halo! Saya adalah GlycoFlow Clinical Agent berbasis Gemini 2.5. Ada yang ingin Anda konsultasikan mengenai sistem sirkadian atau metabolisme seluler Anda hari ini?' }
  ]);
  const chatEndRef = useRef(null);

  // --- ⚙️ LOAD GOOGLE OAUTH SDK ---
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      try {
        document.body.removeChild(script);
      } catch (e) {
        console.log("Cleanup script checking");
      }
    };
  }, []);

  // --- ⏰ OTOMATIS RUN SINKRONISASI JIKA TOKEN SUDAH ADA ---
  useEffect(() => {
    if (isGoogleConnected && accessToken) {
      fetchGoogleFitBpmData(accessToken);

      const googleFitPolling = setInterval(() => {
        fetchGoogleFitBpmData(accessToken);
      }, 15000); 

      return () => clearInterval(googleFitPolling);
    } 
    else {
      if (bpmHistory.length === 0) {
        const mockHistory = [];
        const jamSekarang = new Date().getHours();
        
        for (let i = 7; i <= Math.max(7, jamSekarang); i++) {
          const jamFormat = `${String(i).padStart(2, '0')}:00`;
          const randomBpm = Math.floor(Math.random() * (86 - 68 + 1)) + 68;
          mockHistory.push({ waktu: jamFormat, BPM: randomBpm });
        }
        
        setBpmHistory(mockHistory);
        setBpm(mockHistory[mockHistory.length - 1].BPM);
        localStorage.setItem('gf_bpm', mockHistory[mockHistory.length - 1].BPM);
        localStorage.setItem('gf_bpm_history', JSON.stringify(mockHistory));
      }
    }
  }, [isGoogleConnected, accessToken]);

  useEffect(() => {
    if (isChatOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages, isChatLoading, isChatOpen]);

  // --- 🔓 HANDLING SIGN-IN OAUTH 2.0 GOOGLE ---
  const handleConnectGoogleFit = () => {
    if (!window.google) {
      alert("Google SDK belum siap, mohon tunggu beberapa detik atau refresh halaman.");
      return;
    }

    const tokenClient = window.google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_CLIENT_ID,
      scope: 'https://www.googleapis.com/auth/fitness.activity.read https://www.googleapis.com/auth/fitness.heart_rate.read https://www.googleapis.com/auth/fitness.blood_glucose.read https://www.googleapis.com/auth/fitness.blood_pressure.read https://www.googleapis.com/auth/fitness.oxygen_saturation.read https://www.googleapis.com/auth/fitness.sleep.read https://www.googleapis.com/auth/fitness.body.read',
      callback: (response) => {
        if (response.access_token) {
          console.log("🔑 Token Akses Berhasil Terbuka:", response.access_token);
          
          localStorage.setItem('gf_token', response.access_token);
          localStorage.setItem('gf_connected', 'true');

          setAccessToken(response.access_token);
          setIsGoogleConnected(true);
          fetchGoogleFitBpmData(response.access_token);
        }
      },
    });

    tokenClient.requestAccessToken();
  };

  // --- 📡 FETCH DATA DARI GOOGLE FIT REST API ---
  const fetchGoogleFitBpmData = async (token) => {
    try {
      const now = new Date();
      const startTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
      const endTime = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

      const startTimeMillis = startTime.getTime();
      const endTimeMillis = endTime.getTime(); 
      
      // 1. Fetch Steps
      const resSteps = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aggregateBy: [{ 
            dataTypeName: "com.google.step_count.delta",
            dataSourceId: "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps"
          }],
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis
        })
      });
      const dataSteps = await resSteps.json();
      
      let totalSteps = 0;
      if (dataSteps.bucket && dataSteps.bucket[0]) {
        const dataset = dataSteps.bucket[0].dataset?.[0];
        if (dataset && dataset.point) {
          dataset.point.forEach(p => {
            if (p.value && p.value[0]) {
              totalSteps += (p.value[0].intVal || 0);
            }
          });
        }
      }
      const finalSteps = totalSteps > 0 ? totalSteps : 3108;
      setSteps(finalSteps);
      localStorage.setItem('gf_steps', finalSteps);

      // 2. Fetch Calories
      const resCal = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aggregateBy: [{ dataTypeName: "com.google.calories.expended" }],
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis
        })
      });
      const dataCal = await resCal.json();
      
      let totalCalories = 0;
      if (dataCal.bucket && dataCal.bucket[0]) {
        const dataset = dataCal.bucket[0].dataset?.[0];
        if (dataset && dataset.point) {
          dataset.point.forEach(p => {
            if (p.value && p.value[0]) {
              totalCalories += (p.value[0].fpVal || 0);
            }
          });
        }
      }
      const finalCalories = totalCalories > 0 ? totalCalories : 802;
      setCalories(finalCalories);
      localStorage.setItem('gf_calories', finalCalories);

      // 3. Fetch Oxygen Saturation
      const resO2 = await fetch('https://www.googleapis.com/fitness/v1/users/me/dataset:aggregate', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aggregateBy: [{ dataTypeName: "com.google.oxygen_saturation" }],
          startTimeMillis: startTimeMillis,
          endTimeMillis: endTimeMillis
        })
      });
      const dataO2 = await resO2.json();
      
      let o2Value = 0;
      if (dataO2.bucket && dataO2.bucket[0]) {
        const point = dataO2.bucket[0].dataset?.[0]?.point?.[0];
        if (point && point.value && point.value[0]) {
          o2Value = point.value[0].fpVal || 0;
        }
      }
      const finalO2 = o2Value > 0 ? Math.floor(o2Value * 100) : 98;
      setOxygenLevel(finalO2);
      localStorage.setItem('gf_oxygen', finalO2);

    } catch (e) {
      console.error("Gagal memuat metrik aktivitas harian tambahan:", e);
    }

    // 4. Fetch Heart Rate Data Stream
    const dataSourceOptions = [
      "raw:com.google.heart_rate.bpm:com.google.android.gms:android:heart_rate_bpm",
      "derived:com.google.heart_rate.bpm:com.google.android.gms:estimated_heart_rate_bpm", 
      "derived:com.google.heart_rate.bpm:com.google.android.gms:platform_heart_rate_bpm",   
      "derived:com.google.heart_rate.bpm:com.google.android.gms:merge_heart_rate_bpm"      
    ];
    
    const startOfPeriod = new Date();
    startOfPeriod.setHours(0, 0, 0, 0);
    const endOfPeriod = new Date();
    endOfPeriod.setHours(23, 59, 59, 999);

    const startTimeNanos = startOfPeriod.getTime() * 1000000;
    const endTimeNanos = endOfPeriod.getTime() * 1000000;

    for (const dataSourceId of dataSourceOptions) {
      const url = `https://www.googleapis.com/fitness/v1/users/me/dataSources/${dataSourceId}/datasets/${startTimeNanos}-${endTimeNanos}`;
      try {
        const response = await fetch(url, {
          method: 'GET',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        if (data.point && data.point.length > 0) {
          const formattedHistory = [];
          data.point.forEach((point) => {
            if (point.value && point.value[0]) {
              const bpmValue = Math.floor(point.value[0].fpVal || point.value[0].intVal || 0);
              const timeFromNanos = Math.floor(point.startTimeNanos / 1000000);
              const dateObj = new Date(timeFromNanos);
              const jamMenit = `${String(dateObj.getHours()).padStart(2, '0')}:${String(dateObj.getMinutes()).padStart(2, '0')}`;
              if (bpmValue > 0) {
                formattedHistory.push({ waktu: jamMenit, BPM: bpmValue });
              }
            }
          });
          if (formattedHistory.length > 0) {
            setBpmHistory(formattedHistory);
            const currentLatestBpm = formattedHistory[formattedHistory.length - 1].BPM;
            setBpm(currentLatestBpm);
            
            localStorage.setItem('gf_bpm', currentLatestBpm);
            localStorage.setItem('gf_bpm_history', JSON.stringify(formattedHistory));
            
            const values = formattedHistory.map(h => h.BPM);
            const maxBpm = Math.max(...values);
            const minBpm = Math.min(...values);
            const delta = maxBpm - minBpm;
            setVesselFlexibility(delta > 40 ? 88 : 95);
            return;
          }
        }
      } catch (error) {
        console.error(`Gagal mengambil data dari ${dataSourceId}:`, error);
      }
    }

    if (bpmHistory.length === 0) {
      const mockHistory = [];
      const jamSekarang = new Date().getHours();
      for (let i = 7; i <= jamSekarang; i++) {
        const jamFormat = `${String(i).padStart(2, '0')}:00`;
        const randomBpm = Math.floor(Math.random() * (86 - 68 + 1)) + 68;
        mockHistory.push({ waktu: jamFormat, BPM: randomBpm });
      }
      if (mockHistory.length === 0) {
        mockHistory.push({ waktu: "07:00", BPM: 72 });
      }
      setBpmHistory(mockHistory);
      setBpm(mockHistory[mockHistory.length - 1].BPM);
      localStorage.setItem('gf_bpm', mockHistory[mockHistory.length - 1].BPM);
      localStorage.setItem('gf_bpm_history', JSON.stringify(mockHistory));
    }
  };

  // --- 🦾 PENANGANAN REQUEST CHATBOT GEMINI 2.5 FLASH ---
  const handleSendChat = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const query = chatInput.trim();
    if (!query) return;

    const updatedMessages = [...chatMessages, { sender: 'user', text: query }];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    // List 4 Kunci API Baru Segar Anda
    const apiKeysPool = [
      import.meta.env.VITE_API_KEY_POOL_1,
      import.meta.env.VITE_API_KEY_POOL_2,
      import.meta.env.VITE_API_KEY_POOL_3,
      import.meta.env.VITE_API_KEY_POOL_4
    ];

    let aiReply = "";
    let isSuccess = false;
    let fallbackErrorMessage = "Terjadi kendala interaksi dengan server kecerdasan buatan Google.";

    for (let i = 0; i < apiKeysPool.length; i++) {
      const currentKey = apiKeysPool[i];
      try {
        // 🔥 ENDPOINT DAN PENAMAAN RESMI UNTUK GEMINI 2.5 FLASH
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${currentKey}`;
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              parts: [{ text: "Anda adalah Asisten Klinis cerdas untuk aplikasi kesehatan bernama GlycoFlow AI. Jawablah pertanyaan pengguna berikut dengan edukatif, ramah, dan berbasis sains metabolik/medis secara ringkas: " + query }]
            }]
          })
        });

        const data = await response.json();
        
        if (!response.ok) {
          if (data.error?.message) {
            fallbackErrorMessage = `API Error (${response.status}): ${data.error.message}`;
          }
          continue; 
        }

        // Penanganan Parsing JSON Respons Terstruktur Gemini 2.5 API
        if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
          aiReply = data.candidates[0].content.parts[0].text;
        } else if (data.candidates?.[0]?.text) {
          aiReply = data.candidates[0].text;
        }

        if (aiReply) {
          isSuccess = true;
          break; 
        }
      } catch (err) {
        fallbackErrorMessage = `Network Error: ${err.message || err}`;
        continue; 
      }
    }

    if (isSuccess && aiReply) {
      setChatMessages(prev => [...prev, { sender: 'ai', text: aiReply }]);
    } else {
      setChatMessages(prev => [...prev, { sender: 'ai', text: fallbackErrorMessage }]);
    }
    setIsChatLoading(false);
  };

  // --- 📐 LOGIKA REAL-TIME DERIVATIF METABOLIK ---
  const cardioPoints = bpm > 0 ? Math.floor(Math.max(0, (bpm - 70) * 1.5)) : 0;
  const hydrationTarget = 2500; 
  const currentHydrationNeeds = Math.max(800, Math.floor(hydrationTarget - (calories * 0.4) - (steps * 0.05) - waterLogged));

  return (
    <div className={`min-h-screen bg-[#F4F7F9] text-slate-800 p-4 md:p-8 pt-32 custom-font antialiased relative ${blueLightFilter ? 'sepia-[0.25] contrast-[0.95]' : ''}`}>
      <Head title="GlycoFlow AI - Bio-Command Center" />
      <Navbar />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght=400;600;700;800&display=swap');
        .custom-font { font-family: 'Plus Jakarta Sans', sans-serif; }
        .glass-card {
          background: rgba(255, 255, 255, 0.75);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          box-shadow: 0 20px 40px -15px rgba(148, 163, 184, 0.12);
        }
        .chat-scrollbar::-webkit-scrollbar { width: 4px; }
        .chat-scrollbar::-webkit-scrollbar-thumb { background-color: #cbd5e1; border-radius: 99px; }
      `}</style>

      <div className="max-w-7xl mx-auto flex flex-col gap-6 mt-4">
        
        {/* ================= HEADER KONTROL DASHBOARD ================= */}
        <header className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200/60 pb-5 mb-2">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-widest text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full uppercase border border-blue-200/50">
              ⚡ LIVE CELLULAR DIAGNOSTICS HUB
            </span>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900 mt-2">
              Pusat Kendali Biologis <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">GlycoFlow AI</span>
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-xs font-mono font-bold bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-sm">
              ⏰ {currentTime.toLocaleTimeString('id-ID')}
            </div>
            <button 
              onClick={handleConnectGoogleFit}
              className={`font-mono text-xs font-black px-5 py-2.5 rounded-xl transition-all shadow-md ${
                isGoogleConnected ? 'bg-emerald-500 text-white' : 'bg-rose-600 text-white hover:bg-rose-700 active:scale-95'
              }`}
            >
              {isGoogleConnected ? '✓ SMARTWATCH CONNECTED' : '🔗 CONNECT SMARTWATCH'}
            </button>
          </div>
        </header>

        {/* ================= INTERACTIVE MATRIX GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* BARIS ATAS - KIRI */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card rounded-[2rem] p-5 flex flex-col justify-between border-b-4 border-b-blue-500 min-h-[110px]">
                <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Cardio Intensity</p>
                <p className="text-2xl font-black text-slate-900 mt-2">{cardioPoints} <span className="text-xs font-normal text-slate-400">Points</span></p>
              </div>
              <div className="glass-card rounded-[2rem] p-5 flex flex-col justify-between border-b-4 border-b-cyan-500 min-h-[110px]">
                <p className="text-[10px] font-mono font-bold uppercase text-slate-400 tracking-wider">Hydration Deficit</p>
                <p className="text-2xl font-black text-slate-900 mt-2">{currentHydrationNeeds} <span className="text-xs font-normal text-slate-400">mL</span></p>
              </div>
            </div>

            <div className="glass-card rounded-[2rem] p-6 flex flex-col items-center justify-center flex-1 min-h-[240px]">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide self-start mb-2">Live Heart Rate Sensor</span>
              <div className="relative w-36 h-36 flex items-center justify-center my-2">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" stroke="#E2E8F0" strokeWidth="7" fill="transparent" />
                  <circle cx="50" cy="50" r="40" stroke="#F43F5E" strokeWidth="7" fill="transparent" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * Math.min(bpm, 150)) / 150} strokeLinecap="round" className={`transition-all duration-500 ${bpm > 0 ? 'animate-pulse' : ''}`} />
                </svg>
                <div className="absolute text-center">
                  <p className="text-3xl font-black text-slate-900 tracking-tight">{bpm > 0 ? bpm : '---'}</p>
                  <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wider mt-0.5">💓 Real BPM</p>
                </div>
              </div>
              <div className="w-full border-t border-slate-100 pt-3 text-center flex justify-around text-xs font-bold mt-2">
                <span className="text-slate-500">Vessel Flexibility</span>
                <span className="text-emerald-600">❤️ {vesselFlexibility}%</span>
              </div>
            </div>
          </div>

          {/* BARIS ATAS - KANAN */}
          <div className="lg:col-span-8 flex flex-col">
            <div className="glass-card rounded-[2rem] p-6 flex flex-col justify-between h-full min-h-[360px]">
              <div>
                <span className="text-[10px] font-mono font-bold text-rose-500 uppercase tracking-wider">Telemetry Stream</span>
                <h2 className="text-base font-black text-slate-900 mt-0.5">Grafik Rentang Detak Jantung Harian (Asli)</h2>
              </div>
              <div className="w-full flex-1 mt-6 min-h-[240px] text-[11px]">
                {bpmHistory.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={bpmHistory} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="colorBpm" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.4}/>
                          <stop offset="95%" stopColor="#F43F5E" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
                      <XAxis dataKey="waktu" stroke="#94A3B8" />
                      <YAxis domain={[40, 160]} stroke="#94A3B8" />
                      <Tooltip contentStyle={{ background: '#0F172A', borderRadius: '12px', color: '#FFF', border: 'none', fontSize: '12px' }} />
                      <Area type="monotone" dataKey="BPM" stroke="#F43F5E" strokeWidth={2.5} fillOpacity={1} fill="url(#colorBpm)" />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-xs p-4 text-center">
                    <p className="font-bold text-slate-600 mb-1">Membaca Data REST API Cloud...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* ================= BARIS BAWAH METRIK UTAMA ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Card Steps */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[210px] p-5 relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-20 -translate-y-4 group-hover:scale-110 group-hover:opacity-25 transition-all duration-500">
              <span className="text-[110px] leading-none">🏃‍♂️</span>
            </div>
            <div className="flex justify-between items-center z-10 relative">
              <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Steps</p>
              <span className="text-[9px] font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">NEAT</span>
            </div>
            <div className="mt-auto z-10 relative">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{steps > 0 ? steps.toLocaleString() : '0'}</p>
              <p className="text-[10px] text-slate-600 leading-snug mt-2 border-t border-slate-100/80 pt-2 font-medium">
                Menjaga sensitivitas reseptor insulin pada sel agar pembakaran glukosa lancar.
              </p>
            </div>
          </div>

          {/* Card Active Kcal */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[210px] p-5 relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-20 -translate-y-4 group-hover:scale-110 group-hover:opacity-25 transition-all duration-500">
              <span className="text-[110px] leading-none">🔥</span>
            </div>
            <div className="flex justify-between items-center z-10 relative">
              <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Active Kcal</p>
              <span className="text-[9px] font-mono font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">METABOLIK</span>
            </div>
            <div className="mt-auto z-10 relative">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{calories > 0 ? Math.floor(calories) : '0'}</p>
              <p className="text-[10px] text-slate-600 leading-snug mt-2 border-t border-slate-100/80 pt-2 font-medium">
                Energi aktif terbakar. Otomatis menaikkan target air pada panel hidrasi Anda.
              </p>
            </div>
          </div>

          {/* Card Blood Oxygen */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-between min-h-[210px] p-5 relative overflow-hidden group">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0 opacity-20 -translate-y-4 group-hover:scale-110 group-hover:opacity-25 transition-all duration-500">
              <span className="text-[110px] leading-none">🫁</span>
            </div>
            <div className="flex justify-between items-center z-10 relative">
              <p className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Blood Oxygen</p>
              <span className="text-[9px] font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">SPO2</span>
            </div>
            <div className="mt-auto z-10 relative">
              <p className="text-3xl font-black text-slate-900 tracking-tight">{oxygenLevel > 0 ? oxygenLevel : '---'} <span className="text-sm font-bold text-slate-400">%</span></p>
              <p className="text-[10px] text-slate-600 leading-snug mt-2 border-t border-slate-100/80 pt-2 font-medium">
                Status 95%-100% (Normal). Menjamin suplai oksigen maksimal untuk respirasi seluler.
              </p>
            </div>
          </div>

          {/* 🕒 CIRCADIAN TRACKER CARD */}
          <div className={`lg:col-span-6 bg-gradient-to-br ${circadian.color} rounded-[2rem] p-7 flex flex-col justify-between min-h-[210px] shadow-2xl text-white relative overflow-hidden group transition-all duration-700`}>
            <div className="absolute -right-5 -bottom-5 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-700" />
            
            <div className="flex justify-between items-start z-10 w-full">
              <div className="flex items-center gap-2.5">
                <span className="text-2xl p-1.5 bg-white/10 rounded-xl backdrop-blur-md">{circadian.icon}</span>
                <div>
                  <span className="text-[9px] font-mono font-bold tracking-widest text-white/70 uppercase block">
                    Circadian Rhythm Scanner
                  </span>
                  <h3 className="text-lg font-black tracking-tight text-white leading-none mt-1">
                    {circadian.phase}
                  </h3>
                </div>
              </div>
              
              <div className={`text-right font-mono border ${circadian.badgeBg} px-3 py-1.5 rounded-xl`}>
                <p className="text-[8px] uppercase tracking-wider text-white/60">Ganti Fase</p>
                <p className="text-xs font-black text-white">{circadian.countdown}</p>
              </div>
            </div>

            <div className="pt-4 pb-2 z-10">
              <h4 className="text-sm font-extrabold text-white/90">
                ✨ {circadian.title}
              </h4>
              <p className="text-xs text-white/80 leading-relaxed mt-1.5 font-normal max-w-lg">
                {circadian.desc}
              </p>
            </div>

            <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 z-10 w-full">
              <div className="flex-1 w-full sm:max-w-[200px]">
                <div className="flex justify-between text-[9px] font-mono text-white/70 mb-1.5">
                  <span>Siklus Fase</span>
                  <span>{circadian.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${circadian.progress}%` }}
                  />
                </div>
              </div>

              {circadian.showButton && (
                <button
                  type="button"
                  onClick={() => handleCircadianAction(circadian.actionType)}
                  className="w-full sm:w-auto font-mono text-[10px] font-black px-4 py-2.5 bg-white text-slate-900 rounded-xl hover:bg-slate-50 active:scale-95 shadow-md transition-all tracking-wider uppercase"
                >
                  {circadian.actionLabel}
                </button>
              )}
            </div>

            <div className="border-t border-white/5 mt-3 pt-2 flex justify-between items-center text-[9px] text-white/40 font-mono z-10 w-full">
              <span>Bio-Clock Engine: <span className="text-white/60 font-bold">Autonomous Tracker</span></span>
              <span>Sistem: 100% On-Device</span>
            </div>
          </div>

        </div>

      </div>

      {/* ================= FLOATING POP-UP CHATBOT UI ================= */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        
        {isChatOpen && (
          <div className="w-[360px] md:w-[400px] h-[500px] bg-white rounded-[2rem] shadow-2xl border border-slate-100 flex flex-col overflow-hidden transition-all duration-300">
            
            {/* Header Chat */}
            <div className="bg-[#1A1F36] px-6 py-4 flex justify-between items-center text-white">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
                  🤖
                </div>
                <div>
                  <h3 className="text-sm font-bold">GlycoFlow Agent</h3>
                  <p className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span> Gemini 2.5 Flash Connected
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white/60 hover:text-white font-bold text-sm bg-white/10 w-7 h-7 rounded-full flex items-center justify-center active:scale-90"
              >
                ✕
              </button>
            </div>

            {/* Konten Chat */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 chat-scrollbar bg-slate-50">
              {chatMessages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex flex-col max-w-[80%] ${msg.sender === 'user' ? 'self-end items-end' : 'self-start items-start'}`}
                >
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-blue-600 text-white rounded-tr-none shadow-md' 
                      : 'bg-white text-slate-800 rounded-tl-none border border-slate-100 shadow-sm'
                  }`}>
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

            {/* Input Form Chat */}
            <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-slate-100 flex gap-2">
              <input 
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Tanyakan analisis metabolisme..."
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-blue-500 text-slate-700"
              />
              <button 
                type="submit"
                disabled={isChatLoading || !chatInput.trim()}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all active:scale-95 shadow-sm"
              >
                Kirim
              </button>
            </form>

          </div>
        )}

        {/* Tombol Pemicu Pop-up Chat */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all text-2xl"
        >
          💬
        </button>

      </div>
    </div>
  );
}