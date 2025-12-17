"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Repeat, GitCommit, MessageSquare, Settings, ChevronRight, PenTool, MapPin, Eye, EyeOff, LayoutGrid, Award, Heart, Share2, MoreHorizontal } from 'lucide-react';
import Image from 'next/image';

// --- Types & Constants ---
const TABS = {
  TRACE: 'trace',
  THOUGHTS: 'thoughts',
  SETTINGS: 'settings'
};

// --- Mock Data ---
const PROFILE_USER = {
  name: "Zarina Odilova",
  username: "zarina_reads",
  avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
  bio: "📚 Kitoblar dunyosida sayohat | 📍 Toshkent\n✨ \"O'qiganim sari, anglaganim ortadi.\"",
  isFikrdosh: true,
  stats: {
    read: 42,
    handovers: 15,
    traces: 27,
    thoughts: 108
  }
};

const CURRENT_READ = {
  title: "Alximik",
  author: "Paulo Koelo",
  cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?q=80&w=800&auto=format&fit=crop",
  progress: 65,
  prevReaders: 4,
  lineage: ["Ali", "Bobur", "Zarina"]
};

// --- Main Component ---
export default function MobileProfilePage() {
  const [activeTab, setActiveTab] = useState(TABS.TRACE);
  const [settings, setSettings] = useState({
    visibility: 'emotional',
    allowHandover: true,
    showCity: true
  });

  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const ProfileSkeleton = () => (
    <div className="min-h-screen bg-white dark:bg-slate-900 animate-pulse">
        {/* Header Skeleton */}
        <div className="pt-8 pb-4 px-5">
            <div className="flex items-center gap-6 mb-4">
                <div className="w-24 h-24 bg-gray-200 dark:bg-slate-800 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-3">
                    <div className="flex justify-between pr-4">
                        {[1,2,3].map(i => <div key={i} className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-lg" />)}
                    </div>
                    <div className="flex gap-2">
                        <div className="flex-1 h-8 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                        <div className="w-8 h-8 bg-gray-200 dark:bg-slate-800 rounded-lg" />
                    </div>
                </div>
            </div>
            <div className="px-1 space-y-2">
                <div className="w-40 h-6 bg-gray-200 dark:bg-slate-800 rounded" />
                <div className="w-24 h-4 bg-gray-200 dark:bg-slate-800 rounded" />
                <div className="w-full h-12 bg-gray-200 dark:bg-slate-800 rounded" />
            </div>
        </div>
        
        {/* Stats Skeleton */}
        <div className="px-5 mb-6 flex gap-3 overflow-hidden">
             {[1,2,3].map(i => <div key={i} className="min-w-[70px] h-20 bg-gray-200 dark:bg-slate-800 rounded-full" />)}
        </div>
        
        {/* Tabs Skeleton */}
        <div className="border-b border-gray-100 dark:border-slate-800 mt-2 px-2 flex justify-around py-3">
            {[1,2,3].map(i => <div key={i} className="w-20 h-8 bg-gray-200 dark:bg-slate-800 rounded" />)}
        </div>
        
        {/* Content Skeleton (Trace View) */}
        <div className="px-5 pt-6 space-y-6">
            <div className="w-full h-48 bg-gray-200 dark:bg-slate-800 rounded-3xl" />
            <div className="space-y-4 text-center">
                 <div className="w-32 h-6 bg-gray-200 dark:bg-slate-800 rounded mx-auto" />
                 <div className="space-y-4 pl-6 border-l-2 border-dashed border-gray-200 dark:border-slate-800 ml-3">
                      {[1,2,3].map(i => (
                          <div key={i} className="flex gap-4">
                              <div className="w-10 h-10 bg-gray-200 dark:bg-slate-800 rounded-full" />
                              <div className="space-y-2 flex-1 pt-1">
                                  <div className="w-32 h-4 bg-gray-200 dark:bg-slate-800 rounded" />
                                  <div className="w-20 h-3 bg-gray-200 dark:bg-slate-800 rounded" />
                              </div>
                          </div>
                      ))}
                 </div>
            </div>
        </div>
    </div>
  );

  if (loading) return <ProfileSkeleton />;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 pb-24 font-sans text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      {/* 1. Header Section (Instagram Style) */}
      <HeaderSection user={PROFILE_USER} />

      {/* 2. Quiet Stats */}
      <StatsSection stats={PROFILE_USER.stats} />

      {/* 3. Navigation Tabs */}
      <div className="sticky top-[72px] z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-slate-100 dark:border-slate-800 mt-2 transition-colors">
        <div className="flex justify-around items-center px-2">
          <TabButton 
            active={activeTab === TABS.TRACE} 
            onClick={() => setActiveTab(TABS.TRACE)}
            icon={<LayoutGrid size={24} />}
            label="Izlar"
          />
          <TabButton 
            active={activeTab === TABS.THOUGHTS} 
            onClick={() => setActiveTab(TABS.THOUGHTS)}
            icon={<PenTool size={24} />}
            label="Fikrlar"
          />
          <TabButton 
            active={activeTab === TABS.SETTINGS} 
            onClick={() => setActiveTab(TABS.SETTINGS)}
            icon={<Settings size={24} />}
            label="Sozlamalar"
          />
        </div>
      </div>

      {/* 4. Content Area */}
      <div className="px-5 pt-6">
        <AnimatePresence mode="wait">
          {activeTab === TABS.TRACE && (
             <TraceView key="trace" currentRead={CURRENT_READ} />
          )}
          {activeTab === TABS.THOUGHTS && (
             <ThoughtsView key="thoughts" />
          )}
          {activeTab === TABS.SETTINGS && (
             <SettingsView key="settings" settings={settings} setSettings={setSettings} />
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}

// --- Sub-Components ---

const HeaderSection = ({ user }) => (
  <div className="pt-8 pb-4 px-5">
    <div className="flex items-center gap-6 mb-4">
        {/* Avatar */}
        <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-full p-[3px] bg-gradient-to-tr from-[#52C6DA] via-purple-400 to-orange-400">
                <div className="w-full h-full rounded-full border-2 border-white overflow-hidden relative">
                    <Image src={user.avatar} alt={user.name} fill className="object-cover" unoptimized />
                </div>
            </div>
            {user.isFikrdosh && (
                <div className="absolute -bottom-1 -right-1 bg-[#52C6DA] text-white p-1.5 rounded-full border-2 border-white dark:border-slate-900 shadow-sm">
                    <Award size={14} fill="currentColor" />
                </div>
            )}
        </div>

        {/* Stats & Actions */}
        <div className="flex-1 min-w-0">
             <div className="flex justify-between items-center mb-2 pr-4">
                 <div className="text-center">
                     <span className="block font-extrabold text-lg text-slate-800 dark:text-white">{user.stats.read}</span>
                     <span className="text-xs font-bold text-slate-400">Kitob</span>
                 </div>
                 <div className="text-center">
                     <span className="block font-extrabold text-lg text-slate-800 dark:text-white">{user.stats.traces}</span>
                     <span className="text-xs font-bold text-slate-400">Izlar</span>
                 </div>
                 <div className="text-center">
                     <span className="block font-extrabold text-lg text-slate-800 dark:text-white">{user.stats.thoughts}</span>
                     <span className="text-xs font-bold text-slate-400">Fikr</span>
                 </div>
             </div>
             
             <div className="flex gap-2">
                 <button className="flex-1 bg-[#52C6DA] text-white text-sm font-bold py-1.5 rounded-lg shadow-sm active:scale-95 transition-transform">
                     Tahrirlash
                 </button>
                 <button className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 p-1.5 rounded-lg active:scale-95 transition-transform hover:bg-slate-200 dark:hover:bg-slate-700">
                     <Share2 size={18} />
                 </button>
             </div>
        </div>
    </div>

    {/* Bio Section */}
    <div className="px-1">
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white leading-tight">{user.name}</h1>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">@{user.username}</p>
        <p className="text-sm text-slate-700 dark:text-slate-300 font-medium whitespace-pre-line leading-snug">{user.bio}</p>
    </div>
  </div>
);

const StatsSection = ({ stats }) => {
  // Keeping Quiet Stats as a highlight reel
  const highlights = [
    { label: "O‘qilmoqda", icon: <BookOpen size={16} />, color: "bg-blue-100 text-blue-600", border: "border-blue-200" },
    { label: "Bitirganlarim", icon: <Award size={16} />, color: "bg-green-100 text-green-600", border: "border-green-200" },
    { label: "Sevimlilar", icon: <Heart size={16} />, color: "bg-red-100 text-red-600", border: "border-red-200" },
  ];

  return (
    <div className="px-5 mb-2 overflow-x-auto no-scrollbar">
       <div className="flex gap-3 pb-2">
           {highlights.map((item, idx) => (
             <div key={idx} className="flex flex-col items-center gap-1 min-w-[70px]">
                 <div className={`w-16 h-16 rounded-full flex items-center justify-center border-[2px] ${item.border} dark:border-opacity-30 p-1`}>
                    <div className={`w-full h-full rounded-full ${item.color} dark:bg-opacity-20 flex items-center justify-center`}>
                        {item.icon}
                    </div>
                 </div>
                 <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
             </div>
           ))}
       </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className="flex-1 flex flex-col items-center gap-1 py-3 relative group"
  >
    <div className={`transition-colors duration-300 ${active ? "text-[#52C6DA]" : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"}`}>
        {icon}
    </div>
    {active && (
        <motion.div 
            layoutId="activeProfileTab"
            className="absolute bottom-0 w-1/2 h-0.5 bg-[#52C6DA] rounded-full"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
    )}
  </button>
);

// --- Views ---

const TraceView = ({ currentRead }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
    
    {/* Current Read Card */}
    <div className="bg-gradient-to-br from-[#52C6DA]/10 to-blue-50/50 rounded-3xl p-5 shadow-sm border border-[#52C6DA]/20 mb-8 relative overflow-hidden">
       {/* Background accent */}
       <div className="absolute -right-10 -top-10 w-40 h-40 bg-[#52C6DA]/10 rounded-full blur-2xl"></div>

       <div className="flex justify-between items-center mb-4 relative z-10">
            <h3 className="text-xs font-extrabold text-[#52C6DA] uppercase tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#52C6DA] animate-pulse"></span>
                Hozir qo&apos;limda
            </h3>
            <MoreHorizontal size={20} className="text-slate-400" />
       </div>
       
       <div className="flex gap-5 relative z-10">
         <div className="w-28 h-40 rounded-xl overflow-hidden shadow-lg flex-shrink-0 border-2 border-white transform -rotate-2">
            <Image src={currentRead.cover} alt={currentRead.title} fill className="object-cover" unoptimized />
         </div>
         <div className="flex-1 flex flex-col justify-between py-1">
            <div>
               <h2 className="text-2xl font-extrabold text-slate-800 dark:text-white leading-none mb-1 font-serif">{currentRead.title}</h2>
               <p className="text-sm text-slate-500 dark:text-slate-300 font-bold mb-4">{currentRead.author}</p>
               
               <div className="flex items-center gap-2 mb-1">
                   <span className="text-2xl font-extrabold text-[#52C6DA]">{currentRead.progress}%</span>
               </div>
               <div className="w-full bg-white h-2 rounded-full overflow-hidden shadow-inner">
                 <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${currentRead.progress}%` }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="bg-[#52C6DA] h-full rounded-full"
                 />
               </div>
            </div>
         </div>
       </div>

       <div className="mt-5 flex gap-3">
         <button className="flex-1 py-3 text-sm font-bold text-white bg-[#52C6DA] rounded-xl shadow-lg shadow-[#52C6DA]/30 hover:bg-[#4dbdd1] transition-all active:scale-95">
            O&apos;qishni davom etish
         </button>
       </div>
    </div>

    {/* Animated Lineage */}
    <div className="pl-2">
      <h3 className="text-lg font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
         <GitCommit size={24} className="text-[#52C6DA]" />
         Kitob Shajarasi
      </h3>
      
      <div className="relative pl-6 space-y-8 border-l-2 border-dashed border-slate-200 dark:border-slate-700 ml-3">
        {currentRead.lineage.map((name, i) => (
            <motion.div 
                key={i} 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative"
            >
               <div className={`absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-white dark:border-slate-900 shadow-sm z-10 
                   ${name === "Zarina" ? "bg-[#52C6DA] animate-bounce" : "bg-slate-300 dark:bg-slate-600"}`}>
               </div>
               
               <div className="flex items-center gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow">
                   <div className="w-10 h-10 rounded-full bg-slate-100 relative overflow-hidden">
                        <Image src={`https://placehold.co/100x100/e2e8f0/1e293b?text=${name[0]}`} alt={name} fill className="object-cover" unoptimized/>
                   </div>
                   <div>
                       <h4 className={`font-bold text-sm ${name === "Zarina" ? "text-[#52C6DA]" : "text-slate-800 dark:text-slate-200"}`}>
                           {name === "Zarina" ? "Siz (Hozirgi egasi)" : `${name} (Oldingi o'quvchi)`}
                       </h4>
                       <p className="text-[10px] text-slate-400 font-bold">20.12.2023</p>
                   </div>
               </div>
            </motion.div>
        ))}
        {/* Next placeholder */}
        <div className="relative opacity-50">
            <div className="absolute -left-[31px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 z-10"></div>
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl border border-slate-100 dark:border-slate-700 border-dashed text-center">
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500">Keyingi o&apos;quvchi siz bo&apos;lishingiz mumkin...</span>
            </div>
        </div>
      </div>
    </div>

  </motion.div>
);

const ThoughtsView = () => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
    <div className="text-center py-2 mb-2">
       <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Qoldirilgan izlar</h3>
       <p className="text-xs font-bold text-slate-400 dark:text-slate-500">Kitoblar hoshiyasidagi bitiklar</p>
    </div>

    {[
        { text: "“Ikki eshik orasidagi zulmat... bu jumlani endi tushundim.”", book: "Ikki eshik orasi", color: "bg-purple-50 text-purple-800 border-purple-100" },
        { text: "“Qalbingni tingla, u hamma narsani biladi.”", book: "Alximik", color: "bg-amber-50 text-amber-800 border-amber-100" },
        { text: "“Baxt manzil emas, yo'l.”", book: "Baxtiyorlik san'ati", color: "bg-blue-50 text-blue-800 border-blue-100" }
    ].map((thought, idx) => (
        <motion.div 
            key={idx} 
            whileHover={{ scale: 1.02 }}
            className={`p-6 rounded-3xl border relative shadow-sm transition-colors ${thought.color.split(' ')[2]} ${thought.color.split(' ')[0]} dark:bg-opacity-10 dark:border-opacity-20`}
        >
            <div className="absolute top-4 left-4 text-5xl opacity-20 font-serif leading-none dark:text-white">“</div>
            <p className={`text-base font-bold italic relative z-10 leading-relaxed ${thought.color.split(' ')[1]} dark:text-slate-200`}>{thought.text}</p>
            <div className="mt-4 flex justify-end">
                <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full">
                    {thought.book}
                </span>
            </div>
        </motion.div>
    ))}
  </motion.div>
);

const SettingsView = ({ settings, setSettings }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
     
     <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
            <Settings size={20} className="text-slate-400"/>
            Sozlamalar
        </h3>
        
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center"><Eye size={20}/></div>
                    <div>
                        <p className="font-bold text-sm text-slate-900 dark:text-white">Ko‘rinish darajasi</p>
                        <p className="text-[10px] font-medium text-slate-400">Profil maxfiyligi</p>
                    </div>
                </div>
                <select 
                    value={settings.visibility}
                    onChange={(e) => setSettings({...settings, visibility: e.target.value})}
                    className="bg-slate-50 dark:bg-slate-700 border-none text-xs font-extrabold text-slate-700 dark:text-slate-200 rounded-xl py-2 px-3 focus:ring-0 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
                >
                    <option value="minimal">Minimal</option>
                    <option value="emotional">Emotsional</option>
                    <option value="full">To‘liq</option>
                </select>
            </div>
            
            <div className="h-[1px] bg-slate-50 dark:bg-slate-700 w-full" />

            <ToggleRow 
                label="Joylashuv" 
                sub="Shaharni ko'rsatish"
                checked={settings.showCity}
                onChange={() => setSettings({...settings, showCity: !settings.showCity})}
                icon={<MapPin size={20}/>}
                color="text-orange-600 bg-orange-50"
            />
        </div>
     </div>

     <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-sm border border-slate-100 dark:border-slate-700">
        <h3 className="font-extrabold text-slate-800 dark:text-white mb-6">Muloqot</h3>
        <ToggleRow 
             label="Qo‘ldan-qo‘lga" 
             sub="Kitob almashishga ruxsat"
             checked={settings.allowHandover}
             onChange={() => setSettings({...settings, allowHandover: !settings.allowHandover})}
             icon={<Repeat size={20}/>}
             color="text-green-600 bg-green-50"
        />
     </div>
    
     <div className="text-center mt-8 pb-8">
        <button className="text-red-500 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/20 px-6 py-3 rounded-xl transition-colors w-full border border-red-100 dark:border-red-900/30">
            Profildan Chiqish
        </button>
     </div>
  </motion.div>
);

const ToggleRow = ({ label, sub, checked, onChange, icon, color }) => (
    <div className="flex items-center justify-between cursor-pointer" onClick={onChange}>
        <div className="flex gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${checked ? color + ' dark:bg-opacity-20' : 'bg-slate-50 dark:bg-slate-700 text-slate-400'}`}>
                {icon}
            </div>
            <div className="max-w-[150px]">
                <p className="font-bold text-sm text-slate-900 dark:text-white">{label}</p>
                <p className="text-[10px] font-medium text-slate-400 leading-tight mt-0.5">{sub}</p>
            </div>
        </div>
        <div className={`w-12 h-7 rounded-full relative transition-colors duration-300 ${checked ? 'bg-[#52C6DA]' : 'bg-slate-200 dark:bg-slate-700'}`}>
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ${checked ? 'left-6' : 'left-1'}`}></div>
        </div>
    </div>
);
