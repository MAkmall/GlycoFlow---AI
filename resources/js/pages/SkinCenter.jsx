import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Head } from '@inertiajs/react';

// --- DATASET MEDIS PREMIUM ---
const SKIN_KNOWLEDGE_BASE = {
  jenis_kulit: [
    {
      id: "normal",
      name: "Kulit Normal",
      icon: "✨",
      image: "/images/Jenis Kulit/normal.jpg", 
      stats: { minyak: 45, hidrasi: 75, iritasi: 10 },
      desc: "Kulit yang memiliki keseimbangan antara kadar minyak (sebum) dan hidrasi. Tidak terlalu berminyak dan tidak terlalu kering.",
      karakteristik: ["Pori-pori hampir tidak terlihat", "Jarang mengalami breakout atau jerawat", "Tekstur halus dan elastisitas baik"],
      ingredients_recom: ["Hyaluronic Acid", "Niacinamide", "Vitamin C"],
      ingredients_avoid: ["Harsh Alcohol", "Sulfate (SLS)"],
      obat_split: {
        "Pembersih": "Gentle Facial Wash non-alkohol.",
        "Hidrasi": "Moisturizer ringan bertekstur losion (Hyaluronic Acid).",
        "Proteksi": "Sunscreen minimal SPF 30 PA+++ setiap pagi."
      },
      edukasi: "Pertahankan rutinitas dasar ini. Jangan terlalu sering berganti produk aktif agar barrier alami tidak terganggu.",
      durasi: "Rutinitas Harian",
      warning: "Over-exfoliation menggunakan asam kuat tanpa indikasi klinis dapat merusak kulit normal."
    },
    {
      id: "berminyak",
      name: "Kulit Berminyak (Oily Skin)",
      icon: "💧",
      image: "/images/Jenis Kulit/oily skin.jpg", 
      stats: { minyak: 90, hidrasi: 60, iritasi: 35 },
      desc: "Kondisi di mana kelenjar sebasea memproduksi sebum berlebih, sering kali dipengaruhi oleh hormon atau genetika.",
      karakteristik: ["Wajah tampak mengkilap/lengket", "Pori-pori besar dan terbuka", "Rentan terhadap komedo dan jerawat"],
      ingredients_recom: ["Salicylic Acid", "Niacinamide", "Zinc PCA"],
      ingredients_avoid: ["Coconut Oil", "Isopropyl Myristate"],
      obat_split: {
        "Eksfolian": "Salicylic Acid (BHA) 2% pada malam hari.",
        "Sebum Control": "Serum Niacinamide konsentrasi 5-10%.",
        "Hidrasi": "Oil-free Gel Moisturizer berbahan dasar air."
      },
      edukasi: "Hindari mencuci muka lebih dari 2 kali sehari karena dapat memicu produksi minyak kompensasi yang lebih agresif.",
      durasi: "4-6 Minggu Terapi",
      warning: "Penggunaan BHA dosis tinggi secara simultan dengan retinol dapat memicu dehidrasi kulit."
    },
    {
      id: "kering",
      name: "Kulit Kering (Dry Skin)",
      icon: "🍂",
      image: "/images/Jenis Kulit/dryskin.jpg", 
      stats: { minyak: 15, hidrasi: 20, iritasi: 50 },
      desc: "Kulit yang kekurangan lipid/minyak alami sehingga tidak mampu mempertahankan kelembapan, membuat lapisan pelindung kulit rentan rusak.",
      karakteristik: ["Terasa kaku atau tertarik setelah mencuci muka", "Terdapat area yang mengelupas atau kasar", "Mudah gatal dan tampak kusam"],
      ingredients_recom: ["Ceramides", "Squalane", "Glycerin", "Shea Butter"],
      ingredients_avoid: ["Salicylic Acid", "Denatured Alcohol"],
      obat_split: {
        "Pembersih": "Non-foaming Milk atau Cream Cleanser lembut.",
        "Hidrasi": "Krim tebal kaya Ceramide NP, Squalane, & Shea Butter.",
        "Oklusif": "Face Oil di malam hari jika kulit sangat bersisik."
      },
      edukasi: "Aplikasikan pelembap dalam waktu 3 menit setelah mandi saat kulit masih dalam kondisi lembap (Metode Soak and Smear).",
      durasi: "Kontinu Kontrol",
      warning: "Hindari sabun dengan kandungan SLS/SLES tinggi yang dapat melarutkan lipid pelindung kulit."
    },
    {
      id: "sensitif",
      name: "Kulit Sensitif",
      icon: "🛑",
      image: "/images/Jenis Kulit/kulit sensitif.jpg", 
      stats: { minyak: 30, hidrasi: 45, iritasi: 85 },
      desc: "Kulit yang sangat reaktif terhadap faktor eksternal seperti bahan kimia, wewangian, atau perubahan cuaca ekstrim.",
      karakteristik: ["Mudah memerah dan terasa perih/terbakar", "Rentan mengalami gatal atau ruam", "Sering bereaksi negatif pada kosmetik baru"],
      ingredients_recom: ["Centella Asiatica", "Allantoin", "Panthenol"],
      ingredients_avoid: ["Fragrance/Parfum", "Essential Oils", "Glycolic Acid"],
      obat_split: {
        "Soothing": "Serum Centella Asiatica, Allantoin, atau Panthenol.",
        "Barrier": "Moisturizer hypoallergenic tanpa tambahan pewangi.",
        "Hindari": "Produk mengandung alkohol denat, scrub, dan parfum."
      },
      edukasi: "Selalu lakukan patch test di belakang telinga atau lengan dalam selama 48 jam sebelum mengaplikasikan produk baru ke wajah.",
      durasi: "Minimal 28 Hari",
      warning: "Hentikan seluruh zat eksfoliator fisik (scrub wajah) dan acid keras selama fase reaktif."
    }
  ],
  penyakit_kulit: [
    {
      id: "acne_vulgaris",
      name: "Jerawat (Acne Vulgaris)",
      icon: "🔴",
      image: "/images/Penyakit kulit/Acne Vulgaris.jpg", 
      stats: { minyak: 85, hidrasi: 40, iritasi: 75 },
      desc: "Peradangan kronis pada folikel pilosebasea yang disebabkan oleh penyumbatan pori-pori oleh minyak, sel kulit mati, dan bakteri C. acnes.",
      gejala: "Papula, pustula (jerawat bernanah), nodul, atau kista kemerahan yang terasa nyeri.",
      ingredients_recom: ["Benzoyl Peroxide", "Adapalene", "Salicylic Acid"],
      ingredients_avoid: ["Comedogenic Oils", "Sulfates"],
      obat_split: {
        "Terapi Topikal": "Benzoyl Peroxide 5% (pagi) & Adapalene Gel 0.1% (malam).",
        "Obat Sistemik": "Doxycycline 100mg kapsul (oral, jika radang parah).",
        "Sediaan Sabun": "Facial Wash dengan kandungan Salicylic Acid (BHA) 2%."
      },
      edukasi: "Dilarang keras memencet lesi jerawat secara mandiri untuk mencegah risiko komplikasi skar atrofi (bopeng) menetap.",
      durasi: "Evaluasi 2-4 Minggu",
      warning: "Adapalene/Retinoid topikal bersifat teratogenik. Mutlak kontraindikasi bagi wanita hamil!"
    },
    {
      id: "biduran",
      name: "Biduran (Urticaria)",
      icon: "🎈",
      image: "/images/Penyakit kulit/Biduran.jpg",
      stats: { minyak: 40, hidrasi: 60, iritasi: 80 },
      desc: "Reaksi kulit yang ditandai dengan munculnya bilur (bentol) berwarna merah atau putih yang menonjol dan terasa sangat gatal.",
      gejala: "Bentol kemerahan berbatas tegas yang dapat melebar, muncul tiba-tiba akibat reaksi alergi makanan, obat, atau udara dingin.",
      ingredients_recom: ["Cetirizine", "Calamine", "Menthol", "Loratadine"],
      ingredients_avoid: ["Hot Water Baths", "Salicylic Acid (pada fase akut)"],
      obat_split: {
        "Sistemik H1": "Cetirizine 10mg, Fexofenadine, atau Desloratadine tablet.",
        "Sistemik H2": "Ranitidine / Famotidine (opsional kombinasi resep dokter).",
        "Topikal Dingin": "Losion Calamine dengan kandungan Menthol untuk menenangkan kulit."
      },
      edukasi: "Hindari menggaruk bentolan karena garukan melepaskan lebih banyak histamin yang justru memperluas area biduran.",
      durasi: "Akut: < 6 Minggu",
      warning: "Waspadai tanda-tanda syok anafilaksis seperti sesak napas berat atau pembengkakan bibir. Segera ke IGD jika terjadi."
    }
  ]
};

