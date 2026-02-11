
import React, { useState, useMemo } from 'react';
import { Concept, LocalizedQuizQuestion, AppLanguage } from '../types';

interface QuizViewProps {
  concept: Concept;
  onFinish: (score: number) => void;
  language: AppLanguage;
}

const QuizView: React.FC<QuizViewProps> = ({ concept, onFinish, language }) => {
  const isArabic = language === 'ar';
  
  const shuffledQuestions = useMemo(() => {
    return [...concept.quiz].sort(() => Math.random() - 0.5);
  }, [concept.quiz]);

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = shuffledQuestions[currentIdx];

  const uiLabels = {
    title: isArabic ? 'مرحلة التحقق العصبي' : 'Phase: Neural Validation',
    module: isArabic ? 'الوحدة' : 'MODULE',
    vector: isArabic ? 'ناقل' : 'Vector',
    correct: isArabic ? 'صحيح' : 'Correct',
    context: isArabic ? 'السياق العصبي' : 'Neural Context',
    confirm: isArabic ? 'تأكيد المسار' : 'Confirm Alignment',
    next: isArabic ? 'الناقل التالي' : 'Next Transmission',
    finalize: isArabic ? 'إنهاء المزامنة' : 'Finalize Synthesis'
  };

  const questionText = isArabic ? currentQuestion.question_ar : currentQuestion.question_en;
  const options = isArabic ? currentQuestion.options_ar : currentQuestion.options_en;
  const explanation = isArabic ? currentQuestion.explanation_ar : currentQuestion.explanation_en;

  const handleNext = () => {
    const wasCorrect = selectedIdx === currentQuestion.correctAnswer;
    const currentScore = wasCorrect ? score + 1 : score;
    if (wasCorrect) setScore(currentScore);
    
    if (currentIdx < shuffledQuestions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedIdx(null);
      setIsAnswered(false);
    } else {
      onFinish(currentScore);
    }
  };

  return (
    <div className={`min-h-screen pb-32 animate-in zoom-in-95 duration-300 ${isArabic ? 'text-right' : 'text-left'}`} dir={isArabic ? 'rtl' : 'ltr'}>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-slate-400 text-[10px] font-bold tracking-[0.3em] uppercase">{uiLabels.title}</h2>
          <div className="text-[10px] text-violet-400 font-mono mt-1">{uiLabels.module}: {(isArabic ? concept.title_ar : concept.title_en).toUpperCase()}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-bold text-slate-500 uppercase">{uiLabels.vector} {currentIdx + 1} / {shuffledQuestions.length}</div>
          <div className="text-[8px] text-emerald-500 font-bold uppercase mt-0.5">{uiLabels.correct}: {score}</div>
        </div>
      </div>

      <div className="w-full h-1 bg-slate-900 rounded-full mb-12 overflow-hidden border border-slate-800">
        <div className="h-full bg-gradient-to-r from-violet-600 to-indigo-500 transition-all duration-700 ease-out" style={{ width: `${((currentIdx + 1) / shuffledQuestions.length) * 100}%` }}></div>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8 relative flex flex-col border-b-4 border-slate-800/50 min-h-[450px]">
        <h3 className="text-xl font-display font-bold mb-8 text-slate-100">{questionText}</h3>

        <div className="space-y-4 flex-grow">
          {options.map((option, idx) => (
            <button
              key={idx}
              disabled={isAnswered}
              onClick={() => setSelectedIdx(idx)}
              className={`w-full p-5 rounded-2xl border-2 text-left transition-all duration-300 flex items-center gap-4 ${
                isAnswered 
                  ? (idx === currentQuestion.correctAnswer ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400 font-bold' : (selectedIdx === idx ? 'border-rose-500/50 bg-rose-500/10 text-rose-400' : 'border-slate-800 bg-slate-900/40 text-slate-500'))
                  : (selectedIdx === idx ? 'border-violet-500 bg-violet-500/10 text-white font-bold' : 'border-slate-800 bg-slate-900/40 text-slate-400 group')
              }`}
            >
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 font-mono text-[10px] ${selectedIdx === idx ? 'bg-violet-500 border-violet-400 text-white' : 'border-slate-700 text-slate-600'}`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="text-sm tracking-wide">{option}</span>
            </button>
          ))}
        </div>

        {isAnswered && (
            <div className="mt-8 p-5 bg-slate-950/60 rounded-2xl border border-slate-800 text-[11px] leading-relaxed text-slate-400">
                <div className="flex items-center gap-2 mb-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse"></span>
                    <span className="font-bold text-slate-200 uppercase tracking-widest text-[9px]">{uiLabels.context}</span>
                </div>
                {explanation}
            </div>
        )}

        <button
          onClick={() => { if (!isAnswered) setIsAnswered(true); else handleNext(); }}
          disabled={selectedIdx === null}
          className={`mt-10 w-full py-4 rounded-2xl font-bold text-xs uppercase tracking-[0.2em] transition-all ${
            selectedIdx === null ? 'bg-slate-900 text-slate-700 border-slate-800' : 'bg-violet-600 text-white neon-glow'
          }`}
        >
          {isAnswered ? (currentIdx === shuffledQuestions.length - 1 ? uiLabels.finalize : uiLabels.next) : uiLabels.confirm}
        </button>
      </div>
    </div>
  );
};

export default QuizView;
