import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Head } from '@inertiajs/react';

// --- DATASET MEDIS ANTI-NARKOBA PREMIUM (STATIS - PATH FIX SESUAI SCREENSHOT) ---
const MINDHUB_DATABASE = {
  narkotika: [
    {
      id: "sabu",
      name: "Metamfetamin (Sabu)",
      alias: "Meth / Ice / Kristal",
      icon: "💎",
      image: "/images/Narkoba/meth.jpg", // DISESUAIKAN
      stats: { adiksi: 98, toksisitas: 85, mental: 90 },
      summary: "Zat stimulan ekstrem yang memicu lonjakan dopamin hingga 1.200 unit, membajak sistem kebahagiaan alami otak.",
      efek_saraf: "Merasuki sistem saraf pusat secara agresif, mempercepat detak jantung di atas batas aman, dan merusak jaringan pelindung saraf.",
      tanda_fisik: ["Pupil mata melebar parah", "Penurunan berat badan drastis & kulit kusam", "Kerusakan gigi kronis (Meth Mouth)"],
      solusi_medis: ["Detoksifikasi Kimiawi", "Terapi Kognitif Perilaku (CBT)", "Restorasi Nutrisi Otak"],
      hotline_note: "Fase sakau sering memicu depresi klinis berat karena pasokan dopamin alami otak terhenti total.",
      warning_level: "CRITICAL ALERT"
    },
    {
      id: "heroin",
      name: "Heroin (Putau)",
      alias: "Opioid / Putauh / White Powder",
      icon: "💉",
      image: "/images/Narkoba/heroin.jpg", // DISESUAIKAN
      stats: { adiksi: 100, toksisitas: 95, mental: 88 },
      summary: "Zat derivat opioid yang mengikat reseptor mu-opioid di otak secara instan, memicu kecanduan fisik terberat dalam dunia medis.",
      efek_saraf: "Menekan pusat kendali pernapasan di batang otak, membuat pengguna rentan berhenti bernapas saat tertidur (hipoksia fatal).",
      tanda_fisik: ["Pupil mata mengecil seukuran jarum (pinpoint)", "Kulit bekas suntikan menghitam/bernanah", "Sering mengantuk berat secara mendadak"],
      solusi_medis: ["Terapi Substitusi Opioid (Metadon)", "Manajemen Sakau (Cold Turkey Terbimbing)", "Konseling Relaps"],
      hotline_note: "Memiliki tingkat gejala putus zat (sakau) fisik paling menyiksa secara biologis (demam hebat, kram tulang).",
      warning_level: "CRITICAL ALERT"
    },
    {
      id: "ekstasi",
      name: "MDMA (Ekstasi)",
      alias: "Inex / XTC / Fancy",
      icon: "💊",
      image: "/images/Narkoba/ekstasi.jpg", // DISESUAIKAN
      stats: { adiksi: 75, toksisitas: 80, mental: 85 },
      summary: "Zat sintetik halusinogen-stimulan yang menguras habis cadangan Serotonin otak, memicu dehidrasi organ ekstrem.",
      efek_saraf: "Mengacaukan kemampuan tubuh mengatur suhu, menyebabkan kegagalan organ mendadak akibat kepanasan (Hyperthermia).",
      tanda_fisik: ["Rahang mengatup kaku secara tidak sadar", "Kram otot hebat & keringat berlebih", "Halusinasi visual distorsif"],
      solusi_medis: ["Stabilisasi Elektrolit", "Manajemen Trauma Jiwa", "Pemeriksaan Fungsi Ginjal"],
      hotline_note: "Berisiko tinggi memicu depresi berat (Tuesday Blues) pasca-pemakaian karena cadangan serotonin habis.",
      warning_level: "HIGH DANGER"
    },
    {
      id: "kokain",
      name: "Kokain (Cocaine)",
      alias: "Coke / Snow / Crack",
      icon: "❄️",
      image: "/images/Narkoba/cocaine.jpg", // DISESUAIKAN
      stats: { adiksi: 92, toksisitas: 88, mental: 85 },
      summary: "Alkaloid murni dari daun Erythroxylon coca yang mencegah penyerapan kembali dopamin, memaksa jantung bekerja eksponensial.",
      efek_saraf: "Memicu penyempitan pembuluh darah kapiler otak, meningkatkan risiko stroke dini dan pecahnya pembuluh darah seketika.",
      tanda_fisik: ["Kerusakan atau mimisan kronis pada sekat hidung", "Perilaku paranoid dan hiperaktif", "Tekanan darah melonjak drastis"],
      solusi_medis: ["Terapi Stimulasi Magnetik Transkranial (TMS)", "Psikoterapi Kelompok", "Kardio-Monitoring"],
      hotline_note: "Sering memicu serangan panik akut dan delusi kejar (merasa selalu diintai bahaya).",
      warning_level: "CRITICAL ALERT"
    },
    {
      id: "ganja",
      name: "Ganja (Cannabis)",
      alias: "Marijuana / Gele / Cimeng",
      icon: "🍁",
      image: "/images/Narkoba/ganja.jpg", // DISESUAIKAN
      stats: { adiksi: 45, toksisitas: 35, mental: 70 },
      summary: "Mengandung THC psikoaktif yang mengikat reseptor CB1 di otak, mengacaukan memori, koordinasi, dan persepsi waktu.",
      efek_saraf: "Memperlambat koneksi sinapsis otak, memicu sindrom amotivasi (kehilangan ambisi hidup total).",
      tanda_fisik: ["Mata memerah & sayu", "Gangguan memori jangka pendek", "Respons motorik melambat"],
      solusi_medis: ["Terapi Wawancara Motivasi (MET)", "Konseling Psikosial", "Reintegrasi Komunitas"],
      hotline_note: "Dapat mengaktifkan potensi gangguan jiwa berat (skizofrenia laten) pada individu yang memiliki riwayat genetik.",
      warning_level: "WARNING"
    },
    {
      id: "kodein",
      name: "Penyalahgunaan Kodein",
      alias: "Obat Batuk Rekreasional / Lean",
      icon: "🧪",
      image: "/images/Narkoba/codaine.jpg", // DISESUAIKAN (Sesuai typo codaine.jpg di screenshot)
      stats: { adiksi: 65, toksisitas: 70, mental: 55 },
      summary: "Zat kelompok opioid yang biasa ditemukan pada obat batuk resep. Disalahgunakan dalam dosis tinggi untuk memicu efek sedatif penenang.",
      efek_saraf: "Memperlambat aktivitas susunan saraf pusat, memicu konstipasi kronis, dan menumpulkan refleks pertahanan paru-paru.",
      tanda_fisik: ["Sembelit parah berulang", "Bicara lambat dan tidak fokus", "Gatal-gatal pada kulit (pelepasan histamin)"],
      solusi_medis: ["Tapering Off (Penurunan Dosis Bertahap)", "Konseling Perilaku", "Detoksifikasi Organ Dalam"],
      hotline_note: "Sangat berbahaya jika dicampur dengan alkohol (dapat memicu henti napas mendadak).",
      warning_level: "MODERATE DANGER"
    }
  ],
  adiktif_baru: [
    {
      id: "gorila",
      name: "Tembakau Sintetis",
      alias: "Sin / Tembakau Gorila",
      icon: "🦍",
      // AMAN! Sekarang jalurnya sudah diarahkan ke file 'tembakau gorilla.jpg' sesuai screenshot Anda
      image: "/images/Narkoba/tembakau gorilla.jpg", 
      stats: { adiksi: 95, toksisitas: 92, mental: 96 },
      summary: "Bahan kimia laboratorium berbahaya yang disemprot ke tanaman kering. Efek cannabinoid sintetiknya 100x lebih kuat dari ganja biasa.",
      efek_saraf: "Memicu aktivitas listrik otak abnormal secara mendadak, menyebabkan kejang hebat hingga koma.",
      tanda_fisik: ["Kejang-kejang seluruh tubuh", "Psikosis akut (mengamuk dan histeris tanpa sebab)", "Nyeri dada menusuk"],
      solusi_medis: ["Farmakoterapi Antipsikotik", "Rawat Inap Isolasi Ketat", "Sedasi Medis Darurat"],
      hotline_note: "Sangat rawan memicu henti jantung mendadak bahkan pada pemakaian pertama kali.",
      warning_level: "CRITICAL ALERT"
    },
    {
      id: "flakka",
      name: "Flakka (Zat Alfa-PVP)",
      alias: "Gravel / Zombie Drug / Bath Salts",
      icon: "🧟",
      image: "/images/Narkoba/flakka.jpg", // DISESUAIKAN
      stats: { adiksi: 97, toksisitas: 94, mental: 99 },
      summary: "Zat katinona sintetik berbentuk mirip kerikil akuarium. Menghancurkan kendali kesadaran moral manusia dalam hitungan menit.",
      efek_saraf: "Memicu kondisi 'Excited Delirium' parah, di mana suhu tubuh melonjak internal hingga 41°C disertai kekuatan fisik abnormal tak terkendali.",
      tanda_fisik: ["Perilaku agresif kanibalistik/zombie", "Kekuatan fisik berlipat ganda secara tidak wajar", "Bicara meracau paranoid ekstrem"],
      solusi_medis: ["Koreksi Hipertermia Intensif", "Sedasi Kimiawi Total (UGD)", "Terapi Psikiatri Agresif jangka panjang"],
      hotline_note: "Zat paling berbahaya bagi integritas mental; kerusakan sel otak yang terjadi sering kali bersifat permanen.",
      warning_level: "CRITICAL ALERT"
    },
    {
      id: "kratom",
      name: "Penyalahgunaan Kratom",
      alias: "Mitragyna Speciosa / Purik / Ketum",
      icon: "🍃",
      image: "/images/Narkoba/kratom.jpg", // DISESUAIKAN
      stats: { adiksi: 55, toksisitas: 60, mental: 50 },
      summary: "Tanaman endemik yang mengandung mitragynin. Dalam dosis rendah bertindak sebagai stimulan, namun dalam dosis besar mengikat reseptor opioid.",
      efek_saraf: "Menginduksi efek sedasi ganda yang jika disalahgunakan berlebih merusak fungsi penyaringan racun pada hati dan ginjal.",
      tanda_fisik: ["Pipi menghitam (hiperpigmentasi)", "Insomnia berat saat zat dihentikan", "Anoreksia/kehilangan nafsu makan"],
      solusi_medis: ["Simtomatik Terapi Sakau", "Edukasi Ambang Batas Medis", "Pemulihan Fungsi Enzim Hati"],
      hotline_note: "Banyak disalahartikan aman karena herbal, padahal memicu ketergantungan fisik serupa zat opioid ringan.",
      warning_level: "WARNING"
    },
    {
      id: "inhalan",
      name: "Inhalan (Uap Chemical)",
      alias: "Ngelem / Solvent / Tiner",
      icon: "🧪",
      image: "/images/Narkoba/inhalan.jpg", // DISESUAIKAN
      stats: { adiksi: 82, toksisitas: 96, mental: 88 },
      summary: "Menghirup uap pelarut industri untuk memabukkan diri. Zat kimia langsung melarutkan lapisan lemak (mielin) pelindung saraf otak.",
      efek_saraf: "Menyebabkan kerusakan sumsum tulang belakang permanen dan hipoksia (otak kekurangan oksigen).",
      tanda_fisik: ["Bicara cadel & jalan sempoyongan", "Hidung/mulut luka berkerak", "Aroma kimia menyengat dari pakaian"],
      solusi_medis: ["Terapi Oksigen Hiperbarik", "Asesmen Neurologi Saraf", "Pendampingan Pola Asuh"],
      hotline_note: "Dapat memicu sindrom kematian mendadak (Sudden Sniffing Death Syndrome) akibat gagal napas seketika.",
      warning_level: "HIGH DANGER"
    }
  ]
};

