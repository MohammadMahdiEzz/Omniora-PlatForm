
import React, { useState, useEffect, useCallback } from 'react';
import Navigation from './components/Navigation';
import NotificationOverlay from './components/NotificationOverlay';
import Home from './views/Home';
import Explore from './views/Explore';
import Profile from './views/Profile';
import Admin from './views/Admin';
import LessonView from './views/LessonView';
import QuizView from './views/QuizView';
import { UserProfile, Concept, DomainType, OmniNotification } from './types';
import { getUser, addXP, updateMastery, checkStreak, logActivity, markNotificationSent } from './services/dbService';
import { generateConcept, getDailyRecommendation, generateNeuralAlert } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState<UserProfile>(getUser());
  const [currentConcept, setCurrentConcept] = useState<Concept | null>(null);
  const [appState, setAppState] = useState<'idle' | 'loading' | 'lesson' | 'quiz' | 'result'>('idle');
  const [lastQuizScore, setLastQuizScore] = useState(0);
  const [isExtendedMode, setIsExtendedMode] = useState(false);
  const [activeNotification, setActiveNotification] = useState<OmniNotification | null>(null);

  useEffect(() => {
    checkStreak();
    const updatedUser = getUser();
    setUser(updatedUser);

    const checkDailyAlert = async () => {
      const today = new Date().toISOString().split('T')[0];
      if (updatedUser.notificationsEnabled && updatedUser.lastNotificationDate !== today) {
        try {
          const rec = await getDailyRecommendation(updatedUser);
          const alert = await generateNeuralAlert(updatedUser, rec);
          
          setActiveNotification({
            id: 'daily-' + Date.now(),
            type: 'lesson',
            title: alert.title,
            message: alert.message,
            actionLabel: 'Capture Essence',
            payload: { topic: rec.topic, domain: rec.domain },
            timestamp: new Date().toISOString()
          });
          markNotificationSent();
        } catch (e) {
          console.error("Neural Herald failed to broadcast", e);
        }
      }
    };
    
    const timer = setTimeout(checkDailyAlert, 3000);
    return () => clearTimeout(timer);
  }, []);

  const refreshUser = () => setUser(getUser());

  const handleStartLesson = useCallback(async (topic: string, domain: DomainType, extended: boolean = false) => {
    setAppState('loading');
    setIsExtendedMode(extended);
    setActiveNotification(null);
    try {
      const concept = await generateConcept(domain, topic, extended);
      setCurrentConcept(concept);
      setAppState('lesson');
    } catch (e) {
      console.error(e);
      setAppState('idle');
    }
  }, []);

  const handleFinishQuiz = (score: number) => {
    setLastQuizScore(score);
    if (currentConcept) {
      const baseXP = Math.floor((score / currentConcept.quiz.length) * currentConcept.xpReward);
      addXP(baseXP);
      updateMastery(currentConcept.domain, currentConcept.category, currentConcept.topic, 15);
      logActivity({
        conceptTitle: user.language === 'ar' ? currentConcept.title_ar : currentConcept.title_en,
        domain: currentConcept.domain,
        score,
        maxScore: currentConcept.quiz.length,
        xpEarned: baseXP
      });
      refreshUser();
    }
    setAppState('result');
  };

  const renderContent = () => {
    if (appState === 'loading') return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 space-y-6 animate-pulse w-full">
        <div className="relative">
            <div className="w-20 h-20 border-4 border-violet-500/20 rounded-full"></div>
            <div className="absolute inset-0 w-20 h-20 border-4 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <div className="text-center">
            <h2 className="text-xl font-display font-bold text-white tracking-widest uppercase">Synthesizing</h2>
            <p className="text-slate-500 text-xs mt-2 font-mono">Accessing Neural Knowledge Lattice...</p>
        </div>
      </div>
    );

    if (appState === 'lesson' && currentConcept) return (
      <div className="max-w-6xl mx-auto w-full">
        <LessonView 
          concept={currentConcept} 
          onComplete={() => setAppState('quiz')} 
          onBack={() => setAppState('idle')}
          onStartLesson={handleStartLesson}
          initialExtended={isExtendedMode}
          language={user.language}
        />
      </div>
    );

    if (appState === 'quiz' && currentConcept) return (
      <div className="max-w-2xl mx-auto w-full">
        <QuizView concept={currentConcept} onFinish={handleFinishQuiz} language={user.language} />
      </div>
    );

    if (appState === 'result') return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in zoom-in duration-500 w-full">
        <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-4xl mb-6 neon-glow">✓</div>
        <h2 className="text-3xl font-display font-bold mb-2">Transfer Successful</h2>
        <p className="text-slate-400 text-sm mb-12">Neural patterns have been updated.</p>
        <button 
            onClick={() => setAppState('idle')} 
            className="w-full max-w-xs py-4 bg-violet-600 text-white rounded-2xl font-bold uppercase tracking-[0.2em] shadow-lg shadow-violet-900/30 active:scale-95 transition-all"
        >
            Return to Nexus
        </button>
      </div>
    );

    switch (activeTab) {
      case 'home': return <Home user={user} onStartLesson={handleStartLesson} onExplore={() => setActiveTab('explore')} />;
      case 'explore': return <Explore onStartLesson={handleStartLesson} />;
      case 'profile': return <Profile user={user} onUpdate={refreshUser} />;
      case 'admin': return <Admin />;
      default: return <Home user={user} onStartLesson={handleStartLesson} onExplore={() => setActiveTab('explore')} />;
    }
  };

  return (
    <div className={`flex flex-col lg:flex-row min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden ${user.language === 'ar' ? 'lg:flex-row-reverse' : ''}`} dir={user.language === 'ar' ? 'rtl' : 'ltr'}>
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none -z-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-violet-900/10 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* Navigation Layer */}
      {appState === 'idle' && (
        <Navigation currentTab={activeTab} setTab={setActiveTab} language={user.language} />
      )}

      {/* Main Content Area */}
      <div className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${appState === 'idle' ? 'lg:pl-64' : ''} ${user.language === 'ar' && appState === 'idle' ? 'lg:pl-0 lg:pr-64' : ''}`}>
        
        {/* Universal Top Header */}
        <header className="flex justify-between items-center py-6 px-6 lg:px-12 sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-lg border-b border-slate-800/50">
          <div className="font-display font-black text-2xl lg:text-3xl tracking-tighter text-white">
              OMNI<span className="text-violet-500">ORA</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex flex-col items-end mr-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Neural Sync Status</span>
              <span className="text-[10px] font-mono text-emerald-400">Stable Layer 7</span>
            </div>
            <div className="glass px-6 py-2.5 rounded-full text-xs font-black border-violet-500/30 flex items-center gap-3 shadow-lg shadow-violet-900/10">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse"></span>
                {user.xp.toLocaleString()} <span className="text-violet-400">XP</span>
            </div>
          </div>
        </header>

        {/* Global Notification Overlay */}
        <NotificationOverlay 
          notification={activeNotification} 
          onAction={(payload) => {
            if (payload?.topic) handleStartLesson(payload.topic, payload.domain);
            setActiveNotification(null);
          }}
          onDismiss={() => setActiveNotification(null)}
          onSnooze={() => setActiveNotification(null)}
        />

        {/* Actual Dynamic View */}
        <main className={`relative z-10 p-4 lg:p-12 w-full max-w-[1600px] mx-auto`}>
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
