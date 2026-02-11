
import React, { useState } from 'react';
import { Concept, AppLanguage } from '../types';

interface LessonViewProps {
  concept: Concept;
  onComplete: () => void;
  onBack: () => void;
  onStartLesson: (topic: string, domain: string, extended: boolean) => void;
  initialExtended?: boolean;
  language: AppLanguage;
}

const LessonView: React.FC<LessonViewProps> = ({ 
  concept, onComplete, onBack, onStartLesson, initialExtended = false, language 
}) => {
  const [useExtended, setUseExtended] = useState(initialExtended && !!concept.extendedLesson_en);
  
  const isArabic = language === 'ar';
  
  const title = isArabic ? concept.title_ar : concept.title_en;
  const lesson = useExtended 
    ? (isArabic ? (concept.extendedLesson_ar || concept.lesson_ar) : (concept.extendedLesson_en || concept.lesson_en))
    : (isArabic ? concept.lesson_ar : concept.lesson_en);

  const uiLabels = {
    exit: isArabic ? 'خروج' : 'Exit',
    deepDive: isArabic ? 'توسيع الإدراك' : 'Expand Awareness',
    micro: isArabic ? 'موجز' : 'Summary',
    testReady: isArabic ? 'هل أنت مستعد لمزامنة المعرفة؟' : 'Ready to sync knowledge?',
    takeChallenge: isArabic ? 'بدء التحقق' : 'Initiate Verification',
    adjacentNodes: isArabic ? 'عقد معرفية مرتبطة' : 'Linked Cognitive Nodes',
    deepResources: isArabic ? 'مصادر معمقة' : 'Advanced Resource Matrix'
  };

  return (
    <div className={`min-h-screen pb-32 animate-in slide-in-from-bottom duration-500 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="flex justify-between items-center mb-6">
          <button 
            onClick={onBack}
            className="flex items-center text-slate-500 hover:text-white transition-colors gap-2 group text-[10px] font-bold uppercase tracking-widest"
          >
            {!isArabic && <span className="group-hover:-translate-x-1 transition-transform">←</span>}
            {uiLabels.exit}
            {isArabic && <span className="group-hover:translate-x-1 transition-transform">→</span>}
          </button>
          
          {(concept.extendedLesson_en || concept.extendedLesson_ar) && (
              <button 
                onClick={() => setUseExtended(!useExtended)}
                className="text-[8px] font-black text-violet-400 uppercase tracking-widest border border-violet-500/30 px-4 py-1.5 rounded-full hover:bg-violet-500/10 transition-all"
              >
                  {useExtended ? uiLabels.micro : uiLabels.deepDive}
              </button>
          )}
      </div>

      <div className="mb-8">
        <div className={`flex items-center gap-2 text-violet-500 text-[10px] font-black uppercase tracking-[0.2em] mb-3 ${isArabic ? 'flex-row-reverse' : ''}`}>
          <span>{concept.domain}</span>
          <span className="text-slate-800">/</span>
          <span>{concept.category}</span>
        </div>
        <h1 className="text-4xl font-display font-black leading-tight text-white">{title}</h1>
      </div>

      <div className="glass rounded-[2rem] p-8 md:p-12 border border-slate-800/50 shadow-2xl relative">
        <div className="prose prose-invert prose-slate max-w-none">
          {lesson.split('\n').map((para, i) => (
            <p key={i} className="text-slate-300 leading-relaxed mb-6 text-xl font-light selection:bg-violet-500/30">
              {para}
            </p>
          ))}
        </div>

        {/* Advanced Resources */}
        {concept.advancedResources && concept.advancedResources.length > 0 && (
          <div className="mt-12 pt-12 border-t border-slate-800/50">
             <h4 className="text-[10px] font-display font-black tracking-widest uppercase text-emerald-400 mb-6">{uiLabels.deepResources}</h4>
             <div className="grid grid-cols-1 gap-3">
                {concept.advancedResources.map((res, idx) => (
                  <a 
                    key={idx} 
                    href={res.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 glass rounded-2xl border border-emerald-500/20 hover:border-emerald-500/50 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                       <span className="text-lg opacity-60 group-hover:opacity-100 transition-opacity">
                         {res.type === 'video' ? '📺' : res.type === 'paper' ? '🔬' : '📖'}
                       </span>
                       <span className="text-xs font-bold text-slate-300 group-hover:text-emerald-400 transition-colors">{res.title}</span>
                    </div>
                    <span className="text-xs text-slate-600">↗</span>
                  </a>
                ))}
             </div>
          </div>
        )}
        
        <div className="mt-12 flex flex-col items-center">
            <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-800 to-transparent mb-8"></div>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6 italic">{uiLabels.testReady}</p>
            <button
                onClick={onComplete}
                className="w-full py-5 rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-700 font-black text-[12px] uppercase tracking-[0.3em] neon-glow hover:scale-[1.02] active:scale-95 transition-all text-white shadow-xl shadow-violet-900/20"
            >
                {uiLabels.takeChallenge} (+{concept.xpReward} XP)
            </button>
        </div>
      </div>

      {concept.relatedConcepts && concept.relatedConcepts.length > 0 && (
          <div className="mt-12">
              <h3 className="text-[10px] font-display font-black tracking-widest uppercase text-slate-500 mb-6 px-2">{uiLabels.adjacentNodes}</h3>
              <div className="grid grid-cols-1 gap-3 px-2">
                  {concept.relatedConcepts.map((node) => (
                      <button 
                        key={node}
                        onClick={() => onStartLesson(node, concept.domain, false)}
                        className="glass rounded-2xl p-5 text-left border border-slate-800 hover:border-violet-500/30 transition-all flex justify-between items-center group"
                      >
                          <span className="text-xs font-bold text-slate-400 group-hover:text-violet-400 transition-colors">{node}</span>
                          <span className="text-slate-700 group-hover:text-violet-500 transition-colors">→</span>
                      </button>
                  ))}
              </div>
          </div>
      )}
    </div>
  );
};

export default LessonView;
