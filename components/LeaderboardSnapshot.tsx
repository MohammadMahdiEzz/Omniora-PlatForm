
import React from 'react';
import { UserProfile } from '../types';

interface LeaderboardSnapshotProps {
  user: UserProfile;
}

const MOCK_RIVALS = [
  { name: 'Xenon-4', xp: 45200, rank: 1 },
  { name: 'Aether_9', xp: 42100, rank: 2 },
  { name: 'NovaSync', xp: 38500, rank: 3 },
];

const LeaderboardSnapshot: React.FC<LeaderboardSnapshotProps> = ({ user }) => {
  const isArabic = user.language === 'ar';
  
  return (
    <div className="glass rounded-3xl p-6 border border-slate-800/50">
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-[10px] font-display font-black tracking-widest uppercase text-slate-400">
          {isArabic ? 'متصدرين النظام' : 'Neural Leaderboard'}
        </h3>
        <span className="text-[8px] font-bold text-violet-400 uppercase bg-violet-400/10 px-2 py-0.5 rounded">
          {isArabic ? 'المرتبة 142' : 'Global Rank #142'}
        </span>
      </div>

      <div className="space-y-3">
        {MOCK_RIVALS.map((rival) => (
          <div key={rival.name} className="flex items-center justify-between group">
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-600 w-4">{rival.rank}</span>
              <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-xs grayscale group-hover:grayscale-0 transition-all">
                👤
              </div>
              <span className="text-xs font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{rival.name}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500">{rival.xp.toLocaleString()} XP</span>
          </div>
        ))}

        {/* User Row */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800/50">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-violet-500 w-4">142</span>
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-xs neon-glow">
              🧠
            </div>
            <span className="text-xs font-black text-white">{user.username} (You)</span>
          </div>
          <span className="text-[10px] font-mono text-violet-400 font-bold">{user.xp.toLocaleString()} XP</span>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardSnapshot;
