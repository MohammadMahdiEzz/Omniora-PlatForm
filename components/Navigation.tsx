
import React from 'react';
import { AppLanguage } from '../types';

interface NavigationProps {
  currentTab: string;
  setTab: (tab: string) => void;
  language?: AppLanguage;
}

const Navigation: React.FC<NavigationProps> = ({ currentTab, setTab, language = 'en' }) => {
  const isArabic = language === 'ar';

  const tabs = [
    { id: 'home', icon: '🏠', label_en: 'Home', label_ar: 'الرئيسية' },
    { id: 'explore', icon: '🔍', label_en: 'Explore', label_ar: 'استكشاف' },
    { id: 'profile', icon: '👤', label_en: 'Profile', label_ar: 'الملف' },
    { id: 'admin', icon: '🛠️', label_en: 'Nexus', label_ar: 'النواة' },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <nav className={`hidden lg:flex flex-col fixed h-screen w-64 bg-[#020617] border-slate-800/50 z-50 p-6 ${isArabic ? 'right-0 border-l' : 'left-0 border-r'}`}>
        <div className="mb-12 px-2">
            <div className="font-display font-black text-2xl tracking-tighter text-white">
                OMNI<span className="text-violet-500">ORA</span>
            </div>
            <div className="mt-2 text-[8px] font-black uppercase tracking-[0.3em] text-slate-600">Cognitive Hub v3.1</div>
        </div>

        <div className="flex-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all group ${
                currentTab === tab.id 
                  ? 'bg-violet-600/10 text-violet-400 border border-violet-500/20 shadow-lg shadow-violet-950/20' 
                  : 'text-slate-500 hover:text-slate-200 hover:bg-slate-900/50'
              }`}
            >
              <span className={`text-xl transition-transform group-hover:scale-110 ${currentTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-xs font-black uppercase tracking-widest">
                {isArabic ? tab.label_ar : tab.label_en}
              </span>
              {currentTab === tab.id && (
                <div className={`ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,1)] ${isArabic ? 'mr-auto ml-0' : ''}`}></div>
              )}
            </button>
          ))}
        </div>

        <div className="pt-8 border-t border-slate-800/50">
           <div className="glass p-4 rounded-2xl">
              <p className="text-[10px] font-bold text-slate-500 uppercase mb-2">System Health</p>
              <div className="flex gap-1">
                 <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
                 <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
                 <div className="h-1 flex-1 bg-emerald-500 rounded-full"></div>
                 <div className="h-1 flex-1 bg-slate-800 rounded-full"></div>
              </div>
           </div>
        </div>
      </nav>

      {/* Mobile Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-slate-800/80 backdrop-blur-2xl pb-safe z-50">
        <div className="flex justify-around items-center h-20 max-w-lg mx-auto px-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className={`flex flex-col items-center justify-center w-16 h-16 rounded-2xl transition-all ${
                currentTab === tab.id ? 'text-violet-400 bg-violet-600/10' : 'text-slate-500'
              }`}
            >
              <span className={`text-2xl transition-transform ${currentTab === tab.id ? 'scale-110' : ''}`}>
                {tab.icon}
              </span>
              <span className="text-[8px] font-black mt-1.5 uppercase tracking-widest">
                {isArabic ? tab.label_ar : tab.label_en}
              </span>
            </button>
          ))}
        </div>
      </nav>
    </>
  );
};

export default Navigation;
