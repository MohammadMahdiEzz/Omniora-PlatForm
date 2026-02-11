import React, { useState } from 'react';
import { UserProfile, AppLanguage } from '../types';
import { getXPForLevel, setLanguage, toggleNotifications } from '../services/dbService';
import Heatmap from '../components/Heatmap';
import ProgressBar from '../components/ProgressBar';
import { DOMAINS } from '../constants';

interface ProfileProps {
  user: UserProfile;
  onUpdate: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [analyticsView, setAnalyticsView] = useState<'daily' | 'monthly'>('daily');
  const isArabic = user.language === 'ar';

  const currentLevelXP = getXPForLevel(user.level);
  const nextLevelXP = getXPForLevel(user.level + 1);
  const progress = ((user.xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100;
  
  const handleLangChange = (lang: AppLanguage) => {
    setLanguage(lang);
    onUpdate();
  };

  const domainMastery = DOMAINS.map(d => ({
    ...d,
    mastery: user.mastery[d.type] || 0
  })).sort((a,b) => b.mastery - a.mastery);

  return (
    <div className={`space-y-8 animate-in fade-in duration-500 pb-32 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      {/* Header */}
      <section className="text-center pt-8">
        <div className="relative inline-block mb-4">
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-600 to-indigo-700 flex items-center justify-center text-4xl shadow-2xl border border-violet-400/20 rotate-3">
            <span className="-rotate-3">🧠</span>
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-slate-950 neon-glow">
            LVL {user.level}
          </div>
        </div>
        <h1 className="text-3xl font-display font-black text-white">{user.username}</h1>
        <p className="text-slate-500 text-[10px] uppercase tracking-[0.3em] mt-1 font-mono">
          {isArabic ? 'إجمالي الطاقة المعرفية' : 'Total Cognitive Power'}: {user.xp.toLocaleString()}
        </p>
      </section>

      {/* Analytics Tabs */}
      <section className="glass rounded-3xl p-6 border border-slate-800">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-[10px] font-display font-black tracking-widest uppercase text-slate-300">
            {isArabic ? 'تحليلات الأداء' : 'Performance Analytics'}
          </h3>
          <div className="flex gap-1 bg-slate-950 p-1 rounded-lg">
             <button 
               onClick={() => setAnalyticsView('daily')}
               className={`px-2 py-1 text-[8px] font-bold uppercase rounded-md transition-all ${analyticsView === 'daily' ? 'bg-violet-600 text-white' : 'text-slate-600'}`}
             >Daily</button>
             <button 
               onClick={() => setAnalyticsView('monthly')}
               className={`px-2 py-1 text-[8px] font-bold uppercase rounded-md transition-all ${analyticsView === 'monthly' ? 'bg-violet-600 text-white' : 'text-slate-600'}`}
             >Monthly</button>
          </div>
        </div>
        
        {analyticsView === 'daily' ? (
          <Heatmap activity={user.dailyActivity} />
        ) : (
          <div className="space-y-3">
             {Object.entries(user.analytics.monthlyXP).slice(-4).map(([month, xp]) => (
               <div key={month} className="flex items-center gap-4">
                  <span className="text-[10px] font-mono text-slate-500 w-16">{month}</span>
                  <div className="flex-1 h-3 bg-slate-900 rounded-full overflow-hidden">
                    {/* Fixed arithmetic error: Ensure xp is treated as a number for division by casting to number */}
                    <div className="h-full bg-indigo-500" style={{ width: `${Math.min(100, ((xp as number) / 10000) * 100)}%` }}></div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">{xp} XP</span>
               </div>
             ))}
          </div>
        )}
      </section>

      {/* Mastery High-Density Grid */}
      <section className="space-y-4">
        <h3 className="text-[10px] font-display font-black tracking-widest uppercase text-slate-400 px-1">
          {isArabic ? 'خريطة الإتقان' : 'Mastery Matrix'}
        </h3>
        <div className="grid grid-cols-1 gap-2">
          {domainMastery.slice(0, 8).map(d => (
            <div key={d.type} className="glass rounded-xl p-3 border border-slate-800/50 flex items-center gap-4 group">
               <span className="text-xl group-hover:scale-125 transition-transform">{d.icon}</span>
               <div className="flex-1">
                 <div className="flex justify-between items-end mb-1">
                    <span className="text-[10px] font-bold text-slate-300">{d.type}</span>
                    <span className="text-[10px] font-mono text-violet-400">{d.mastery}%</span>
                 </div>
                 <div className="h-1 bg-slate-900 rounded-full overflow-hidden">
                   <div className={`h-full bg-gradient-to-r ${d.color}`} style={{ width: `${d.mastery}%` }}></div>
                 </div>
               </div>
            </div>
          ))}
        </div>
      </section>

      {/* Settings section */}
      <section className="glass rounded-3xl p-6 border border-slate-800 space-y-6">
        <div>
          <h3 className="text-[10px] font-display font-black tracking-widest uppercase text-slate-300 mb-4">
            {isArabic ? 'توطين النواة' : 'Kernel Localization'}
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {(['en', 'ar'] as AppLanguage[]).map((lang) => (
              <button
                key={lang}
                onClick={() => handleLangChange(lang)}
                className={`py-3 rounded-2xl border-2 transition-all text-[10px] font-black uppercase tracking-widest ${
                  user.language === lang 
                    ? 'border-violet-500 bg-violet-600/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.1)]' 
                    : 'border-slate-800 bg-slate-950/40 text-slate-500 hover:border-slate-700'
                }`}
              >
                {lang === 'en' ? 'English' : 'العربية'}
              </button>
            ))}
          </div>
        </div>

        <div>
           <h3 className="text-[10px] font-display font-black tracking-widest uppercase text-slate-300 mb-4">
            {isArabic ? 'التنبيهات العصبية' : 'Neural Broadcasts'}
          </h3>
          <button 
            onClick={() => { toggleNotifications(); onUpdate(); }}
            className={`w-full py-4 rounded-2xl border-2 transition-all flex items-center justify-between px-6 ${
              user.notificationsEnabled ? 'border-violet-500/40 bg-violet-600/5' : 'border-slate-800 bg-slate-950/40'
            }`}
          >
            <span className={`text-[10px] font-black uppercase tracking-widest ${user.notificationsEnabled ? 'text-violet-400' : 'text-slate-500'}`}>
               {user.notificationsEnabled ? (isArabic ? 'نشط' : 'Active') : (isArabic ? 'معطل' : 'Silenced')}
            </span>
            <div className={`w-10 h-5 rounded-full relative transition-colors ${user.notificationsEnabled ? 'bg-violet-600' : 'bg-slate-800'}`}>
              <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${user.notificationsEnabled ? 'left-6' : 'left-1'}`}></div>
            </div>
          </button>
        </div>
      </section>

      {/* Operation Log */}
      {user.history.length > 0 && (
          <section className="glass rounded-3xl p-6 border border-slate-800">
             <h3 className="text-[10px] font-display font-black tracking-widest uppercase text-slate-300 mb-4">
               {isArabic ? 'سجل العمليات المعرفية' : 'Cognitive Operation Log'}
             </h3>
             <div className="space-y-3">
                 {user.history.slice(0, 5).map(log => (
                     <div key={log.id} className="flex items-center justify-between text-[10px] border-b border-slate-800/50 pb-2">
                         <div className="flex flex-col">
                             <span className="text-slate-200 font-bold">{log.conceptTitle}</span>
                             <span className="text-slate-500 uppercase text-[8px]">{log.domain} • {new Date(log.timestamp).toLocaleDateString()}</span>
                         </div>
                         <div className="text-emerald-400 font-black">+{log.xpEarned} XP</div>
                     </div>
                 ))}
             </div>
          </section>
      )}
    </div>
  );
};

export default Profile;