
import React, { useState, useEffect } from 'react';
import { UserProfile, DailyRecommendation } from '../types';
import { getDailyRecommendation } from '../services/geminiService';
import { DOMAINS } from '../constants';
import LeaderboardSnapshot from '../components/LeaderboardSnapshot';
import ProgressBar from '../components/ProgressBar';

interface HomeProps {
  user: UserProfile;
  onStartLesson: (topic: string, domain: string, extended: boolean) => void;
  onExplore: () => void;
}

const Home: React.FC<HomeProps> = ({ user, onStartLesson, onExplore }) => {
  const [rec, setRec] = useState<DailyRecommendation | null>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isExtended, setIsExtended] = useState(false);

  useEffect(() => {
    const fetchRec = async () => {
      setLoading(true);
      try {
        const recommendation = await getDailyRecommendation(user);
        setRec(recommendation);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchRec();
  }, [user]);

  const activeDomainsCount = Object.keys(user.mastery).length;
  const isArabic = user.language === 'ar';

  const quickActions = [
    { id: 'explore', label: isArabic ? 'استكشاف النطاقات' : 'Explore Domains', icon: '🔍', color: 'bg-blue-500/10 text-blue-400', action: onExplore },
    { id: 'achievements', label: isArabic ? 'إنجازاتي' : 'Achievements', icon: '🏆', color: 'bg-amber-500/10 text-amber-400', action: () => {} },
    { id: 'challenge', label: isArabic ? 'التحدي اليومي' : 'Daily Challenge', icon: '⚡', color: 'bg-emerald-500/10 text-emerald-400', action: () => rec && onStartLesson(rec.topic, rec.domain, true) },
    { id: 'ai', label: isArabic ? 'توصيات الذكاء' : 'AI Insights', icon: '🤖', color: 'bg-fuchsia-500/10 text-fuchsia-400', action: () => setIsExpanded(!isExpanded) },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in fade-in duration-1000">
      
      {/* LEFT COLUMN: Main Ingestion Feed */}
      <div className="lg:col-span-8 space-y-10">
        
        {/* Desktop Welcome Message */}
        <div className="hidden lg:block mb-4">
          <h1 className="text-5xl font-display font-black text-white leading-tight">
             Welcome back, <span className="text-violet-500">{user.username}</span>.
          </h1>
          <p className="text-slate-500 text-lg mt-2 font-light">Your knowledge lattice is evolving at 1.4x baseline.</p>
        </div>

        {/* Daily Protocol Card */}
        <section className="relative">
          {loading ? (
            <div className="glass rounded-[3rem] p-24 flex flex-col items-center justify-center gap-6 animate-pulse">
              <div className="w-16 h-16 bg-slate-800 rounded-full"></div>
              <div className="h-6 w-1/2 bg-slate-800 rounded-full"></div>
            </div>
          ) : (
            <div className={`transition-all duration-700 ease-out glass rounded-[3rem] border-2 border-violet-500/20 relative overflow-hidden group p-10 lg:p-14`}>
              <div className="absolute -top-12 -right-12 w-96 h-96 bg-violet-600/10 blur-[120px] rounded-full group-hover:bg-violet-600/20 transition-all"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-4 py-1.5 rounded-full bg-violet-600/20 text-violet-400 text-[10px] font-black uppercase tracking-widest border border-violet-500/30">
                    {isArabic ? 'بروتوكول اليوم' : 'Daily Protocol'}
                  </span>
                  {rec?.isFrontier && (
                     <span className="px-4 py-1.5 rounded-full bg-emerald-600/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">
                      {isArabic ? 'معرفة حدودية' : 'Frontier Node'}
                    </span>
                  )}
                </div>

                <h4 className="text-4xl lg:text-6xl font-display font-black text-white mb-6 leading-[1.1] group-hover:text-violet-400 transition-colors">
                  {rec?.topic || "Identifying Lattice Node..."}
                </h4>

                <p className="text-slate-400 text-lg lg:text-xl leading-relaxed italic border-l-4 border-violet-500/30 pl-6 py-2 mb-10 opacity-80">
                  "{rec?.reason}"
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button 
                    onClick={() => rec && onStartLesson(rec.topic, rec.domain, isExtended)}
                    className="flex-[2] py-6 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-3xl font-black text-sm lg:text-base uppercase tracking-[0.3em] shadow-2xl shadow-violet-900/30 hover:scale-[1.03] active:scale-95 transition-all text-white flex items-center justify-center gap-4"
                  >
                    {isArabic ? 'بدء المزامنة' : 'EXECUTE PROTOCOL'}
                    <span className="text-2xl">→</span>
                  </button>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="flex-1 py-6 bg-slate-900/50 border border-slate-800 rounded-3xl font-black text-xs text-slate-400 uppercase tracking-widest hover:bg-slate-800 transition-all backdrop-blur-md"
                  >
                    {isExpanded ? (isArabic ? 'إخلاق' : 'CLOSE INTEL') : (isArabic ? 'عرض' : 'VIEW INTEL')}
                  </button>
                </div>

                <div className={`overflow-hidden transition-all duration-700 ${isExpanded ? 'max-h-[500px] opacity-100 mt-10' : 'max-h-0 opacity-0'}`}>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-8">
                      <button 
                        onClick={() => setIsExtended(false)}
                        className={`p-6 rounded-3xl border-2 text-left transition-all ${!isExtended ? 'bg-violet-600/10 border-violet-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                      >
                         <h5 className="font-black uppercase tracking-widest text-xs mb-2">Micro Synthesis</h5>
                         <p className="text-[10px] opacity-70">A 200-word rapid injection for foundational understanding.</p>
                      </button>
                      <button 
                        onClick={() => setIsExtended(true)}
                        className={`p-6 rounded-3xl border-2 text-left transition-all ${isExtended ? 'bg-indigo-600/10 border-indigo-500 text-white' : 'bg-slate-900 border-slate-800 text-slate-500'}`}
                      >
                         <h5 className="font-black uppercase tracking-widest text-xs mb-2">Extended Archive</h5>
                         <p className="text-[10px] opacity-70">Detailed conceptual analysis with advanced resource linking.</p>
                      </button>
                   </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Quick Action Matrix (Wider for PC) */}
        <section>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
             {quickActions.map((action) => (
               <button 
                 key={action.id}
                 onClick={action.action}
                 className="glass group rounded-[2.5rem] p-8 border border-slate-800/50 flex flex-col items-center gap-4 hover:border-violet-500/40 transition-all hover:-translate-y-2 shadow-xl"
               >
                 <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl transition-all group-hover:scale-110 shadow-lg ${action.color}`}>
                   {action.icon}
                 </div>
                 <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 group-hover:text-white transition-colors">
                   {action.label}
                 </span>
               </button>
             ))}
          </div>
        </section>

        {/* Domain Matrix (Horizontal Scroller) */}
        <section className="overflow-hidden">
          <div className="flex justify-between items-center mb-8 px-2">
            <h3 className="text-xs font-display font-black tracking-[0.4em] uppercase text-slate-500">
              {isArabic ? 'نطاقات المعرفة' : 'Knowledge Matrices'}
            </h3>
            <button onClick={onExplore} className="text-[10px] font-black text-violet-400 uppercase tracking-widest hover:text-white transition-colors">
              {isArabic ? 'عرض الكل' : 'View Global Matrix'}
            </button>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-10 scrollbar-hide -mx-2 px-2">
            {DOMAINS.map((d) => (
              <div 
                key={d.type}
                onClick={() => onStartLesson(d.type, d.type, false)}
                className="flex-shrink-0 w-44 lg:w-56 glass rounded-[2.5rem] p-8 border border-slate-800 hover:border-violet-500/50 transition-all cursor-pointer group hover:-translate-y-2"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 transition-transform inline-block">{d.icon}</div>
                <h5 className="text-sm font-black text-slate-100 mb-4 uppercase tracking-tighter line-clamp-1">{d.type}</h5>
                <div className="h-1.5 w-full bg-slate-900/80 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-violet-500 shadow-[0_0_15px_rgba(139,92,246,0.6)]" 
                    style={{ width: `${user.mastery[d.type] || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* RIGHT COLUMN: Neural Analytics (Desktop Only Sidebar) */}
      <div className="lg:col-span-4 space-y-8">
        
        {/* Streak & Core Vitals */}
        <div className="glass rounded-[3rem] p-10 border border-slate-800/50 flex flex-col items-center gap-6 text-center">
            <div className="relative group cursor-pointer">
              <div className="absolute inset-0 bg-amber-500/20 blur-3xl rounded-full animate-pulse group-hover:bg-amber-500/40"></div>
              <div className="relative z-10 w-32 h-32 rounded-full glass border-4 border-amber-500/50 flex flex-col items-center justify-center gap-1 group-hover:scale-110 transition-transform shadow-2xl shadow-amber-900/20">
                 <span className="text-4xl">🔥</span>
                 <span className="text-3xl font-display font-black text-white">{user.streak}</span>
              </div>
            </div>
            <div>
               <h3 className="text-xl font-display font-black text-white uppercase tracking-widest">
                  {user.streak} Day Pulse
               </h3>
               <p className="text-xs text-slate-500 mt-2 uppercase tracking-widest font-bold">Lattice Alignment: Optimal</p>
            </div>
            
            <div className="w-full h-px bg-slate-800/50"></div>

            <div className="w-full space-y-4">
               <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                  <span>Level Tier {user.level}</span>
                  <span>XP Velocity: High</span>
               </div>
               <ProgressBar progress={75} colorClass="bg-gradient-to-r from-violet-600 to-indigo-600" />
            </div>
        </div>

        {/* Intelligence Sidebar: Focus Domains */}
        <section className="glass rounded-[3rem] p-8 border border-slate-800/50">
          <h3 className="text-[10px] font-display font-black tracking-[0.4em] uppercase text-slate-500 mb-8 text-center">
            {isArabic ? 'أعلى نطاقاتك' : 'Core Mastery focus'}
          </h3>
          <div className="space-y-8">
            {DOMAINS.slice(0, 4).map((d) => (
              <div key={d.type} className="group">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-xs font-black text-slate-300 flex items-center gap-3">
                    <span className="text-xl group-hover:scale-125 transition-transform">{d.icon}</span> {d.type}
                  </span>
                  <span className="text-xs font-mono text-violet-400 font-bold">{user.mastery[d.type] || 0}%</span>
                </div>
                <ProgressBar progress={user.mastery[d.type] || 0} colorClass={`bg-gradient-to-r ${d.color}`} />
              </div>
            ))}
          </div>
        </section>

        {/* Intelligence Sidebar: Rankings */}
        <section>
          <LeaderboardSnapshot user={user} />
        </section>
      </div>
    </div>
  );
};

export default Home;
