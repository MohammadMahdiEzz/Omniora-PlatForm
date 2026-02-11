
import React, { useEffect, useState } from 'react';
import { OmniNotification } from '../types';

interface NotificationOverlayProps {
  notification: OmniNotification | null;
  onAction: (payload?: any) => void;
  onDismiss: () => void;
  onSnooze: () => void;
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ 
  notification, onAction, onDismiss, onSnooze 
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setTimeout(() => setVisible(true), 100);
    } else {
      setVisible(false);
    }
  }, [notification]);

  if (!notification) return null;

  return (
    <div className={`fixed top-4 left-4 right-4 z-[100] transition-all duration-700 ease-out transform ${
      visible ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0'
    }`}>
      <div className="glass rounded-3xl border-2 border-violet-500/40 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-violet-500/10 blur-[40px] rounded-full group-hover:bg-violet-500/20 transition-all"></div>
        
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center text-xl shadow-lg shadow-violet-900/40">
            {notification.type === 'streak' ? '⚡' : 
             notification.type === 'lesson' ? '🧠' : 
             notification.type === 'milestone' ? '🏆' : '✨'}
          </div>
          
          <div className="flex-1">
            <h4 className="text-sm font-display font-black text-white uppercase tracking-widest">{notification.title}</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">{notification.message}</p>
          </div>
          
          <button onClick={onDismiss} className="text-slate-600 hover:text-white transition-colors">
             <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>
        
        <div className="flex gap-2 mt-5">
           <button 
             onClick={() => onAction(notification.payload)}
             className="flex-1 py-2.5 bg-violet-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-violet-500 transition-all neon-glow"
           >
             {notification.actionLabel || 'Sync Now'}
           </button>
           <button 
             onClick={onSnooze}
             className="px-4 py-2.5 bg-slate-800/50 text-slate-400 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-700 transition-all"
           >
             Snooze
           </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationOverlay;