// --- DATASET 7 UNIVERSAL FUN FACTS ---
const FUN_FACTS = [
  {
    category: "Skin Cycle",
    icon: "⏳",
    title: "Siklus 28 Hari Kulit",
    desc: "Tahukah Anda? Kulit manusia melepaskan sekitar **30.000 hingga 40.000 sel mati setiap menit**. Seluruh lapisan luar kulit Anda berganti baru sepenuhnya setiap 2-4 minggu.",
    footer: "Fakta: Debu rumah sebagian besar adalah sel kulit mati.",
    color: "amber"
  },
  {
    category: "Circadian Rhythm",
    icon: "🌙",
    title: "Mekanisme \"Beauty Sleep\"",
    desc: "Saat tidur nyenyak, aliran darah ke kulit meningkat dan tubuh memproduksi **Hormon Pertumbuhan (HGH)** yang memperbaiki jaringan kolagen serta memulihkan kerusakan akibat sinar UV.",
    footer: "Tips: Tidur sebelum pukul 23:00 untuk pemulihan jaringan.",
    color: "blue"
  },
  {
    category: "Human Anatomy",
    icon: "⚖️",
    title: "Organ Terbesar Tubuh",
    desc: "Bukan jantung atau paru-paru, **kulit adalah organ tubuh terbesar**. Bobot total kulit mencapai sekitar **16% dari keseluruhan berat badan manusia** dewasa.",
    footer: "Fungsi: Tameng pertahanan primer dari patogen luar.",
    color: "emerald"
  },
  {
    category: "Melanin Secret",
    icon: "☀️",
    title: "Sinyal Proteksi Alami Tan",
    desc: "Kulit yang menjadi lebih gelap (*tan*) setelah terpapar matahari sebenarnya adalah **mekanisme pertahanan seluler**. Sel melanosit memproduksi pigmen melanin untuk membentengi DNA kulit dari kerusakan radiasi UV.",
    footer: "Catatan: Kulit gelap tetap membutuhkan sunscreen!",
    color: "rose"
  },
  {
    category: "Skin Ecosystem",
    icon: "🦠",
    title: "Rumah Miliaran Mikroba",
    desc: "Kulit Anda dihuni oleh **jutaan bakteri, jamur, dan virus baik (Skin Microbiome)** yang membentuk ekosistem pertahanan. Menggunakan sabun antiseptik keras terus-menerus bisa merusak ekosistem pelindung ini.",
    footer: "Prinsip: Jaga keasaman pH kulit alami (sekitar 4.7 - 5.5).",
    color: "indigo"
  },
  {
    category: "Temperature Control",
    icon: "🥵",
    title: "Sistem AC Alami Tubuh",
    desc: "Kulit bekerja sebagai termostat tubuh. Melalui pembuluh darah yang melebar dan sekresi kelenjar keringat, kulit bisa membuang suhu panas berlebih demi menjaga organ dalam tetap di suhu aman.",
    footer: "Fakta: Tubuh punya hingga 4 juta kelenjar keringat.",
    color: "orange"
  },
  {
    category: "Aging Science",
    icon: "📉",
    title: "Penyusutan Produksi Kolagen",
    desc: "Memasuki usia **20 tahun ke atas**, kulit manusia kehilangan pasokan produksi kolagen alami sebanyak **1% setiap tahunnya**. Hal inilah yang memicu pembentukan garis halus seiring bertambahnya usia.",
    footer: "Solusi: Konsumsi antioksidan tinggi dan hidrasi cukup.",
    color: "purple"
  }
];