const FOOTER_FACTS = [
  { title: "Pembajakan Dopamin", icon: "🧠", text: "Narkoba memaksa otak melepas dopamin hingga 1.200 unit, membuat kebahagiaan alami (makan/olahraga) tidak lagi terasa menyenangkan.", bgBadge: "bg-amber-50 border-amber-200 text-amber-700", dotColor: "bg-amber-500" },
  { title: "Lapor Sukarela Aman", icon: "⚖️", text: "Sesuai UU No. 35/2009 Pasal 54, pengguna yang melaporkan diri ke institusi medis resmi WAJIB direhabilitasi dan BEBAS dari jeratan pidana.", bgBadge: "bg-blue-50 border-blue-200 text-blue-700", dotColor: "bg-blue-500" },
  { title: "Otak Depan Dirusak", icon: "🛑", text: "Zat adiktif menghancurkan Prefrontal Cortex, bagian otak yang mengatur logika dan kendali emosi, menyebabkan kepribadian berubah permanen.", bgBadge: "bg-rose-50 border-rose-200 text-rose-700", dotColor: "bg-rose-500" },
  { title: "Energi Palsu", icon: "💀", text: "Zat stimulan tidak memberi energi baru, melainkan memeras habis cadangan energi darurat tubuh secara paksa sampai organ dalam aus.", bgBadge: "bg-orange-50 border-orange-200 text-orange-700", dotColor: "bg-orange-500" },
  { title: "Sensor Otak Bocor", icon: "🌀", text: "Halusinogen merusak gerbang serotonin, membuat panca indra bocor dan mempercayai halusinasi menyeramkan sebagai realita 100%.", bgBadge: "bg-purple-50 border-purple-200 text-purple-700", dotColor: "bg-purple-500" },
  { title: "Ekonomi Dijebak", icon: "💸", text: "Secara statistik, biaya adiksi pecandu dalam setahun setara dengan investasi pendidikan tinggi. Jangan biarkan bandar membeli masa depan Anda.", bgBadge: "bg-emerald-50 border-emerald-200 text-emerald-700", dotColor: "bg-emerald-500" },
  { title: "Hotline BNN 184", icon: "📞", text: "Layanan call center 184 dari BNN menjamin kerahasiaan identitas 100% untuk konsultasi rehabilitasi medis maupun laporan kedaruratan.", bgBadge: "bg-indigo-50 border-indigo-200 text-indigo-700", dotColor: "bg-indigo-500" }
];