export default function SkinDetectorPage() {
  const [activeTab, setActiveTab] = useState('jenis_kulit'); 
  const [selectedItem, setSelectedItem] = useState(SKIN_KNOWLEDGE_BASE.jenis_kulit[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFact, setCurrentFact] = useState(0);

  // --- LOGIKA AUTO SLIDE FOOTER (5 DETIK) ---
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % FUN_FACTS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setSelectedItem(SKIN_KNOWLEDGE_BASE[tab][0]);
    setSearchQuery('');
  };

  const filteredList = SKIN_KNOWLEDGE_BASE[activeTab].filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 pt-28 pb-20 selection:bg-blue-500/10 selection:text-blue-600">
      <Head title="GlycoFlow AI - Dermal Knowledge Hub" />
      <Navbar />

      <main className="w-full max-w-7xl mx-auto px-4 flex flex-col gap-6 relative z-10">
        
        {/* --- HEADER --- */}
        <section className="bg-white rounded-2xl p-6 border border-slate-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-blue-100 bg-blue-50 text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">
              📚 Medical Education Hub
            </span>
            <h1 className="text-2xl font-black tracking-tight text-slate-900">
              Dermal <span className="text-blue-600 font-bold">Knowledge Center</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1 font-medium">
              Eksplorasi klasifikasi jenis kulit, patologi penyakit kulit, beserta panduan intervensi bahan aktif farmasi medis.
            </p>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200/40">
            <button 
              onClick={() => handleTabChange('jenis_kulit')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'jenis_kulit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              🧬 Jenis Kulit
            </button>
            <button 
              onClick={() => handleTabChange('penyakit_kulit')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === 'penyakit_kulit' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              🦠 Penyakit Kulit ({SKIN_KNOWLEDGE_BASE.penyakit_kulit.length})
            </button>
          </div>
        </section>

        {/* --- MAIN GRID LAYOUT --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* BENTO CARD 1: DIRECTORY INDEX */}
          <div className="lg:col-span-4 bg-white rounded-2xl p-5 border border-slate-200/60 shadow-sm flex flex-col gap-4">
            <div className="border-b border-slate-100 pb-3">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">
                01 / Indeks Direktori
              </h3>
              <div className="mt-3 relative">
                <input 
                  type="text"
                  placeholder={`Cari nama di sini...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-all text-slate-700 font-medium"
                />
              </div>
            </div>

            <div style={{ scrollbarWidth: 'thin' }} className="flex flex-col gap-2 overflow-y-scroll max-h-[480px] pr-1">
              {filteredList.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedItem(item)}
                  className={`w-full p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer shrink-0 ${selectedItem.id === item.id ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-600/10' : 'bg-slate-50 hover:bg-slate-100 border-slate-200/60 text-slate-700'}`}
                >
                  <span className="text-xl bg-white/20 p-1.5 rounded-lg">{item.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-xs font-bold tracking-tight">{item.name}</h4>
                    <p className={`text-[10px] line-clamp-1 mt-0.5 ${selectedItem.id === item.id ? 'text-blue-100' : 'text-slate-400'}`}>{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT PANELS (Card 02 & 03) */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
            
            {/* CARD 02: DERMAL DESCRIPTION */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-mono font-bold text-[10px] border border-blue-100">02</span>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Dermal Deskripsi</h3>
                    </div>
                    <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase tracking-wider rounded-md bg-blue-50 border border-blue-100 text-blue-600">Diagnosis Matrix</span>
                </div>
                <div className="w-full rounded-xl overflow-hidden mb-4 border border-slate-200 bg-slate-50 p-2 shadow-inner">
                  <div className="w-full h-28 rounded-lg overflow-hidden bg-slate-200">
                    <img src={selectedItem.image} alt={selectedItem.name} onError={(e) => { e.currentTarget.src = "https://placehold.co/600x300?text=Asset+Gambar"; }} className="w-full h-full object-cover" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-3 px-1 text-[9px] font-mono font-bold text-slate-500">
                    <div>SEBUM: {selectedItem.stats?.minyak}%</div>
                    <div>HYDRATION: {selectedItem.stats?.hidrasi}%</div>
                    <div>IRRITATION: {selectedItem.stats?.iritasi}%</div>
                  </div>
                </div>
                <h2 className="text-lg font-black text-slate-900 flex items-center gap-2 mb-2"><span>{selectedItem.icon}</span> {selectedItem.name}</h2>
                <p className="text-xs leading-relaxed text-slate-600 font-medium">{selectedItem.desc}</p>
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mb-2">💡 Karakteristik / Gejala:</div>
                  {activeTab === 'jenis_kulit' ? (
                    <ul className="space-y-1">
                      {selectedItem.karakteristik?.map((v, i) => <li key={i} className="text-xs text-slate-600 font-medium flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> {v}</li>)}
                    </ul>
                  ) : <p className="text-xs text-rose-800 bg-rose-50/50 p-2.5 rounded-lg border border-rose-100 font-medium">{selectedItem.gejala}</p>}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[8px] font-mono font-black text-emerald-600 uppercase tracking-widest">✅ Recommended</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.ingredients_recom?.map((ing, idx) => <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100/60 rounded text-[9px] font-bold">{ing}</span>)}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[8px] font-mono font-black text-rose-600 uppercase tracking-widest">❌ Avoid</span>
                  <div className="flex flex-wrap gap-1">
                    {selectedItem.ingredients_avoid?.map((ing, idx) => <span key={idx} className="px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-100/60 rounded text-[9px] font-bold">{ing}</span>)}
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 03: RECIPE */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/60 shadow-sm border-l-4 border-l-blue-600 flex flex-col justify-between">
              <div className="flex flex-col flex-grow gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-600 font-mono font-bold text-[10px] border border-blue-100">03</span>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-mono">Protocol</h3>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] font-mono font-bold uppercase rounded-md bg-amber-50 text-amber-700">Rx Terapi</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  {Object.entries(selectedItem.obat_split || {}).map(([kategori, detail], index) => (
                    <div key={index} className="p-3 bg-slate-50 border border-slate-200/70 rounded-xl shadow-inner flex flex-col gap-1">
                      <span className="text-[9px] font-mono font-black text-blue-600 uppercase tracking-widest">🔹 {kategori}</span>
                      <p className="text-xs font-bold text-slate-700 leading-relaxed pl-3 border-l-2 border-l-slate-300">{detail}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-auto pt-4 border-t border-slate-100 flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 bg-blue-50/40 border border-blue-100 rounded-xl flex flex-col">
                      <span className="text-[8px] font-mono font-bold text-blue-500 uppercase tracking-wider">⏱️ Durasi</span>
                      <span className="text-[11px] font-black text-slate-700">{selectedItem.durasi}</span>
                    </div>
                    <div className="p-2.5 bg-rose-50/40 border border-rose-100 rounded-xl flex flex-col">
                      <span className="text-[8px] font-mono font-bold text-rose-500 uppercase tracking-wider">🔒 Status</span>
                      <span className="text-[11px] font-black text-slate-700">Resep Medis</span>
                    </div>
                  </div>
                  <div className="p-3 bg-amber-50/30 border border-amber-100/60 rounded-xl">
                    <span className="text-[8px] font-mono font-bold text-amber-700 uppercase tracking-wider">👨‍⚕️ Catatan Dokter:</span>
                    <p className="text-[10px] text-slate-600 font-medium italic mt-1">"{selectedItem.edukasi}"</p>
                  </div>
                  <div className="p-2.5 bg-rose-50/50 border border-rose-100 rounded-xl flex gap-2 items-start">
                    <span className="text-xs">⚠️</span>
                    <p className="text-[10px] font-bold text-rose-800 leading-tight">{selectedItem.warning}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- 🌟 SLIDING FUN FACT FOOTER (7 SLIDES SEAMLESS TRANSITION) --- */}
        <footer className="mt-4 relative h-52 sm:h-44 overflow-hidden">
          {FUN_FACTS.map((fact, index) => {
            const isActive = index === currentFact;
            
            // Map pewarnaan garis atas & background badge secara dinamis
            const borderColors = {
              amber: 'border-t-amber-500', blue: 'border-t-blue-500', emerald: 'border-t-emerald-500',
              rose: 'border-t-rose-500', indigo: 'border-t-indigo-500', orange: 'border-t-orange-500', purple: 'border-t-purple-500'
            };
            const badgeColors = {
              amber: 'bg-amber-50 text-amber-600', blue: 'bg-blue-50 text-blue-600', emerald: 'bg-emerald-50 text-emerald-600',
              rose: 'bg-rose-50 text-rose-600', indigo: 'bg-indigo-50 text-indigo-600', orange: 'bg-orange-50 text-orange-600', purple: 'bg-purple-50 text-purple-600'
            };

            return (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
                  isActive ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-6 scale-95 pointer-events-none'
                }`}
              >
                <div className={`bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/60 shadow-sm border-t-4 h-full flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 ${borderColors[fact.color]}`}>
                  
                  {/* Bagian Kiri: Informasi Inti */}
                  <div className="flex-1 w-full">
                    <div className="flex items-center gap-3 mb-1.5">
                      <span className={`text-[9px] font-mono font-black uppercase tracking-widest px-2 py-0.5 rounded ${badgeColors[fact.color]}`}>
                        {fact.category}
                      </span>
                      <span className="text-lg">{fact.icon}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">{fact.title}</h4>
                    <p className="text-[11px] text-slate-500 font-medium mt-1 leading-relaxed max-w-4xl line-clamp-3 sm:line-clamp-2">
                      {fact.desc}
                    </p>
                  </div>
                  
                  {/* Pembatas Visual */}
                  <div className="hidden sm:block w-px h-14 bg-slate-100" />
                  
                  {/* Bagian Kanan: Konklusi & Pagination */}
                  <div className="w-full sm:w-1/4 flex sm:flex-col justify-between sm:justify-center items-center sm:items-end gap-2 shrink-0">
                    <div className="text-left sm:text-right">
                      <div className="text-[8px] font-mono font-black text-slate-400 uppercase tracking-widest">💡 DID YOU KNOW?</div>
                      <p className="text-[10px] text-slate-600 font-bold italic leading-tight mt-0.5">
                        {fact.footer}
                      </p>
                    </div>

                    {/* Navigasi Indikator Dots */}
                    <div className="flex gap-1 mt-1 shrink-0">
                      {FUN_FACTS.map((_, i) => (
                        <div 
                          key={i} 
                          className={`h-1.5 rounded-full transition-all duration-500 ${i === currentFact ? 'w-4 bg-blue-600' : 'w-1 bg-slate-200'}`} 
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