export default function MindHub() {
  const [activeTab, setActiveTab] = useState('narkotika');
  const [selected, setSelected] = useState(MINDHUB_DATABASE.narkotika[0]);
  const [search, setSearch] = useState('');
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FOOTER_FACTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelected(MINDHUB_DATABASE[tab][0]);
    setSearch('');
  };

  const filtered = MINDHUB_DATABASE[activeTab].filter(item =>
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.alias.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-12 selection:bg-rose-500/10 selection:text-rose-600">
      <Head title="GlycoFlow AI - MindHub Center" />
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 flex flex-col gap-6 relative z-10">
        
        {/* --- PREMIUM LIGHT HEADER --- */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200/60 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-sm">
          <div>
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
              <span className="inline-flex items-center px-2.5 py-1 rounded-full border border-rose-100 bg-rose-50 text-[10px] font-bold text-rose-600 uppercase tracking-wider font-mono">
                🛡️ Substance Education & Neuro-Defense
              </span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              MindHub <span className="text-rose-600 font-bold">Substance Information</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium max-w-xl">
              Katalog edukasi zat berbahaya klinis, pemantauan tingkat kerusakan kognitif, serta protokol rehabilitasi nasional medis.
            </p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40 self-stretch md:self-auto shrink-0">
            <button 
              onClick={() => handleTabChange('narkotika')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase ${activeTab === 'narkotika' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              ⚠️ Narkotika ({MINDHUB_DATABASE.narkotika.length})
            </button>
            <button 
              onClick={() => handleTabChange('adiktif_baru')}
              className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer uppercase ${activeTab === 'adiktif_baru' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              🧪 Zat Adiktif Baru ({MINDHUB_DATABASE.adiktif_baru.length})
            </button>
          </div>
        </section>

        {/* --- MAIN DASHBOARD 3-PANEL LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* PANEL 1: CATALOG INDEX LIST */}
          <div className="lg:col-span-3 bg-white border border-slate-200/60 rounded-2xl p-4 flex flex-col gap-4 shadow-sm">
            <div>
              <span className="text-[10px] font-mono font-black text-slate-400 tracking-widest block mb-2 uppercase">01 / Index Database</span>
              <input 
                type="text"
                placeholder="Cari kode/nama zat..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white transition-all font-medium"
              />
            </div>

            <div style={{ scrollbarWidth: 'thin' }} className="flex flex-col gap-2 overflow-y-auto max-h-[460px] pr-1">
              {filtered.length > 0 ? (
                filtered.map((item) => {
                  const isSelected = selected.id === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className={`w-full p-3.5 rounded-xl border text-left flex flex-col gap-2 transition-all cursor-pointer shrink-0 ${isSelected ? 'bg-rose-600 border-rose-600 text-white shadow-md shadow-rose-600/10' : 'bg-slate-50 hover:bg-slate-100/70 border-slate-200/60 text-slate-700'}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xl p-1.5 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-200/60'}`}>{item.icon}</span>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold tracking-tight truncate">{item.name}</h4>
                          <span className={`text-[9px] font-mono block truncate ${isSelected ? 'text-rose-100' : 'text-slate-400'}`}>{item.alias}</span>
                        </div>
                      </div>
                      <div className={`w-full h-1 rounded-full overflow-hidden ${isSelected ? 'bg-rose-800/50' : 'bg-slate-200'}`}>
                        <div 
                          className={`h-full rounded-full ${isSelected ? 'bg-white' : item.stats.adiksi > 90 ? 'bg-rose-500' : 'bg-orange-500'}`}
                          style={{ width: `${item.stats.adiksi}%` }}
                        />
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-8 text-xs text-slate-400 font-medium">Zat tidak ditemukan.</div>
              )}
            </div>
          </div>

          {/* PANEL 2: CLINICAL RISK ASSESSMENT CORE */}
          <div className="lg:col-span-5 bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between shadow-sm relative overflow-hidden">
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-600 font-mono font-bold text-[10px] border border-rose-100">02</span>
                  <h3 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest">Neuro-Analysis Center</h3>
                </div>
                <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${selected.warning_level === 'CRITICAL ALERT' ? 'bg-red-50 border-red-100 text-red-600' : 'bg-amber-50 border-amber-100 text-amber-600'}`}>
                  {selected.warning_level}
                </span>
              </div>

              {/* Box Info Gambar & Indikator Batang */}
              <div className="grid grid-cols-12 gap-4 items-center mb-5 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 shadow-inner">
                <div className="col-span-4 h-24 rounded-lg overflow-hidden border border-slate-200 bg-white">
                  <img src={selected.image} alt={selected.name} onError={(e) => { e.currentTarget.src = `https://placehold.co/300x300?text=${encodeURIComponent(selected.name)}`; }} className="w-full h-full object-cover" />
                </div>
                {/* Real-time Bio-Stats */}
                <div className="col-span-8 flex flex-col gap-1.5 px-1">
                  {Object.entries(selected.stats).map(([key, val]) => (
                    <div key={key} className="flex flex-col gap-0.5">
                      <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                        <span>{key === 'adiksi' ? '⚡ Addiction Speed' : key === 'toksisitas' ? '☣️ Organ Toxicity' : '🧠 Mental Decay'}</span>
                        <span className="text-slate-700 font-bold">{val}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${key === 'adiksi' ? 'bg-amber-500' : key === 'toksisitas' ? 'bg-orange-500' : 'bg-rose-600'}`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 tracking-tight">
                <span className="text-xl">{selected.icon}</span> {selected.name}
              </h2>
              <p className="text-xs text-slate-600 mt-1.5 font-medium leading-relaxed">{selected.summary}</p>

              <div className="mt-4 p-3.5 bg-rose-50/60 border border-rose-100 rounded-xl">
                <span className="text-[9px] font-mono font-black text-rose-600 tracking-wider block mb-1 uppercase">🧠 Kerusakan Sistem Saraf:</span>
                <p className="text-xs text-slate-700 font-medium leading-relaxed">{selected.efek_saraf}</p>
              </div>
            </div>

            {/* Ciri Fisik */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <span className="text-[9px] font-mono font-black text-slate-400 tracking-wider block mb-2 uppercase">🚨 Ciri Fisik Teridentifikasi:</span>
              <div className="flex flex-wrap gap-1.5">
                {selected.tanda_fisik.map((tanda, i) => (
                  <span key={i} className="text-[10px] bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-slate-600 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500" /> {tanda}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* PANEL 3: LEGAL PROTECTION & FIRST AID DIRECTORY */}
          <div className="lg:col-span-4 bg-white border border-slate-200/60 rounded-2xl p-6 flex flex-col justify-between border-r-4 border-r-emerald-500 shadow-sm">
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-mono font-bold text-[10px] border border-emerald-100">03</span>
                  <h3 className="text-xs font-mono font-black text-slate-400 uppercase tracking-widest">Legal & Rescue Guide</h3>
                </div>
                <span className="bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[8px] font-mono font-bold uppercase rounded text-emerald-700">Edukasi Publik</span>
              </div>

              {/* Seksi Aspek Hukum Sukarela */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 flex flex-col gap-1.5 shadow-inner">
                <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-800 uppercase tracking-wide">
                  <span>⚖️</span> UU No.35/2009 Pasal 54
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed font-medium">
                  Pecandu, penyalahguna, dan korban penyalahgunaan narkotika <strong className="text-slate-900 font-bold">wajib menjalani rehabilitasi medis dan sosial</strong>. Pelaporan sukarela secara resmi membebaskan penyalahguna dari tuntutan pidana hukum.
                </p>
              </div>

              {/* Seksi Pertolongan Pertama Medis Darurat */}
              <div className="flex flex-col gap-2">
                <span className="text-[9px] font-mono font-black text-slate-400 uppercase tracking-widest block">🚨 Protokol Darurat Overdosis:</span>
                
                <div className="space-y-2">
                  <div className="flex gap-2.5 items-start">
                    <span className="text-xs mt-0.5">1️⃣</span>
                    <p className="text-[11px] text-slate-600 font-medium leading-tight">
                      <strong className="text-slate-800 font-bold block">Panggil Bantuan Medis</strong> Hubungi nomor darurat ambulans rumah sakit atau pusat layanan darurat setempat secepatnya.
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-xs mt-0.5">2️⃣</span>
                    <p className="text-[11px] text-slate-600 font-medium leading-tight">
                      <strong className="text-slate-800 font-bold block">Pantau Kesadaran & Napas</strong> Jika korban tidak sadarkan diri tetapi bernapas, baringkan di posisi mantap (miring ke samping) agar jalur udara tetap terbuka.
                    </p>
                  </div>
                  <div className="flex gap-2.5 items-start">
                    <span className="text-xs mt-0.5">3️⃣</span>
                    <p className="text-[11px] text-slate-600 font-medium leading-tight">
                      <strong className="text-slate-800 font-bold block">Jangan Beri Makanan/Minuman</strong> Hindari memasukkan apa pun ke dalam mulut korban yang pingsan demi mencegah risiko tersedak fatal.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Bagian Bawah Panel */}
            <div className="mt-6 pt-3 border-t border-slate-100 flex flex-col gap-3">
              <div className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl">
                <span className="text-[8px] font-mono font-black text-amber-800 uppercase tracking-widest block mb-0.5">👨‍⚕️ Catatan Medis Dokter:</span>
                <p className="text-[10px] text-slate-600 font-medium italic leading-relaxed">"{selected.hotline_note}"</p>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                <span className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest block">Layanan Konsultasi Resmi Nasional:</span>
                <div className="text-xs font-black text-slate-800 tracking-wider mt-1 font-mono">
                  CALL CENTER BNN: <span className="text-rose-600">184</span>
                </div>
                <span className="text-[9px] text-slate-400 block mt-0.5 font-medium">Bisa dihubungi untuk konsultasi jalur administrasi IPWL resmi.</span>
              </div>
            </div>

          </div>

        </div>

        {/* --- KNOWLEDGE FOOTER --- */}
        <footer className="mt-4 relative h-48 sm:h-40 overflow-hidden">
          {FOOTER_FACTS.map((fact, index) => {
            const isActive = index === factIndex;
            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                  isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                }`}
              >
                <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm border-t-4 border-t-rose-500 h-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                  
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded border ${fact.bgBadge}`}>
                        {fact.title}
                      </span>
                      <span className="text-lg">{fact.icon}</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-slate-500 font-medium leading-relaxed max-w-4xl line-clamp-3 sm:line-clamp-2">
                      {fact.text}
                    </p>
                  </div>

                  <div className="hidden sm:block w-px h-12 bg-slate-100" />

                  <div className="w-full sm:w-1/4 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">💡 DID YOU KNOW?</div>
                      <span className="text-[10px] text-slate-600 font-bold italic mt-0.5 block">Scientific Education</span>
                    </div>

                    <div className="flex gap-1.5 mt-1">
                      {FOOTER_FACTS.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1 rounded-full transition-all duration-500 ${i === factIndex ? 'w-4 ' + fact.dotColor : 'w-1.5 bg-slate-200'}`} 
                        />
                      ))}
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </footer>

      </main>
    </div>
  );
}